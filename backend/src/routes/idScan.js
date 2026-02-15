const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Tesseract = require('tesseract.js');
const sharp = require('sharp');

// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// OCR function using Tesseract.js
async function extractIdData(imageBuffer) {
    try {
        // Preprocess image for better OCR results
        const processedImage = await sharp(imageBuffer)
            .greyscale()
            .normalize()
            .sharpen()
            .toBuffer();

        // Perform OCR
        const { data: { text } } = await Tesseract.recognize(
            processedImage,
            'eng',
            {
                logger: m => console.log(m)
            }
        );

        console.log('Extracted text:', text);

        // Parse the extracted text
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        let fullName = null;
        let address = null;
        let contactNumber = null;
        let idNumber = null;

        // Common patterns for Sri Lankan NIC
        const nicPattern = /\b\d{9}[vVxX]\b|\b\d{12}\b/;

        // Phone number patterns
        const phonePattern = /(?:\+94|0)?[0-9]{9,10}/;

        // Try to extract data
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Look for NIC number
            if (nicPattern.test(line) && !idNumber) {
                idNumber = line.match(nicPattern)[0];
            }

            // Look for phone number
            if (phonePattern.test(line) && !contactNumber) {
                const match = line.match(phonePattern);
                if (match) {
                    contactNumber = match[0];
                    // Format to +94 format if needed
                    if (contactNumber.startsWith('0')) {
                        contactNumber = '+94' + contactNumber.substring(1);
                    } else if (!contactNumber.startsWith('+')) {
                        contactNumber = '+94' + contactNumber;
                    }
                }
            }

            // Look for name
            if (!fullName) {
                const lowerLine = line.toLowerCase();

                // Explicit "Name", "Full Name", "Surname", "Other Names" keywords
                if (lowerLine.includes('name') || lowerLine.includes('surname')) {
                    const namePart = line.replace(/(full\s+)?(sur)?name(s)?[:.]?\s*/i, '').trim();

                    if (namePart.length > 2 && !/\d/.test(namePart)) {
                        fullName = namePart;
                    } else if (i + 1 < lines.length) {
                        // Check next line if current line is just a label
                        const nextLine = lines[i + 1].trim();
                        if (nextLine.length > 2 && !/\d/.test(nextLine)) {
                            fullName = nextLine;
                        }
                    }
                }
                // Heuristic: ALL CAPS line with sufficient length, usually near top (index < 8)
                // Exclude common non-name headers
                else if (i < 8 &&
                    line.length > 4 &&
                    line.length < 50 &&
                    /^[A-Z\s.]+$/.test(line) && // Allow dots for initials
                    !line.includes('SRI LANKA') &&
                    !line.includes('NATIONAL') &&
                    !line.includes('IDENTITY') &&
                    !line.includes('CARD')) {
                    fullName = line;
                }
            }

            // Look for address
            if (line.toLowerCase().includes('address') && !address) {
                // Check if address starts on this line
                const addressPart = line.replace(/address[:.]?\s*/i, '').trim();
                const addressLines = [];

                if (addressPart.length > 2) addressLines.push(addressPart);

                // Add subsequent lines
                for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
                    if (lines[j] && !nicPattern.test(lines[j]) && !phonePattern.test(lines[j])) {
                        addressLines.push(lines[j]);
                    }
                }
                if (addressLines.length > 0) address = addressLines.join(', ');
            }
        }

        return {
            fullName: fullName || null,
            address: address || null,
            contactNumber: contactNumber || "",
            idNumber: idNumber || null,
            dateOfBirth: null,
            nationality: "Sri Lankan",
            gender: null,
            expiryDate: null
        };

    } catch (error) {
        console.error('OCR Error:', error);
        throw error;
    }
}

// POST /api/scan-id - Process uploaded ID/Passport image
router.post('/scan-id', upload.single('idImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        console.log('Processing ID image:', req.file.originalname);

        // Extract data from the uploaded image
        const extractedData = await extractIdData(req.file.buffer);

        console.log('Extracted data:', extractedData);

        // Return extracted data
        res.json(extractedData);

    } catch (error) {
        console.error('ID scan error:', error);
        res.status(500).json({
            message: 'Failed to process ID image. Please enter details manually.',
            error: error.message
        });
    }
});

module.exports = router;
