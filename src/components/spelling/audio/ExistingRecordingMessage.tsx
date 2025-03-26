
import React from 'react';

interface ExistingRecordingMessageProps {
  existingRecording: 'exists' | string | undefined;
  audioURL: string | null;
}

const ExistingRecordingMessage: React.FC<ExistingRecordingMessageProps> = ({ 
  existingRecording, 
  audioURL 
}) => {
  if (existingRecording === 'exists' && !audioURL) {
    return (
      <div className="text-sm text-gray-500 text-center">
        You already have a recording for this word. Record again to update it.
      </div>
    );
  }
  
  return null;
};

export default ExistingRecordingMessage;
