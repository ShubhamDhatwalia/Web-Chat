import { Router } from 'express';
const router = Router();
import { verifyWebhook, handleWebhook, sendTemplateMessages, sendSimpleTextMessage } from '../controllers/webhookControllers.js';


router.get('/webhook', verifyWebhook);
router.post('/webhook', handleWebhook);
router.post('/sendTemplateMessages', sendTemplateMessages);
router.post('/sendTextMessage', sendSimpleTextMessage); // For sending messages to a specific user



export default router;
