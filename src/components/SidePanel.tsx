import React, { useEffect } from 'react';
import { Alert, Box, Button, CircularProgress, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatItem from './ChatItem';
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchChats } from '../features/chat/chatSlice';
import { RootState } from '../app/store';
import { useAppDispatch, useAppSelector } from "../app/hooks";


const SidePanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const chats = useAppSelector((state: RootState) => state.chat.chats);
  const status = useAppSelector((state: RootState) => state.chat.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchChats());
    }
  }, [status, dispatch]);

  const chatItems = status === 'loading' ? (
    <Box display="flex" justifyContent="center">
      <CircularProgress/>
    </Box>
  ) : status === 'failed' ? (
    <Alert severity="error">Error loading chats.</Alert>
  ) : (
    chats.map((chat) => (
      <ChatItem
        key={chat.id}
        title={chat.title}
        onEdit={() => console.log(`Edit ${chat.title}`)}
        onDelete={() => console.log(`Delete ${chat.title}`)}
      />
    ))
  );

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
        <Button variant="outlined" color="secondary" startIcon={<DeleteIcon/>}>
          Clear Conversations
        </Button>
        {/*<Button variant="outlined" color="secondary" startIcon={<SettingsIcon/>}>*/}
        {/*  Settings*/}
        {/*</Button>*/}
      </Box>
    </Box>
  );
};

export default SidePanel;
