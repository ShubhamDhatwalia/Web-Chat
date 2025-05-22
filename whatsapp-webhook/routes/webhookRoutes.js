import { Router } from 'express';
const router = Router();
import { verifyWebhook, handleWebhook, sendTextMessage, sendSimpleTextMessage } from '../controllers/webhookControllers.js';


router.get('/webhook', verifyWebhook);
router.post('/webhook', handleWebhook);
router.post('/sendMessage', sendTextMessage);
router.post('/sendSimpleTextMessage', sendSimpleTextMessage); // For sending messages to a specific user



export default router;
