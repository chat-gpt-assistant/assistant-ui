import React, { useEffect, useState } from 'react';
import { Box, IconButton, TextareaAutosize, CircularProgress } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import ResponseControl from './ResponseControl';

interface InputPanelProps {
  isAssistantResponding: boolean;
  onSubmitMessage: (text: string) => void;
  onStopGenerating: () => void;
  onRegenerateResponse: () => void;
}

const InputPanel: React.FC<InputPanelProps> = ({isAssistantResponding, onSubmitMessage, onStopGenerating, onRegenerateResponse}) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    const recordedChunks: Blob[] = [];

    if (mediaRecorder) {
      mediaRecorder.addEventListener('dataavailable', (event) => {
        recordedChunks.push(event.data);
      });
      mediaRecorder.addEventListener('stop', () => {
        const recordedBlob = new Blob(recordedChunks, { type: 'audio/webm' });
        const audioURL = window.URL.createObjectURL(recordedBlob);
        const audio = new Audio(audioURL);
        audio.play();
      });
    }
  }, [mediaRecorder]);

  const handleStopGenerating = () => {
    onStopGenerating();
  };

  const handleRegenerateResponse = () => {
    onRegenerateResponse();
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !isAssistantResponding) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (text.trim()) {
      onSubmitMessage(text);
      setText('');
    }
  };

  const handleMicDown = async () => {
    if (isRecording) {
      return handleMicUp();
    }

    setIsRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});
      const mediaRecorder = new MediaRecorder(stream);
      setMediaRecorder(mediaRecorder);
      mediaRecorder.start();
    } catch (error) {
      console.error('Error accessing the microphone:', error);
      setIsRecording(false);
    }
  };

  const handleMicUp = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
      setIsRecording(false);
    }
  };

  return (
    <Box
      p={1}
      paddingTop={0}
      alignSelf="center"
      width="100%"
      maxWidth="md"
    >
      <Box display="flex" flexDirection="column" gap={2} flexGrow={1}>
        <ResponseControl
          isAssistantResponding={isAssistantResponding}
          onStopGenerating={handleStopGenerating}
          onRegenerateResponse={handleRegenerateResponse}
        />

        <form onSubmit={handleSubmit}>
          <Box
            display="flex"
            gap={1}
            flexGrow={1}
            alignItems="flex-end"
            sx={{
              position: 'relative',
              borderRadius: '4px',
              backgroundColor: 'grey.300',
            }}
          >
            <IconButton color={isRecording ? 'error' : 'primary'}
                        sx={{
                          position: 'absolute',
                          left: 4,
                          bottom: 8,
                        }}
                        onMouseDown={handleMicDown}
                        onMouseUp={handleMicUp}
            >
              <MicIcon/>
            </IconButton>

            <TextareaAutosize
              minRows={1}
              maxRows={8}
              autoFocus={true}
              style={{
                width: '100%',
                minHeight: '40px',
                resize: 'none',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontSize: '1rem',
                fontWeight: 400,
                lineHeight: 1.5,
                letterSpacing: '0.00938em',
                backgroundColor: 'transparent',
                outline: 'none',
                border: '1px solid rgba(0, 0, 0, 0.23)',
                borderRadius: '4px',
                padding: '8px 40px 8px 40px',
              }}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
            />

            <IconButton type="submit"
                        disabled={!text.trim() || isAssistantResponding}
                        color="primary"
                        sx={{position: 'absolute', right: 4, bottom: 8}}>
              {isAssistantResponding ? (
                <CircularProgress size={24}/>
              ) : (
                <SendIcon/>
              )}
            </IconButton>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default InputPanel;
