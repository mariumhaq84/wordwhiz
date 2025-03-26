
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, X } from 'lucide-react';

interface RecordingHeaderProps {
  onClose: () => void;
}

const RecordingHeader: React.FC<RecordingHeaderProps> = ({ onClose }) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="text-xl font-semibold flex items-center">
        <Mic className="h-5 w-5 mr-2 text-purple-600" />
        <span>Record Pronunciations</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="text-gray-500"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default RecordingHeader;
