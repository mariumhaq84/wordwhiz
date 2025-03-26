
import { SessionResult } from '@/types/session';

export const loadSessionResults = (): SessionResult[] => {
  const savedResults = localStorage.getItem('spellingWizResults');
  if (savedResults) {
    try {
      return JSON.parse(savedResults);
    } catch (e) {
      console.error('Failed to parse saved results:', e);
      return [];
    }
  }
  return [];
};

export const saveSessionResults = (results: SessionResult[]): void => {
  if (results.length > 0) {
    localStorage.setItem('spellingWizResults', JSON.stringify(results));
  }
};

export const clearSessionResults = (): void => {
  localStorage.removeItem('spellingWizResults');
};
