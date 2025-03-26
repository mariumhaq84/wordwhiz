
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Book, PencilLine, Keyboard } from 'lucide-react';

interface SpellingStageHeaderProps {
  displayMode: 'full' | 'partial' | 'input';
  moveToPreviousStage: () => void;
  moveToNextStage: () => void;
}

const SpellingStageHeader = ({ 
  displayMode, 
  moveToPreviousStage, 
  moveToNextStage 
}: SpellingStageHeaderProps) => {
  
  const getStageIcon = () => {
    if (displayMode === 'full') return <Book className="h-6 w-6 text-blue-500" />;
    if (displayMode === 'partial') return <PencilLine className="h-6 w-6 text-amber-500" />;
    return <Keyboard className="h-6 w-6 text-emerald-500" />;
  };

  return (
    <div className="flex items-center justify-between relative mb-4">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={moveToPreviousStage}
        disabled={displayMode === 'full'}
        className="text-gray-500 hover:bg-white/50 hover:text-primary transition-all"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm shadow-sm min-w-32">
        <div className="flex items-center justify-center">
          {getStageIcon()}
          <span className="text-sm font-bold ml-2">
            {displayMode === 'full' ? 'Memorize' : displayMode === 'partial' ? 'Fill In Blanks' : 'Type Word'}
          </span>
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={moveToNextStage}
        disabled={displayMode === 'input'}
        className="text-gray-500 hover:bg-white/50 hover:text-primary transition-all"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default SpellingStageHeader;
