import axios from '../axiosInstance';
import { AudioTranscription } from "../models";

export async function transcriptAudio(audioFile: Blob): Promise<AudioTranscription> {
  const formData = new FormData();
  formData.append('audio', audioFile);

  try {
    const response = await axios.post('/audio/transcription', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading audio:', error);
    return Promise.reject(error);
  }
}
