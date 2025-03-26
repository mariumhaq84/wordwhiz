import React, { FormEvent, KeyboardEvent, RefObject, useState } from 'react';
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    checkSpellingAttempt();
  };

  const handleKeyPress = (key: string) => {
    if (focusedIndex !== null) {
      handleLetterChange(focusedIndex, key);
      
      if (isRTL) {
        const prevIndex = focusedIndex - 1;
        if (prevIndex >= 0) {
          setTimeout(() => {
            if (letterInputRefs.current && letterInputRefs.current[prevIndex]) {
              letterInputRefs.current[prevIndex]?.focus();
              setFocusedIndex(prevIndex);
            }
          }, 10);
        }
      } else {
        const nextIndex = focusedIndex + 1;
        if (nextIndex < word.text.length) {
          setTimeout(() => {
            if (letterInputRefs.current && letterInputRefs.current[nextIndex]) {
              letterInputRefs.current[nextIndex]?.focus();
              setFocusedIndex(nextIndex);
            }
          }, 10);
        }
      }
    } else {
      const startIndex = isRTL ? word.text.length - 1 : 0;
      
      if (letterInputRefs.current && letterInputRefs.current[startIndex]) {
        letterInputRefs.current[startIndex]?.focus();
        setFocusedIndex(startIndex);
        
        setTimeout(() => {
          handleLetterChange(startIndex, key);
          
          if (isRTL) {
            const nextIndex = startIndex - 1;
            if (nextIndex >= 0 && letterInputRefs.current && letterInputRefs.current[nextIndex]) {
              letterInputRefs.current[nextIndex]?.focus();
              setFocusedIndex(nextIndex);
            }
          } else {
            const nextIndex = startIndex + 1;
            if (nextIndex < word.text.length && letterInputRefs.current && letterInputRefs.current[nextIndex]) {
              letterInputRefs.current[nextIndex]?.focus();
              setFocusedIndex(nextIndex);
            }
          }
        }, 10);
      }
    }
  };

  const handleBackspace = () => {
    if (focusedIndex !== null) {
      handleLetterChange(focusedIndex, '');
      
      if (isRTL) {
        const nextIndex = focusedIndex + 1;
        if (nextIndex < word.text.length) {
          setTimeout(() => {
            if (letterInputRefs.current && letterInputRefs.current[nextIndex]) {
              letterInputRefs.current[nextIndex]?.focus();
              setFocusedIndex(nextIndex);
            }
          }, 10);
        }
      } else {
        const prevIndex = focusedIndex - 1;
        if (prevIndex >= 0) {
          setTimeout(() => {
            if (letterInputRefs.current && letterInputRefs.current[prevIndex]) {
              letterInputRefs.current[prevIndex]?.focus();
              setFocusedIndex(prevIndex);
            }
          }, 10);
        }
      }
    }
  };

  const handleInputFocus = (index: number) => {
    setFocusedIndex(index);
  };

  // Determine which keyboard to show based on language
  const getKeyboard = () => {
    if (word.language === 'urdu') {
      return (
        <UrduKeyboard 
          onKeyPress={handleKeyPress} 
          onBackspace={handleBackspace}
          className="mb-4 keyboard-animate-in" 
        />
      );
    } else if (word.language === 'arabic') {
      return (
        <ArabicKeyboard 
          onKeyPress={handleKeyPress} 
          onBackspace={handleBackspace}
          className="mb-4 keyboard-animate-in" 
        />
      );
    }
    return null;
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CharacterInputGrid
        word={word}
        letterAttempts={letterAttempts}
        letterInputRefs={letterInputRefs}
        isCorrect={isCorrect}
        handleInputChange={handleLetterChange}
        handleLetterKeyDown={handleLetterKeyDown}
        handleInputFocus={handleInputFocus}
        colorScheme={colorScheme}
      />
      
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-check-input"
            checked={autoCheck}
            onCheckedChange={setAutoCheck}
            className="data-[state=checked]:bg-green-500"
          />
          <Label htmlFor="auto-check-input" className="text-sm text-green-700">
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
      
      {isRTL && showKeyboard && getKeyboard()}
      
      <SubmitButton 
        isCorrect={isCorrect} 
        language={word.language}
        colorScheme={colorScheme}
      />
    </form>
  );
};

export default InputForm;
