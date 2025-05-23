import React from 'react';
import { Button } from './button';
import { useLanguage } from '@/providers/LanguageProvider';

interface LanguageToggleProps {
  className?: string;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ className }) => {
  const { language, toggleLanguage, t } = useLanguage();
  
  return (
    <Button 
      onClick={toggleLanguage}
      variant="ghost" 
      size="sm"
      className={`flex items-center gap-2 ${className}`}
    >
      {language === 'english' ? (
        <>
          <span>বাংলা</span>
          <span className="text-xs opacity-70">🇧🇩</span>
        </>
      ) : (
        <>
          <span>English</span>
          <span className="text-xs opacity-70">🇬🇧</span>
        </>
      )}
    </Button>
  );
};

export default LanguageToggle;