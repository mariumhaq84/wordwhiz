
import { useState, useRef } from 'react';

export const useAudioManager = () => {
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const stopCurrentSpeech = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    setCurrentUtterance(null);
    
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
  };

  return {
    currentUtterance,
    setCurrentUtterance,
    currentAudioRef,
    stopCurrentSpeech
  };
};
