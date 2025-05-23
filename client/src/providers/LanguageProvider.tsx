import React, { createContext, useContext, useState, useEffect } from 'react';

// Define language type
type Language = 'english' | 'bengali';

// Context interface
interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (english: string, bengali: string) => string;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Context provider component
export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Get stored language preference or default to english
  const [language, setLanguage] = useState<Language>('english');

  // Initialize from localStorage only after component mounts
  useEffect(() => {
    try {
      const storedLanguage = localStorage.getItem('language');
      if (storedLanguage === 'english' || storedLanguage === 'bengali') {
        setLanguage(storedLanguage);
      }
    } catch (error) {
      console.error('Error reading language from localStorage:', error);
    }
  }, []);

  // Toggle between languages
  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'english' ? 'bengali' : 'english');
  };

  // Translation function
  const t = (english: string, bengali: string): string => {
    return language === 'english' ? english : bengali;
  };

  // Save language preference
  useEffect(() => {
    localStorage.setItem('language', language);
    // Set the lang attribute on the html element
    document.documentElement.lang = language === 'english' ? 'en' : 'bn';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};