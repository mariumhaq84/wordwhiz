import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import SpellingProgress from './SpellingProgress';
import { Word } from '@/types/word';
import { Volume2, RefreshCw } from 'lucide-react';
import MiniRecorder from './audio/MiniRecorder';
import { toast } from 'sonner';

interface SpellingFullViewProps {
  word: Word;
  playPronunciation: () => Promise<void>;
  timeRemaining: number;
  showWarning: boolean;
}

const SpellingFullView = ({ 
  word, 
  playPronunciation, 
  timeRemaining,
  showWarning 
}: SpellingFullViewProps) => {
  // Determine if we need RTL direction
  const isRTL = word.language === 'urdu' || word.language === 'arabic';
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const currentWordIdRef = useRef<string>(word.id);
  
  // Check for existing recording on mount and word change
  useEffect(() => {
    // First update the ref when word changes to ensure we're always checking against current word
    if (currentWordIdRef.current !== word.id) {
      console.log(`SpellingFullView: Current word ID changed from ${currentWordIdRef.current} to ${word.id}`);
      currentWordIdRef.current = word.id;
      
      // Reset state for the new word
      setPlayCount(0);
    }
    
    const checkSavedRecording = () => {
      try {
        const savedRecordings = localStorage.getItem('wordRecordings') || '{}';
        const recordings = JSON.parse(savedRecordings);
        
        console.log(`SpellingFullView: Checking recordings for word ID: ${word.id}`);
        console.log(`SpellingFullView: Available recording IDs: ${Object.keys(recordings).join(', ')}`);
        
        // Check specifically for the current word's ID, not text
        const hasRec = !!recordings[word.id];
        setHasRecording(hasRec);
        console.log(`SpellingFullView: Word "${word.text}" (ID: ${word.id}) has recording: ${hasRec}`);
      } catch (error) {
        console.error('Error checking saved recordings:', error);
        setHasRecording(false);
      }
    };
    
    // Check immediately and also set up an interval to check periodically
    checkSavedRecording();
    
    // Listen for storage events to detect when recordings are cleared by the reset button
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'wordRecordings') {
        checkSavedRecording();
      }
    };
    
    // Listen for word change events
    const handleWordChanged = (event: CustomEvent) => {
      if (event.detail && event.detail.wordId && event.detail.wordId !== currentWordIdRef.current) {
        console.log(`SpellingFullView: Received word change event to "${event.detail.wordText}" (ID: ${event.detail.wordId})`);
        currentWordIdRef.current = event.detail.wordId;
        checkSavedRecording();
        setPlayCount(0);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('wordChanged', handleWordChanged as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('wordChanged', handleWordChanged as EventListener);
    };
  }, [word.id, word.text]);
  
  // Handle resetting the recording for the current word
  const handleResetRecording = () => {
    try {
      const savedRecordings = localStorage.getItem('wordRecordings');
      if (savedRecordings) {
        const recordings = JSON.parse(savedRecordings);
        
        if (recordings[word.id]) {
          delete recordings[word.id];
          localStorage.setItem('wordRecordings', JSON.stringify(recordings));
          setHasRecording(false);
          toast.success(`Recording for "${word.text}" (ID: ${word.id}) reset`);
          
          // Dispatch storage event to notify other components
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'wordRecordings'
          }));
        } else {
          toast.info(`No recording found for word ID: ${word.id}`);
        }
      }
    } catch (error) {
      console.error('Error resetting recording:', error);
      toast.error('Failed to reset recording');
    }
  };
  
  const handleRecordingComplete = (wordId: string, blob: Blob) => {
    try {
      // Verify we're saving recording for the current word
      if (wordId !== word.id) {
        console.warn(`Recording completed for wordId ${wordId} but current word is ${word.id}. Updating to correct ID.`);
        wordId = word.id;
      }
      
      // Create URL for the recording
      const audioUrl = URL.createObjectURL(blob);
      
      // Save recording to localStorage with proper word ID
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const base64data = reader.result;
          
          // Get existing recordings
          const savedRecordings = localStorage.getItem('wordRecordings') || '{}';
          try {
            const recordings = JSON.parse(savedRecordings);
            // Add the new recording with the correct word ID
            recordings[wordId] = base64data;
            // Save back to localStorage
            localStorage.setItem('wordRecordings', JSON.stringify(recordings));
            setHasRecording(true);
            console.log(`SpellingFullView: Saved recording for word "${word.text}" (ID: ${wordId})`);
            
            // Log all available recordings
            console.log(`SpellingFullView: All recordings now: ${Object.keys(recordings).join(', ')}`);
            
            // Dispatch storage event to notify other components
            window.dispatchEvent(new StorageEvent('storage', {
              key: 'wordRecordings'
            }));
          } catch (error) {
            console.error('Error saving recording:', error);
            toast.error("Failed to save recording");
          }
        }
      };
      
      reader.onerror = () => {
        toast.error("Failed to process recording");
      };
    } catch (error) {
      console.error('Error handling recording:', error);
      toast.error("Could not save recording");
    }
  };
  
  // Handle pronunciation with visual feedback
  const handlePlayPronunciation = () => {
    setIsPlaying(true);
    setPlayCount(prev => prev + 1);
    
    console.log(`Playing pronunciation for word: "${word.text}" (ID: ${word.id})`);
    
    playPronunciation().finally(() => {
      setTimeout(() => setIsPlaying(false), 500);
    });
  };
  
  return (
    <div className="flex flex-col items-center w-full space-y-6">
      <div className="w-full flex items-center justify-center relative">
        <div className={`text-3xl font-bold text-center p-8 bg-white/70 backdrop-blur-sm rounded-xl shadow-inner transform hover:scale-105 transition-all duration-300 min-w-[80%] 
          ${isRTL ? 'rtl font-urdu kid-friendly' : ''}`}>
          {word.text}
          <div className="text-xs text-gray-500 mt-2">ID: {word.id}</div>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-md">
        <div className="flex items-center justify-center gap-4">
          <Button 
            onClick={handlePlayPronunciation} 
            variant="outline" 
            size="icon"
            className={`bg-white/70 hover:bg-white/90 transition-all ${isPlaying ? 'bg-purple-100' : ''}`}
            disabled={isPlaying}
          >
            <Volume2 className={`h-5 w-5 ${isPlaying ? 'animate-pulse text-purple-600' : ''}`} />
          </Button>
          
          {isRTL && !hasRecording && (
            <div className="flex flex-col items-center">
              <MiniRecorder 
                wordId={word.id}
                onRecordingComplete={handleRecordingComplete}
                language={word.language}
                flashEmptyIndicator={true}
                className="scale-125 animate-pulse"
              />
            </div>
          )}
          
          {(!isRTL || hasRecording) && (
            <MiniRecorder 
              wordId={word.id}
              onRecordingComplete={handleRecordingComplete}
              language={word.language}
              flashEmptyIndicator={isRTL && !hasRecording}
            />
          )}
          
          {hasRecording && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleResetRecording}
              className="text-red-500 hover:bg-red-50 h-7 w-7"
              title={`Reset recording for word ID: ${word.id}`}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <SpellingProgress 
        timeRemaining={timeRemaining}
        showWarning={showWarning}
      />
    </div>
  );
};

export default SpellingFullView;
