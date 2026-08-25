# WhatsApp Business API Webhook Service for AudioGem

A production-ready webhook service that integrates with Meta Cloud API (WhatsApp Business API) to receive incoming WhatsApp messages, detect web-origin triggers, and send automatic replies.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your Meta credentials

# 3. Run development server
npm run dev

# 4. Expose with ngrok (separate terminal)
ngrok http 3000

# 5. Configure Meta webhook URL to: https://your-ngrok-url.ngrok.io/webhook/whatsapp
```

## Architecture

This service follows **Clean Architecture MVC** with a middleware chain:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Express App                              │
├─────────────────────────────────────────────────────────────────┤
│  GET /health                 │  GET /webhook/whatsapp           │
│  → 200 {status: 'ok'}        │  → verifyController (verification)│
├─────────────────────────────────────────────────────────────────┤
│  POST /webhook/whatsapp                                               │
│  Middleware Chain:                                                  │
│  1. express.raw({type: 'application/json'})  ← Raw body capture  │
│  2. signatureValidationMiddleware             ← HMAC-SHA256 verify│
│  3. idempotencyMiddleware                     ← Deduplication    │
│  4. express.json()                            ← JSON parse       │
│  5. receiveController                         ← Business logic   │
└─────────────────────────────────────────────────────────────────┘
```

### Layer Structure

```
src/
├── index.js                    # Entry point, Express bootstrap
├── config/index.js             # Config validation, constants
├── routes/webhook.js           # Route definitions
├── controllers/
│   ├── verifyController.js     # GET /webhook/whatsapp (Meta verification)
│   └── receiveController.js    # POST /webhook/whatsapp (message handling)
├── middleware/
│   ├── signatureValidation.js  # X-Hub-Signature-256 validation
│   └── idempotency.js          # Message ID deduplication
├── services/
│   ├── detection.js            # Trigger phrase detection
│   ├── reply.js                # Meta Graph API auto-reply
│   └── idempotency.js          # In-memory deduplication store
└── utils/hmac.js               # HMAC-SHA256 + constant-time compare
```

## Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `WHATSAPP_VERIFY_TOKEN` | Yes | Webhook verification token (min 10 chars). Set in Meta Developer Dashboard. | — |
| `WHATSAPP_APP_SECRET` | Yes | App Secret from Meta App Dashboard → Settings → Basic. Used for HMAC-SHA256 signature validation. | — |
| `WHATSAPP_ACCESS_TOKEN` | Yes | Bearer token from Meta Business Manager → WhatsApp → API Setup. For sending messages via Graph API. | — |
| `WHATSAPP_PHONE_NUMBER_ID` | Yes | Numeric string ID from Meta Business Manager → WhatsApp → API Setup. | — |
| `PORT` | No | HTTP server port. | `3000` |
| `NODE_ENV` | No | Environment mode. | `development` |
| `AUTO_REPLY_TEXT` | No | Custom auto-reply message (Spanish default provided). | See below |

**Default Auto-Reply:**
```
Hola! 👋 Soy el asistente de AudioGem. Recibimos tu consulta y en breve te respondemos. ¡Gracias por escribirnos!
```

## API Endpoints

### GET /health
Health check endpoint for load balancers and monitoring.

**Response:** `200 OK`
```json
{ "status": "ok" }
```

### GET /webhook/whatsapp
Webhook verification endpoint for Meta Cloud API subscription.

**Query Parameters:**
| Parameter | Description |
|-----------|-------------|
| `hub.mode` | Must be `subscribe` |
| `hub.challenge` | Challenge string to echo back |
| `hub.verify_token` | Must match `WHATSAPP_VERIFY_TOKEN` |

**Responses:**
| Status | Condition |
|--------|-----------|
| `200` | Verification successful (returns challenge as plain text) |
| `403` | Invalid token, missing params, or mode ≠ subscribe |

### POST /webhook/whatsapp
Receives incoming WhatsApp messages from Meta Cloud API.

**Headers:**
| Header | Description |
|--------|-------------|
| `X-Hub-Signature-256` | HMAC-SHA256 signature (format: `sha256=<hex>`) |
| `Content-Type` | `application/json` |

**Request Body:** Meta WhatsApp webhook payload (see [Meta docs](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks)).

**Responses:**
| Status | Body | Condition |
|--------|------|-----------|
| `200` | `{success: true, processed: true}` | Trigger matched, auto-reply sent |
| `200` | `{success: true, processed: false}` | No trigger matched |
| `200` | `{success: true, duplicate: true}` | Duplicate message (idempotency) |
| `401` | `{error: "Invalid signature"}` | Signature validation failed |
| `400` | — | Malformed payload (still returns 200 per Meta requirements) |

> **Note:** Always returns `200 OK` quickly per Meta webhook requirements. Auto-reply is sent asynchronously (fire-and-forget).

## Detection Logic

The service detects "web-origin" messages by checking if the message text **starts with** (case-insensitive) one of two trigger prefixes:

| Prefix | Example Match |
|--------|---------------|
| `hola audiogem!` | "Hola AudioGem! Quiero info" ✓ |
| `pedido de audiogem 🛒` | "Pedido de AudioGem 🛒 Quiero comprar" ✓ |

### Implementation Details

```javascript
// src/services/detection.js
const TRIGGER_PREFIXES = [
  'hola audiogem!',
  'pedido de audiogem 🛒',
];

function normalizeText(text) {
  return text.trim().toLowerCase();
}

export function isWebOriginMessage(text) {
  const normalized = normalizeText(text);
  return TRIGGER_PREFIXES.some(prefix => normalized.startsWith(prefix));
}
```

### Behavior
- **Case-insensitive:** `HOLA AUDIOGEM!` ✓, `Hola AudioGem!` ✓
- **Whitespace trimmed:** `"  hola audiogem!  "` ✓
- **Emoji preserved:** The 🛒 emoji is part of the second prefix and must be present
- **Prefix match only:** Full text must *start with* prefix (not contains)
- **Non-text messages:** Ignored (images, audio, locations, etc.)
- **Empty/invalid input:** Returns `false`

## Auto-Reply

When a trigger is detected, the service sends an auto-reply via Meta Graph API:

**Endpoint:** `POST https://graph.facebook.com/v25.0/{PHONE_NUMBER_ID}/messages`

**Payload:**
```json
{
  "messaging_product": "whatsapp",
  "to": "<sender_phone_number>",
  "type": "text",
  "text": { "body": "<AUTO_REPLY_TEXT>" }
}
```

**Authentication:** `Authorization: Bearer <WHATSAPP_ACCESS_TOKEN>`

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage (must meet 80% thresholds)
npm run test:coverage

# Watch mode for development
npm run test:watch
```

**Test Suite:** 123 tests across 12 test files covering:
- Config validation
- HMAC-SHA256 signature computation & verification
- Trigger detection (prefixes, case, emoji, edge cases)
- Auto-reply service (success, error handling)
- Idempotency (deduplication, FIFO eviction, 10k limit)
- Signature validation middleware
- Idempotency middleware
- Verify controller (Meta handshake)
- Receive controller (parsing, detection, reply)
- Webhook routes (integration)
- Entry point (server startup)
- ngrok integration (local dev)

## Deployment Overview

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guides:

- **Local Development:** ngrok setup, Meta webhook configuration, curl test examples
- **Production:** Railway, Render, Vercel, Cloudflare Workers deployment steps
- **Meta Cloud API:** Business Manager setup, phone verification, webhook config, access tokens

## Security

- **Signature Validation:** All POST requests verified via HMAC-SHA256 with constant-time comparison
- **Verify Token:** GET verification uses shared secret (min 10 chars)
- **Idempotency:** Prevents duplicate processing of retried webhooks
- **No Secrets in Code:** All credentials via environment variables
- **Input Validation:** Defensive parsing of all webhook payloads

## Project Structure

```
whatsapp-webhook/
├── src/                    # Source code (ES modules)
├── tests/                  # Vitest test suite (123 tests)
├── coverage/               # Coverage reports (generated)
├── .env.example            # Environment template
├── .gitignore              # Excludes .env, node_modules, dist, coverage
├── package.json            # Scripts: dev, start, test, test:coverage
├── vitest.config.js        # Vitest + coverage config
├── README.md               # This file
└── DEPLOYMENT.md           # Deployment guide
```

## License

Private — AudioGem project.