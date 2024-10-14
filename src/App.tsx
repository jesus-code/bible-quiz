// src/App.tsx
import React, { useEffect, useState } from 'react';
import { loadQuestions, loadFromLocalStorage, saveToLocalStorage, loadVerses } from './utils';
import { Question, UserProfile, Verse } from './types';
import { SelectProfile } from './components/SelectProfile';
import { Quiz } from './components/Quiz';
import { ChapterVerseSelection } from './components/ChapterVerseSelection';
import { Leaderboard } from './components/Leaderboard';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from './theme'; // Adjust the path if necessary

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showChapterVerseSelection, setShowChapterVerseSelection] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);


  useEffect(() => {
    const fetchQuestions = async () => {
      const qs = await loadQuestions();
      setQuestions(qs);
    };

    fetchQuestions();
    const profiles = loadFromLocalStorage('userProfiles') || [];
    setUserProfiles(profiles);
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

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline provides a consistent baseline and applies the theme's background color */}
      <CssBaseline />
      {/* Your app content */}
      {!currentUser ? (
        <SelectProfile
          userProfiles={userProfiles}
          setCurrentUser={(user) => {
            setCurrentUser(user);
            setShowChapterVerseSelection(true);
          }}
          setUserProfiles={setUserProfiles}
        />
      ) : showChapterVerseSelection ? (
        <ChapterVerseSelection
          questions={questions}
          user={currentUser}
          onUpdateUser={handleUserUpdate}
          onComplete={() => setShowChapterVerseSelection(false)}
        />
      ) : showLeaderboard ? (
        <Leaderboard
          user={currentUser}
          onRestart={() => setShowLeaderboard(false)}
        />
      ) : (
        <Quiz
          user={currentUser}
          questions={questions}
          verses={verses}
          onUserUpdate={handleUserUpdate}
          onLogout={() => setShowChapterVerseSelection(true)}
          onSessionEnd={() => setShowLeaderboard(true)}
        />
      )}
    </ThemeProvider>
  );
};

export default App;
