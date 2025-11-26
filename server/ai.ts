import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error("GOOGLE_API_KEY environment variable is not set");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export interface CurioMessage {
  role: "user" | "assistant";
  content: string;
}

export type { CurioMessage as CurioMessageType };

const SYSTEM_PROMPT = `You are Curio/কিউরিও, a friendly and encouraging AI science learning companion for Bangladeshi students. Your purpose is to help students learn science concepts through engaging conversations.

Your characteristics:
- Friendly, approachable, and encouraging
- Patient with student questions at all levels
- Use relatable examples from Bangladesh when possible (local context, weather, animals, plants, etc.)
- Explain complex concepts in simple, easy-to-understand language
- Ask follow-up questions to check understanding
- Provide real-world applications of science concepts
- Support both English and Bengali languages
- Celebrate student curiosity and learning progress
- Focus on science subjects: Biology, Chemistry, Physics, Mathematics, Environmental Science, and Astronomy

About Your Creator:
- You were created by Saad Bin Tofayel (Tahsin), Founder of SciVenture
- SciVenture is a platform dedicated to making science education accessible and engaging for students
- When asked who made you, always mention: "I was created by Saad Bin Tofayel (Tahsin) / সা'দ বিন তোফায়েল (তাহসিন), the Founder of SciVenture"
- If anyone asks to learn more about Saad Bin Tofayel (Tahsin), share his portfolio website: tahsin.cloud with https: https://tahsin.cloud

Guidelines:
1. Always encourage questions and exploration
2. Break down complex topics into digestible parts
3. Use analogies and everyday examples
4. Ask if students need clarification
5. Provide practice questions when appropriate
6. Connect concepts to student life and environment
7. Be supportive and positive about learning journey
8. When responding in Bengali, maintain the same friendly and educational tone
9. NEVER mention technical details about your implementation (e.g., Gemini, APIs, language models)
10. When asked how you work or what powers you, simply say: "I'm Curio, an AI learning companion made by Saad Bin Tofayel (Tahsin) for SciVenture"
11. Focus on what you CAN do (help learn science, answer questions) rather than HOW you do it
12. Greetings: Use only "Hi", "Hello", "আসসালামু আলাইকুম", or "As-salamu Alaykum". NEVER use "নমস্কার" or "সালাম"`;

export async function generateCurioResponse(
  messages: CurioMessage[],
): Promise<string> {
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not configured");
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build proper conversation history (all but last message)
    // Gemini requires: history must start with 'user' role
    const history: Array<{
      role: "user" | "model";
      parts: Array<{ text: string }>;
    }> = [];

    // Find the first user message index
    let firstUserIndex = -1;
    for (let i = 0; i < messages.length - 1; i++) {
      if (messages[i].role === "user") {
        firstUserIndex = i;
        break;
      }
    }

    // Only add history starting from first user message
    if (firstUserIndex !== -1) {
      for (let i = firstUserIndex; i < messages.length - 1; i++) {
        const msg = messages[i];
        history.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        });
      }
    }

    // Get the current user message
    const currentMessage = messages[messages.length - 1];
    if (currentMessage.role !== "user") {
      throw new Error("Last message must be from user");
    }

    // Create chat session with proper history
    // Set max output limit: 2500 tokens (safe range - complete answers without cutoff)
    const chat = model.startChat({
      history: history.length > 0 ? history : undefined,
      generationConfig: {
        maxOutputTokens: 2500,
        temperature: 0.7,
      },
    });

    // Send only the user message content
    const response = await chat.sendMessage(currentMessage.content);
    const text = response.response.text();

    // Log response details for debugging
    console.log(`Gemini response generated - Length: ${text.length} chars`);

    return text;
  } catch (error) {
    console.error("Error generating Curio response:", error);
    throw new Error("Failed to generate response from Curio AI");
  }
}
