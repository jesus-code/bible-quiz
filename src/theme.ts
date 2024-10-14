// theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#283593', // Deep blue
    },
    secondary: {
      main: '#FFA000', // Amber
    },
    background: {
      default: '#f9f7f1', // Light parchment
    },
    text: {
      primary: '#212121',
      secondary: '#5f5f5f',
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif', // Changed to Inter
    h4: {
      fontFamily: 'Inter, Arial, sans-serif', // Ensure headers use a consistent font
      fontWeight: 700,
    },
    h5: {
      fontFamily: 'Inter, Arial, sans-serif',
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    subtitle1: {
      fontSize: '0.9rem',
      color: '#5f5f5f',
    },
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '16px',
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#283593',
        },
      },
    },
  },
});
