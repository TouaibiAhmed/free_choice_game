import React, { Component } from 'react';
import Die from './Die';
import '../styles/Dice.css';

import diceRollSound from '/sounds/dice-roll.mp3';

class RollDice extends Component {
  static defaultProps = {
    sides: [1, 2, 3, 4, 5, 6],
  };

  constructor(props) {
    super(props);
    this.state = { die1: 1, rolling: false };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.props.disabled) return; // Prevent rolling if disabled is true

    const numDie1 = this.props.sides[Math.floor(Math.random() * this.props.sides.length)];

    this.setState({ die1: numDie1, rolling: true });
    this.props.onRoll(numDie1);

    // Play dice roll sound
    const audio = new Audio(diceRollSound);
    audio.play();

    setTimeout(() => {
      this.setState({ rolling: false });
    }, 4050);
  }

  render() {
    return (
      <div className="RollDice">
        <div className="RollDice-box">
          <Die number={this.state.die1} roll={this.state.rolling} />
        </div>
        <button
          className="RollDice-button"
          onClick={this.handleClick}
          disabled={this.state.rolling || this.props.disabled} // Disable based on props
        >
          {this.state.rolling ? 'Dé lancé...' : 'Lancer le dé'}
        </button>
      </div>
    );
  }
}

export default RollDice;