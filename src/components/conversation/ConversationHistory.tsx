import React from 'react';
import { Box, Typography } from '@mui/material';
import { Chat, ChatNode, Message } from "../../models";
import ConversationMessage from "./ConversationMessage";

interface ConversationHistoryProps {
  chat: Chat;
  onEditMessage: (messageId: string, newText: string) => void;
  onPreviousVersion: (prevMessageId: string) => void;
  onNextVersion: (nextMessageId: string) => void;
}

/**
 * This function builds the conversation history from the current node down to the last child.
 * @param nodesMapping - mapping of all nodes in the chat
 * @param currentNodeId - id of the current node
 * @param inclusive - if true, the current node will be included in the result
 */
function buildConversationDownToTheLastChild(nodesMapping: { [p: string]: ChatNode },
                                             currentNodeId: string,
                                             inclusive = false): Message[] {
  const messages: Message[] = [];

  let currentNode = nodesMapping[currentNodeId];

  if (inclusive) {
    messages.push(currentNode.message);
  }

  while (true) {
    const currentNodeChildren = currentNode.children;

    if (!currentNodeChildren || !currentNodeChildren.length) {
      // we reached the leaf node
      break;
    }

    const newestChild = currentNodeChildren[currentNodeChildren.length - 1];
    currentNode = nodesMapping[newestChild];

    messages.push(currentNode.message);
  }

  return messages;
}

/**
 * This function builds the conversation history from the current node up to the root node and down to the last child (preferencing the last child).
 * @param nodesMapping - mapping of all nodes in the chat
 * @param currentNodeId - id of the current node
 */
function buildConversationHistory(nodesMapping: { [p: string]: ChatNode },
                                  currentNodeId: string): Message[] {
  const messages: Message[] = [];

  let currentChatNode = nodesMapping[currentNodeId]

  if (!currentChatNode) {
    // TODO: Handle this case, when chat has just been created. We should get title from summary of the first message.
    return messages;
  }

  if (currentChatNode.children && currentChatNode.children.length) {
    messages.push(...(buildConversationDownToTheLastChild(nodesMapping, currentChatNode.id)));
  }

  while (currentChatNode) {
    messages.unshift(currentChatNode.message);

    if (currentChatNode.parent) {
      currentChatNode = nodesMapping[currentChatNode.parent];
    } else {
      break;
    }
  }

  return messages;
}

/**
 * This function builds the conversation history for the specified chat.
 * @param chat - chat to build the conversation history for
 */
function buildConversationHistoryForChat(chat: Chat) {
  return buildConversationHistory(chat.mapping, chat.currentNode);
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({
                                                                   chat,
                                                                   onEditMessage,
                                                                   onPreviousVersion,
                                                                   onNextVersion
                                                                 }) => {
  const messages = buildConversationHistoryForChat(chat);

  const getChatNode = (messageId: string): ChatNode => chat.mapping[messageId];

  const getVersions = (message: Message) => {
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
  };

  const getNextSiblingId = (messageId: string, step: number): string => {
    const currentNode = chat.mapping[messageId];
    if (!currentNode.parent) {
      return messageId;
    }

    const parent = chat.mapping[currentNode.parent];
    const children = parent.children;
    if (!children.length) {
      return messageId;
    }

    const currentNodeId = children.findIndex((child) => child === messageId);
    const nextIndex = currentNodeId + step;

    if (nextIndex < 0) {
      return children[0];
    } else if (nextIndex >= children.length) {
      return children[children.length - 1];
    } else {
      return children[nextIndex];
    }
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
              onEdit={(newText) => onEditMessage(message.id, newText)}
              versionControl={{
                onPreviousVersion: () => onPreviousVersion(getNextSiblingId(message.id, -1)),
                onNextVersion: () => onNextVersion(getNextSiblingId(message.id, 1)),
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
