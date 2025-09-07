// src/components/LearnMode.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Fab,
  Button,
  Select,
  Menu,
  MenuItem,
  Badge,
  FormControl,
  InputLabel,
  Divider,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ListIcon from '@mui/icons-material/List';
import LoopIcon from '@mui/icons-material/Loop';
import SpeedIcon from '@mui/icons-material/Speed';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import { Question, Verse } from '../types';

interface Props {
  verses: Verse[];
  questions: Question[];
  onExit: () => void;
}

export const LearnMode: React.FC<Props> = ({ verses, questions, onExit }) => {
  
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [verseNumberUtterance, setVerseNumberUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [verseContentUtterance, setVerseContentUtterance] = useState<SpeechSynthesisUtterance | null>(null);


  const [showVerseList, setShowVerseList] = useState(false);

  // Reading states
  const [isReading, setIsReading] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(() => {
    // Load speech rate from localStorage or default to 1.0
    const savedRate = localStorage.getItem('speechRate');
    return savedRate ? parseFloat(savedRate) : 1.0;
  });
  const [repeatCount, setRepeatCount] = useState(1);
  const [remainingRepeats, setRemainingRepeats] = useState(0);

  // Refs for speech synthesis
  const speechSynthesisRef = useRef(window.speechSynthesis);

  // Voices
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Cancellation flag
  const speechCanceledRef = useRef(false);

  // Menu for speed control
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Menu for voice selection
  const [voiceAnchorEl, setVoiceAnchorEl] = useState<null | HTMLElement>(null);
  const voiceMenuOpen = Boolean(voiceAnchorEl);

  const verseListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (verseNumberUtterance) {
      verseNumberUtterance.rate = speechRate;
      verseNumberUtterance.voice = selectedVoice;
    }
    if (verseContentUtterance) {
      verseContentUtterance.rate = speechRate;
      verseContentUtterance.voice = selectedVoice;
    }
  }, [speechRate, selectedVoice, verseNumberUtterance, verseContentUtterance]);
  

  // Fetch voices and load selected voice from localStorage
  useEffect(() => {
    const populateVoices = () => {
      const availableVoices = speechSynthesisRef.current.getVoices();
      const englishVoices = availableVoices.filter((voice) => voice.lang.startsWith('en'));
      setVoices(englishVoices);

      // Load selected voice from localStorage
      const savedVoiceURI = localStorage.getItem('selectedVoiceURI');
      const savedVoice = englishVoices.find((voice) => voice.voiceURI === savedVoiceURI);

      if (savedVoice) {
        setSelectedVoice(savedVoice);
      } else if (englishVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(englishVoices[0]);
      }
    };

    populateVoices();

    speechSynthesisRef.current.addEventListener('voiceschanged', populateVoices);

    return () => {
      speechSynthesisRef.current.removeEventListener('voiceschanged', populateVoices);
    };
  }, []);

  // Save selected voice to localStorage whenever it changes
  useEffect(() => {
    if (selectedVoice) {
      localStorage.setItem('selectedVoiceURI', selectedVoice.voiceURI);
    }
  }, [selectedVoice]);

  // Save speech rate to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('speechRate', speechRate.toString());
  }, [speechRate]);

  const handleSelectBook = (book: string) => {
    setSelectedBook(book);
    setSelectedChapter(null);
    setCurrentVerseIndex(0);
  };

  const handleSelectChapter = (chapter: number) => {
    setSelectedChapter(chapter);
    setCurrentVerseIndex(0);
  };

  const handlePreviousVerse = () => {
    if (currentVerseIndex > 0) {
      const newIndex = currentVerseIndex - 1;
      setCurrentVerseIndex(newIndex);

      if (isReading) {
        speechCanceledRef.current = true;
        speechSynthesisRef.current.cancel();
        speechCanceledRef.current = false;
        readChapter(newIndex);
      }
    }
  };

  const handleNextVerse = () => {
    if (currentVerseIndex < chapterVerses.length - 1) {
      const newIndex = currentVerseIndex + 1;
      setCurrentVerseIndex(newIndex);

      if (isReading) {
        speechCanceledRef.current = true;
        speechSynthesisRef.current.cancel();
        speechCanceledRef.current = false;
        readChapter(newIndex);
      }
    }
  };

  const handleVerseClick = (index: number) => {
    setCurrentVerseIndex(index);
    setShowVerseList(false);

    if (isReading) {
      speechCanceledRef.current = true;
      speechSynthesisRef.current.cancel();
      speechCanceledRef.current = false;
      readChapter(index);
    }
  };

  useEffect(() => {
    if (verseListRef.current) {
      const activeItem = verseListRef.current.querySelector('.Mui-selected');
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentVerseIndex]);

  // Get available books
  const availableBooks = Array.from(new Set<string>(verses.map((v) => v.book))).sort();

  // Get available chapters for the selected book
  const availableChapters = selectedBook
    ? Array.from(new Set<number>(
        verses.filter(v => v.book === selectedBook).map((v) => v.chapter)
      )).sort((a, b) => a - b)
    : [];

  // Filter verses for the selected book and chapter
  const chapterVerses =
    selectedBook && selectedChapter !== null
      ? verses.filter((v) => v.book === selectedBook && Number(v.chapter) === selectedChapter)
      : [];

  const currentVerse = chapterVerses[currentVerseIndex];

  const currentQuestions = currentVerse
    ? questions.filter(
        (q) =>
          q.book === currentVerse.book &&
          Number(q.chapter) === Number(currentVerse.chapter) &&
          Number(q.verse) === Number(currentVerse.verse)
      )
    : [];

  // Handle speed menu
  const handleSpeedClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSpeedClose = () => {
    setAnchorEl(null);
  };

  const handleSpeedChange = (rate: number) => {
    setSpeechRate(rate);
    setAnchorEl(null);

    if (isReading) {
      speechCanceledRef.current = true;
      speechSynthesisRef.current.cancel();
      speechCanceledRef.current = false;
      readChapter(currentVerseIndex);
    }
  };

  // Handle voice menu
  const handleVoiceClick = (event: React.MouseEvent<HTMLElement>) => {
    setVoiceAnchorEl(event.currentTarget);
  };

  const handleVoiceClose = () => {
    setVoiceAnchorEl(null);
  };

  const handleVoiceChange = (voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
    setVoiceAnchorEl(null);

    if (isReading) {
      speechCanceledRef.current = true;
      speechSynthesisRef.current.cancel();
      speechCanceledRef.current = false;
      readChapter(currentVerseIndex);
    }
  };

  // Handle repeat button
  const handleRepeatClick = () => {
    setRepeatCount(repeatCount + 1);
    if (isReading) {
      setRemainingRepeats(remainingRepeats + 1);
    }
  };

  // Function to read the entire chapter aloud
  const handleReadChapterAloud = () => {
    if ('speechSynthesis' in window) {
      if (isReading) {
        speechCanceledRef.current = true;
        speechSynthesisRef.current.cancel();
        setIsReading(false);
        setRepeatCount(1);
        setRemainingRepeats(0);
        return;
      }

      speechCanceledRef.current = false;
      setIsReading(true);
      setRemainingRepeats(repeatCount);
      readChapter(currentVerseIndex);
    } else {
      alert('Sorry, your browser does not support speech synthesis.');
    }
  };

  const readChapter = (startVerseIndex: number) => {
    readVerse(startVerseIndex);
  };

  const readVerse = (verseIndex: number) => {
    // if (isReading == false) return;
    if (speechCanceledRef.current) return;

    if (verseIndex >= chapterVerses.length) {
      // End of chapter
      if (remainingRepeats > 1) {
        setRemainingRepeats(remainingRepeats - 1);
        setRepeatCount(repeatCount - 1);
        readVerse(0);
      } else {
        setIsReading(false);
        setRemainingRepeats(0);
        setRepeatCount(1);
      }
      return;
    }

    const verse = chapterVerses[verseIndex];

    setCurrentVerseIndex(verseIndex);

    const newVerseNumberUtterance = new SpeechSynthesisUtterance(`Verse ${verse.verse}`);
    const newVerseContentUtterance = new SpeechSynthesisUtterance(verse.content);

    newVerseContentUtterance.onend = () => {
      if (speechCanceledRef.current) return;
      readVerse(verseIndex + 1);
    };

    newVerseNumberUtterance.onend = () => {
      if (speechCanceledRef.current) return;
      speechSynthesisRef.current.speak(newVerseContentUtterance);
    };

    setVerseNumberUtterance(newVerseNumberUtterance);
    setVerseContentUtterance(newVerseContentUtterance);

    // Start speaking
    speechSynthesisRef.current.speak(newVerseNumberUtterance);
  };

  const exit = () => {
    speechCanceledRef.current = true;
    speechSynthesisRef.current.cancel();
    onExit();
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Book Selection Dropdown */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="book-select-label">Select Book</InputLabel>
        <Select
          labelId="book-select-label"
          id="book-select"
          value={selectedBook ?? ''}
          label="Select Book"
          onChange={(e) => handleSelectBook(e.target.value as string)}
        >
          {[
            // Bible book order (Protestant, 66 books)
            "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
            "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
            "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
            "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
            "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations",
            "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
            "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
            "Zephaniah", "Haggai", "Zechariah", "Malachi",
            "Matthew", "Mark", "Luke", "John", "Acts",
            "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
            "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
            "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews",
            "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
          ]
            .filter((book) => availableBooks.includes(book))
            .map((book) => (
              <MenuItem key={book} value={book}>
                {book}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      {/* Chapter Selection Dropdown */}
      <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedBook}>
        <InputLabel id="chapter-select-label">Select Chapter</InputLabel>
        <Select
          labelId="chapter-select-label"
          id="chapter-select"
          value={selectedChapter ?? ''}
          label="Select Chapter"
          onChange={(e) => handleSelectChapter(Number(e.target.value))}
        >
          {availableChapters.map((chapter) => (
            <MenuItem key={`chapter-${chapter}`} value={chapter}>
              Chapter {chapter}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedBook && selectedChapter !== null ? (
        chapterVerses.length > 0 ? (
          <>
            {/* Verse List */}
            {showVerseList && (
              <Box
                ref={verseListRef}
                sx={{
                  maxHeight: '50vh',
                  overflowY: 'auto',
                  mb: 2,
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  p: 1,
                  backgroundColor: '#f9f9f9',
                  position: 'fixed',
                  top: '20%',
                  left: '10%',
                  right: '10%',
                  zIndex: 1300,
                }}
              >
                <List disablePadding>
                  {chapterVerses.map((verse, index) => (
                    <ListItem
                      key={`chapter-${verse.chapter}-verse-${verse.verse}-${index}`}
                      disablePadding
                    >
                      <ListItemButton
                        selected={index === currentVerseIndex}
                        onClick={() => handleVerseClick(index)}
                      >
                        <ListItemText primary={`Verse ${verse.verse}: ${verse.content}`} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Current Verse Content */}
            {currentVerse && (
              <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {`${currentVerse.book} ${currentVerse.chapter}:${currentVerse.verse}`}
                </Typography>
                <Typography variant="body1">{currentVerse.content}</Typography>
              </Paper>
            )}

            {/* Questions for the Current Verse */}
            {currentQuestions.length > 0 ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Questions
                </Typography>
                {currentQuestions.map((question) => (
                  <Box key={question.id} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">Q: {question.question}?</Typography>
                    <Typography variant="body2" color="text.secondary">
                      A: {question.answer}
                    </Typography>
                    <Divider sx={{ mt: 1 }} />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body1" sx={{ mt: 2 }}>
                No questions for this verse.
              </Typography>
            )}

            {/* Navigation FABs */}
            <Box
              sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                display: 'flex',
                gap: 2,
              }}
            >
              {/* Left FABs (Controls) */}
              {isReading && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  {/* Repeat FAB */}
                  <Fab
                    color="primary"
                    aria-label={`Repeat Count: ${repeatCount}`}
                    onClick={handleRepeatClick}
                  >
                    <Badge badgeContent={repeatCount > 1 ? repeatCount : null} color="secondary">
                      <LoopIcon />
                    </Badge>
                  </Fab>

                  {/* Speed Control FAB */}
                  <Fab color="primary" aria-label="Set Speed" onClick={handleSpeedClick}>
                    <SpeedIcon />
                  </Fab>
                  <Menu anchorEl={anchorEl} open={open} onClose={handleSpeedClose}>
                    {[1.0, 1.2, 1.5, 1.75, 2.0].map((rate) => (
                      <MenuItem
                        key={rate}
                        selected={speechRate === rate}
                        onClick={() => handleSpeedChange(rate)}
                      >
                        {`${rate}x`}
                      </MenuItem>
                    ))}
                  </Menu>

                  {/* Voice Selection FAB */}
                  <Fab color="primary" aria-label="Select Voice" onClick={handleVoiceClick}>
                    <RecordVoiceOverIcon />
                  </Fab>
                  <Menu anchorEl={voiceAnchorEl} open={voiceMenuOpen} onClose={handleVoiceClose}>
                    {voices.map((voice) => (
                      <MenuItem
                        key={voice.name}
                        selected={selectedVoice?.voiceURI === voice.voiceURI}
                        onClick={() => handleVoiceChange(voice)}
                      >
                        {voice.name} ({voice.lang})
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              )}

              {/* Right FABs */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {/* Read Chapter Aloud FAB */}
                <Fab
                  color={isReading ? 'secondary' : 'primary'}
                  aria-label={isReading ? 'Stop Reading' : 'Read Chapter Aloud'}
                  onClick={handleReadChapterAloud}
                >
                  <VolumeUpIcon />
                </Fab>

                {/* Show Verse List FAB */}
                <Fab
                  color="primary"
                  aria-label="Show Verse List"
                  onClick={() => setShowVerseList(!showVerseList)}
                >
                  <ListIcon />
                </Fab>

                <Fab
                  color="primary"
                  onClick={handlePreviousVerse}
                  disabled={currentVerseIndex === 0}
                >
                  <ArrowBackIcon />
                </Fab>
                <Fab
                  color="primary"
                  onClick={handleNextVerse}
                  disabled={currentVerseIndex === chapterVerses.length - 1}
                >
                  <ArrowForwardIcon />
                </Fab>
              </Box>
            </Box>
          </>
        ) : (
          <Typography variant="body1">No verses available for this chapter.</Typography>
        )
      ) : (
        <Typography variant="body1">
          Please select a book and chapter to begin learning.
        </Typography>
      )}

      {/* Exit Button */}
      <Button variant="outlined" onClick={exit} sx={{ mt: 2 }}>
        Exit Learn Mode
      </Button>
    </Box>
  );
};
