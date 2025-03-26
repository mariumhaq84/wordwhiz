import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, X } from 'lucide-react';

interface RecordingHeaderProps {
  onClose: () => void;
}

const RecordingHeader: React.FC<RecordingHeaderProps> = ({ onClose }) => {
  return (
    <div className="mb-4 flex items-center justify-between relative">
      <div className="text-xl font-semibold flex items-center">
        <Mic className="h-5 w-5 mr-2 text-purple-600" />
        <span>Record Pronunciations</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="h-8 w-8 rounded-full bg-red-100 shadow-md flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-200 transition-colors absolute top-0 right-0"
        aria-label="Close Recording Panel"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default RecordingHeader;
