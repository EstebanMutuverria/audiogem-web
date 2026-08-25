/**
 * Webhook routes for WhatsApp Business API.
 * Defines GET /webhook/whatsapp (verification) and POST /webhook/whatsapp (receive) endpoints.
 * Includes health check endpoint.
 */

import { Router } from 'express';
import { verifyController } from '../controllers/verifyController.js';
import { receiveController } from '../controllers/receiveController.js';
import { signatureValidationMiddleware } from '../middleware/signatureValidation.js';
import { idempotencyMiddleware } from '../middleware/idempotency.js';

const router = Router();

/**
 * Health check endpoint
 * GET /health
 */
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

/**
 * Webhook verification endpoint (GET)
 * GET /webhook/whatsapp
 * Handles Meta Cloud API webhook subscription verification
 */
router.get('/webhook/whatsapp', verifyController);

/**
 * Webhook receive endpoint (POST)
 * POST /webhook/whatsapp
 * Middleware chain:
 * 1. express.raw({ type: 'application/json' }) - captures raw body for signature validation
 * 2. signatureValidationMiddleware - validates X-Hub-Signature-256
 * 3. idempotencyMiddleware - checks/marks message ID for deduplication
 * 4. express.json() - parses JSON body (after raw)
 * 5. receiveController - handles message processing
 */
router.post(
  '/webhook/whatsapp',
  // Note: express.raw and express.json should be applied at app level
  // in the correct order: raw -> signatureValidation -> idempotency -> json -> controller
  signatureValidationMiddleware,
  idempotencyMiddleware,
  receiveController
);

export { router as webhookRoutes };