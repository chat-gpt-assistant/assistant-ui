import React from 'react';
import { Box, Button, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatItem from './ChatItem';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SettingsIcon from '@mui/icons-material/Settings';

const SidePanel: React.FC = () => {

  const chatItems = Array.from({length: 3}, (_, i) => (
    <ChatItem
      key={i}
      title={`Conversation ${i + 1}`}
      onEdit={() => console.log(`Edit Conversation ${i + 1}`)}
      onDelete={() => console.log(`Delete Conversation ${i + 1}`)}
    />
  ));

  return (
    <Box display="flex" flexDirection="column" height="100vh" p={1} bgcolor="grey.200">
      <Box mb={1}>
        <Button fullWidth startIcon={<AddIcon/>} variant="contained">
          New Chat
        </Button>
      </Box>

      <Box flexGrow={1} overflow="auto" mb={1}>
        {chatItems}
      </Box>

      <Divider/>
      <Box width="100%" display="flex" flexDirection="column" gap={1} mt={1}>
        <Button variant="outlined" color="secondary" startIcon={<DeleteSweepIcon/>}>
          Clear Conversations
        </Button>
        <Button variant="outlined" color="secondary" startIcon={<SettingsIcon/>}>
          Settings
        </Button>
      </Box>
    </Box>
  );
};

export default SidePanel;
