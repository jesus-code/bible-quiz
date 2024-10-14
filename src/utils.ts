// src/utils.ts

import Papa from 'papaparse';
import { ParseResult } from 'papaparse';
import { Question, Verse } from './types';

export const loadQuestions = async (): Promise<Question[]> => {
  const response = await fetch(`${process.env.PUBLIC_URL}/questions.csv`);
  const csvData = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<Question>(csvData, {
      header: true,
      delimiter: ',',
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<Question>) => {
        resolve(results.data as Question[]);
      },
    });
  });
};

export const loadVerses = (): Promise<Verse[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(`${process.env.PUBLIC_URL}/verses.csv`, {
      download: true,
      header: true,
      complete: (results) => {
        const verses = results.data as Verse[];
        resolve(verses);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

export const saveToLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const loadFromLocalStorage = (key: string): any => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};
