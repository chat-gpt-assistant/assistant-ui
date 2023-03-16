import React from 'react';
import { Box } from '@mui/material';
import ConversationHistory from './ConversationHistory';
import InputPanel from './InputPanel';

const MainContent: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box flexGrow={1} bgcolor="grey.200" overflow="hidden">
        <ConversationHistory/>
      </Box>
      <Box p={1} alignSelf="center" width="100%" maxWidth="md">
        <InputPanel/>
      </Box>
    </Box>
  );
};

export default MainContent;
