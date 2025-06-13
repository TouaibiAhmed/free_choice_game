import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import "../../styles/gamesStyles/ParlerDeGame.css";
import { parlerDeData } from "../../data/parlerDeData";

const ParlerDeGame = ({ caseNumber, onValidate }) => {
    const gameData = parlerDeData[caseNumber];
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    if (!gameData) return null;

    const handleAnswerSelect = (index) => {
        if (selectedAnswers.includes(index)) {
            setSelectedAnswers(selectedAnswers.filter(i => i !== index));
        } else {
            setSelectedAnswers([...selectedAnswers, index]);
        }
        // Reset feedback when changing answers
        setShowFeedback(false);
    };

    const checkAnswers = () => {
        // Check if all correct answers are selected and no incorrect ones
        const correctSelected = gameData.correctAnswers.every(ans => 
            selectedAnswers.includes(ans)
        );
        const noIncorrectSelected = selectedAnswers.every(ans => 
            gameData.correctAnswers.includes(ans)
        );
        
        const allCorrect = correctSelected && noIncorrectSelected;
        setIsCorrect(allCorrect);
        setShowFeedback(true);
        
        if (allCorrect) {
            // If correct, close after a delay
            setTimeout(() => {
                onValidate(true);
            }, 1500);
        }
    };

    return (
        <div className="parler-de-overlay">
            <motion.div 
                className="parler-de-window"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="parler-de-title">Question</h2>
                <div className="parler-de-content">
                    <p className="question-text">{gameData.question}</p>
                    
                    <div className="options-container">
                        {gameData.options.map((option, index) => (
                            <div 
                                key={index}
                                className={`option ${selectedAnswers.includes(index) ? 'selected' : ''}`}
                                onClick={() => handleAnswerSelect(index)}
                            >
                                <input 
                                    type="checkbox" 
                                    checked={selectedAnswers.includes(index)}
                                    onChange={() => handleAnswerSelect(index)}
                                />
                                <label>{option}</label>
                            </div>
                        ))}
                    </div>

                    {showFeedback && (
                        <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                            {isCorrect ? (
                                "Correct ! Vous pouvez continuer."
                            ) : (
                                "Réponse incorrecte. Veuillez sélectionner toutes les bonnes réponses pour continuer."
                            )}
                        </div>
                    )}

                    <div className="button-group">
                        <button 
                            className="validate-btn" 
                            onClick={checkAnswers}
                            disabled={selectedAnswers.length === 0}
                        >
                            Valider
                        </button>
                    </div>

                    {gameData.image && (
                        <img src={gameData.image} alt="Illustration" className="danger-image" />
                    )}
                </div>
            </motion.div>
        </div>
    );
};

ParlerDeGame.propTypes = {
    caseNumber: PropTypes.number.isRequired,
    onValidate: PropTypes.func.isRequired,
};

export default ParlerDeGame;