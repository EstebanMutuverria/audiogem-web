/**
 * Parses body if it's a Buffer, otherwise returns as-is.
 * Handles raw Buffer from express.raw and parsed object from express.json.
 * @param {Buffer|Object|string|null|undefined} body - Request body
 * @returns {Object|null} Parsed body object or null if invalid
 */
export function parseBody(body) {
  if (!body) {
    return null;
  }

  // If already an object, return as-is
  if (typeof body === 'object' && !Buffer.isBuffer(body)) {
    return body;
  }

  // If Buffer, parse as JSON
  if (Buffer.isBuffer(body)) {
    try {
      return JSON.parse(body.toString('utf8'));
    } catch {
      return null;
    }
  }

  // If string, parse as JSON
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }

  return null;
}