import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// RED: Tests for reply service - these will fail until src/services/reply.js is implemented

function setupEnv() {
  process.env.WHATSAPP_VERIFY_TOKEN = 'valid-verify-token-min-10';
  process.env.WHATSAPP_APP_SECRET = 'test-app-secret';
  process.env.WHATSAPP_ACCESS_TOKEN = 'test-access-token';
  process.env.WHATSAPP_PHONE_NUMBER_ID = '1234567890';
  process.env.NODE_ENV = 'development';
}

describe('Reply Service - sendAutoReply', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal('fetch', vi.fn());
    setupEnv();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should send POST request to Meta Graph API v25.0 with correct payload', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ messages: [{ id: 'wamid.response123' }] }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const { sendAutoReply } = await import('../src/services/reply.js');
    await sendAutoReply('5551234567', 'wamid.original456');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('https://graph.facebook.com/v25.0/1234567890/messages');
    expect(options.method).toBe('POST');
    expect(options.headers).toEqual({
      'Authorization': 'Bearer test-access-token',
      'Content-Type': 'application/json',
    });
    const body = JSON.parse(options.body);
    expect(body).toEqual({
      messaging_product: 'whatsapp',
      to: '5551234567',
      type: 'text',
      text: { body: expect.any(String) },
    });
    expect(body.text.body.length).toBeGreaterThan(0);
  });

  it('should use AUTO_REPLY_TEXT from config', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ messages: [{ id: 'wamid.response123' }] }),
    });
    vi.stubGlobal('fetch', mockFetch);

    process.env.AUTO_REPLY_TEXT = 'Custom reply message';

    const { sendAutoReply } = await import('../src/services/reply.js');
    await sendAutoReply('5551234567', 'wamid.original456');

    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.text.body).toBe('Custom reply message');
  });

  it('should throw on network error', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
    vi.stubGlobal('fetch', mockFetch);

    const { sendAutoReply } = await import('../src/services/reply.js');
    await expect(sendAutoReply('5551234567', 'wamid.original456')).rejects.toThrow('Network error');
  });

  it('should throw on non-ok HTTP response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: { message: 'Invalid parameter' } }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const { sendAutoReply } = await import('../src/services/reply.js');
    await expect(sendAutoReply('5551234567', 'wamid.original456')).rejects.toThrow('Failed to send reply: 400');
  });

  it('should throw on API error response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: { message: 'Invalid access token' } }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const { sendAutoReply } = await import('../src/services/reply.js');
    await expect(sendAutoReply('5551234567', 'wamid.original456')).rejects.toThrow('Failed to send reply: 401');
  });

  it('should not retry on failure (single attempt)', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
    vi.stubGlobal('fetch', mockFetch);

    const { sendAutoReply } = await import('../src/services/reply.js');
    await expect(sendAutoReply('5551234567', 'wamid.original456')).rejects.toThrow();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});