// src/components/ChapterVerseSelection.tsx
import React, { useState, useEffect } from 'react';
import { Question, UserProfile, BookProgress } from '../types';
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
    Divider,
} from '@mui/material';

interface Props {
    questions: Question[];
    user: UserProfile;
    onUpdateUser: (user: UserProfile) => void;
    onComplete: () => void;
}

interface BookSelection {
    book: string;
    selectedChapters: { chapter: number; highestVerse: number }[];
}

export const ChapterVerseSelection: React.FC<Props> = ({
    questions,
    user,
    onUpdateUser,
    onComplete,
}) => {
    const [bookSelections, setBookSelections] = useState<BookSelection[]>([]);
    const [availableBooks, setAvailableBooks] = useState<string[]>([]);
    const [newBookToAdd, setNewBookToAdd] = useState<string>('');

    useEffect(() => {
        // Extract all unique books
        const allBooks = Array.from(new Set(questions.map((q) => q.book))).sort();
        setAvailableBooks(allBooks);

        // Initialize selections from user's book progress
        const initialSelections: BookSelection[] = [];
        
        if (user.bookProgress && user.bookProgress.length > 0) {
            user.bookProgress.forEach(bp => {
                const selectedChapters = bp.knownChapters.map(chapter => {
                    // Find the highest verse the user knows in this chapter
                    const versesInChapter = questions
                        .filter(q => q.book === bp.book && q.chapter === chapter)
                        .map(q => q.verse)
                        .sort((a, b) => a - b);

                    const highestVerse = bp.knownVerses
                        .filter(verse => 
                            questions.some(q => 
                                q.book === bp.book && 
                                q.chapter === chapter && 
                                q.verse === verse
                            )
                        )
                        .sort((a, b) => b - a)[0] || versesInChapter[versesInChapter.length - 1];

                    return { chapter, highestVerse };
                });

                initialSelections.push({
                    book: bp.book,
                    selectedChapters
                });
            });
        }

        setBookSelections(initialSelections);
    }, [questions, user]);

    const handleAddBook = () => {
        if (newBookToAdd && !bookSelections.some(bs => bs.book === newBookToAdd)) {
            setBookSelections([...bookSelections, { 
                book: newBookToAdd, 
                selectedChapters: [] 
            }]);
            setNewBookToAdd('');
        }
    };

    const handleRemoveBook = (bookIndex: number) => {
        const updatedSelections = [...bookSelections];
        updatedSelections.splice(bookIndex, 1);
        setBookSelections(updatedSelections);
    };

    const handleAddChapterToBook = (bookIndex: number) => {
        const updatedSelections = [...bookSelections];
        const availableChapters = Array.from(new Set(
            questions
                .filter(q => q.book === updatedSelections[bookIndex].book)
                .map(q => q.chapter)
        )).sort((a, b) => a - b);

        const availableChapter = availableChapters.find(chapter =>
            !updatedSelections[bookIndex].selectedChapters.some(sc => sc.chapter === chapter)
        );

        if (availableChapter) {
            updatedSelections[bookIndex].selectedChapters.push({
                chapter: availableChapter,
                highestVerse: 1
            });
            setBookSelections(updatedSelections);
        }
    };

    const handleChapterChange = (bookIndex: number, chapterIndex: number, chapter: number) => {
        const updatedSelections = [...bookSelections];
        updatedSelections[bookIndex].selectedChapters[chapterIndex].chapter = chapter;
        updatedSelections[bookIndex].selectedChapters[chapterIndex].highestVerse = 1;
        setBookSelections(updatedSelections);
    };

    const handleHighestVerseChange = (bookIndex: number, chapterIndex: number, highestVerse: number) => {
        const updatedSelections = [...bookSelections];
        updatedSelections[bookIndex].selectedChapters[chapterIndex].highestVerse = highestVerse;
        setBookSelections(updatedSelections);
    };

    const handleRemoveChapter = (bookIndex: number, chapterIndex: number) => {
        const updatedSelections = [...bookSelections];
        updatedSelections[bookIndex].selectedChapters.splice(chapterIndex, 1);
        setBookSelections(updatedSelections);
    };

    const saveSelections = () => {
        const bookProgress: BookProgress[] = bookSelections.map(bookSelection => {
            const knownChapters = bookSelection.selectedChapters.map(sc => sc.chapter);
            const knownVerses: number[] = [];

            // For each selected chapter, add all verses up to the highest known verse
            bookSelection.selectedChapters.forEach(sc => {
                const versesInChapter = questions
                    .filter(q => q.book === bookSelection.book && q.chapter === sc.chapter)
                    .map(q => q.verse)
                    .sort((a, b) => a - b);

                const highestVerseIndex = versesInChapter.findIndex(v => v === sc.highestVerse);
                if (highestVerseIndex !== -1) {
                    const versesToAdd = versesInChapter.slice(0, highestVerseIndex + 1);
                    knownVerses.push(...versesToAdd);
                }
            });

            return {
                book: bookSelection.book,
                knownChapters,
                knownVerses
            };
        });

        const updatedUser = {
            ...user,
            bookProgress,
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
                Select Known Books, Chapters, and Verses
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary">
                Add books you know, then select chapters and the highest verse known in each.
            </Typography>

            {/* Books List */}
            <Paper
                elevation={3}
                sx={{
                    width: '100%',
                    maxWidth: 800,
                    mt: 4,
                    p: 2,
                }}
            >
                {bookSelections.map((bookSelection, bookIndex) => (
                    <Box key={bookIndex} sx={{ mb: 4 }}>
                        {/* Book Header */}
                        <Paper 
                            elevation={1} 
                            sx={{ 
                                p: 2, 
                                mb: 2, 
                                backgroundColor: 'primary.main', 
                                color: 'primary.contrastText',
                                display: 'flex', 
                                alignItems: 'center',
                                borderRadius: 1
                            }}
                        >
                            <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                                📖 {bookSelection.book}
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleRemoveBook(bookIndex)}
                                sx={{ 
                                    color: 'primary.contrastText', 
                                    borderColor: 'primary.contrastText',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}
                            >
                                Remove Book
                            </Button>
                        </Paper>

                        {/* Chapters for this book */}
                        <Box sx={{ pl: 2, pr: 1 }}>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: 'text.secondary' }}>
                                Chapters & Verses:
                            </Typography>
                            <Grid container direction="column" spacing={2}>
                            {bookSelection.selectedChapters.map((chapterSelection, chapterIndex) => {
                                const availableChapters = Array.from(new Set(
                                    questions
                                        .filter(q => q.book === bookSelection.book)
                                        .map(q => q.chapter)
                                )).sort((a, b) => a - b);

                                return (
                                    <Grid
                                        item
                                        container
                                        spacing={2}
                                        alignItems="center"
                                        key={chapterIndex}
                                    >
                                        {/* Chapter Selection */}
                                        <Grid item xs={12} sm={4}>
                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel>Chapter</InputLabel>
                                                <Select
                                                    label="Chapter"
                                                    value={chapterSelection.chapter}
                                                    onChange={(e) =>
                                                        handleChapterChange(bookIndex, chapterIndex, e.target.value as number)
                                                    }
                                                >
                                                    {availableChapters
                                                        .filter(chapter =>
                                                            !bookSelection.selectedChapters.some(
                                                                (sc, idx) => sc.chapter === chapter && idx !== chapterIndex
                                                            )
                                                        )
                                                        .map(chapter => (
                                                            <MenuItem value={chapter} key={chapter}>
                                                                Chapter {chapter}
                                                            </MenuItem>
                                                        ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Highest Verse Selection */}
                                        <Grid item xs={12} sm={4}>
                                            <FormControl fullWidth variant="outlined" disabled={!chapterSelection.chapter}>
                                                <InputLabel>Highest Verse Known</InputLabel>
                                                <Select
                                                    label="Highest Verse Known"
                                                    value={chapterSelection.highestVerse}
                                                    onChange={(e) =>
                                                        handleHighestVerseChange(bookIndex, chapterIndex, e.target.value as number)
                                                    }
                                                >
                                                    {chapterSelection.chapter &&
                                                        Array.from(
                                                            new Set(
                                                                questions
                                                                    .filter(q => q.book === bookSelection.book && q.chapter === chapterSelection.chapter)
                                                                    .map(q => q.verse)
                                                            )
                                                        )
                                                            .sort((a, b) => a - b)
                                                            .map(verse => (
                                                                <MenuItem value={verse} key={verse}>
                                                                    Verse {verse}
                                                                </MenuItem>
                                                            ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Remove Chapter Button */}
                                        <Grid item xs={12} sm={4}>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleRemoveChapter(bookIndex, chapterIndex)}
                                            >
                                                Remove Chapter
                                            </Button>
                                        </Grid>
                                    </Grid>
                                );
                            })}

                            {/* Add Chapter Button */}
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleAddChapterToBook(bookIndex)}
                                    disabled={
                                        bookSelection.selectedChapters.length >= 
                                        Array.from(new Set(
                                            questions
                                                .filter(q => q.book === bookSelection.book)
                                                .map(q => q.chapter)
                                        )).length
                                    }
                                >
                                    Add Chapter to {bookSelection.book}
                                </Button>
                            </Grid>
                        </Grid>
                        </Box>

                        {bookIndex < bookSelections.length - 1 && <Divider sx={{ mt: 3 }} />}
                    </Box>
                ))}

                {/* Add Book Section */}
                <Box sx={{ mt: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={8}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Select Book to Add</InputLabel>
                                <Select
                                    label="Select Book to Add"
                                    value={newBookToAdd}
                                    onChange={(e) => setNewBookToAdd(e.target.value as string)}
                                >
                                    {availableBooks
                                        .filter(book => !bookSelections.some(bs => bs.book === book))
                                        .sort((a, b) => {
                                            // Custom order array
                                            const customOrder = [
                                                "1 Corinthians",
                                                "2 Corinthians",
                                                "1 John",
                                                "2 John",
                                                "3 John",
                                                "Jude",
                                                "John"
                                            ];
                                            const indexA = customOrder.indexOf(a);
                                            const indexB = customOrder.indexOf(b);

                                            // If both are in customOrder, sort by their index
                                            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                                            // If only a is in customOrder, it comes first
                                            if (indexA !== -1) return -1;
                                            // If only b is in customOrder, it comes first
                                            if (indexB !== -1) return 1;
                                            // Otherwise, sort alphabetically
                                            return a.localeCompare(b);
                                        })
                                        .map(book => (
                                            <MenuItem value={book} key={book}>
                                                {book}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                variant="outlined"
                                onClick={handleAddBook}
                                disabled={!newBookToAdd || bookSelections.length >= availableBooks.length}
                                fullWidth
                            >
                                Add Book
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {/* Save Button */}
            <Box sx={{ mt: 4 }}>
                <Button
                    variant="contained"
                    size="large"
                    onClick={saveSelections}
                    disabled={
                        bookSelections.length === 0 ||
                        bookSelections.some(bs => 
                            bs.selectedChapters.length === 0 ||
                            bs.selectedChapters.some(sc => !sc.chapter || !sc.highestVerse)
                        )
                    }
                >
                    Save Selections
                </Button>
            </Box>
        </Box>
    );
};
