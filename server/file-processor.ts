import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { simplifyText } from './ai';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const readFile = promisify(fs.readFile);

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

interface ProcessFileResult {
  success: boolean;
  text?: string;
  summary?: any;
  error?: string;
}

/**
 * Process an uploaded file and extract its contents using the Python module directly
 */
export async function processFile(file: any): Promise<ProcessFileResult> {
  const filePath = path.join(uploadsDir, `${Date.now()}-${file.originalname}`);
  
  try {
    // Save the file temporarily
    await writeFile(filePath, file.buffer);
    
    // Determine file type from mimetype
    let fileType = '';
    if (file.mimetype === 'application/pdf') {
      fileType = 'pdf';
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      fileType = 'docx';
    } else if (file.mimetype === 'text/plain') {
      fileType = 'txt';
    } else {
      throw new Error(`Unsupported file type: ${file.mimetype}`);
    }
    
    // Use Python to extract text based on the file type
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', [
        '-c', 
        `
import sys, json
sys.path.append('${process.cwd()}')
from server.document_parser import extract_text_from_file, summarize_document

try:
    # Read file in binary mode
    with open('${filePath}', 'rb') as file:
        content = file.read()
    
    # Extract text from file
    result = extract_text_from_file(content, '${fileType}')
    
    # Add document summary if text extraction was successful
    if result.get('success'):
        result['summary'] = summarize_document(result['text'])
    
    # Output JSON result
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({"success": False, "error": str(e)}))
        `
      ]);
      
      let result = '';
      let error = '';
      
      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });
      
      pythonProcess.on('close', async (exitCode) => {
        // Clean up the temporary file
        try {
          await unlink(filePath);
        } catch (e) {
          console.error('Error deleting temporary file:', e);
        }
        
        if (exitCode !== 0 || error) {
          console.error('Python script error:', error);
          return resolve({ 
            success: false, 
            error: `Failed to process file: ${error || 'Unknown error'}` 
          });
        }
        
        try {
          const parsedResult = JSON.parse(result);
          return resolve(parsedResult);
        } catch (e) {
          return resolve({ 
            success: false, 
            error: `Failed to parse output from document parser: ${e}` 
          });
        }
      });
    });
    
  } catch (error) {
    console.error('Error processing file:', error);
    // Clean up the temporary file if it exists
    try {
      if (fs.existsSync(filePath)) {
        await unlink(filePath);
      }
    } catch (e) {
      console.error('Error deleting temporary file:', e);
    }
    
    return { 
      success: false, 
      error: `Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

/**
 * Process a file and analyze its content with the AI
 */
export async function analyzeFileWithAI(file: any): Promise<ProcessFileResult> {
  try {
    // First extract text from the file
    const result = await processFile(file);
    
    if (!result.success || !result.text) {
      return result;
    }
    
    // Limit the text length to avoid overwhelming the AI
    const textToAnalyze = result.text.length > 10000 
      ? result.text.substring(0, 10000) + "... (text truncated for analysis)"
      : result.text;
    
    // Create a friendly AI prompt for Bangladeshi students
    const prompt = `
I'd like you to analyze this document that was uploaded by a student from Bangladesh:

"${textToAnalyze}"

Please provide:
1. A clear and simple summary of the main ideas
2. Key points that would be useful for a student
3. Any concepts that might need further explanation
4. How this relates to scientific education

Make your analysis friendly, encouraging, and easy to understand for a high school or university student.
If appropriate, include some inspiring words about pursuing science and education.
    `;
    
    // Analyze the content with our AI
    const analysis = await simplifyText(prompt);
    
    return {
      success: true,
      text: result.text,
      summary: analysis
    };
    
  } catch (error) {
    console.error('Error analyzing file with AI:', error);
    return { 
      success: false, 
      error: `Failed to analyze file with AI: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}