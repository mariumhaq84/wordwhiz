
import React, { KeyboardEvent, RefObject, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";

interface CharacterInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  isCorrect: boolean;
  isRTL: boolean;
  inputRef: (element: HTMLInputElement | null) => void;
  autoFocus?: boolean;
  disabled?: boolean;
  colorScheme?: 'green' | 'amber'; // For different color schemes
}

const CharacterInput = ({ 
  value, 
  onChange, 
  onKeyDown, 
  onFocus,
  isCorrect,
  isRTL,
  inputRef,
  autoFocus = false,
  disabled = false,
  colorScheme = 'green'
}: CharacterInputProps) => {
  const baseClasses = "w-14 h-14 text-center text-xl font-bold rounded-lg shadow-sm focus:ring-2 transition-all p-0";
  
  // Color styling based on colorScheme
  const colorStyles = {
    green: {
      border: isCorrect ? 'border-green-500' : 'border-emerald-400',
      bg: isCorrect ? 'bg-green-50' : 'bg-white',
      ring: 'focus:ring-emerald-300',
      underline: isCorrect ? 'bg-green-300' : 'bg-emerald-200',
      textColor: '#065F46' // emerald-800
    },
    amber: {
      border: isCorrect ? 'border-green-500' : 'border-amber-400',
      bg: isCorrect ? 'bg-green-50' : 'bg-white',
      ring: 'focus:ring-amber-300',
      underline: isCorrect ? 'bg-green-300' : 'bg-amber-200',
      textColor: '#B45309' // amber-700
    }
  };
  
  const selectedStyle = colorStyles[colorScheme];
  
  // Internal ref to track if we need to update cursor position
  const needsCursorUpdateRef = useRef(false);
  
  // Enhanced input change handler with proper RTL support
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Debug log to check what's being received
    if (isRTL) {
      console.log(`RTL input received: "${newValue}" (length: ${newValue.length})`);
      needsCursorUpdateRef.current = true;
    }
    
    // For both RTL and LTR, always take the last character entered
    // This is the most consistent approach as it works well with IMEs and
    // ensures correct behavior when multiple characters are entered at once
    if (newValue.length > 0) {
      const lastCharacter = newValue.charAt(newValue.length - 1);
      onChange(lastCharacter);
    } else {
      // Empty input case
      onChange('');
    }
  };
  
  // Improved cursor positioning for RTL inputs - run after every render
  useEffect(() => {
    if (isRTL) {
      const input = document.activeElement as HTMLInputElement;
      // Only update if this input is focused and needs cursor positioning
      if (input && input === document.getElementById(`rtl-input-${value}`) && needsCursorUpdateRef.current) {
        // For RTL, always position cursor at the beginning (right side)
        setTimeout(() => {
          try {
            // Position at beginning (0,0) for RTL - appears at right edge
            input.setSelectionRange(0, 0);
            console.log("Set RTL cursor position to beginning (right side)");
            needsCursorUpdateRef.current = false;
          } catch (e) {
            console.log("Error setting RTL selection range:", e);
          }
        }, 10);
      }
    }
  });
  
  // Set up cursor position on focus for RTL inputs
  const handleRTLFocus = () => {
    if (isRTL) {
      const input = document.activeElement as HTMLInputElement;
      if (input && input.setSelectionRange) {
        // Mark that we need cursor positioning
        needsCursorUpdateRef.current = true;
        
        // Position cursor at the beginning (right side) for RTL inputs
        setTimeout(() => {
          try {
            input.setSelectionRange(0, 0);
            console.log("RTL input focused, cursor positioned at beginning (right side)");
          } catch (e) {
            console.log("Error setting RTL focus position:", e);
          }
        }, 10);
      }
    }
    
    // Call the original onFocus handler
    onFocus();
  };
  
  return (
    <div className="relative transform transition-all hover:scale-105">
      <Input
        id={`rtl-input-${value}`}
        value={value}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        onFocus={handleRTLFocus}
        className={`${baseClasses} border-3 ${selectedStyle.border} ${selectedStyle.bg} ${selectedStyle.ring} ${isRTL ? 'font-urdu kid-friendly rtl' : 'kid-friendly'}`}
        maxLength={1}
        ref={inputRef}
        autoFocus={autoFocus}
        disabled={disabled}
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{ 
          textAlign: 'center',
          color: isRTL ? selectedStyle.textColor : undefined,
          fontSize: isRTL ? '1.8em' : undefined,
          fontWeight: isRTL ? '600' : undefined,
          caretColor: isRTL ? '#065F46' : undefined, // Enhanced caret visibility for RTL
          boxShadow: isCorrect ? '0 0 15px rgba(34, 197, 94, 0.5)' : undefined
        }}
        // Force right-to-left text input when in RTL mode
        inputMode={isRTL ? "text" : undefined}
      />
      <div className={`absolute -bottom-1 left-0 w-full h-1.5 ${selectedStyle.underline} rounded-full`}></div>
      
      {/* Add subtle animated glow effect for correct answers */}
      {isCorrect && (
        <div className="absolute inset-0 rounded-lg bg-green-400 opacity-20 animate-pulse pointer-events-none"></div>
      )}
    </div>
  );
};

export default CharacterInput;
