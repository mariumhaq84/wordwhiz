
import React from 'react';
import { Button } from "@/components/ui/button";
import { MicOff, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface RecordingActionsProps {
  recordingsCount: number;
  totalWordsCount: number;
  onClearAllRecordings: () => void;
  onClose: () => void;
}

const RecordingActions: React.FC<RecordingActionsProps> = ({
  recordingsCount,
  totalWordsCount,
  onClearAllRecordings,
  onClose
}) => {
  const handleClearRecordings = () => {
    if (confirm("Are you sure you want to delete all recordings?")) {
      onClearAllRecordings();
      toast.success("All recordings have been deleted");
    }
  };

  return (
    <div className="mt-4 flex justify-between">
      <Button
        variant="outline"
        size="sm"
        className="text-red-500 hover:bg-red-50"
        onClick={handleClearRecordings}
      >
        <MicOff className="h-4 w-4 mr-1" />
        Delete All Recordings
      </Button>
      
      <div className="text-xs text-gray-500">
        {recordingsCount} of {totalWordsCount} words recorded
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onClose}
      >
        <Save className="h-4 w-4 mr-1" />
        Save & Close
      </Button>
    </div>
  );
};

export default RecordingActions;
