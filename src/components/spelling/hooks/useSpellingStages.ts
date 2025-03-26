
import { useState, useCallback, useRef } from 'react';
import { Word } from '@/types/word';
import { DisplayMode } from './useSpellingState';
import { useSpellingRefs } from './useSpellingRefs';
import { useSpellingTimer } from './useSpellingTimer';
import { useBlankPatterns } from './useBlankPatterns';
import { usePronunciation } from '../pronunciation/usePronunciation';
import { useStageNavigation } from './useStageNavigation';

export const useSpellingStages = (
  word: Word,
  onComplete: (correct: boolean, penalty?: number) => void,
) => {
  // Base state for the spelling stages
  const [letterAttempts, setLetterAttempts] = useState<string[]>(Array(word.text.length).fill(''));
  const [blanksAttempt, setBlanksAttempt] = useState<string[]>(word.text.split(''));
  const [blankIndices, setBlankIndices] = useState<number[]>([]);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('full');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [manuallyChanged, setManuallyChanged] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [penalty, setPenalty] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [showWarning, setShowWarning] = useState(false);

  // Get the pronunciation hook
  const pronunciation = usePronunciation(word);

  // Get the input refs
  const { inputRefs, letterInputRefs } = useSpellingRefs();

  // Define the handleTimeExpired function before using it in useSpellingTimer
  const handleTimeExpired = useCallback(() => {
    // This will be implemented to handle when the timer expires
    console.log("Time expired for word:", word.id);
  }, [word.id]);

  // Get the timer functionality
  const { 
    clearTimers, 
    clearAllTimers, 
    startTimer, 
    pauseTimer, 
    resumeTimer 
  } = useSpellingTimer(
    setTimeRemaining,  
    setShowWarning,
    handleTimeExpired
  );

  // Get blank pattern generation
  const { generateBlankPattern } = useBlankPatterns();

  // Get stage navigation functions
  const { moveToNextStage, moveToPreviousStage } = useStageNavigation(
    displayMode,
    setDisplayMode,
    setIsCorrect,
    clearAllTimers,
    setShowWarning,
    setManuallyChanged,
    pronunciation.playPronunciationTimes,
    startTimer,
    word,
    generateBlankPattern,
    setBlankIndices,
    setBlanksAttempt,
    setLetterAttempts
  );

  // Return all the state and functions needed by the spelling component
  return {
    // State
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
    setPenalty,
    isCorrect,
    setIsCorrect,
    manuallyChanged,
    setManuallyChanged,
    attempts,
    setAttempts,
    
    // Refs
    inputRefs,
    letterInputRefs,
    
    // Pronunciation functions
    playPronunciation: pronunciation.playPronunciation,
    playPronunciationTimes: pronunciation.playPronunciationTimes,
    playPronunciationThreeTimes: pronunciation.playPronunciationThreeTimes,
    
    // Timer functions
    startTimer,
    pauseTimer,
    resumeTimer,
    clearAllTimers: useCallback(() => {
      clearAllTimers();
      pronunciation.clearPlaybackTimers();
      pronunciation.stopCurrentSpeech();
    }, [clearAllTimers, pronunciation]),
    handleTimeExpired,
    
    // Stage navigation
    moveToNextStage,
    moveToPreviousStage,
    
    // Utility functions
    generateBlankPattern,
  };
};
