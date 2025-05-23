#!/usr/bin/env python3
"""
Curio - A chatbot powered by Google's Gemini API
"""

import os
import google.generativeai as genai
from flask import Flask, request, jsonify, send_from_directory

# Initialize Flask app
app = Flask(__name__, static_folder='build')

# Configure the Gemini API using the API key from environment variables
api_key = os.environ.get("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("Missing GOOGLE_API_KEY environment variable")

# Set the API key for Gemini
genai.configure(api_key=api_key)

# Initialize the Gemini model
model = genai.GenerativeModel("gemini-pro")

@app.route('/api/chat', methods=['POST'])
def chat():
    """API endpoint to process chat messages"""
    if not request.json:
        return jsonify({'response': 'Invalid request format. JSON expected.'}), 400
    
    user_message = request.json.get('message', '')
    
    if not user_message:
        return jsonify({'response': 'Please enter a message.'})
    
    try:
        # Generate a response using Gemini
        response = model.generate_content(user_message)
        
        # Extract the text from the response
        if hasattr(response, 'text'):
            return jsonify({'response': response.text})
        else:
            return jsonify({'response': 'I couldn\'t generate a response. Please try again.'})
    except Exception as e:
        print(f"Error generating response: {str(e)}")
        return jsonify({'response': f"Sorry, I encountered an error: {str(e)}"})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)