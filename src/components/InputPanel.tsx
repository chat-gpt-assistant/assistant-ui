import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import MicNoneIcon from '@mui/icons-material/MicNone';

const InputPanel: React.FC = () => {
    return (
        <Box display="flex" gap={2} flexGrow={1}>
            <Button color="primary">
                <MicNoneIcon />
            </Button>
            <TextField fullWidth variant="outlined" placeholder="Type your message" />
            <Button variant="contained" color="primary">
                Send
            </Button>
        </Box>
    );
};

export default InputPanel;
