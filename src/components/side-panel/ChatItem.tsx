import React, { useState } from 'react';
import { Box, FormControl, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import { Link } from "react-router-dom";

interface ChatItemProps {
  id: string;
  title: string;
  onEdit: (newTitle: string) => void;
  onDelete: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({id, title, onEdit, onDelete}) => {
  const [hovered, setHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewTitle(title);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(newTitle);
    setIsEditing(false);
  };


  return (
    <Box display="flex" alignItems="center" gap={1} p={1} width="100%"
         onMouseOver={(e) => setHovered(true)}
         onMouseLeave={(e) => setHovered(false)}>
      <MessageIcon/>

      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <TextField
            value={newTitle}
            onChange={handleTitleChange}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleCancelEdit();
              }
            }}
            fullWidth={true}
            autoFocus={true}
            size="small"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              minHeight: '1em',
              '& .MuiOutlinedInput-root input': {
                py: '5px',
                outline: 'none',
              },
            }}
            InputProps={{
              endAdornment:
                <InputAdornment position="end">
                  <IconButton sx={{p: 0, pr: .5}} size="small" type="submit">
                    <CheckIcon fontSize="small"/>
                  </IconButton>
                  <IconButton sx={{p: 0}} size="small" onClick={handleCancelEdit}>
                    <CancelIcon fontSize="small"/>
                  </IconButton>
                </InputAdornment>,
            }}
          />
        </form>
      ) : (
        <Typography variant="body1"
                    flexGrow={1}
                    component={Link}
                    to={`/chat/${id}`}
                    sx={{textDecoration: 'none', color: 'inherit'}}
        >
          {title}
        </Typography>
      )}

      {hovered && !isEditing && (
        <>
          <IconButton sx={{padding: 0}} size="small" onClick={handleEdit}>
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
