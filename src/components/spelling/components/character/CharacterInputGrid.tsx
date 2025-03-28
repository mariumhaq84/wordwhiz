import React, { KeyboardEvent, RefObject, useEffect } from 'react';
import CharacterInput from '../CharacterInput';

interface CharacterInputGridProps {
  word: {
    text: string;
    language: string;
    id?: string;  // Added id to support reset functionality
  };
  letterAttempts: string[];
  letterInputRefs: RefObject<(HTMLInputElement | null)[]>;
  isCorrect: boolean;
  handleInputChange: (index: number, value: string) => void;
  handleLetterKeyDown: (index: number, e: KeyboardEvent<HTMLInputElement>) => void;
  handleInputFocus: (index: number) => void;
  colorScheme?: 'green' | 'amber';
}

const CharacterInputGrid = ({
  word,
  letterAttempts,
  letterInputRefs,
  isCorrect,
  handleInputChange,
  handleLetterKeyDown,
  handleInputFocus,
  colorScheme = 'green'
}: CharacterInputGridProps) => {
  const isRTL = word.language === 'urdu' || word.language === 'arabic';

  // For RTL languages, start from the right (last character)
  const startIndex = isRTL ? word.text.length - 1 : 0;

  // Ensure correct RTL focus for RTL languages when component mounts or word changes
  useEffect(() => {
    if (isRTL && letterInputRefs.current && !isCorrect) {
      const timeoutId = setTimeout(() => {
        if (letterInputRefs.current && letterInputRefs.current[startIndex]) {
          letterInputRefs.current[startIndex]?.focus();
          console.log(`RTL auto-focus on mount: Set focus to rightmost input at index ${startIndex}`);
        }
      }, 200);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isRTL, letterInputRefs, startIndex, isCorrect, word.text]);

  // Create an array of indices based on the word's character count
  const indices = Array.from({ length: word.text.length }, (_, i) => i);
  
  // For RTL languages, reverse the order of indices so characters are displayed right-to-left
  const displayIndices = isRTL ? [...indices].reverse() : indices;

  // Helper to determine position (start, middle, end) for RTL cursor handling
  const getPosition = (index: number): 'start' | 'middle' | 'end' => {
    if (word.text.length === 1) return 'start';
    
    if (isRTL) {
      if (index === word.text.length - 1) return 'start';
      if (index === 0) return 'end';
      return 'middle';
    } else {
      if (index === 0) return 'start';
      if (index === word.text.length - 1) return 'end';
      return 'middle';
    }
  };

  return (
    <div className="space-y-4">
      {isRTL ? (
        // RTL-specific container with explicit RTL settings
        <div className="rtl-container" dir="rtl" style={{ direction: 'rtl', unicodeBidi: 'bidi-override' }}>
          <div className="flex justify-center items-center flex-wrap gap-3">
            {/* Map through the indices in the original order for data binding */}
            {indices.map(index => {
              // Find the display position for this logical index
              const displayPosition = displayIndices.indexOf(index);
              
              return (
                <div key={index} 
                     className="text-center" 
                     style={{ order: displayPosition }} // Use order to control visual positioning
                >
                  <CharacterInput
                    value={letterAttempts[index] || ''}
                    onChange={(value) => handleInputChange(index, value)}
                    onKeyDown={(e) => handleLetterKeyDown(index, e)}
                    onFocus={() => handleInputFocus(index)}
                    isCorrect={isCorrect}
                    isRTL={isRTL}
                    inputRef={el => {
                      if (letterInputRefs.current) {
                        letterInputRefs.current[index] = el;
                      }
                    }}
                    autoFocus={index === startIndex}
                    disabled={isCorrect}
                    colorScheme={colorScheme}
                    position={getPosition(index)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // LTR standard layout
        <div className="flex justify-center items-center flex-wrap gap-3">
          {word.text.split('').map((_, index) => (
            <div key={index} className="text-center">
              <CharacterInput
                value={letterAttempts[index] || ''}
                onChange={(value) => handleInputChange(index, value)}
                onKeyDown={(e) => handleLetterKeyDown(index, e)}
                onFocus={() => handleInputFocus(index)}
                isCorrect={isCorrect}
                isRTL={isRTL}
                inputRef={el => {
                  if (letterInputRefs.current) {
                    letterInputRefs.current[index] = el;
                  }
                }}
                autoFocus={index === startIndex}
                disabled={isCorrect}
                colorScheme={colorScheme}
                position={getPosition(index)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterInputGrid;
