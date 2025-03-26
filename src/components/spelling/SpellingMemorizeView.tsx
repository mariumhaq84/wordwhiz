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
        <div className={`text-2xl font-bold text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-sm rounded-xl shadow-inner border border-blue-100 transform transition-all duration-300 min-w-[80%] 
          ${isRTL ? 'rtl font-urdu kid-friendly' : ''}`}>
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
