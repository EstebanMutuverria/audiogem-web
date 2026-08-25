/**
 * Signature validation middleware for WhatsApp webhook.
 * Validates X-Hub-Signature-256 header using HMAC-SHA256 with constant-time comparison.
 */

import { config } from '../config/index.js';
import { verifySignature } from '../utils/hmac.js';

/**
 * Express middleware to validate X-Hub-Signature-256 header.
 * Must be used AFTER express.raw({ type: 'application/json' }) to capture raw body.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 */
export function signatureValidationMiddleware(req, res, next) {
  // Get the X-Hub-Signature-256 header
  const signatureHeader = req.get('X-Hub-Signature-256');

  // Get the raw body (must be parsed by express.raw middleware)
  const rawBody = req.body;

  // Validate signature
  if (!verifySignature(signatureHeader, rawBody, config.appSecret)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Signature is valid, proceed to next middleware
  next();
}