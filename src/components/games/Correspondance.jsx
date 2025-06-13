import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion"; // For smooth animations
import "../../styles/gamesStyles/CorrespondanceGame.css";


import { correspondanceData  } from "../../data/correspondanceData";


const CorrespondanceGame = ({ caseNumber, onValidate }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const gameData = correspondanceData[caseNumber];
    if (!gameData) return null;

    const handleSelect = (index) => {
        if (!submitted) {
            setSelectedOption(index);
            setSubmitted(true);
            setTimeout(() => {
                onValidate(gameData.options[index].isCorrect);
            }, 3500);
        }
    };

    return (
        <div className="CorrespondanceGame-overlay">
            <motion.div 
                className="CorrespondanceGame-window"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="CorrespondanceGame-title">Choisis la bonne réponse ! 🤔</h2>
                <div className="CorrespondanceGame-content">
                    <p className="CorrespondanceGame-question-text">{gameData.question}</p>

                    {gameData.questionImage && (
                        <img src={gameData.questionImage} alt="Question" className="CorrespondanceGame-question-image" />
                    )}

                    <div className="CorrespondanceGame-options-container">
                        {gameData.options.map((option, index) => (
                            <div 
                                key={index} 
                                className={`CorrespondanceGame-option-box ${submitted ? (option.isCorrect ? "CorrespondanceGame-correct" : selectedOption === index ? "CorrespondanceGame-wrong" : "") : ""}`}
                                onClick={() => handleSelect(index)}
                            >
                                <img src={option.img} alt={option.label} className="CorrespondanceGame-option-image" />
                                <p className="CorrespondanceGame-option-label">{option.label}</p>
                            </div>
                        ))}
                    </div>

                    {submitted && (
                        <>
                            <p className={`CorrespondanceGame-feedback-text ${gameData.options[selectedOption].isCorrect ? "CorrespondanceGame-correct-text" : "CorrespondanceGame-wrong-text"}`}>
                                {gameData.options[selectedOption].isCorrect
                                    ? "Bravo 🎉 ! Tu as gagné 1 point !"
                                    : `Faux ❌ : La bonne réponse est "${gameData.options.find(opt => opt.isCorrect).label}".`}
                            </p>

                            {/* Display explanation for case 25 */}
                            {caseNumber === 25 && (
                                <p className="CorrespondanceGame-explanation-text">
                                    📝 Ces deux plats contiennent du sucre. Un plat fait à la maison n'est pas forcément meilleur pour la santé.
                                </p>
                            )}
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

CorrespondanceGame.propTypes = {
    caseNumber: PropTypes.number.isRequired,
    onValidate: PropTypes.func.isRequired,
};

export default CorrespondanceGame;