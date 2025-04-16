const express = require('express');
const router = express.Router();

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Webhook verification (GET)
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified!');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook message receiver (POST)
router.post('/webhook', (req, res) => {
  const body = req.body;

  console.log('📩 Webhook Received:', JSON.stringify(body, null, 2));

  // You can save to DB or emit to frontend here

  res.sendStatus(200);
});

module.exports = router;
