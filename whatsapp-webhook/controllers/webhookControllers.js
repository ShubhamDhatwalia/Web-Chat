import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';



const testing_chatbot = {
    name: "testing_chatbot",
    language: {
      code: "en_US"
    },
    components: [
      {
        type: "HEADER",
        parameters: [
          {
            type: "text",
            text: "Stark Edge",
            parameter_name: "company_name"
          }
        ]
      },
      {
        type: "BODY",
        parameters: [
          {
            type: "text",
            text: "Stark Edge",
            parameter_name: "company_name"
          }
        ]
      },
    ]
  };
  






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

async function sendTemplateMessage(to, template, languageCode = 'en_US') {
    const url = `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`;

    const data = {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: template
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Template message sent:', response.data);
    } catch (error) {
        console.error('Failed to send template message:', error.response?.data || error.message);
    }
}


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



export async function handleWebhook(req, res) {
    const body = req.body;

    if (!body.entry || !body.entry[0].changes) {
        console.error('Invalid webhook structure:', body);
        return res.sendStatus(400);
    }

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
            if (textContent.toLowerCase() === 'hey' || textContent.toLowerCase() === 'hi') {
                console.log("keyword mattched")
                await sendTemplateMessage(senderId, testing_chatbot);
            }

            
            console.log(`Received text message: ${textContent}`);
        } else if (messageType === 'audio') {
            const audioId = message.audio.id;
            console.log(`Received audio message with ID: ${audioId}`);
            const mediaUrl = await getMediaUrl(audioId);
            if (mediaUrl) {
                console.log(`Audio message URL: ${mediaUrl}`);
            }
        }else if(messageType === 'button'){

            const textContent = message.text.body;

            if(textContent.toLowerCase() === 'sure'){
                await sendTemplateMessage(senderId, testing_chatbot);
            }

        } else {
            console.log(`Received unsupported message type: ${messageType}`);
        }
    }

    if (statusUpdate) {
        console.log('Message status update:', JSON.stringify(statusUpdate, null, 2));

        const { status, id, timestamp, recipient_id } = statusUpdate;


        if (status === 'delivered') {
            console.log('Message delivered successfully!');
        } else if (status === 'read') {
            console.log('Message was read!');
        }
    }

    res.sendStatus(200);
}

