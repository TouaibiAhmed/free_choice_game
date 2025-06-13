import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion"; // Smooth animations

import "../../styles/gamesStyles/Vide.css";

import { videData } from "../../data/videData";

const videGame = ({ caseNumber, onValidate }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const gameData = videData[caseNumber];
    if (!gameData) return null;

    const handleSelect = (option) => {
        if (!submitted) {
            setSelectedOption(option);
            setSubmitted(true);
            setTimeout(() => {
                onValidate(option === gameData.correctAnswer);
            }, 3500);
        }
    };

    return (
        <div className="VideGame-overlay">
            <motion.div 
                className="VideGame-window"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="VideGame-title">Remplis le mot manquant ! ✏️</h2>
                <div className="VideGame-content">
                    <p className="VideGame-question-text">{gameData.sentence}</p>

                    {gameData.image && (
                        <img src={gameData.image} alt="Question" className="VideGame-question-image" />
                    )}

                    <div className="VideGame-options-container">
                        {gameData.options.map((option, index) => (
                            <button 
                                key={index} 
                                className={`VideGame-option-btn ${submitted ? (option === gameData.correctAnswer ? "VideGame-correct" : selectedOption === option ? "VideGame-wrong" : "") : ""}`}
                                onClick={() => handleSelect(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    {submitted && (
                        <p className={`VideGame-feedback-text ${selectedOption === gameData.correctAnswer ? "VideGame-correct-text" : "VideGame-wrong-text"}`}>
                            {selectedOption === gameData.correctAnswer
                                ? "Bravo 🎉 ! Tu avances d'une case !"
                                : `Faux ❌ : La bonne réponse est "${gameData.correctAnswer}".`}
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

videGame.propTypes = {
    caseNumber: PropTypes.number.isRequired,
    onValidate: PropTypes.func.isRequired,
};

export default videGame;
