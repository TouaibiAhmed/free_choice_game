import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import "../../styles/gamesStyles/TribuGame.css";

import { recipesData } from "../../data/TribuData";

const TribuGame = ({ caseNumber, onCollect, onClose }) => {
    const [randomRecipe, setRandomRecipe] = useState(null);

    useEffect(() => {
        if (recipesData[caseNumber]) {
            setRandomRecipe(recipesData[caseNumber]); // Get the correct recipe
        }
    }, [caseNumber]);

    if (!randomRecipe) return null;

    return (
        <div className="tribu-overlay">
            <motion.div 
                className="tribu-window"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="tribu-title">🎁 Félicitations !</h2>
                <p className="tribu-text">Tu as gagné une nouvelle recette :</p>

                <div className="recipe-card">
                    <img src={randomRecipe.image} alt={randomRecipe.name} className="triburecipe-img" />
                    <h3 className="recipe-name">{randomRecipe.name}</h3>
                </div>

                <button className="collect-btn" onClick={() => onCollect(randomRecipe)}>
                    Ajouter à mon panier 🛒
                </button>

            </motion.div>
        </div>
    );
};

TribuGame.propTypes = {
    caseNumber: PropTypes.number.isRequired,
    onCollect: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};


export default TribuGame;
