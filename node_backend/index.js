const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

// Add your GEMINI API KEY in a .env file as GEMINI_API_KEY=your_key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_FALLBACK_API_KEY_HERE");

app.post('/api/scan-id', upload.single('idImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const imagePart = {
            inlineData: {
                data: req.file.buffer.toString("base64"),
                mimeType: req.file.mimetype
            },
        };

        const prompt = `
        Analyze this ID card/Passport image and extract the following information.
        Please return ONLY a valid JSON object with these exact keys, and no markdown formatting or other text:
        {
            "fullName": "extract full name",
            "idNumber": "extract ID or passport number",
            "dateOfBirth": "extract DOB in YYYY-MM-DD format if possible",
            "gender": "extract Male/Female/Other",
            "contactNumber": "extract phone number if present, otherwise leave empty"
        }
        If any field is not visible, use an empty string.`;

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        let text = response.text();
        
        // Clean up formatting if Gemini added markdown ticks
        text = text.replace(/```json\n?|\n?```/g, '');
        
        try {
            const extractedData = JSON.parse(text);
            res.json(extractedData);
        } catch (jsonErr) {
            console.error("Failed to parse Gemini JSON:", text);
            res.status(500).json({ error: 'Failed to parse extracted data' });
        }

    } catch (error) {
        console.error('OCR Error:', error);
        res.status(500).json({ error: 'Failed to process ID image.' });
    }
});

const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Node OCR scan service running on http://localhost:${PORT}`);
});
