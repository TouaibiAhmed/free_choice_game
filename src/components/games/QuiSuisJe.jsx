
import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion"; // For animations
import levenshtein from "fast-levenshtein";
import "../../styles/gamesStyles/QuiSuisJe.css"; // Import CSS
import { quiSuisJeData } from "../../data/quiSuisJeData";


const isAnswerSimilar = (input, correctAnswer, threshold = 3) => {
    if (!input || input.trim() === "") return false; // Reject empty input

    const inputWords = input.toLowerCase().trim().split(" ");
    const correctWords = correctAnswer.toLowerCase().trim().split(" ");

    // Case 1: Check if the whole input is close enough to the correct answer
    if (levenshtein.get(input.toLowerCase().trim(), correctAnswer.toLowerCase()) <= threshold) {
        return true;
    }

    // Case 2: Allow missing words (e.g., ignoring "Les" in "Les lentilles")
    const filteredCorrectWords = correctWords.filter(word => word.length > 2); // Ignore short words like "les", "le", "la"
    const filteredInputWords = inputWords.filter(word => word.length > 2);

    let matchCount = 0;
    filteredInputWords.forEach(inputWord => {
        if (filteredCorrectWords.some(correctWord => levenshtein.get(inputWord, correctWord) <= threshold)) {
            matchCount++;
        }
    });

    return matchCount >= Math.min(filteredCorrectWords.length, filteredInputWords.length);
};


const QuiSuisJe = ({ caseNumber, onValidate }) => {
    const [userAnswer, setUserAnswer] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const gameData = quiSuisJeData[caseNumber];

    if (!gameData) return null; // Ensure we have data for this case

    const handleSubmit = () => {
        if (!userAnswer.trim()) {
            setIsCorrect(false); // Empty input is always incorrect
            setSubmitted(true);
            setTimeout(() => onValidate(false), 3500);
            return;
        }
    
        const correct = isAnswerSimilar(userAnswer, gameData.answer);
        setIsCorrect(correct);
        setSubmitted(true);
    
        if (correct) {
            setUserAnswer(gameData.answer); // Show the correct answer in the input when it's correct
        }
        
        setTimeout(() => {
            onValidate(correct);
        }, 3500); // Wait 3.5s before closing
    };

    return (
        <div className="QuiSuisJe-popup-overlay">
            <motion.div 
                className="QuiSuisJe-popup-window"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="QuiSuisJe-popup-title">Qui suis-je ? 🤔</h2>
                <div className="QuiSuisJe-popup-content">
                    {/* Question on the left */}
                    <div className="QuiSuisJe-question-box">
                        <p className="QuiSuisJe-question-text">{gameData.question}</p>
                        {!submitted ? (
                            <input
                                type="text"
                                placeholder="Ta réponse..."
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                className="QuiSuisJe-answer-input"
                            />
                        ) : (
                            <p className={`QuiSuisJe-answer-feedback ${isCorrect ? "QuiSuisJe-correct" : "QuiSuisJe-wrong"}`}>
                                {userAnswer}
                            </p>
                        )}
                        {!submitted && (
                            <button className="QuiSuisJe-validate-btn" onClick={handleSubmit}>
                                Valider ✅
                            </button>
                        )}
                        {submitted && (
                            <p className={`QuiSuisJe-feedback-text ${isCorrect ? "QuiSuisJe-correct-text" : "QuiSuisJe-wrong-text"}`}>
                                {isCorrect ? "Bien joué! 🎉 Tu as gagné 1 point!" : `Faux ❌ : La bonne réponse est "${gameData.answer}"`}
                            </p>
                        )}
                    </div>

                    {/* Image on the right */}
                    <div className="QuiSuisJe-image-box">
    {Array.isArray(gameData.images) ? (
        <div className="QuiSuisJe-multiple-images">
            {gameData.images.map((src, idx) => (
                <img
                    key={idx}
                    src={src}
                    alt={`Question illustration ${idx + 1}`}
                    className="QuiSuisJe-question-image"
                />
            ))}
        </div>
    ) : (
        <img src={gameData.image} alt="Question Illustration" className="QuiSuisJe-question-image" />
    )}
</div>

                </div>
            </motion.div>
        </div>
    );
};

QuiSuisJe.propTypes = {
    caseNumber: PropTypes.number.isRequired,
    onValidate: PropTypes.func.isRequired,
};

export default QuiSuisJe;
