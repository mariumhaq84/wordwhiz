import React from 'react';
import SpellingMemorizeView from './SpellingMemorizeView';
import SpellingPartialView from './SpellingPartialView';
import SpellingInputView from './SpellingInputView';
import SpellingCorrectAlert from './SpellingCorrectAlert';
import { useSpellingContext } from './context/SpellingContext';
import { Sparkles, Lightbulb, Rocket } from 'lucide-react';

const SpellingContent = () => {
  const {
    word,
    displayMode,
    letterAttempts,
    blanksAttempt,
    blankIndices,
    isCorrect,
    penalty,
    timeRemaining,
    showWarning,
    manuallyChanged,
    setManuallyChanged,
    playPronunciation,
    handleLetterChange,
    handleLetterKeyDown,
    handleBlanksChange,
    handleBlanksKeyDown,
    checkSpellingAttempt,
    checkBlanksAttempt,
    inputRefs,
    letterInputRefs
  } = useSpellingContext();

  // Get stage-specific gradient
  const getStageGradient = () => {
    if (displayMode === 'full') return 'from-blue-100 to-indigo-100';
    if (displayMode === 'partial') return 'from-amber-100 to-orange-100';
    return 'from-emerald-100 to-teal-100';
  };

  return (
    <div className="relative">
      {isCorrect && <SpellingCorrectAlert word={word.text} />}

      <div className={`bg-gradient-to-br ${getStageGradient()} rounded-xl p-4 shadow-inner border border-white`}>
        {displayMode === 'full' && (
          <SpellingMemorizeView 
            word={word}
            timeRemaining={timeRemaining}
            showWarning={showWarning}
          />
        )}

        {displayMode === 'partial' && (
          <SpellingPartialView 
            word={word}
            blanksAttempt={blanksAttempt}
            blankIndices={blankIndices}
            inputRefs={inputRefs}
            isCorrect={isCorrect}
            handleBlanksChange={handleBlanksChange}
            handleBlanksKeyDown={handleBlanksKeyDown}
            checkBlanksAttempt={checkBlanksAttempt}
            timeRemaining={timeRemaining}
            showWarning={showWarning}
            manuallyChanged={manuallyChanged}
            setManuallyChanged={setManuallyChanged}
          />
        )}

        {displayMode === 'input' && (
          <SpellingInputView 
            word={word}
            letterAttempts={letterAttempts}
            letterInputRefs={letterInputRefs}
            isCorrect={isCorrect}
            handleLetterChange={handleLetterChange}
            handleLetterKeyDown={handleLetterKeyDown}
            checkSpellingAttempt={checkSpellingAttempt}
            timeRemaining={timeRemaining}
            showWarning={showWarning}
          />
        )}
      </div>
    </div>
  );
};

export default SpellingContent;
