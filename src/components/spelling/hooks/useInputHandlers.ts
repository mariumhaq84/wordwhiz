
import { KeyboardEvent } from 'react';
import { Word } from '@/types/word';

export const useInputHandlers = (
  setBlanksAttempt: (cb: (prev: string[]) => string[]) => void,
  setLetterAttempts: (cb: (prev: string[]) => string[]) => void,
  setManuallyChanged: (changed: boolean) => void,
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>,
  blankIndices: number[],
  letterInputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>,
  word?: Word
) => {
  // Determine if we need RTL handling
  const isRTL = word?.language === 'urdu' || word?.language === 'arabic';

  // Special handler for Urdu character normalization
  const normalizeUrduChar = (char: string): string => {
    if (!isRTL) return char;
    
    // Keep only the first character for Urdu input
    if (char.length > 0) {
      const firstChar = char.charAt(0);
      console.log(`Normalizing Urdu character: "${char}" → "${firstChar}" (charCode: ${firstChar.charCodeAt(0)})`);
      return firstChar;
    }
    return char;
  };

  // Handlers for blanks mode
  const handleBlanksChange = (index: number, value: string) => {
    // Log the input for debugging
    if (isRTL) {
      console.log(`Blanks input at index ${index}: "${value}" (charCode: ${value ? value.charCodeAt(0) : 'empty'})`);
    }
    
    // Explicitly mark as manually changed when user edits a blank
    setManuallyChanged(true);
    
    // Normalize the input for Urdu
    const normalizedValue = normalizeUrduChar(value);
    
    setBlanksAttempt(prev => {
      const newBlanksAttempt = [...prev];
      // Only update the current index
      newBlanksAttempt[index] = normalizedValue;
      console.log(`Updated blanks array at index ${index} with: "${normalizedValue}"`);
      return newBlanksAttempt;
    });
    
    // Auto-advance to next input after entering a character for RTL languages
    if (isRTL && value && value.trim() !== '') {
      const blankPosition = blankIndices.findIndex(idx => idx === index);
      if (blankPosition > 0) {  // Check if there's a previous position (we're moving right to left)
        const prevPosition = blankPosition - 1;
        const prevIndex = blankIndices[prevPosition];
        
        setTimeout(() => {
          if (inputRefs.current && inputRefs.current[prevPosition]) {
            inputRefs.current[prevPosition]?.focus();
            console.log(`RTL auto-advance: Moved focus from index ${index} to ${prevIndex}`);
          }
        }, 10);
      }
    }
  };

  // Handlers for full input mode
  const handleLetterChange = (index: number, value: string) => {
    // Log the input for debugging
    if (isRTL) {
      console.log(`Letter input at index ${index}: "${value}" (charCode: ${value ? value.charCodeAt(0) : 'empty'})`);
    }
    
    // Normalize the input for Urdu
    const normalizedValue = normalizeUrduChar(value);
    
    setLetterAttempts(prev => {
      const newLetterAttempts = [...prev];
      // Only update the current index
      newLetterAttempts[index] = normalizedValue;
      return newLetterAttempts;
    });
    
    // Auto-advance to next input after entering a character for RTL languages
    if (isRTL && value && value.trim() !== '') {
      // For RTL languages, move to the previous index (right to left visually)
      const nextIndex = index - 1;
      if (nextIndex >= 0) {
        setTimeout(() => {
          if (letterInputRefs.current && letterInputRefs.current[nextIndex]) {
            letterInputRefs.current[nextIndex]?.focus();
            console.log(`RTL auto-advance: Moved focus from index ${index} to ${nextIndex}`);
          }
        }, 10);
      }
    }
  };

  // Key navigation for blanks mode
  const handleBlanksKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    const blankPosition = blankIndices.findIndex(idx => idx === index);
    
    if (blankPosition !== -1) {
      handleKeyNavigation(
        e, 
        blankPosition, 
        blankIndices.length, 
        inputRefs, 
        isRTL
      );
    }
  };

  // Key navigation for full input mode
  const handleLetterKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Enhanced RTL keyboard navigation
    if (isRTL) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        // Move right visually (which is index+1 in the array)
        const nextIndex = index + 1;
        if (nextIndex < word?.text.length! && letterInputRefs.current) {
          letterInputRefs.current[nextIndex]?.focus();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        // Move left visually (which is index-1 in the array)
        const prevIndex = index - 1;
        if (prevIndex >= 0 && letterInputRefs.current) {
          letterInputRefs.current[prevIndex]?.focus();
        }
      } else if (e.key === 'Backspace' && !e.currentTarget.value) {
        // After clearing with backspace, move to next input (right visually in RTL)
        const nextIndex = index + 1;
        if (nextIndex < word?.text.length! && letterInputRefs.current) {
          letterInputRefs.current[nextIndex]?.focus();
        }
      } else if (e.key.length === 1 && !e.repeat && !e.ctrlKey && !e.altKey && !e.metaKey) {
        // Auto-advance is now handled in handleLetterChange
      }
    } else {
      // Regular LTR keyboard navigation
      handleKeyNavigation(
        e, 
        index, 
        word?.text.length || 0, 
        letterInputRefs, 
        false
      );
    }
  };

  // Shared key navigation logic - improved for RTL
  const handleKeyNavigation = (
    e: KeyboardEvent<HTMLInputElement>,
    currentPosition: number,
    totalPositions: number,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    isRTLEnabled: boolean
  ) => {
    if (isRTLEnabled) {
      // RTL navigation logic - reversed direction for proper RTL cursor movement
      if (e.key === 'ArrowLeft') {
        e.preventDefault(); // Prevent default to avoid cursor movement
        const nextPosition = currentPosition + 1; // Move right in array (which is left visually in RTL)
        if (nextPosition < totalPositions) {
          refs.current[nextPosition]?.focus();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault(); // Prevent default to avoid cursor movement
        const prevPosition = currentPosition - 1; // Move left in array (which is right visually in RTL)
        if (prevPosition >= 0) {
          refs.current[prevPosition]?.focus();
        }
      } else if (e.key === 'Backspace' && !e.currentTarget.value) {
        // After clearing with backspace, move to next input (right) in RTL
        const nextPosition = currentPosition + 1;
        if (nextPosition < totalPositions) {
          refs.current[nextPosition]?.focus();
        }
      }
      // Note: Auto-advance is now handled in the individual change handlers
    } else {
      // LTR navigation logic
      if (e.key === 'ArrowRight') {
        const nextPosition = currentPosition + 1;
        if (nextPosition < totalPositions) {
          refs.current[nextPosition]?.focus();
        }
      } else if (e.key === 'ArrowLeft') {
        const prevPosition = currentPosition - 1;
        if (prevPosition >= 0) {
          refs.current[prevPosition]?.focus();
        }
      } else if (e.key === 'Backspace' && !e.currentTarget.value && currentPosition > 0) {
        const prevPosition = currentPosition - 1;
        refs.current[prevPosition]?.focus();
      } else if (e.key !== 'Backspace' && !e.repeat && e.key.length === 1) {
        // Auto-advance to next field for LTR after typing a character
        const nextPosition = currentPosition + 1;
        if (nextPosition < totalPositions) {
          setTimeout(() => {
            refs.current[nextPosition]?.focus();
          }, 10);
        }
      }
    }
  };

  return {
    handleBlanksChange,
    handleLetterChange,
    handleBlanksKeyDown,
    handleLetterKeyDown
  };
};
