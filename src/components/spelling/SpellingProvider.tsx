
import React, { useRef } from 'react';
import { SpellingContext } from './context/SpellingContext';
import { Word } from '@/types/word';
import { useSpellingStages } from './hooks/useSpellingStages';
import { useSpellingAnswerCheckers } from './hooks/useSpellingAnswerCheckers';
import { useInputHandlers } from './hooks/useInputHandlers';
import { useStageEffects } from './hooks/useStageEffects';
import { useWordChangeEffect } from './hooks/useWordChangeEffect';
import { useWordNavigation } from './hooks/useWordNavigation';
import { SpellingContextWrapper } from './context/SpellingContextWrapper';

interface SpellingProviderProps {
  word: Word;
  onComplete: (correct: boolean, penalty?: number) => void;
  onNavigate?: (direction: 'next' | 'prev') => void;
  onEndSession?: () => void;
  currentWordIndex: number;
  totalWords: number;
  children: React.ReactNode;
}

export const SpellingProvider: React.FC<SpellingProviderProps> = ({
  word,
  onComplete,
  onNavigate,
  onEndSession,
  currentWordIndex,
  totalWords,
  children
}) => {
  // Use all our custom hooks
  const {
    letterAttempts,
    setLetterAttempts,
    blanksAttempt,
    setBlanksAttempt,
    blankIndices,
    setBlankIndices,
    showCelebration,
    setShowCelebration,
    displayMode,
    setDisplayMode,
    timeRemaining,
    showWarning,
    penalty,
    isCorrect,
    setIsCorrect,
    manuallyChanged,
    setManuallyChanged,
    inputRefs,
    letterInputRefs,
    playPronunciation,
    clearAllTimers,
    startTimer,
    pauseTimer,
    resumeTimer,
    moveToNextStage,
    moveToPreviousStage,
    generateBlankPattern,
    handleTimeExpired,
    attempts,
    setAttempts,
    setPenalty,
    playPronunciationTimes
  } = useSpellingStages(word, onComplete);

  // Track word completion to ensure proper navigation
  const wordCompletionRef = useRef(false);

  // Wrap onComplete to handle automatic navigation to next word
  const handleComplete = (correct: boolean, wordPenalty?: number) => {
    // Mark the word as completed to prevent multiple navigations
    if (wordCompletionRef.current) return;
    wordCompletionRef.current = true;
    
    console.log(`Word completed: ${word.text} (${word.language}), correct: ${correct}, penalty: ${wordPenalty}`);
    
    // Call the original onComplete callback
    onComplete(correct, wordPenalty);
    
    // Reset the completion flag after a delay (protection against race conditions)
    setTimeout(() => {
      wordCompletionRef.current = false;
    }, 500);
  };

  // Setup the answer checkers
  const {
    checkSpellingAttempt,
    checkBlanksAttempt
  } = useSpellingAnswerCheckers(
    word,
    letterAttempts,
    blanksAttempt,
    blankIndices,
    displayMode,
    setIsCorrect,
    setShowCelebration,
    clearAllTimers,
    setDisplayMode,
    playPronunciationTimes,
    startTimer,
    setAttempts,
    setPenalty,
    attempts,
    setLetterAttempts,
    setBlanksAttempt,
    setManuallyChanged,
    handleComplete, // Use wrapped version to ensure proper navigation
    penalty
  );

  // Setup input handlers
  const {
    handleBlanksChange,
    handleLetterChange,
    handleBlanksKeyDown,
    handleLetterKeyDown
  } = useInputHandlers(
    setBlanksAttempt,
    setLetterAttempts,
    setManuallyChanged,
    inputRefs,
    blankIndices,
    letterInputRefs,
    word
  );

  // Apply stage effects
  useStageEffects(
    word,
    displayMode,
    blankIndices,
    setBlankIndices,
    setBlanksAttempt,
    setLetterAttempts,
    generateBlankPattern,
    inputRefs,
    letterInputRefs,
    clearAllTimers,
    playPronunciationTimes,
    startTimer,
    letterAttempts,
    blanksAttempt,
    isCorrect,
    checkSpellingAttempt,
    checkBlanksAttempt,
    manuallyChanged,
    true // Enable auto-check by default
  );

  // Apply word change effects
  useWordChangeEffect(
    word,
    clearAllTimers,
    setDisplayMode,
    setIsCorrect,
    setShowCelebration,
    setAttempts,
    setPenalty,
    setManuallyChanged,
    setLetterAttempts,
    playPronunciationTimes,
    startTimer
  );

  // Setup word navigation
  const { handleWordNavigation } = useWordNavigation(
    pauseTimer,
    clearAllTimers,
    setManuallyChanged,
    onNavigate,
    word // Pass the word to useWordNavigation to detect RTL
  );

  // Prepare the context value
  const contextValue = {
    word,
    letterAttempts,
    blanksAttempt,
    blankIndices,
    showCelebration,
    displayMode,
    timeRemaining,
    showWarning,
    penalty,
    isCorrect,
    manuallyChanged,
    attempts,
    playPronunciation,
    inputRefs,
    letterInputRefs,
    handleBlanksChange,
    handleBlanksKeyDown,
    handleLetterChange,
    handleLetterKeyDown,
    checkSpellingAttempt,
    checkBlanksAttempt,
    handleTimeExpired,
    currentWordIndex,
    totalWords,
    onComplete: handleComplete, // Use the wrapped onComplete
    onNavigate: handleWordNavigation,
    onEndSession: onEndSession && (() => {
      clearAllTimers();
      onEndSession();
    }),
    moveToPreviousStage,
    moveToNextStage,
    setManuallyChanged
  };

  return (
    <SpellingContextWrapper contextValue={contextValue}>
      {children}
    </SpellingContextWrapper>
  );
};
