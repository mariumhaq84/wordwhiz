
import { DisplayMode } from "./useSpellingState";
import { Word } from "@/types/word";
import { useToastNotifications } from "./useToastNotifications";
import { usePenaltyHandlers } from "./usePenaltyHandlers";

export const useAnswerHandlers = (
  word: Word,
  displayMode: DisplayMode,
  setDisplayMode: (mode: DisplayMode) => void,
  blanksAttempt: string[],
  blankIndices: number[],
  setBlanksAttempt: (blanks: string[]) => void,
  letterAttempts: string[],
  setLetterAttempts: (letters: string[]) => void,
  setAttempts: (cb: (prev: number) => number) => void,
  attempts: number,
  setPenalty: (cb: (prev: number) => number) => void,
  penalty: number,
  setShowCelebration: (show: boolean) => void,
  setIsCorrect: (isCorrect: boolean) => void,
  clearAllTimers: () => void,
  playPronunciationTimes: (times: number) => void,
  startTimer: () => void,
  setManuallyChanged: (changed: boolean) => void,
  onComplete: (correct: boolean, penalty?: number) => void
) => {
  const { incrementAttemptsWithPenalty } = usePenaltyHandlers(
    attempts,
    setAttempts,
    setPenalty
  );
  
  const { 
    showCorrectAnswerToast, 
    showIncorrectAnswerToast,
    showCorrectBlanksToast,
    showIncorrectBlanksToast,
    showTimeExpiredToast
  } = useToastNotifications();

  const handleTimeExpired = () => {
    clearAllTimers();
    
    if (displayMode === 'full') {
      setDisplayMode('partial');
      const indices = generateBlankPattern(word.text);
      
      const initialBlanks = word.text.split('').map((char, i) => 
        indices.includes(i) ? '' : char
      );
      setBlanksAttempt(initialBlanks);
      setManuallyChanged(false); // Reset the flag when transitioning to partial mode
      // Play only once for fill-in-blanks stage
      playPronunciationTimes(1);
      startTimer();
      return;
    }
    
    if (displayMode === 'partial') {
      const isRTL = word.language === 'urdu' || word.language === 'arabic';
      
      // Check if user made any attempts in blank fields
      let anyBlanksFilled = blankIndices.some(index => 
        blanksAttempt[index] && blanksAttempt[index].trim() !== ''
      );
      
      // For RTL languages, check if any blanks are filled
      if (isRTL) {
        console.log('Timer expired for RTL blanks stage');
        
        if (!anyBlanksFilled) {
          showTimeExpiredToast();
          console.log('No entries made for Urdu/Arabic blanks, resetting');
          
          // No entries made, so reset blanks and apply penalty
          incrementAttemptsWithPenalty();
          
          // Reset blanks with original pattern
          const initialBlanks = word.text.split('').map((char, i) => 
            blankIndices.includes(i) ? '' : char
          );
          setBlanksAttempt(initialBlanks);
          setManuallyChanged(false);
          
          // Restart the timer and play pronunciation
          playPronunciationTimes(1);
          startTimer();
          return;
        }
        
        // If some entries were made, check if they're correct
        const allCorrect = blankIndices.every(index => 
          blanksAttempt[index] === word.text[index]
        );
        
        if (allCorrect) {
          handleCorrectPartialAnswer();
          return;
        } else {
          showIncorrectBlanksToast();
          handleIncorrectPartialAnswer();
          return;
        }
      } else {
        // Non-RTL language handling
        const allBlanksFilled = blankIndices.every(index => 
          blanksAttempt[index] && blanksAttempt[index].trim() !== ''
        );
        
        const isPartialComplete = allBlanksFilled && 
          blanksAttempt.join('').toLowerCase() === word.text.toLowerCase();
        
        if (allBlanksFilled && isPartialComplete) {
          handleCorrectPartialAnswer();
          return;
        } else {
          if (!allBlanksFilled) {
            showTimeExpiredToast();
          }
          handleIncorrectPartialAnswer();
          return;
        }
      }
    }
    
    if (displayMode === 'input') {
      const allLettersFilled = letterAttempts.every(letter => 
        letter && letter.trim() !== ''
      );
      
      const isInputComplete = allLettersFilled && 
        letterAttempts.join('').toLowerCase() === word.text.toLowerCase();
      
      if (allLettersFilled && isInputComplete) {
        handleCorrectInputAnswer();
        return;
      } else {
        if (!allLettersFilled) {
          showTimeExpiredToast();
        }
        handleIncorrectInputAnswer();
        return;
      }
    }
  };

  const generateBlankPattern = (text: string): number[] => {
    const indices: number[] = [];
    for (let i = 1; i < text.length; i += 2) {
      indices.push(i);
    }
    return indices;
  };

  const handleCorrectPartialAnswer = () => {
    setShowCelebration(true);
    showCorrectBlanksToast();
    
    setTimeout(() => {
      setShowCelebration(false);
      setDisplayMode('input');
      const initialLetterAttempts = Array(word.text.length).fill('');
      setLetterAttempts(initialLetterAttempts);
      setManuallyChanged(false); // Reset the flag when moving to input mode
      // Play only once for typing stage
      playPronunciationTimes(1);
      startTimer();
    }, 1500);
  };

  const handleIncorrectPartialAnswer = () => {
    showIncorrectBlanksToast();
    incrementAttemptsWithPenalty();
    
    const indices = blankIndices;
    const initialBlanks = word.text.split('').map((char, i) => 
      indices.includes(i) ? '' : char
    );
    setBlanksAttempt(initialBlanks);
    setManuallyChanged(false); // Reset the flag when resetting blanks
    // Play only once for fill-in-blanks stage after incorrect attempt
    playPronunciationTimes(1);
    startTimer();
  };

  const handleCorrectInputAnswer = () => {
    setShowCelebration(true);
    showCorrectAnswerToast();
    
    setTimeout(() => {
      setShowCelebration(false);
      onComplete(true, penalty);
    }, 1500);
  };

  const handleIncorrectInputAnswer = () => {
    incrementAttemptsWithPenalty();
    showIncorrectAnswerToast();
    
    setDisplayMode('full');
    // Play only once for memorize stage after incorrect typing attempt
    playPronunciationTimes(1);
    setLetterAttempts(Array(word.text.length).fill(''));
    setManuallyChanged(false); // Reset the flag when going back to full mode
    startTimer();
  };

  return {
    handleTimeExpired,
    handleCorrectPartialAnswer,
    handleIncorrectPartialAnswer,
    handleCorrectInputAnswer,
    handleIncorrectInputAnswer
  };
};
