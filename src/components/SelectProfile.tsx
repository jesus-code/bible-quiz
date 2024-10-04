// src/components/SelectProfile.tsx
// src/components/ProfileSelection.tsx
import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Paper,
  Divider,
} from '@mui/material';

interface Props {
  userProfiles: UserProfile[];
  setCurrentUser: (user: UserProfile) => void;
  setUserProfiles: (profiles: UserProfile[]) => void;
}

export const SelectProfile: React.FC<Props> = ({
  userProfiles,
  setCurrentUser,
  setUserProfiles,
}) => {
  const [newUserName, setNewUserName] = useState('');

  const addUser = () => {
    if (newUserName.trim() !== '') {
      const newUser: UserProfile = {
        name: newUserName.trim(),
        knownChapters: [],
        knownVerses: [],
        stats: [],
      };
      setUserProfiles([...userProfiles, newUser]);
      setCurrentUser(newUser);
      setNewUserName('');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 4,
      }}
    >
      {/* Header */}
      <Typography variant="h4" align="center" gutterBottom>
        Welcome to Bible Quiz
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary">
        Please select your profile or create a new one to get started.
      </Typography>

      {/* Profile List */}
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 400,
          mt: 4,
          mb: 2,
        }}
      >
        <List>
          {userProfiles.map((profile) => (
            <React.Fragment key={profile.name}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => setCurrentUser(profile)}>
                  <ListItemText primary={profile.name} />
                </ListItemButton>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Create New Profile */}
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Create a New Profile
        </Typography>
        <TextField
          label="Profile Name"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          size="large"
          onClick={addUser}
          fullWidth
          disabled={newUserName.trim() === ''}
        >
          Create Profile
        </Button>
      </Paper>
    </Box>
  );
};
