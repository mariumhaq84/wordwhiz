
import { useState, useEffect } from 'react';
import { WordList, Language } from '@/types/word';
import { WordAttempt, SessionResult } from '@/types/session';
import { useSpellingActions } from './useSpellingActions';
import { loadSessionResults, saveSessionResults } from '@/utils/sessionStorage';

// Change this line to use 'export type' for re-exporting types
export type { WordAttempt, SessionResult } from '@/types/session';

export function useSpellingSession() {
  // State management
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [currentList, setCurrentList] = useState<WordList | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [mistakeWords, setMistakeWords] = useState<string[]>([]);
  const [showDashboard, setShowDashboard] = useState(false);
  const [wordAttempts, setWordAttempts] = useState<Map<number, WordAttempt>>(new Map());

  // Load session results from localStorage on initial render
  useEffect(() => {
    setSessionResults(loadSessionResults());
  }, []);

  // Save session results to localStorage whenever they change
  useEffect(() => {
    if (sessionResults.length > 0) {
      saveSessionResults(sessionResults);
    }
  }, [sessionResults]);

  // Get all actions from the useSpellingActions hook
  const actions = useSpellingActions(
    { 
      selectedLanguage, 
      wordLists, 
      currentList, 
      currentWordIndex, 
      sessionResults, 
      currentScore, 
      mistakeWords, 
      showDashboard, 
      wordAttempts 
    },
    {
      setSelectedLanguage,
      setWordLists,
      setCurrentList,
      setCurrentWordIndex,
      setSessionResults,
      setCurrentScore,
      setMistakeWords,
      setShowDashboard,
      setWordAttempts
    }
  );

  return {
    // State
    selectedLanguage,
    wordLists,
    currentList,
    currentWordIndex,
    sessionResults,
    currentScore,
    mistakeWords,
    showDashboard,
    
    // Actions from useSpellingActions
    ...actions,
    
    // Allow direct state setters to be exported for components that need them
    setShowDashboard,
    setWordLists,
    setCurrentList
  };
}
