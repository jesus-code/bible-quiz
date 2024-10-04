// src/utils.ts

import Papa from 'papaparse';
import { ParseResult } from 'papaparse';
import { Question } from './types';

export const loadQuestions = async (): Promise<Question[]> => {
  console.log(`${process.env.PUBLIC_URL}/docs/questions.csv`);
  const response = await fetch(`${process.env.PUBLIC_URL}/questions.csv`);
  const csvData = await response.text();
  console.log('CSV Data:', csvData);

  return new Promise((resolve, reject) => {
    Papa.parse<Question>(csvData, {
      header: true,
      delimiter: ',',
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<Question>) => {
        console.log('Parsed Questions:', results.data);
        // if (results.errors.length) {
        //   console.error('Parsing errors:', results.errors);
        //   reject(results.errors);
        // } else {
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
