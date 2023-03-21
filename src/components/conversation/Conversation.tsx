import React, { useEffect, useState } from 'react';
import { Alert, Box } from '@mui/material';
import ConversationHistory from './ConversationHistory';
import InputPanel from './InputPanel';
import { useParams } from "react-router-dom";
import { Message } from "../../models";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchChatById, selectSelectedChatStatus } from "../../features/chat/chatSlice";

const Conversation: React.FC = () => {
  const { id } = useParams();

  const dispatch = useAppDispatch();
  const selectedChatStatus = useAppSelector(selectSelectedChatStatus);

  useEffect(() => {
    if (id && selectedChatStatus === 'idle') {
      dispatch(fetchChatById(id));
    }
  }, [selectedChatStatus, dispatch, id]);

  const [messages, setMessages] = useState<Message[]>([

  ]);

  const conversationHistory = id ? (
    <ConversationHistory chatId={id} messages={messages}/>
  ) : (
    <Alert severity="info">
      Please select a chat from the side panel.
    </Alert>
  );

  return (
    <Box display="flex" flexDirection="column" height="100vh" bgcolor="grey.200" position="relative">
      <Box flexGrow={1} overflow="auto">
        {conversationHistory}
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

export default Conversation;
