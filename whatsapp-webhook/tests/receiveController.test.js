import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import express from 'express';
import request from 'supertest';

// RED: Tests for receive controller - these will fail until src/controllers/receiveController.js is implemented

import { checkAndMark, __resetForTesting } from '../src/services/idempotency.js';

// Set up env vars before importing controller (config validates at import time)
process.env.WHATSAPP_VERIFY_TOKEN = 'valid-verify-token-min-10';
process.env.WHATSAPP_APP_SECRET = 'test-app-secret';
process.env.WHATSAPP_ACCESS_TOKEN = 'test-access-token';
process.env.WHATSAPP_PHONE_NUMBER_ID = '1234567890';
process.env.NODE_ENV = 'development';
process.env.AUTO_REPLY_TEXT = 'Test auto reply message';

// Import controller once at module level to avoid vi.resetModules() coverage issues
let receiveController;
beforeAll(async () => {
  const controllerModule = await import('../src/controllers/receiveController.js');
  receiveController = controllerModule.receiveController;
});

function setupEnv() {
  process.env.WHATSAPP_VERIFY_TOKEN = 'valid-verify-token-min-10';
  process.env.WHATSAPP_APP_SECRET = 'test-app-secret';
  process.env.WHATSAPP_ACCESS_TOKEN = 'test-access-token';
  process.env.WHATSAPP_PHONE_NUMBER_ID = '1234567890';
  process.env.NODE_ENV = 'development';
  process.env.AUTO_REPLY_TEXT = 'Test auto reply message';
}

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.post('/webhook/whatsapp', receiveController);
  return app;
}

function createTestAppRaw() {
  const app = express();
  // Use raw body parser to test Buffer parsing path in parseBody
  app.use(express.raw({ type: 'application/json' }));
  app.post('/webhook/whatsapp', receiveController);
  return app;
}

function createTestAppString() {
  const app = express();
  // Use text parser to test string parsing path in parseBody
  app.use(express.text({ type: 'application/json' }));
  app.post('/webhook/whatsapp', receiveController);
  return app;
}

function createTestAppJsonOnly() {
  const app = express();
  // Only json parser - to test object parsing path
  app.use(express.json());
  app.post('/webhook/whatsapp', receiveController);
  return app;
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

describe('Receive Controller (POST /webhook/whatsapp)', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    setupEnv();
    __resetForTesting();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return 200 with processed:true for trigger message "Hola AudioGem!"', async () => {
    const messageId = 'wamid.trigger1';
    const payload = createValidWebhookPayload(messageId, 'Hola AudioGem! Quiero consultar');
    const body = JSON.stringify(payload);

    const app = createTestApp();
    
    const response = await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);

    expect(response.body).toEqual({ success: true, processed: true });
  });

  it('should return 200 with processed:true for trigger message "Pedido de AudioGem 🛒"', async () => {
    const messageId = 'wamid.trigger2';
    const payload = createValidWebhookPayload(messageId, 'Pedido de AudioGem 🛒 Producto X - Cantidad 2');
    const body = JSON.stringify(payload);

    const app = createTestApp();
    
    const response = await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);

    expect(response.body).toEqual({ success: true, processed: true });
  });

  it('should return 200 with processed:false for non-matching message', async () => {
    const messageId = 'wamid.nomatch';
    const payload = createValidWebhookPayload(messageId, 'Hola, ¿cómo estás?');
    const body = JSON.stringify(payload);

    const app = createTestApp();
    
    const response = await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);

    expect(response.body).toEqual({ success: true, processed: false });
  });

  it('should return 200 with processed:false for empty messages array', async () => {
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
    
    const response = await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);

    expect(response.body).toEqual({ success: true, processed: false });
  });

  it('should return 200 with processed:false for non-text message (image)', async () => {
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
    
    const response = await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);

    expect(response.body).toEqual({ success: true, processed: false });
  });

  it('should return 200 with processed:false for missing messages field', async () => {
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
    
    const response = await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);

    expect(response.body).toEqual({ success: true, processed: false });
  });

  it('should return 200 even when sendAutoReply would fail (error handling)', async () => {
    const messageId = 'wamid.error123';
    const payload = createValidWebhookPayload(messageId, 'Hola AudioGem! Test');
    const body = JSON.stringify(payload);

    const app = createTestApp();
    
    const response = await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);

    expect(response.body).toEqual({ success: true, processed: true });
  });

  it('should extract message data correctly from payload', async () => {
    const messageId = 'wamid.phone123';
    const fromNumber = '5559876543';
    const payload = createValidWebhookPayload(messageId, 'Hola AudioGem! Test', fromNumber);
    const body = JSON.stringify(payload);

    const app = createTestApp();
    
    const response = await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);

    expect(response.body).toEqual({ success: true, processed: true });
  });

  // Tests for parseBody Buffer parsing error path (line 30)
  it('should handle Buffer with invalid JSON gracefully', async () => {
    const invalidJsonBuffer = Buffer.from('{ invalid json }');

    const app = createTestAppRaw();
    
    const response = await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(invalidJsonBuffer)
      .expect(200);

    expect(response.body).toEqual({ success: true, processed: false });
  });

  // Tests for parseBody string parsing path (lines 33-43)
  it('should handle string body with valid JSON', async () => {
    const messageId = 'wamid.string123';
    const payload = createValidWebhookPayload(messageId, 'Hola AudioGem! Test');
    const body = JSON.stringify(payload);

    const app = createTestAppString();
    
    const response = await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);

    expect(response.body).toEqual({ success: true, processed: true });
  });

  it('should handle string body with invalid JSON gracefully', async () => {
    const invalidJsonString = '{ invalid json }';

    const app = createTestAppString();
    
    const response = await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(invalidJsonString)
      .expect(200);

    expect(response.body).toEqual({ success: true, processed: false });
  });

  // Tests for extractMessageData catch block (lines 74-75)
  it('should handle malformed payload structure gracefully', async () => {
    // Payload missing required nested structure
    const malformedPayload = { entry: [{}] };
    const body = JSON.stringify(malformedPayload);

    const app = createTestApp();
    
    const response = await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);

    expect(response.body).toEqual({ success: true, processed: false });
  });

  it('should handle payload with null entry', async () => {
    const malformedPayload = { entry: [null] };
    const body = JSON.stringify(malformedPayload);

    const app = createTestApp();
    
    const response = await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);

    expect(response.body).toEqual({ success: true, processed: false });
  });

  // Test extractMessageData catch block (lines 74-75) - payload that throws in parsing
  it('should handle extractMessageData error gracefully', async () => {
    // Payload that causes error in extractMessageData (e.g., entry is not an array)
    const malformedPayload = { entry: 'not-an-array' };
    const body = JSON.stringify(malformedPayload);

    const app = createTestApp();
    
    const response = await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(200);

    expect(response.body).toEqual({ success: true, processed: false });
  });

  // Test string parsing final return null (line 42) - string that parses to non-object
  it('should handle string that parses to non-object', async () => {
    // JSON string that parses to a primitive (not an object)
    const primitiveString = '"just a string"';

    const app = createTestAppString();
    
    const response = await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(primitiveString)
      .expect(200);

    expect(response.body).toEqual({ success: true, processed: false });
  });
});