import { Dispatch, SetStateAction } from 'react';
import { Word } from '@/types/word';
import { DisplayMode } from './useSpellingState';

export const useBlankCheckHandlers = (
  word: Word,
  blanksAttempt: string[],
  blankIndices: number[],
  attempts: number,
  setAttempts: Dispatch<SetStateAction<number>>,
  setPenalty: Dispatch<SetStateAction<number>>,
  setDisplayMode: (mode: DisplayMode) => void,
  setShowCelebration: (show: boolean) => void,
  setIsCorrect: (isCorrect: boolean) => void,
  setBlanksAttempt: Dispatch<SetStateAction<string[]>>,
  setLetterAttempts: Dispatch<SetStateAction<string[]>>,
  setManuallyChanged: Dispatch<SetStateAction<boolean>>,
  clearAllTimers: () => void,
  playPronunciationTimes: (times: number) => void,
  startTimer: () => void
) => {
  const checkBlanksAttempt = () => {
    const isRTL = word.language === 'urdu' || word.language === 'arabic';
    
    // For Urdu/Arabic, we need to check each blank individually
    if (isRTL) {
      console.log("Checking RTL blanks attempt");
      console.log("User blanks:", blanksAttempt);
      console.log("Original word:", word.text);
      
      let allCorrect = true;
      let anyFilled = false;
      
      // Check each blank individually
      for (const index of blankIndices) {
        // Ensure we have a valid value to check
        if (blanksAttempt[index] === undefined || blanksAttempt[index] === null || blanksAttempt[index] === '') {
          console.log(`Missing value at index ${index}`);
          allCorrect = false;
        } else {
          // If at least one blank is filled, mark anyFilled as true
          anyFilled = true;
          
          const userChar = blanksAttempt[index];
          const correctChar = word.text[index];
          
          console.log(`Checking index ${index}: user="${userChar}" vs correct="${correctChar}"`);
          
          if (userChar !== correctChar) {
            allCorrect = false;
            console.log(`Mismatch at index ${index}`);
          }
        }
      }
      
      if (allCorrect && anyFilled) {
        console.log("All blanks correct!");
        handleCorrectBlanksAnswer();
      } else {
        console.log("Some blanks incorrect or missing");
        handleIncorrectBlanksAnswer();
      }
    } else {
      // For non-RTL languages, use the original case-insensitive comparison
      const userAttempt = blanksAttempt.join('').toLowerCase();
      const correctWord = word.text.toLowerCase();
      
      if (userAttempt === correctWord) {
        handleCorrectBlanksAnswer();
      } else {
        handleIncorrectBlanksAnswer();
      }
    }
  };

  const handleCorrectBlanksAnswer = () => {
    setIsCorrect(true);
    setShowCelebration(true);
    clearAllTimers();
    
    console.log(`Correct blanks for word: ${word.text} (${word.language}), transitioning to typing stage`);
    
    // Wait a moment before moving to the typing stage
    setTimeout(() => {
      setShowCelebration(false);
      setIsCorrect(false);
      setDisplayMode('input');
      const initialLetterAttempts = Array(word.text.length).fill('');
      setLetterAttempts(initialLetterAttempts);
      setManuallyChanged(false); // Reset the flag for next stage
      playPronunciationTimes(1);  // Play once for typing stage
      startTimer();
    }, 1500);
  };

  const handleIncorrectBlanksAnswer = () => {
    // Increase the attempts counter and apply penalty if needed
    setAttempts(prev => prev + 1);
    if (attempts >= 1) {
      setPenalty(prev => Math.min(prev + 0.25, 0.5));
    }
    
    // Remove toast notification and add animation trigger
    // (Animation will be controlled via parent component)
    window.dispatchEvent(new CustomEvent('incorrect-blanks-attempt', {
      detail: {
        language: word.language,
        timestamp: Date.now()
      }
    }));
    
    // Reset the blanks but keep the pattern the same
    const initialBlanks = word.text.split('').map((char, i) => 
      blankIndices.includes(i) ? '' : char
    );
    setBlanksAttempt(initialBlanks);
    setManuallyChanged(false); // Reset the flag when blanks are reset
    playPronunciationTimes(1);  // Play once for fill in blanks stage
    startTimer();
  };

  // Method to handle when timer expires with no user input
  const handleTimerExpiredNoInput = () => {
    console.log(`Timer expired with no input for: ${word.text} (${word.language})`);
    
    // Increase the attempts counter and apply penalty
    setAttempts(prev => prev + 1);
    if (attempts >= 1) {
      setPenalty(prev => Math.min(prev + 0.25, 0.5));
    }
    
    // Reset the blanks but keep the pattern the same
    const initialBlanks = word.text.split('').map((char, i) => 
      blankIndices.includes(i) ? '' : char
    );
    setBlanksAttempt(initialBlanks);
    setManuallyChanged(false);
    
    // Play pronunciation and restart timer
    playPronunciationTimes(1);
    startTimer();
  };

  return {
    checkBlanksAttempt,
    handleCorrectBlanksAnswer,
    handleIncorrectBlanksAnswer,
    handleTimerExpiredNoInput
  };
};
