import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Brain, 
  X,
  MessageCircle,
  Search,
  BookOpen,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

/**
 * Floating Curio assistant component that provides quick access to deep research
 * from anywhere in the application
 */
const CurioAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Toggle the assistant popup
  const toggleAssistant = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsExpanded(false);
      setResult(null);
    }
  };

  // Handle direct navigation to AI assistant page
  const navigateToAIAssistant = () => {
    setLocation('/ai-assistant');
  };

  // Handle quick research submission
  const handleQuickResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim() || isLoading) return;
    
    setIsLoading(true);
    setIsExpanded(true);
    setResult(null);
    
    try {
      const response = await apiRequest('POST', '/api/curio/research', {
        text: inputText.trim(),
        userId: 1 // Using demo user ID
      });
      
      if (!response.ok) {
        throw new Error('Failed to process research request');
      }
      
      const data = await response.json();
      setResult(data.response);
    } catch (error) {
      console.error('Error performing research:', error);
      toast({
        title: "Research Error",
        description: "Could not complete the research. Please try again or use the full AI assistant.",
        variant: "destructive",
      });
      setResult("I'm having trouble researching that topic right now. Please try again or use the full AI assistant for more options.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Main assistant content */}
      {isOpen && (
        <div className={`bg-white rounded-lg shadow-lg mb-4 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'w-96 h-96' : 'w-72 max-h-60'}`}>
          {/* Header */}
          <div className="bg-primary text-white p-3 flex justify-between items-center">
            <div className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">Curio Assistant</h3>
            </div>
            <button onClick={toggleAssistant} className="text-white hover:text-gray-200">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Body */}
          <div className="p-4 flex flex-col h-full max-h-full overflow-hidden">
            {!isExpanded ? (
              <>
                <p className="text-sm text-gray-600 mb-3">
                  I'm Curio, your science research assistant. What would you like to explore today?
                </p>
                
                {/* Quick research form */}
                <form onSubmit={handleQuickResearch} className="relative mb-3">
                  <Input 
                    placeholder="Ask a science question..." 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="pr-10"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    disabled={!inputText.trim() || isLoading}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                
                {/* Quick options */}
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs py-1 h-auto justify-start"
                    onClick={navigateToAIAssistant}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    AI Chat
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs py-1 h-auto justify-start"
                    onClick={() => setLocation('/ai-assistant?type=deep_research')}
                  >
                    <Search className="h-3 w-3 mr-1" />
                    Deep Research
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs py-1 h-auto justify-start"
                    onClick={() => setLocation('/ai-assistant?type=analyze')}
                  >
                    <BookOpen className="h-3 w-3 mr-1" />
                    Paper Analysis
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs py-1 h-auto justify-start text-secondary"
                    onClick={() => setLocation('/resources')}
                  >
                    <BookOpen className="h-3 w-3 mr-1" />
                    Resources
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col h-full">
                <div className="bg-gray-100 p-2 rounded mb-3">
                  <p className="text-sm font-medium">{inputText}</p>
                </div>
                
                <div className="flex-grow overflow-y-auto mb-3 bg-white rounded p-2 border text-sm">
                  {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : result ? (
                    <div className="whitespace-pre-line">{result}</div>
                  ) : null}
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsExpanded(false)}
                  >
                    Back
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={navigateToAIAssistant}
                  >
                    Open Full Assistant
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Floating button */}
      <button
        onClick={toggleAssistant}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${
          isOpen ? 'bg-accent text-white' : 'bg-primary text-white'
        } hover:opacity-90`}
      >
        <Brain className="h-6 w-6" />
      </button>
    </div>
  );
};

export default CurioAssistant;