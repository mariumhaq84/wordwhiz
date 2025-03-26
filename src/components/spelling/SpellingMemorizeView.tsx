import React from 'react';
import { Word } from '@/types/word';
import SpellingProgress from './SpellingProgress';

interface SpellingMemorizeViewProps {
  word: Word;
  timeRemaining: number;
  showWarning: boolean;
}

const SpellingMemorizeView = ({ 
  word,
  timeRemaining,
  showWarning
}: SpellingMemorizeViewProps) => {
  const isRTL = word.language === 'urdu' || word.language === 'arabic';
  
  return (
    <div className="flex flex-col items-center w-full space-y-4">
      <div className="w-full flex items-center justify-center relative">
        <div className={`font-bold text-center p-8 bg-gradient-to-br from-blue-100 to-indigo-100 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-blue-200 transform transition-all duration-300 min-w-[90%] flex items-center justify-center tracking-wider leading-relaxed
          ${isRTL ? 'rtl font-urdu kid-friendly text-8xl' : 'text-7xl'} kid-friendly`} 
          style={{ 
            letterSpacing: isRTL ? '0.05em' : '0.02em', 
            fontSize: isRTL 
              ? 'clamp(4rem, 10vw, 8rem)' 
              : 'clamp(2.5rem, 8vw, 6rem)',
            maxWidth: '100%',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
            hyphens: 'auto',
            padding: word.text.length > 10 ? '1.5rem' : '2rem'
          }}>
          {word.text}
        </div>
      </div>
      
      <SpellingProgress 
        timeRemaining={timeRemaining}
        showWarning={showWarning}
      />
    </div>
  );
};

export default SpellingMemorizeView;
