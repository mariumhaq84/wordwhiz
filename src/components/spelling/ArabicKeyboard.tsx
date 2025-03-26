import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Keyboard } from "lucide-react";

interface ArabicKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  className?: string;
}

const ArabicKeyboard: React.FC<ArabicKeyboardProps> = ({ 
  onKeyPress, 
  onBackspace,
  className = ""
}) => {
  // Track the last pressed key for visual feedback
  const [lastPressed, setLastPressed] = useState<string | null>(null);
  
  // Standard Arabic keyboard layout
  const keyboardRows = [
    ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج'],
    ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
    ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ', 'د'],
    ['ذ', 'إ', 'أ', 'آ', 'ّ', 'َ', 'ً', 'ُ', 'ٌ', 'ِ', 'ٍ']
  ];

  // Improved to prevent cursor from moving away
  const handleKeyPress = (key: string, e: React.MouseEvent) => {
    // Critical: Stop event propagation and prevent default
    e.preventDefault();
    e.stopPropagation();
    
    // Set last pressed for visual feedback
    setLastPressed(key);
    
    // Log the key press for debugging
    console.log(`Arabic keyboard pressed: '${key}' (charCode: ${key.charCodeAt(0)})`);
    
    // Directly call onKeyPress without any conditions
    onKeyPress(key);
    
    // Reset the visual feedback after a short delay
    setTimeout(() => {
      setLastPressed(null);
    }, 300);
  };

  // Improved backspace handler
  const handleBackspace = (e: React.MouseEvent) => {
    // Stop event propagation to maintain focus
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Arabic keyboard: backspace pressed");
    setLastPressed('⌫');
    onBackspace();
    
    // Reset the visual feedback after a short delay
    setTimeout(() => {
      setLastPressed(null);
    }, 300);
  };

  // Add keyboard listener for physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle backspace from keyboard
      if (e.key === 'Backspace') {
        onBackspace();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBackspace]);

  return (
    <div 
      className={`p-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-teal-200 keyboard-animate-in ${className}`}
      // Important: Add this to prevent keyboard clicks from taking focus
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="mb-2 flex justify-between items-center">
        <div className="text-teal-700 font-semibold flex items-center gap-1">
          <Keyboard className="h-4 w-4" />
          <span className="font-arabic">لوحة المفاتيح العربية</span>
        </div>
        
        <div>
          <Button 
            variant="outline"
            size="sm" 
            onClick={handleBackspace}
            onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
            className={`text-red-500 h-8 px-3 hover:bg-red-50 ${lastPressed === '⌫' ? 'bg-red-100 border-red-300' : ''}`}
          >
            ⌫ حذف
          </Button>
        </div>
      </div>
      
      <div className="space-y-1">
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 flex-row-reverse">
            {row.map((key) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={(e) => handleKeyPress(key, e)}
                onMouseDown={(e) => e.preventDefault()} // Critical: prevent default to maintain focus
                className={`h-12 w-10 font-arabic text-lg hover:bg-teal-50 arabic-keyboard-key
                  ${lastPressed === key ? 'bg-teal-100 border-teal-300 transform scale-105 pulse-highlight' : 'bg-white'}`}
              >
                {key}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArabicKeyboard;
