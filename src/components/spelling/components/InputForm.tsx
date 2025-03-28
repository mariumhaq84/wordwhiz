import React, { FormEvent, KeyboardEvent, RefObject, useState, useRef, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Keyboard } from 'lucide-react';
import UrduKeyboard from '../UrduKeyboard';
import ArabicKeyboard from '../ArabicKeyboard';
import { toast } from 'sonner';
import SubmitButton from './SubmitButton';
import KeyboardToggle from './KeyboardToggle';
import { Word } from '@/types/word';
import CharacterInputGrid from './character/CharacterInputGrid';

interface InputFormProps {
  word: Word;
  letterAttempts: string[];
  letterInputRefs: RefObject<(HTMLInputElement | null)[]>;
  isCorrect: boolean;
  handleLetterChange: (index: number, value: string) => void;
  handleLetterKeyDown: (index: number, e: KeyboardEvent<HTMLInputElement>) => void;
  checkSpellingAttempt: () => void;
  autoCheck?: boolean;
  setAutoCheck?: (enabled: boolean) => void;
  colorScheme?: 'green' | 'amber';
}

const InputForm = ({
  word,
  letterAttempts,
  letterInputRefs,
  isCorrect,
  handleLetterChange,
  handleLetterKeyDown,
  checkSpellingAttempt,
  autoCheck = true,
  setAutoCheck,
  colorScheme = 'green'
}: InputFormProps) => {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  
  // Determine if we need RTL direction
  const isRTL = word.language === 'urdu' || word.language === 'arabic';
  
  // Track if component is mounted
  const isMountedRef = useRef(true);
  
  // Track which direction key was last pressed
  const lastKeyPressedRef = useRef<'left' | 'right' | 'other'>('other');
  
  // Track if we're currently focusing an input
  const isFocusingRef = useRef(false);
  
  useEffect(() => {
    isMountedRef.current = true;
    
    // Add global keyboard event listener
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') lastKeyPressedRef.current = 'left';
      else if (e.key === 'ArrowRight') lastKeyPressedRef.current = 'right';
      else lastKeyPressedRef.current = 'other';
    };
    
    window.addEventListener('keydown', handleGlobalKeyDown as any);
    
    return () => {
      isMountedRef.current = false;
      window.removeEventListener('keydown', handleGlobalKeyDown as any);
    };
  }, []);
  
  // Override default keyboard navigation for RTL
  useEffect(() => {
    if (!isRTL) return;
    
    // Custom key handler for RTL to override default behavior
    const overrideArrowKeys = (e: KeyboardEvent) => {
      if (!isRTL) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        // For RTL, we need to reverse the arrow keys: left = next (decreasing index), right = previous (increasing index)
        e.preventDefault();
        
        if (focusedIndex === null) return;
        
        const newIndex = e.key === 'ArrowLeft' 
          ? focusedIndex - 1 // RTL: Left arrow moves focus left (decreasing index)
          : focusedIndex + 1; // RTL: Right arrow moves focus right (increasing index)
        
        if (newIndex >= 0 && newIndex < word.text.length) {
          moveFocus(newIndex);
        }
      }
    };
    
    window.addEventListener('keydown', overrideArrowKeys as any);
    return () => window.removeEventListener('keydown', overrideArrowKeys as any);
  }, [isRTL, focusedIndex, word.text.length]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    checkSpellingAttempt();
  };
  
  // Move focus to a specific index
  const moveFocus = (index: number) => {
    if (!isMountedRef.current || index < 0 || index >= word.text.length) return;
    
    // Prevent focus race conditions
    if (isFocusingRef.current) return;
    isFocusingRef.current = true;
    
    const input = letterInputRefs.current?.[index];
    if (input) {
      // Explicitly focus the input
      input.focus();
      
      // For RTL, force cursor to the right side (start) after focusing
      if (isRTL) {
        setTimeout(() => {
          if (input === document.activeElement) {
            try {
              input.setSelectionRange(0, 0);
            } catch (e) {
              console.error("Failed to set selection range:", e);
            }
          }
          isFocusingRef.current = false;
        }, 50);
      } else {
        isFocusingRef.current = false;
      }
      
      setFocusedIndex(index);
    } else {
      isFocusingRef.current = false;
    }
  };
  
  // Handle direction-aware navigation
  const navigateToNextInput = (currentIndex: number) => {
    if (currentIndex === null) {
      // Start at appropriate end
      moveFocus(isRTL ? word.text.length - 1 : 0);
      return;
    }
    
    // Determine next index based on text direction
    const nextIndex = isRTL ? currentIndex - 1 : currentIndex + 1;
    
    // Check if next index is valid
    if (nextIndex >= 0 && nextIndex < word.text.length) {
      moveFocus(nextIndex);
    } else if (autoCheck) {
      // We've reached the end - trigger check
      setTimeout(checkSpellingAttempt, 150);
    }
  };
  
  // Handle direction-aware backspace navigation
  const navigateToPreviousInput = (currentIndex: number) => {
    if (currentIndex === null) return;
    
    // Determine previous index based on text direction
    const prevIndex = isRTL ? currentIndex + 1 : currentIndex - 1;
    
    // Check if previous index is valid
    if (prevIndex >= 0 && prevIndex < word.text.length) {
      moveFocus(prevIndex);
    }
  };

  // Handle virtual keyboard key press
  const handleKeyPress = (key: string) => {
    if (focusedIndex === null) {
      // No input focused, start at the appropriate position
      const startIndex = isRTL ? word.text.length - 1 : 0;
      
      // First focus the input
      moveFocus(startIndex);
      
      // Then apply the character with a slight delay
      setTimeout(() => {
        if (isMountedRef.current) {
          handleLetterChange(startIndex, key);
          
          // Navigate to next input after applying the character
          setTimeout(() => {
            if (isMountedRef.current) {
              navigateToNextInput(startIndex);
            }
          }, 50);
        }
      }, 50);
    } else {
      // Input already focused
      handleLetterChange(focusedIndex, key);
      
      // Navigate to next input after applying the character
      setTimeout(() => {
        if (isMountedRef.current) {
          navigateToNextInput(focusedIndex);
        }
      }, 50);
    }
  };

  // Handle backspace from virtual keyboard
  const handleBackspace = () => {
    if (focusedIndex === null) {
      // No input focused, nothing to do
      return;
    }
    
    // Check if current input has a value
    if (letterAttempts[focusedIndex]) {
      // Clear current input
      handleLetterChange(focusedIndex, '');
    } else {
      // Current input already empty, navigate to previous input
      navigateToPreviousInput(focusedIndex);
    }
  };

  // Handle input focus
  const handleInputFocus = (index: number) => {
    setFocusedIndex(index);
  };
  
  // Override default key handling for RTL navigation
  const handleRTLKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Call the original handler first
    handleLetterKeyDown(index, e);
    
    if (!isRTL) return;
    
    const key = e.key;
    
    // Handle special RTL navigation
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
      
      // For RTL we need to reverse arrow key behavior
      if (key === 'ArrowLeft') {
        // Move left (decreasing index) for RTL languages
        const nextIndex = index - 1;
        if (nextIndex >= 0) {
          moveFocus(nextIndex);
        }
      } else if (key === 'ArrowRight') {
        // Move right (increasing index) for RTL languages
        const prevIndex = index + 1;
        if (prevIndex < word.text.length) {
          moveFocus(prevIndex);
        }
      }
    } else if (e.key === 'Backspace') {
      if (!letterAttempts[index]) {
        // If input is empty, move to next input (to the right for RTL)
        const nextIndex = index + 1;
        if (nextIndex < word.text.length) {
          e.preventDefault(); // Prevent default backspace
          moveFocus(nextIndex);
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="space-y-6">
        <CharacterInputGrid
          word={word}
          letterAttempts={letterAttempts}
          letterInputRefs={letterInputRefs}
          isCorrect={isCorrect}
          handleInputChange={handleLetterChange}
          handleLetterKeyDown={isRTL ? handleRTLKeyDown : handleLetterKeyDown}
          handleInputFocus={handleInputFocus}
          colorScheme={colorScheme}
        />

        <div className="flex justify-between items-center px-2">
          {/* Auto-check toggle */}
          {setAutoCheck && (
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-check"
                checked={autoCheck}
                onCheckedChange={setAutoCheck}
              />
              <Label htmlFor="auto-check" className="text-sm font-medium">Auto check</Label>
            </div>
          )}
          
          {/* Keyboard toggle */}
          <KeyboardToggle 
            showKeyboard={showKeyboard}
            setShowKeyboard={setShowKeyboard}
          />
          
          {/* Submit button */}
          {!autoCheck && (
            <SubmitButton 
              isCorrect={isCorrect}
              language={word.language}
              colorScheme={colorScheme}
            />
          )}
        </div>
        
        {/* Virtual keyboard for special languages */}
        {showKeyboard && (
          <div className="mt-4 border-t pt-4">
            {word.language === 'urdu' && (
              <UrduKeyboard onKeyPress={handleKeyPress} onBackspace={handleBackspace} />
            )}
            {word.language === 'arabic' && (
              <ArabicKeyboard onKeyPress={handleKeyPress} onBackspace={handleBackspace} />
            )}
          </div>
        )}
      </div>
    </form>
  );
};

export default InputForm;
