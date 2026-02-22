const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let isClientReady = false;

// Initialize WhatsApp Client with LocalAuth to save session
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        // add some args if needed
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('\n--- WHATSAPP QR CODE ---');
    console.log('Please scan the QR code below using your WhatsApp to link the bot:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp Web Client is READY!');
    isClientReady = true;
});

client.on('authenticated', () => {
    console.log('✅ WhatsApp Initial Authentication Successful');
});

client.on('auth_failure', msg => {
    console.error('❌ WhatsApp Authentication failure', msg);
});

client.initialize();

/**
 * Send a WhatsApp Message
 * @param {string} phone - Sri Lankan Mobile Number
 * @param {string} message - Content
 */
const sendWhatsAppMessage = async (phone, message) => {
    if (!isClientReady) {
        console.log('WhatsApp is not ready yet. Cannot send message to:', phone);
        return false;
    }

    try {
        // Format Phone Number to WhatsApp Format (remove non-digits, replace 0 with 94 if needed)
        let formattedPhone = phone.replace(/\D/g, '');

        // Basic formatting for Sri Lanka (starts with 0, length 10)
        if (formattedPhone.startsWith('0') && formattedPhone.length === 10) {
            formattedPhone = '94' + formattedPhone.substring(1);
        } else if (formattedPhone.length === 9) {
            formattedPhone = '94' + formattedPhone;
        }

        const chatId = formattedPhone + '@c.us';

        await client.sendMessage(chatId, message);
        console.log(`✅ WhatsApp message sent to ${formattedPhone}`);
        return true;
    } catch (err) {
        console.error('❌ Error sending WhatsApp message:', err);
        return false;
    }
};

module.exports = { client, sendWhatsAppMessage };
