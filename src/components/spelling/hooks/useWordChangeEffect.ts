
import { useEffect, useRef } from 'react';
import { Word } from '@/types/word';

export const useWordChangeEffect = (
  word: Word,
  clearAllTimers: () => void,
  setDisplayMode: (mode: 'full' | 'partial' | 'input') => void,
  setIsCorrect: (isCorrect: boolean) => void,
  setShowCelebration: (show: boolean) => void,
  setAttempts: (attempts: number) => void,
  setPenalty: (penalty: number) => void,
  setManuallyChanged: (changed: boolean) => void,
  setLetterAttempts: (attempts: string[]) => void,
  playPronunciationTimes: (times: number) => void,
  startTimer: () => void
) => {
  const prevWordRef = useRef(word.text);
  const prevWordIdRef = useRef(word.id);
  const wordChangeHandledRef = useRef(false);
  const inProgressRef = useRef(false);

  // Reset state when word changes - this is critical for proper audio playback
  useEffect(() => {
    // Skip if a word change is already in progress to prevent duplicate handling
    if (inProgressRef.current) {
      return;
    }
    
    // Check for word ID change, not just text change
    if (prevWordRef.current !== word.text || prevWordIdRef.current !== word.id) {
      console.log(`Word changed from "${prevWordRef.current}" (ID: ${prevWordIdRef.current}) to "${word.text}" (ID: ${word.id})`);
      
      // Set flag to prevent duplicate processing
      inProgressRef.current = true;
      
      // Mark the beginning of word change handling
      wordChangeHandledRef.current = true;
      
      // Clear existing timers and speech
      clearAllTimers();
      
      // Reset all state
      setDisplayMode('full');
      setIsCorrect(false);
      setShowCelebration(false);
      setAttempts(0);
      setPenalty(0);
      setManuallyChanged(false);
      setLetterAttempts(Array(word.text.length).fill(''));
      prevWordRef.current = word.text;
      prevWordIdRef.current = word.id;
      
      // Explicitly play pronunciation for the new word with a slight delay
      // to ensure the speech synthesis is ready
      setTimeout(() => {
        // Start with the memory stage and pronunciation only once
        playPronunciationTimes(1);
        startTimer();
        
        // Reset the handling flag after playback is scheduled
        wordChangeHandledRef.current = false;
        inProgressRef.current = false;
      }, 200); // Increased delay to ensure completion
    }
  }, [word.text, word.id, clearAllTimers, setDisplayMode, setIsCorrect, setShowCelebration, 
      setAttempts, setPenalty, setManuallyChanged, setLetterAttempts, 
      playPronunciationTimes, startTimer]);

  return {
    wordChangeHandledRef
  };
};
