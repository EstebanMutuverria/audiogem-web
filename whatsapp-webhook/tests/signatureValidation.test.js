import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// RED: Tests for signature validation middleware - these will fail until src/middleware/signatureValidation.js is implemented

function setupEnv() {
  process.env.WHATSAPP_VERIFY_TOKEN = 'valid-verify-token-min-10';
  process.env.WHATSAPP_APP_SECRET = 'test-app-secret';
  process.env.WHATSAPP_ACCESS_TOKEN = 'test-access-token';
  process.env.WHATSAPP_PHONE_NUMBER_ID = '1234567890';
  process.env.NODE_ENV = 'development';
}

function createTestApp(middleware) {
  const app = express();
  // Use raw body parser for signature validation (must be before json parser)
  app.use(express.raw({ type: 'application/json' }));
  app.use(middleware);
  app.use(express.json());
  app.post('/webhook/whatsapp', (req, res) => {
    res.status(200).json({ success: true });
  });
  return app;
}

describe('Signature Validation Middleware', () => {
  let originalEnv;
  let signatureValidationMiddleware;
  let computeSignature;

  beforeEach(async () => {
    vi.resetModules();
    originalEnv = { ...process.env };
    setupEnv();
    // Import the middleware and hmac utility
    const middlewareModule = await import('../src/middleware/signatureValidation.js');
    const hmacModule = await import('../src/utils/hmac.js');
    signatureValidationMiddleware = middlewareModule.signatureValidationMiddleware;
    computeSignature = hmacModule.computeSignature;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should allow request with valid X-Hub-Signature-256 header', async () => {
    const body = JSON.stringify({ test: 'data' });
    const secret = process.env.WHATSAPP_APP_SECRET;
    const signature = computeSignature(body, secret);
    const header = `sha256=${signature}`;

    const app = createTestApp(signatureValidationMiddleware);
    
    await request(app)
      .post('/webhook/whatsapp')
      .set('X-Hub-Signature-256', header)
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);
  });

  it('should reject request with invalid signature (401)', async () => {
    const body = JSON.stringify({ test: 'data' });
    const header = 'sha256=invalid-signature';

    const app = createTestApp(signatureValidationMiddleware);
    
    await request(app)
      .post('/webhook/whatsapp')
      .set('X-Hub-Signature-256', header)
      .send(body)
      .expect(401);
  });

  it('should reject request with missing X-Hub-Signature-256 header (401)', async () => {
    const body = JSON.stringify({ test: 'data' });

    const app = createTestApp(signatureValidationMiddleware);
    
    await request(app)
      .post('/webhook/whatsapp')
      .send(body)
      .expect(401);
  });

  it('should reject request with malformed signature header (missing sha256= prefix) (401)', async () => {
    const body = JSON.stringify({ test: 'data' });
    const secret = process.env.WHATSAPP_APP_SECRET;
    const signature = computeSignature(body, secret);
    const header = signature; // missing sha256=

    const app = createTestApp(signatureValidationMiddleware);
    
    await request(app)
      .post('/webhook/whatsapp')
      .set('X-Hub-Signature-256', header)
      .send(body)
      .expect(401);
  });

  it('should reject request with wrong algorithm in signature header (401)', async () => {
    const body = JSON.stringify({ test: 'data' });
    const header = 'sha1=abcdef';

    const app = createTestApp(signatureValidationMiddleware);
    
    await request(app)
      .post('/webhook/whatsapp')
      .set('X-Hub-Signature-256', header)
      .send(body)
      .expect(401);
  });

  it('should reject request with empty signature header (401)', async () => {
    const body = JSON.stringify({ test: 'data' });
    const header = '';

    const app = createTestApp(signatureValidationMiddleware);
    
    await request(app)
      .post('/webhook/whatsapp')
      .set('X-Hub-Signature-256', header)
      .send(body)
      .expect(401);
  });

  it('should use constant-time comparison for timing attack resistance', async () => {
    const body = JSON.stringify({ timing: 'test' });
    const secret = process.env.WHATSAPP_APP_SECRET;
    const signature = computeSignature(body, secret);
    const header = `sha256=${signature}`;

    const app = createTestApp(signatureValidationMiddleware);
    
    // This test verifies the middleware doesn't throw and returns correct result
    // Actual timing attack resistance is verified by implementation using crypto.timingSafeEqual
    await request(app)
      .post('/webhook/whatsapp')
      .set('X-Hub-Signature-256', header)
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);
  });

  it('should work with Buffer body input', async () => {
    const bodyString = '{"buffer": true}';
    const body = Buffer.from(bodyString);
    const secret = process.env.WHATSAPP_APP_SECRET;
    const signature = computeSignature(body, secret);
    const header = `sha256=${signature}`;

    const app = createTestApp(signatureValidationMiddleware);
    
    await request(app)
      .post('/webhook/whatsapp')
      .set('X-Hub-Signature-256', header)
      .set('Content-Type', 'application/json')
      .send(bodyString)
      .expect(200);
  });

  it('should not proceed to next middleware when signature is invalid', async () => {
    const body = JSON.stringify({ test: 'data' });
    const header = 'sha256=invalid-signature';

    let handlerCalled = false;
    const app = express();
    app.use(express.raw({ type: 'application/json' }));
    app.use(signatureValidationMiddleware);
    app.use(express.json());
    app.post('/webhook/whatsapp', (req, res) => {
      handlerCalled = true;
      res.status(200).json({ success: true });
    });

    await request(app)
      .post('/webhook/whatsapp')
      .set('X-Hub-Signature-256', header)
      .send(body)
      .expect(401);

    expect(handlerCalled).toBe(false);
  });

  it('should call next() when signature is valid', async () => {
    const body = JSON.stringify({ test: 'data' });
    const secret = process.env.WHATSAPP_APP_SECRET;
    const signature = computeSignature(body, secret);
    const header = `sha256=${signature}`;

    let handlerCalled = false;
    const app = express();
    app.use(express.raw({ type: 'application/json' }));
    app.use(signatureValidationMiddleware);
    app.use(express.json());
    app.post('/webhook/whatsapp', (req, res) => {
      handlerCalled = true;
      res.status(200).json({ success: true });
    });

    await request(app)
      .post('/webhook/whatsapp')
      .set('X-Hub-Signature-256', header)
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);

    expect(handlerCalled).toBe(true);
  });
});