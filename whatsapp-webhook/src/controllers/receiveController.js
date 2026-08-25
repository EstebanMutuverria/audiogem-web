/**
 * Receive controller for WhatsApp webhook (POST /webhook/whatsapp).
 * Handles incoming messages, detects triggers, and sends auto-replies.
 */

import { isWebOriginMessage } from '../services/detection.js';
import { sendAutoReply } from '../services/reply.js';
import { parseBody } from '../utils/parseBody.js';

/**
 * Extracts message data from WhatsApp webhook payload.
 * @param {Object} body - Parsed webhook payload
 * @returns {Object|null} Message data { from, id, text } or null if not a valid text message
 */
function extractMessageData(body) {
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

    return {
      from: message.from,
      id: message.id,
      text: message.text?.body || '',
    };
  } catch (error) {
    return null;
  }
}

/**
 * Handles POST /webhook/whatsapp for incoming WhatsApp messages.
 * Parses payload, detects trigger phrases, sends auto-reply if matched.
 * Always returns 200 OK (per Meta webhook requirements).
 * Handles both raw Buffer (from express.raw) and parsed object (from express.json).
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export async function receiveController(req, res) {
  // Parse body if needed (handles Buffer from express.raw before express.json)
  const parsedBody = parseBody(req.body);

  // Always respond 200 OK quickly (Meta expects fast response)
  // Process asynchronously but don't wait for reply to complete
  const messageData = extractMessageData(parsedBody);

  if (!messageData) {
    // No valid text message - acknowledge and return
    return res.status(200).json({ success: true, processed: false });
  }

  const { from, id: messageId, text } = messageData;

  // Check if message matches trigger phrases
  const isTrigger = isWebOriginMessage(text);

  if (isTrigger) {
    // Fire and forget - send auto-reply asynchronously
    // Don't await - return 200 immediately per webhook requirements
    sendAutoReply(from, messageId).catch((error) => {
      // Log error but don't fail the webhook response
      process.stderr.write(`Failed to send auto-reply: ${error.message}\n`);
    });
  }

  return res.status(200).json({ success: true, processed: isTrigger });
}