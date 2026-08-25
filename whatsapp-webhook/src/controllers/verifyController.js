/**
 * Verify controller for WhatsApp webhook verification (GET /webhook/whatsapp).
 * Handles Meta Cloud API webhook subscription verification.
 */

import { config } from '../config/index.js';

/**
 * Handles GET /webhook/whatsapp for webhook verification.
 * Validates hub.mode, hub.challenge, and hub.verify_token query parameters.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export function verifyController(req, res) {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': verifyToken } = req.query;

  // Validate required parameters
  if (!mode || !challenge || !verifyToken) {
    return res.status(403).send('Forbidden');
  }

  // Validate mode is 'subscribe'
  if (mode !== 'subscribe') {
    return res.status(403).send('Forbidden');
  }

  // Validate verify token matches configured token
  if (verifyToken !== config.verifyToken) {
    return res.status(403).send('Forbidden');
  }

  // Success - return challenge as plain text
  res.set('Content-Type', 'text/plain');
  return res.status(200).send(challenge);
}