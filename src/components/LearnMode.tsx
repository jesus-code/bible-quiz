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
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ListIcon from '@mui/icons-material/List';
import { Question, Verse } from '../types';

interface Props {
  verses: Verse[];
  questions: Question[];
  onExit: () => void;
}

export const LearnMode: React.FC<Props> = ({ verses, questions, onExit }) => {
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [showVerseList, setShowVerseList] = useState(false);

  // Bubble states
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [bubblePosition, setBubblePosition] = useState<{ left: string; top: string }>({
    left: '0%',
    top: '0%',
  });
  const [bubbleColor, setBubbleColor] = useState('red');
  const [bubbleTransition, setBubbleTransition] = useState('');

  const handleSelectChapter = (chapter: number) => {
    setSelectedChapter(chapter);
    setCurrentVerseIndex(0);
  };

  const handlePreviousVerse = () => {
    if (currentVerseIndex > 0) {
      setCurrentVerseIndex(currentVerseIndex - 1);
    }
  };

  const handleNextVerse = () => {
    if (currentVerseIndex < chapterVerses.length - 1) {
      setCurrentVerseIndex(currentVerseIndex + 1);
    }
  };

  const handleVerseClick = (index: number) => {
    setCurrentVerseIndex(index);
    setShowVerseList(false); // Hide the verse list after selecting a verse
  };

  const verseListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (verseListRef.current) {
      const activeItem = verseListRef.current.querySelector('.Mui-selected');
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentVerseIndex]);

  // Get available chapters
  const availableChapters = Array.from(
    new Set<number>(verses.map((v) => v.chapter))
  ).sort((a, b) => a - b); // Numerical sort

  // Filter verses for the selected chapter
  const chapterVerses =
    selectedChapter !== null
      ? verses.filter((v) => Number(v.chapter) === selectedChapter)
      : [];

  const currentVerse = chapterVerses[currentVerseIndex];

  const currentQuestions = currentVerse
    ? questions.filter(
        (q) =>
          Number(q.chapter) === Number(currentVerse.chapter) &&
          Number(q.verse) === Number(currentVerse.verse)
      )
    : [];

  // Bubble Animation on Verse Change
  useEffect(() => {
    // Delay of 0.5 seconds before starting the animation
    const timer = setTimeout(() => {
      // Randomize bubble color
      const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink'];
      const newColor = colors[Math.floor(Math.random() * colors.length)];
      setBubbleColor(newColor);

      // Randomize starting side: left or right
      const fromLeft = Math.random() > 0.5;

      // Set starting and ending positions
      const startPosition = fromLeft
        ? { left: '-10%', top: '50%' }
        : { left: '110%', top: '50%' };
      const endPosition = fromLeft
        ? { left: '90%', top: '50%' }
        : { left: '10%', top: '50%' };

      // Set initial position and make bubble visible
      setBubblePosition(startPosition);
      setBubbleVisible(true);

      // Allow the DOM to update
      requestAnimationFrame(() => {
        // Add transition
        setBubbleTransition('left 1s linear');

        // Trigger animation by setting the end position
        setBubblePosition(endPosition);

        // After animation completes (1s), remove transition and fix the bubble position
        setTimeout(() => {
          setBubbleTransition('');
          // The bubble remains at the end position
        }, 1000);
      });
    }, 500); // 0.5s delay

    return () => {
      clearTimeout(timer);
    };
  }, [currentVerseIndex]);

  return (
    <Box sx={{ p: 2 }}>
      {/* Bubble */}
      {bubbleVisible && (
        <Box
          sx={{
            position: 'fixed',
            left: bubblePosition.left,
            top: bubblePosition.top,
            width: '50px',
            height: '50px',
            backgroundColor: bubbleColor,
            opacity: 0.3,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            transition: bubbleTransition,
            zIndex: 2000,
            pointerEvents: 'none',
          }}
        ></Box>
      )}

      {/* Chapter Selection Dropdown */}
      <FormControl fullWidth sx={{ mb: 2 }}>
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

      {selectedChapter !== null ? (
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
                        <ListItemText
                          primary={`Verse ${verse.verse}: ${verse.content}`}
                        />
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
                  {`Luke ${currentVerse.chapter}:${currentVerse.verse}`}
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
                {currentQuestions.map((question, index) => (
                  <Box key={question.id} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">
                      Q: {question.question}?
                    </Typography>
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
                flexDirection: 'column',
                gap: 2,
              }}
            >
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
          </>
        ) : (
          <Typography variant="body1">
            No verses available for this chapter.
          </Typography>
        )
      ) : (
        <Typography variant="body1">
          Please select a chapter to begin learning.
        </Typography>
      )}

      {/* Exit Button */}
      <Button variant="outlined" onClick={onExit} sx={{ mt: 2 }}>
        Exit Learn Mode
      </Button>
    </Box>
  );
};
