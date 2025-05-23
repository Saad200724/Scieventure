#!/usr/bin/env python3
"""
Curio - A chatbot powered by Google's Gemini API with PostgreSQL database
"""

import os
import google.generativeai as genai
from flask import Flask, request, jsonify, render_template
from models import init_db, ChatMessage
from sqlalchemy.orm import Session

# Initialize Flask app with template folder
app = Flask(__name__)

# Configure the Gemini API using the API key from environment variables
# Try to use the second key first, fall back to first key if needed
api_key = os.environ.get("GOOGLE_API_KEY2")
if not api_key:
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("Missing API keys in environment variables")

# Set the API key for Gemini
genai.configure(api_key=api_key)

# Using a model that's known to be available
try:
    # Using one of the models we know is available from the output
    model = genai.GenerativeModel("gemini-1.5-flash")
    print("Successfully initialized gemini-1.5-flash model")
except Exception as e:
    print(f"Error initializing gemini-1.5-flash: {e}")
    # Fall back to a simpler model if needed
    try:
        model = genai.GenerativeModel("models/gemini-1.5-flash")
        print("Successfully initialized models/gemini-1.5-flash model")
    except Exception as e:
        print(f"Error initializing models/gemini-1.5-flash: {e}")
        # Fallback mechanism if API fails
        class SimpleModel:
            def generate_content(self, text):
                class SimpleResponse:
                    def __init__(self, input_text):
                        self.text = f"I received your message: '{input_text}'. I've saved this to the database, but I'm currently experiencing connection issues with my AI service. Please try again later."
                return SimpleResponse(text)
        model = SimpleModel()
        print("Using SimpleModel fallback")

# Initialize the database
engine, SessionLocal = init_db()

# Database session dependency
def get_db():
    db = SessionLocal()
    try:
        return db
    finally:
        db.close()

@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')

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
            bot_response = response.text
            
            # Store the conversation in the database
            db = get_db()
            chat_message = ChatMessage(
                user_message=user_message,
                bot_response=bot_response
            )
            db.add(chat_message)
            db.commit()
            
            return jsonify({'response': bot_response})
        else:
            return jsonify({'response': 'I couldn\'t generate a response. Please try again.'})
    except Exception as e:
        error_message = str(e)
        print(f"Error generating response: {error_message}")
        
        # Handle rate limit errors more gracefully
        if "quota" in error_message.lower() or "429" in error_message:
            return jsonify({
                'response': "I'm currently experiencing high demand. Please try again in a moment while I'm processing your request."
            })
        
        return jsonify({'response': "I'm sorry, I'm having trouble connecting to my knowledge source right now. Please try again soon."})

@app.route('/api/history', methods=['GET'])
def get_chat_history():
    """API endpoint to retrieve chat history"""
    try:
        db = get_db()
        # Get all messages ordered by timestamp (newest first)
        messages = db.query(ChatMessage).order_by(ChatMessage.timestamp.desc()).all()
        
        # Format the messages for the response
        history = []
        for msg in messages:
            history.append({
                'id': msg.id,
                'user_message': msg.user_message,
                'bot_response': msg.bot_response,
                'timestamp': msg.timestamp.isoformat() if msg.timestamp is not None else None
            })
            
        return jsonify({'history': history})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)