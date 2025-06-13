import { Dialog } from '@radix-ui/react-dialog';
import useGameStore from '../store/gameStore';

const QuestionCard = ({ question, answer }) => {
  const { rollDice } = useGameStore();

  const checkAnswer = (choice) => {
    if (choice === answer) {
      alert('Correct!');
      rollDice();
    } else {
      alert('Wrong!');
    }
  };

  return (
    <Dialog>
      <div className="p-5 bg-white rounded-lg">
        <h3>{question}</h3>
        <div className="flex gap-3">
          {['Apple', 'Tomato', 'Carrot'].map((choice, index) => (
            <button
              key={index}
              className="p-2 bg-blue-300 rounded-lg"
              onClick={() => checkAnswer(choice)}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>
    </Dialog>
  );
};

export default QuestionCard;
