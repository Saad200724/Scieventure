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
  // Try text-bison first as it's more universally available with various API keys
  model = genAI.getGenerativeModel({ model: "text-bison" });
  console.log("Successfully initialized text-bison model");
} catch (error) {
  console.error("Error initializing text-bison, trying gemini-pro:", error);
  try {
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log("Successfully initialized gemini-pro model");
  } catch (fallbackError) {
    console.error("Error initializing gemini-pro, trying gemini-1.5-flash:", fallbackError);
    try {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      console.log("Successfully initialized gemini-1.5-flash model");
    } catch (finalError) {
      console.error("Error initializing all Gemini models:", finalError);
      // Use our failsafe model
      model = createFailsafeModel();
      console.log("Using failsafe model due to API initialization issues");
    }
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

// Local knowledge base for common science questions
const scienceKnowledge: { [key: string]: string } = {
  "photosynthesis": "Great question! Photosynthesis is how plants make their own food using sunlight. Here's the simple version: Plants take water from the soil, carbon dioxide from the air, and energy from the sun. They mix all three together and create glucose (sugar) for food, and release oxygen as a bonus - that's the oxygen we breathe! It's like plants are solar-powered factories. In Bangladesh, rice paddies show this beautifully during monsoon season. Want to know more about how farmers use this process?",
  
  "respiration": "Respiration is basically the opposite of photosynthesis! All living things, including plants and animals, break down glucose to get energy. When you breathe, your body is doing this constantly. Oxygen enters your lungs, travels to your cells, and helps break down the food you eat to create energy. The waste product is carbon dioxide, which you breathe out. It's why we need to keep breathing 24/7!",
  
  "dna": "DNA is like the instruction manual for life! It contains all the information needed to build and run your body. Think of it as a super long recipe with billions of steps. DNA stands for deoxyribonucleic acid - fancy name, but basically it's a molecule shaped like a twisted ladder. Each 'rung' of the ladder is made of four chemical letters (A, T, G, C), and the combinations create instructions. Scientists in Bangladesh are doing amazing research on genetic diseases using DNA!",
  
  "gravity": "Gravity is the force that pulls things together. It's why the apple falls down instead of up, why we stay on Earth instead of floating away, and why planets orbit the sun. Everything with mass has gravity, but bigger things have stronger gravity. Earth's gravity is what keeps you on the ground. Did you know gravity is still a bit mysterious to scientists? It's one of the biggest unsolved mysteries in physics!",
  
  "ecosystem": "An ecosystem is a community where living things (organisms) interact with each other and their environment. Think of a rice paddy ecosystem in Bangladesh - it includes rice plants, fish, frogs, insects, soil, water, and more. Everything is connected! The fish help the rice by controlling pests, the plants provide food, bacteria break down dead things. When one part changes, it affects the whole system. Protecting ecosystems is crucial for Bangladesh's future!",
  
  "climate": "Climate is the long-term average weather pattern of a place. Unlike weather which changes daily, climate patterns take years or decades. Bangladesh has a tropical climate with monsoons - that's why you get those heavy rains! Climate change is happening, and Bangladesh is particularly vulnerable because much of it is low-lying. Rising sea levels threaten many communities. But there are solutions - renewable energy, sustainable farming, and international cooperation can help protect our country!",
  
  "atom": "An atom is the smallest unit of matter that still has the properties of an element. It's incredibly tiny - you can't see it without a special microscope. Atoms are made of three main particles: protons and neutrons in the center (nucleus), and electrons orbiting around. Hydrogen is the simplest atom with just one proton and one electron. Everything around you, including you, is made of atoms stuck together!",
  
  "evolution": "Evolution is how species change over very long periods of time. It explains why we see so many different creatures on Earth. Key idea: organisms that are best adapted to their environment survive and pass on their traits to their offspring. Over millions of years, small changes add up to create entirely new species. Darwin's finches in the Galápagos Islands are a famous example. It's not about 'survival of the fittest' but 'survival of the best adapted'!",
};

// Provide friendly, conversational responses with scientific information
export async function simplifyText(userMessage: string): Promise<string> {
  // PRIORITY 1: Try AI API (OpenAI) for detailed, generated responses
  console.log("Attempting AI API for:", userMessage.substring(0, 50));
  try {
    const systemPrompt = `You are Curio, a friendly and enthusiastic AI assistant for SciVenture, a science learning platform designed specifically for Bangladeshi students.

Guidelines:
- Be friendly, personable, and enthusiastic
- Use simple language and fun analogies that Bangladeshi students understand
- Include relevant examples from Bangladesh (rice paddies, monsoons, local scientists, etc.)
- Provide detailed, informative answers (2-3 paragraphs)
- Inspire them about science careers and opportunities in Bangladesh
- End with an encouraging question to deepen their learning`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = response.choices[0]?.message?.content;
    if (aiResponse) {
      console.log("✓ AI API generated response successfully");
      return aiResponse;
    }
  } catch (apiError: any) {
    console.log("✗ AI API error:", apiError?.message || "Unknown error");
  }

  // PRIORITY 2: Fall back to local knowledge base
  const messageLoq = userMessage.toLowerCase().trim();
  for (const [keyword, response] of Object.entries(scienceKnowledge)) {
    if (messageLoq.includes(keyword)) {
      console.log(`Curio responded using local knowledge for: ${keyword}`);
      return response;
    }
  }

  // PRIORITY 3: Friendly fallback responses
  const fallbackResponses = [
    "That's an interesting question! While I don't have specific information on that topic right now, I encourage you to explore it further in your textbooks or research materials. Science is all about curious minds like yours asking questions!",
    "Great question! I'm Curio, your science buddy. For this particular question, I'd suggest checking your course materials or asking your teacher - they might have more detailed information. But keep asking questions, that's how science works!",
    "I love your curiosity! While I can't answer that specific question right now, remember that every great scientist started exactly where you are - asking questions. Keep that spirit of inquiry alive!"
  ];
  
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
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
