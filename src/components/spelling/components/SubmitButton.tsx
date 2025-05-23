
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, Star, Sparkles, PartyPopper, Gift } from 'lucide-react';

interface SubmitButtonProps {
  isCorrect: boolean;
  isRTL: boolean;
  colorScheme?: 'green' | 'amber'; // For different color schemes
}

const SubmitButton = ({ isCorrect, isRTL, colorScheme = 'green' }: SubmitButtonProps) => {
  const colorClasses = colorScheme === 'amber' 
    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-amber-700'
    : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 border-emerald-700';
  
  const correctColorClasses = colorScheme === 'amber'
    ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 border-green-700'
    : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 border-green-700';
  
  const particleColor = colorScheme === 'amber' ? 'text-yellow-100' : 'text-green-100';

  return (
    <Button 
      type="submit" 
      className={`w-full text-base py-3 relative kid-friendly
        ${isCorrect ? correctColorClasses : colorClasses} 
        transition-all shadow-lg rounded-xl border-b-3 active:border-b-0 active:mt-1 active:mb-[-1px]`}
      disabled={isCorrect}
    >
      {isCorrect ? (
        <span className={`flex items-center gap-1 ${isRTL ? 'font-urdu text-lg' : ''}`}>
          <PartyPopper className="h-5 w-5 animate-wiggle" /> 
          {isRTL ? "صحیح!" : "Correct!"}
          <Gift className="h-5 w-5 animate-bounce" />
        </span>
      ) : (
        <span className="flex items-center justify-center gap-1 z-10">
          <Sparkles className={`h-5 w-5 ${particleColor} animate-pulse`} />
          <span className={`font-bold ${isRTL ? 'font-urdu text-lg' : ''}`}>
            {isRTL ? "میرا جواب چیک کریں!" : "Check My Answer!"}
          </span>
          <Star className={`h-5 w-5 ${particleColor} animate-pulse`} />
        </span>
      )}
      <div className="absolute inset-0 rounded-xl bg-white/10 pointer-events-none"></div>
    </Button>
  );
};

export default SubmitButton;
