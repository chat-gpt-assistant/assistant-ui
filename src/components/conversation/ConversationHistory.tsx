import React from 'react';
import { Box, Typography } from '@mui/material';
import { ChatNode, Conversation, Message } from "../../models";
import ConversationMessage from "./ConversationMessage";
import AutoScrollComponent from "../AutoScrollComponent";

interface ConversationHistoryProps {
  conversation: Conversation;
  onEditMessage: (messageId: string, newText: string) => void;
  onPreviousVersion: (prevMessageId: string) => void;
  onNextVersion: (nextMessageId: string) => void;
}

/**
 * This function builds the conversation history from the current node down to the last child.
 * @param nodesSupplier - function that supplies the node by id
 * @param currentNodeId - id of the current node
 */
function buildConversationDownToTheLastChild(nodesSupplier: (nodeId: string) => ChatNode | null,
                                             currentNodeId: string): Message[] {
  const messages: Message[] = [];

  let currentNode = nodesSupplier(currentNodeId);

  while (currentNode) {
    const currentNodeChildren = currentNode.children;

    if (!currentNodeChildren || !currentNodeChildren.length) {
      // we reached the leaf node
      break;
    }

    const newestChild = currentNodeChildren[currentNodeChildren.length - 1];
    currentNode = nodesSupplier(newestChild);
    if (!currentNode) {
      break;
    }
    messages.push(currentNode.message);
  }

  return messages;
}

/**
 * This function builds the conversation history from the current node up to the root node.
 * @param nodesSupplier - function that supplies the node by id
 * @param currentNodeId - id of the current node
 */
function buildConversationHistoryUp(nodesSupplier: (nodeId: string) => ChatNode | null, currentNodeId: string): Message[] {
  const messages: Message[] = [];

  let currentNode = nodesSupplier(currentNodeId);

  while (currentNode) {
    if (!currentNode.parent) {
      break;
    }

    currentNode = nodesSupplier(currentNode.parent);
    if (!currentNode) {
      break;
    }
    messages.unshift(currentNode.message);
  }
  return messages;
}


// TODO: test this function
function createNodeSupplier(
  nodesMapping: { [p: string]: ChatNode },
  fetcher: (missingNodeId: string) => boolean
): (nodeId: string) => ChatNode | null {


  // try to fetch nodes until we reach the root node or leaf node
  return (nodeId: string): ChatNode | null => {
    const node = nodesMapping[nodeId];

    if (!node) {
      const final = fetcher(nodeId);
      if (final) {
        return null;
      }
    }

    return node;
  };
}

/**
 * This function builds the conversation history from the current node up to the root node and down to the last child (preference the last child).
 * @param nodesSupplier - function that supplies the node by id
 * @param conversation - conversation to build the history for
 */
function buildConversationHistory(conversation: Conversation, nodesSupplier: (nodeId: string) => ChatNode | null): Message[] {
  const currentNodeId = conversation.currentNode;

  let currentChatNode = nodesSupplier(currentNodeId);

  if (!currentChatNode) {
    return [];
  }

  return [
    ...buildConversationHistoryUp(nodesSupplier, currentChatNode.id),
    currentChatNode.message,
    ...buildConversationDownToTheLastChild(nodesSupplier, currentChatNode.id)
  ];
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({
                                                                   conversation,
                                                                   onEditMessage,
                                                                   onPreviousVersion,
                                                                   onNextVersion
                                                                 }) => {
  const nodesSupplier = createNodeSupplier(
    conversation.mapping,
    (missingNodeId: string) => {
      // TODO: try to fetch the missing nodes up or down
      // 1. find out the direction
      // 2. fetch the missing nodes


      return true;
    }
  );
  const messages = buildConversationHistory(conversation, nodesSupplier);

  const getVersions = (message: Message) => {
    const chatNode = nodesSupplier(message.id);

    if (!chatNode || !chatNode.parent) {
      return [1, 1];
    }

    const parent = nodesSupplier(chatNode.parent);
    if (!parent) {
      return [1, 1];
    }

    const siblings = parent.children;

    const currentVersion = siblings
      .map((sibling) => nodesSupplier(sibling))
      .findIndex((sibling) => sibling && sibling.id === chatNode.id);

    return [currentVersion + 1, siblings.length]; // TODO: fix, we can have [0, 0]
  };

  const getNextSiblingId = (messageId: string, step: number): string => {
    const currentNode = conversation.mapping[messageId];
    if (!currentNode.parent) {
      return messageId;
    }

    const parent = conversation.mapping[currentNode.parent];
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
        {conversation.title}
      </Typography>

      <AutoScrollComponent>
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
      </AutoScrollComponent>

    </Box>
  );
};

export default ConversationHistory;
