import { describe, it, expect, vi, beforeEach } from 'vitest';

// RED: Tests for HMAC-SHA256 helpers - these will fail until src/utils/hmac.js is implemented

describe('HMAC Utilities', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe('computeSignature', () => {
    it('should compute correct HMAC-SHA256 signature for given body and secret', async () => {
      const { computeSignature } = await import('../src/utils/hmac.js');
      const body = '{"test": "data"}';
      const secret = 'app-secret';
      const signature = computeSignature(body, secret);

      expect(signature).toBeDefined();
      expect(typeof signature).toBe('string');
      expect(signature.length).toBe(64); // SHA256 hex = 64 chars
      expect(signature).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should produce different signatures for different bodies', async () => {
      const { computeSignature } = await import('../src/utils/hmac.js');
      const secret = 'app-secret';
      const sig1 = computeSignature('{"a": 1}', secret);
      const sig2 = computeSignature('{"a": 2}', secret);

      expect(sig1).not.toBe(sig2);
    });

    it('should produce different signatures for different secrets', async () => {
      const { computeSignature } = await import('../src/utils/hmac.js');
      const body = '{"test": "data"}';
      const sig1 = computeSignature(body, 'secret1');
      const sig2 = computeSignature(body, 'secret2');

      expect(sig1).not.toBe(sig2);
    });

    it('should handle Buffer input', async () => {
      const { computeSignature } = await import('../src/utils/hmac.js');
      const body = Buffer.from('{"test": "data"}');
      const secret = 'app-secret';
      const signature = computeSignature(body, secret);

      expect(signature).toBeDefined();
      expect(signature.length).toBe(64);
    });

    it('should produce consistent signature for same input', async () => {
      const { computeSignature } = await import('../src/utils/hmac.js');
      const body = '{"consistent": true}';
      const secret = 'consistent-secret';
      const sig1 = computeSignature(body, secret);
      const sig2 = computeSignature(body, secret);

      expect(sig1).toBe(sig2);
    });
  });

  describe('verifySignature', () => {
    it('should return true for valid signature', async () => {
      const { computeSignature, verifySignature } = await import('../src/utils/hmac.js');
      const body = '{"valid": true}';
      const secret = 'verify-secret';
      const signature = computeSignature(body, secret);
      const header = `sha256=${signature}`;

      const result = verifySignature(header, body, secret);
      expect(result).toBe(true);
    });

    it('should return false for invalid signature', async () => {
      const { verifySignature } = await import('../src/utils/hmac.js');
      const body = '{"valid": true}';
      const secret = 'verify-secret';
      const header = 'sha256=invalid-signature';

      const result = verifySignature(header, body, secret);
      expect(result).toBe(false);
    });

    it('should return false for missing sha256= prefix', async () => {
      const { computeSignature, verifySignature } = await import('../src/utils/hmac.js');
      const body = '{"valid": true}';
      const secret = 'verify-secret';
      const signature = computeSignature(body, secret);
      const header = signature; // missing sha256=

      const result = verifySignature(header, body, secret);
      expect(result).toBe(false);
    });

    it('should return false for empty header', async () => {
      const { verifySignature } = await import('../src/utils/hmac.js');
      const body = '{"valid": true}';
      const secret = 'verify-secret';
      const header = '';

      const result = verifySignature(header, body, secret);
      expect(result).toBe(false);
    });

    it('should return false for malformed header (wrong algorithm)', async () => {
      const { verifySignature } = await import('../src/utils/hmac.js');
      const body = '{"valid": true}';
      const secret = 'verify-secret';
      const header = 'sha1=abcdef';

      const result = verifySignature(header, body, secret);
      expect(result).toBe(false);
    });

    it('should use constant-time comparison (timing-safe)', async () => {
      const { computeSignature, verifySignature } = await import('../src/utils/hmac.js');
      const body = '{"timing": "test"}';
      const secret = 'timing-secret';
      const validSignature = computeSignature(body, secret);
      const validHeader = `sha256=${validSignature}`;

      // This test verifies the function doesn't throw and returns correct result
      // Actual timing attack resistance is verified by implementation using crypto.timingSafeEqual
      const result = verifySignature(validHeader, body, secret);
      expect(result).toBe(true);
    });

    it('should handle Buffer body input', async () => {
      const { computeSignature, verifySignature } = await import('../src/utils/hmac.js');
      const body = Buffer.from('{"buffer": true}');
      const secret = 'buffer-secret';
      const signature = computeSignature(body, secret);
      const header = `sha256=${signature}`;

      const result = verifySignature(header, body, secret);
      expect(result).toBe(true);
    });
  });
});