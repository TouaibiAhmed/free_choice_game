import React, { useState, useRef, useEffect } from 'react';
import IntroSequence from './components/IntroSequence';
import Board from './components/GameBoard';
import CharacterSelection from './components/FilleGarcon';

const App = () => {
  const [introFinished, setIntroFinished] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('/images/bg00.png');
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState(null);

  const audioRef = useRef(new Audio('/sounds/intro-music.mp3'));

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0.5;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const handleStartGame = (character, color) => {
    const bgImages = {
      bleu: "/images/blue.png",
      gris: "/images/grey.png",
      rose: "/images/pink.png",
      violet: "/images/purple.png"
    };

    // Stop the music once the game starts
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setSelectedCharacter(character);
    setBackgroundImage(bgImages[color.toLowerCase()] || '/images/bg00.png');
    setGameStarted(true);
  };

  if (!introFinished) {
    return (
      <IntroSequence 
        onFinish={(characterIndex) => {
          setSelectedCharacterIndex(characterIndex);
          setIntroFinished(true);
        }}
        audioRef={audioRef}
      />
    );
  }

  return (
    <div>
      {!gameStarted ? (
        <CharacterSelection 
          onStart={handleStartGame} 
          selectedCharacterIndex={selectedCharacterIndex}
          audioRef={audioRef}
        />
      ) : (
        <Board 
          backgroundImage={backgroundImage} 
          selectedCharacter={selectedCharacter}
          selectedCharacterIndex={selectedCharacterIndex}
        />
      )}
    </div>
  );
};

export default App;
