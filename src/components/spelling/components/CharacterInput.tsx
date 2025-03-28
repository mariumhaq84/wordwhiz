import React, { KeyboardEvent, useEffect, useRef } from 'react';
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
  colorScheme?: 'green' | 'amber';
  position?: 'start' | 'middle' | 'end'; // Position in the word
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
  colorScheme = 'green',
  position
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
  
  // Simple ref for the input element
  const internalInputRef = useRef<HTMLInputElement | null>(null);

  // Handle changes with simplified logic
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length > 0) {
      // Always just use the last character typed
      const lastCharacter = newValue.charAt(newValue.length - 1);
      onChange(lastCharacter);
    } else {
      onChange('');
    }
  };

  // Apply RTL configuration on mount
  useEffect(() => {
    if (!internalInputRef.current) return;
    
    const input = internalInputRef.current;
    
    if (isRTL) {
      // Apply more aggressive RTL styling for Arabic
      input.setAttribute('dir', 'rtl');
      input.style.direction = 'rtl';
      input.style.textAlign = 'center';
      
      // Force the bidirectional override
      input.style.unicodeBidi = 'bidi-override';
      
      // Wait a bit then force selection to the beginning (right side in RTL)
      const timeoutId = setTimeout(() => {
        if (document.activeElement === input) {
          input.setSelectionRange(0, 0);
        }
      }, 50);
      
      return () => clearTimeout(timeoutId);
    } else {
      // Normal LTR styling
      input.setAttribute('dir', 'ltr');
      input.style.direction = 'ltr';
      input.style.textAlign = 'center';
    }
  }, [isRTL, value]);
  
  // Focus handler
  const handleFocus = () => {
    if (!internalInputRef.current) return;
    
    const input = internalInputRef.current;
    
    // For RTL inputs, position cursor at start (which is on the right)
    if (isRTL) {
      setTimeout(() => {
        if (document.activeElement === input) {
          input.setSelectionRange(0, 0);
        }
      }, 50);
    }
    
    // Call the provided focus handler
    onFocus();
  };
  
  // Manage combined ref
  const combinedRef = (el: HTMLInputElement | null) => {
    internalInputRef.current = el;
    inputRef(el);
  };
  
  return (
    <div className="relative transform transition-all hover:scale-105">
      <Input
        value={value}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        onFocus={handleFocus}
        className={`${baseClasses} border-3 ${selectedStyle.border} ${selectedStyle.bg} ${selectedStyle.ring} ${isRTL ? 'font-arabic rtl-input' : ''}`}
        maxLength={1}
        ref={combinedRef}
        autoFocus={autoFocus}
        disabled={disabled}
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{ 
          textAlign: 'center',
          color: selectedStyle.textColor,
          fontSize: isRTL ? '1.8em' : undefined,
          fontWeight: isRTL ? '600' : undefined,
          direction: isRTL ? 'rtl' : 'ltr',
          boxShadow: isCorrect ? '0 0 15px rgba(34, 197, 94, 0.5)' : undefined,
          unicodeBidi: isRTL ? 'bidi-override' : undefined,
        }}
        // Force text input mode
        inputMode="text"
        data-rtl={isRTL ? "true" : "false"}
        data-position={position || ""}
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
