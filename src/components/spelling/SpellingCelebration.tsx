
import React from 'react';
import { Star } from 'lucide-react';

const SpellingCelebration = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/30 backdrop-blur-sm">
      <div className="animate-celebration">
        <div className="flex flex-col items-center">
          <div className="flex gap-2">
            <Star className="w-16 h-16 text-yellow-400 animate-float" />
            <Star className="w-12 h-12 text-amber-400 animate-float" style={{animationDelay: '0.2s'}} />
            <Star className="w-14 h-14 text-orange-400 animate-float" style={{animationDelay: '0.4s'}} />
          </div>
          <p className="text-2xl font-bold text-purple-700 mt-4 animate-bounce">
            Amazing Job! 🎉
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpellingCelebration;
