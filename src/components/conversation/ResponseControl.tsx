import React from 'react';
import { Box, Button } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ResponseControlProps {
  isAssistantResponding: boolean;
  onStopGenerating: () => void;
  onRegenerateResponse: () => void;
}

const ResponseControl: React.FC<ResponseControlProps> = ({
                                                           isAssistantResponding,
                                                           onStopGenerating,
                                                           onRegenerateResponse,
                                                         }) => {
  const buttonText = isAssistantResponding ? 'Stop generating' : 'Regenerate response';
  const buttonIcon = isAssistantResponding ? <StopIcon /> : <RefreshIcon />;

  const handleClick = () => {
    if (isAssistantResponding) {
      onStopGenerating();
    } else {
      onRegenerateResponse();
    }
  };

  return (
    <Box display="flex"
         justifyContent="center"
         flexGrow={1}
         my={1}
    >
      <Button variant="contained" color="primary" onClick={handleClick} startIcon={buttonIcon}>
        {buttonText}
      </Button>
    </Box>
  );
};

export default ResponseControl;
