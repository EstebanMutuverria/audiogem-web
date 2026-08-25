/**
 * Entry point for WhatsApp Business API webhook service.
 * Bootstraps Express app with middleware chain and starts HTTP server.
 */

import express from 'express';
import { config } from './config/index.js';
import { webhookRoutes } from './routes/webhook.js';

/**
 * Creates and configures the Express application.
 * Middleware chain for POST /webhook/whatsapp:
 * 1. express.raw({ type: 'application/json' }) - capture raw body for signature validation
 * 2. signatureValidationMiddleware (in routes) - verify X-Hub-Signature-256
 * 3. idempotencyMiddleware (in routes) - check/mark message ID
 * 4. express.json() - parse JSON body
 * 5. receiveController (in routes) - handle message
 * @returns {import('express').Express} Configured Express application
 */
export function createApp() {
  const app = express();

  // Raw body parser for signature validation (must be before json parser)
  // Only apply to webhook endpoint to avoid interfering with other routes
  app.use('/webhook/whatsapp', express.raw({ type: 'application/json' }));

  // Mount webhook routes (includes signature validation, idempotency, controllers)
  app.use(webhookRoutes);

  // JSON parser for other routes (health check, etc.)
  app.use(express.json());

  return app;
}

/**
 * Starts the HTTP server.
 * @returns {Promise<import('http').Server>} Started HTTP server
 */
export async function startServer() {
  const app = createApp();
  const port = config.port;

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      process.stdout.write(`WhatsApp webhook server listening on port ${port}\n`);
      process.stdout.write(`Environment: ${config.nodeEnv}\n`);
      resolve(server);
    });
  });
}

// Start server if this module is run directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer().catch((error) => {
    process.stderr.write(`Failed to start server: ${error.message}\n`);
    process.exit(1);
  });
}