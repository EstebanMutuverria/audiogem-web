import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// RED: Tests for webhook routes - these will fail until src/routes/webhook.js is implemented

function setupEnv() {
  process.env.WHATSAPP_VERIFY_TOKEN = 'valid-verify-token-min-10';
  process.env.WHATSAPP_APP_SECRET = 'test-app-secret';
  process.env.WHATSAPP_ACCESS_TOKEN = 'test-access-token';
  process.env.WHATSAPP_PHONE_NUMBER_ID = '1234567890';
  process.env.NODE_ENV = 'development';
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

describe('Webhook Routes', () => {
  let originalEnv;
  let webhookRoutes;
  let signatureValidationMiddleware;
  let idempotencyMiddleware;
  let verifyController;
  let receiveController;

  beforeEach(async () => {
    vi.resetModules();
    originalEnv = { ...process.env };
    setupEnv();

    // Import all route dependencies
    const routesModule = await import('../src/routes/webhook.js');
    const sigModule = await import('../src/middleware/signatureValidation.js');
    const idemModule = await import('../src/middleware/idempotency.js');
    const verifyModule = await import('../src/controllers/verifyController.js');
    const receiveModule = await import('../src/controllers/receiveController.js');

    webhookRoutes = routesModule.webhookRoutes;
    signatureValidationMiddleware = sigModule.signatureValidationMiddleware;
    idempotencyMiddleware = idemModule.idempotencyMiddleware;
    verifyController = verifyModule.verifyController;
    receiveController = receiveModule.receiveController;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should export webhookRoutes as an Express Router', () => {
    expect(webhookRoutes).toBeDefined();
    expect(typeof webhookRoutes).toBe('function');
    // Express Router is a function with a 'stack' property
    expect(webhookRoutes.stack).toBeDefined();
  });

  it('should have GET /webhook/whatsapp route with verifyController', () => {
    const getRoute = webhookRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/webhook/whatsapp' && layer.route.methods.get
    );
    expect(getRoute).toBeDefined();
  });

  it('should have POST /webhook/whatsapp route with middleware chain and receiveController', () => {
    const postRoute = webhookRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/webhook/whatsapp' && layer.route.methods.post
    );
    expect(postRoute).toBeDefined();
    
    // Should have middleware stack: raw -> signature -> idempotency -> json -> receiveController
    const middlewareNames = postRoute.route.stack.map(layer => layer.name || layer.handle.name).filter(Boolean);
    expect(middlewareNames).toContain('signatureValidationMiddleware');
    expect(middlewareNames).toContain('idempotencyMiddleware');
    expect(middlewareNames).toContain('receiveController');
  });

  it('should have health check endpoint GET /health', () => {
    const healthRoute = webhookRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/health' && layer.route.methods.get
    );
    expect(healthRoute).toBeDefined();
  });

  it('should return 200 for GET /health', async () => {
    const app = express();
    app.use(webhookRoutes);
    
    await request(app)
      .get('/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  it('should handle GET /webhook/whatsapp verification', async () => {
    const app = express();
    app.use(express.raw({ type: 'application/json' }));
    app.use(webhookRoutes);
    app.use(express.json());
    
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

  it('should reject GET /webhook/whatsapp with invalid token', async () => {
    const app = express();
    app.use(express.raw({ type: 'application/json' }));
    app.use(webhookRoutes);
    app.use(express.json());
    
    await request(app)
      .get('/webhook/whatsapp')
      .query({
        'hub.mode': 'subscribe',
        'hub.challenge': 'test-challenge-123',
        'hub.verify_token': 'wrong-token'
      })
      .expect(403);
  });

  it('should handle POST /webhook/whatsapp with valid payload', async () => {
    const { computeSignature } = await import('../src/utils/hmac.js');
    
    const app = express();
    // Full middleware chain: raw -> signature -> idempotency -> json -> controller
    app.use(express.raw({ type: 'application/json' }));
    app.use(webhookRoutes);
    app.use(express.json());
    
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

  it('should return 401 for POST /webhook/whatsapp with invalid signature (when signature middleware is used)', async () => {
    const app = express();
    // Full middleware chain
    app.use(express.raw({ type: 'application/json' }));
    app.use(webhookRoutes);
    app.use(express.json());
    
    const payload = createValidWebhookPayload('wamid.test123', 'Hola AudioGem! Test');
    const body = JSON.stringify(payload);
    
    await request(app)
      .post('/webhook/whatsapp')
      .set('Content-Type', 'application/json')
      .send(body)
      .expect(401);
  });
});