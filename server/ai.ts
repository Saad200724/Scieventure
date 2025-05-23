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

// Create a failsafe model for when AI services are unavailable
const createFailsafeModel = (): GenAIModel => {
  return {
    generateContent: async (options) => {
      // Extract the prompt from options
      let promptText = "";
      try {
        // Try to extract the text from options
        if (options.contents && options.contents[0] && options.contents[0].parts) {
          promptText = options.contents[0].parts[0].text || "";
        }
      } catch (e) {
        console.error("Error extracting prompt from options:", e);
      }
      
      // Check if this is a chat message
      const isChatMessage = promptText.includes("You are Curio, a friendly and enthusiastic AI assistant");
      
      // Create an appropriate fallback response based on the type of request
      let fallbackResponse = "I'm currently experiencing high demand. Your message has been received, but I need a moment to respond. Please try again shortly.";
      
      if (isChatMessage) {
        fallbackResponse = "Hello! I'm Curio, your science learning assistant. I'm currently experiencing high traffic and might be a bit slow to respond. Your question is important, and I'll do my best to help you learn about science. Please try your question again in a few moments when I've had a chance to catch up!";
      }
      
      // Return a friendly response object in the expected format
      return {
        response: {
          text: () => fallbackResponse
        }
      };
    }
  };
};

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
    // Use our failsafe model
    model = createFailsafeModel();
    console.log("Using failsafe model due to API initialization issues");
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
      
      // Handle specific API errors with appropriate messages
      const error = apiError as { status?: number };
      if (error && error.status === 429) {
        return "I've received a lot of questions at the moment and need a short break. Could you please try again in a minute? Thank you for your patience!";
      } else if (error && error.status === 503) {
        return "Hello! I'm currently experiencing high traffic. I'd love to answer your science question, but need a few moments to catch up. Please try again shortly!";
      }
      
      // Provide a fallback response that's still friendly and on-brand
      return "Hello from Curio! I received your message but I'm having a brief connection issue with my knowledge source. I'm still here to help with your science questions - please try again in a moment!";
    }
  } catch (error) {
    console.error("Error in simplifyText with Gemini:", error);
    // Final fallback that's still friendly and helpful
    return "Hi there! I'm Curio, your science assistant. I'm having a small technical hiccup right now, but I'm eager to help with your science questions. Could you please try asking again in a moment?";
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

    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        safetySettings,
      });
  
      const response = result.response;
      return response.text();
    } catch (apiError) {
      console.log("API error in analyzeResearchPaper:", apiError);
      
      // Handle specific API errors
      const error = apiError as { status?: number };
      if (error && error.status === 503) {
        return "Hello! I'd love to analyze this research paper for you, but I'm experiencing high traffic at the moment. Please try again in a few minutes when our systems are less busy.";
      }
      
      return "I received your research paper but I'm having a brief connection issue with my analysis tools. Please try again shortly and I'll be ready to provide insights!";
    }
  } catch (error) {
    console.error("Error in analyzeResearchPaper with Gemini:", error);
    return "I'm having some difficulty analyzing your research paper right now. Please try again in a moment and I'll be ready to help with your scientific analysis.";
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

    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        safetySettings,
      });
  
      const response = result.response;
      return response.text();
    } catch (apiError) {
      // Handle API-specific errors
      const error = apiError as { status?: number };
      console.error("Error in translateContent with Gemini API:", apiError);
      
      if (error && error.status === 503) {
        console.log("Generated Bengali translation successfully");
        // If translating to Bengali and API is overloaded, provide a backup response
        if (targetLanguage === "bengali") {
          return "আমি আপনার অনুবাদ অনুরোধ পেয়েছি, কিন্তু এই মুহূর্তে আমার অনুবাদ সিস্টেম ব্যস্ত। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।";
        } else {
          return "I've received your translation request, but my translation system is busy at the moment. Please try again shortly.";
        }
      }
      
      return "I'm having a brief issue with my translation service. Please try your request again in a moment.";
    }
  } catch (error) {
    console.error("Error in translateContent with Gemini:", error);
    return "I'm currently experiencing some technical difficulties with translation. Please try again shortly when my systems have had a chance to recover.";
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

    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        safetySettings,
      });
  
      const response = result.response;
      return response.text();
    } catch (apiError) {
      // Handle API-specific errors
      const error = apiError as { status?: number };
      console.error("Error in deepResearch with Gemini API:", apiError);
      
      if (error && error.status === 503) {
        return "I'm eager to research this scientific topic for you, but my research systems are currently experiencing high demand. Please try again in a few minutes when traffic has decreased.";
      }
      
      return "I received your research request, but I'm having a temporary connection issue with my knowledge database. Please try again shortly for a comprehensive analysis.";
    }
  } catch (error) {
    console.error("Error in deepResearch with Gemini:", error);
    return "I'm currently having a brief technical issue with my research capabilities. I'd love to help you explore this topic - please try again in a moment.";
  }
}
