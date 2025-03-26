
import { WordList, Word } from './word';

export interface WordAttempt {
  completed: boolean;
  attempts: number;
  penalty: number;
}

export interface SessionResult {
  id: string;
  date: Date;
  score: number;
  totalQuestions: number;
  wordList: string;
  mistakeWords: string[];
  completed: boolean;
}

export type SpellingSessionState = {
  selectedLanguage: import('./word').Language | null;
  wordLists: WordList[];
  currentList: WordList | null;
  currentWordIndex: number;
  sessionResults: SessionResult[];
  currentScore: number;
  mistakeWords: string[];
  showDashboard: boolean;
  wordAttempts: Map<number, WordAttempt>;
}
