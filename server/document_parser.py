import os
import re
import PyPDF2
import docx
from tempfile import NamedTemporaryFile
from typing import Dict, Any

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from a PDF file"""
    try:
        # Save the bytes to a temporary file
        with NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            temp_file.write(file_content)
            temp_path = temp_file.name
        
        # Extract text from the PDF
        text = ""
        with open(temp_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                text += page.extract_text() + "\n"
        
        # Clean up the temporary file
        os.unlink(temp_path)
        
        return text.strip()
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return f"Error extracting text: {str(e)}"

def extract_text_from_docx(file_content: bytes) -> str:
    """Extract text from a DOCX file"""
    try:
        # Save the bytes to a temporary file
        with NamedTemporaryFile(delete=False, suffix='.docx') as temp_file:
            temp_file.write(file_content)
            temp_path = temp_file.name
        
        # Extract text from the DOCX
        doc = docx.Document(temp_path)
        text = ""
        for para in doc.paragraphs:
            text += para.text + "\n"
        
        # Clean up the temporary file
        os.unlink(temp_path)
        
        return text.strip()
    except Exception as e:
        print(f"Error extracting text from DOCX: {e}")
        return f"Error extracting text: {str(e)}"

def extract_text_from_txt(file_content: bytes) -> str:
    """Extract text from a plain text file"""
    try:
        # Decode the bytes to text
        text = file_content.decode('utf-8')
        return text.strip()
    except Exception as e:
        print(f"Error extracting text from TXT: {e}")
        return f"Error extracting text: {str(e)}"

def extract_text_from_file(file_content: bytes, file_type: str) -> Dict[str, Any]:
    """Extract text from various file types"""
    file_type = file_type.lower()
    
    if file_type.endswith('pdf'):
        text = extract_text_from_pdf(file_content)
    elif file_type.endswith('docx'):
        text = extract_text_from_docx(file_content)
    elif file_type.endswith('txt') or file_type.endswith('text'):
        text = extract_text_from_txt(file_content)
    else:
        return {
            "success": False,
            "error": f"Unsupported file type: {file_type}. Please upload PDF, DOCX, or TXT files only."
        }
    
    # Check if we got something meaningful
    if not text or len(text.strip()) < 10:
        return {
            "success": False,
            "error": "Could not extract meaningful text from the document."
        }
    
    return {
        "success": True,
        "text": text
    }

def summarize_document(text: str) -> Dict[str, Any]:
    """
    Extract key information from the document text
    """
    # Simple document analysis
    word_count = len(re.findall(r'\w+', text))
    sentence_count = len(re.findall(r'[.!?]+', text))
    paragraph_count = len(text.split('\n\n'))
    
    return {
        "word_count": word_count,
        "sentence_count": sentence_count,
        "paragraph_count": paragraph_count,
        "excerpt": text[:500] + ('...' if len(text) > 500 else '')
    }