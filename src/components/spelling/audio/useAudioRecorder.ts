
import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface UseAudioRecorderProps {
  maxRecordingTime?: number;
  onRecordingComplete: (wordId: string, blob: Blob) => void;
  wordId: string;
  autoStart?: boolean;
}

export const useAudioRecorder = ({
  maxRecordingTime = 30,
  onRecordingComplete,
  wordId,
  autoStart = false
}: UseAudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingAudio, setPlayingAudio] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentWordIdRef = useRef<string>(wordId);

  // Update current word ID whenever the prop changes
  useEffect(() => {
    if (currentWordIdRef.current !== wordId) {
      console.log(`Word ID changed in useAudioRecorder: ${currentWordIdRef.current} -> ${wordId}`);
      
      // Stop recording if word changes during recording
      if (isRecording) {
        console.log(`useAudioRecorder: Stopping recording due to word change from ${currentWordIdRef.current} to ${wordId}`);
        stopRecording();
      }
      
      // Clean up previous audio URL if it exists
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
        setAudioURL(null);
      }
      
      // Update ref to new word ID
      currentWordIdRef.current = wordId;
      
      // Try to load the saved recording for this word
      loadSavedRecording(wordId);
    }
  }, [wordId, isRecording, audioURL]);

  // Listen for word change events from other components
  useEffect(() => {
    const handleWordChanged = (event: CustomEvent) => {
      if (event.detail && event.detail.wordId && event.detail.wordId !== currentWordIdRef.current) {
        const newWordId = event.detail.wordId;
        const newWordText = event.detail.wordText || ''; // For better logging
        
        console.log(`useAudioRecorder: Received word change event to "${newWordText}" (ID: ${newWordId}), previous: ${currentWordIdRef.current}`);
        
        // Stop recording if in progress
        if (isRecording) {
          stopRecording();
        }
        
        // Clean up previous audio URL if it exists
        if (audioURL) {
          URL.revokeObjectURL(audioURL);
          setAudioURL(null);
        }
        
        // Update ref to new word ID
        currentWordIdRef.current = newWordId;
        
        // Try to load the saved recording for this word
        loadSavedRecording(newWordId);
      }
    };
    
    window.addEventListener('wordChanged', handleWordChanged as EventListener);
    
    return () => {
      window.removeEventListener('wordChanged', handleWordChanged as EventListener);
    };
  }, [isRecording, audioURL]);
  
  // Function to load existing recording from localStorage
  const loadSavedRecording = (targetWordId: string) => {
    try {
      const savedRecordings = localStorage.getItem('wordRecordings');
      if (savedRecordings) {
        const recordings = JSON.parse(savedRecordings);
        
        console.log(`Checking recording for word ID: ${targetWordId}`);
        console.log(`Available recordings: ${Object.keys(recordings).join(', ')}`);
        
        if (recordings[targetWordId]) {
          const base64Data = recordings[targetWordId];
          if (typeof base64Data === 'string' && base64Data.startsWith('data:')) {
            setAudioURL(base64Data);
            console.log(`useAudioRecorder: Loaded saved recording for word ID: ${targetWordId}`);
          } else {
            setAudioURL(null);
            console.log(`useAudioRecorder: Invalid recording format for word ID: ${targetWordId}`);
          }
        } else {
          setAudioURL(null);
          console.log(`useAudioRecorder: No saved recording found for word ID: ${targetWordId}`);
        }
      }
    } catch (error) {
      console.error('Error loading saved recording:', error);
    }
  };

  // Load existing recording from localStorage for the current word on initial mount
  useEffect(() => {
    loadSavedRecording(wordId);
  }, [wordId]);

  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      cleanupResources();
    };
  }, []);

  // Timer for recording duration
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prevTime => {
          const newTime = prevTime + 1;
          if (newTime >= maxRecordingTime) {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              stopRecording();
            }
            return maxRecordingTime;
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRecording, maxRecordingTime]);

  const startRecording = async () => {
    try {
      const targetWordId = currentWordIdRef.current;
      console.log(`Starting recording for word ID: ${targetWordId}`);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1
        } 
      });
      streamRef.current = stream;
      
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/mp4';
        if (!MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = '';
        }
      }
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType ? mimeType : undefined
      });
      mediaRecorderRef.current = mediaRecorder;
      
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          // Make sure we're using the latest word ID when creating the blob
          const audioBlob = new Blob(audioChunksRef.current, { 
            type: mimeType || 'audio/webm' 
          });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioURL(audioUrl);
          
          onRecordingComplete(targetWordId, audioBlob);
        } else {
          console.warn('Recording stopped but no audio data was captured');
        }
        
        cleanupResources();
      };
      
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        toast.error('Recording failed. Please try again.');
        cleanupResources();
      };
      
      setTimeout(() => {
        mediaRecorder.start();
        console.log(`Recording started for word ID: ${targetWordId}`);
        setIsRecording(true);
        setRecordingTime(0);
      }, 100);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not access microphone. Please check permissions.');
      setIsRecording(false);
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      const targetWordId = currentWordIdRef.current;
      console.log(`Stopping recording for word ID: ${targetWordId}`);
      
      try {
        mediaRecorderRef.current.stop();
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
      
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, []);

  const cleanupResources = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (error) {
          console.error('Error stopping track:', error);
        }
      });
      streamRef.current = null;
    }
  }, []);

  const playAudio = useCallback((): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      try {
        const targetWordId = currentWordIdRef.current;
        console.log(`Attempting to play audio for word ID: ${targetWordId}`);
        
        const savedRecordings = localStorage.getItem('wordRecordings');
        if (savedRecordings) {
          const recordings = JSON.parse(savedRecordings);
          console.log(`Available recordings for playback: ${Object.keys(recordings).join(', ')}`);
          
          if (recordings[targetWordId] && typeof recordings[targetWordId] === 'string') {
            console.log(`Found recording for word ID: ${targetWordId}`);
            const savedAudio = new Audio(recordings[targetWordId]);
            
            setPlayingAudio(true);
            audioRef.current = savedAudio;
            
            savedAudio.onended = () => {
              setPlayingAudio(false);
              audioRef.current = null;
              resolve();
            };
            
            savedAudio.onerror = (e) => {
              console.error('Audio play error:', e);
              setPlayingAudio(false);
              audioRef.current = null;
              
              if (audioURL) {
                const fallbackAudio = new Audio(audioURL);
                fallbackAudio.play().catch(error => {
                  console.error('Error playing fallback audio:', error);
                  reject(error);
                });
              } else {
                reject(new Error('Could not play the saved recording'));
              }
            };
            
            savedAudio.play().catch(error => {
              console.error('Error playing saved audio:', error);
              setPlayingAudio(false);
              audioRef.current = null;
              
              if (audioURL) {
                const fallbackAudio = new Audio(audioURL);
                fallbackAudio.play().catch(error => {
                  console.error('Error playing fallback audio:', error);
                  reject(error);
                });
              } else {
                reject(error);
              }
            });
            
            return;
          } else {
            console.log(`No recording found for word ID: ${targetWordId} in storage`);
          }
        }
      } catch (error) {
        console.error('Error reading saved recording:', error);
        reject(error);
      }
      
      if (audioURL) {
        setPlayingAudio(true);
        
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeAttribute('src');
          audioRef.current = null;
        }
        
        const audio = new Audio();
        audioRef.current = audio;
        
        audio.onended = () => {
          setPlayingAudio(false);
          audioRef.current = null;
          resolve();
        };
        
        audio.onerror = (e) => {
          console.error('Audio play error:', e);
          setPlayingAudio(false);
          audioRef.current = null;
          reject(new Error('Could not play the recording'));
        };
        
        if (audioURL.startsWith('data:')) {
          audio.src = audioURL;
        } else {
          audio.src = audioURL;
        }
        
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
          setPlayingAudio(false);
          audioRef.current = null;
          reject(error);
        });
      } else {
        reject(new Error('No audio URL available'));
      }
    });
  }, [audioURL]);

  const reset = useCallback(() => {
    setAudioURL(null);
    setRecordingTime(0);
  }, []);

  return {
    isRecording,
    audioURL,
    recordingTime,
    playingAudio,
    startRecording,
    stopRecording,
    playAudio,
    reset
  };
};
