import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Message } from "../../models";
import ConversationMessage from "./ConversationMessage";

interface ConversationHistoryProps {
  chatId: string;
  messages: Message[];
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({chatId, messages}) => {


  const handleEditMessage = (index: number, newText: string) => {
    // Update the message at the specified index with the new text.
    // const updatedMessages = messages.map((message, i) => {
    //   if (i === index) {
    //     const updatedVersions = [...message, newText];
    //     return {
    //       ...message,
    //       text: newText,
    //       versions: updatedVersions,
    //       currentVersionIndex: updatedVersions.length - 1,
    //     };
    //   }
    //   return message;
    // });
    //
    // // Update the state with the new messages array.
    // setMessages(updatedMessages);
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
          <ConversationMessage
            key={index}
            sender={message.author}
            text={message.content.parts.join()}
            onEdit={(newText) => handleEditMessage(index, newText)}
            versionControl={{
              onPreviousVersion: () => handlePreviousVersion(index),
              onNextVersion: () => handleNextVersion(index),
              totalVersions: 1, // TODO: fix
              currentVersion: 1, // TODO: fix
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ConversationHistory;
