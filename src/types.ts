// src/types.ts
export interface Question {
  chapter: string;
  verse: string;
  question: string;
  answer: string;
}

export interface UserProfile {
  name: string;
  knownChapters: string[];
  knownVerses: string[];
  stats: SessionStats[];
}

export interface SessionStats {
  date: string;
  correctAnswers: number;
  totalQuestions: number;
  longestStreak: number;
}
