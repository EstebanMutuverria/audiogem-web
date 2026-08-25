import { describe, it, expect, vi, beforeEach } from 'vitest';

// RED: Tests for idempotency service - these will fail until src/services/idempotency.js is implemented

describe('Idempotency Service - checkAndMark', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should return false for new message ID (not processed before)', async () => {
    const { checkAndMark } = await import('../src/services/idempotency.js');
    const result = checkAndMark('wamid.new123');
    expect(result).toBe(false);
  });

  it('should return true for duplicate message ID (already processed)', async () => {
    const { checkAndMark } = await import('../src/services/idempotency.js');
    checkAndMark('wamid.dup456'); // First call - marks as processed
    const result = checkAndMark('wamid.dup456'); // Second call - should detect duplicate
    expect(result).toBe(true);
  });

  it('should track multiple different message IDs independently', async () => {
    const { checkAndMark } = await import('../src/services/idempotency.js');
    expect(checkAndMark('wamid.msg1')).toBe(false);
    expect(checkAndMark('wamid.msg2')).toBe(false);
    expect(checkAndMark('wamid.msg3')).toBe(false);
    expect(checkAndMark('wamid.msg1')).toBe(true); // Duplicate
    expect(checkAndMark('wamid.msg2')).toBe(true); // Duplicate
  });

  it('should evict oldest entries when exceeding 10,000 limit (LRU/FIFO)', async () => {
    const { checkAndMark, __getSetForTesting } = await import('../src/services/idempotency.js');
    
    // Add 10,000 unique message IDs
    for (let i = 0; i < 10000; i++) {
      checkAndMark(`wamid.${i}`);
    }
    
    // The set should have 10,000 entries
    const processedSet = __getSetForTesting();
    expect(processedSet.size).toBe(10000);
    
    // Add one more - should evict the oldest (wamid.0)
    checkAndMark('wamid.10000');
    
    // Set size should still be 10,000
    expect(processedSet.size).toBe(10000);
    
    // Oldest should be evicted
    expect(processedSet.has('wamid.0')).toBe(false);
    // Newest should be present
    expect(processedSet.has('wamid.10000')).toBe(true);
  });

  it('should handle message IDs with wamid prefix format', async () => {
    const { checkAndMark } = await import('../src/services/idempotency.js');
    expect(checkAndMark('wamid.abc123')).toBe(false);
    expect(checkAndMark('wamid.xyz789')).toBe(false);
    expect(checkAndMark('wamid.abc123')).toBe(true);
  });

  it('should return false for null/undefined input', async () => {
    const { checkAndMark } = await import('../src/services/idempotency.js');
    expect(checkAndMark(null)).toBe(false);
    expect(checkAndMark(undefined)).toBe(false);
    expect(checkAndMark('')).toBe(false);
  });

  it('should maintain separate state across multiple calls', async () => {
    const { checkAndMark } = await import('../src/services/idempotency.js');
    // First batch
    checkAndMark('wamid.batch1');
    expect(checkAndMark('wamid.batch1')).toBe(true);
    
    // Different ID should not be affected
    expect(checkAndMark('wamid.batch2')).toBe(false);
  });
});