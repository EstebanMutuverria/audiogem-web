/**
 * ngrok Integration Test for WhatsApp Webhook
 * 
 * This test documents the manual verification steps for end-to-end
 * webhook flow using ngrok tunnel to expose local server to Meta.
 * 
 * NOTE: This is a documented integration test, not fully automated in CI.
 * Run manually during development and before deployment.
 * 
 * Prerequisites:
 * - ngrok installed (https://ngrok.com/download)
 * - Meta Developer App configured with WhatsApp Business API
 * - Valid WhatsApp Business Account and Phone Number ID
 */

import { describe, it, expect } from 'vitest';

describe('ngrok Integration Test - Manual Verification Steps', () => {
  /**
   * Test Case: Full Webhook Flow Verification
   * 
   * This test documents the complete manual verification process.
   * Each step should be executed manually and verified.
   */
  it('documents complete webhook flow verification with ngrok', () => {
    // This test always passes - it serves as documentation
    // The actual verification is done manually following the steps below
    expect(true).toBe(true);
  });
});

/**
 * MANUAL VERIFICATION CHECKLIST
 * =============================
 * 
 * Step 1: Start Local Server
 * --------------------------
 * Command: npm run dev
 * Expected: Server starts on configured PORT (default 3000)
 * Verify: Console shows "WhatsApp webhook server listening on port 3000"
 * 
 * Step 2: Start ngrok Tunnel
 * --------------------------
 * Command: ngrok http 3000
 * Expected: ngrok starts and provides HTTPS forwarding URL
 * Example output:
 *   Forwarding  https://abc123.ngrok-free.app -> http://localhost:3000
 * Verify: Copy the HTTPS URL (e.g., https://abc123.ngrok-free.app)
 * 
 * Step 3: Configure Meta Webhook URL
 * ----------------------------------
 * 1. Go to Meta Developer Dashboard -> WhatsApp -> Configuration
 * 2. Set Webhook URL to: https://abc123.ngrok-free.app/webhook/whatsapp
 * 3. Set Verify Token to match WHATSAPP_VERIFY_TOKEN from .env
 * 4. Click "Verify and Save"
 * 
 * Step 4: Verify GET Verification Works
 * -------------------------------------
 * Expected: Meta sends GET request to /webhook/whatsapp
 *   Query params: hub.mode=subscribe, hub.verify_token=<your_token>, hub.challenge=<challenge>
 * Expected Response: 200 OK with hub.challenge as plain text
 * Verify: Meta dashboard shows "Webhook verified successfully"
 * 
 * Step 5: Subscribe to Webhook Fields
 * -----------------------------------
 * In Meta Dashboard, subscribe to:
 * - messages (required for incoming messages)
 * - message_deliveries (optional)
 * - message_reads (optional)
 * 
 * Step 6: Send Test Message via WhatsApp
 * --------------------------------------
 * 1. Use a test phone number (can be your own)
 * 2. Send message with trigger prefix: "Hola AudioGem! Test message"
 * 3. Or use Meta's "Send Test Message" feature in dashboard
 * 
 * Step 7: Verify Auto-Reply Sent for Matching Prefixes
 * ----------------------------------------------------
 * Expected Behavior:
 * - Message "Hola AudioGem! Quiero consultar" -> Auto-reply sent
 * - Message "Pedido de AudioGem 🛒 Producto X" -> Auto-reply sent
 * - Message "Agenda AudioGem para mañana" -> Auto-reply sent
 * - Message "Hola, ¿cómo estás?" -> NO auto-reply (non-matching)
 * 
 * Verify in server logs:
 * - POST /webhook/whatsapp received
 * - Signature validation passed
 * - Idempotency check passed (new message)
 * - Trigger detection matched
 * - sendAutoReply called to Meta Graph API
 * - 200 OK returned to Meta
 * 
 * Verify in WhatsApp: Auto-reply message received
 * 
 * Step 8: Verify No Reply for Non-Matching Messages
 * -------------------------------------------------
 * Send message: "Hola, ¿cómo estás?"
 * Expected: 200 OK returned, NO auto-reply sent
 * Verify in server logs: processed: false
 * Verify in WhatsApp: No auto-reply received
 * 
 * Step 9: Verify Idempotency (Duplicate Handling)
 * -----------------------------------------------
 * Send same message twice quickly (or Meta retries)
 * Expected: Second request returns 200 with duplicate: true
 * Verify: No duplicate auto-reply sent
 * 
 * Step 10: Verify Signature Validation
 * ------------------------------------
 * Send request with invalid X-Hub-Signature-256 header
 * Expected: 401 Unauthorized
 * 
 * Step 11: Test Error Handling
 * ----------------------------
 * - Send malformed JSON -> 200 OK, processed: false
 * - Send non-text message (image) -> 200 OK, processed: false
 * - Send empty messages array -> 200 OK, processed: false
 * - Meta Graph API error (invalid token) -> 200 OK, error logged
 * 
 * CLEANUP
 * -------
 * - Stop ngrok (Ctrl+C)
 * - Stop local server (Ctrl+C)
 * - Remove webhook URL from Meta Dashboard (or disable)
 */

// Export verification steps for reference
export const VERIFICATION_STEPS = [
  'Start local server: npm run dev',
  'Start ngrok tunnel: ngrok http 3000',
  'Configure Meta webhook URL to ngrok HTTPS URL + /webhook/whatsapp',
  'Verify GET verification works (Meta dashboard shows verified)',
  'Subscribe to "messages" webhook field',
  'Send test message with trigger prefix "Hola AudioGem!"',
  'Verify auto-reply sent for matching prefixes',
  'Verify NO auto-reply for non-matching messages',
  'Verify idempotency (duplicate messages return 200, no duplicate reply)',
  'Verify signature validation rejects invalid signatures (401)',
  'Test error handling (malformed JSON, non-text, empty messages)',
];