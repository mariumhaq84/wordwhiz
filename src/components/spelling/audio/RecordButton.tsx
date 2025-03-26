
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, StopCircle } from 'lucide-react';

interface RecordButtonProps {
  isRecording: boolean;
  recordingTime: number;
  maxRecordingTime: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  compactMode?: boolean;
}

const RecordButton: React.FC<RecordButtonProps> = ({
  isRecording,
  recordingTime,
  maxRecordingTime,
  onStartRecording,
  onStopRecording,
  compactMode = false
}) => {
  if (compactMode) {
    if (isRecording) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={onStopRecording}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 animate-pulse"
        >
          <StopCircle className="h-4 w-4 mr-1" />
          <span className="text-xs">{maxRecordingTime - recordingTime}s</span>
        </Button>
      );
    }
    
    return null;
  }

  return (
    <>
      {isRecording ? (
        <Button
          variant="destructive"
          size="lg"
          onClick={onStopRecording}
          className="animate-pulse"
        >
          <StopCircle className="h-5 w-5 mr-2" />
          Recording... ({recordingTime}s)
        </Button>
      ) : (
        <Button
          variant="outline"
          size="lg"
          onClick={onStartRecording}
          disabled={isRecording}
        >
          <Mic className="h-5 w-5 mr-2" />
          Start Recording
        </Button>
      )}
    </>
  );
};

export default RecordButton;
