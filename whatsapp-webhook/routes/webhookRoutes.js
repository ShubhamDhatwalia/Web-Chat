import { Router } from 'express';
const router = Router();
import { verifyWebhook, handleWebhook, sendTextMessage } from '../controllers/webhookControllers.js';

// Define the routes for the webhook
router.get('/webhook', verifyWebhook);  
router.post('/webhook', handleWebhook); 
router.post('/sendMessage', sendTextMessage);



export default router;
