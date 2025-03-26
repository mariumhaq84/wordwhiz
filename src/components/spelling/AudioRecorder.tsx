
import React, { useEffect, useState } from 'react';
import { useAudioRecorder } from './audio/useAudioRecorder';
import RecordButton from './audio/RecordButton';
import PlaybackButton from './audio/PlaybackButton';
import ExistingRecordingMessage from './audio/ExistingRecordingMessage';

interface AudioRecorderProps {
  word: string;
  wordId: string;
  onRecordingComplete: (wordId: string, blob: Blob) => void;
  onCancel?: () => void;
  existingRecording?: 'exists' | string;
  maxRecordingTime?: number;
  compactMode?: boolean;
  autoStart?: boolean;
  hasRecording?: boolean; // Add the missing property
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  word, 
  wordId, 
  onRecordingComplete, 
  onCancel,
  existingRecording,
  maxRecordingTime = 30,
  compactMode = false,
  autoStart = false,
  hasRecording = false
}) => {
  const [wordIdChanged, setWordIdChanged] = useState(false);
  
  // Track when wordId changes to ensure proper recording association
  useEffect(() => {
    setWordIdChanged(true);
    const timer = setTimeout(() => setWordIdChanged(false), 300);
    return () => clearTimeout(timer);
  }, [wordId]);
  
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
    maxRecordingTime,
    onRecordingComplete,
    wordId,
    autoStart // Pass through the autoStart prop, defaults to false
  });

  const handleReset = () => {
    reset();
    if (onCancel) onCancel();
  };
  
  if (compactMode) {
    return (
      <div className="flex items-center gap-2">
        {isRecording ? (
          <RecordButton
            isRecording={isRecording}
            recordingTime={recordingTime}
            maxRecordingTime={maxRecordingTime}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            compactMode={true}
          />
        ) : (
          audioURL ? (
            <PlaybackButton
              audioURL={audioURL}
              playingAudio={playingAudio}
              onPlayAudio={playAudio}
              onReset={handleReset}
              compactMode={true}
              wordId={wordId}
            />
          ) : null
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Record Your Pronunciation</h3>
      <p>Click the button below to record your pronunciation of the word. It will record for up to {maxRecordingTime} seconds.</p>
      <p className="text-sm font-medium">{word} (ID: {wordId})</p>
      
      <div className="flex items-center justify-center space-x-4">
        <RecordButton
          isRecording={isRecording}
          recordingTime={recordingTime}
          maxRecordingTime={maxRecordingTime}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
        />
        
        {audioURL && (
          <PlaybackButton
            audioURL={audioURL}
            playingAudio={playingAudio}
            onPlayAudio={playAudio}
            wordId={wordId}
          />
        )}
      </div>
      
      {audioURL && (
        <PlaybackButton
          audioURL={audioURL}
          playingAudio={playingAudio}
          onPlayAudio={playAudio}
          onReset={handleReset}
          wordId={wordId}
        />
      )}
      
      <ExistingRecordingMessage
        existingRecording={existingRecording}
        audioURL={audioURL}
      />
    </div>
  );
};

export default AudioRecorder;
