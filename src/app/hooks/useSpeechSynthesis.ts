import { useEffect, useState } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const handleVoicesChanged = () => {
        setVoices(speechSynthesis.getVoices());
      };

      speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      return () => {
        speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      };
    }
  }, []);

  const speak = (text: string, lang = 'en-US', voiceName = "Eddy (English (US))") => {
    if (!('speechSynthesis' in window)) {
      console.error('Your browser does not support Text-to-Speech');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;

    const langVoices = voices
      .filter((voice) => voice.lang === lang);

    console.log(langVoices)

    utterance.voice = langVoices.find((voice) => voice.name === voiceName) || langVoices[langVoices.length - 1];

    setIsSpeaking(true);
    speechSynthesis.speak(utterance);

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };
  };

  const stopSpeaking = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return {isSpeaking, speak, stopSpeaking};
};
