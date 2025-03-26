
import React, { KeyboardEvent, RefObject, useEffect, useState } from 'react';
import SpellingProgress from './SpellingProgress';
import { Word } from '@/types/word';
import InputForm from './components/InputForm';

interface SpellingInputViewProps {
  word: Word;
  letterAttempts: string[];
  letterInputRefs: RefObject<(HTMLInputElement | null)[]>;
  isCorrect: boolean;
  handleLetterChange: (index: number, value: string) => void;
  handleLetterKeyDown: (index: number, e: KeyboardEvent<HTMLInputElement>) => void;
  checkSpellingAttempt: () => void;
  timeRemaining: number;
  showWarning: boolean;
}

const SpellingInputView = ({ 
  word,
  letterAttempts,
  letterInputRefs,
  isCorrect,
  handleLetterChange,
  handleLetterKeyDown,
  checkSpellingAttempt,
  timeRemaining,
  showWarning
}: SpellingInputViewProps) => {
  
  // Enable auto-check by default for better user experience
  const [autoCheck, setAutoCheck] = useState(true);
  
  // Determine if we need RTL direction
  const isRTL = word.language === 'urdu' || word.language === 'arabic';
  
  // Debug RTL cursor positioning when word changes
  useEffect(() => {
    if (isRTL) {
      console.log(`SpellingInputView: RTL word "${word.text}" loaded, ensuring right-to-left cursor movement`);
    }
  }, [isRTL, word.text]);

  return (
    <div className="space-y-6">
      <div className={`text-center mb-2 ${isRTL ? 'text-emerald-700 font-urdu text-xl' : 'text-emerald-700 font-medium'}`}>
        {isRTL ? "پورا لفظ ٹائپ کریں!" : "Type the whole word!"}
      </div>
      
      <InputForm
        word={word}
        letterAttempts={letterAttempts}
        letterInputRefs={letterInputRefs}
        isCorrect={isCorrect}
        handleLetterChange={handleLetterChange}
        handleLetterKeyDown={handleLetterKeyDown}
        checkSpellingAttempt={checkSpellingAttempt}
        autoCheck={autoCheck}
        setAutoCheck={setAutoCheck}
        colorScheme="green"
      />
      
      <SpellingProgress 
        timeRemaining={timeRemaining}
        showWarning={showWarning}
      />
    </div>
  );
};

export default SpellingInputView;
