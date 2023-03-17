import React from 'react';
import { Box } from '@mui/material';
import ConversationHistory from './ConversationHistory';
import InputPanel from './InputPanel';

const MainContent: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" height="100vh" bgcolor="grey.200">
      <Box flexGrow={1} overflow="hidden">
        <ConversationHistory/>
      </Box>
      <Box display="flex" justifyContent="center" width="100%" sx={{
        background: 'linear-gradient(rgba(244, 244, 244, 0), rgba(244, 244, 244, 1))',
      }}>
        <InputPanel/>
      </Box>
    </Box>
  );
};

export default MainContent;
