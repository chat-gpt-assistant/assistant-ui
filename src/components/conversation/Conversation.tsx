import React, { useEffect } from 'react';
import { Alert, Box } from '@mui/material';
import ConversationHistory from './ConversationHistory';
import InputPanel from './InputPanel';
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchChatById,
  postNewChatNode,
  resetSelectedChatStatus,
  selectSelectedChat,
  selectSelectedChatStatus,
  updateChatNodeMessageContent
} from "../../features/chat/chatSlice";

const Conversation: React.FC = () => {
  const { id } = useParams();

  const dispatch = useAppDispatch();
  const selectedChatStatus = useAppSelector(selectSelectedChatStatus);
  const selectedChat = useAppSelector(selectSelectedChat);

  const handleEditMessage = (messageId: string, newText: string) => {
    dispatch(updateChatNodeMessageContent({chatId: id!, nodeId: messageId, newContent: newText}));
  };

  const handleSubmittedMessage = (message: string) => {
    dispatch(postNewChatNode({chatId: id!, nodeId: selectedChat!.currentNode, newMessage: message}));
  }

  const handlePreviousVersion = (prevMessageId: string) => {
    // we need to load chat history from the prevMessageId and down to the leaf
    dispatch(fetchChatById({
      chatId: id!,
      currentNode: prevMessageId,
      upperLimit: 0,
      lowerLimit: undefined //all you have (or can get)
    }));
  };

  const handleNextVersion = (nextMessageId: string) => {
    // we need to load chat history from the nextMessageId and down to the leaf
    dispatch(fetchChatById({
      chatId: id!,
      currentNode: nextMessageId,
      upperLimit: 0,
      lowerLimit: undefined //all you have (or can get)
    }));
  };

  const handleStopGenerating = () => {
    // TODO: implement logic for stopping the generation of messages
  };

  const handleRegenerateResponse = () => {
    // TODO: implement logic for regenerating the response
    // the same as resubmitting previous user message, so we need to keep in store
  };

  useEffect(() => {
    dispatch(resetSelectedChatStatus());
  }, [id, dispatch]);

  useEffect(() => {
    if (id && selectedChatStatus === 'idle') {
      dispatch(fetchChatById({ chatId: id }));
    }
  }, [selectedChatStatus, dispatch, id]);

  return (
    <Box display="flex" flexDirection="column" height="100vh" bgcolor="grey.200" position="relative">
      <Box flexGrow={1} overflow="auto">
        {id && selectedChat ? (
          <ConversationHistory chat={selectedChat}
                               onEditMessage={handleEditMessage}
                               onPreviousVersion={handlePreviousVersion}
                               onNextVersion={handleNextVersion}/>
        ) : (
          <Alert severity="info">
            Please select a chat from the side panel.
          </Alert>
        )}
      </Box>

      <Box display="flex" justifyContent="center" width="100%" sx={{
        position: 'absolute',
        bottom: 0,
        zIndex: 1,
        background: 'linear-gradient(rgba(238, 238, 238, 0), rgba(238, 238, 238, 0.8))',
      }}>
        <InputPanel onSubmitMessage={handleSubmittedMessage}
                    onStopGenerating={handleStopGenerating}
                    onRegenerateResponse={handleRegenerateResponse}/>
      </Box>
    </Box>
  );
};

export default Conversation;
