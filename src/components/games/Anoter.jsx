import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import "../../styles/gamesStyles/AnoterGame.css";
import { AnoterData } from "../../data/AnoterData";

const AnoterGame = ({ caseNumber, onValidate }) => {
    const gameData = AnoterData[caseNumber];
    const [selectedOrders, setSelectedOrders] = useState({});
    const [currentOrder, setCurrentOrder] = useState(1);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    if (!gameData) return null;

    const handleItemClick = (index) => {
        // If item is already selected, unselect it
        if (selectedOrders[index]) {
            const newOrders = {...selectedOrders};
            const removedOrder = newOrders[index];
            delete newOrders[index];
            
            // Decrement orders higher than the removed one
            const updatedOrders = Object.entries(newOrders).reduce((acc, [key, value]) => {
                if (value > removedOrder) {
                    acc[key] = value - 1;
                } else {
                    acc[key] = value;
                }
                return acc;
            }, {});
            
            setSelectedOrders(updatedOrders);
            setCurrentOrder(currentOrder - 1);
            return;
        }

        // If item is not selected, select it with the next available order
        setSelectedOrders({
            ...selectedOrders,
            [index]: currentOrder
        });

        setCurrentOrder(currentOrder + 1);
    };

    const checkOrder = () => {
        if (Object.keys(selectedOrders).length !== gameData.items.length) {
            setShowFeedback(true);
            setIsCorrect(false);
            return;
        }

        const correct = gameData.items.every((item, index) => 
            selectedOrders[index] === item.correctOrder
        );

        setIsCorrect(correct);
        setShowFeedback(true);

        setTimeout(() => {
            onValidate(correct);
        }, 1500);
    };

    return (
        <div className="anoter-overlay">
            <motion.div 
                className="anoter-window"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="anoter-title">Mettre en ordre</h2>
                <div className="anoter-content">
                    <p className="question-text">{gameData.question}</p>
                    
                    {/* Show question image only for case 27 */}
                    {caseNumber === 27 && gameData.image && (
                        <img src={gameData.image} alt="Question" className="question-image" />
                    )}
                    
                    <div className={`items-container ${caseNumber === 13 ? 'text-items' : 'image-items'}`}>
                        {gameData.items.map((item, index) => (
                            <div 
                                key={index}
                                className={`order-item ${selectedOrders[index] ? 'selected' : ''}`}
                                onClick={() => handleItemClick(index)}
                            >
                                {caseNumber === 13 ? (
                                    <>
                                        <img src={item.image} alt="" className="item-image" />
                                        <p className="item-text">{item.text}</p>
                                    </>
                                ) : (
                                    <img src={item.image} alt={`Option ${index + 1}`} className="item-image" />
                                )}
                                {selectedOrders[index] && (
                                    <span className="order-number">{selectedOrders[index]}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {showFeedback && (
                        <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                            {isCorrect ? (
                                "Bien joué! 🎉 Tu as gagné 1 point!"
                            ) : (
                                "Ordre incorrect."
                            )}
                        </div>
                    )}

                    <button 
                        className="validate-btn" 
                        onClick={checkOrder}
                        disabled={Object.keys(selectedOrders).length !== gameData.items.length}
                    >
                        Valider
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

AnoterGame.propTypes = {
    caseNumber: PropTypes.number.isRequired,
    onValidate: PropTypes.func.isRequired,
};

export default AnoterGame;