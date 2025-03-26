
import { useState, useEffect } from 'react';

export const useRecordingManager = () => {
  const [userRecordings, setUserRecordings] = useState<Map<string, string>>(new Map());

  const loadUserRecordings = () => {
    const savedRecordings = localStorage.getItem('wordRecordings');
    if (savedRecordings) {
      try {
        const parsed = JSON.parse(savedRecordings);
        const recordingsMap = new Map<string, string>();
        
        console.log("Loading recordings, available word IDs:", Object.keys(parsed).join(", "));
        
        Object.entries(parsed).forEach(([key, value]) => {
          if (typeof value === 'string') {
            // Ensure we're using word ID as the key, not word text
            recordingsMap.set(key, value);
          } else {
            console.warn(`Skipping non-string recording value for word ID: ${key}`);
          }
        });
        setUserRecordings(recordingsMap);
        console.log(`useRecordingManager: Loaded ${recordingsMap.size} user recordings`);
      } catch (error) {
        console.error("Error loading recordings:", error);
      }
    } else {
      setUserRecordings(new Map());
    }
  };

  // This function will ensure recordings are properly stored
  const saveUserRecording = (wordId: string, recording: string) => {
    try {
      const savedRecordings = localStorage.getItem('wordRecordings') || '{}';
      const recordings = JSON.parse(savedRecordings);
      
      // Add the recording with the word ID as the key
      recordings[wordId] = recording;
      
      // Save back to localStorage
      localStorage.setItem('wordRecordings', JSON.stringify(recordings));
      
      // Update the state
      setUserRecordings(prevRecordings => {
        const newRecordings = new Map(prevRecordings);
        newRecordings.set(wordId, recording);
        return newRecordings;
      });
      
      console.log(`useRecordingManager: Saved recording for word ID: ${wordId}`);
      
      // Dispatch storage event to notify other components
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'wordRecordings'
      }));
    } catch (error) {
      console.error('Error saving user recording:', error);
    }
  };

  useEffect(() => {
    loadUserRecordings();
    
    // Listen for storage events (when recordings are updated by other components)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'wordRecordings' || event.key === null) {
        loadUserRecordings();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    userRecordings,
    loadUserRecordings,
    saveUserRecording
  };
};
