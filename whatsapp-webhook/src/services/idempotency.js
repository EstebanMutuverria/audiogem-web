/**
 * Idempotency service for deduplicating WhatsApp message processing.
 * Uses in-memory Set with FIFO eviction at 10,000 entries.
 */

const MAX_ENTRIES = 10000;

// Internal storage: Set for O(1) lookups, Array for FIFO order tracking
const processedMessages = new Set();
const messageOrder = [];

/**
 * Checks if a message ID has been processed before, and marks it as processed if not.
 * Implements LRU/FIFO eviction when exceeding MAX_ENTRIES.
 * @param {string} messageId - WhatsApp message ID (format: wamid.*)
 * @returns {boolean} True if message was already processed (duplicate), false if new
 */
export function checkAndMark(messageId) {
  // Handle invalid input
  if (!messageId || typeof messageId !== 'string') {
    return false;
  }

  // Check if already processed
  if (processedMessages.has(messageId)) {
    return true; // Duplicate
  }

  // New message - add to processed set
  processedMessages.add(messageId);
  messageOrder.push(messageId);

  // Evict oldest if exceeding limit (FIFO)
  if (processedMessages.size > MAX_ENTRIES) {
    const oldest = messageOrder.shift();
    if (oldest) {
      processedMessages.delete(oldest);
    }
  }

  return false; // New message
}

/**
 * Internal function for testing - returns the processed messages Set.
 * @returns {Set<string>} The internal processed messages Set
 */
export function __getSetForTesting() {
  return processedMessages;
}

/**
 * Internal function for testing - resets the idempotency state.
 * Only for testing purposes.
 */
export function __resetForTesting() {
  processedMessages.clear();
  messageOrder.length = 0;
}