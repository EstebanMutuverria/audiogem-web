import { describe, it, expect, vi, beforeEach } from 'vitest';

// RED: Tests for detection service - these will fail until src/services/detection.js is implemented

describe('Detection Service - isWebOriginMessage', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should return true for "Hola AudioGem!" prefix', async () => {
    const { isWebOriginMessage } = await import('../src/services/detection.js');
    const result = isWebOriginMessage('Hola AudioGem! Quiero realizar una consulta.');
    expect(result).toBe(true);
  });

  it('should return true for "Hola AudioGem!" with different case', async () => {
    const { isWebOriginMessage } = await import('../src/services/detection.js');
    const result = isWebOriginMessage('HOLA AUDIOGEM! Quiero realizar una consulta.');
    expect(result).toBe(true);
  });

  it('should return true for "Hola AudioGem!" with leading/trailing whitespace', async () => {
    const { isWebOriginMessage } = await import('../src/services/detection.js');
    const result = isWebOriginMessage('  Hola AudioGem! Quiero realizar una consulta.  ');
    expect(result).toBe(true);
  });

  it('should return true for "Pedido de AudioGem 🛒" prefix', async () => {
    const { isWebOriginMessage } = await import('../src/services/detection.js');
    const result = isWebOriginMessage('Pedido de AudioGem 🛒 Producto X - Cantidad 2');
    expect(result).toBe(true);
  });

  it('should return true for "Pedido de AudioGem 🛒" with different case', async () => {
    const { isWebOriginMessage } = await import('../src/services/detection.js');
    const result = isWebOriginMessage('PEDIDO DE AUDIOGEM 🛒 Producto X - Cantidad 2');
    expect(result).toBe(true);
  });

  it('should return true for "Pedido de AudioGem 🛒" with leading/trailing whitespace', async () => {
    const { isWebOriginMessage } = await import('../src/services/detection.js');
    const result = isWebOriginMessage('  Pedido de AudioGem 🛒 Producto X - Cantidad 2  ');
    expect(result).toBe(true);
  });

  it('should return true for "Pedido de AudioGem" with emoji variation (normalized)', async () => {
    const { isWebOriginMessage } = await import('../src/services/detection.js');
    // Emoji normalization: 🛒 (U+1F6D2) should match
    const result = isWebOriginMessage('Pedido de AudioGem 🛒 test');
    expect(result).toBe(true);
  });

  it('should return false for non-matching message "Hola, ¿cómo estás?"', async () => {
    const { isWebOriginMessage } = await import('../src/services/detection.js');
    const result = isWebOriginMessage('Hola, ¿cómo estás?');
    expect(result).toBe(false);
  });

  it('should return false for partial match "Hola AudioGem" without exclamation', async () => {
    const { isWebOriginMessage } = await import('../src/services/detection.js');
    const result = isWebOriginMessage('Hola AudioGem quiero consultar');
    expect(result).toBe(false);
  });

  it('should return false for partial match "Pedido de AudioGem" without emoji', async () => {
    const { isWebOriginMessage } = await import('../src/services/detection.js');
    const result = isWebOriginMessage('Pedido de AudioGem producto X');
    expect(result).toBe(false);
  });

  it('should return false for empty string', async () => {
    const { isWebOriginMessage } = await import('../src/services/detection.js');
    const result = isWebOriginMessage('');
    expect(result).toBe(false);
  });

  it('should return false for whitespace only', async () => {
    const { isWebOriginMessage } = await import('../src/services/detection.js');
    const result = isWebOriginMessage('   ');
    expect(result).toBe(false);
  });

  it('should return false for null/undefined input', async () => {
    const { isWebOriginMessage } = await import('../src/services/detection.js');
    expect(isWebOriginMessage(null)).toBe(false);
    expect(isWebOriginMessage(undefined)).toBe(false);
  });

  it('should return false for message with only emoji', async () => {
    const { isWebOriginMessage } = await import('../src/services/detection.js');
    const result = isWebOriginMessage('🛒');
    expect(result).toBe(false);
  });
});