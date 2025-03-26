
import { useRef, useEffect, useState } from 'react';
import { useSpellingRefs } from './useSpellingRefs';

export const useSpellingTimer = (
  setTimeRemaining: (cb: (prev: number) => number) => void,
  setShowWarning: (show: boolean) => void,
  handleTimeExpired: () => void
) => {
  const { timerRef, countdownRef, wordIdRef, activeTimerRef } = useSpellingRefs();
  const isRunningRef = useRef(false);

  // Clean up timers when component unmounts
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  const clearTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    isRunningRef.current = false;
  };

  const startTimer = (wordId?: string) => {
    // Track word id to manage timer restarts
    if (wordId) {
      if (wordIdRef.current === wordId && isRunningRef.current) {
        // Don't restart timer for same word
        return;
      }
      wordIdRef.current = wordId;
    }
    
    // Clear any existing timers first
    clearTimers();
    
    // Reset the UI state
    setShowWarning(false);
    setTimeRemaining(() => 30);
    isRunningRef.current = true;
    activeTimerRef.current = true;
    
    // Set the main timer for expiration
    timerRef.current = setTimeout(() => {
      if (activeTimerRef.current) {
        console.log('Timer expired, calling handleTimeExpired');
        handleTimeExpired();
      }
    }, 30000);
    
    // Set the countdown interval
    countdownRef.current = setInterval(() => {
      if (!isRunningRef.current || !activeTimerRef.current) return;
      
      setTimeRemaining(prev => {
        // Play warning sound at 5 seconds
        if (prev <= 6 && prev > 5 && activeTimerRef.current) {
          setShowWarning(true);
          try {
            const warningBeep = new Audio('data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABMYXZmNTcuODMuMTAw');
            warningBeep.volume = 0.3;
            warningBeep.play().catch(e => console.log('Audio play error:', e));
          } catch (error) {
            console.error('Error playing warning sound:', error);
          }
        }
        
        // Check if timer has reached zero
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          isRunningRef.current = false;
          return 0;
        }
        
        // Decrement the timer
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    activeTimerRef.current = false;
  };

  const resumeTimer = () => {
    activeTimerRef.current = true;
  };

  // Return the needed functions and expose clearTimers as clearAllTimers for consistency
  return {
    clearTimers,
    clearAllTimers: clearTimers, // Add this alias to match expected name in useSpellingStages
    startTimer,
    pauseTimer,
    resumeTimer,
    handleTimeExpired, // Expose the handleTimeExpired function that was passed in
  };
};
