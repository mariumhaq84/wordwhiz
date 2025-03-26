
import React, { useEffect, useState } from 'react';
import AudioRecorder from '../AudioRecorder';
import { Word } from '@/types/word';

interface RecordingsListProps {
  words: Word[];
  recordings: Map<string, string>;
  onRecordingComplete: (wordId: string, audioBlob: Blob) => void;
}

const RecordingsList: React.FC<RecordingsListProps> = ({
  words,
  recordings,
  onRecordingComplete
}) => {
  const [wordRecordings, setWordRecordings] = useState<{ [key: string]: boolean }>({});
  
  // Load recordings and create a mapping of word ID to whether it has a recording
  useEffect(() => {
    const recordingsMap: { [key: string]: boolean } = {};
    
    // Log all words and their IDs
    console.log("RecordingsList words:", words.map(w => `${w.text} (${w.id})`).join(', '));
    console.log("Available recordings:", Array.from(recordings.keys()).join(', '));
    
    // Populate the recordingsMap
    words.forEach(word => {
      recordingsMap[word.id] = recordings.has(word.id);
    });
    
    setWordRecordings(recordingsMap);
  }, [words, recordings]);
  
  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto p-2 bg-white/50 rounded-lg">
      {words.map(word => {
        // Explicitly use word.id as the key for recordings
        const hasRecording = recordings.has(word.id);
        
        return (
          <div key={word.id} className="p-2 bg-white/80 rounded-md">
            <div className="text-sm font-medium mb-1 flex justify-between">
              <span>{word.text}</span>
              <span className="text-xs text-gray-500">ID: {word.id.substring(0, 6)}...</span>
            </div>
            <AudioRecorder
              key={word.id}
              word={word.text}
              wordId={word.id}
              onRecordingComplete={onRecordingComplete}
              existingRecording={recordings.get(word.id)}
              hasRecording={hasRecording}
              compactMode={true}
            />
          </div>
        );
      })}
    </div>
  );
};

export default RecordingsList;
