import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Chat, ChatNode, Message } from "../../models";
import ConversationMessage from "./ConversationMessage";

interface ConversationHistoryProps {
  chat: Chat;
}

function buildConversationHistory(chat: Chat): Message[] {
  const messages: Message[] = [];

  let currentChatNode = chat.mapping[chat.currentNode]

  if (currentChatNode.children && currentChatNode.children.length) {
    console.error("Current node has children, but it's not implemented yet.");
  }

  while (currentChatNode) {
    messages.unshift(currentChatNode.message);

    if (currentChatNode.parent) {
      currentChatNode = chat.mapping[currentChatNode.parent];
    } else {
      break;
    }
  }

  return messages;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({chat}) => {

  const handleEditMessage = (index: string, newText: string) => {
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

  const handlePreviousVersion = (index: string) => {
    // Implement logic to go to the previous version of the message.
  };

  const handleNextVersion = (index: string) => {
    // Implement logic to go to the next version of the message.
  };

  const messages = buildConversationHistory(chat);

  function getChatNode(messageId: string): ChatNode {
    return chat.mapping[messageId];
  }

  function getVersions(message: Message) {
    const chatNode = getChatNode(message.id);

    if (!chatNode.parent) {
      return [1, 1];
    }

    const parent = getChatNode(chatNode.parent);
    const siblings = parent.children;

    const currentVersion = siblings
      .map((sibling) => getChatNode(sibling))
      .findIndex((sibling) => sibling.id === chatNode.id);

    return [currentVersion + 1, siblings.length];
  }

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
        {chat.title}
      </Typography>

      <Box flexGrow={1}>
        {messages.map((message) => {
          const versions = getVersions(message);

          return (
            <ConversationMessage
              key={message.id}
              id={message.id}
              sender={message.author}
              text={message.content.parts.join()}
              onEdit={(newText) => handleEditMessage(message.id, newText)}
              versionControl={{
                onPreviousVersion: () => handlePreviousVersion(message.id),
                onNextVersion: () => handleNextVersion(message.id),
                totalVersions: versions[1],
                currentVersion: versions[0],
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default ConversationHistory;
