// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { theme } from './theme';
import { ThemeProvider } from '@mui/material/styles';
// index.tsx
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// At the end of the file
serviceWorkerRegistration.register();


ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
