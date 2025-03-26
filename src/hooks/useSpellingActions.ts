
import { WordList, Language } from '@/types/word';
import { WordAttempt, SessionResult, SpellingSessionState } from '@/types/session';
import { prioritizeWeakWords } from '@/utils/wordPriority';
import { saveSessionResults } from '@/utils/sessionStorage';
import { useToast } from './use-toast';

export function useSpellingActions(
  state: SpellingSessionState, 
  setState: {
    setSelectedLanguage: React.Dispatch<React.SetStateAction<Language | null>>;
    setWordLists: React.Dispatch<React.SetStateAction<WordList[]>>;
    setCurrentList: React.Dispatch<React.SetStateAction<WordList | null>>;
    setCurrentWordIndex: React.Dispatch<React.SetStateAction<number>>;
    setSessionResults: React.Dispatch<React.SetStateAction<SessionResult[]>>;
    setCurrentScore: React.Dispatch<React.SetStateAction<number>>;
    setMistakeWords: React.Dispatch<React.SetStateAction<string[]>>;
    setShowDashboard: React.Dispatch<React.SetStateAction<boolean>>;
    setWordAttempts: React.Dispatch<React.SetStateAction<Map<number, WordAttempt>>>;
  }
) {
  const { toast } = useToast();
  
  const handleLanguageSelect = (language: Language) => {
    setState.setSelectedLanguage(language);
    setState.setWordLists([]);
  };

  const handleUpload = (list: WordList) => {
    setState.setWordLists([list]);
  };

  const handleStartPractice = (list: WordList) => {
    setState.setCurrentScore(0);
    setState.setMistakeWords([]);
    setState.setWordAttempts(new Map());
    
    const prioritizedList = prioritizeWeakWords(list, state.sessionResults);
    setState.setCurrentList(prioritizedList);
    setState.setCurrentWordIndex(0);
  };

  const handleWordComplete = (correct: boolean, penalty: number = 0) => {
    if (!state.currentList) return;

    console.log("useSpellingActions: handleWordComplete called - correct:", correct, "penalty:", penalty);
    
    // Get current attempt data for this word
    const currentAttempt = state.wordAttempts.get(state.currentWordIndex) || { 
      completed: false, 
      attempts: 0, 
      penalty: 0 
    };
    
    if (correct) {
      console.log("Word was correct, updating score and attempts");
      // Only award points if this word hasn't been completed before
      if (!currentAttempt.completed) {
        const earnedPoints = 1 - Math.max(currentAttempt.penalty, penalty);
        setState.setCurrentScore(prev => prev + earnedPoints);
        
        // Add to mistake words if there was a penalty
        if (penalty > 0 && !state.mistakeWords.includes(state.currentList.words[state.currentWordIndex].text)) {
          setState.setMistakeWords(prev => [...prev, state.currentList.words[state.currentWordIndex].text]);
        }
        
        // Update the word attempt to mark it as completed
        setState.setWordAttempts(prev => {
          const newMap = new Map(prev);
          newMap.set(state.currentWordIndex, { 
            completed: true, 
            attempts: currentAttempt.attempts + 1,
            penalty: Math.max(currentAttempt.penalty, penalty)
          });
          return newMap;
        });
      }
      
      // Navigate to the next word if available, otherwise finish the session
      if (state.currentWordIndex < state.currentList.words.length - 1) {
        console.log("Moving to next word");
        setState.setCurrentWordIndex(prev => prev + 1);
      } else {
        console.log("Session completed successfully");
        // Session completed successfully
        finishSession(true);
      }
    } else {
      console.log("Word was incorrect, updating attempts and penalty");
      // Update attempts and penalty for incorrect answers
      setState.setWordAttempts(prev => {
        const newMap = new Map(prev);
        newMap.set(state.currentWordIndex, { 
          completed: false, 
          attempts: currentAttempt.attempts + 1,
          penalty: Math.min(currentAttempt.penalty + 0.1, 0.5) // Increment penalty with each incorrect attempt
        });
        return newMap;
      });
    }
  };

  const finishSession = (completed: boolean) => {
    if (!state.currentList) return;
    
    const newResult: SessionResult = {
      id: Date.now().toString(),
      date: new Date(),
      score: state.currentScore,
      totalQuestions: completed ? state.currentList.words.length : state.currentWordIndex + 1,
      wordList: state.currentList.name,
      mistakeWords: [...state.mistakeWords],
      completed
    };
    
    setState.setSessionResults(prev => {
      const updatedResults = [newResult, ...prev];
      saveSessionResults(updatedResults);
      return updatedResults;
    });
    
    const completionRate = Math.round((newResult.score / newResult.totalQuestions) * 100);
    
    toast({
      title: completed ? "Session Completed! 🎉" : "Session Ended",
      description: `You scored ${newResult.score.toFixed(1)} out of ${newResult.totalQuestions} (${completionRate}%)`,
    });
    
    setState.setShowDashboard(true);
    setState.setCurrentList(null);
    setState.setCurrentWordIndex(0);
  };

  const handleEndSession = () => {
    finishSession(false);
  };

  const handleNavigateWord = (direction: 'next' | 'prev') => {
    if (!state.currentList) return;
    
    // Get current word's attempt data
    const currentAttempt = state.wordAttempts.get(state.currentWordIndex);
    
    // If the word has been attempted but not completed, increment the penalty
    if (currentAttempt && !currentAttempt.completed && currentAttempt.attempts > 0) {
      setState.setWordAttempts(prev => {
        const newMap = new Map(prev);
        newMap.set(state.currentWordIndex, { 
          ...currentAttempt,
          penalty: Math.min(currentAttempt.penalty + 0.1, 0.5) // Penalty for skipping after attempts
        });
        return newMap;
      });
      
      toast({
        title: "Word Skipped",
        description: "A penalty will be applied when you return to this word.",
        variant: "default",
      });
    }
    
    if (direction === 'next' && state.currentWordIndex < state.currentList.words.length - 1) {
      setState.setCurrentWordIndex(prev => prev + 1);
    } else if (direction === 'prev' && state.currentWordIndex > 0) {
      setState.setCurrentWordIndex(prev => prev - 1);
    }
  };

  const handleBackToLanguageSelection = () => {
    setState.setSelectedLanguage(null);
    setState.setCurrentList(null);
    setState.setWordLists([]);
    setState.setShowDashboard(false);
  };

  const handleClearHistory = () => {
    setState.setSessionResults([]);
    localStorage.removeItem('spellingWizResults');
    toast({
      title: "History Cleared",
      description: "Your practice history has been reset.",
    });
  };

  return {
    handleLanguageSelect,
    handleUpload,
    handleStartPractice,
    handleWordComplete,
    finishSession,
    handleEndSession,
    handleNavigateWord,
    handleBackToLanguageSelection,
    handleClearHistory
  };
}
