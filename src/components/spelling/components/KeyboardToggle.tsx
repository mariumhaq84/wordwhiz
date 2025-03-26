
import React from 'react';
import { Button } from "@/components/ui/button";
import { Keyboard } from 'lucide-react';

interface KeyboardToggleProps {
  showKeyboard: boolean;
  setShowKeyboard: (show: boolean) => void;
}

const KeyboardToggle = ({ showKeyboard, setShowKeyboard }: KeyboardToggleProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={() => setShowKeyboard(!showKeyboard)}
      className={`bg-purple-50 hover:bg-purple-100 border-purple-200 ${showKeyboard ? 'bg-purple-100 border-purple-300' : ''}`}
      aria-label={showKeyboard ? "Close keyboard" : "Open keyboard"}
    >
      <Keyboard className="h-4 w-4" />
    </Button>
  );
};

export default KeyboardToggle;
