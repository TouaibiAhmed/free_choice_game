import React, { useState, useEffect } from 'react';


import QuiSuisJe from "./games/QuiSuisJe"; 
import CorrespondanceGame from "./games/Correspondance"; 

import VideGame from "./games/Vide"; 

import NomDeuxGame from "./games/NomDeux"; 

import ParlerDeGame from "./games/ParlerDe"; 

import TribuGame from "./games/TribuGame"; 

import VraiFauxGame  from "./games/VF";

import CarteGame from "./games/CarteQuestion";


import QRGame from "./games/QR";

import AnoterGame from "./games/Anoter";


import '../styles/Board.css';

import moveSound from '/sounds/move.mp3';
import victorySound from '/sounds/victory.mp3'; 


const QUI_SUIS_JE_CASES = [1, 6, 23]; 
const CORRESPONDANCE_CASES = [3,12, 26];
const FILL_IN_BLANK_CASES = [5, 19]; 
const NOM_DEUX_CASES = [8, 16, 24];
const PARLER_DE_CASES = [11, 22]; 
const TRIBU_CASES = [10, 20, 30]; 
const VRAI_FAUX_CASES = [4, 15, 29];
const CARTE_CASES = [9, 18];
const QR_CASES = [2, 7, 14, 17, 21, 25, 28];
const IMAGE_ORDER_CASES = [13, 27];




const Board = ({ onGameStatusChange, backgroundImage, selectedCharacter,  selectedCharacterIndex}) => {

	const [playerPosition, setPlayerPosition] = useState(0); 
	const [win, setWin] = useState(false); 

	const [quizOpen, setQuizOpen] = useState(false);
	const [score, setScore] = useState(0);

	const [visitedCases, setVisitedCases] = useState(new Set());

	const [correspondanceOpen, setCorrespondanceOpen] = useState(false);
    const [currentCase, setCurrentCase] = useState(null);

	const [fillBlankOpen, setFillBlankOpen] = useState(false);

	const [nomDeuxOpen, setNomDeuxOpen] = useState(false);

	const [parlerDeOpen, setParlerDeOpen] = useState(false);


	const [tribuOpen, setTribuOpen] = useState(false);
	const [collectedRecipes, setCollectedRecipes] = useState([]);

	const [vraiFauxOpen, setVraiFauxOpen] = useState(false);

	const [carteOpen, setCarteOpen] = useState(false);

	const [qrOpen, setQROpen] = useState(false);
	const [currentQRCase, setCurrentQRCase] = useState(null);
	const [playerPoints, setPlayerPoints] = useState(0);
	

	const [playedCases, setPlayedCases] = useState(new Set());

	const [lastPlayedCase, setLastPlayedCase] = useState(null); // Track last case where a game was played


	const [alertShown, setAlertShown] = useState(false);

	const [selectedRecipe, setSelectedRecipe] = useState(null);

	const [imageOrderOpen, setImageOrderOpen] = useState(false);

	const [carteResults, setCarteResults] = useState([]); // Track results for all CarteGames
	const [showCongrats, setShowCongrats] = useState(false);

	const [showArrow, setShowArrow] = useState(false);
const [showThanksVideo, setShowThanksVideo] = useState(false);
	
	const handleRecipeClick = (recipe) => {
		setSelectedRecipe(recipe);
	};
	
	const closeRecipePopup = () => {
		setSelectedRecipe(null);
	};

  const positions = [
    { type: 'depart', row: 1, col: 0 },
    { number: 1, row: 1, col: 1 },
    { number: 2, row: 1, col: 2 },
    { number: 3, row: 1, col: 3 },
    { number: 4, row: 1, col: 4 },
    { number: 5, row: 1, col: 5 },
    { number: 6, row: 1, col: 6 },
    { number: 7, row: 1, col: 7 },
    { number: 8, row: 1, col: 8 },
    { number: 9, row: 2, col: 8 },
    { number: 10, row: 3, col: 8 },
    { number: 11, row: 4, col: 8 },
    { number: 12, row: 5, col: 8 },
    { number: 13, row: 6, col: 8 },
    { number: 14, row: 6, col: 7 },
    { number: 15, row: 6, col: 6 },
    { number: 16, row: 6, col: 5 },
    { number: 17, row: 6, col: 4 },
    { number: 18, row: 6, col: 3 },
    { number: 19, row: 6, col: 2 },
    { number: 20, row: 6, col: 1 },
    { number: 21, row: 5, col: 1 },
    { number: 22, row: 4, col: 1 },
    { number: 23, row: 3, col: 1 },
    { number: 24, row: 3, col: 2 },
    { number: 25, row: 3, col: 3 },
    { number: 26, row: 3, col: 4 },
    { number: 27, row: 3, col: 5 },
    { number: 28, row: 3, col: 6 },
    { number: 29, row: 4, col: 6 },
    { number: 30, row: 5, col: 6 },
    { type: 'finish', row: 5, col: 5 },
  ];


  const gameOpen =
  quizOpen ||
  correspondanceOpen ||
  fillBlankOpen ||
  nomDeuxOpen ||
  parlerDeOpen ||
  tribuOpen ||
  vraiFauxOpen ||
  carteOpen ||
  qrOpen ||
  imageOrderOpen;


  useEffect(() => {
    if (typeof onGameStatusChange === 'function') {
        onGameStatusChange(gameOpen);
    }
}, [gameOpen, onGameStatusChange]);



 



    // Handle mini-games when landing on special cases
	const handleSpecialCases = (position) => {
		const isFromVraiFauxBackstep = playerPosition > position && vraiFauxOpen;
		const isReturningToCase = playedCases.has(position) && position !== lastPlayedCase;
		
		if (!isFromVraiFauxBackstep && isReturningToCase && !visitedCases.has(position)) {
		  if (!alertShown) {
			alert("Vous avez déjà joué sur cette case !");
			setAlertShown(true);
		  }
		  return;
		}
	  
		setLastPlayedCase(position);
		setVisitedCases(prev => new Set(prev).add(position));
		setAlertShown(false);
	
		if (QUI_SUIS_JE_CASES.includes(position)) {
			setQuizOpen(true);
		} else if (CORRESPONDANCE_CASES.includes(position)) {
			setCurrentCase(position);
			setCorrespondanceOpen(true);
		} else if (FILL_IN_BLANK_CASES.includes(position)) {
			setFillBlankOpen(true);
		} else if (NOM_DEUX_CASES.includes(position)) {
			setNomDeuxOpen(true);
		} else if (PARLER_DE_CASES.includes(position)) {
			setParlerDeOpen(true);
		} else if (TRIBU_CASES.includes(position)) {
			setCurrentCase(position);
			setTribuOpen(true);
		} else if (VRAI_FAUX_CASES.includes(position)) {
			setVraiFauxOpen(true);
		} else if (CARTE_CASES.includes(position)) {
			setCarteOpen(true);
		} else if (QR_CASES.includes(position)) {
			setCurrentQRCase(position);
			setQROpen(true);
		}
		else if (IMAGE_ORDER_CASES.includes(position)) {
			setCurrentCase(position);
			setImageOrderOpen(true);
		}
	};
	
	

	const moveBackward = (start, end, callback) => {
		const audio = new Audio(moveSound); // Sound for moving backward
		const interval = setInterval(() => {
			setPlayerPosition((prevPos) => {
				const nextPos = prevPos - 1;
				audio.pause();
				audio.currentTime = 0;
				audio.play();
	
				if (nextPos <= end) {
					clearInterval(interval);
					if (callback) callback(nextPos); // Trigger the callback when movement finishes
					return end; // Stop at the end position
				}
				return nextPos; // Continue moving backward
			});
		}, 1000); // Adjust time interval for smooth animation
	};

	const movePlayer = (start, end, callback) => {
		const isForward = end > start;
		const step = isForward ? 1 : -1;
		const audio = new Audio(moveSound);
		audio.loop = true; // Make it loop while moving
		audio.play();
	  
		const interval = setInterval(() => {
		  setPlayerPosition((prevPos) => {
			const nextPos = prevPos + step;
	  
			if (nextPos === end) {
			  clearInterval(interval);
			  audio.pause();
			  audio.currentTime = 0;
			  if (callback) callback(nextPos);
			  return end;
			}
			return nextPos;
		  });
		}, 350); // Faster movement (every 300ms, adjust if needed)
	  };
	  
	
	
	
	

  // Function to handle quiz validation
  const handleQuizValidation = (isCorrect) => {
	if (isCorrect) {
	  setScore(prevScore => {
		const newScore = prevScore + 1;
		console.log('Updating score from Quiz:', newScore);
		return newScore;
	  });
	  setPlayedCases(prev => new Set(prev).add(playerPosition));
	}
	setQuizOpen(false);
  };

    // Handle validation for CorrespondanceGame
	const handleCorrespondanceValidation = (isCorrect) => {
		if (isCorrect) {
		  // Only add score if this case hasn't been played before
		  if (!playedCases.has(currentCase)) {
			setScore(prevScore => {
			  const newScore = prevScore + 1;
			  console.log('Updating score from Correspondance:', newScore);
			  return newScore;
			});
		  }
		  // Always mark as played (even if incorrect, to prevent future points)
		  setPlayedCases(prev => new Set(prev).add(currentCase));
		}
		setCorrespondanceOpen(false);
	  };
	  



	  const handleFillBlankValidation = (isCorrect) => {
		if (isCorrect) {
		  // Correct answer - move forward 1 space (no points)
		  setPlayedCases(prev => new Set(prev).add(playerPosition));
		  const targetPosition = Math.min(playerPosition + 1, positions.length - 1);
		  movePlayer(playerPosition, targetPosition, (finalPosition) => {
			handleSpecialCases(finalPosition);
		  });
		}
		setFillBlankOpen(false);
	  };
	
	

	 const handleNomDeuxValidation = ({ correctCount, totalBlanks }) => {
  if (correctCount > 0) {
    const pointsGained = correctCount; // 1 or 2
    setScore(prevScore => {
      const newScore = prevScore + pointsGained;
      console.log(`NomDeux: ${correctCount}/${totalBlanks} correct – adding ${pointsGained} point(s). New score: ${newScore}`);
      return newScore;
    });
  }
  setPlayedCases(prev => new Set(prev).add(playerPosition));
  setNomDeuxOpen(false);
};



	  const handleParlerDeValidation = (isCorrect) => {
		if (isCorrect) {
		  // Just mark as played (no points)
		  setPlayedCases(prev => new Set(prev).add(playerPosition));
		}
		setParlerDeOpen(false);
	  };
	
	
	


	const handleCollectRecipe = (recipe) => {
		setCollectedRecipes([...collectedRecipes, recipe]);
		setTribuOpen(false);
	};
	


	const handleVraiFauxValidation = (isCorrect) => {
		setVraiFauxOpen(false);
		
		if (isCorrect) {
		  // Correct answer - just mark as played (no points)
		  setPlayedCases(prev => new Set(prev).add(playerPosition));
		} else {
		  // Incorrect answer - move back 1 space
		  const targetPosition = Math.max(playerPosition - 1, 0);
		  moveBackward(playerPosition, targetPosition, (finalPosition) => {
			setLastPlayedCase(null);
			handleSpecialCases(finalPosition);
		  });
		}
	  };
	
	

	  const handleImageOrderValidation = (isCorrect) => {
		if (isCorrect) {
		  setScore(prevScore => {
			const newScore = prevScore + 1;
			console.log('Updating score from ImageOrder:', newScore);
			return newScore;
		  });
		  setPlayedCases(prev => new Set(prev).add(playerPosition));
		}
		setImageOrderOpen(false);
	  };

const handleCarteValidation = (isCorrect) => {
  // Add the result to our tracking array
  setCarteResults(prev => [...prev, { caseNumber: playerPosition, correct: isCorrect }]);
  setCarteOpen(false);
};
	  
	
	
	
	


const handleQRValidation = (isCorrect) => {
	if (isCorrect) {
	  // Only add score if this QR case hasn't been played before
	  if (!playedCases.has(currentQRCase)) {
		setScore(prevScore => {
		  const newScore = prevScore + 1;
		  console.log('Updating score from QR (first correct answer):', newScore);
		  return newScore;
		});
	  }
	  // Always mark as played to prevent future points
	  setPlayedCases(prev => new Set(prev).add(currentQRCase));
	}
	
	// Additional debug logging
	console.log(`QR Game result:`, {
	  case: currentQRCase,
	  correct: isCorrect,
	  alreadyPlayed: playedCases.has(currentQRCase),
	  currentScore: score
	});
  
	setQROpen(false);
	setCurrentQRCase(null);
  };
	

	const restartGame = () => {
		setPlayerPosition(0);
		setScore(0);
		setCollectedRecipes([]);
		setPlayedCases(new Set());
		setVisitedCases(new Set());
		setWin(false);
	};
	

	const handleAvancer = () => {
		if (gameOpen || win) return;	
		
		setTimeout(() => {
		  const newPosition = playerPosition + 1;
		
		  if (newPosition >= positions.length || positions[newPosition].type === 'finish') {
			setPlayerPosition(positions.findIndex(pos => pos.type === 'finish'));
			
			// Check if player answered correctly on any CarteGame case
			const answeredCorrectlyOnCarte = carteResults.some(result => 
			  CARTE_CASES.includes(result.caseNumber) && result.correct
			);
			
			// Only set win to true here, showCongrats will be set when clicking "Continuer"
			setWin(true);
			setShowCongrats(false); // Ensure congrats video doesn't show immediately
			
			const winAudio = new Audio(victorySound);
			winAudio.play();
		  } else {
			movePlayer(playerPosition, newPosition, (finalPosition) => {
			  handleSpecialCases(finalPosition);
			});
		  }
		}, 500);
	  };
	  
	  
	

	
  return (


		<div className="board" 
		style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>

			{positions.map((pos, index) => (
				<div
					key={index}
					className={`board-position ${index === playerPosition ? 'player' : ''}`}
					style={{
						gridRow: pos.row,
						gridColumn: pos.col + 1
					}}
				>
					{pos.type === 'depart' && <img src="/images/dep11.jpg" alt="Depart" className="board-image" />}
					{pos.type === 'finish' && <img src="/images/fin222.jpg" alt="Finish" className="board-image" />}
					{pos.number && <img src={`/images/${pos.number}.jpg`} alt={`Position ${pos.number}`} className="board-image" />}
				</div>
			))}
		{!gameOpen && !win && (
  <div className="avancer-container">
    <img 
      src="/images/avancer-btn.png" 
      className="avancer-img-btn" 
      onClick={handleAvancer}
      alt="Avancer Button"
    />
  </div>
)}



{/* Qui suis-je ? Popup */}
{quizOpen && <QuiSuisJe caseNumber={playerPosition} onValidate={handleQuizValidation} />}

{/* Correspondance Game Popup */}
{correspondanceOpen && <CorrespondanceGame caseNumber={currentCase} onValidate={handleCorrespondanceValidation} />}

{fillBlankOpen && <VideGame caseNumber={playerPosition} onValidate={handleFillBlankValidation} />}


{nomDeuxOpen && <NomDeuxGame caseNumber={playerPosition} onValidate={handleNomDeuxValidation} />}

{parlerDeOpen && (
    <ParlerDeGame 
        caseNumber={playerPosition} 
        onValidate={handleParlerDeValidation}
    />
)}

{tribuOpen && <TribuGame caseNumber={currentCase} onCollect={handleCollectRecipe} onClose={() => setTribuOpen(false)} />}

{vraiFauxOpen && <VraiFauxGame caseNumber={playerPosition} onValidate={handleVraiFauxValidation} />}

{carteOpen && <CarteGame onValidate={handleCarteValidation} caseNumber={playerPosition} />}

{qrOpen && <QRGame caseNumber={currentQRCase} onValidate={handleQRValidation} />}

{imageOrderOpen && (
    <AnoterGame 
        caseNumber={playerPosition} 
        onValidate={handleImageOrderValidation}
    />
)}


{win && !showCongrats && !showThanksVideo && (
  <div className="win-message">
    <h2>🎉 Félicitations ! Vous avez gagné !</h2>
	<p>Votre score final : {score} points</p>

    <div className="collected-recipes">
      <h3>🛒 Mes Recettes :</h3>
      <div className="recipes-grid">
        {collectedRecipes.map((recipe, index) => (
          <div
            key={index}
            className="recipe-card"
            onClick={() => handleRecipeClick(recipe)}
          >
            <img src={recipe.image} alt={recipe.name} className="recipe-img" />
            <h4>{recipe.name}</h4>
          </div>
        ))}
      </div>
    </div>

    <button
      className="continue-btn"
      onClick={() => {
        // Check if any CarteGame was answered correctly
        const hasCorrectCarte = carteResults.some(r => r.correct);
        if (hasCorrectCarte) {
          setShowCongrats(true);
        } else {
          setShowThanksVideo(true);
        }
      }}
    >
      ▶️ Continuer
    </button>
  </div>
)}

{selectedRecipe && (
  <div className="recipe-popup">
    <div className="popup-overlay" onClick={closeRecipePopup}></div>
    <div className="popup-content">
      <button className="close-btn" onClick={closeRecipePopup}>❌</button>
      <h2>{selectedRecipe.name}</h2>
      <img src={selectedRecipe.image} alt={selectedRecipe.name} className="popup-img large-img" />
    </div>
  </div>
)}

{showCongrats && (
  <div className="board-video-overlay">
    <video
      src={`/videos/congrats${selectedCharacterIndex}.mp4`}
      autoPlay
      controls={false}
      className="board-video-player"
      onEnded={() => {
        // After congrats video, show thanks video
        setShowCongrats(false);
        setShowThanksVideo(true);
      }}
      playsInline
    />
  </div>
)}

{showThanksVideo && (
  <div className="board-video-overlay">
    <video
      src="/videos/thanks.mp4"
      autoPlay
      controls={false}
      className="board-video-player"
      onEnded={() => {}}
      playsInline
    />
    <button 
      className="board-continue-btn" 
      onClick={() => window.location.reload()}
    >
      Terminer
    </button>
  </div>
)}




		</div>
	);
};



export default Board;