import { useState } from 'react';

const speechVoices: SpeechSynthesisVoice[] = [];
let globalSpeaking = false;

if ('speechSynthesis' in window) {
  const handleVoicesChanged = () => {
    speechVoices.push(...speechSynthesis.getVoices());
    console.log('handleVoicesChanged: ', speechVoices.length);
  };

  speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
}

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(globalSpeaking);

  const speak = (text: string, lang = 'en-US', voiceName = "Eddy (English (US))") => {
    if (!('speechSynthesis' in window)) {
      console.error('Your browser does not support Text-to-Speech');
      return;
    }

    if (globalSpeaking || isSpeaking) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;

    const langVoices = speechVoices
      .filter((voice) => voice.lang === lang);

    utterance.voice = langVoices.find((voice) => voice.name === voiceName)
      || langVoices[0];

    globalSpeaking = true;
    setIsSpeaking(true);
    speechSynthesis.speak(utterance);

    utterance.onend = () => {
      setIsSpeaking(false);
      globalSpeaking = false;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      globalSpeaking = false;
    };
  };

  const stopSpeaking = () => {
    if (isSpeaking || globalSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      globalSpeaking = false;
    }
  };

  return {isSpeaking, speak, stopSpeaking};
};
