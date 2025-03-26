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
    if (displayMode === 'full') return <Book className="h-4 w-4 text-white" />;
    if (displayMode === 'partial') return <PencilLine className="h-4 w-4 text-white" />;
    return <Keyboard className="h-4 w-4 text-white" />;
  };

  // Get stage-specific gradient
  const getStageGradient = () => {
    if (displayMode === 'full') return 'from-blue-500 to-indigo-600';
    if (displayMode === 'partial') return 'from-amber-500 to-orange-600';
    return 'from-emerald-500 to-teal-600';
  };

  // Get button colors
  const getButtonColors = () => {
    if (displayMode === 'full') return 'hover:bg-blue-600 text-white/80 hover:text-white';
    if (displayMode === 'partial') return 'hover:bg-amber-600 text-white/80 hover:text-white';
    return 'hover:bg-emerald-600 text-white/80 hover:text-white';
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className={`flex items-center justify-center gap-1 w-auto bg-gradient-to-r ${getStageGradient()} rounded-full shadow-md py-1 px-2 border border-white/20`}>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={moveToPreviousStage}
          disabled={displayMode === 'full'}
          className={`${getButtonColors()} transition-all h-6 w-6 rounded-full`}
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>
        
        <div className="flex items-center justify-center gap-1 px-2 py-0.5">
          <div className="flex items-center justify-center">
            {getStageIcon()}
            <span className="text-xs font-bold ml-1 text-white">
              {displayMode === 'full' ? 'Memorize' : displayMode === 'partial' ? 'Fill Blanks' : 'Type Word'}
            </span>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={moveToNextStage}
          disabled={displayMode === 'input'}
          className={`${getButtonColors()} transition-all h-6 w-6 rounded-full`}
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default SpellingStageHeader;
