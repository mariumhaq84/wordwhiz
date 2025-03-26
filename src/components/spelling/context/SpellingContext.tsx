
import React, { createContext, useContext, RefObject } from 'react';
import { Word } from '@/types/word';
import { DisplayMode } from '../hooks/useSpellingState';

export interface SpellingContextProps {
  word: Word;
  letterAttempts: string[];
  blanksAttempt: string[];
  blankIndices: number[];
  showCelebration: boolean;
  displayMode: DisplayMode;
  timeRemaining: number;
  showWarning: boolean;
  penalty: number;
  isCorrect: boolean;
  manuallyChanged: boolean;
  attempts: number;
  playPronunciation: () => Promise<void>;
  checkSpellingAttempt: () => void;
  checkBlanksAttempt: () => void;
  handleTimeExpired: () => void;
  currentWordIndex: number;
  totalWords: number;
  onComplete: (correct: boolean, penalty?: number) => void;
  onNavigate?: (direction: 'next' | 'prev') => void;
  onEndSession?: () => void;
  moveToPreviousStage: () => void;
  moveToNextStage: () => void;
  inputRefs: RefObject<(HTMLInputElement | null)[]>;
  letterInputRefs: RefObject<(HTMLInputElement | null)[]>;
  handleBlanksChange: (index: number, value: string) => void;
  handleBlanksKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleLetterChange: (index: number, value: string) => void;
  handleLetterKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  setManuallyChanged: (changed: boolean) => void;
}

export const SpellingContext = createContext<SpellingContextProps | undefined>(undefined);

export const useSpellingContext = () => {
  const context = useContext(SpellingContext);
  if (!context) {
    throw new Error('useSpellingContext must be used within a SpellingProvider');
  }
  return context;
};
