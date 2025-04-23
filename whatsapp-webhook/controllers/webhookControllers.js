import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';





export function verifyWebhook(req, res) {
    console.log('Received verification request:', req.query);


    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('Verification request:', { mode, token, challenge });

    if (token === process.env.VERIFY_TOKEN) {
        console.log('Webhook verified!');
        return res.status(200).send(challenge);
    } else {
        console.error('Verification failed');
        return res.status(403).send('Verification failed');
    }
}





export async function sendTextMessage(req, res) {
    const { to, template } = req.body;

    const url = `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`;

    const data = {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Template sent:', response.data);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Failed to send template:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    }
}




// Function to get media URL using media ID
async function getMediaUrl(mediaId) {
    const url = `https://graph.facebook.com/v13.0/${mediaId}`;
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`
            }
        });
        return response.data.url;
    } catch (error) {
        console.error('Error retrieving media URL:', error);
        return null;
    }
}



// Function to handle the incoming webhook
export async function handleWebhook(req, res) {
    const body = req.body;
    console.log('Incoming webhook data:', JSON.stringify(body, null, 2)); // Improved logging

    // Check if entries and changes exist
    if (!body.entry || !body.entry[0].changes) {
        console.error('Invalid webhook structure:', body);
        return res.sendStatus(400); // Bad request if the structure is wrong
    }

    // Handle the incoming message
    const change = body.entry[0].changes[0];
    const message = change?.value?.messages?.[0];
    const statusUpdate = change?.value?.statuses?.[0];

    if (message) {
        console.log('New message received:', JSON.stringify(message, null, 2));

        const senderId = message.from;
        const messageId = message.id;
        const messageType = message.type;

        if (messageType === 'text') {
            const textContent = message.text.body;
            console.log(`Received text message: ${textContent}`);
        } else if (messageType === 'audio') {
            const audioId = message.audio.id;
            console.log(`Received audio message with ID: ${audioId}`);
            // Fetch media URL
            const mediaUrl = await getMediaUrl(audioId);
            if (mediaUrl) {
                console.log(`Audio message URL: ${mediaUrl}`);
            }
        } else {
            console.log(`Received unsupported message type: ${messageType}`);
        }
    }

    // Handle message status updates
    if (statusUpdate) {
        console.log('Message status update:', JSON.stringify(statusUpdate, null, 2));

        const { status, message_id, timestamp, recipient_id } = statusUpdate;
        console.log(`Message ID: ${message_id}`);
        console.log(`Status: ${status}`);  // Possible values: "sent", "delivered", "read"
        console.log(`Timestamp: ${timestamp}`);
        console.log(`Recipient: ${recipient_id}`);
        
        // Custom logic for message status (e.g., store status in database, notify user, etc.)
        if (status === 'delivered') {
            console.log('Message delivered successfully!');
        } else if (status === 'read') {
            console.log('Message was read!');
        }
    }

    res.sendStatus(200); // Respond with success
}

