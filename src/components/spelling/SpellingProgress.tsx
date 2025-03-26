import React, { useEffect, useRef } from 'react';
import { Progress } from "@/components/ui/progress";
import { Timer, AlertCircle, Star, Sparkles } from 'lucide-react';

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
    // If time jumps by more than 5 seconds, it's likely a word change
    // Briefly disable animations to prevent visual glitches
    if (Math.abs(prevTimeRef.current - timeRemaining) > 5) {
      animationEnabledRef.current = false;
      const timer = setTimeout(() => {
        animationEnabledRef.current = true;
      }, 100);
      return () => clearTimeout(timer);
    }
    prevTimeRef.current = timeRemaining;
  }, [timeRemaining]);

  const getTimerFace = () => {
    if (timeRemaining <= 5) return '😮';
    if (timeRemaining <= 15) return '😃';
    return '😎';
  };

  return (
    <div className="space-y-1.5">
      {/* Fixed-width container that never changes size */}
      <div className="relative w-full h-6 rounded-full overflow-hidden shadow-sm">
        {/* Static background - always full width */}
        <div className="absolute inset-0 w-full h-full transition-colors duration-300 rounded-full bg-gradient-to-r" 
          style={{ 
            backgroundImage: timeRemaining <= 5 
              ? 'linear-gradient(to right, #FDF2F8, #FCE7F3)' 
              : timeRemaining <= 15 
                ? 'linear-gradient(to right, #FFFBEB, #FEF3C7)' 
                : 'linear-gradient(to right, #ECFDF5, #D1FAE5)'
          }}>
        </div>
        
        {/* Dynamic progress bar that changes width based on time */}
        <div 
          className="absolute top-0 left-0 h-full transition-all duration-300 rounded-full bg-gradient-to-r"
          style={{
            width: `${Math.max((timeRemaining/30)*100, 0)}%`,
            backgroundImage: timeRemaining <= 5 
              ? 'linear-gradient(to right, #F9A8D4, #EC4899)' 
              : timeRemaining <= 15 
                ? 'linear-gradient(to right, #FCD34D, #F59E0B)' 
                : 'linear-gradient(to right, #34D399, #10B981)'
          }}
        >
          {/* Pulse animation only when time is running low */}
          {timeRemaining <= 10 && (
            <div className="absolute inset-0 bg-opacity-75 animate-pulse"></div>
          )}
        </div>
        
        {/* Stars that float up as time passes (decorative) */}
        {timeRemaining <= 20 && timeRemaining > 15 && (
          <Star className="absolute top-0.5 right-1/4 w-4 h-4 text-yellow-300 animate-float" />
        )}
        {timeRemaining <= 15 && timeRemaining > 10 && (
          <Star className="absolute top-0.5 right-1/3 w-4 h-4 text-yellow-400 animate-float" style={{animationDelay: '0.3s'}} />
        )}
        {timeRemaining <= 10 && timeRemaining > 5 && (
          <Sparkles className="absolute top-0.5 right-1/2 w-4 h-4 text-amber-400 animate-float" style={{animationDelay: '0.5s'}} />
        )}
      </div>
      
      <div className="flex justify-between items-center px-1">
        <div className="text-center text-xs font-medium text-gray-700 flex items-center gap-1.5">
          <div className={`flex items-center justify-center w-6 h-6 rounded-full ${timeRemaining <= 5 ? 'bg-pink-200' : timeRemaining <= 15 ? 'bg-amber-200' : 'bg-emerald-100'} transition-colors duration-300`}>
            {timeRemaining <= 10 ? (
              <Sparkles className={`h-3.5 w-3.5 ${timeRemaining <= 5 ? "text-pink-500" : "text-amber-500"}`} />
            ) : (
              <Timer className="h-3.5 w-3.5 text-emerald-500" />
            )}
          </div>
          <div className="flex items-center">
            <span className={`text-base font-bold ${timeRemaining <= 5 ? "text-pink-500" : timeRemaining <= 15 ? "text-amber-500" : "text-emerald-500"} transition-colors duration-300`}>
              {timeRemaining}
            </span>
            <span className="ml-1 text-gray-600 text-xs"> sec {getTimerFace()}</span>
          </div>
        </div>
        
        {showWarning && (
          <div className="text-pink-500 text-xs font-bold flex items-center gap-1 bg-pink-100 px-2 py-0.5 rounded-full shadow-sm animate-bounce">
            <AlertCircle className="h-3 w-3" /> Hurry!
          </div>
        )}
      </div>
    </div>
  );
};

export default SpellingProgress;
