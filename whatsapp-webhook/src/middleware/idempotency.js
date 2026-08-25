/**
 * Idempotency middleware for WhatsApp webhook.
 * Extracts message.id from payload and checks against processed set.
 * Short-circuits with 200 if duplicate.
 * Handles both raw Buffer (from express.raw) and parsed object (from express.json).
 */

import { checkAndMark } from '../services/idempotency.js';
import { parseBody } from '../utils/parseBody.js';

/**
 * Extracts message ID from WhatsApp webhook payload.
 * @param {Object} body - Parsed webhook payload
 * @returns {string|null} Message ID or null if not found/not a text message
 */
function extractMessageId(body) {
  try {
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return null;
    }

    const message = messages[0];

    // Only process text messages
    if (message.type !== 'text') {
      return null;
    }

    return message.id || null;
  } catch (error) {
    return null;
  }
}

/**
 * Express middleware for idempotency check.
 * Handles both raw Buffer (from express.raw) and parsed object (from express.json).
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 */
export function idempotencyMiddleware(req, res, next) {
  // Parse body if needed (handles Buffer from express.raw)
  const parsedBody = parseBody(req.body);
  
  if (!parsedBody) {
    return next();
  }

  const messageId = extractMessageId(parsedBody);

  // If no message ID (empty messages, non-text, malformed), proceed without idempotency check
  if (!messageId) {
    return next();
  }

  // Check if already processed
  const isDuplicate = checkAndMark(messageId);

  if (isDuplicate) {
    // Duplicate - return 200 immediately without calling next handler
    return res.status(200).json({ success: true, duplicate: true });
  }

  // New message - proceed to handler
  next();
}