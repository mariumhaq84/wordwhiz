
import React, { KeyboardEvent, RefObject, useState } from 'react';
import SpellingProgress from './SpellingProgress';
import { Word } from '@/types/word';
import PartialForm from './components/PartialForm';
import IncorrectAttemptAnimation from './IncorrectAttemptAnimation';

interface SpellingPartialViewProps {
  word: Word;
  blanksAttempt: string[];
  blankIndices: number[];
  inputRefs: RefObject<(HTMLInputElement | null)[]>;
  isCorrect: boolean;
  handleBlanksChange: (index: number, value: string) => void;
  handleBlanksKeyDown: (index: number, e: KeyboardEvent<HTMLInputElement>) => void;
  checkBlanksAttempt: () => void;
  timeRemaining: number;
  showWarning: boolean;
  manuallyChanged: boolean;
  setManuallyChanged: (changed: boolean) => void;
}

const SpellingPartialView = ({ 
  word,
  blanksAttempt,
  blankIndices,
  inputRefs,
  isCorrect,
  handleBlanksChange,
  handleBlanksKeyDown,
  checkBlanksAttempt,
  timeRemaining,
  showWarning,
  manuallyChanged,
  setManuallyChanged
}: SpellingPartialViewProps) => {
  
  // Enable auto-check by default for better user experience
  const [autoCheck, setAutoCheck] = useState(true);
  const isRTL = word.language === 'urdu' || word.language === 'arabic';
  
  // Log changes to blanksAttempt for RTL languages
  React.useEffect(() => {
    if (isRTL) {
      console.log("SpellingPartialView - blanksAttempt updated:", blanksAttempt);
    }
  }, [blanksAttempt, isRTL]);

  return (
    <div className="space-y-6">
      <div className={`text-center mb-2 ${isRTL ? 'text-amber-700 font-urdu text-xl' : 'text-amber-700 font-medium'}`}>
        {isRTL ? "خالی جگہوں کو پر کریں" : "Fill in the missing letters!"}
      </div>
      
      <PartialForm
        word={word}
        blanksAttempt={blanksAttempt}
        blankIndices={blankIndices}
        inputRefs={inputRefs}
        isCorrect={isCorrect}
        handleBlanksChange={handleBlanksChange}
        handleBlanksKeyDown={handleBlanksKeyDown}
        checkBlanksAttempt={checkBlanksAttempt}
        manuallyChanged={manuallyChanged}
        setManuallyChanged={setManuallyChanged}
        autoCheck={autoCheck}
        setAutoCheck={setAutoCheck}
        colorScheme="amber"
      />
      
      <SpellingProgress 
        timeRemaining={timeRemaining}
        showWarning={showWarning}
      />
      
      {/* Add incorrect attempt animation */}
      <IncorrectAttemptAnimation isRTL={isRTL} />
    </div>
  );
};

export default SpellingPartialView;
