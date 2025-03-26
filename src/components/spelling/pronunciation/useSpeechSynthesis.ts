
import { Word } from '@/types/word';

export const useSpeechSynthesis = () => {
  const setupVoice = (utterance: SpeechSynthesisUtterance, voices: SpeechSynthesisVoice[], language?: string) => {
    console.log(`Setting up voice for language: ${language}`);
    
    if (language === 'urdu') {
      let selectedVoice = voices.find(voice => voice.lang.includes('ur'));
      
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.name.includes('Google Hindi') || 
          voice.name.includes('Microsoft Hemant') ||
          voice.name.includes('Microsoft Kalpana') ||
          voice.name === 'hi-IN'
        );
      }
      
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.includes('hi'));
      }
      
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang.includes('ar') || voice.lang.includes('fa')
        );
      }
      
      if (!selectedVoice) {
        selectedVoice = findFemaleVoice(voices);
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log("Using voice for Urdu:", selectedVoice.name, selectedVoice.lang);
      } else {
        utterance.lang = 'ur-PK';
        console.log("No suitable voice found for Urdu, using default with ur-PK lang setting");
      }
    } else {
      const femaleVoice = findFemaleVoice(voices);
      if (femaleVoice) {
        utterance.voice = femaleVoice;
        console.log("Using female voice:", femaleVoice.name);
      }
    }
  };

  const findFemaleVoice = (voices: SpeechSynthesisVoice[]) => {
    return voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('woman') ||
      voice.name.toLowerCase().includes('girl') ||
      voice.name.includes('Google UK English Female') ||
      voice.name.includes('Microsoft Zira') ||
      voice.name.includes('Samantha') ||
      voice.name.includes('Karen') ||
      voice.name.includes('Victoria')
    );
  };

  const speakWithFallback = (utterance: SpeechSynthesisUtterance) => {
    try {
      window.speechSynthesis.cancel();
      
      window.speechSynthesis.speak(utterance);
      
      setTimeout(() => {
        if (!window.speechSynthesis.speaking) {
          console.warn("Speech synthesis not speaking, trying again with fallback...");
          window.speechSynthesis.cancel();
          
          if (utterance.lang.includes('ur')) {
            utterance.lang = 'hi-IN';
            console.log("Retrying with Hindi (hi-IN) language setting");
          }
          
          setTimeout(() => {
            try {
              window.speechSynthesis.speak(utterance);
            } catch (fallbackError) {
              console.error("Fallback speech attempt failed:", fallbackError);
            }
          }, 250);
        }
      }, 200);
    } catch (error) {
      console.error("Audio play error:", error);
      window.speechSynthesis.cancel();
      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
        } catch (fallbackError) {
          console.error("Fallback speech attempt failed:", fallbackError);
        }
      }, 300);
    }
  };

  const playWithSpeechSynthesis = (word: Word, setIsPlayingAudio: (playing: boolean) => void, setCurrentUtterance: (utterance: SpeechSynthesisUtterance | null) => void, playbackAttempts: number): Promise<void> => {
    return new Promise<void>((resolve) => {
      try {
        const utterance = new SpeechSynthesisUtterance(word.text);
        console.log(`Creating utterance for: "${word.text}" (ID: ${word.id})`);
        
        if (word.language === 'urdu') {
          utterance.lang = 'ur-PK';
          utterance.rate = 0.55;
          utterance.pitch = 1.4;
          utterance.volume = 1.0;
          
          if (playbackAttempts > 1) {
            utterance.text = Array.from(word.text).join(' ');
            console.log(`Using spaced text for better pronunciation: "${utterance.text}"`);
          }
        } else {
          utterance.rate = 0.85;
          utterance.pitch = 1.15;
          utterance.volume = 1.0;
        }
        
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
          window.speechSynthesis.onvoiceschanged = () => {
            const updatedVoices = window.speechSynthesis.getVoices();
            setupVoice(utterance, updatedVoices, word.language);
            speakWithFallback(utterance);
          };
        } else {
          setupVoice(utterance, voices, word.language);
          speakWithFallback(utterance);
        }
        
        setCurrentUtterance(utterance);
        
        utterance.onend = () => {
          console.log(`Speech completed for: "${word.text}" (ID: ${word.id})`);
          setCurrentUtterance(null);
          setIsPlayingAudio(false);
          resolve();
        };
        
        utterance.onerror = (event) => {
          console.error(`Speech synthesis error for word: ${word.text}`, event);
          setCurrentUtterance(null);
          setIsPlayingAudio(false);
          
          if (playbackAttempts < 3) {
            console.log("Speech synthesis error, trying alternative fallback...");
            setTimeout(() => {
              playWithAlternativeFallback(word);
            }, 500);
          } else {
            resolve();
          }
        };
        
        const timeoutDuration = word.language === 'urdu' ? word.text.length * 600 + 3000 : word.text.length * 250 + 1000;
        setTimeout(() => {
          console.log(`Speech timeout reached after ${timeoutDuration}ms for: "${word.text}"`);
          setIsPlayingAudio(false);
          resolve();
        }, timeoutDuration);
      } catch (error) {
        console.error(`Error in playWithSpeechSynthesis for word: ${word.text}`, error);
        setIsPlayingAudio(false);
        resolve();
      }
    });
  };

  const playWithAlternativeFallback = (word: Word) => {
    if (word.language !== 'urdu') return;
    
    console.log("Trying alternative speech approach");
    
    try {
      const utterance = new SpeechSynthesisUtterance(word.text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.5;
      utterance.pitch = 1.5;
      utterance.volume = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang.includes('hi'));
      if (hindiVoice) {
        utterance.voice = hindiVoice;
        console.log("Using Hindi voice for fallback:", hindiVoice.name);
      }
      
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Alternative fallback failed:", error);
    }
  };

  return {
    setupVoice,
    findFemaleVoice, 
    speakWithFallback,
    playWithSpeechSynthesis,
    playWithAlternativeFallback
  };
};
