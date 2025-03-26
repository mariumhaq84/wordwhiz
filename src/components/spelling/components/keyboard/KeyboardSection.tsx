
import React from 'react';
import UrduKeyboard from '../../UrduKeyboard';
import KeyboardToggle from '../KeyboardToggle';
import { toast } from 'sonner';
import { Keyboard } from 'lucide-react';

interface KeyboardSectionProps {
  isRTL: boolean;
  showKeyboard: boolean;
  setShowKeyboard: (show: boolean) => void;
  focusedIndex: number | null;
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
}

const KeyboardSection = ({ 
  isRTL, 
  showKeyboard, 
  setShowKeyboard, 
  focusedIndex, 
  onKeyPress, 
  onBackspace 
}: KeyboardSectionProps) => {
  // Show keyboard help toast for RTL languages when input is focused but keyboard not shown
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

  if (!isRTL) return null;

  return (
    <>
      <div className="flex justify-end my-4">
        <KeyboardToggle 
          showKeyboard={showKeyboard} 
          setShowKeyboard={setShowKeyboard} 
        />
      </div>

      {showKeyboard && (
        <UrduKeyboard 
          onKeyPress={onKeyPress} 
          onBackspace={onBackspace}
          className="mb-4 keyboard-animate-in" 
        />
      )}
    </>
  );
};

export default KeyboardSection;
