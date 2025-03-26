
import React from 'react';
import { Card } from "@/components/ui/card";
import { Word } from '@/types/word';
import { SpellingProvider } from './SpellingProvider';
import SpellingControls from './SpellingControls';
import SpellingContent from './SpellingContent';
import { getStageColor } from './utils/stageUtils';
import { useSpellingContext } from './context/SpellingContext';

interface SpellingPracticeProps {
  word: Word;
  onComplete: (correct: boolean, penalty?: number) => void;
  onNavigate?: (direction: 'next' | 'prev') => void;
  onEndSession?: () => void;
  currentWordIndex: number;
  totalWords: number;
}

// This is a wrapper component that gets the context values and applies them to the card
const SpellingCard = () => {
  const { displayMode, isCorrect } = useSpellingContext();
  
  return (
    <Card className={`p-6 max-w-md mx-auto relative overflow-hidden rounded-xl border-2 shadow-lg ${getStageColor(displayMode)} ${isCorrect ? 'ring-4 ring-green-400 ring-opacity-50' : ''}`}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <SpellingControls />
        </div>
        <SpellingContent />
      </div>
    </Card>
  );
};

// This is the main component that sets up the context provider
const SpellingPractice = ({ 
  word, 
  onComplete, 
  onNavigate, 
  onEndSession,
  currentWordIndex, 
  totalWords 
}: SpellingPracticeProps) => {
  return (
    <SpellingProvider
      word={word}
      onComplete={onComplete}
      onNavigate={onNavigate}
      onEndSession={onEndSession}
      currentWordIndex={currentWordIndex}
      totalWords={totalWords}
    >
      <SpellingCard />
    </SpellingProvider>
  );
};

export default SpellingPractice;
