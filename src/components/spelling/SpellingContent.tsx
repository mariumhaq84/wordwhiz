
import React from 'react';
import SpellingFullView from './SpellingFullView';
import SpellingPartialView from './SpellingPartialView';
import SpellingInputView from './SpellingInputView';
import SpellingCorrectAlert from './SpellingCorrectAlert';
import { useSpellingContext } from './context/SpellingContext';

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

  return (
    <>
      {isCorrect && <SpellingCorrectAlert word={word.text} />}

      {displayMode === 'full' && (
        <SpellingFullView 
          word={word}
          playPronunciation={playPronunciation}
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
    </>
  );
};

export default SpellingContent;
