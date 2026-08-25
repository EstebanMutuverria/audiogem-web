/**
 * Detection service for identifying web-origin WhatsApp messages.
 * Checks if message text starts with specific trigger prefixes.
 */

const TRIGGER_PREFIXES = [
  'hola audiogem!',
  'pedido de audiogem 🛒',
];

/**
 * Normalizes text for comparison: trims whitespace and converts to lowercase.
 * @param {string} text - Input text
 * @returns {string} Normalized text
 */
function normalizeText(text) {
  if (typeof text !== 'string') {
    return '';
  }
  return text.trim().toLowerCase();
}

/**
 * Checks if a message is from a web-origin contact by matching trigger prefixes.
 * @param {string} text - Message text body
 * @returns {boolean} True if message matches a trigger prefix, false otherwise
 */
export function isWebOriginMessage(text) {
  const normalized = normalizeText(text);
  
  if (!normalized) {
    return false;
  }

  return TRIGGER_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}