import React, { useState } from "react";
import "../../styles/gamesStyles/CarteGame.css";
import { carteGameData } from "../../data/carteQuestionData";
import ouiImage from "/images/questions/cardGame-oui.png"; // Update with your actual image path
import nonImage from "/images/questions/cardGame-non.png"; // Update with your actual image path

const CarteGame = ({ onValidate, caseNumber }) => {
  const [currentStep, setCurrentStep] = useState("intro");
  const currentCaseData = carteGameData[caseNumber];

  const handleResponse = (response) => {
    if (currentStep === "askToPlay") {
      if (response) {
        setCurrentStep("question");
      } else {
        onValidate(false);
      }
    } else if (currentStep === "askAnswer") {
      setCurrentStep(response ? "felicitation" : "malheureusement");
    }
  };

  const handleVideoEnd = () => {
    if (currentStep === "intro") {
      setCurrentStep("askToPlay");
    } else if (currentStep === "question") {
      setCurrentStep("askAnswer");
    } else if (currentStep === "felicitation" || currentStep === "malheureusement") {
      onValidate(currentStep === "felicitation");
    }
  };

  return (
    <div className="carte-overlay">
      <div className="carte-window">
        {currentStep === "intro" && (
          <div className="carte-video-container">
            <video 
              src={currentCaseData.introVideo} 
              autoPlay 
              onEnded={handleVideoEnd}
              className="carte-video"
              playsInline
            />
          </div>
        )}

        {currentStep === "askToPlay" && (
          <div className="carte-question-step">
            <h2 className="carte-title">Pouvez-vous jouer ?</h2>
            <div className="carte-buttons">
              <button className="carte-btn" onClick={() => handleResponse(true)}>
                <img src={ouiImage} alt="Oui" className="carte-btn-image" />
              </button>
              <button className="carte-btn" onClick={() => handleResponse(false)}>
                <img src={nonImage} alt="Non" className="carte-btn-image" />
              </button>
            </div>
          </div>
        )}

        {currentStep === "question" && (
          <div className="carte-video-container">
            <video 
              src={currentCaseData.questionVideo} 
              autoPlay 
              onEnded={handleVideoEnd}
              className="carte-video"
              playsInline
            />
          </div>
        )}

        {currentStep === "askAnswer" && (
          <div className="carte-question-step">
            <h2 className="carte-title">Votre réponse ?</h2>
            <div className="carte-buttons">
              <button className="carte-btn" onClick={() => handleResponse(true)}>
                <img src={ouiImage} alt="Oui" className="carte-btn-image" />
              </button>
              <button className="carte-btn" onClick={() => handleResponse(false)}>
                <img src={nonImage} alt="Non" className="carte-btn-image" />
              </button>
            </div>
          </div>
        )}

        {(currentStep === "felicitation" || currentStep === "malheureusement") && (
          <div className="carte-video-container">
            <video 
              src={currentStep === "felicitation" 
                ? currentCaseData.felicitationVideo 
                : currentCaseData.malheureusementVideo}
              autoPlay 
              onEnded={handleVideoEnd}
              className="carte-video"
              playsInline
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CarteGame;