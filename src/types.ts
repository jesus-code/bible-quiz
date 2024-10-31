// src/types.ts
export interface Question {
  verse: number;
  chapter: number;
  id: string;
  question: string;
  answer: string;
}

export interface Verse {
  verse: number;
  chapter: number;
  content: string;
}

export interface UserProfile {
  knownVerses: number[];
  name: string;
  knownChapters: number[];
  stats: SessionStats[];
}

export interface SessionStats {
  date: string;
  correctAnswers: number;
  totalQuestions: number;
  longestStreak: number;
}
