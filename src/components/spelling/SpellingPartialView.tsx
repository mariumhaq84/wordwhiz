import React, { KeyboardEvent, RefObject, useState } from 'react';
import SpellingProgress from './SpellingProgress';
import { Word } from '@/types/word';
import PartialForm from './components/PartialForm';
import IncorrectAttemptAnimation from './IncorrectAttemptAnimation';
import { Sparkles } from 'lucide-react';

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
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2 bg-white/80 rounded-full px-3 py-1.5 shadow-sm border border-amber-100 mx-auto w-fit">
        <Sparkles className="h-4 w-4 text-amber-500" />
        <div className={`text-sm font-medium ${isRTL ? 'font-urdu' : ''} text-amber-700`}>
          {isRTL ? "خالی جگہوں کو پُر کریں!" : "Fill in the missing letters!"}
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 shadow-inner border border-amber-100">
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
      </div>
      
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
