import React from 'react';
import { Card } from "@/components/ui/card";
import { Word } from '@/types/word';
import { SpellingProvider } from './SpellingProvider';
import SpellingControls from './SpellingControls';
import SpellingContent from './SpellingContent';
import { getStageColor } from './utils/stageUtils';
import { useSpellingContext } from './context/SpellingContext';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SpellingPracticeProps {
  word: Word;
  onComplete: (correct: boolean, penalty?: number) => void;
  onNavigate?: (direction: 'next' | 'prev') => void;
  onEndSession?: () => void;
  currentWordIndex: number;
  totalWords: number;
}

// This is a wrapper component that gets the context values and applies them to the card
const SpellingCard = ({ onEndSession }: { onEndSession?: () => void }) => {
  const { displayMode, isCorrect } = useSpellingContext();
  
  // Get stage-specific decorative elements
  const getStageGradient = () => {
    if (displayMode === 'full') return 'from-blue-50 via-white to-blue-50';
    if (displayMode === 'partial') return 'from-amber-50 via-white to-amber-50';
    return 'from-emerald-50 via-white to-emerald-50';
  };
  
  return (
    <Card className={`p-4 max-w-md mx-auto relative overflow-hidden rounded-xl border-2 shadow-lg ${getStageColor(displayMode)} bg-gradient-to-br ${getStageGradient()} ${isCorrect ? 'ring-4 ring-green-400 ring-opacity-50 animate-pop' : ''}`}>
      {/* Close button positioned in the top-right corner of the card */}
      {onEndSession && (
        <div className="absolute top-2 right-2 z-10">
          <Button 
            className="h-7 w-7 rounded-full bg-red-100 shadow-md flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-200 transition-colors"
            onClick={onEndSession}
            aria-label="End Session"
            variant="ghost"
            size="icon"
          >
            <X size={14} />
          </Button>
        </div>
      )}
      
      <div className="space-y-3 relative">
        <SpellingControls />
        <SpellingContent />
      </div>
    </Card>
  );
};

// This is the main component that sets up the context provider
const SpellingPractice: React.FC<SpellingPracticeProps> = ({
  word,
  onComplete,
  onNavigate,
  onEndSession,
  currentWordIndex,
  totalWords
}) => {
  return (
    <SpellingProvider 
      word={word} 
      onComplete={onComplete}
      onNavigate={onNavigate}
      currentWordIndex={currentWordIndex}
      totalWords={totalWords}
    >
      <SpellingCard onEndSession={onEndSession} />
    </SpellingProvider>
  );
};

export default SpellingPractice;
