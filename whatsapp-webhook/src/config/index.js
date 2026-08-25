/**
 * Configuration module for WhatsApp Business API webhook service.
 * Validates required environment variables on module load (startup) and exports typed config.
 */

const REQUIRED_VARS = [
  'WHATSAPP_VERIFY_TOKEN',
  'WHATSAPP_APP_SECRET',
  'WHATSAPP_ACCESS_TOKEN',
  'WHATSAPP_PHONE_NUMBER_ID',
];

const MIN_VERIFY_TOKEN_LENGTH = 10;
const VALID_NODE_ENVS = ['development', 'production'];
const DEFAULT_PORT = 3000;
const DEFAULT_NODE_ENV = 'development';

/**
 * Validates environment variables and returns config object.
 * @returns {Object} Validated configuration object
 * @throws {Error} If any required variable is missing or invalid
 */
function validateConfig() {
  const missing = REQUIRED_VARS.filter((varName) => !process.env[varName]);
  if (missing.length > 0) {
    throw new Error(`${missing[0]} is required`);
  }

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
  if (verifyToken.length < MIN_VERIFY_TOKEN_LENGTH) {
    throw new Error(`WHATSAPP_VERIFY_TOKEN must be at least ${MIN_VERIFY_TOKEN_LENGTH} characters`);
  }

  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!/^\d+$/.test(phoneNumberId)) {
    throw new Error('WHATSAPP_PHONE_NUMBER_ID must be a numeric string');
  }

  const nodeEnv = process.env.NODE_ENV || DEFAULT_NODE_ENV;
  if (!VALID_NODE_ENVS.includes(nodeEnv)) {
    throw new Error('NODE_ENV must be development or production');
  }

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : DEFAULT_PORT;
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be a valid port number (1-65535)');
  }

  return {
    verifyToken,
    appSecret: process.env.WHATSAPP_APP_SECRET,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    phoneNumberId,
    port,
    nodeEnv,
  };
}

// Validate and export config immediately on module load (startup)
const config = validateConfig();

/**
 * Default auto-reply message in Spanish.
 * Can be overridden via AUTO_REPLY_TEXT environment variable.
 */
export const AUTO_REPLY_TEXT =
  process.env.AUTO_REPLY_TEXT ||
  'Hola! 👋 Soy el asistente de AudioGem. Recibimos tu consulta y en breve te respondemos. ¡Gracias por escribirnos!';

export { config };