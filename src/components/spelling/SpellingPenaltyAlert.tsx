
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface SpellingPenaltyAlertProps {
  penalty: number;
  visible?: boolean;
}

// Component is still defined but will be hidden by default
const SpellingPenaltyAlert = ({ penalty, visible = false }: SpellingPenaltyAlertProps) => {
  if (!visible) return null;
  
  const penaltyPercentage = Math.round(penalty * 100);
  
  return (
    <Alert className="bg-amber-50 border-amber-200 mb-2">
      <AlertTitle className="text-amber-800 text-xs">Current Penalty: {penalty.toFixed(1)} points ({penaltyPercentage}%)</AlertTitle>
      <AlertDescription className="text-amber-700 text-xs">
        {penaltyPercentage > 0 ? `You'll earn ${100 - penaltyPercentage}% of the points for this word.` : 'You\'ll earn full points for this word.'}
      </AlertDescription>
    </Alert>
  );
};

export default SpellingPenaltyAlert;
