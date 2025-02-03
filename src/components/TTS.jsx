import React from 'react';

const TTS = ({ title, description }) => {
  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = `${title}. ${description}`; // Concatenate title and description
    utterance.lang = 'en-US'; // Set language
    utterance.volume = 1; // Max volume
    utterance.rate = 1; // Normal speed
    utterance.pitch = 1; // Normal pitch
    speechSynthesis.speak(utterance); // Speak the text
  };

  return (
    <Button 
      variant="contained" 
      color="success" 
      startIcon={<VolumeUpIcon />} // Volume icon
      onClick={handleSpeak} // Trigger TTS on click
    >
      Speak Aloud
    </Button>
  );
};

export default TTS;
