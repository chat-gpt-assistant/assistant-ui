import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface ChatItemProps {
  title: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({title, onEdit, onDelete}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Box display="flex" alignItems="center" gap={1} p={1} width="100%"
         onMouseOver={(e) => setHovered(true)}
         onMouseLeave={(e) => setHovered(false)}>
      <MessageIcon/>
      <Typography variant="body1" flexGrow={1}>
        {title}
      </Typography>
      { hovered && (
        <>
          <IconButton sx={{padding: 0}} size="small" onClick={onEdit}>
            <EditIcon fontSize="small"/>
          </IconButton>
          <IconButton sx={{padding: 0}} size="small" onClick={onDelete}>
            <DeleteIcon fontSize="small"/>
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default ChatItem;
