
import { useState, useEffect } from 'react';

export const useVoiceSelection = (language?: string) => {
  const [isUrduVoiceAvailable, setIsUrduVoiceAvailable] = useState<boolean>(false);

  const checkUrduVoiceAvailability = () => {
    if (language !== 'urdu') return;
    
    const voices = window.speechSynthesis.getVoices();
    
    if (voices.length === 0) {
      const voicesChangedHandler = () => {
        const updatedVoices = window.speechSynthesis.getVoices();
        const hasUrduOrFallbackVoice = findSuitableVoiceForUrdu(updatedVoices) !== null;
        setIsUrduVoiceAvailable(hasUrduOrFallbackVoice);
        window.speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
      };
      
      window.speechSynthesis.addEventListener('voiceschanged', voicesChangedHandler);
    } else {
      const hasUrduOrFallbackVoice = findSuitableVoiceForUrdu(voices) !== null;
      setIsUrduVoiceAvailable(hasUrduOrFallbackVoice);
    }
  };

  const findSuitableVoiceForUrdu = (voices: SpeechSynthesisVoice[]) => {
    console.log("Available voices:", voices.map(v => `${v.name} (${v.lang})`).join(', '));
    
    let selectedVoice = voices.find(voice => voice.lang.includes('ur'));
    
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => voice.lang === 'hi-IN');
    }
    
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => voice.lang.includes('hi'));
    }
    
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.lang.includes('ar') || voice.lang.includes('fa'));
    }
    
    return selectedVoice;
  };

  return {
    isUrduVoiceAvailable,
    checkUrduVoiceAvailability,
    findSuitableVoiceForUrdu
  };
};
