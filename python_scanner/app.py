from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
import io
import json
import base64
from PIL import Image

app = Flask(__name__)
CORS(app)

# --- CONFIGURATION ---
# Get your API key from https://aistudio.google.com/
GEMINI_API_KEY = "AIzaSyAfbDhJL_-4rgLg2NBSOjfj5p885w36_Sg"
genai.configure(api_key=GEMINI_API_KEY)

def extract_id_data(image_bytes, mime_type):
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    # Prepare image for Gemini
    image_data = {
        'mime_type': mime_type,
        'data': image_bytes
    }
    
    prompt = """
    Analyze this ID card or Passport image and extract the following information.
    Return ONLY a valid JSON object with these keys:
    {
        "fullName": "Full name of the person",
        "idNumber": "ID card or Passport number",
        "dateOfBirth": "Date of birth in YYYY-MM-DD format",
        "gender": "Male, Female, or Other",
        "contactNumber": "Phone number if visible, otherwise empty string",
        "email": "Email address if visible, otherwise empty string"
    }
    If information is not visible, use an empty string. Do not include markdown ticks.
    """
    
    response = model.generate_content([prompt, image_data])
    
    # Clean up the output to ensure it's valid JSON
    text = response.text.replace('```json', '').replace('```', '').strip()
    return json.loads(text)

@app.route('/api/scan-id', methods=['POST'])
def scan_id():
    if 'idImage' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    file = request.files['idImage']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Read file as bytes
        img_bytes = file.read()
        mime_type = file.content_type
        
        # Call Gemini
        extracted_data = extract_id_data(img_bytes, mime_type)
        return jsonify(extracted_data)

    except Exception as e:
        print(f"Error processing ID: {e}")
        return jsonify({"error": "Failed to scan image. Please enter details manually."}), 500

if __name__ == '__main__':
    # Running on port 8082 to avoid conflict with Java (8080) and Node (8081)
    print("Python ID Scanner running on http://localhost:8082")
    app.run(host='0.0.0.0', port=8082)
