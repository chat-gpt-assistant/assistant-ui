import React from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export interface MessageVersionControlProps {
  currentVersion: number;
  totalVersions: number;
  onPreviousVersion: () => void;
  onNextVersion: () => void;
}

const MessageVersionControl: React.FC<MessageVersionControlProps> = ({
                                                                       currentVersion,
                                                                       totalVersions,
                                                                       onPreviousVersion,
                                                                       onNextVersion,
                                                                     }) => {
  if (totalVersions <= 1) {
    return null;
  }

  const handlePreviousVersionClick = (event: React.MouseEvent) => {
    event.preventDefault();
    onPreviousVersion();
  };

  const handleNextVersionClick = (event: React.MouseEvent) => {
    event.preventDefault();
    onNextVersion();
  };

  return (
    <Box display="flex" alignItems="center">
      <MuiLink
        component={RouterLink}
        to="#"
        // to={{ pathname: '', search: `?version=${currentVersion - 1}` }}
        onClick={handlePreviousVersionClick}
        sx={{
          color: currentVersion === 1 ? 'rgba(0, 0, 0, 0.26)' : 'inherit',
          textDecoration: 'none',
          cursor: currentVersion === 1 ? 'default' : 'pointer',
        }}
        tabIndex={currentVersion === 1 ? -1 : 0}
      >
        {'<'}
      </MuiLink>
      <Typography variant="body2" mx={0.7}>
        {currentVersion}/{totalVersions}
      </Typography>
      <MuiLink
        component={RouterLink}
        to="#"
        // to={{ pathname: '', search: `?version=${currentVersion + 1}` }}
        onClick={handleNextVersionClick}
        sx={{
          color: currentVersion === totalVersions ? 'rgba(0, 0, 0, 0.26)' : 'inherit',
          textDecoration: 'none',
          cursor: currentVersion === totalVersions ? 'default' : 'pointer',
        }}
        tabIndex={currentVersion === totalVersions ? -1 : 0}
      >
        {'>'}
      </MuiLink>
    </Box>
  );
};

export default MessageVersionControl;
