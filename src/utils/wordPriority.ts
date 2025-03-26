
import { WordList, Word } from '@/types/word';
import { SessionResult } from '@/types/session';

// Helper function to reorder word list based on mistakes
export const prioritizeWeakWords = (list: WordList, sessionResults: SessionResult[]): WordList => {
  if (sessionResults.length === 0) {
    console.log("No session results, using random order but preserving word IDs");
    return { ...list, words: [...list.words].sort(() => Math.random() - 0.5) };
  }
  
  // Create a frequency map of mistake words
  const mistakeFrequency: Record<string, number> = {};
  sessionResults.forEach(result => {
    result.mistakeWords.forEach(word => {
      mistakeFrequency[word] = (mistakeFrequency[word] || 0) + 1;
    });
  });
  
  console.log("Prioritizing words, mistake frequency:", mistakeFrequency);
  
  // Sort the words by mistake frequency, maintaining original IDs
  const sortedWords = [...list.words].sort((a, b) => {
    const aFreq = mistakeFrequency[a.text] || 0;
    const bFreq = mistakeFrequency[b.text] || 0;
    if (bFreq !== aFreq) {
      return bFreq - aFreq; // Prioritize words with more mistakes
    }
    return Math.random() - 0.5; // Randomize words with the same frequency
  });
  
  console.log("Sorted word IDs:", sortedWords.map(w => w.id).join(', '));
  
  return { ...list, words: sortedWords };
};

// Add utility to help detect when a list is reordered but contains the same words
export const getWordIdMapping = (words: Word[]): Record<string, string> => {
  const mapping: Record<string, string> = {};
  words.forEach(word => {
    mapping[word.text] = word.id;
  });
  return mapping;
};

// Utility to check if a recording exists for a word
export const hasRecordingForWord = (wordId: string): boolean => {
  try {
    const savedRecordings = localStorage.getItem('wordRecordings');
    if (savedRecordings) {
      const recordings = JSON.parse(savedRecordings);
      return !!recordings[wordId];
    }
  } catch (error) {
    console.error('Error checking recordings:', error);
  }
  return false;
};
