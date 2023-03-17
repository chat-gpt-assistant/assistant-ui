import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  TextareaAutosize,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MessageVersionControl, { MessageVersionControlProps } from './MessageVersionControl';

export interface MessageProps {
  sender: 'user' | 'assistant';
  text: string;
  onEdit?: (newText: string) => void;
  versionControl?: MessageVersionControlProps;
}

const Message: React.FC<MessageProps> = ({sender, text, onEdit, versionControl}) => {
  const theme = useTheme();
  const isLgScreen = useMediaQuery(theme.breakpoints.up('xl'));

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const isUser = sender === 'user';
  const avatarPlaceholder = isUser ? 'U' : 'A';

  const handleSave = () => {
    onEdit?.(editedText);
    setIsEditing(false);

  };
  const handleCancel = () => {
    setEditedText(text);
    setIsEditing(false);
  };

  const messageContent = (
    <Typography
      variant="body1"
      component="div"
      // color="white"
      ml={1}
    >
      {editedText}
    </Typography>
  );

  const editContent = (
    <Box display="flex" flexDirection="column" width="100%">
      <TextareaAutosize
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
        minRows={3}
        style={{
          width: '100%',
          marginLeft: '6px',
          resize: 'none',
          fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
          fontSize: '1rem',
          fontWeight: 400,
          lineHeight: 1.5,
          letterSpacing: '0.00938em',
          backgroundColor: 'transparent',
          border: 'none',
          outline: 'none',
          // color: 'white'
        }}
      />
      <Box display="flex" justifyContent="center" mt={1}>
        <Button variant="contained" color="primary" onClick={handleSave} size="small" sx={{mr: 1}}>
          Save & Exit
        </Button>
        <Button variant="outlined" onClick={handleCancel} size="small">
          Cancel
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box display="flex" justifyContent="center">
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
        width="100%"
        bgcolor={isUser ? 'grey.300' : 'grey.500'}
        p={1}>
        <Box display="flex"
             justifyContent="flex-start"
             flexGrow={1}
             maxWidth="md"
             position="relative"
        >
          {!isEditing && isUser && versionControl && (
            <Box style={{position: 'absolute', top: 0, left: isLgScreen ? -80 : 10 }}>
              <MessageVersionControl
                onPreviousVersion={versionControl.onPreviousVersion}
                onNextVersion={versionControl.onNextVersion}
                currentVersion={versionControl.currentVersion + 1}
                totalVersions={versionControl.totalVersions}
              />
            </Box>
          )}

          <Avatar>{avatarPlaceholder}</Avatar>

          {isEditing ? editContent : messageContent}

          {(onEdit && isUser && !isEditing) && (
            <IconButton
              onClick={() => setIsEditing(!isEditing)}
              size="small"
              edge="end"
              color="inherit"
              style={{position: 'absolute', top: 0, right: isLgScreen ? -40 : 10 }}
            >
              <EditIcon fontSize="inherit"/>
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Message;
