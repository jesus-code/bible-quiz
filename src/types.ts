// src/types.ts
export interface Question {
  book: string;
  verse: number;
  chapter: number;
  id: string;
  question: string;
  answer: string;
}

export interface Verse {
  book: string;
  verse: number;
  chapter: number;
  content: string;
}

export interface BookProgress {
  book: string;
  knownChapters: number[];
  knownVerses: number[];
}

export interface UserProfile {
  name: string;
  bookProgress: BookProgress[];
  stats: SessionStats[];
}

export interface SessionStats {
  date: string;
  correctAnswers: number;
  totalQuestions: number;
  longestStreak: number;
}
