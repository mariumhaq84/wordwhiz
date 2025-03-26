
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface WordNavigatorProps {
  currentWordIndex: number;
  totalWordCount: number;
  currentScore: number; // We'll keep this prop but not display it
  onNavigateWord: (direction: 'next' | 'prev') => void;
}

const WordNavigator = ({
  currentWordIndex,
  totalWordCount,
  onNavigateWord
}: WordNavigatorProps) => {
  return (
    <div className="flex justify-center mb-0">
      <div className="bg-gradient-to-r from-cyan-200 to-blue-300 px-3 py-0.5 rounded-full flex items-center shadow-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigateWord('prev')}
          disabled={currentWordIndex === 0}
          className="h-4 w-4 mr-1 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-3 w-3" />
          <span className="sr-only">Previous</span>
        </Button>
        <div className="text-xs font-bold text-blue-800 font-comic">
          Word {currentWordIndex + 1} of {totalWordCount}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigateWord('next')}
          disabled={currentWordIndex === totalWordCount - 1}
          className="h-4 w-4 ml-1 text-blue-600 hover:text-blue-800"
        >
          <ArrowRight className="h-3 w-3" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
    </div>
  );
};

export default WordNavigator;
