import React from 'react';
import '../styles/QuizPopup.css';

const QuizPopup = ({ question, choices, onAnswer, closePopup }) => {
	return (
		<div className="quiz-popup">
			<div className="quiz-content">
				<h2>{question}</h2>
				<div className="choices">
					{choices.map((choice, index) => (
						<button key={index} onClick={() => onAnswer(choice)}>
							{choice}
						</button>
					))}
				</div>
				<button className="close-btn" onClick={closePopup}>
					Close
				</button>
			</div>
		</div>
	);
};

export default QuizPopup;
