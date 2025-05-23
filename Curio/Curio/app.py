#!/usr/bin/env python3
"""
Curio - A chatbot powered by Google's Gemini API with PostgreSQL database
Features: Bengali translation, file upload and research paper analysis
"""

import os
import google.generativeai as genai
from flask import Flask, request, jsonify, render_template, send_from_directory
from models import init_db, ChatMessage, ResearchPaper, FileUpload
from sqlalchemy.orm import Session
import uuid
import datetime
import mimetypes
import os.path

# Initialize Flask app with template folder
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Configure the Gemini API using the API key from environment variables
api_key = os.environ.get("GOOGLE_API_KEY2")
if not api_key:
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("Missing API keys in environment variables")

# Set the API key for Gemini
genai.api_key = api_key

# Using a model that's known to be available
try:
    # Using one of the models we know is available from the output
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("Successfully initialized gemini-1.5-flash model")
except Exception as e:
    print(f"Error initializing gemini-1.5-flash: {e}")
    # Fall back to a simpler model if needed
    try:
        model = genai.GenerativeModel('gemini-pro')
        print("Successfully initialized gemini-pro model")
    except Exception as e:
        print(f"Error initializing gemini-pro: {e}")
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
    translate_to_bengali = request.json.get('translate_to_bengali', False)
    
    if not user_message:
        return jsonify({'response': 'Please enter a message.'})
    
    try:
        # Generate a response using Gemini
        response = model.generate_content(user_message)
        
        # Extract the text from the response
        if hasattr(response, 'text'):
            bot_response = response.text
            
            # Get Bengali translation as a separate response only if requested
            bengali_translation = ""
            if translate_to_bengali:
                try:
                    translation_prompt = f"Translate the following text to Bengali: {bot_response}"
                    translation_response = model.generate_content(translation_prompt)
                    if hasattr(translation_response, 'text'):
                        bengali_translation = translation_response.text
                    else:
                        bengali_translation = "[Translation error]"
                except Exception as e:
                    print(f"Translation error: {str(e)}")
                    bengali_translation = f"[Translation failed: {str(e)}]"
            
            # Store the conversation in the database
            db = get_db()
            chat_message = ChatMessage(
                user_message=user_message,
                bot_response=bot_response,
                is_translated=translate_to_bengali
            )
            db.add(chat_message)
            db.commit()
            
            return jsonify({
                'response': bot_response,
                'bengali_translation': bengali_translation
            })
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

@app.route('/api/translate', methods=['POST'])
def translate():
    """API endpoint to translate text to Bengali"""
    if not request.json:
        return jsonify({'error': 'Invalid request format. JSON expected.'}), 400
    
    text = request.json.get('text', '')
    
    if not text:
        return jsonify({'error': 'Please provide text to translate.'})
    
    try:
        translation_prompt = f"Translate the following text to Bengali: {text}"
        response = model.generate_content(translation_prompt)
        
        if hasattr(response, 'text'):
            return jsonify({'translated_text': response.text})
        else:
            return jsonify({'error': 'Translation failed.'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """API endpoint to upload a file for analysis"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        # Generate a unique filename
        original_filename = file.filename
        file_extension = ""
        if original_filename and '.' in original_filename:
            file_extension = os.path.splitext(original_filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        
        # Save the file
        file.save(file_path)
        
        # Determine file type and prepare appropriate prompt
        mime_type, _ = mimetypes.guess_type(file_path)
        file_type = mime_type.split('/')[0] if mime_type else 'unknown'
        
        # Extract text or analyze the file
        analysis = "File uploaded successfully. "
        
        # For text-based files, read and analyze content
        if file_type == 'text' or file_extension.lower() in ['.txt', '.md', '.csv', '.json']:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Use AI to analyze the content
                analysis_prompt = f"Analyze this {file_type} file content and provide a summary:\n\n{content[:4000]}"
                if len(content) > 4000:
                    analysis_prompt += "...(content truncated due to length)"
                
                analysis_response = model.generate_content(analysis_prompt)
                if hasattr(analysis_response, 'text'):
                    analysis = analysis_response.text
            except Exception as e:
                analysis = f"Error analyzing file: {str(e)}"
        else:
            analysis = f"File uploaded successfully. File type '{file_type}' analysis is not supported."
        
        # Save file information to database
        try:
            db = get_db()
            file_upload = FileUpload(
                original_filename=original_filename,
                stored_filename=unique_filename,
                file_path=file_path,
                file_type=file_type or 'unknown',
                analysis=analysis
            )
            db.add(file_upload)
            db.commit()
            
            return jsonify({
                'success': True,
                'message': 'File uploaded and analyzed successfully',
                'file_id': file_upload.id,
                'analysis': analysis
            })
        except Exception as e:
            return jsonify({'error': f'Database error: {str(e)}'}), 500
    
    return jsonify({'error': 'File upload failed'}), 500

@app.route('/api/research', methods=['POST'])
def analyze_research():
    """API endpoint to analyze research papers"""
    if not request.json:
        return jsonify({'error': 'Invalid request format. JSON expected.'}), 400
    
    title = request.json.get('title', '')
    abstract = request.json.get('abstract', '')
    content = request.json.get('content', '')
    
    if not title or not abstract:
        return jsonify({'error': 'Please provide at least a title and abstract.'})
    
    try:
        # Generate AI analysis of the research paper
        analysis_prompt = f"Analyze this research paper and provide a detailed review:\n\nTitle: {title}\n\nAbstract: {abstract}\n\nContent: {content[:4000]}"
        if len(content) > 4000:
            analysis_prompt += "...(content truncated due to length)"
        
        response = model.generate_content(analysis_prompt)
        
        if hasattr(response, 'text'):
            analysis = response.text
            
            # Store in the database
            db = get_db()
            research_paper = ResearchPaper(
                title=title,
                abstract=abstract,
                content=content[:10000],  # Limit content size
                analysis=analysis
            )
            db.add(research_paper)
            db.commit()
            
            return jsonify({
                'success': True,
                'paper_id': research_paper.id,
                'analysis': analysis
            })
        else:
            return jsonify({'error': 'Analysis failed.'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
                'timestamp': msg.timestamp.isoformat() if msg.timestamp is not None else None,
                'is_translated': msg.is_translated
            })
            
        return jsonify({'history': history})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """Serve uploaded files"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)