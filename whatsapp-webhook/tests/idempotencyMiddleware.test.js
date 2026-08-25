import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import express from 'express';
import request from 'supertest';

// RED: Tests for idempotency middleware - these will fail until src/middleware/idempotency.js is implemented

// Import middleware and service once at module level to avoid vi.resetModules() coverage issues
let idempotencyMiddleware;
let checkAndMark;
let __resetForTesting;

beforeAll(async () => {
  const middlewareModule = await import('../src/middleware/idempotency.js');
  const idempotencyModule = await import('../src/services/idempotency.js');
  idempotencyMiddleware = middlewareModule.idempotencyMiddleware;
  checkAndMark = idempotencyModule.checkAndMark;
  __resetForTesting = idempotencyModule.__resetForTesting;
});

function setupEnv() {
  process.env.WHATSAPP_VERIFY_TOKEN = 'valid-verify-token-min-10';
  process.env.WHATSAPP_APP_SECRET = 'test-app-secret';
  process.env.WHATSAPP_ACCESS_TOKEN = 'test-access-token';
  process.env.WHATSAPP_PHONE_NUMBER_ID = '1234567890';
  process.env.NODE_ENV = 'development';
}

function createTestApp() {
  const app = express();
  app.use(express.raw({ type: 'application/json' }));
  // We need to skip signature validation for these tests, so we don't add it
  app.use(express.json());
  app.use(idempotencyMiddleware);
  app.post('/webhook/whatsapp', (req, res) => {
    res.status(200).json({ success: true, processed: true });
  });
  return app;
}

function createTestAppRaw() {
  const app = express();
  // Only raw parser - no express.json() to test Buffer parsing path
  app.use(express.raw({ type: 'application/json' }));
  app.use(idempotencyMiddleware);
  app.post('/webhook/whatsapp', (req, res) => {
    res.status(200).json({ success: true, processed: true });
  });
  return app;
}

function createTestAppString() {
  const app = express();
  // Only text parser - no express.json() to test string parsing path
  app.use(express.text({ type: 'application/json' }));
  app.use(idempotencyMiddleware);
  app.post('/webhook/whatsapp', (req, res) => {
    res.status(200).json({ success: true, processed: true });
  });
  return app;
}

function createTestAppJsonOnly() {
  const app = express();
  // Only json parser - to test object parsing path (line 23)
  app.use(express.json());
  app.use(idempotencyMiddleware);
  app.post('/webhook/whatsapp', (req, res) => {
    res.status(200).json({ success: true, processed: true });
  });
  return app;
}

function createValidWebhookPayload(messageId, textBody = 'Hola AudioGem! Test message') {
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
            wa_id: '15551234567'
          }],
          messages: [{
            from: '15551234567',
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

describe('Idempotency Middleware', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    setupEnv();
    // Reset idempotency state before each test
    __resetForTesting();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should allow first occurrence of message ID and call next()', async () => {
    const messageId = 'wamid.new123';
    const payload = createValidWebhookPayload(messageId);
    const body = JSON.stringify(payload);

    const app = createTestApp();
    
    await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.processed).toBe(true);
      });

    // Verify the message ID was marked as processed
    expect(checkAndMark(messageId)).toBe(true); // Should now be duplicate
  });

  it('should return 200 immediately for duplicate message ID without calling next handler', async () => {
    const messageId = 'wamid.dup456';
    const payload = createValidWebhookPayload(messageId);
    const body = JSON.stringify(payload);

    const app = createTestApp();
    
    // First request - should process
    await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);

    // Second request with same message ID - should short-circuit
    let handlerCalled = false;
    const app2 = express();
    app2.use(express.raw({ type: 'application/json' }));
    app2.use(express.json());
    app2.use(idempotencyMiddleware);
    app2.post('/webhook/whatsapp', (req, res) => {
      handlerCalled = true;
      res.status(200).json({ success: true, processed: true });
    });

    await request(app2)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);

    expect(handlerCalled).toBe(false);
  });

  it('should return 200 for empty messages array', async () => {
    const payload = {
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
              wa_id: '15551234567'
            }],
            messages: [], // Empty messages array
          },
          field: 'messages'
        }]
      }]
    };
    const body = JSON.stringify(payload);

    const app = createTestApp();
    
    await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);
  });

  it('should return 200 for missing messages array', async () => {
    const payload = {
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
              wa_id: '15551234567'
            }],
            // No messages field
          },
          field: 'messages'
        }]
      }]
    };
    const body = JSON.stringify(payload);

    const app = createTestApp();
    
    await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);
  });

  it('should return 200 for non-text messages', async () => {
    const payload = {
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
              wa_id: '15551234567'
            }],
            messages: [{
              from: '15551234567',
              id: 'wamid.image123',
              timestamp: Math.floor(Date.now() / 1000).toString(),
              image: { mime_type: 'image/jpeg', sha256: 'abc123', id: 'media123' },
              type: 'image'
            }]
          },
          field: 'messages'
        }]
      }]
    };
    const body = JSON.stringify(payload);

    const app = createTestApp();
    
    await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);
  });

  it('should handle multiple different message IDs independently', async () => {
    const payload1 = createValidWebhookPayload('wamid.msg1');
    const payload2 = createValidWebhookPayload('wamid.msg2');
    const body1 = JSON.stringify(payload1);
    const body2 = JSON.stringify(payload2);

    const app = createTestApp();
    
    // First message
    await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body1)
      .expect(200);

    // Second message (different ID)
    await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body2)
      .expect(200);

    // First message again (duplicate)
    await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body1)
      .expect(200);
  });

  it('should extract message.id from webhook payload correctly', async () => {
    const messageId = 'wamid.extract123';
    const payload = createValidWebhookPayload(messageId);
    const body = JSON.stringify(payload);

    const app = createTestApp();
    
    await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);

    // Verify the ID was extracted and marked
    expect(checkAndMark(messageId)).toBe(true); // Should be duplicate now
  });

  // Tests for parseBody Buffer parsing error path (line 30 in idempotency.js)
  it('should handle Buffer with invalid JSON gracefully and call next()', async () => {
    const invalidJsonBuffer = Buffer.from('{ invalid json }');

    const app = createTestAppRaw();
    
    await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(invalidJsonBuffer)
      .expect(200);
  });

  // Tests for parseBody string parsing path and error (lines 33-44)
  it('should handle string body with valid JSON', async () => {
    const messageId = 'wamid.string456';
    const payload = createValidWebhookPayload(messageId);
    const body = JSON.stringify(payload);

    const app = createTestAppString();
    
    await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);
  });

  it('should handle string body with invalid JSON gracefully and call next()', async () => {
    const invalidJsonString = '{ invalid json }';

    const app = createTestAppString();
    
    await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(invalidJsonString)
      .expect(200);
  });

  // Tests for extractMessageId catch block (lines 71-72) and null parsedBody (lines 87-88)
  it('should handle malformed payload structure gracefully and call next()', async () => {
    // Payload missing required nested structure
    const malformedPayload = { entry: [{}] };
    const body = JSON.stringify(malformedPayload);

    const app = createTestApp();
    
    await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);
  });

  it('should handle payload with null entry and call next()', async () => {
    const malformedPayload = { entry: [null] };
    const body = JSON.stringify(malformedPayload);

    const app = createTestApp();
    
    await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);
  });

  it('should handle payload that results in null parsedBody and call next()', async () => {
    // Send a non-object, non-buffer, non-string body (though express won't produce this)
    // We test by sending a raw body that parses to something unexpected
    const app = createTestAppRaw();
    
    // Send empty body
    await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send('')
      .expect(200);
  });

  // Test object parsing path (line 23) - using only express.json()
  it('should handle parsed object body (express.json only)', async () => {
    const messageId = 'wamid.jsononly123';
    const payload = createValidWebhookPayload(messageId);
    const body = JSON.stringify(payload);

    const app = createTestAppJsonOnly();
    
    await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);
  });

  // Test extractMessageId catch block (lines 71-72)
  it('should handle extractMessageId error gracefully and call next()', async () => {
    // Payload that causes error in extractMessageId (e.g., entry is not an array)
    const malformedPayload = { entry: 'not-an-array' };
    const body = JSON.stringify(malformedPayload);

    const app = createTestApp();
    
    await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);
  });

  // Test string parsing final return null (line 43)
  it('should handle string that parses to non-object', async () => {
    // JSON string that parses to a primitive (not an object)
    const primitiveString = '"just a string"';

    const app = createTestAppString();
    
    await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(primitiveString)
      .expect(200);
  });
});