
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import SpellingPractice from '@/components/spelling/SpellingPractice';
import { ArrowLeft } from 'lucide-react';
import { WordList } from '@/types/word';
import { toast } from 'sonner';

interface PracticeViewProps {
  currentList: WordList;
  currentWordIndex: number;
  currentScore: number;
  onBackToWordList: () => void;
  onEndSession: () => void;
  onWordComplete: (correct: boolean, penalty?: number) => void;
  onNavigateWord: (direction: 'next' | 'prev') => void;
}

const PracticeView = ({
  currentList,
  currentWordIndex,
  currentScore,
  onBackToWordList,
  onEndSession,
  onWordComplete,
  onNavigateWord,
}: PracticeViewProps) => {
  // Track word changes for navigation and timer management
  const lastWordIndexRef = useRef(currentWordIndex);
  const lastWordIdRef = useRef<string | null>(null);
  const [microphonePermission, setMicrophonePermission] = useState<'granted' | 'denied' | 'unknown'>('unknown');
  const wordChangeInProgressRef = useRef(false);
  
  // Set up pronunciation for the current word
  const currentWord = currentList.words[currentWordIndex];
  
  // Initialize lastWordIdRef with the current word's ID on first render
  useEffect(() => {
    if (lastWordIdRef.current === null && currentWord) {
      lastWordIdRef.current = currentWord.id;
    }
  }, [currentWord]);
  
  // Handle word changes - this helps manage transitions between words properly
  useEffect(() => {
    console.log(`Word index changed: ${lastWordIndexRef.current} -> ${currentWordIndex}, Word ID: ${lastWordIdRef.current} -> ${currentWord?.id}`);
    
    // Only trigger when the index actually changes to avoid unnecessary resets
    // Also prevent duplicate events using a flag
    if ((lastWordIndexRef.current !== currentWordIndex || lastWordIdRef.current !== currentWord?.id) && 
        !wordChangeInProgressRef.current) {
      // Set flag to prevent duplicate events
      wordChangeInProgressRef.current = true;
      
      // First, capture the previous word ID
      const previousWordId = lastWordIdRef.current;
      
      // Update the refs after capturing the previous ID
      lastWordIndexRef.current = currentWordIndex;
      lastWordIdRef.current = currentWord?.id || null;
      
      // Trigger an event to notify other components about the word change
      // Include both word IDs and the actual word text for debugging
      window.dispatchEvent(new CustomEvent('wordChanged', {
        detail: {
          wordId: currentWord.id,
          wordText: currentWord.text,
          previousWordId: previousWordId,
          timestamp: Date.now()
        }
      }));
      
      console.log(`PracticeView: Dispatched wordChanged event for "${currentWord.text}" (ID: ${currentWord.id})`);
      
      // Clear the flag after a small delay to allow event processing
      setTimeout(() => {
        wordChangeInProgressRef.current = false;
      }, 300);
    }
  }, [currentWordIndex, currentList.words, currentWord]);

  // Check for speech and microphone support on component mount
  useEffect(() => {
    // Check if browser supports audio recording without accessing the device
    const checkAudioSupport = async () => {
      // Check if the API exists
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("Your browser doesn't support microphone access.");
        setMicrophonePermission('denied');
        return false;
      }
      
      // Don't automatically request microphone permissions
      // Just check other audio capabilities
      
      // Check audio playback support
      const audio = document.createElement('audio');
      if (!audio.canPlayType) {
        console.error("Your browser doesn't support audio playback.");
        return false;
      }
      
      // Check storage support
      if (!window.localStorage) {
        console.error("Your browser doesn't support local storage which is needed for saving recordings.");
        return false;
      }
      
      return true;
    };
    
    // Check speech synthesis
    if (!window.speechSynthesis) {
      console.error("Your browser doesn't support speech synthesis. Try a different browser like Chrome or Edge.");
    }
    
    checkAudioSupport();
  }, []);

  // Handler to ensure word completion properly advances to the next word
  const handleWordComplete = (correct: boolean, penalty: number = 0) => {
    console.log("PracticeView: Word completed, correct:", correct, "penalty:", penalty);
    onWordComplete(correct, penalty);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="outline" 
          onClick={onBackToWordList}
          className="bg-white hover:bg-blue-50 shadow-sm"
        >
          <ArrowLeft className="mr-1" size={16} />
          Back to Word List
        </Button>
        <h2 className="text-xl font-semibold text-center">
          {currentList?.name}
        </h2>
        <div className="text-lg font-medium text-purple-600">
          Score: {currentScore.toFixed(1)}/{currentList?.words.length}
        </div>
      </div>
      
      <SpellingPractice
        word={currentWord}
        onComplete={handleWordComplete}
        onNavigate={onNavigateWord}
        onEndSession={onEndSession}
        currentWordIndex={currentWordIndex}
        totalWords={currentList.words.length}
      />
    </div>
  );
};

export default PracticeView;
