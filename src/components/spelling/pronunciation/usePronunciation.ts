
import { useState, useRef, useEffect } from 'react';
import { Word } from '@/types/word';
import { useVoiceSelection } from './useVoiceSelection';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { useAudioManager } from './useAudioManager';
import { useRecordingManager } from './useRecordingManager';
import { usePlaybackTimers } from './usePlaybackTimers';

export const usePronunciation = (word: Word) => {
  // State for tracking current audio playback
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackAttempts, setPlaybackAttempts] = useState(0);
  
  // Reference to track word changes
  const wordRef = useRef<string>(word.text);
  const wordIdRef = useRef<string>(word.id);
  const elevenLabsFallbackRef = useRef<boolean>(false);
  
  // Custom hooks for specific functionality
  const { isUrduVoiceAvailable, checkUrduVoiceAvailability, findSuitableVoiceForUrdu } = useVoiceSelection(word.language);
  const { setupVoice, findFemaleVoice, speakWithFallback, playWithSpeechSynthesis, playWithAlternativeFallback } = useSpeechSynthesis();
  const { userRecordings, loadUserRecordings } = useRecordingManager();
  const { stopCurrentSpeech, currentAudioRef, currentUtterance, setCurrentUtterance } = useAudioManager();
  const { clearPlaybackTimers, playbackTimersRef } = usePlaybackTimers();

  // Handle word changes
  useEffect(() => {
    if (wordRef.current !== word.text || wordIdRef.current !== word.id) {
      console.log(`Word changed from "${wordRef.current}" (ID: ${wordIdRef.current}) to "${word.text}" (ID: ${word.id})`);
      wordRef.current = word.text;
      wordIdRef.current = word.id;
      clearPlaybackTimers();
      stopCurrentSpeech();
      setPlaybackAttempts(0);
      elevenLabsFallbackRef.current = false;
    }
    
    if (word.language === 'urdu') {
      checkUrduVoiceAvailability();
    }
    
    // Always load recordings when the word changes
    loadUserRecordings();
  }, [word.text, word.language, word.id, clearPlaybackTimers, stopCurrentSpeech, checkUrduVoiceAvailability, loadUserRecordings]);

  // Listen for word changed events
  useEffect(() => {
    const handleWordChanged = (event: CustomEvent) => {
      if (event.detail && event.detail.wordId) {
        const newWordId = event.detail.wordId;
        const newWordText = event.detail.wordText || '';
        
        if (newWordId !== wordIdRef.current) {
          console.log(`usePronunciation: Received word change event to "${newWordText}" (ID: ${newWordId})`);
          
          // Update refs
          wordRef.current = newWordText;
          wordIdRef.current = newWordId;
          
          // Clean up
          clearPlaybackTimers();
          stopCurrentSpeech();
          setPlaybackAttempts(0);
          elevenLabsFallbackRef.current = false;
          
          // Reload recordings specifically for this word ID
          loadUserRecordings();
        }
      }
    };
    
    // Listen for storage events (for global reset)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'wordRecordings' || event.key === null) {
        loadUserRecordings();
      }
    };
    
    window.addEventListener('wordChanged', handleWordChanged as EventListener);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('wordChanged', handleWordChanged as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [clearPlaybackTimers, stopCurrentSpeech, loadUserRecordings]);

  // Try the ElevenLabs API as a fallback for Urdu
  const tryElevenLabsFallback = async (): Promise<boolean> => {
    try {
      const { checkApiKeyConfigured, speakText } = await import('@/utils/elevenLabsAPI');
      
      if (checkApiKeyConfigured()) {
        console.log("Trying ElevenLabs for Urdu pronunciation");
        elevenLabsFallbackRef.current = true;
        try {
          await speakText(word.text, word.language, { wordId: word.id });
          return true;
        } catch (error) {
          console.error("ElevenLabs fallback failed:", error);
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error loading ElevenLabs API:", error);
      return false;
    }
  };

  // Main function to play pronunciation
  const playPronunciation = async (): Promise<void> => {
    console.log(`Playing pronunciation for: "${word.text}" (ID: ${word.id}, language: ${word.language})`);
    stopCurrentSpeech();
    setIsPlayingAudio(true);
    setPlaybackAttempts(prev => prev + 1);
    
    try {
      // Make sure to load the most recent recordings first
      loadUserRecordings();
      
      // Check for user recording by specific word ID
      const savedRecordings = localStorage.getItem('wordRecordings');
      if (savedRecordings) {
        try {
          const recordings = JSON.parse(savedRecordings);
          console.log(`Available recordings: ${Object.keys(recordings).join(', ')}`);
          console.log(`Looking for recording with word ID: ${word.id}`);
          
          // Specifically check for recording by word ID
          if (recordings[word.id]) {
            console.log(`usePronunciation: Using user recording for playback of word: ${word.text} (ID: ${word.id})`);
            try {
              const { playRecordedAudio } = await import('@/utils/elevenLabsAPI');
              await playRecordedAudio(recordings[word.id]);
              setIsPlayingAudio(false);
              return Promise.resolve();
            } catch (error) {
              console.error("Error playing user recording, falling back to speech synthesis:", error);
            }
          } else {
            console.log(`usePronunciation: No user recording found for word ID: ${word.id}`);
          }
        } catch (error) {
          console.error("Error parsing saved recordings:", error);
        }
      }
      
      if (word.language === 'urdu' && (playbackAttempts > 2 || elevenLabsFallbackRef.current)) {
        const elevenLabsAvailable = await tryElevenLabsFallback();
        if (elevenLabsAvailable) {
          setIsPlayingAudio(false);
          return Promise.resolve();
        }
      }
      
      window.speechSynthesis.cancel();
      
      return playWithSpeechSynthesis(word, setIsPlayingAudio, setCurrentUtterance, playbackAttempts);
    } catch (error) {
      console.error("Error setting up speech synthesis:", error);
      setIsPlayingAudio(false);
      
      return Promise.resolve();
    }
  };

  // Play pronunciation multiple times
  const playPronunciationTimes = async (times: number = 1): Promise<void> => {
    clearPlaybackTimers();
    
    console.log(`Playing pronunciation ${times} times for: "${word.text}" (ID: ${word.id})`);
    await playPronunciation();
    
    if (times > 1) {
      const delayBetweenPlaybacks = word.language === 'urdu' ? 4000 : 2500;
      
      for (let i = 1; i < times; i++) {
        const timeoutId = setTimeout(async () => {
          console.log(`Playing pronunciation iteration ${i+1}/${times} for: "${word.text}" (ID: ${word.id})`);
          await playPronunciation();
        }, i * delayBetweenPlaybacks);
        
        playbackTimersRef.current.push(timeoutId);
      }
    }
    
    return Promise.resolve();
  };

  // Play three times
  const playPronunciationThreeTimes = async (): Promise<void> => {
    return playPronunciationTimes(3);
  };

  // Check if user has recording
  const hasUserRecording = (wordId: string): boolean => {
    try {
      const savedRecordings = localStorage.getItem('wordRecordings');
      if (savedRecordings) {
        const recordings = JSON.parse(savedRecordings);
        return !!recordings[wordId];
      }
    } catch (error) {
      console.error("Error checking recordings:", error);
    }
    return false;
  };

  return {
    playPronunciation,
    playPronunciationTimes,
    playPronunciationThreeTimes,
    stopCurrentSpeech,
    clearPlaybackTimers,
    isUrduVoiceAvailable,
    isPlayingAudio,
    playbackAttempts,
    hasUserRecording
  };
};
