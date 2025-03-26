
export type Language = "english" | "urdu" | "arabic";

export interface Word {
  id: string;
  text: string;
  pronunciation: string;
  language: Language;
  difficultCount?: number; // Track how many times the user had difficulty with this word
}

export interface WordList {
  id: string;
  name: string;
  language: Language;
  words: Word[];
}
