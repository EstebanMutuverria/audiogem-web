/**
 * HMAC-SHA256 utilities for WhatsApp webhook signature validation.
 * Uses Node.js crypto module with constant-time comparison for timing attack resistance.
 */

import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Computes HMAC-SHA256 signature for the given body and secret.
 * @param {string|Buffer} body - Request body to sign
 * @param {string} secret - App secret from Meta
 * @returns {string} Hex-encoded HMAC-SHA256 signature (64 characters)
 */
export function computeSignature(body, secret) {
  const hmac = createHmac('sha256', secret);
  hmac.update(body);
  return hmac.digest('hex');
}

/**
 * Verifies the X-Hub-Signature-256 header against computed signature.
 * Uses constant-time comparison to prevent timing attacks.
 * @param {string} header - X-Hub-Signature-256 header value (format: "sha256=<hex>")
 * @param {string|Buffer} body - Raw request body
 * @param {string} secret - App secret from Meta
 * @returns {boolean} True if signature is valid, false otherwise
 */
export function verifySignature(header, body, secret) {
  if (!header || typeof header !== 'string') {
    return false;
  }

  // Expect format: "sha256=<hex>"
  const prefix = 'sha256=';
  if (!header.startsWith(prefix)) {
    return false;
  }

  const providedSignature = header.slice(prefix.length);
  if (!providedSignature || providedSignature.length !== 64) {
    return false;
  }

  // Validate hex format
  if (!/^[a-f0-9]{64}$/i.test(providedSignature)) {
    return false;
  }

  const expectedSignature = computeSignature(body, secret);

  // Use constant-time comparison to prevent timing attacks
  // Both signatures must be same length for timingSafeEqual
  const providedBuffer = Buffer.from(providedSignature, 'hex');
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
}