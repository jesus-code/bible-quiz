// src/components/ChapterSelection.tsx
import React, { useState, useEffect } from 'react';
import { Question, UserProfile } from '../types';
import {
    Box,
    Button,
    Typography,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    //   IconButton,
} from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    questions: Question[];
    user: UserProfile;
    onUpdateUser: (user: UserProfile) => void;
    onComplete: () => void;
}

export const ChapterVerseSelection: React.FC<Props> = ({
    questions,
    user,
    onUpdateUser,
    onComplete,
}) => {
    const [selectedChapters, setSelectedChapters] = useState<
        { chapter: number; highestVerse: number }[]
    >([]);

    const [availableChapters, setAvailableChapters] = useState<number[]>([]);

    useEffect(() => {
        // Extract all unique chapters
        const allChapters = Array.from(new Set(questions.map((q) => q.chapter)));
        setAvailableChapters(allChapters);

        // Initialize selected chapters from user's known chapters
        const userChapters = user.knownChapters || [];
        const userVerses = user.knownVerses || [];

        const initialSelections = userChapters.map((chapter) => {
            // Find the highest verse the user knows in this chapter
            const versesInChapter = questions
                .filter((q) => q.chapter === chapter)
                .map((q) => q.verse);

            // Assume the user knows up to the highest verse they've selected
            const highestVerse = userVerses
                .filter((verse) =>
                    questions.some(
                        (q) => q.chapter === chapter && q.verse === verse
                    )
                )
                .sort((a, b) => b - a)[0];

            return {
                chapter,
                highestVerse: highestVerse || versesInChapter[versesInChapter.length - 1],
            };
        });

        setSelectedChapters(initialSelections);
    }, [questions, user]);

    const handleAddChapter = () => {
        setSelectedChapters([...selectedChapters, { chapter: 0, highestVerse: 0 }]);
    };

    const handleChapterChange = (index: number, chapter: number) => {
        const updatedSelections = [...selectedChapters];
        updatedSelections[index].chapter = chapter;
        updatedSelections[index].highestVerse = 0;

        // Remove any other entries with the same chapter to prevent duplicates
        const uniqueSelections = updatedSelections.filter(
            (selection, idx) =>
                selection.chapter !== 0 &&
                updatedSelections.findIndex((s) => s.chapter === selection.chapter) === idx
        );

        setSelectedChapters(uniqueSelections);
    };

    const handleHighestVerseChange = (index: number, highestVerse: number) => {
        const updatedSelections = [...selectedChapters];
        updatedSelections[index].highestVerse = highestVerse;
        setSelectedChapters(updatedSelections);
    };

    const handleRemoveChapter = (index: number) => {
        const updatedSelections = [...selectedChapters];
        updatedSelections.splice(index, 1);
        setSelectedChapters(updatedSelections);
    };

    const saveSelections = () => {
        const knownChapters = selectedChapters.map((selection) => selection.chapter);
        const knownVerses: number[] = [];

        // For each selected chapter, add all verses up to the highest known verse
        selectedChapters.forEach((selection) => {
            const versesInChapter = questions
                .filter((q) => q.chapter === selection.chapter)
                .map((q) => q.verse)
                .sort((a, b) => a - b);

            const highestVerseIndex = versesInChapter.findIndex(
                (v) => v === selection.highestVerse
            );

            if (highestVerseIndex !== -1) {
                const versesToAdd = versesInChapter.slice(0, highestVerseIndex + 1);
                knownVerses.push(...versesToAdd);
            }
        });

        const updatedUser = {
            ...user,
            knownChapters,
            knownVerses,
        };
        onUpdateUser(updatedUser);
        onComplete();
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 4,
                px: 4, 
            }}
        >
            <Typography variant="h4" align="center" gutterBottom>
                Select Known Chapters and Verses
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary">
                Add chapters you know and select the highest verse known in each.
            </Typography>

            {/* Chapters List */}
            <Paper
                elevation={3}
                sx={{
                    width: '100%',
                    maxWidth: 600,
                    mt: 4,
                    p: 2,
                }}
            >
                <Grid container direction="column" spacing={2}>
                    {selectedChapters.map((selection, index) => (
                        <Grid
                            item
                            container
                            spacing={2}
                            alignItems="center"
                            key={index}
                        >
                            {/* Chapter Selection */}
                            <Grid item xs={12} sm={5}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Chapter</InputLabel>
                                    <Select
                                        label="Chapter"
                                        value={selection.chapter}
                                        onChange={(e) =>
                                            handleChapterChange(index, e.target.value as number)
                                        }
                                    >
                                        {availableChapters
                                            .filter(
                                                (chapter) =>
                                                    !selectedChapters.some(
                                                        (sel) => sel.chapter === chapter
                                                    ) || selection.chapter === chapter
                                            )
                                            .map((chapter) => (
                                                <MenuItem value={chapter} key={chapter}>
                                                    Chapter {chapter}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Highest Verse Selection */}
                            <Grid item xs={12} sm={5}>
                                <FormControl fullWidth variant="outlined" disabled={!selection.chapter}>
                                    <InputLabel>Highest Verse Known</InputLabel>
                                    <Select
                                        label="Highest Verse Known"
                                        value={selection.highestVerse}
                                        onChange={(e) =>
                                            handleHighestVerseChange(index, e.target.value as number)
                                        }
                                    >
                                        {selection.chapter &&
                                            Array.from(
                                                new Set(
                                                    questions
                                                        .filter((q) => q.chapter === selection.chapter)
                                                        .map((q) => q.verse)
                                                )
                                            )
                                                .sort((a, b) => a - b)
                                                .map((verse) => (
                                                    <MenuItem value={verse} key={verse}>
                                                        Verse {verse}
                                                    </MenuItem>
                                                ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Remove Chapter Button */}
                            <Grid item xs={12} sm={2}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleRemoveChapter(index)}
                                >
                                    Delete
                                </Button>
                            </Grid>
                        </Grid>
                    ))}

                    {/* Add Chapter Button */}
                    <Grid item>
                        <Button
                            variant="outlined"
                            onClick={handleAddChapter}
                            disabled={
                                selectedChapters.length >= availableChapters.length
                            }
                        >
                            Add Chapter
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Save Button */}
            <Box sx={{ mt: 4 }}>
                <Button
                    variant="contained"
                    size="large"
                    onClick={saveSelections}
                    disabled={
                        selectedChapters.length === 0 ||
                        selectedChapters.some(
                            (selection) => !selection.chapter || !selection.highestVerse
                        )
                    }
                >
                    Save Selections
                </Button>
            </Box>
        </Box>
    );
};
