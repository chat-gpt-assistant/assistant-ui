import React from 'react';
import { Box, Button } from '@mui/material';

interface SidebarActionsProps {
    onClearAll: () => void;
    onSettings: () => void;
}

const SidebarActions: React.FC<SidebarActionsProps> = ({ onClearAll, onSettings }) => {
    return (
        <Box display="flex" flexDirection="column" gap={1}>
            <Button fullWidth variant="outlined" onClick={onClearAll}>
                Clear All Conversations
            </Button>
            <Button fullWidth variant="outlined" onClick={onSettings}>
                Settings
            </Button>
        </Box>
    );
};

export default SidebarActions;
