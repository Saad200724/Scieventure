import OpenAI from "openai";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize the OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "demo_key" });

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// Define a type for our model interface to avoid type errors
interface GenAIModel {
  generateContent: (options: any) => Promise<{
    response: {
      text: () => string;
    }
  }>;
}

// Get the Gemini model - try different model options
let model: GenAIModel;
try {
  // First try the flash model which has higher rate limits
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  console.log("Successfully initialized gemini-1.5-flash model");
} catch (error) {
  console.error("Error initializing gemini-1.5-flash, falling back to gemini-pro:", error);
  try {
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log("Successfully initialized gemini-pro model");
  } catch (fallbackError) {
    console.error("Error initializing fallback model:", fallbackError);
    // Create a simple response if all else fails
    model = {
      generateContent: async () => ({
        response: {
          text: () => "I'm currently experiencing connection issues. Your message has been received, but I'm unable to generate a response at the moment. Please try again later."
        }
      })
    };
  }
}

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

// Provide friendly, conversational responses with scientific information when needed
export async function simplifyText(text: string): Promise<string> {
  try {
    const prompt = `
    You are Curio, a friendly and enthusiastic AI assistant for SciVenture, a science learning platform designed specifically for Bangladeshi students. 
    
    Respond to the following message in a conversational, warm and engaging way:
    
    "${text}"
    
    Guidelines for your response:
    - Be friendly, casual, and personable - like a helpful friend rather than a textbook
    - Use everyday language and simple explanations
    - Include some enthusiasm and personality in your responses
    - If the message is casual (like greetings), respond in kind without being overly scientific
    - For science questions, provide accurate information but explain it in a fun, interesting way
    - Keep scientific explanations brief and accessible, using analogies relevant to Bangladeshi context where helpful
    - Occasionally add appropriate emojis for emphasis (but don't overdo it)
    - Feel free to ask follow-up questions to encourage conversation
    - Include inspirational messages specifically for Bangladeshi students about pursuing STEM careers
    - Make references to Bangladeshi scientists, achievements, or local scientific contexts when relevant
    - Encourage participation in local science initiatives, competitions, or research opportunities
    - Mention how science can address challenges specific to Bangladesh (climate change, public health, etc.)
    - Use occasional Bengali phrases or words to create cultural connection (but keep responses primarily in English)
    
    Remember, you're having a conversation with a Bangladeshi student who you want to inspire to pursue science!
    `;

    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        safetySettings,
      });

      const response = result.response;
      return response.text();
    } catch (apiError) {
      console.log("API error in simplifyText:", apiError);
      // If we hit rate limits, return a friendly message
      if (apiError.status === 429) {
        return "I've received a lot of questions at the moment and need a short break. Could you please try again in a minute? Thank you for your patience!";
      }
      
      return "I'm here and received your message, but having some trouble connecting to my knowledge source. Let's try again in a moment.";
    }
  } catch (error) {
    console.error("Error in simplifyText with Gemini:", error);
    return "I'm here and ready to help, but experiencing some technical difficulties. Please try again shortly.";
  }
}

// Analyze research papers
export async function analyzeResearchPaper(text: string): Promise<string> {
  try {
    const prompt = `
    You are Curio, a research assistant helping Bangladeshi students understand scientific papers and research. 
    
    Please analyze and explain this research paper or scientific content in accessible terms for a Bangladeshi student interested in science:
    
    "${text}"
    
    Follow these guidelines:
    1. Use a friendly, conversational tone appropriate for students
    2. Break down complex research into clear, structured explanations
    3. Analyze and highlight:
       - Main findings and key conclusions
       - Methodology and research approach
       - Real-world applications and significance
       - How this relates to Bangladesh's specific challenges or opportunities
       - Connections to fundamental scientific concepts taught in Bangladeshi curricula
    4. Include suggestions for how students in Bangladesh could pursue similar research or apply these findings
    5. Add inspirational notes about how understanding such research can contribute to Bangladesh's development
    6. Mention relevant local scientists, research institutions, or initiatives in Bangladesh if applicable
    7. Include a section on potential career paths in Bangladesh related to this research area
    
    Format your response in easy-to-read sections with clear headings.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error in analyzeResearchPaper with Gemini:", error);
    return "I'm currently having trouble processing your request. Please try again later.";
  }
}

// Translate scientific content between English and Bengali
export async function translateContent(text: string, targetLanguage: "english" | "bengali"): Promise<string> {
  try {
    const prompt = `
    You are a translation assistant specializing in scientific and educational content.
    
    Please translate the following text from ${targetLanguage === "bengali" ? "English to Bengali" : "Bengali to English"} while preserving the scientific accuracy and educational value:
    
    "${text}"
    
    Make sure to maintain proper spelling, grammar, and technical terms appropriate for education in Bangladesh.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error in translateContent with Gemini:", error);
    return "I'm currently having trouble processing your request. Please try again later.";
  }
}

// Deep Research on scientific concepts using Gemini AI
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
    console.error("Error in deepResearch with Gemini:", error);
    return "I'm currently having trouble processing your deep research request. Please try again later.";
  }
}
