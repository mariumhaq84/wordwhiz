import { Word } from '@/types/word';
import { Dispatch, SetStateAction } from 'react';
import { DisplayMode } from './useSpellingState';
import { useInputCheckHandlers } from './useInputCheckHandlers';
import { useBlankCheckHandlers } from './useBlankCheckHandlers';
import { usePenaltyHandlers } from './usePenaltyHandlers';
import { useToastNotifications } from './useToastNotifications';

export const useSpellingAnswerCheckers = (
  word: Word,
  letterAttempts: string[],
  blanksAttempt: string[],
  blankIndices: number[],
  displayMode: DisplayMode,
  setIsCorrect: (isCorrect: boolean) => void,
  setShowCelebration: (show: boolean) => void,
  clearAllTimers: () => void,
  setDisplayMode: (mode: DisplayMode) => void,
  playPronunciationTimes: (times: number) => void,
  startTimer: () => void,
  setAttempts: Dispatch<SetStateAction<number>>,
  setPenalty: Dispatch<SetStateAction<number>>,
  attempts: number,
  setLetterAttempts: Dispatch<SetStateAction<string[]>>,
  setBlanksAttempt: Dispatch<SetStateAction<string[]>>,
  setManuallyChanged: Dispatch<SetStateAction<boolean>>,
  onComplete: (correct: boolean, penalty?: number) => void,
  penalty: number
) => {
  // Initialize our sub-hooks
  const { incrementAttemptsWithPenalty } = usePenaltyHandlers(
    attempts,
    setAttempts,
    setPenalty
  );

  const { 
    checkSpellingAttempt
  } = useInputCheckHandlers(
    word,
    letterAttempts,
    attempts,
    setAttempts,
    setPenalty,
    penalty,
    setDisplayMode,
    setShowCelebration,
    setIsCorrect,
    setLetterAttempts,
    clearAllTimers,
    playPronunciationTimes,
    startTimer,
    onComplete
  );

  const {
    checkBlanksAttempt
  } = useBlankCheckHandlers(
    word,
    blanksAttempt,
    blankIndices,
    attempts,
    setAttempts,
    setPenalty,
    setDisplayMode,
    setShowCelebration,
    setIsCorrect,
    setBlanksAttempt,
    setLetterAttempts,
    setManuallyChanged,
    clearAllTimers,
    playPronunciationTimes,
    startTimer
  );

  // Keep the same interface for compatibility
  return {
    checkSpellingAttempt,
    checkBlanksAttempt
  };
};
