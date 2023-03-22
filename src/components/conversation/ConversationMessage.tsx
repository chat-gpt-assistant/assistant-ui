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
import gptLogo from '../../logo.svg';

export interface MessageProps {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  onEdit?: (newText: string) => void;
  versionControl?: MessageVersionControlProps;
}

const ConversationMessage: React.FC<MessageProps> = ({id, sender, text, onEdit, versionControl}) => {
  const theme = useTheme();
  const isLgScreen = useMediaQuery(theme.breakpoints.up('xl'));

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [hovered, setHovered] = useState(false);
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

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSave();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  const messageContent = (
    <Typography
      variant="body1"
      width="100%"
      component="pre"
      sx={{
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
      // color="white"
    >
      {editedText}
    </Typography>
  );

  const editContent = (
    <Box display="flex" flexDirection="column" width="100%">
      <form onSubmit={handleFormSubmit}>
        <TextareaAutosize
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          onKeyDown={handleKeyDown}
          minRows={2}
          style={{
            width: '100%',
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

        <Box display="flex" justifyContent="center" mt={.5}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            sx={{ mr: 1 }}
          >
            Save & Exit
          </Button>
          <Button variant="outlined" onClick={handleCancel} size="small">
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      width="100%"
      bgcolor={isUser ? 'grey.300' : 'grey.500'}
      p={1}
      onMouseOver={(e) => setHovered(true)}
      onMouseLeave={(e) => setHovered(false)}
    >
      <Box display="flex"
           justifyContent="center"
           gap={isLgScreen ? 2 : 1}
           flexGrow={1}
           maxWidth="md"
      >
        <Box display="flex"
             justifyContent="flex-end"
             flexDirection={isLgScreen ? 'row' : 'column-reverse'}
             gap={1}
             width={isLgScreen ? 100 : 50}
             minWidth={isLgScreen ? 100 : 50}
        >
          {!isEditing && versionControl && hovered && (
            <Box>
              <MessageVersionControl
                onPreviousVersion={versionControl.onPreviousVersion}
                onNextVersion={versionControl.onNextVersion}
                currentVersion={versionControl.currentVersion}
                totalVersions={versionControl.totalVersions}
              />
            </Box>
          )}

          <Avatar variant="square" alt={sender} src={isUser ? "" : gptLogo}>{avatarPlaceholder}</Avatar>
        </Box>

        <Box flexGrow={1}>
          {isEditing ? editContent : messageContent}
        </Box>

        <Box width={30} minWidth={30}>
          {(onEdit && isUser && !isEditing && hovered) && (
            <IconButton
              onClick={() => setIsEditing(!isEditing)}
              size="small"
              color="inherit"
            >
              <EditIcon fontSize="inherit"/>
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ConversationMessage;
