import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import MicNoneIcon from '@mui/icons-material/MicNone';
import ResponseControl from './ResponseControl';

const InputPanel: React.FC = () => {
  const [isAssistantResponding, setIsAssistantResponding] = React.useState(false);

  const handleStopGenerating = () => {
    // Implement stopping the assistant's response generation
    setIsAssistantResponding(false);
  };

  const handleRegenerateResponse = () => {
    // Implement regenerating the assistant's response
    setIsAssistantResponding(true);
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
        <Box display="flex" gap={2} flexGrow={1}>
          <Button color="primary">
            <MicNoneIcon/>
          </Button>
          <TextField fullWidth variant="outlined" placeholder="Type your message"/>
          <Button variant="contained" color="primary">
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default InputPanel;
