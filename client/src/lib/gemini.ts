import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize the Google Generative AI with the API key from environment variables
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';

if (!apiKey) {
  console.warn('VITE_GOOGLE_API_KEY is not set. Add it to your .env file.');
}

const genAI = new GoogleGenerativeAI(apiKey);

// Get the Gemini Pro model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Configure the safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

/**
 * Deep Research function that analyzes scientific concepts in detail
 * @param text The scientific text to analyze
 * @returns Detailed analysis of the scientific concept
 */
export async function deepResearch(text: string): Promise<string> {
  try {
    const prompt = `
    You are Curio, an advanced scientific research assistant specializing in making complex science accessible to students in Bangladesh.
    
    Please analyze the following scientific concept or research topic in depth:
    
    "${text}"
    
    Provide a comprehensive analysis including:
    1. Core principles and key concepts explained in simple terms
    2. Historical context and development of this scientific area
    3. Real-world applications and relevance, especially in Bangladesh or similar developing contexts
    4. Current research directions and recent breakthroughs
    5. Conceptual diagrams that could help visualize this (described in text)
    
    Format your response with clear sections and use simple language appropriate for high school or early university students.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error in deepResearch:", error);
    throw new Error(`Failed to process research request: ${error.message}`);
  }
}

/**
 * Simplify text using Gemini AI
 * @param text Complex text to simplify
 * @returns Simplified version of the text
 */
export async function simplifyWithGemini(text: string): Promise<string> {
  try {
    const prompt = `
    You are Curio, a friendly science educator specializing in making complex science accessible.
    
    Please simplify the following scientific text for a student:
    
    "${text}"
    
    Make it easy to understand for a high school student while preserving the key scientific concepts.
    Use simple language, analogies, and break down complex terms.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error in simplifyWithGemini:", error);
    throw new Error(`Failed to simplify text: ${error.message}`);
  }
}

/**
 * Analyze research paper with Gemini AI
 * @param text Research paper content
 * @returns Analysis of the research paper
 */
export async function analyzeWithGemini(text: string): Promise<string> {
  try {
    const prompt = `
    You are Curio, an expert research analyst specializing in making academic papers accessible.
    
    Please analyze the following scientific research and break it down:
    
    "${text}"
    
    In your analysis, include:
    1. The main research question or hypothesis
    2. Key findings and conclusions
    3. Methodology used (simplified)
    4. Significance of this research in the field
    5. Potential applications or implications
    
    Make your explanation accessible to high school or early university students.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error in analyzeWithGemini:", error);
    throw new Error(`Failed to analyze research paper: ${error.message}`);
  }
}

/**
 * Translate content with Gemini AI
 * @param text Text to translate
 * @param direction Translation direction ('english_to_bengali' or 'bengali_to_english')
 * @returns Translated text
 */
export async function translateWithGemini(
  text: string,
  direction: "english_to_bengali" | "bengali_to_english"
): Promise<string> {
  try {
    const targetLanguage = direction === "english_to_bengali" ? "Bengali" : "English";
    const sourceLanguage = direction === "english_to_bengali" ? "English" : "Bengali";
    
    const prompt = `
    You are Curio, a bilingual education specialist in Bengali and English.
    
    Please translate the following ${sourceLanguage} text into ${targetLanguage}:
    
    "${text}"
    
    Ensure the translation:
    1. Preserves scientific terminology accurately
    2. Maintains the original meaning
    3. Uses natural language appropriate for educational content
    4. Is culturally appropriate for students in Bangladesh
    
    If there are scientific terms without direct translations, provide the original term in parentheses.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error in translateWithGemini:", error);
    throw new Error(`Failed to translate text: ${error.message}`);
  }
}