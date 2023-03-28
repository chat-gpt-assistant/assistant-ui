import React, { useEffect } from 'react';
import { Alert, Box } from '@mui/material';
import ConversationHistory from './ConversationHistory';
import InputPanel from './InputPanel';
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchConversationByChatId,
  postNewMessageToConversation,
  resetSelectedChatStatus,
  selectIsAssistantResponding,
  selectSelectedConversation,
  selectSelectedConversationStatus,
  updateConversationMessageContent
} from "../../features/chat/chatSlice";
import { sseStart, sseStop } from "../../features/sse/sseSlice";

const Conversation: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedConversationStatus = useAppSelector(selectSelectedConversationStatus);
  const selectedConversation = useAppSelector(selectSelectedConversation);
  const isAssistantResponding = useAppSelector(selectIsAssistantResponding);

  const {id} = useParams();

  const handleEditMessage = (messageId: string, newText: string) => {
    dispatch(updateConversationMessageContent({chatId: id!, nodeId: messageId, newContent: newText}));
  };

  const handleSubmittedMessage = (message: string) => {
    dispatch(postNewMessageToConversation({
      chatId: id!,
      newMessage: message
    }));
  }

  const handlePreviousVersion = (prevMessageId: string) => {
    // we need to load chat history from the prevMessageId and down to the leaf
    dispatch(fetchConversationByChatId({
      chatId: id!,
      currentNode: prevMessageId,
      upperLimit: 0,
      lowerLimit: undefined //all you have (or can get)
    }));
  };

  const handleNextVersion = (nextMessageId: string) => {
    // we need to load chat history from the nextMessageId and down to the leaf
    dispatch(fetchConversationByChatId({
      chatId: id!,
      currentNode: nextMessageId,
      upperLimit: 0,
      lowerLimit: undefined //all you have (or can get)
    }));
  };

  const handleStopGenerating = () => {
    // TODO: implement logic for stopping the generation of messages
    // dispatch(sseStop());
  };

  const handleRegenerateResponse = () => {
    // TODO: implement logic for regenerating the response
    // the same as resubmitting previous user message, so we need to keep in store
  };

  useEffect(() => {
    dispatch(resetSelectedChatStatus());
  }, [id, dispatch]);

  useEffect(() => {
    if (!id) {
      return
    }

    dispatch(sseStart({ id }));

    return () => {
      dispatch(sseStop());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && selectedConversationStatus === 'idle') {
      dispatch(fetchConversationByChatId({chatId: id, upperLimit: 10, lowerLimit: 10}));
    }
  }, [selectedConversationStatus, dispatch, id]);

  return (
    <Box display="flex" flexDirection="column" height="100vh" bgcolor="grey.200" position="relative">
      <Box flexGrow={1} overflow="auto">
        {id && selectedConversation ? (
          <ConversationHistory conversation={selectedConversation}
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
        <InputPanel isAssistantResponding={isAssistantResponding}
                    onSubmitMessage={handleSubmittedMessage}
                    onStopGenerating={handleStopGenerating}
                    onRegenerateResponse={handleRegenerateResponse}/>
      </Box>
    </Box>
  );
};

export default Conversation;
