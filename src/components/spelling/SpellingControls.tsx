
import React from 'react';
import { X } from 'lucide-react';
import SpellingStageHeader from './SpellingStageHeader';
import { useSpellingContext } from './context/SpellingContext';
import { Button } from '@/components/ui/button';

const SpellingControls = () => {
  const { 
    displayMode, 
    moveToPreviousStage, 
    moveToNextStage,
    onEndSession,
    word
  } = useSpellingContext();

  // Determine if RTL UI is needed
  const isRTL = word?.language === 'urdu' || word?.language === 'arabic';

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 z-10 flex items-center gap-2">
        {onEndSession && (
          <Button 
            className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
            onClick={onEndSession}
            aria-label="End Session"
            variant="ghost"
            size="icon"
          >
            <X size={18} />
          </Button>
        )}
      </div>

      <div className={`mt-4 px-2 ${isRTL ? 'direction-rtl' : ''}`}>
        <SpellingStageHeader 
          displayMode={displayMode}
          moveToPreviousStage={moveToPreviousStage}
          moveToNextStage={moveToNextStage}
          // Remove the isRTL prop since it's not defined in SpellingStageHeader
        />
      </div>
    </div>
  );
};

export default SpellingControls;
