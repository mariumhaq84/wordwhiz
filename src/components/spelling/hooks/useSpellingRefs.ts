
import { useRef } from 'react';

export const useSpellingRefs = () => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const letterInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const wordIdRef = useRef<string>(''); // Track current word to prevent timer issues
  const activeTimerRef = useRef<boolean>(false); // Set to false by default - only activate when explicitly started

  return {
    inputRefs,
    letterInputRefs,
    timerRef,
    countdownRef,
    wordIdRef,
    activeTimerRef
  };
};
