import React, { useState } from 'react';
import { Box, IconButton, TextareaAutosize, CircularProgress } from '@mui/material';
import MicNoneIcon from '@mui/icons-material/MicNone';
import SendIcon from '@mui/icons-material/Send';
import ResponseControl from './ResponseControl';

const InputPanel: React.FC = () => {
  const [isAssistantResponding, setIsAssistantResponding] = useState(false);
  const [text, setText] = useState('');

  const handleStopGenerating = () => {
    // Implement stopping the assistant's response generation
    setIsAssistantResponding(false);
  };

  const handleRegenerateResponse = () => {
    // Implement regenerating the assistant's response
    setIsAssistantResponding(true);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !isAssistantResponding) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (text.trim()) {
      // Implement the message submission logic here
      console.log('Submitted message:', text);
      setText('');
    }
  };

  return (
    <Box
      p={1}
      paddingTop={0}
      alignSelf="center"
      width="100%"
      maxWidth="md"
    >
      <Box display="flex" flexDirection="column" gap={2} flexGrow={1}>
        <ResponseControl
          isAssistantResponding={isAssistantResponding}
          onStopGenerating={handleStopGenerating}
          onRegenerateResponse={handleRegenerateResponse}
        />

        <form onSubmit={handleSubmit}>
          <Box
            display="flex"
            gap={1}
            flexGrow={1}
            alignItems="flex-end"
            sx={{
              position: 'relative',
              borderRadius: '4px',
              backgroundColor: 'grey.300',
            }}
          >
            <IconButton color="primary" sx={{position: 'absolute', left: 4, bottom: 8}}>
              <MicNoneIcon/>
            </IconButton>
            <TextareaAutosize
              minRows={1}
              maxRows={8}
              autoFocus={true}
              style={{
                width: '100%',
                minHeight: '40px',
                resize: 'none',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: '1rem',
                fontWeight: 400,
                lineHeight: 1.5,
                letterSpacing: '0.00938em',
                backgroundColor: 'transparent',
                outline: 'none',
                border: '1px solid rgba(0, 0, 0, 0.23)',
                borderRadius: '4px',
                padding: '8px 40px 8px 40px',
              }}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
            />

            <IconButton type="submit"
                        disabled={!text.trim() || isAssistantResponding}
                        color="primary"
                        sx={{position: 'absolute', right: 4, bottom: 8}}>
              {isAssistantResponding ? (
                <CircularProgress size={24}/>
              ) : (
                <SendIcon/>
              )}
            </IconButton>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default InputPanel;
