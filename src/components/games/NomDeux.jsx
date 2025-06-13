import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import levenshtein from "fast-levenshtein";
import "../../styles/gamesStyles/NomDeuxGame.css";
import { nomDeuxData } from "../../data/nomDeuxData";

const isSimilar = (input, correct, threshold = 2) => {
    const trimmedInput = input.toLowerCase().trim();
    const trimmedCorrect = correct.toLowerCase();
    const firstLetter = trimmedCorrect[0];
    const correctRemaining = trimmedCorrect.slice(1);
    let playerRemaining = trimmedInput;
    if (trimmedInput.startsWith(firstLetter)) {
        playerRemaining = trimmedInput.slice(1);
    }
    return levenshtein.get(playerRemaining, correctRemaining) <= threshold;
};


const NomDeuxGame = ({ caseNumber, onValidate }) => {
    const [answer1, setAnswer1] = useState("");
    const [answer2, setAnswer2] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const gameData = nomDeuxData[caseNumber];
    if (!gameData) return null;

    const totalBlanks = gameData.correctAnswers.length;

    const getCorrectAnswerCount = () => {
        const correctAnswers = gameData.correctAnswers;
        let correctCount = 0;

        if (totalBlanks === 1) {
            if (isSimilar(answer1, correctAnswers[0])) correctCount = 1;
        } else if (caseNumber === 16) {
            // Special swap logic
            const a1c1 = isSimilar(answer1, correctAnswers[0]);
            const a2c2 = isSimilar(answer2, correctAnswers[1]);
            const a1c2 = isSimilar(answer1, correctAnswers[1]);
            const a2c1 = isSimilar(answer2, correctAnswers[0]);
            if ((a1c1 && a2c2) || (a1c2 && a2c1)) correctCount = 2;
            else if (a1c1 || a2c2 || a1c2 || a2c1) correctCount = 1;
        } else {
            if (isSimilar(answer1, correctAnswers[0])) correctCount++;
            if (isSimilar(answer2, correctAnswers[1])) correctCount++;
        }

        return { correctCount, totalBlanks };
    };

    const handleSubmit = () => {
        if (!submitted) {
            setSubmitted(true);
            const result = getCorrectAnswerCount();
            setTimeout(() => {
                onValidate(result);
            }, 3500);
        }
    };

    const handleInputChange = (e, setAnswer) => {
        setAnswer(e.target.value);
    };

    const renderQuestion = () => {
        let missingWordIndex = 0;
        return (
            <div className="NomDeuxGame-question-container">
                <p className="NomDeuxGame-question-text">
                    {gameData.sentence.split(/(\s+|\n)/).map((word, index) => {
                        if (word === "\n") return <br key={`br-${index}`} />;
                        if (word.includes("…………")) {
                            const isFirstInput = missingWordIndex === 0;
                            const correctAnswer = gameData.correctAnswers[missingWordIndex];
                            const userAnswer = isFirstInput ? answer1 : answer2;
                            const setUserAnswer = isFirstInput ? setAnswer1 : setAnswer2;
                            const isCorrect = isSimilar(userAnswer, correctAnswer || "");
                            missingWordIndex++;
                            return (
                                <span key={index} className="NomDeuxGame-input-container">
                                    <span className="NomDeuxGame-placeholder">{correctAnswer[0]}</span>
                                    {submitted ? (
                                        <span className="NomDeuxGame-correct-answer">{correctAnswer.slice(1)}</span>
                                    ) : (
                                        <input
                                            type="text"
                                            value={userAnswer}
                                            onChange={(e) => handleInputChange(e, setUserAnswer)}
                                            className={`NomDeuxGame-input-field ${
                                                submitted
                                                    ? isCorrect
                                                        ? "NomDeuxGame-correct"
                                                        : "NomDeuxGame-wrong"
                                                    : ""
                                            }`}
                                            disabled={submitted}
                                        />
                                    )}
                                </span>
                            );
                        }
                        return <span key={index}>{word}</span>;
                    })}
                </p>
            </div>
        );
    };

    const { correctCount } = getCorrectAnswerCount();

    return (
        <div className="NomDeuxGame-overlay">
            <motion.div
                className="NomDeuxGame-window"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="NomDeuxGame-title">Complète avec les bonnes lettres! 📝</h2>
                <div className="NomDeuxGame-content">
                    <div className="NomDeuxGame-question-and-img">
                        {renderQuestion()}
                        {gameData.images ? (
                            <div className="NomDeuxGame-multiple-images">
                                {gameData.images.map((src, idx) => (
                                    <img
                                        key={idx}
                                        src={src}
                                        alt={`Question ${idx + 1}`}
                                        className="NomDeuxGame-question-image"
                                    />
                                ))}
                            </div>
                        ) : gameData.image ? (
                            <img src={gameData.image} alt="Question" className="NomDeuxGame-question-image" />
                        ) : null}
                    </div>

                    <button className="NomDeuxGame-submit-btn" onClick={handleSubmit} disabled={submitted}>
                        Valider
                    </button>

                    {submitted && (
                        <p
                            className={`NomDeuxGame-feedback-text ${
                                correctCount === totalBlanks
                                    ? "NomDeuxGame-correct-text"
                                    : "NomDeuxGame-wrong-text"
                            }`}
                        >
                            {correctCount === totalBlanks
    ? `Bravo 🎉 ! Tu as gagné ${correctCount} point${correctCount > 1 ? "s" : ""} !`
    : correctCount > 0
    ? `Presque ! 👍 Tu as gagné ${correctCount} point${correctCount > 1 ? "s" : ""}. Les bonnes réponses étaient : "${gameData.correctAnswers.join('" et "')}".`
    : `Faux ❌ : Les bonnes réponses étaient : "${gameData.correctAnswers.join('" et "')}".`}

                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

NomDeuxGame.propTypes = {
    caseNumber: PropTypes.number.isRequired,
    onValidate: PropTypes.func.isRequired,
};

export default NomDeuxGame;
