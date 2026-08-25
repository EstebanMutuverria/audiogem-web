import { describe, it, expect, vi, beforeEach } from 'vitest';

// RED: Tests for config validation - these will fail until src/config/index.js is implemented

describe('Config Module - Environment Validation', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  it('should throw descriptive error when WHATSAPP_VERIFY_TOKEN is missing', async () => {
    delete process.env.WHATSAPP_VERIFY_TOKEN;
    process.env.WHATSAPP_APP_SECRET = 'app-secret';
    process.env.WHATSAPP_ACCESS_TOKEN = 'access-token';
    process.env.WHATSAPP_PHONE_NUMBER_ID = '1234567890';

    await expect(import('../src/config/index.js')).rejects.toThrow('WHATSAPP_VERIFY_TOKEN is required');
  });

  it('should throw descriptive error when WHATSAPP_VERIFY_TOKEN is less than 10 characters', async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = 'short';
    process.env.WHATSAPP_APP_SECRET = 'app-secret';
    process.env.WHATSAPP_ACCESS_TOKEN = 'access-token';
    process.env.WHATSAPP_PHONE_NUMBER_ID = '1234567890';

    await expect(import('../src/config/index.js')).rejects.toThrow('WHATSAPP_VERIFY_TOKEN must be at least 10 characters');
  });

  it('should throw descriptive error when WHATSAPP_APP_SECRET is missing', async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = 'valid-verify-token';
    delete process.env.WHATSAPP_APP_SECRET;
    process.env.WHATSAPP_ACCESS_TOKEN = 'access-token';
    process.env.WHATSAPP_PHONE_NUMBER_ID = '1234567890';

    await expect(import('../src/config/index.js')).rejects.toThrow('WHATSAPP_APP_SECRET is required');
  });

  it('should throw descriptive error when WHATSAPP_ACCESS_TOKEN is missing', async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = 'valid-verify-token';
    process.env.WHATSAPP_APP_SECRET = 'app-secret';
    delete process.env.WHATSAPP_ACCESS_TOKEN;
    process.env.WHATSAPP_PHONE_NUMBER_ID = '1234567890';

    await expect(import('../src/config/index.js')).rejects.toThrow('WHATSAPP_ACCESS_TOKEN is required');
  });

  it('should throw descriptive error when WHATSAPP_PHONE_NUMBER_ID is missing', async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = 'valid-verify-token';
    process.env.WHATSAPP_APP_SECRET = 'app-secret';
    process.env.WHATSAPP_ACCESS_TOKEN = 'access-token';
    delete process.env.WHATSAPP_PHONE_NUMBER_ID;

    await expect(import('../src/config/index.js')).rejects.toThrow('WHATSAPP_PHONE_NUMBER_ID is required');
  });

  it('should throw descriptive error when WHATSAPP_PHONE_NUMBER_ID is not numeric', async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = 'valid-verify-token';
    process.env.WHATSAPP_APP_SECRET = 'app-secret';
    process.env.WHATSAPP_ACCESS_TOKEN = 'access-token';
    process.env.WHATSAPP_PHONE_NUMBER_ID = 'not-a-number';

    await expect(import('../src/config/index.js')).rejects.toThrow('WHATSAPP_PHONE_NUMBER_ID must be a numeric string');
  });

  it('should use default PORT 3000 when not specified', async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = 'valid-verify-token';
    process.env.WHATSAPP_APP_SECRET = 'app-secret';
    process.env.WHATSAPP_ACCESS_TOKEN = 'access-token';
    process.env.WHATSAPP_PHONE_NUMBER_ID = '1234567890';
    delete process.env.PORT;
    // Ensure NODE_ENV is valid for test environment
    process.env.NODE_ENV = 'development';

    const { config } = await import('../src/config/index.js');
    expect(config.port).toBe(3000);
  });

  it('should use custom PORT when specified', async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = 'valid-verify-token';
    process.env.WHATSAPP_APP_SECRET = 'app-secret';
    process.env.WHATSAPP_ACCESS_TOKEN = 'access-token';
    process.env.WHATSAPP_PHONE_NUMBER_ID = '1234567890';
    process.env.PORT = '4000';
    process.env.NODE_ENV = 'development';

    const { config } = await import('../src/config/index.js');
    expect(config.port).toBe(4000);
  });

  it('should default NODE_ENV to development', async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = 'valid-verify-token';
    process.env.WHATSAPP_APP_SECRET = 'app-secret';
    process.env.WHATSAPP_ACCESS_TOKEN = 'access-token';
    process.env.WHATSAPP_PHONE_NUMBER_ID = '1234567890';
    delete process.env.NODE_ENV;

    const { config } = await import('../src/config/index.js');
    expect(config.nodeEnv).toBe('development');
  });

  it('should accept production NODE_ENV', async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = 'valid-verify-token';
    process.env.WHATSAPP_APP_SECRET = 'app-secret';
    process.env.WHATSAPP_ACCESS_TOKEN = 'access-token';
    process.env.WHATSAPP_PHONE_NUMBER_ID = '1234567890';
    process.env.NODE_ENV = 'production';

    const { config } = await import('../src/config/index.js');
    expect(config.nodeEnv).toBe('production');
  });

  it('should throw on invalid NODE_ENV', async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = 'valid-verify-token';
    process.env.WHATSAPP_APP_SECRET = 'app-secret';
    process.env.WHATSAPP_ACCESS_TOKEN = 'access-token';
    process.env.WHATSAPP_PHONE_NUMBER_ID = '1234567890';
    process.env.NODE_ENV = 'invalid';

    await expect(import('../src/config/index.js')).rejects.toThrow('NODE_ENV must be development or production');
  });

  it('should export all required config properties with correct types', async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = 'valid-verify-token';
    process.env.WHATSAPP_APP_SECRET = 'app-secret';
    process.env.WHATSAPP_ACCESS_TOKEN = 'access-token';
    process.env.WHATSAPP_PHONE_NUMBER_ID = '1234567890';
    process.env.NODE_ENV = 'development';

    const { config } = await import('../src/config/index.js');
    expect(config).toHaveProperty('verifyToken');
    expect(config).toHaveProperty('appSecret');
    expect(config).toHaveProperty('accessToken');
    expect(config).toHaveProperty('phoneNumberId');
    expect(config).toHaveProperty('port');
    expect(config).toHaveProperty('nodeEnv');
    expect(typeof config.verifyToken).toBe('string');
    expect(typeof config.appSecret).toBe('string');
    expect(typeof config.accessToken).toBe('string');
    expect(typeof config.phoneNumberId).toBe('string');
    expect(typeof config.port).toBe('number');
    expect(['development', 'production']).toContain(config.nodeEnv);
  });

  it('should export AUTO_REPLY_TEXT constant', async () => {
    process.env.WHATSAPP_VERIFY_TOKEN = 'valid-verify-token';
    process.env.WHATSAPP_APP_SECRET = 'app-secret';
    process.env.WHATSAPP_ACCESS_TOKEN = 'access-token';
    process.env.WHATSAPP_PHONE_NUMBER_ID = '1234567890';
    process.env.NODE_ENV = 'development';

    const { AUTO_REPLY_TEXT } = await import('../src/config/index.js');
    expect(typeof AUTO_REPLY_TEXT).toBe('string');
    expect(AUTO_REPLY_TEXT.length).toBeGreaterThan(0);
  });
});