// src/components/ModeSelection.tsx

import React from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Avatar,
  Divider,
} from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import SchoolIcon from '@mui/icons-material/School';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

interface Props {
  onSelectMode: (mode: 'quiz' | 'learn') => void;
  onLogout: () => void;
}

export const ModeSelection: React.FC<Props> = ({ onSelectMode, onLogout }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
        }}
      >
        <Typography variant="h4" align="center">
          Quizzible
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Paper
          elevation={3}
          sx={{
            maxWidth: 500,
            mx: 'auto',
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Choose Your Mode
          </Typography>
          <Divider sx={{ mb: 4 }} />

          <Grid container spacing={4}>
            {/* Quiz Mode */}
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{
                  height: '100%',
                  textTransform: 'none',
                  p: 2,
                  borderWidth: 2,
                }}
                onClick={() => onSelectMode('quiz')}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'transparent',
                      mb: 1,
                      width: 56,
                      height: 56,
                      border: '2px solid',
                      borderColor: 'primary.main',
                      color: 'primary.main',
                    }}
                  >
                    <QuizIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" color="text.primary">
                    Quiz Mode
                  </Typography>
                </Box>
              </Button>
            </Grid>

            {/* Learn Mode */}
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                sx={{
                  height: '100%',
                  textTransform: 'none',
                  p: 2,
                  borderWidth: 2,
                }}
                onClick={() => onSelectMode('learn')}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'transparent',
                      mb: 1,
                      width: 56,
                      height: 56,
                      border: '2px solid',
                      borderColor: 'secondary.main',
                      color: 'secondary.main',
                    }}
                  >
                    <SchoolIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" color="text.primary">
                    Learn Mode
                  </Typography>
                </Box>
              </Button>
            </Grid>
          </Grid>

          {/* Logout Button */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="text"
              color="error"
              startIcon={<ExitToAppIcon />}
              onClick={onLogout}
              sx={{ textTransform: 'none' }}
            >
              Logout
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
