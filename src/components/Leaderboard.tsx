// src/components/Leaderboard.tsx
import React from 'react';
import { UserProfile } from '../types';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';

interface Props {
  user: UserProfile;
  onRestart: () => void;
}

export const Leaderboard: React.FC<Props> = ({ user, onRestart }) => {
  // Get the last session date to identify the current session
  const lastSessionDate =
    user.stats.length > 0 ? user.stats[user.stats.length - 1].date : null;

  // Prepare data for longest streaks
  const longestStreaks = user.stats
    .map((stat) => ({
      date: stat.date,
      value: stat.longestStreak,
      isCurrentSession: stat.date === lastSessionDate,
    }))
    .sort((a, b) => b.value - a.value);

  // Prepare data for session accuracy
  const sessionAccuracy = user.stats
    .map((stat) => ({
      date: stat.date,
      value:
        stat.totalQuestions > 0
          ? (stat.correctAnswers / stat.totalQuestions) * 100
          : 0,
      isCurrentSession: stat.date === lastSessionDate,
    }))
    .sort((a, b) => b.value - a.value);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);  
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      weekday: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          color: 'primary.main',
        }}
      >
        <Typography variant="h4" align="center">
          Leaderboard
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Grid container spacing={4} justifyContent="center">
          {/* Longest Streaks */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Longest Correct Streaks
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Streak</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {longestStreaks.map((streak, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          bgcolor: streak.isCurrentSession
                            ? 'action.hover'
                            : 'inherit',
                        }}
                      >
                        <TableCell>{streak.value}</TableCell>
                        <TableCell>{formatDate(streak.date)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Top Session Accuracy */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Top Session Accuracy
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Accuracy</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sessionAccuracy.map((session, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          bgcolor: session.isCurrentSession
                            ? 'action.hover'
                            : 'inherit',
                        }}
                      >
                        <TableCell>
                          {session.value.toFixed(2)}%
                        </TableCell>
                        <TableCell>{formatDate(session.date)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Start New Session Button */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={onRestart}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.2rem',
              textTransform: 'none',
            }}
          >
            Start New Session
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
