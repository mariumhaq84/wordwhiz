import React, { KeyboardEvent, RefObject, useEffect, useState } from 'react';
import SpellingProgress from './SpellingProgress';
import { Word } from '@/types/word';
import InputForm from './components/InputForm';
import { Pencil } from 'lucide-react';

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
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2 bg-white/80 rounded-full px-3 py-1.5 shadow-sm border border-emerald-100 mx-auto w-fit">
        <Pencil className="h-4 w-4 text-emerald-500" />
        <div className={`text-sm font-medium ${isRTL ? 'font-urdu' : ''} text-emerald-700`}>
          {isRTL ? "پورا لفظ ٹائپ کریں!" : "Type the whole word!"}
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 shadow-inner border border-emerald-100">
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
      </div>
      
      <SpellingProgress 
        timeRemaining={timeRemaining}
        showWarning={showWarning}
      />
    </div>
  );
};

export default SpellingInputView;
