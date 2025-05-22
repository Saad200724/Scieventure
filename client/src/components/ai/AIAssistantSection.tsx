import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { simplifyText } from '@/lib/openai';
import { CheckCircle } from 'lucide-react';

const AIAssistantSection: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', content: "Hello! I'm your science research assistant. How can I help you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages([...messages, { sender: 'user', content: input }]);
    const userQuery = input;
    setInput('');
    setIsLoading(true);

    try {
      // Get AI response
      const response = await simplifyText(userQuery);
      setMessages(prev => [...prev, { sender: 'ai', content: response }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mb-12">
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-3">AI Research Assistant</h2>
            <p className="text-gray-700 mb-4">
              Get help with simplifying complex scientific concepts, analyzing research papers, and answering your questions in both English and Bengali.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-secondary mt-0.5" />
                <p className="text-sm">Simplify scientific text for better understanding</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-secondary mt-0.5" />
                <p className="text-sm">Get help with research paper analysis</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-secondary mt-0.5" />
                <p className="text-sm">Answer questions in both English and Bengali</p>
              </div>
            </div>
            <Button asChild className="bg-primary text-white hover:bg-blue-700">
              <a href="/ai-assistant">Try AI Assistant</a>
            </Button>
          </div>
          <div className="md:w-1/2 bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Science Research Assistant</h3>
              <div className="flex items-center">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
            <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}
                >
                  {message.sender === 'ai' && (
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs flex-shrink-0">
                      AI
                    </div>
                  )}
                  <div className={`${
                    message.sender === 'ai' 
                      ? 'bg-gray-100' 
                      : 'bg-primary/10'
                    } rounded-lg p-3 max-w-[85%]`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="h-8 w-8 rounded-full bg-accent text-white flex items-center justify-center text-xs flex-shrink-0">
                      AR
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs flex-shrink-0">
                    AI
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="relative">
              <Input
                type="text"
                className="w-full bg-gray-100 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ask a science question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-1.5 rounded-full hover:bg-blue-700 transition"
                disabled={isLoading}
                size="icon"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAssistantSection;
