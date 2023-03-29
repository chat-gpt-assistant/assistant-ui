import axios from '../axiosInstance';

export async function transcriptAudio(audioFile: Blob) {
  const formData = new FormData();
  formData.append('audio', audioFile);

  try {
    const response = await axios.post('/audio/transcription', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error uploading audio:', error);
  }
}
