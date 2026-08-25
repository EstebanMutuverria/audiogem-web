/**
 * Reply service for sending auto-replies via Meta Graph API.
 */

import { config, AUTO_REPLY_TEXT } from '../config/index.js';

const GRAPH_API_VERSION = 'v25.0';

/**
 * Sends an auto-reply message via Meta Graph API.
 * @param {string} to - Recipient phone number
 * @param {string} messageId - Original message ID (for reference)
 * @returns {Promise<void>}
 * @throws {Error} If the API request fails
 */
export async function sendAutoReply(to, messageId) {
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${config.phoneNumberId}/messages`;
  
  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: AUTO_REPLY_TEXT },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
    throw new Error(`Failed to send reply: ${response.status} - ${errorMessage}`);
  }

  // Response contains message ID but we don't need to return it
  await response.json();
}