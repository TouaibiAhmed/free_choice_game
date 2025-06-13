import React, { useState, useEffect } from 'react';
import '../styles/FG.css';

const CharacterSelection = ({ onStart, selectedCharacterIndex, audioRef }) => {
  const [character, setCharacter] = useState(null);
  const [color, setColor] = useState(null);


  useEffect(() => {
    if (audioRef?.current?.paused) {
      audioRef.current.play().catch(err => {
        console.log('Failed to resume audio in CharacterSelection:', err);
      });
    }
  }, [audioRef]);



  const characterOptions = [
    { name: "Garçon", colors: ["Bleu", "Gris"], image: "/images/garcon.png" },
    { name: "Fille", colors: ["Rose", "Violet"], image: "/images/fille.png" }
  ];

  const handleCharacterSelect = (char) => {
    setCharacter(char);
    setColor(null);
  };

  const handleColorSelect = (selectedColor) => {
    setColor(selectedColor);
  };

  const handleStartGame = () => {
    if (character && color) {
      onStart(character, color);
    }
  };

  return (
    <div className="character-selection">
      {/* Game Title */}
      <h1 className="game-title">Free Choice</h1>

      {/* Game Logo */}
      <img src="/images/logo.png" alt="Game Logo" className="game-logo" />

      <div className="selection-box">
        <h2>Sélectionner ton genre</h2>

        <div className="character-buttons">
          {characterOptions.map((option) => (
            <button
              key={option.name}
              className={`character-btn ${character === option.name ? "selected" : ""}`}
              onClick={() => handleCharacterSelect(option.name)}
            >
              <img src={option.image} alt={option.name} className="icon-img" />
              {option.name}
            </button>
          ))}
        </div>

        {character && (
          <>
            <h3>Choisissez une couleur</h3>
            <div className="color-buttons">
              {characterOptions
                .find((opt) => opt.name === character)
                .colors.map((col) => (
                  <button
                    key={col}
                    className={`color-btn color-${col.toLowerCase()} ${color === col ? "selected" : ""}`}
                    onClick={() => handleColorSelect(col)}
                  >
                    {col}
                  </button>
                ))}
            </div>
          </>
        )}

        {color && <button className="start-btn" onClick={handleStartGame}>Commencer</button>}
      </div>
    </div>
  );
};

export default CharacterSelection;
