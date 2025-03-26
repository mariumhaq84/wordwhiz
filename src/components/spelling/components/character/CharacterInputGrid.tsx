
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

  // Ensure correct RTL focus for Urdu when component mounts or word changes
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

  return (
    <div className="space-y-4">
      <div className={`flex justify-center items-center flex-wrap gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterInputGrid;
