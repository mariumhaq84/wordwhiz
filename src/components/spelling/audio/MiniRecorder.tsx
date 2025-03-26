
import React, { useState, useEffect, useRef } from 'react';
import { Mic, StopCircle, MicOff, Play, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useAudioRecorder } from './useAudioRecorder';
import PlaybackButton from './PlaybackButton';
import { playRecordedAudio } from '@/utils/elevenLabsAPI';

interface MiniRecorderProps {
  wordId: string;
  onRecordingComplete: (wordId: string, blob: Blob) => void;
  className?: string;
  language?: string;
  flashEmptyIndicator?: boolean;
}

const MiniRecorder: React.FC<MiniRecorderProps> = ({
  wordId,
  onRecordingComplete,
  className = "",
  language = "english",
  flashEmptyIndicator = false
}) => {
  const MAX_RECORDING_TIME = 2;
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [savedRecording, setSavedRecording] = useState<string | null>(null);
  const [showKeepDiscardOptions, setShowKeepDiscardOptions] = useState(false);
  const [tempRecordingBlob, setTempRecordingBlob] = useState<Blob | null>(null);
  const [showPlayback, setShowPlayback] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentWordIdRef = useRef<string>(wordId);
  
  useEffect(() => {
    if (currentWordIdRef.current !== wordId) {
      console.log(`MiniRecorder: Word ID changed from ${currentWordIdRef.current} to ${wordId}`);
      currentWordIdRef.current = wordId;
      
      setShowKeepDiscardOptions(false);
      setShowPlayback(false);
      setTempRecordingBlob(null);
      
      checkSavedRecording(wordId);
    }
  }, [wordId]);
  
  // Immediately check for a saved recording when the component mounts
  useEffect(() => {
    checkSavedRecording(wordId);
  }, []);
  
  const {
    isRecording,
    audioURL,
    recordingTime,
    playingAudio,
    startRecording,
    stopRecording,
    playAudio,
    reset
  } = useAudioRecorder({
    maxRecordingTime: MAX_RECORDING_TIME,
    onRecordingComplete: (recordedWordId, blob) => {
      const targetWordId = currentWordIdRef.current;
      if (recordedWordId !== targetWordId) {
        console.log(`Word ID mismatch in recorder: recorded for ${recordedWordId}, current is ${targetWordId}. Using current.`);
      }
      
      setTempRecordingBlob(blob);
      setShowKeepDiscardOptions(true);
      setShowPlayback(true);
    },
    wordId: currentWordIdRef.current,
    autoStart: false
  });

  useEffect(() => {
    const handleWordChanged = (event: CustomEvent) => {
      if (event.detail && event.detail.wordId) {
        const newWordId = event.detail.wordId;
        const newWordText = event.detail.wordText || '';
        
        if (newWordId !== currentWordIdRef.current) {
          console.log(`MiniRecorder: Received word change event to "${newWordText}" (ID: ${newWordId}), previous: ${currentWordIdRef.current}`);
          
          currentWordIdRef.current = newWordId;
          
          if (isRecording) {
            stopRecording();
          }
          
          setShowKeepDiscardOptions(false);
          setShowPlayback(false);
          setTempRecordingBlob(null);
          
          checkSavedRecording(newWordId);
        }
      }
    };
    
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'wordRecordings' || event.key === null) {
        checkSavedRecording(currentWordIdRef.current);
      }
    };
    
    window.addEventListener('wordChanged', handleWordChanged as EventListener);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('wordChanged', handleWordChanged as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isRecording, stopRecording]);

  const checkSavedRecording = (targetWordId: string) => {
    try {
      const savedRecordings = localStorage.getItem('wordRecordings');
      if (savedRecordings) {
        const recordings = JSON.parse(savedRecordings);
        
        console.log(`MiniRecorder: Checking recording for word ID: ${targetWordId}`);
        console.log(`MiniRecorder: Available recordings: ${Object.keys(recordings).join(', ')}`);
        
        if (recordings[targetWordId]) {
          setSavedRecording(recordings[targetWordId]);
          console.log(`MiniRecorder: Found saved recording for word ID: ${targetWordId}`);
        } else {
          setSavedRecording(null);
          console.log(`MiniRecorder: No saved recording found for word ID: ${targetWordId}`);
        }
      } else {
        setSavedRecording(null);
        setShowPlayback(false);
        setShowKeepDiscardOptions(false);
      }
    } catch (error) {
      console.error('Error checking saved recordings:', error);
    }
  };

  const handleResetRecording = () => {
    try {
      const savedRecordings = localStorage.getItem('wordRecordings');
      if (savedRecordings) {
        const recordings = JSON.parse(savedRecordings);
        const targetWordId = currentWordIdRef.current;
        
        if (recordings[targetWordId]) {
          delete recordings[targetWordId];
          localStorage.setItem('wordRecordings', JSON.stringify(recordings));
          setSavedRecording(null);
          setShowPlayback(false);
          setShowKeepDiscardOptions(false);
          reset();
          toast.success(`Recording for this word reset`);
          
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'wordRecordings'
          }));
        } else {
          toast.info("No recording found for this word");
        }
      }
    } catch (error) {
      console.error('Error resetting recording:', error);
      toast.error('Failed to reset recording');
    }
  };

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'wordRecordings' || event.key === null) {
        checkSavedRecording(currentWordIdRef.current);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const checkMicPermission = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasMic = devices.some(device => device.kind === 'audioinput' && device.deviceId);
        
        if (!hasMic) {
          console.warn('No microphone detected on this device');
        }
        
        if (!permissionRequested) {
          const mics = devices.filter(device => device.kind === 'audioinput');
          if (mics.length > 0 && !mics.some(mic => mic.label)) {
            setPermissionDenied(false);
          }
        }
      } catch (error) {
        console.error('Error checking microphone:', error);
      }
    };
    
    checkMicPermission();
  }, [permissionRequested]);

  useEffect(() => {
    if (isRecording && recordingTime >= MAX_RECORDING_TIME) {
      stopRecording();
    }
  }, [isRecording, recordingTime, stopRecording]);

  const handleStartRecording = async () => {
    try {
      setPermissionRequested(true);
      setShowKeepDiscardOptions(false);
      setShowPlayback(false);
      
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setPermissionDenied(false);
      toast.info("Recording for 2 seconds...");
      startRecording();
    } catch (error) {
      console.error('Microphone permission error:', error);
      setPermissionDenied(true);
      
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        toast.error('Microphone access denied. Please check your browser permissions and try again.');
      } else if (error instanceof DOMException && error.name === 'NotFoundError') {
        toast.error('No microphone found. Please connect a microphone and try again.');
      } else {
        toast.error('Could not access microphone. Please check your settings.');
      }
    }
  };

  const handleKeepRecording = () => {
    if (tempRecordingBlob) {
      const targetWordId = currentWordIdRef.current;
      onRecordingComplete(targetWordId, tempRecordingBlob);
      setShowKeepDiscardOptions(false);
      setShowPlayback(false);
      toast.success("Recording saved!");
      
      const reader = new FileReader();
      reader.readAsDataURL(tempRecordingBlob);
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSavedRecording(reader.result);
          
          // Update recordings in localStorage
          try {
            const savedRecordings = localStorage.getItem('wordRecordings') || '{}';
            const recordings = JSON.parse(savedRecordings);
            recordings[targetWordId] = reader.result;
            localStorage.setItem('wordRecordings', JSON.stringify(recordings));
            
            // Trigger a storage event to notify other components
            window.dispatchEvent(new StorageEvent('storage', {
              key: 'wordRecordings'
            }));
          } catch (error) {
            console.error('Error updating recordings in localStorage:', error);
          }
        }
      };
    }
  };

  const handleDiscardRecording = () => {
    setTempRecordingBlob(null);
    setShowKeepDiscardOptions(false);
    setShowPlayback(false);
    reset();
    toast.info("Recording discarded");
  };

  const handlePlayTempRecording = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    
    if (audioURL) {
      playAudio()
        .then(() => {
          setIsPlaying(false);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    } else if (savedRecording) {
      playRecordedAudio(savedRecording)
        .then(() => {
          console.log('Saved recording played successfully');
          setIsPlaying(false);
        })
        .catch(error => {
          console.error('Error playing saved recording:', error);
          toast.error('Could not play the recording.');
          setIsPlaying(false);
        });
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      {isRecording ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={stopRecording}
          className="text-purple-500 hover:bg-purple-50 animate-pulse h-7 w-7" 
        >
          <StopCircle className="h-4 w-4" />
        </Button>
      ) : (
        !showPlayback && (
          <div className="inline-flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleStartRecording}
              className={`${permissionDenied ? 'text-red-500 hover:bg-red-50' : 'text-blue-500 hover:bg-blue-50'} h-7 w-7 animate-in fade-in duration-300`}
              title={permissionDenied 
                ? "Microphone access denied. Click to try again" 
                : "Record your pronunciation (2 seconds)"}
            >
              {permissionDenied ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            
            {savedRecording && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleResetRecording}
                className="text-red-500 hover:bg-red-50 h-7 w-7"
                title="Reset this word's recording"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        )
      )}
      
      {audioURL && showPlayback && (
        <PlaybackButton 
          audioURL={audioURL} 
          playingAudio={playingAudio || isPlaying} 
          onPlayAudio={handlePlayTempRecording}
          onKeep={handleKeepRecording}
          onDiscard={handleDiscardRecording}
          showDiscardOptions={showKeepDiscardOptions}
          compactMode={true}
          wordId={currentWordIdRef.current}
        />
      )}
      
      {!audioURL && savedRecording && !showPlayback && !isRecording && (
        <div className="inline-flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (isPlaying) return;
              setIsPlaying(true);
              
              console.log(`MiniRecorder: Playing saved recording for word ID: ${currentWordIdRef.current}`);
              
              playRecordedAudio(savedRecording)
                .then(() => {
                  setIsPlaying(false);
                })
                .catch(error => {
                  console.error('Error playing saved audio:', error);
                  toast.error('Could not play the saved recording.');
                  setIsPlaying(false);
                });
            }}
            disabled={isPlaying}
            className={`text-green-600 hover:text-green-800 hover:bg-green-50 h-7 w-7 animate-in fade-in duration-300 
              ${isPlaying ? 'bg-green-50 opacity-75' : ''}`}
          >
            <Play className={`h-4 w-4 ${isPlaying ? 'animate-pulse' : ''}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetRecording}
            className="text-red-500 hover:bg-red-50 h-7 w-7"
            title="Reset this word's recording"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {!audioURL && !savedRecording && flashEmptyIndicator && !showPlayback && !isRecording && (
        <PlaybackButton 
          audioURL={null} 
          playingAudio={false} 
          onPlayAudio={() => {}}
          compactMode={true}
          flashEmpty={true}
        />
      )}
    </div>
  );
};

export default MiniRecorder;
