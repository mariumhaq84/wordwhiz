
import { DisplayMode } from "./useSpellingState";
import { Word } from "@/types/word";

export const useStageNavigation = (
  displayMode: DisplayMode,
  setDisplayMode: (mode: DisplayMode) => void,
  setIsCorrect: (isCorrect: boolean) => void,
  clearAllTimers: () => void,
  setShowWarning: (show: boolean) => void,
  setManuallyChanged: (changed: boolean) => void,
  playPronunciationTimes: (times: number) => void,
  startTimer: () => void,
  word: Word,
  generateBlankPattern: (text: string) => number[],
  setBlankIndices: (indices: number[]) => void,
  setBlanksAttempt: (blanks: string[]) => void,
  setLetterAttempts: (letters: string[]) => void
) => {
  const moveToNextStage = () => {
    clearAllTimers();
    setShowWarning(false);
    setManuallyChanged(false); // Reset on stage change
    
    if (displayMode === 'full') {
      setDisplayMode('partial');
      setIsCorrect(false);
      const indices = generateBlankPattern(word.text);
      setBlankIndices(indices);
      
      // Create initial blanks with empty strings for blanks positions (don't auto-fill)
      const initialBlanks = word.text.split('').map((char, i) => 
        indices.includes(i) ? '' : char
      );
      setBlanksAttempt(initialBlanks);
      
      // Play only once for the "fill in blanks" stage
      playPronunciationTimes(1);
      startTimer();
    } else if (displayMode === 'partial') {
      setDisplayMode('input');
      setIsCorrect(false);
      setManuallyChanged(false); // Ensure reset when moving from partial to input
      // Don't set any initial letters to avoid auto-filling
      setLetterAttempts(Array(word.text.length).fill(''));
      // Play only once for the "type word" stage
      playPronunciationTimes(1);
      startTimer();
    }
  };

  const moveToPreviousStage = () => {
    clearAllTimers();
    setShowWarning(false);
    setManuallyChanged(false); // Reset on stage change
    
    if (displayMode === 'input') {
      setDisplayMode('partial');
      setIsCorrect(false);
      // Don't set any initial blanks to avoid auto-filling
      const indices = generateBlankPattern(word.text);
      setBlankIndices(indices);
      const initialBlanks = word.text.split('').map((char, i) => 
        indices.includes(i) ? '' : char
      );
      setBlanksAttempt(initialBlanks);
      // Play only once for the "fill in blanks" stage
      playPronunciationTimes(1);
      startTimer();
    } else if (displayMode === 'partial') {
      setDisplayMode('full');
      setIsCorrect(false);
      // Play only once for the "memorize" stage
      playPronunciationTimes(1);
      startTimer();
    }
  };

  return {
    moveToNextStage,
    moveToPreviousStage
  };
};
