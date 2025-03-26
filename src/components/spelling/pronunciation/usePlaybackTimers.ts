
import { useRef, useCallback } from 'react';

export const usePlaybackTimers = () => {
  const playbackTimersRef = useRef<NodeJS.Timeout[]>([]);

  const clearPlaybackTimers = useCallback(() => {
    playbackTimersRef.current.forEach(timer => clearTimeout(timer));
    playbackTimersRef.current = [];
  }, []);

  return {
    playbackTimersRef,
    clearPlaybackTimers
  };
};
