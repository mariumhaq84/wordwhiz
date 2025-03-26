
import { useState } from 'react';
import { Word } from '@/types/word';

export type DisplayMode = 'full' | 'partial' | 'input';

export const useSpellingState = (word: Word) => {
  const [letterAttempts, setLetterAttempts] = useState<string[]>([]);
  const [blanksAttempt, setBlanksAttempt] = useState<string[]>([]);
  const [blankIndices, setBlankIndices] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('full');
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [showWarning, setShowWarning] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [penalty, setPenalty] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [manuallyChanged, setManuallyChanged] = useState(false);

  return {
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
    setTimeRemaining,
    showWarning,
    setShowWarning,
    attempts,
    setAttempts,
    penalty,
    setPenalty,
    isCorrect,
    setIsCorrect,
    manuallyChanged,
    setManuallyChanged
  };
};
