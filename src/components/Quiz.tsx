// src/components/Quiz.tsx
import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Question, UserProfile, SessionStats } from '../types';
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

interface Props {
  user: UserProfile;
  questions: Question[];
  onUserUpdate: (user: UserProfile) => void;
  onLogout: () => void;
  onSessionEnd: () => void; // New prop
}

export const Quiz: React.FC<Props> = ({ user, questions, onUserUpdate, onLogout, onSessionEnd }) => {
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timer, setTimer] = useState(20);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    date: new Date().toISOString(),
    correctAnswers: 0,
    totalQuestions: 0,
    longestStreak: 0,
  });

  useEffect(() => {
    const filtered = questions.filter(
      (q) =>
        user.knownChapters.includes(q.chapter) && user.knownVerses.includes(q.verse)
    );
    setFilteredQuestions(filtered);
  }, [questions, user]);

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

  const nextQuestion = () => {
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

    if (correct) {
      setStreak(streak + 1);
      if (streak + 1 > sessionStats.longestStreak) {
        setSessionStats((prev) => ({
          ...prev,
          longestStreak: streak + 1,
        }));
      }
    } else {
      setStreak(0);
    }
    console.log('Session Stats:', sessionStats);
  };

  // Inside the Quiz component
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
    setSessionEnded(true);
    onSessionEnd();
  };


  if (filteredQuestions.length === 0) {
    return (
      <div>
        <Typography variant="h5">No questions available based on your selections.</Typography>
        <Button variant="contained" onClick={onLogout}>
          Update Selections
        </Button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <Card
        sx={{
          minWidth: 275,
          boxShadow: 3,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 2,
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography variant="h5">Ready to start?</Typography>
          <Button variant="contained" onClick={nextQuestion}>
            Start
          </Button>
        </CardContent>
      </Card>
    );
  } 
  


  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Typography variant="h4" align="center">
          Bible Quiz
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container direction="column" alignItems="center" spacing={4}>
          {/* Timer */}
          <Grid item>
            <Typography variant="h6">
              Time Left: {timer} seconds
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(timer / 20) * 100}
              sx={{ width: 200, mt: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {streak > 0 ? `Current Streak: ${streak}` : ''}
            </Typography>
          </Grid>

          {/* Main Content */}
          {filteredQuestions.length === 0 ? (
            <Grid item>
              <Typography variant="h5">
                No questions available based on your selections.
              </Typography>
              <Button variant="contained" onClick={onLogout}>
                Update Selections
              </Button>
            </Grid>
          ) : !currentQuestion ? (
            <Card
              sx={{
                minWidth: 275,
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              <Grid item>
                <Button variant="contained" size="large" onClick={nextQuestion}>
                  Start Quiz
                </Button>
              </Grid>
            </Card>
          ) : (
            <>
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
                      {"Luke " + currentQuestion.chapter + ":" + currentQuestion.verse + " " + currentQuestion.question + "?"}
                    </Typography>
                    {showAnswer && (
                      <Typography variant="body1" color="text.secondary">
                        Answer: {currentQuestion.answer}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions
                    sx={{ justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}
                  >
                    {!showAnswer ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setShowAnswer(true)}
                      >
                        Show Answer
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleAnswer(true)}
                        >
                          I Got It Right
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleAnswer(false)}
                        >
                          I Got It Wrong
                        </Button>
                        <Button variant="outlined" onClick={nextQuestion}>
                          Next Question
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={endSession}
                        >
                          End Session
                        </Button>
                      </>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Box>
  );
};


