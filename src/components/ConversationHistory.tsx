import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Message, { MessageProps } from './Message';

interface ExtendedMessageProps extends MessageProps {
  versions: string[];
  currentVersionIndex: number;
}

const ConversationHistory: React.FC = () => {
  const [messages, setMessages] = useState<ExtendedMessageProps[]>([
    {
      sender: 'user',
      text: 'um et malesuada fames ac ante ipsum primis in faucibus. Maecenas suscipit risus elit, ut aliquet metus viverra at. Maecenas commodo, mi ac volutpat dictum, mi orci bibendum enim, nec suscipit ex lacus non lorem. Proin accumsan lectus in nulla semper tempor. Quisque sit amet dolor suscipit, consequat dolor sit amet, volutpat magna. Donec gravida sapien sapien. Pellentesque vulputate elementum viverra.', // original text
      versions: ['1', '2'], // array containing the original text
      currentVersionIndex: 1, // index of the current version
    },
    {
      sender: 'assistant',
      text: 'um et malesuada fames ac ante ipsum primis in faucibus. Maecenas suscipit risus elit, ut aliquet metus viverra at. Maecenas commodo, mi ac volutpat dictum, mi orci bibendum enim, nec suscipit ex lacus non lorem. Proin accumsan lectus in nulla semper tempor. Quisque sit amet dolor suscipit, consequat dolor sit amet, volutpat magna. Donec gravida sapien sapien. Pellentesque vulputate elementum viverra.', // original text
      versions: ['1', '2'], // array containing the original text
      currentVersionIndex: 0, // index of the current version
    },
    {
      sender: 'assistant',
      text: 'um et malesuada fames ac ante ipsum primis in faucibus. Maecenas suscipit risus elit, ut aliquet metus viverra at. Maecenas commodo, mi ac volutpat dictum, mi orci bibendum enim, nec suscipit ex lacus non lorem. Proin accumsan lectus in nulla semper tempor. Quisque sit amet dolor suscipit, consequat dolor sit amet, volutpat magna. Donec gravida sapien sapien. Pellentesque vulputate elementum viverra.', // original text
      versions: ['1', '2'], // array containing the original text
      currentVersionIndex: 0, // index of the current version
    },
    {
      sender: 'assistant',
      text: 'um et malesuada fames ac ante ipsum primis in faucibus. Maecenas suscipit risus elit, ut aliquet metus viverra at. Maecenas commodo, mi ac volutpat dictum, mi orci bibendum enim, nec suscipit ex lacus non lorem. Proin accumsan lectus in nulla semper tempor. Quisque sit amet dolor suscipit, consequat dolor sit amet, volutpat magna. Donec gravida sapien sapien. Pellentesque vulputate elementum viverra.', // original text
      versions: ['1', '2'], // array containing the original text
      currentVersionIndex: 0, // index of the current version
    },
    {
      sender: 'assistant',
      text: 'um et malesuada fames ac ante ipsum primis in faucibus. Maecenas suscipit risus elit, ut aliquet metus viverra at. Maecenas commodo, mi ac volutpat dictum, mi orci bibendum enim, nec suscipit ex lacus non lorem. Proin accumsan lectus in nulla semper tempor. Quisque sit amet dolor suscipit, consequat dolor sit amet, volutpat magna. Donec gravida sapien sapien. Pellentesque vulputate elementum viverra.', // original text
      versions: ['1', '2'], // array containing the original text
      currentVersionIndex: 0, // index of the current version
    }, {
      sender: 'assistant',
      text: 'um et malesuada fames ac ante ipsum primis in faucibus. Maecenas suscipit risus elit, ut aliquet metus viverra at. Maecenas commodo, mi ac volutpat dictum, mi orci bibendum enim, nec suscipit ex lacus non lorem. Proin accumsan lectus in nulla semper tempor. Quisque sit amet dolor suscipit, consequat dolor sit amet, volutpat magna. Donec gravida sapien sapien. Pellentesque vulputate elementum viverra.', // original text
      versions: ['1', '2'], // array containing the original text
      currentVersionIndex: 0, // index of the current version
    },
    {
      sender: 'assistant',
      text: 'um et malesuada fames ac ante ipsum primis in faucibus. Maecenas suscipit risus elit, ut aliquet metus viverra at. Maecenas commodo, mi ac volutpat dictum, mi orci bibendum enim, nec suscipit ex lacus non lorem. Proin accumsan lectus in nulla semper tempor. Quisque sit amet dolor suscipit, consequat dolor sit amet, volutpat magna. Donec gravida sapien sapien. Pellentesque vulputate elementum viverra.', // original text
      versions: ['1', '2'], // array containing the original text
      currentVersionIndex: 0, // index of the current version
    },
    {
      sender: 'assistant',
      text: 'um et malesuada fames ac ante ipsum primis in faucibus. Maecenas suscipit risus elit, ut aliquet metus viverra at. Maecenas commodo, mi ac volutpat dictum, mi orci bibendum enim, nec suscipit ex lacus non lorem. Proin accumsan lectus in nulla semper tempor. Quisque sit amet dolor suscipit, consequat dolor sit amet, volutpat magna. Donec gravida sapien sapien. Pellentesque vulputate elementum viverra.', // original text
      versions: ['1', '2'], // array containing the original text
      currentVersionIndex: 0, // index of the current version
    },
    {
      sender: 'assistant',
      text: 'um et malesuada fames ac ante ipsum primis in faucibus. Maecenas suscipit risus elit, ut aliquet metus viverra at. Maecenas commodo, mi ac volutpat dictum, mi orci bibendum enim, nec suscipit ex lacus non lorem. Proin accumsan lectus in nulla semper tempor. Quisque sit amet dolor suscipit, consequat dolor sit amet, volutpat magna. Donec gravida sapien sapien. Pellentesque vulputate elementum viverra.', // original text
      versions: ['1', '2'], // array containing the original text
      currentVersionIndex: 0, // index of the current version
    },
    {
      sender: 'assistant',
      text: 'um et malesuada fames ac ante ipsum primis in faucibus. Maecenas suscipit risus elit, ut aliquet metus viverra at. Maecenas commodo, mi ac volutpat dictum, mi orci bibendum enim, nec suscipit ex lacus non lorem. Proin accumsan lectus in nulla semper tempor. Quisque sit amet dolor suscipit, consequat dolor sit amet, volutpat magna. Donec gravida sapien sapien. Pellentesque vulputate elementum viverra.', // original text
      versions: ['1', '2'], // array containing the original text
      currentVersionIndex: 0, // index of the current version
    },
    {
      sender: 'assistant',
      text: 'um et malesuada fames ac ante ipsum primis in faucibus. Maecenas suscipit risus elit, ut aliquet metus viverra at. Maecenas commodo, mi ac volutpat dictum, mi orci bibendum enim, nec suscipit ex lacus non lorem. Proin accumsan lectus in nulla semper tempor. Quisque sit amet dolor suscipit, consequat dolor sit amet, volutpat magna. Donec gravida sapien sapien. Pellentesque vulputate elementum viverra.', // original text
      versions: ['1', '2'], // array containing the original text
      currentVersionIndex: 0, // index of the current version
    },
    {
      sender: 'assistant',
      text: 'um et malesuada fames ac ante ipsum primis in faucibus. Maecenas suscipit risus elit, ut aliquet metus viverra at. Maecenas commodo, mi ac volutpat dictum, mi orci bibendum enim, nec suscipit ex lacus non lorem. Proin accumsan lectus in nulla semper tempor. Quisque sit amet dolor suscipit, consequat dolor sit amet, volutpat magna. Donec gravida sapien sapien. Pellentesque vulputate elementum viverra.', // original text
      versions: ['1', '2'], // array containing the original text
      currentVersionIndex: 0, // index of the current version
    },
    {
      sender: 'assistant',
      text: 'um et malesuada fames ac ante ipsum primis in faucibus. Maecenas suscipit risus elit, ut aliquet metus viverra at. Maecenas commodo, mi ac volutpat dictum, mi orci bibendum enim, nec suscipit ex lacus non lorem. Proin accumsan lectus in nulla semper tempor. Quisque sit amet dolor suscipit, consequat dolor sit amet, volutpat magna. Donec gravida sapien sapien. Pellentesque vulputate elementum viverra.', // original text
      versions: ['1', '2'], // array containing the original text
      currentVersionIndex: 0, // index of the current version
    },
    {
      sender: 'assistant',
      text: 'um et malesuada fames ac ante ipsum primis in faucibus. Maecenas suscipit risus elit, ut aliquet metus viverra at. Maecenas commodo, mi ac volutpat dictum, mi orci bibendum enim, nec suscipit ex lacus non lorem. Proin accumsan lectus in nulla semper tempor. Quisque sit amet dolor suscipit, consequat dolor sit amet, volutpat magna. Donec gravida sapien sapien. Pellentesque vulputate elementum viverra.', // original text
      versions: ['1', '2'], // array containing the original text
      currentVersionIndex: 0, // index of the current version
    },

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
