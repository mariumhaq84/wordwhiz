
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Word } from '@/types/word';
import RecordingHeader from './recording/RecordingHeader';
import BatchNavigator from './recording/BatchNavigator';
import RecordingsList from './recording/RecordingsList';
import RecordingActions from './recording/RecordingActions';
import { toast } from 'sonner';

interface RecordingManagerProps {
  words: Word[];
  onClose: () => void;
  className?: string;
}

const RecordingManager: React.FC<RecordingManagerProps> = ({ words, onClose, className = "" }) => {
  const [currentBatch, setCurrentBatch] = useState<Word[]>([]);
  const [batchIndex, setBatchIndex] = useState(0);
  const [recordings, setRecordings] = useState<Map<string, string>>(new Map());
  const batchSize = 10;
  
  // Total number of batches
  const totalBatches = Math.ceil(words.length / batchSize);
  
  // Load any existing recordings from localStorage
  useEffect(() => {
    loadRecordings();
    
    // Add listener for storage events from other components
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'wordRecordings' || event.key === null) {
      loadRecordings();
    }
  };
  
  const loadRecordings = () => {
    const savedRecordings = localStorage.getItem('wordRecordings');
    if (savedRecordings) {
      try {
        const parsed = JSON.parse(savedRecordings);
        // Fix: Explicitly cast or ensure values are strings when creating the Map
        const recordingsMap = new Map<string, string>();
        
        console.log("RecordingManager: Loading recordings with keys:", Object.keys(parsed).join(", "));
        
        // Iterate through the parsed object to ensure proper typing
        Object.entries(parsed).forEach(([key, value]) => {
          if (typeof value === 'string') {
            recordingsMap.set(key, value);
          } else {
            console.warn(`Skipping non-string recording value for word: ${key}`);
          }
        });
        
        setRecordings(recordingsMap);
        console.log("RecordingManager: Loaded recordings map with size:", recordingsMap.size);
      } catch (error) {
        console.error("Error loading saved recordings:", error);
      }
    } else {
      // If no recordings exist, reset the map
      setRecordings(new Map());
    }
  };
  
  // Update current batch when batchIndex changes
  useEffect(() => {
    const start = batchIndex * batchSize;
    const end = Math.min(start + batchSize, words.length);
    setCurrentBatch(words.slice(start, end));
  }, [batchIndex, words]);
  
  const handleRecordingComplete = (wordId: string, audioBlob: Blob) => {
    // Log which word ID is being recorded
    console.log(`RecordingManager: Recording completed for word ID: ${wordId}`);
    
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Update recordings map with the specific word ID
    setRecordings(prev => {
      const newMap = new Map(prev);
      newMap.set(wordId, audioUrl);
      return newMap;
    });
    
    // Save to localStorage (save the blob as base64) with the specific word ID
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const base64data = reader.result;
        
        // Load existing recordings
        const savedRecordings = localStorage.getItem('wordRecordings') || '{}';
        try {
          const recordingsObj = JSON.parse(savedRecordings);
          
          // Add the new recording with the correct word ID
          recordingsObj[wordId] = base64data;
          
          // Save back to localStorage
          localStorage.setItem('wordRecordings', JSON.stringify(recordingsObj));
          console.log(`RecordingManager: Saved recording for word ID: ${wordId}`);
          console.log(`RecordingManager: All recordings now: ${Object.keys(recordingsObj).join(', ')}`);
          
          // Notify other components about the change
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'wordRecordings'
          }));
        } catch (error) {
          console.error("Error saving recording:", error);
          toast.error("Failed to save recording");
        }
      } else {
        console.error("Error: FileReader result is not a string");
      }
    };
  };
  
  const handleBatchChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && batchIndex < totalBatches - 1) {
      setBatchIndex(prev => prev + 1);
    } else if (direction === 'prev' && batchIndex > 0) {
      setBatchIndex(prev => prev - 1);
    }
  };
  
  const clearAllRecordings = () => {
    setRecordings(new Map());
    localStorage.removeItem('wordRecordings');
    toast.success("All recordings have been reset");
    
    // Dispatch storage event to notify other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'wordRecordings'
    }));
  };
  
  return (
    <Card className={`p-4 ${className} shadow-lg`}>
      <RecordingHeader onClose={onClose} />
      
      <BatchNavigator 
        currentBatch={batchIndex} 
        totalBatches={totalBatches} 
        onBatchChange={handleBatchChange} 
      />
      
      <RecordingsList 
        words={currentBatch} 
        recordings={recordings} 
        onRecordingComplete={handleRecordingComplete} 
      />
      
      <RecordingActions 
        recordingsCount={recordings.size} 
        totalWordsCount={words.length} 
        onClearAllRecordings={clearAllRecordings} 
        onClose={onClose} 
      />
    </Card>
  );
};

export default RecordingManager;
