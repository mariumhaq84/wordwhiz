import React, { FormEvent, KeyboardEvent, RefObject, useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import UrduKeyboard from '../UrduKeyboard';
import { Keyboard } from 'lucide-react';
import { toast } from 'sonner';
import SubmitButton from './SubmitButton';
import CharacterInput from './CharacterInput';
import KeyboardToggle from './KeyboardToggle';
import StaticCharacter from './StaticCharacter';
import { Word } from '@/types/word';

interface PartialFormProps {
  word: Word;
  blanksAttempt: string[];
  blankIndices: number[];
  inputRefs: RefObject<(HTMLInputElement | null)[]>;
  isCorrect: boolean;
  handleBlanksChange: (index: number, value: string) => void;
  handleBlanksKeyDown: (index: number, e: KeyboardEvent<HTMLInputElement>) => void;
  checkBlanksAttempt: () => void;
  manuallyChanged: boolean;
  setManuallyChanged: (changed: boolean) => void;
  autoCheck: boolean;
  setAutoCheck: (enabled: boolean) => void;
  colorScheme?: 'green' | 'amber';
}

const PartialForm = ({
  word,
  blanksAttempt,
  blankIndices,
  inputRefs,
  isCorrect,
  handleBlanksChange,
  handleBlanksKeyDown,
  checkBlanksAttempt,
  manuallyChanged,
  setManuallyChanged,
  autoCheck,
  setAutoCheck,
  colorScheme = 'amber'
}: PartialFormProps) => {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  
  const isRTL = word.language === 'urdu' || word.language === 'arabic';
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (isRTL) {
      console.log("Current blanks attempt before checking:", blanksAttempt);
      console.log("Original word:", word.text);
      console.log("Blank indices:", blankIndices);
    }
    
    checkBlanksAttempt();
  };

  const handleKeyPress = (key: string) => {
    if (focusedIndex !== null) {
      console.log(`Keyboard pressed '${key}' for index ${focusedIndex}`);
      
      setManuallyChanged(true);
      handleBlanksChange(focusedIndex, key);
      
      // Find the position of the current focused index in the blankIndices array
      const blankPosition = blankIndices.findIndex(idx => idx === focusedIndex);
      
      if (blankPosition !== -1) {
        if (isRTL) {
          // For RTL, move to the previous position (right to left visually)
          const prevPosition = blankPosition - 1;
          if (prevPosition >= 0) {
            const prevIndex = blankIndices[prevPosition];
            console.log(`RTL: Moving focus to previous position ${prevPosition}, index ${prevIndex}`);
            
            if (inputRefs.current && inputRefs.current[prevPosition]) {
              setTimeout(() => {
                if (inputRefs.current && inputRefs.current[prevPosition]) {
                  inputRefs.current[prevPosition]?.focus();
                  setFocusedIndex(prevIndex);
                }
              }, 10);
            }
          }
        } else {
          // For LTR, move to the next position (left to right)
          const nextPosition = blankPosition + 1;
          if (nextPosition < blankIndices.length) {
            const nextIndex = blankIndices[nextPosition];
            console.log(`LTR: Moving focus to next position ${nextPosition}, index ${nextIndex}`);
            
            if (inputRefs.current && inputRefs.current[nextPosition]) {
              setTimeout(() => {
                if (inputRefs.current && inputRefs.current[nextPosition]) {
                  inputRefs.current[nextPosition]?.focus();
                  setFocusedIndex(nextIndex);
                }
              }, 10);
            }
          }
        }
      }
    } else {
      // If no input is focused, focus the first/last blank based on language direction
      if (blankIndices.length > 0 && inputRefs.current) {
        // For RTL languages, start from the rightmost blank (last in blankIndices)
        const startPosition = isRTL ? blankIndices.length - 1 : 0;
        const startIndex = blankIndices[startPosition];
        
        console.log(`No input focused, focusing ${isRTL ? 'last' : 'first'} blank at position ${startPosition}, index ${startIndex}`);
        
        if (inputRefs.current[startPosition]) {
          inputRefs.current[startPosition].focus();
          setFocusedIndex(startIndex);
        
          setTimeout(() => {
            setManuallyChanged(true);
            console.log(`Applying key "${key}" to index ${startIndex} after focus`);
            handleBlanksChange(startIndex, key);
            
            // After setting the first character, move to the next input
            if (isRTL) {
              // For RTL, move focus left (to previous position)
              const nextPosition = startPosition - 1;
              if (nextPosition >= 0 && inputRefs.current && inputRefs.current[nextPosition]) {
                setTimeout(() => {
                  inputRefs.current[nextPosition]?.focus();
                  setFocusedIndex(blankIndices[nextPosition]);
                }, 10);
              }
            } else {
              // For LTR, move focus right (to next position)
              const nextPosition = startPosition + 1;
              if (nextPosition < blankIndices.length && inputRefs.current && inputRefs.current[nextPosition]) {
                setTimeout(() => {
                  inputRefs.current[nextPosition]?.focus();
                  setFocusedIndex(blankIndices[nextPosition]);
                }, 10);
              }
            }
          }, 10);
        }
      }
    }
  };

  const handleBackspace = () => {
    if (focusedIndex !== null) {
      console.log(`Backspace at index ${focusedIndex}`);
      setManuallyChanged(true);
      handleBlanksChange(focusedIndex, '');
      
      const currentPosition = blankIndices.findIndex(idx => idx === focusedIndex);
      
      if (currentPosition !== -1) {
        if (isRTL) {
          // For RTL, after backspace move to the next blank (to the right in RTL view)
          const nextPosition = currentPosition + 1;
          if (nextPosition < blankIndices.length) {
            const nextIndex = blankIndices[nextPosition];
            console.log(`RTL: After backspace, moving to next position ${nextPosition}, index ${nextIndex}`);
            
            setTimeout(() => {
              if (inputRefs.current && inputRefs.current[nextPosition]) {
                inputRefs.current[nextPosition]?.focus();
                setFocusedIndex(nextIndex);
              }
            }, 10);
          }
        } else {
          // For LTR, after backspace move to the previous blank (to the left)
          const prevPosition = currentPosition - 1;
          if (prevPosition >= 0) {
            const prevIndex = blankIndices[prevPosition];
            setTimeout(() => {
              if (inputRefs.current && inputRefs.current[prevPosition]) {
                inputRefs.current[prevPosition]?.focus();
                setFocusedIndex(prevIndex);
              }
            }, 10);
          }
        }
      }
    }
  };

  const handleInputFocus = (index: number) => {
    console.log(`Focus set on input at index ${index}`);
    setFocusedIndex(index);
  };

  React.useEffect(() => {
    if (isRTL && focusedIndex !== null && !showKeyboard) {
      toast.info(
        <div className="flex items-center gap-2">
          <Keyboard className="h-4 w-4" />
          <span className="font-urdu">کی بورڈ کھولنے کے لیے بٹن دبائیں</span>
        </div>,
        {
          duration: 3000,
        }
      );
    }
  }, [isRTL, focusedIndex, showKeyboard]);

  // Auto-focus the last (rightmost) blank for RTL languages on initial render
  React.useEffect(() => {
    if (isRTL && blankIndices.length > 0 && inputRefs.current) {
      const lastPosition = blankIndices.length - 1;
      const timeoutId = setTimeout(() => {
        if (inputRefs.current && inputRefs.current[lastPosition]) {
          inputRefs.current[lastPosition]?.focus();
          setFocusedIndex(blankIndices[lastPosition]);
          console.log(`Auto-focused last blank (RTL) at position ${lastPosition}, index ${blankIndices[lastPosition]}`);
        }
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isRTL, blankIndices, inputRefs]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={`flex justify-center items-center flex-wrap gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {blanksAttempt.map((char, index) => (
          <div key={index} className="text-center">
            {!blankIndices.includes(index) ? (
              <StaticCharacter 
                character={char} 
                isRTL={isRTL} 
                colorScheme={colorScheme}
              />
            ) : (
              <CharacterInput
                value={blanksAttempt[index] || ''}
                onChange={(value) => {
                  setManuallyChanged(true);
                  handleBlanksChange(index, value);
                }}
                onKeyDown={(e) => handleBlanksKeyDown(index, e)}
                onFocus={() => handleInputFocus(index)}
                isCorrect={isCorrect}
                isRTL={isRTL}
                inputRef={el => {
                  const inputIndex = blankIndices.findIndex(i => i === index);
                  if (inputIndex !== -1 && inputRefs.current) {
                    inputRefs.current[inputIndex] = el;
                  }
                }}
                autoFocus={isRTL ? index === blankIndices[blankIndices.length - 1] : index === blankIndices[0]}
                colorScheme={colorScheme}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-check"
            checked={autoCheck}
            onCheckedChange={setAutoCheck}
            className="data-[state=checked]:bg-amber-500"
          />
          <Label htmlFor="auto-check" className="text-sm text-amber-700">
            Auto check
          </Label>
        </div>
        
        {isRTL && (
          <KeyboardToggle 
            showKeyboard={showKeyboard} 
            setShowKeyboard={setShowKeyboard} 
          />
        )}
      </div>

      {isRTL && showKeyboard && (
        <UrduKeyboard 
          onKeyPress={handleKeyPress} 
          onBackspace={handleBackspace}
          className="mb-4 keyboard-animate-in" 
        />
      )}
      
      <SubmitButton 
        isCorrect={isCorrect} 
        isRTL={isRTL} 
        colorScheme={colorScheme}
      />
    </form>
  );
};

export default PartialForm;
