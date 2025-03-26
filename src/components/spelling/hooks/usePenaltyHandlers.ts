
import { Dispatch, SetStateAction } from 'react';

export const usePenaltyHandlers = (
  attempts: number,
  setAttempts: Dispatch<SetStateAction<number>>,
  setPenalty: Dispatch<SetStateAction<number>>
) => {
  const incrementAttempts = () => {
    setAttempts(prev => prev + 1);
  };

  // Still calculate the penalty in the background for scoring purposes
  // but we won't display it in the UI
  const applyPenaltyIfNeeded = () => {
    if (attempts >= 1) {
      setPenalty(prev => Math.min(prev + 0.25, 0.5));
    }
  };

  const incrementAttemptsWithPenalty = () => {
    incrementAttempts();
    applyPenaltyIfNeeded();
  };

  return {
    incrementAttempts,
    applyPenaltyIfNeeded,
    incrementAttemptsWithPenalty
  };
};
