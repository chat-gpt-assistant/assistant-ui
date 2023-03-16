import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';

export interface MessageProps {
    sender: 'user' | 'assistant';
    text: string;
}

const Message: React.FC<MessageProps> = ({ sender, text }) => {
    const isUser = sender === 'user';
    const avatarPlaceholder = isUser ? 'U' : 'A';

    return (
        <Box display="flex" justifyContent="center">
            <Box
                display="flex"
                alignItems="flex-start"
                justifyContent="center"
                width="100%"
                bgcolor={isUser ? 'grey.300' : 'grey.500'}
                p={1}
            >
                <Avatar>{avatarPlaceholder}</Avatar>
                <Box
                    display="flex"
                    justifyContent="center"
                    flexGrow={1}
                    maxWidth="md"
                >
                    <Typography
                        variant="body1"
                        component="div"
                        color={isUser ? 'grey.900' : 'grey.100'}
                        ml={1}
                    >
                        {text}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Message;
