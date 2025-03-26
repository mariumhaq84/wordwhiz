
import { Word } from '@/types/word';
import { Dispatch, SetStateAction } from 'react';
import { DisplayMode } from './useSpellingState';
import { useToastNotifications } from './useToastNotifications';

export const useInputCheckHandlers = (
  word: Word,
  letterAttempts: string[],
  attempts: number,
  setAttempts: Dispatch<SetStateAction<number>>,
  setPenalty: Dispatch<SetStateAction<number>>,
  penalty: number,
  setDisplayMode: (mode: DisplayMode) => void,
  setShowCelebration: (show: boolean) => void,
  setIsCorrect: (isCorrect: boolean) => void,
  setLetterAttempts: Dispatch<SetStateAction<string[]>>,
  clearAllTimers: () => void,
  playPronunciationTimes: (times: number) => void,
  startTimer: () => void,
  onComplete: (correct: boolean, penalty?: number) => void
) => {
  const { 
    showCorrectAnswerToast, 
    showIncorrectAnswerToast 
  } = useToastNotifications();

  // Determine if we need to handle RTL languages differently
  const isRTL = word.language === 'urdu' || word.language === 'arabic';

  const checkSpellingAttempt = () => {
    console.log("Checking spelling attempt for word:", word.text, "with ID:", word.id);
    
    // First, make sure all inputs have values
    const hasEmptyInputs = letterAttempts.some(letter => !letter || letter.trim() === '');
    
    if (hasEmptyInputs) {
      console.log("Empty inputs detected, marking as incorrect");
      showIncorrectAnswerToast();
      
      // Increase the attempts counter and apply penalty if necessary
      setAttempts(prev => prev + 1);
      if (attempts >= 1) {
        setPenalty(prev => Math.min(prev + 0.25, 0.5));
      }
      
      // Restart from the beginning (full word view)
      setDisplayMode('full');
      setLetterAttempts(Array(word.text.length).fill(''));
      // Play only once for memorize stage
      playPronunciationTimes(1);
      startTimer();
      return;
    }
    
    // For Urdu/Arabic, we need to check each letter individually
    if (isRTL) {
      console.log("Validating RTL word spelling:", word.text, "with ID:", word.id);
      
      let isSpellingCorrect = true;
      for (let i = 0; i < word.text.length; i++) {
        const userChar = letterAttempts[i];
        const correctChar = word.text[i];
        
        console.log(`Checking index ${i}: user="${userChar}" vs correct="${correctChar}"`);
        
        // Make sure we have a valid input first
        if (!userChar || userChar.trim() === '') {
          console.log(`Empty input at index ${i}`);
          isSpellingCorrect = false;
          break;
        }
        
        if (userChar !== correctChar) {
          console.log(`Mismatch at index ${i}`);
          isSpellingCorrect = false;
          break;
        }
      }
      
      if (isSpellingCorrect) {
        handleCorrectSpelling();
      } else {
        handleIncorrectSpelling();
      }
    } else {
      // For Latin-based languages, use case-insensitive comparison
      const userAttempt = letterAttempts.join('').toLowerCase();
      const correctWord = word.text.toLowerCase();
      
      if (userAttempt === correctWord) {
        handleCorrectSpelling();
      } else {
        handleIncorrectSpelling();
      }
    }
  };

  const handleCorrectSpelling = () => {
    console.log(`Correct spelling for word: ${word.text} (${word.language})`);
    setIsCorrect(true);
    setShowCelebration(true);
    clearAllTimers();
    showCorrectAnswerToast();
    
    // Wait a moment before marking complete
    setTimeout(() => {
      console.log(`Completing word: ${word.text} (${word.language}), moving to next word`);
      setShowCelebration(false);
      onComplete(true, penalty);
    }, 1500);
  };

  const handleIncorrectSpelling = () => {
    console.log(`Incorrect spelling for word: ${word.text} (${word.language})`);
    showIncorrectAnswerToast();
    
    // Increase the attempts counter and apply penalty if necessary
    setAttempts(prev => prev + 1);
    if (attempts >= 1) {
      setPenalty(prev => Math.min(prev + 0.25, 0.5));
    }
    
    // Restart from the beginning (full word view)
    setDisplayMode('full');
    setLetterAttempts(Array(word.text.length).fill(''));
    // Play only once for memorize stage
    playPronunciationTimes(1);
    startTimer();
  };

  return {
    checkSpellingAttempt
  };
};
