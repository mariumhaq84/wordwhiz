import React, { useEffect, useRef } from 'react';
import { Star } from 'lucide-react';

interface SpellingProgressProps {
  timeRemaining: number;
  showWarning: boolean;
}

const SpellingProgress = ({ timeRemaining, showWarning }: SpellingProgressProps) => {
  // Refs to track previous time value for animation control
  const prevTimeRef = useRef(timeRemaining);
  const animationEnabledRef = useRef(true);
  
  // Detect word changes that cause timer jumps
  useEffect(() => {
    if (Math.abs(prevTimeRef.current - timeRemaining) > 5) {
      animationEnabledRef.current = false;
      const timer = setTimeout(() => {
        animationEnabledRef.current = true;
      }, 100);
      return () => clearTimeout(timer);
    }
    prevTimeRef.current = timeRemaining;
  }, [timeRemaining]);

  // Calculate progress percentage (30 seconds total)
  const progressPercentage = Math.max((timeRemaining / 30) * 100, 0);
  
  // Get emoji based on time remaining
  const getEmoji = () => {
    if (timeRemaining <= 5) return '🚀';
    if (timeRemaining <= 10) return '⏱️';
    if (timeRemaining <= 20) return '🌟';
    return '✨';
  };

  // Get color scheme based on time remaining
  const getColorScheme = () => {
    if (timeRemaining <= 5) {
      return {
        bg: 'bg-pink-100',
        text: 'text-pink-500',
        progress: '#FE4A75',
        border: 'border-pink-200'
      };
    } else if (timeRemaining <= 15) {
      return {
        bg: 'bg-amber-100',
        text: 'text-amber-500',
        progress: '#F59E0B',
        border: 'border-amber-200'
      };
    } else {
      return {
        bg: 'bg-emerald-100',
        text: 'text-emerald-500',
        progress: '#10B981',
        border: 'border-emerald-200'
      };
    }
  };

  const colors = getColorScheme();

  return (
    <div className="flex items-center justify-center mt-3 gap-2 max-w-xs mx-auto">
      {/* Compact timer with integrated progress */}
      <div className={`relative flex items-center gap-1.5 ${colors.bg} rounded-full px-4 py-1.5 shadow-md ${colors.border} border-2`}>
        {/* Progress bar underneath */}
        <div 
          className="absolute left-0 top-0 bottom-0 rounded-full opacity-40 transition-all duration-300"
          style={{
            width: `${progressPercentage}%`,
            backgroundColor: colors.progress,
            zIndex: 0
          }}
        />
        
        {/* Timer content */}
        <div className="flex items-center gap-2 z-10">
          <span className={`text-lg font-bold ${colors.text}`}>{timeRemaining}</span>
          <span className="text-base">{getEmoji()}</span>
        </div>

        {/* Decorative elements */}
        {timeRemaining > 20 && (
          <Star className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400 animate-pulse" />
        )}
        {timeRemaining > 15 && (
          <Star className="absolute -bottom-1 -right-1 h-3 w-3 text-yellow-400 animate-pulse" style={{animationDelay: '0.5s'}} />
        )}
      </div>
    </div>
  );
};

export default SpellingProgress;
