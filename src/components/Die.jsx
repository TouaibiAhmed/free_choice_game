import React, { useEffect, useRef } from 'react';
import '../styles/Dice.css';

const Die = ({ roll, number }) => {
    const diceRef = useRef(null);

	useEffect(() => {
		if (roll) {
		  // Start the random rolling animation
		  diceRef.current.style.animation = "rolling 3s";
	
		  setTimeout(() => {
			// After the rolling animation ends, smoothly transition to the rolled number
			switch (number) {
				case 1:
				  diceRef.current.style.transform = "rotateX(0deg) rotateY(0deg)"; // 1 on top
				  break;
				case 2:
				  diceRef.current.style.transform = "rotateX(-90deg) rotateY(0deg)"; // 2 on top
				  break;
				case 3:
				  diceRef.current.style.transform = "rotateX(0deg) rotateY(-90deg)"; // 3 on top
				  break;
				case 4:
				  diceRef.current.style.transform = "rotateX(0deg) rotateY(90deg)"; // 4 on top
				  break;
				case 5:
				  diceRef.current.style.transform = "rotateX(90deg) rotateY(0deg)"; // 5 on top
				  break;
				case 6:
				  diceRef.current.style.transform = "rotateX(180deg) rotateY(0deg)"; // 6 on top
				  break;
				default:
				  break;
			  }
			  

			diceRef.current.style.animation = "none"; // Stop the animation after the transition
		  }, 3000); // Match the duration of the rolling animation
		}
	  }, [roll, number]);




	const renderPips = (face) => {
		const pipPositions = {
			1: [[50, 50]],
			2: [[20, 20], [80, 80]],
			3: [[20, 20], [50, 50], [80, 80]],
			4: [[20, 20], [80, 20], [20, 80], [80, 80]],
			5: [[20, 20], [80, 20], [50, 50], [20, 80], [80, 80]],
			6: [[20, 20], [80, 20], [20, 50], [80, 50], [20, 80], [80, 80]],
		};
	
		return pipPositions[face].map((pos, index) => (
			<div key={index} className="pip" style={{ top: `${pos[0]}%`, left: `${pos[1]}%` }}></div>
		));
	};
	

    return (
		<div className="dice" ref={diceRef}>
	<div className="face front">{renderPips(1)}</div>
<div className="face back">{renderPips(6)}</div>
<div className="face top">{renderPips(2)}</div>
<div className="face bottom">{renderPips(5)}</div>
<div className="face right">{renderPips(3)}</div>
<div className="face left">{renderPips(4)}</div>

	</div>
	
    );
};

export default Die;
