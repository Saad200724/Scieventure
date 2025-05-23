// Client-side interface for the OpenAI API
import { apiRequest } from "./queryClient";

// Simplify scientific text
export async function simplifyText(text: string): Promise<string> {
  try {
    const response = await apiRequest('POST', '/api/chat', {
      userId: 1, // This would normally come from auth context
      message: text
    });
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error simplifying text:', error);
    throw new Error('Failed to process your request. Please try again later.');
  }
}

// Request types that the AI assistant can handle
export enum AiRequestType {
  Simplify = 'simplify',
  Analyze = 'analyze',
  Translate = 'translate'
}

// Options for the translation direction
export enum TranslationDirection {
  EnglishToBengali = 'english_to_bengali',
  BengaliToEnglish = 'bengali_to_english'
}

// Generic function to handle different types of AI requests
export async function processAiRequest(
  type: AiRequestType,
  text: string,
  options?: {
    translationDirection?: TranslationDirection
  }
): Promise<string> {
  try {
    const response = await apiRequest('POST', '/api/chat', {
      userId: 1, // This would normally come from auth context
      message: text,
      requestType: type,
      options
    });
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error(`Error processing ${type} request:`, error);
    throw new Error('Failed to process your request. Please try again later.');
  }
}

// Get chat history for a user
export async function getChatHistory(userId: number): Promise<any[]> {
  try {
    const response = await fetch(`/api/users/${userId}/chat`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch chat history');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw new Error('Failed to load chat history. Please try again later.');
  }
}
