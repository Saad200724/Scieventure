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

const SYSTEM_PROMPT = `You are Curio, a friendly and encouraging AI science learning companion for Bangladeshi students. Your purpose is to help students learn science concepts through engaging conversations.

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

Guidelines:
1. Always encourage questions and exploration
2. Break down complex topics into digestible parts
3. Use analogies and everyday examples
4. Ask if students need clarification
5. Provide practice questions when appropriate
6. Connect concepts to student life and environment
7. Be supportive and positive about learning journey
8. When responding in Bengali, maintain the same friendly and educational tone`;

export async function generateCurioResponse(
  messages: CurioMessage[]
): Promise<string> {
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not configured");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Format messages for Gemini API
    const formattedMessages = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Create chat session with system prompt
    const chat = model.startChat({
      history: formattedMessages.slice(0, -1),
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const userMessage = messages[messages.length - 1].content;
    const response = await chat.sendMessage(
      `${SYSTEM_PROMPT}\n\nStudent: ${userMessage}`
    );

    const text = response.response.text();
    return text;
  } catch (error) {
    console.error("Error generating Curio response:", error);
    throw new Error("Failed to generate response from Curio AI");
  }
}
