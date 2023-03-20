import React, { useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Message, { MessageProps } from './Message';

interface ExtendedMessageProps extends MessageProps {
  versions: string[];
  currentVersionIndex: number;
}

const ConversationHistory: React.FC = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState<ExtendedMessageProps[]>([

  ]);

  const handleEditMessage = (index: number, newText: string) => {
    // Update the message at the specified index with the new text.
    const updatedMessages = messages.map((message, i) => {
      if (i === index) {
        const updatedVersions = [...message.versions, newText];
        return {
          ...message,
          text: newText,
          versions: updatedVersions,
          currentVersionIndex: updatedVersions.length - 1,
        };
      }
      return message;
    });

    // Update the state with the new messages array.
    setMessages(updatedMessages);
  };

  const handlePreviousVersion = (index: number) => {
    // Implement logic to go to the previous version of the message.
  };

  const handleNextVersion = (index: number) => {
    // Implement logic to go to the next version of the message.
  };


  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      width="100%"
      overflow="auto"
      paddingBottom={20}
      bgcolor="grey.300"
    >
      <Typography variant="h6" m={1}>
        Conversation History
      </Typography>
      <Box flexGrow={1}>
        {messages.map((message, index) => (
          <Message
            key={index}
            sender={message.sender}
            text={message.text}
            onEdit={(newText) => handleEditMessage(index, newText)}
            versionControl={{
              onPreviousVersion: () => handlePreviousVersion(index),
              onNextVersion: () => handleNextVersion(index),
              totalVersions: message.versions.length,
              currentVersion: message.currentVersionIndex,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ConversationHistory;
