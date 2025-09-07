// src/App.tsx
import React, { useEffect, useState } from 'react';
import {
  loadQuestions,
  loadFromLocalStorage,
  saveToLocalStorage,
  loadVerses,
} from './utils';
import { Question, UserProfile, Verse } from './types';
import { SelectProfile } from './components/SelectProfile';
import { Quiz } from './components/Quiz';
import { ChapterVerseSelection } from './components/ChapterVerseSelection';
import { Leaderboard } from './components/Leaderboard';
import { LearnMode } from './components/LearnMode';
import { ModeSelection } from './components/ModeSelection';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import { theme } from './theme';

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [mode, setMode] = useState<'quiz' | 'learn' | null>(null);
  const [showChapterVerseSelection, setShowChapterVerseSelection] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const qs = await loadQuestions();
      setQuestions(qs);
    };

    // Clear any existing user profiles since we're starting fresh for the new season
    // Uncomment the line below if you want to clear all existing data
    // localStorage.removeItem('userProfiles');

    fetchQuestions();
    const profiles = loadFromLocalStorage('userProfiles') || [];
    
    // Filter out any profiles that don't have the new bookProgress structure
    const validProfiles = profiles.filter((profile: UserProfile) => 
      profile.bookProgress !== undefined
    );
    
    setUserProfiles(validProfiles);
  }, []);

  useEffect(() => {
    loadVerses()
      .then((data) => {
        setVerses(data);
      })
      .catch((error) => {
        console.error('Error loading verses:', error);
      });
  }, []);

  useEffect(() => {
    saveToLocalStorage('userProfiles', userProfiles);
  }, [userProfiles]);

  const handleUserUpdate = (updatedUser: UserProfile) => {
    setUserProfiles((prevProfiles) =>
      prevProfiles.map((profile) =>
        profile.name === updatedUser.name ? updatedUser : profile
      )
    );
    setCurrentUser(updatedUser);
  };

  const handleModeSelection = (selectedMode: 'quiz' | 'learn') => {
    setMode(selectedMode);
    if (selectedMode === 'quiz') {
      setShowChapterVerseSelection(true);
    }
  };

  const handleChapterVerseSelectionComplete = () => {
    setShowChapterVerseSelection(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setMode(null);
    setShowChapterVerseSelection(false);
    setShowLeaderboard(false);
  };

  const handleSessionEnd = () => {
    setShowLeaderboard(true);
  };

  const handleRestart = () => {
    // Reset the app state to navigate back to the mode selection or home screen
    setMode(null);
    setShowChapterVerseSelection(false);
    setShowLeaderboard(false);
  };

  return ( 
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!currentUser ? (
        <SelectProfile
          userProfiles={userProfiles}
          setCurrentUser={setCurrentUser}
          setUserProfiles={setUserProfiles}
        />
      ) : !mode ? (
        <>
          <ModeSelection onSelectMode={handleModeSelection} onLogout={handleLogout} />
          <Leaderboard user={currentUser} onRestart={handleRestart} />
          </>
      ) : mode === 'quiz' && showChapterVerseSelection ? (
        <ChapterVerseSelection
          questions={questions}
          user={currentUser}
          onUpdateUser={handleUserUpdate}
          onComplete={handleChapterVerseSelectionComplete}
        />
      ) : showLeaderboard ? (
        <Leaderboard user={currentUser} onRestart={handleRestart} />
      ) : mode === 'quiz' ? (
        <Quiz
          user={currentUser}
          questions={questions}
          verses={verses}
          onUserUpdate={handleUserUpdate}
          onLogout={handleLogout}
          onSessionEnd={handleSessionEnd}
        />
      ) : (
        <LearnMode
          verses={verses}
          questions={questions}
          onExit={handleLogout}
        />
      )}
    </ThemeProvider>
  );
};

export default App;
