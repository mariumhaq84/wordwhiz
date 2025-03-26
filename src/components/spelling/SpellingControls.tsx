import React from 'react';
import SpellingStageHeader from './SpellingStageHeader';
import { useSpellingContext } from './context/SpellingContext';

const SpellingControls = () => {
  const { 
    displayMode, 
    moveToPreviousStage, 
    moveToNextStage,
    word
  } = useSpellingContext();

  // Determine if RTL UI is needed
  const isRTL = word?.language === 'urdu' || word?.language === 'arabic';

  return (
    <div className="relative w-full mb-4">
      <div className={`${isRTL ? 'direction-rtl' : ''}`}>
        <SpellingStageHeader 
          displayMode={displayMode}
          moveToPreviousStage={moveToPreviousStage}
          moveToNextStage={moveToNextStage}
        />
      </div>
    </div>
  );
};

export default SpellingControls;
