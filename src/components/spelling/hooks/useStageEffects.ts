import { useEffect, useRef } from 'react';
import { Word } from '@/types/word';

type DisplayMode = 'full' | 'partial' | 'input';

export const useStageEffects = (
  word: Word,
  displayMode: DisplayMode,
  blankIndices: number[],
  setBlankIndices: (indices: number[]) => void,
  setBlanksAttempt: (blanks: string[]) => void,
  setLetterAttempts: (letters: string[]) => void,
  generateBlankPattern: (text: string) => number[],
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>,
  letterInputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>,
  clearAllTimers: () => void,
  playPronunciationTimes: (times: number) => void,
  startTimer: (wordId?: string) => void,
  letterAttempts: string[],
  blanksAttempt: string[],
  isCorrect: boolean,
  checkSpellingAttempt: () => void,
  checkBlanksAttempt: () => void,
  manuallyChanged: boolean,
  autoCheck: boolean = true
) => {
  const setupCompletedRef = useRef(false);
  const wordRef = useRef(word.text);
  const wordIdRef = useRef(word.id);
  const previousWordRef = useRef<string | null>(null);
  const navigationInProgressRef = useRef(false);
  const initialSetupDoneRef = useRef(false);
  const eventHandledRef = useRef(false);
  
  // Initialize inputs when display mode changes - without auto-filling
  useEffect(() => {
    if (initialSetupDoneRef.current) {
      // Skip auto-initialization after initial setup to prevent auto-filling
      return;
    }

    if (displayMode === 'partial') {
      const indices = generateBlankPattern(word.text);
      setBlankIndices(indices);
      
      // Initialize with empty strings for blank positions
      const initialBlanks = word.text.split('').map((char, i) => 
        indices.includes(i) ? '' : char
      );
      setBlanksAttempt(initialBlanks);
      inputRefs.current = Array(indices.length).fill(null);
      initialSetupDoneRef.current = true;
    } else if (displayMode === 'input') {
      const initialLetterAttempts = Array(word.text.length).fill('');
      setLetterAttempts(initialLetterAttempts);
      letterInputRefs.current = Array(word.text.length).fill(null);
      initialSetupDoneRef.current = true;
    }
  }, [displayMode]);

  // Reset everything when word changes
  useEffect(() => {
    // Skip if we're already handling this word or if the word hasn't actually changed
    if (navigationInProgressRef.current || (wordRef.current === word.text && wordIdRef.current === word.id)) {
      return;
    }
    
    console.log(`useStageEffects: Word changed from "${wordRef.current}" (ID: ${wordIdRef.current}) to "${word.text}" (ID: ${word.id})`);
    
    // Reset initialization flag when word changes
    initialSetupDoneRef.current = false;
    
    // Detect and handle word navigation
    const isWordNavigation = previousWordRef.current !== null;
    previousWordRef.current = wordRef.current;
    
    // Update the refs
    wordRef.current = word.text;
    wordIdRef.current = word.id;
    
    // Set flag to prevent concurrent timer operations
    navigationInProgressRef.current = true;
    
    // Clear any existing timers first
    clearAllTimers();
    setupCompletedRef.current = true;
    
    // Play only once for the current stage to prevent multiple audio playbacks
    setTimeout(() => {
      // Play only once for each stage
      playPronunciationTimes(1);
      
      // Start a new timer with a small delay if this was a navigation
      if (isWordNavigation) {
        setTimeout(() => {
          // Use the word ID as the unique timer identifier
          startTimer(word.id);
          navigationInProgressRef.current = false;
        }, 200); // Increased delay to ensure event completion
      } else {
        // Use the word ID as the unique timer identifier
        startTimer(word.id);
        navigationInProgressRef.current = false;
      }
    }, 150); // Add delay to prevent immediate playback
    
    return () => {
      clearAllTimers();
    };
  }, [word.id, word.text, clearAllTimers, playPronunciationTimes, startTimer, displayMode]);

  // Listen for external word change events
  useEffect(() => {
    const handleWordChanged = (event: CustomEvent) => {
      if (eventHandledRef.current) return;
      
      if (event.detail && event.detail.wordId && event.detail.wordId !== wordIdRef.current) {
        console.log(`useStageEffects: Received word change event to ID: ${event.detail.wordId}, text: "${event.detail.wordText || ''}"`);
        eventHandledRef.current = true;
        
        // Reset flag after delay to prevent duplicate handling
        setTimeout(() => {
          eventHandledRef.current = false;
        }, 500);
      }
    };
    
    window.addEventListener('wordChanged', handleWordChanged as EventListener);
    
    return () => {
      window.removeEventListener('wordChanged', handleWordChanged as EventListener);
    };
  }, []);

  // Initial setup when component mounts
  useEffect(() => {
    if (setupCompletedRef.current) return;
    
    // Play only once for each stage
    if (displayMode === 'full') {
      playPronunciationTimes(1);
    } else if (displayMode === 'partial') {
      playPronunciationTimes(1);
    } else {
      playPronunciationTimes(1);
    }
    
    // Start a new timer using the word ID as the unique ID
    startTimer(word.id);
    setupCompletedRef.current = true;
    
    return () => {
      clearAllTimers();
    };
  }, []);  // Empty dependency array to run only once on mount

  // Auto-check for input mode (typing the whole word)
  useEffect(() => {
    if (displayMode !== 'input' || !autoCheck) return;
    
    // Check if we have the right number of letters
    if (letterAttempts.length !== word.text.length) {
      return;
    }
    
    // Check if all letters are filled with non-empty values
    const allLettersFilled = letterAttempts.every(letter => 
      letter && letter.trim() !== ''
    );
    
    // Only auto-check if all letters are actually filled and we're not already correct
    if (allLettersFilled && !isCorrect) {
      // Log for debugging
      console.log("Auto-checking spelling because all letters are filled");
      
      // Use a timeout to allow any last input focus events to complete
      setTimeout(() => {
        checkSpellingAttempt();
      }, 300);
    }
  }, [letterAttempts, displayMode, isCorrect, word.text.length, checkSpellingAttempt, autoCheck]);

  // Auto-check for partial mode (fill in the blanks)
  useEffect(() => {
    // Only run if we're in partial mode, auto-check is enabled, and we've manually changed something
    if (displayMode !== 'partial' || !autoCheck || !manuallyChanged) return;
    
    // Check if all blanks are filled
    const allBlanksFilled = blankIndices.every(index => 
      blanksAttempt[index] && blanksAttempt[index].trim() !== ''
    );
    
    // Only auto-check if all blanks are filled and not already correct
    if (allBlanksFilled && !isCorrect) {
      console.log("Auto-checking blanks because all blanks are filled");
      
      // Use a short timeout to allow for input focus events to complete
      setTimeout(() => {
        checkBlanksAttempt();
      }, 300);
    }
  }, [blanksAttempt, blankIndices, displayMode, isCorrect, manuallyChanged, checkBlanksAttempt, autoCheck]);
};
