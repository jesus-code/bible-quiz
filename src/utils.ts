// src/utils.ts

import Papa from 'papaparse';
import { ParseResult } from 'papaparse';
import { Question } from './types';

export const loadQuestions = async (): Promise<Question[]> => {
  const response = await fetch('/questions.csv');
  const csvData = await response.text();
  console.log('CSV data:', response.url);

  return new Promise((resolve, reject) => {
    Papa.parse<Question>(csvData, {
      header: true,
      delimiter: ',',
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<Question>) => {
        // if (results.errors.length) {
        //   console.error('Parsing errors:', results.errors);
        //   reject(results.errors);
        // } else {
          console.log('Parsed Questions:', results.data);
          resolve(results.data as Question[]);
        // }
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
