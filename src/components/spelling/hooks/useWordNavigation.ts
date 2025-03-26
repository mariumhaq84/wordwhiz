
import { useCallback } from 'react';
import { Word } from '@/types/word';

export const useWordNavigation = (
  pauseTimer: () => void,
  clearAllTimers: () => void, 
  setManuallyChanged: (changed: boolean) => void,
  onNavigate?: (direction: 'next' | 'prev') => void,
  word?: Word
) => {
  // Determine if we are dealing with RTL language
  const isRTL = word?.language === 'urdu' || word?.language === 'arabic';
  
  const handleWordNavigation = useCallback((direction: 'next' | 'prev') => {
    if (onNavigate) {
      pauseTimer(); // Pause timer during navigation
      clearAllTimers();
      setManuallyChanged(false); // Reset manual change flag during navigation
      
      // For RTL languages, we DON'T need to invert the navigation direction
      // when the user completes a word - that only applies to UI buttons
      // Just navigate normally to maintain consistent behavior
      onNavigate(direction);
      
      console.log(`Word navigation: direction "${direction}" executed`);
    }
  }, [onNavigate, pauseTimer, clearAllTimers, setManuallyChanged]);

  return {
    handleWordNavigation,
    isRTL
  };
};
