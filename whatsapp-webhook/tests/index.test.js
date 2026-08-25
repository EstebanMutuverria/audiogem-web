import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// RED: Tests for entry point (index.js) - these will fail until src/index.js is implemented

function setupEnv() {
  process.env.WHATSAPP_VERIFY_TOKEN = 'valid-verify-token-min-10';
  process.env.WHATSAPP_APP_SECRET = 'test-app-secret';
  process.env.WHATSAPP_ACCESS_TOKEN = 'test-access-token';
  process.env.WHATSAPP_PHONE_NUMBER_ID = '1234567890';
  process.env.NODE_ENV = 'development';
  process.env.PORT = '3001'; // Use different port for testing
  process.env.AUTO_REPLY_TEXT = 'Test auto reply message';
}

function createValidWebhookPayload(messageId, textBody = 'Hola AudioGem! Test message', from = '15551234567') {
  return {
    entry: [{
      id: '123456',
      changes: [{
        value: {
          messaging_product: 'whatsapp',
          metadata: {
            display_phone_number: '15551234567',
            phone_number_id: '1234567890'
          },
          contacts: [{
            profile: { name: 'Test User' },
            wa_id: from
          }],
          messages: [{
            from,
            id: messageId,
            timestamp: Math.floor(Date.now() / 1000).toString(),
            text: { body: textBody },
            type: 'text'
          }]
        },
        field: 'messages'
      }]
    }]
  };
}

describe('Entry Point (src/index.js)', () => {
  let originalEnv;
  let createApp;
  let startServer;
  let server;

  beforeEach(async () => {
    vi.resetModules();
    originalEnv = { ...process.env };
    setupEnv();

    const indexModule = await import('../src/index.js');
    createApp = indexModule.createApp;
    startServer = indexModule.startServer;
  });

  afterEach(async () => {
    process.env = originalEnv;
    if (server) {
      await new Promise(resolve => server.close(resolve));
      server = null;
    }
  });

  it('should export createApp function', () => {
    expect(createApp).toBeDefined();
    expect(typeof createApp).toBe('function');
  });

  it('should export startServer function', () => {
    expect(startServer).toBeDefined();
    expect(typeof startServer).toBe('function');
  });

  it('should create Express app with correct middleware order', () => {
    const app = createApp();
    expect(app).toBeDefined();
    expect(typeof app.listen).toBe('function');
  });

  it('should handle raw body for webhook endpoint (signature validation works)', async () => {
    const { computeSignature } = await import('../src/utils/hmac.js');
    const app = createApp();
    
    const payload = createValidWebhookPayload('wamid.test123', 'Hola AudioGem! Test');
    const body = JSON.stringify(payload);
    const signature = computeSignature(body, process.env.WHATSAPP_APP_SECRET);
    const header = `sha256=${signature}`;
    
    // This test verifies the raw body parser is working for signature validation
    await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .set('X-Hub-Signature-256', header)
      .send(body)
      .expect(200);
  });

  it('should parse JSON for health check endpoint', async () => {
    const app = createApp();
    
    await request(app)
      .get('/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  it('should mount webhook routes (verified by endpoint behavior)', async () => {
    const { computeSignature } = await import('../src/utils/hmac.js');
    const app = createApp();
    
    // Test GET verification endpoint
    await request(app)
      .get('/webhook/whatsapp')
      .query({
        'hub.mode': 'subscribe',
        'hub.challenge': 'test-challenge-123',
        'hub.verify_token': process.env.WHATSAPP_VERIFY_TOKEN
      })
      .expect(200)
      .expect('test-challenge-123');
    
    // Test POST receive endpoint
    const payload = createValidWebhookPayload('wamid.test123', 'Hola AudioGem! Test');
    const body = JSON.stringify(payload);
    const signature = computeSignature(body, process.env.WHATSAPP_APP_SECRET);
    const header = `sha256=${signature}`;
    
    await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .set('X-Hub-Signature-256', header)
      .send(body)
      .expect(200);
  });

  it('should handle GET /webhook/whatsapp verification', async () => {
    const app = createApp();
    
    await request(app)
      .get('/webhook/whatsapp')
      .query({
        'hub.mode': 'subscribe',
        'hub.challenge': 'test-challenge-123',
        'hub.verify_token': process.env.WHATSAPP_VERIFY_TOKEN
      })
      .expect(200)
      .expect('test-challenge-123');
  });

  it('should handle POST /webhook/whatsapp with valid signature', async () => {
    const { computeSignature } = await import('../src/utils/hmac.js');
    const app = createApp();
    
    const payload = createValidWebhookPayload('wamid.test123', 'Hola AudioGem! Test');
    const body = JSON.stringify(payload);
    const signature = computeSignature(body, process.env.WHATSAPP_APP_SECRET);
    const header = `sha256=${signature}`;
    
    await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .set('X-Hub-Signature-256', header)
      .send(body)
      .expect(200)
      .expect({ success: true, processed: true });
  });

  it('should reject POST /webhook/whatsapp with invalid signature', async () => {
    const app = createApp();
    
    const payload = createValidWebhookPayload('wamid.test123', 'Hola AudioGem! Test');
    const body = JSON.stringify(payload);
    
    await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(401);
  });

  it('should start server on configured PORT', async () => {
    const port = parseInt(process.env.PORT, 10);
    server = await startServer();
    
    expect(server).toBeDefined();
    expect(typeof server.listen).toBe('function');
    
    // Test that server is actually listening
    await request(`http://localhost:${port}`)
      .get('/health')
      .expect(200);
  });

  it('should use PORT from environment or default to 3000', async () => {
    // Test with custom PORT
    process.env.PORT = '3002';
    vi.resetModules();
    const indexModule = await import('../src/index.js');
    const { startServer: startServerCustom } = indexModule;
    
    server = await startServerCustom();
    
    await request('http://localhost:3002')
      .get('/health')
      .expect(200);
  });
});