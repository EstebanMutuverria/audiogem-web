import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// RED: Tests for verify controller - these will fail until src/controllers/verifyController.js is implemented

function setupEnv() {
  process.env.WHATSAPP_VERIFY_TOKEN = 'valid-verify-token-min-10';
  process.env.WHATSAPP_APP_SECRET = 'test-app-secret';
  process.env.WHATSAPP_ACCESS_TOKEN = 'test-access-token';
  process.env.WHATSAPP_PHONE_NUMBER_ID = '1234567890';
  process.env.NODE_ENV = 'development';
}

function createTestApp(controller) {
  const app = express();
  app.get('/webhook/whatsapp', controller);
  return app;
}

describe('Verify Controller (GET /webhook/whatsapp)', () => {
  let originalEnv;
  let verifyController;

  beforeEach(async () => {
    vi.resetModules();
    originalEnv = { ...process.env };
    setupEnv();
    const controllerModule = await import('../src/controllers/verifyController.js');
    verifyController = controllerModule.verifyController;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return 200 with hub.challenge when mode=subscribe and verify_token matches', async () => {
    const challenge = '123456789';
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    const app = createTestApp(verifyController);
    
    await request(app)
      .get('/webhook/whatsapp')
      .query({
        'hub.mode': 'subscribe',
        'hub.challenge': challenge,
        'hub.verify_token': verifyToken
      })
      .expect(200)
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect(challenge);
  });

  it('should return 403 when verify_token does not match', async () => {
    const challenge = '123456789';

    const app = createTestApp(verifyController);
    
    await request(app)
      .get('/webhook/whatsapp')
      .query({
        'hub.mode': 'subscribe',
        'hub.challenge': challenge,
        'hub.verify_token': 'wrong-token'
      })
      .expect(403);
  });

  it('should return 403 when hub.mode is not subscribe', async () => {
    const challenge = '123456789';
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    const app = createTestApp(verifyController);
    
    await request(app)
      .get('/webhook/whatsapp')
      .query({
        'hub.mode': 'unsubscribe',
        'hub.challenge': challenge,
        'hub.verify_token': verifyToken
      })
      .expect(403);
  });

  it('should return 403 when hub.mode is missing', async () => {
    const challenge = '123456789';
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    const app = createTestApp(verifyController);
    
    await request(app)
      .get('/webhook/whatsapp')
      .query({
        'hub.challenge': challenge,
        'hub.verify_token': verifyToken
      })
      .expect(403);
  });

  it('should return 403 when hub.verify_token is missing', async () => {
    const challenge = '123456789';

    const app = createTestApp(verifyController);
    
    await request(app)
      .get('/webhook/whatsapp')
      .query({
        'hub.mode': 'subscribe',
        'hub.challenge': challenge
      })
      .expect(403);
  });

  it('should return 403 when hub.challenge is missing', async () => {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    const app = createTestApp(verifyController);
    
    await request(app)
      .get('/webhook/whatsapp')
      .query({
        'hub.mode': 'subscribe',
        'hub.verify_token': verifyToken
      })
      .expect(403);
  });

  it('should return 403 when all query parameters are missing', async () => {
    const app = createTestApp(verifyController);
    
    await request(app)
      .get('/webhook/whatsapp')
      .expect(403);
  });

  it('should return 403 when hub.mode is empty string', async () => {
    const challenge = '123456789';
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    const app = createTestApp(verifyController);
    
    await request(app)
      .get('/webhook/whatsapp')
      .query({
        'hub.mode': '',
        'hub.challenge': challenge,
        'hub.verify_token': verifyToken
      })
      .expect(403);
  });

  it('should return challenge as plain text (not JSON)', async () => {
    const challenge = 'challenge-123';
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    const app = createTestApp(verifyController);
    
    await request(app)
      .get('/webhook/whatsapp')
      .query({
        'hub.mode': 'subscribe',
        'hub.challenge': challenge,
        'hub.verify_token': verifyToken
      })
      .expect(200)
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect((res) => {
        expect(res.text).toBe(challenge);
        // Should not be JSON
        expect(res.headers['content-type']).not.toContain('application/json');
      });
  });
});