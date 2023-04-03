import React, { useEffect } from 'react';
import { Alert, Box } from '@mui/material';
import ConversationHistory from './ConversationHistory';
import InputPanel from './InputPanel';
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  changeReplyWithSpeech,
  fetchConversationByChatId,
  postNewMessageToConversation,
  regenerateResponse,
  resetSelectedChatStatus,
  selectAutoReplyWithSpeech,
  selectIsAssistantResponding,
  selectSelectedConversation,
  selectSelectedConversationStatus,
  stopGenerating,
  updateConversationMessageContent
} from "../../features/chat/chatSlice";
import { sseStart, sseStop } from "../../features/sse/sseSlice";

const Conversation: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedConversationStatus = useAppSelector(selectSelectedConversationStatus);
  const selectedConversation = useAppSelector(selectSelectedConversation);
  const isAssistantResponding = useAppSelector(selectIsAssistantResponding);
  const autoReplyWithSpeech = useAppSelector(selectAutoReplyWithSpeech);

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
    dispatch(fetchConversationByChatId({
      chatId: id!,
      currentNode: prevMessageId,
      upperLimit: 0,
      lowerLimit: 100
    }));
  };

  const handleNextVersion = (nextMessageId: string) => {
    dispatch(fetchConversationByChatId({
      chatId: id!,
      currentNode: nextMessageId,
      upperLimit: 0,
      lowerLimit: 100
    }));
  };

  const handleStopGenerating = () => {
    if (id) {
      dispatch(stopGenerating({chatId: id}));
    }
  };

  const handleRegenerateResponse = () => {
    if (id) {
      dispatch(regenerateResponse({chatId: id}));
    }
  };

  const handleReplyWithSpeech = (replyWithSpeech: boolean) => {
    dispatch(changeReplyWithSpeech(replyWithSpeech));
  };

  useEffect(() => {
    dispatch(resetSelectedChatStatus());
  }, [id, dispatch]);

  useEffect(() => {
    if (!id) {
      return
    }

    dispatch(sseStart({id}));

    return () => {
      dispatch(sseStop());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && selectedConversationStatus === 'idle') {
      dispatch(fetchConversationByChatId({chatId: id, upperLimit: 100, lowerLimit: 100}));
    }
  }, [selectedConversationStatus, dispatch, id]);

  if (!id) {
    return null;
  }

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
        <InputPanel key={id}
                    replyWithSpeech={autoReplyWithSpeech}
                    isAssistantResponding={isAssistantResponding}
                    onSubmitMessage={handleSubmittedMessage}
                    onStopGenerating={handleStopGenerating}
                    onRegenerateResponse={handleRegenerateResponse}
                    onReplyWithSpeech={handleReplyWithSpeech}/>
      </Box>
    </Box>
  );
};

export default Conversation;
