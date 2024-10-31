// src/components/Quiz.tsx
import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Question, UserProfile, SessionStats, Verse } from '../types';
import {
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  CardActions,
  Grid,
  LinearProgress,
} from '@mui/material';
import { Fab } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface Props {
  user: UserProfile;
  questions: Question[];
  verses: Verse[];
  onUserUpdate: (user: UserProfile) => void;
  onLogout: () => void;
  onSessionEnd: () => void;
}

export const Quiz: React.FC<Props> = ({
  user,
  questions,
  verses,
  onUserUpdate,
  onLogout,
  onSessionEnd,
}) => {
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timer, setTimer] = useState(20);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    date: new Date().toISOString(),
    correctAnswers: 0,
    totalQuestions: 0,
    longestStreak: 0,
  });

  const answerLogged = useRef<boolean>(false);

  useEffect(() => {
    const filtered = questions.filter(
      (q) =>
        user.knownChapters.includes(q.chapter) &&
        user.knownVerses.includes(q.verse)
    );
    setFilteredQuestions(filtered);
  }, [questions, user]);

  useEffect(() => {
    if (filteredQuestions.length > 0 && !currentQuestion) {
      nextQuestion();
    }
  }, [filteredQuestions]);

  useEffect(() => {
    if (timer === 0) {
      setShowAnswer(true);
      if (intervalId) clearInterval(intervalId);
    }
  }, [timer]);

  const startTimer = () => {
    if (intervalId) clearInterval(intervalId);
    const id = window.setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    setIntervalId(id);
  };

  const getVerseText = (chapter: number, verse: number): string | null => {
    const foundVerse = verses.find(
      (v) => Number(v.chapter) === chapter && Number(v.verse) === verse
    );
    return foundVerse
      ? `${chapter}:${verse} ${foundVerse.content}`
      : null;
  };

  const nextQuestion = () => {
    answerLogged.current = false;
    if (filteredQuestions.length === 0) {
      // No questions available
      return;
    }
    setTimer(20);
    setShowAnswer(false);
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    setCurrentQuestion(filteredQuestions[randomIndex]);
    startTimer();
  };

  const handleAnswer = (correct: boolean) => {
    if (intervalId) clearInterval(intervalId);

    // Trigger confetti if the answer is correct
    if (correct) {
      fireConfetti();
    }

    setSessionStats((prev) => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
      correctAnswers: correct ? prev.correctAnswers + 1 : prev.correctAnswers,
    }));

    if (!answerLogged.current) {
      if (correct) {
        setStreak((prevStreak) => prevStreak + 1);
        if (streak + 1 > sessionStats.longestStreak) {
          setSessionStats((prev) => ({
            ...prev,
            longestStreak: streak + 1,
          }));
        }
      } else {
        setStreak(0);
      }
    }
    answerLogged.current = true;
  };

  const fireConfetti = () => {
    const duration = 500; // Duration in milliseconds (0.5 seconds)
    const end = Date.now() + duration;

    const colors = ['#bb0000', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const endSession = () => {
    const updatedUser = {
      ...user,
      stats: [...user.stats, sessionStats],
    };
    onUserUpdate(updatedUser);
    setShowAnswer(false);
    onSessionEnd();
  };

  if (filteredQuestions.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h5">
          No questions available based on your selections.
        </Typography>
        <Button variant="contained" onClick={onLogout}>
          Update Selections
        </Button>
      </Box>
    );
  }

  if (!currentQuestion) {
    // Show a loading indicator or message
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h5">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Typography variant="h4" align="center">
          Quizzible
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container direction="column" alignItems="center" spacing={4}>
          {/* Timer */}
          <Grid item>
            <Typography variant="h6">Time Left: {timer} seconds</Typography>
            <LinearProgress
              variant="determinate"
              value={(timer / 20) * 100}
              sx={{ width: 200, mt: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {streak > 0 ? `Current Streak: ${streak}` : ' '}
            </Typography>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} sm={8} md={6}>
            <Card
              sx={{
                minWidth: 275,
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {`Luke ${currentQuestion.chapter}:${currentQuestion.verse} ${currentQuestion.question}?`}
                </Typography>
                {showAnswer && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                      Correct Answer: {currentQuestion.answer}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      {getVerseText(
                        currentQuestion.chapter,
                        currentQuestion.verse
                      ) || 'Verse text not found.'}
                    </Typography>
                  </Box>
                )}
              </CardContent>
              <CardActions
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                {!showAnswer ? (
                  // Show Answer FAB anchored to the bottom-right
                  <Box
                    sx={{
                      position: 'fixed',
                      bottom: 58,
                      right: 16,
                    }}
                  >
                    <Fab
                      color="primary"
                      aria-label="Show Answer"
                      onClick={() => setShowAnswer(true)}
                    >
                      <VisibilityIcon />
                    </Fab>
                  </Box>
                ) : (
                  <>
                    {/* Floating Action Buttons */}
                    <Box
                      sx={{
                        position: 'fixed',
                        bottom: 58,
                        right: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 5,
                        zIndex: 1300,
                      }}
                    >
                      <Fab
                        color="primary"
                        aria-label="Next Question"
                        onClick={nextQuestion}
                      >
                        <ArrowForwardIcon />
                      </Fab>
                      <Fab
                        color="error"
                        aria-label="I Got It Wrong"
                        onClick={() => handleAnswer(false)}
                      >
                        <CloseIcon />
                      </Fab>
                      <Fab
                        color="success"
                        aria-label="I Got It Right"
                        onClick={() => handleAnswer(true)}
                      >
                        <CheckIcon />
                      </Fab>
                    </Box>

                    {/* Secondary Button */}
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="large"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={endSession}
                    >
                      End Session
                    </Button>
                  </>
                )}
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
