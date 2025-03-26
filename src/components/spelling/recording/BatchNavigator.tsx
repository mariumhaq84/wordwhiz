
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface BatchNavigatorProps {
  currentBatch: number;
  totalBatches: number;
  onBatchChange: (direction: 'next' | 'prev') => void;
}

const BatchNavigator: React.FC<BatchNavigatorProps> = ({
  currentBatch,
  totalBatches,
  onBatchChange
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="text-sm text-gray-600">
        Batch {currentBatch + 1} of {totalBatches}
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBatchChange('prev')}
          disabled={currentBatch === 0}
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBatchChange('next')}
          disabled={currentBatch === totalBatches - 1}
        >
          Next
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default BatchNavigator;
