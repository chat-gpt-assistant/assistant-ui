import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  Switch,
  TextareaAutosize
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import VoiceOverOffIcon from '@mui/icons-material/VoiceOverOff';
import ResponseControl from './ResponseControl';
import { transcriptAudio } from "../../app/audio";

interface InputPanelProps {
  chatId: string;
  isAssistantResponding: boolean;
  onSubmitMessage: (text: string) => void;
  onStopGenerating: () => void;
  onRegenerateResponse: () => void;
}

const InputPanel: React.FC<InputPanelProps> = ({
                                                 chatId,
                                                 isAssistantResponding,
                                                 onSubmitMessage,
                                                 onStopGenerating,
                                                 onRegenerateResponse
                                               }) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcripting, setTranscripting] = useState(false);
  const [replyWithSpeech, setReplyWithSpeech] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const mediaRecorder = mediaRecorderRef.current;
    return () => {
      if (mediaRecorder) {
        if (mediaRecorder?.state !== 'inactive') {
          mediaRecorder.stop();
        }
        mediaRecorderRef.current = null;
      }

      setIsRecording(false);
      setTranscripting(false);
      setText('');
    }
  }, [chatId]);

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

  const setupMediaRecorder = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    const mediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/webm;codecs=opus'});

    let recordedChunks: Blob[] = [];
    mediaRecorder.addEventListener('dataavailable', (event) => {
      recordedChunks.push(event.data);
    });
    mediaRecorder.addEventListener('stop', () => {
      const recordedBlob = new Blob(recordedChunks, {type: mediaRecorder.mimeType});

      setTranscripting(true);

      // TODO: more to slice and remove chatId prop
      transcriptAudio(recordedBlob).then((transcription) => {
        setText(transcription.text);
        textAreaRef.current?.focus();
      }).finally(() => {
        setTranscripting(false);
        recordedChunks = [];
      });
    });

    return mediaRecorder;
  }

  const handleMicDown = async () => {
    if (isRecording) {
      return handleMicUp();
    }

    setIsRecording(true);

    try {
      mediaRecorderRef.current = await setupMediaRecorder();
      mediaRecorderRef.current.start();
    } catch (error) {
      console.error('Error accessing the microphone:', error);
      setIsRecording(false);
    }
  };

  const handleMicUp = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);
    }
  };

  const handleReplyWithSpeechChange = () => {
    setReplyWithSpeech(!replyWithSpeech);
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
        <Box display="flex" flexDirection="row">
          <Box display="flex" alignSelf="flex-end">
            <Switch
              checked={replyWithSpeech}
              onChange={handleReplyWithSpeechChange}
              color="primary"
              size="small"
            />

            {
              replyWithSpeech ? (
                <RecordVoiceOverIcon color="primary" />
              ) : (
                <VoiceOverOffIcon color="error" />
              )
            }

          </Box>

          <ResponseControl
            isAssistantResponding={isAssistantResponding}
            onStopGenerating={handleStopGenerating}
            onRegenerateResponse={handleRegenerateResponse}
          />
        </Box>

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
              {transcripting ? (
                <CircularProgress size={24}/>
              ) : (
                <MicIcon/>
              )}
            </IconButton>

            <TextareaAutosize
              ref={textAreaRef}
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
