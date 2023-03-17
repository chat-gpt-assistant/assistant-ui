import React from 'react';
import { Box } from '@mui/material';
import ConversationHistory from './ConversationHistory';
import InputPanel from './InputPanel';

const MainContent: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" height="100vh" bgcolor="grey.200" position="relative">
      <Box flexGrow={1} overflow="auto">
        <ConversationHistory/>
      </Box>
      <Box display="flex" justifyContent="center" width="100%" sx={{
        position: 'absolute',
        bottom: 0,
        zIndex: 1,
        background: 'linear-gradient(rgba(238, 238, 238, 0), rgba(238, 238, 238, 0.8))',
      }}>
        <InputPanel/>
      </Box>
    </Box>
  );
};

export default MainContent;
