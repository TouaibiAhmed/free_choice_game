import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import "../../styles/gamesStyles/VraiFauxGame.css";

import { vraiFauxData } from "../../data/vfData";

const VraiFauxGame = ({ caseNumber, onValidate }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const gameData = vraiFauxData[caseNumber];
    if (!gameData) return null;

    const handleAnswer = (isTrue) => {
        if (!submitted) {
            const isCorrect = isTrue === gameData.answer;
            setSelectedAnswer(isTrue);
            setSubmitted(true);

            setTimeout(() => {
                onValidate(isCorrect);
            }, 3500);
        }
    };

    return (
        <div className="vrai-faux-overlay">
            <motion.div
                className="vrai-faux-window"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="vrai-faux-title">Vrai ou Faux ? 🤔</h2>
                <div className="vrai-faux-content">
                    <img src={gameData.image} alt="Question" className="question-image" />
                    <p className="question-text">{gameData.question}</p>

                    <div className="buttons-container">
                        <button 
                            className={`answer-btn ${submitted ? (selectedAnswer ? "selected" : "") : ""}`}
                            onClick={() => handleAnswer(true)}
                        >
                            ✅ Vrai
                        </button>
                        <button 
                            className={`answer-btn ${submitted ? (!selectedAnswer ? "selected" : "") : ""}`}
                            onClick={() => handleAnswer(false)}
                        >
                            ❌ Faux
                        </button>
                    </div>

                    {submitted && (
    <div className="feedback-text">
        {selectedAnswer === gameData.answer ? (
            "Bravo 🎉 ! Bonne réponse !"
        ) : (
            <>
                <span
                    dangerouslySetInnerHTML={{
                        __html: `Faux ❌ : ${gameData.explanation}`
                    }}
                />
                {gameData.explanationImage && (
                    <img
                        src={gameData.explanationImage}
                        alt="Explication"
                        className="explanation-image"
                    />
                )}
            </>
        )}
    </div>
)}

                </div>
            </motion.div>
        </div>
    );
};

VraiFauxGame.propTypes = {
    caseNumber: PropTypes.number.isRequired,
    onValidate: PropTypes.func.isRequired,
};

export default VraiFauxGame;
