import { Router } from 'express';
const router = Router();
import { verifyWebhook, handleWebhook } from '../controllers/webhookControllers.js';

// Define the routes for the webhook
router.get('/webhook', verifyWebhook);  // For verification
router.post('/webhook', handleWebhook); // For handling incoming messages

export default router;
