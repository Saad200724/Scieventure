import React from 'react';
import { useLocation } from 'wouter';
import { Brain } from 'lucide-react';

/**
 * Floating Curio Bot button that redirects to the AI assistant page
 */
const CurioBot: React.FC = () => {
  const [, setLocation] = useLocation();

  // Redirect to AI assistant page
  const navigateToAIAssistant = () => {
    setLocation('/ai-assistant');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <button
        onClick={navigateToAIAssistant}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
        aria-label="Open Curio Assistant"
      >
        <Brain className="h-6 w-6" />
      </button>
    </div>
  );
};

export default CurioBot;