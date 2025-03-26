
import React, { useEffect, useRef } from 'react';
import { SpellingContext } from './SpellingContext';
import { Word } from '@/types/word';
import SpellingCelebration from '../SpellingCelebration';

interface SpellingContextWrapperProps {
  contextValue: React.ComponentProps<typeof SpellingContext.Provider>['value'];
  children: React.ReactNode;
}

export const SpellingContextWrapper: React.FC<SpellingContextWrapperProps> = ({
  contextValue,
  children
}) => {
  const { showCelebration } = contextValue;
  
  return (
    <SpellingContext.Provider value={contextValue}>
      {showCelebration && <SpellingCelebration />}
      {children}
    </SpellingContext.Provider>
  );
};
