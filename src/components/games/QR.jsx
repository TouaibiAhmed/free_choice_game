import React, { useState } from "react";
import { qrData } from "../../data/qrData";
import "../../styles/gamesStyles/QRGame.css";

const QRGame = ({ caseNumber, onValidate }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const questionData = qrData[caseNumber];

    if (!questionData) return null;

    const handleAnswer = (choice) => {
        setSelectedAnswer(choice);
        setIsAnswered(true);
        setTimeout(() => {
            onValidate(choice === questionData.correctAnswer);
        }, 3500);
    };

    return (
        <div className="qr-overlay">
            <div className="qr-window">
                <h2 className="qr-title">Question</h2>
                {questionData.image && <img src={questionData.image} alt="Question" className="qr-question-img" />}
                <p className="qr-question">{questionData.question}</p>
                
                <div className="qr-options">
                    {questionData.choices.map((choice, index) => (
                        <button
                            key={index}
                            className={`qr-option-btn ${isAnswered ? (choice.text === questionData.correctAnswer ? "correct" : "incorrect") : ""}`}
                            onClick={() => handleAnswer(choice.text)}
                            disabled={isAnswered}
                        >
                            {choice.text}
                            {choice.image && <img src={choice.image} alt="Option" className="qr-option-img" />}
                        </button>
                    ))}
                </div>

                {isAnswered && (
                    <div className="qr-feedback-container">
                        <p className="qr-feedback">
                            {selectedAnswer === questionData.correctAnswer 
                                ? "✅ Bonne réponse !" 
                                : "❌ Mauvaise réponse"}
                        </p>
                        {questionData.answerExplanation && (
                            <div className="qr-explanation">
                                <p className="qr-explanation-text">{questionData.answerExplanation}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QRGame;