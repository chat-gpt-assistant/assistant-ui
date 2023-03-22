import React, { useEffect } from 'react';
import { Alert, Box, Button, CircularProgress, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatItem from './ChatItem';
import DeleteIcon from "@mui/icons-material/Delete";
import {
  createChat,
  deleteAllChats,
  deleteChat,
  fetchChats,
  selectChatsStatus, selectSelectedChat,
  selectSortedChats, updateChatTitle
} from '../../features/chat/chatSlice';
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const SidePanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const chats = useAppSelector(selectSortedChats);
  const chatsStatus = useAppSelector(selectChatsStatus);
  const selectedChat = useAppSelector(selectSelectedChat);

  const handleUpdateChatTitle = (chatId: string, newTitle: string) => {
    dispatch(updateChatTitle({chatId, newTitle}));
  };

  const handleDeleteChat = (chatId: string) => {
    dispatch(deleteChat(chatId));
  };

  const handleDeleteAllChats = () => {
    dispatch(deleteAllChats());
  };

  const handleNewChat = async () => {
    await dispatch(createChat());
  };

  useEffect(() => {
    if (chatsStatus === 'idle') {
      dispatch(fetchChats());
    }
  }, [chatsStatus, dispatch]);

  const chatItems = chatsStatus === 'loading' ? (
    <Box display="flex" justifyContent="center">
      <CircularProgress/>
    </Box>
  ) : chatsStatus === 'failed' ? (
    <Alert severity="error">Error loading chats.</Alert>
  ) : (
    chats.map((chat) => (
      <ChatItem
        key={chat.id}
        id={chat.id}
        active={chat.id === selectedChat?.id}
        title={chat.title}
        onEdit={(newTitle) => handleUpdateChatTitle(chat.id, newTitle)}
        onDelete={() => handleDeleteChat(chat.id)}
      />
    ))
  );

  return (
    <Box display="flex" flexDirection="column" height="100vh" p={1} bgcolor="grey.200">
      <Box mb={1}>
        <Button fullWidth startIcon={<AddIcon/>} variant="contained" onClick={handleNewChat}>
          New Chat
        </Button>
      </Box>

      <Box flexGrow={1} overflow="auto" mb={1}>
        {chatItems}
      </Box>

      <Divider/>
      <Box width="100%" display="flex" flexDirection="column" gap={1} mt={1}>
        <Button variant="outlined" color="secondary" startIcon={<DeleteIcon/>} onClick={handleDeleteAllChats}>
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
