# Exploration: WhatsApp Business API Integration for AudioGem

## Current State

The AudioGem web app (React 19, Vite 7, Clean Architecture MVC) has **three click-to-chat WhatsApp anchors** that generate prefilled messages:

| Source | Prefilled Message | Trigger |
|--------|-------------------|---------|
| `FloatingWhatsApp.jsx` | `Hola AudioGem! Quiero realizar una consulta.` | Floating button (all pages) |
| `utils/whatsapp.js` → `ProductCard.jsx` | `Hola AudioGem! Te queria consultar acerca del producto: {name}` | "Consultar" button on product cards |
| `CartDrawer.jsx` | `*Pedido de AudioGem* 🛒\n--------------------------------\n¡Hola! Me gustaría realizar el siguiente pedido:\n\n• ...` | "Enviar pedido por WhatsApp" in cart |

All three share the **"AudioGem" brand marker** in the message text. No database/CRM exists yet — detection must be purely by **incoming message content analysis**.

---

## Affected Areas

- **New backend service needed** — Webhook endpoint (separate from React frontend)
- `src/constants/cartConfig.js` — Already centralizes `whatsappNumber` (shared config)
- `src/utils/whatsapp.js` — Message templates for product inquiries
- `src/components/layout/FloatingWhatsApp.jsx` — Generic inquiry template
- `src/components/layout/CartDrawer.jsx` — Cart order template

---

## Key Findings

### 1. Meta Cloud API Setup Requirements

| Requirement | Details |
|-------------|---------|
| **Business Manager** | Create Meta Business account, verify business identity |
| **Phone Number** | Register + verify a phone number (can use test number for dev) |
| **Webhook Configuration** | HTTPS endpoint + `VERIFY_TOKEN` (custom string) |
| **Permissions** | `whatsapp_business_management`, `whatsapp_business_messaging` |
| **App Review** | Not needed for dev/test; required for production > 5 test users |

### 2. Webhook Payload Structure (Incoming Text Message)

```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "id": "<WABA_ID>",
    "changes": [{
      "value": {
        "messaging_product": "whatsapp",
        "metadata": {
          "display_phone_number": "<BUSINESS_DISPLAY_NUMBER>",
          "phone_number_id": "<PHONE_NUMBER_ID>"
        },
        "contacts": [{
          "profile": { "name": "<USER_NAME>" },
          "wa_id": "<USER_PHONE_NUMBER>"
        }],
        "messages": [{
          "from": "<USER_PHONE_NUMBER>",
          "id": "wamid.<MESSAGE_ID>",
          "timestamp": "<UNIX_EPOCH_SECONDS>",
          "type": "text",
          "text": { "body": "<MESSAGE_TEXT>" }
        }]
      },
      "field": "messages"
    }]
  }]
}
```

**Key fields to inspect:**
- `entry[].changes[].value.messages[].text.body` → message content
- `entry[].changes[].value.messages[].from` → sender phone number
- `entry[].changes[].value.messages[].id` → unique message ID (for idempotency)
- `entry[].changes[].value.messages[].timestamp` → Unix epoch seconds

### 3. Response API (Send Text Message)

```
POST https://graph.facebook.com/v25.0/<PHONE_NUMBER_ID>/messages
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json

{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "<USER_PHONE_NUMBER>",
  "type": "text",
  "text": {
    "preview_url": false,
    "body": "Response message here"
  }
}
```

**Constraints:**
- **24-hour customer service window**: Starts when user messages; each user message resets timer
- After window closes → only pre-approved **template messages** allowed
- **Free tier**: 1,000 conversations/month (service conversations within window are free)

### 4. Detection Logic — Robust Prefix Matching

**Two pattern families to detect:**

| Family | Patterns | Normalization |
|--------|----------|---------------|
| **Greeting/Inquiry** | `Hola AudioGem! Quiero realizar una consulta.`<br>`Hola AudioGem! Te queria consultar acerca del producto:` | Case-insensitive, trim, normalize `´` → `'`, collapse whitespace |
| **Cart Order** | `*Pedido de AudioGem* 🛒` | Case-insensitive, trim, emoji-preserving (🛒 = U+1F6D2) |

**Recommended approach:**
```javascript
const normalize = (s) => s.trim().toLowerCase().replace(/´/g, "'").replace(/\s+/g, ' ');

const isGreetingInquiry = (text) => {
  const n = normalize(text);
  return n.startsWith('hola audiogem! quiero realizar una consulta.') ||
         n.startsWith('hola audiogem! te queria consultar acerca del producto:');
};

const isCartOrder = (text) => {
  const n = normalize(text);
  return n.startsWith('*pedido de audiogem* 🛒');
};
```

**Edge cases handled:**
- User edits prefilled text before sending
- Extra whitespace/newlines
- Smart quotes (`´` vs `'`)
- Emoji in cart order (🛒)

### 5. Idempotency / Deduplication

**Strategy: In-memory Set + periodic persistence to file**

| Approach | Pros | Cons |
|----------|------|------|
| **In-memory Set** | Simple, fast, zero deps | Lost on restart (acceptable for low-volume) |
| **File (JSON/SQLite)** | Survives restarts, no extra infra | File locking, I/O overhead |
| **Redis** | Scalable, shared across instances | Extra infrastructure, overkill for free tier |

**Recommendation:** Start with **in-memory `Set<string>`** storing processed `message.id` (wamid.*). Add file persistence later if restarts cause duplicate replies. Free tier (1000 conv/month) = ~33/day = negligible memory.

### 6. Deployment Options

| Environment | Option | Notes |
|-------------|--------|-------|
| **Local Dev** | `ngrok http 3000` | Free tier: random URL per session; paid: fixed subdomain |
| **Production** | **Railway** / **Render** / **Vercel** / **Cloudflare Workers** | All support Node.js webhooks; Cloudflare Workers = cheapest (free tier generous) |
| **Webhook URL** | Must be HTTPS; configure in Meta App Dashboard → WhatsApp → Configuration |

### 7. Security

| Layer | Implementation |
|-------|----------------|
| **Webhook Verification** | GET endpoint validates `hub.verify_token === process.env.VERIFY_TOKEN`, returns `hub.challenge` |
| **Signature Validation** | Verify `X-Hub-Signature-256` header: `HMAC-SHA256(payload, app_secret)` === header value |
| **Token Storage** | `.env` (local), platform secrets (Railway/Render/Vercel/CF Workers) — **never commit** |
| **Rate Limiting** | Optional: add per-IP/IP+phone rate limit on webhook endpoint |

### 8. Testing Strategy

| Level | Approach |
|-------|----------|
| **Unit Tests** | Test detection logic (`isGreetingInquiry`, `isCartOrder`) with variations: case, whitespace, edited text, emoji |
| **Integration Test** | Meta **test phone number** (from Developer Dashboard) → send real messages to webhook via ngrok |
| **Local Webhook Testing** | `ngrok` + manual curl POST with sample payloads; verify signature validation |
| **E2E** | Click "Consultar" on product → send message → verify auto-reply received |

---

## Approaches

### Approach 1: Minimal Node.js/Express Webhook Service (Recommended)

**Structure:**
```
/webhook-server
  ├── src/
  │   ├── index.js           # Express app, webhook routes
  │   ├── verify.js          # GET /webhook verification
  │   ├── receive.js         # POST /webhook handler
  │   ├── detect.js          # Message pattern detection
  │   ├── reply.js           # Send response via Graph API
  │   ├── idempotency.js     # In-memory Set + optional file sync
  │   └── config.js          # Env validation
  ├── package.json
  └── .env.example
```

**Pros:**
- Separation of concerns (frontend stays pure React)
- Simple deployment (single Node.js service)
- Full control over webhook logic
- Easy to test locally with ngrok

**Cons:**
- Separate repo/deployment from frontend
- Need to manage Node.js runtime

**Effort:** Medium

---

### Approach 2: Vercel/Cloudflare Workers Serverless Functions

**Structure:**
```
/api
  ├── webhook.js      # GET + POST handler
  ├── detect.js       # Shared detection logic
  └── reply.js        # Send response
```

**Pros:**
- Zero infrastructure management
- Auto-scales, cheap/free tier
- Can share repo with frontend (monorepo)

**Cons:**
- Cold starts (adds latency)
- Payload size limits (CF Workers: 100KB)
- Less control over runtime
- Signature validation needs crypto polyfill on Edge

**Effort:** Medium-High (Edge runtime quirks)

---

### Approach 3: Embedded in React App (Vite Plugin / Custom Server)

**Pros:** Single deployment

**Cons:** Not recommended — webhook needs 24/7 uptime; Vite dev server not suitable for production webhooks

**Effort:** Low but **architecturally wrong**

---

## Recommendation

**Approach 1 (Node.js/Express)** — Best balance of simplicity, control, and maintainability.

**Architecture:**
```
┌─────────────────┐     HTTPS POST      ┌──────────────────┐
│  WhatsApp User  │ ─────────────────▶  │  Meta Cloud API  │
└─────────────────┘                     └────────┬─────────┘
                                                 │ Webhook
                                                 ▼
┌─────────────────┐     Auto-reply        ┌──────────────────┐
│  WhatsApp User  │ ◀──────────────────   │  Webhook Server  │
└─────────────────┘   (within 24h)        │  (Node/Express)  │
                                            └──────────────────┘
```

**File Structure (new):**
```
web-audiogem/
├── webhook-server/          # New: separate Node.js service
│   ├── src/
│   │   ├── index.js
│   │   ├── verify.js
│   │   ├── receive.js
│   │   ├── detect.js
│   │   ├── reply.js
│   │   ├── idempotency.js
│   │   └── config.js
│   ├── package.json
│   └── .env.example
└── src/                     # Existing React app (unchanged)
```

**Libraries to add:**
- `express` — webhook server
- `crypto` (built-in) — HMAC-SHA256 validation
- `dotenv` — env loading (already in frontend)
- `axios` or native `fetch` — Graph API calls

---

## Risks / Unknowns

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Meta policy changes** | Breaking API changes | Pin Graph API version (v25.0); monitor changelog |
| **Webhook delivery failures** | Missed messages | Meta retries with exponential backoff; log failures |
| **24-hour window expiry** | Can't send free replies | Clear user messaging: "Respondemos en 24h"; template fallback later |
| **Free tier exhaustion** | Blocked conversations | Monitor analytics; upgrade when needed |
| **Signature validation failures** | Security false negatives | Log raw payload + header for debugging; test thoroughly |
| **Phone number verification delay** | Can't go live | Use test number for dev; start verification early |

---

## Concrete Next Steps for Proposal Phase

1. **Create SDD Proposal** with:
   - Scope: Webhook server only (frontend unchanged)
   - Detection logic spec (exact patterns, normalization rules)
   - Response templates (Spanish, branded, helpful)
   - Idempotency design (in-memory + file sync)
   - Deployment target (Railway recommended for simplicity)
   - Security requirements (VERIFY_TOKEN, X-Hub-Signature-256)

2. **Define Delta Specs** for:
   - `webhook/verify` — GET endpoint contract
   - `webhook/receive` — POST payload handling, detection, reply
   - `webhook/security` — signature validation
   - `webhook/idempotency` — deduplication logic

3. **Design Tasks:**
   - Scaffold Express project with TypeScript
   - Implement verification endpoint
   - Implement receive + detection + reply
   - Add idempotency layer
   - Write unit tests for detection
   - Integration test with Meta test number + ngrok
   - Deploy to Railway (staging)
   - Configure production webhook URL in Meta Dashboard

4. **Environment Variables to Define:**
   - `VERIFY_TOKEN` — custom string for webhook verification
   - `META_APP_SECRET` — for X-Hub-Signature-256 validation
   - `WHATSAPP_ACCESS_TOKEN` — permanent token (or refresh logic)
   - `PHONE_NUMBER_ID` — from Meta Dashboard
   - `WABA_ID` — WhatsApp Business Account ID

---

## Ready for Proposal

**Yes.** Exploration complete. The orchestrator should now launch the **sdd-propose** phase with the above findings to create a formal change proposal.