# Deployment Guide — WhatsApp Business API Webhook Service

This guide covers local development with ngrok and production deployment to multiple platforms.

---

## Local Development

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | Runtime |
| npm | 10+ | Package manager |
| ngrok | 3+ | Public HTTPS tunnel for Meta webhook |
| Meta Developer Account | — | WhatsApp Business API access |

### Step-by-Step Setup

#### 1. Clone & Install
```bash
cd whatsapp-webhook
npm install
```

#### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your Meta credentials (see below for how to get them)
```

#### 3. Start Development Server
```bash
npm run dev
# Server runs on http://localhost:3000
```

#### 4. Start ngrok Tunnel
```bash
# In a separate terminal
ngrok http 3000
```

**Output example:**
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:3000
```

Copy the **HTTPS** URL (e.g., `https://abc123.ngrok-free.app`).

#### 5. Configure Meta Webhook

1. Go to [Meta Developer Dashboard](https://developers.facebook.com/apps/)
2. Select your App → **WhatsApp** → **Configuration**
3. In **Webhook** section:
   - **Callback URL:** `https://abc123.ngrok-free.app/webhook/whatsapp`
   - **Verify Token:** Same as `WHATSAPP_VERIFY_TOKEN` in your `.env`
   - Click **Verify and Save**
4. Subscribe to **messages** field under **Webhook Fields**

#### 6. Test with curl

**Webhook Verification (GET):**
```bash
curl "https://abc123.ngrok-free.app/webhook/whatsapp?hub.mode=subscribe&hub.challenge=test123&hub.verify_token=your-verify-token-min-10-chars"
# Expected: test123 (plain text)
```

**Incoming Message (POST) — Trigger Match:**
```bash
curl -X POST https://abc123.ngrok-free.app/webhook/whatsapp \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=$(echo -n '{"entry":[{"changes":[{"value":{"messages":[{"id":"wamid.test123","from":"5491123456789","type":"text","text":{"body":"hola audiogem! test"}}]}}]}]}' | openssl dgst -sha256 -hmac "your-app-secret-from-meta" -binary | xxd -p -c 256)" \
  -d '{"entry":[{"changes":[{"value":{"messages":[{"id":"wamid.test123","from":"5491123456789","type":"text","text":{"body":"hola audiogem! test"}}]}}]}]}'
# Expected: {"success":true,"processed":true}
```

**Incoming Message (POST) — No Trigger:**
```bash
curl -X POST https://abc123.ngrok-free.app/webhook/whatsapp \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=$(echo -n '{"entry":[{"changes":[{"value":{"messages":[{"id":"wamid.test456","from":"5491123456789","type":"text","text":{"body":"random message"}}]}}]}]}' | openssl dgst -sha256 -hmac "your-app-secret-from-meta" -binary | xxd -p -c 256)" \
  -d '{"entry":[{"changes":[{"value":{"messages":[{"id":"wamid.test456","from":"5491123456789","type":"text","text":{"body":"random message"}}]}}]}]}'
# Expected: {"success":true,"processed":false}
```

**Health Check:**
```bash
curl https://abc123.ngrok-free.app/health
# Expected: {"status":"ok"}
```

---

## Production Deployment

### Environment Variables (All Platforms)

Set these in your platform's dashboard/environment settings:

| Variable | Value Source |
|----------|--------------|
| `WHATSAPP_VERIFY_TOKEN` | Your chosen token (min 10 chars) |
| `WHATSAPP_APP_SECRET` | Meta App Dashboard → Settings → Basic → App Secret |
| `WHATSAPP_ACCESS_TOKEN` | Meta Business Manager → WhatsApp → API Setup → Access Token |
| `WHATSAPP_PHONE_NUMBER_ID` | Meta Business Manager → WhatsApp → API Setup → Phone Number ID |
| `PORT` | Platform-assigned (usually auto-set, e.g., `PORT=8080` on Railway) |
| `NODE_ENV` | `production` |
| `AUTO_REPLY_TEXT` | Optional custom reply |

---

### Option A: Railway

1. **Create Project**
   - Go to [Railway](https://railway.app/) → New Project → Deploy from GitHub
   - Select this repository

2. **Configure Service**
   - Root Directory: `whatsapp-webhook`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables**
   - Add all 7 variables in **Variables** tab
   - Railway auto-sets `PORT` — do not override

4. **Deploy & Get URL**
   - Deployment auto-starts on push to main
   - Copy the generated URL: `https://your-app.up.railway.app`

5. **Configure Meta Webhook**
   - Callback URL: `https://your-app.up.railway.app/webhook/whatsapp`
   - Verify Token: Your `WHATSAPP_VERIFY_TOKEN`

6. **Health Check** (optional but recommended)
   - Railway uses `/health` automatically if it returns 200

---

### Option B: Render

1. **Create Web Service**
   - Go to [Render](https://render.com/) → New → Web Service
   - Connect GitHub repository

2. **Configure**
   - **Root Directory:** `whatsapp-webhook`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Node Version:** 20 (add `.nvmrc` with `20` or set in Render dashboard)

3. **Environment Variables**
   - Add all 7 variables in **Environment** tab
   - Render sets `PORT` automatically

4. **Deploy**
   - Auto-deploys on push to main
   - URL format: `https://your-app.onrender.com`

5. **Configure Meta Webhook**
   - Callback URL: `https://your-app.onrender.com/webhook/whatsapp`

---

### Option C: Vercel

> **Note:** Vercel is serverless. The in-memory idempotency store will reset on each cold start. For production with idempotency guarantees, use Railway/Render/CF Workers with persistent storage, or add Redis.

1. **Create Project**
   - Go to [Vercel](https://vercel.com/) → Add New Project → Import Git Repository

2. **Configure**
   - **Framework Preset:** Other
   - **Root Directory:** `whatsapp-webhook`
   - **Build Command:** `npm install`
   - **Output Directory:** (leave empty)
   - **Install Command:** `npm install`
   - **Dev Command:** `npm run dev`

3. **Add `vercel.json`** (create in `whatsapp-webhook/`):
   ```json
   {
     "buildCommand": "npm install",
     "devCommand": "npm run dev",
     "installCommand": "npm install",
     "framework": null,
     "regions": ["iad1"],
     "functions": {
       "src/index.js": {
         "maxDuration": 30
       }
     }
   }
   ```

4. **Environment Variables**
   - Add all 7 variables in **Settings** → **Environment Variables**
   - Vercel ignores `PORT` (uses dynamic ports)

5. **Deploy**
   - URL format: `https://your-app.vercel.app`

6. **Configure Meta Webhook**
   - Callback URL: `https://your-app.vercel.app/webhook/whatsapp`

---

### Option D: Cloudflare Workers

> **Note:** Requires code adaptation for Workers runtime (no Express). Use `@cloudflare/workers-oauth-provider` or Hono framework. Current Express-based code needs migration.

**Quick path (if staying with Express):**
1. Use **Cloudflare Pages Functions** with Node.js compatibility
2. Or deploy via **Cloudflare Workers + Service Bindings** after refactoring to Hono

**Recommended:** Use Railway or Render for simpler Express deployment.

---

## Meta Cloud API Configuration

### 1. Create Meta Business Account
- Go to [business.facebook.com](https://business.facebook.com/)
- Create Business Account if needed

### 2. Create Meta App
1. [Meta Developer Dashboard](https://developers.facebook.com/apps/) → **Create App**
2. Type: **Business** → **WhatsApp**
3. Fill in app name, business account

### 3. Configure WhatsApp Product
1. In App Dashboard → **WhatsApp** → **Getting Started**
2. **Phone Number:** Add/verify your business phone number
   - Meta sends verification code via SMS/call
3. **API Setup** section shows:
   - **Phone Number ID** → `WHATSAPP_PHONE_NUMBER_ID`
   - **Access Token** (temporary, expires in 24h) → `WHATSAPP_ACCESS_TOKEN`
   - Generate **Permanent Access Token** in Business Manager for production

### 4. Get App Secret
- App Dashboard → **Settings** → **Basic** → **App Secret** → Show
- Copy → `WHATSAPP_APP_SECRET`

### 5. Generate Permanent Access Token (Production)
1. Go to **Business Manager** → **WhatsApp Manager** → **API Setup**
2. Or use **System User** in Business Settings:
   - Business Settings → Users → System Users → Add
   - Assign **WhatsApp Business Management** admin access
   - Generate token with `whatsapp_business_messaging` permission
3. Token does not expire → use as `WHATSAPP_ACCESS_TOKEN`

### 6. Configure Webhook
1. App Dashboard → **WhatsApp** → **Configuration**
2. **Webhook** section:
   - **Callback URL:** Your production URL + `/webhook/whatsapp`
   - **Verify Token:** Your `WHATSAPP_VERIFY_TOKEN`
   - Click **Verify and Save**
3. **Webhook Fields:** Subscribe to **messages**

### 7. Test Production Webhook
```bash
# Replace with your production URL and verify token
curl "https://your-production-url.com/webhook/whatsapp?hub.mode=subscribe&hub.challenge=test123&hub.verify_token=your-verify-token-min-10-chars"
```

---

## Verification Checklist

### Pre-Deploy
- [ ] All 123 tests pass: `npm test`
- [ ] Coverage ≥ 80%: `npm run test:coverage`
- [ ] No `console.log`/`debugger` in source (startup logs in `index.js` are operational)
- [ ] `.env.example` has all 7 variables
- [ ] `.gitignore` excludes `.env`, `node_modules`, `dist`, `coverage`
- [ ] `package.json` has scripts: `dev`, `start`, `test`, `test:coverage`

### Post-Deploy
- [ ] Health check returns 200: `GET /health`
- [ ] Webhook verification works: `GET /webhook/whatsapp?...`
- [ ] POST webhook accepts valid signature
- [ ] POST webhook rejects invalid signature (401)
- [ ] Trigger message sends auto-reply
- [ ] Non-trigger message returns `processed: false`
- [ ] Duplicate message returns `duplicate: true`
- [ ] Meta webhook shows "Verified" in dashboard

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| `403 Forbidden` on GET | Wrong verify token | Match `WHATSAPP_VERIFY_TOKEN` exactly |
| `401 Invalid signature` | Wrong app secret | Use App Secret from Meta App → Settings → Basic |
| `400 Bad Request` | Malformed JSON | Ensure `Content-Type: application/json` |
| Auto-reply not sent | Invalid access token | Use permanent token from System User |
| `ECONNREFUSED` | Port mismatch | Platform sets `PORT` automatically; don't hardcode |
| ngrok URL changes | Free tier | Use `ngrok http --domain=your-domain.ngrok-free.app 3000` for stable URL |

---

## Security Notes

- **Never commit `.env`** — already in `.gitignore`
- **Rotate tokens** periodically in Meta dashboard
- **Use System User tokens** for production (not personal user tokens)
- **Monitor webhook failures** in Meta dashboard → WhatsApp → Webhook Delivery
- **Rate limits:** Meta allows 1000 webhook events/sec per phone number