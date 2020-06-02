import React, { Component } from 'react';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			scored: false,
			start: false,
			roll: 0,
			diceSet: [
				{
					id: 1,
					value: 0,
					hold: false,
				},
				{
					id: 2,
					value: 0,
					hold: false,
				},
				{
					id: 3,
					value: 0,
					hold: false,
				},
				{
					id: 4,
					value: 0,
					hold: false,
				},
				{
					id: 5,
					value: 0,
					hold: false,
				},
			],
			scoresheet: [
				{ id: 'Ones', score: 0, targetValue: 1, scored: false },
				{ id: 'Twos', score: 0, targetValue: 2, scored: false },
				{ id: 'Threes', score: 0, targetValue: 3, scored: false },
				{ id: 'Fours', score: 0, targetValue: 4, scored: false },
				{ id: 'Fives', score: 0, targetValue: 5, scored: false },
				{ id: 'Sixes', score: 0, targetValue: 6, scored: false },
				{ id: 'Three Of A Kind', score: 0, scored: false },
				{ id: 'Four Of A Kind', score: 0, scored: false },
				{ id: 'Full House', score: 0, scored: false },
				{ id: 'Small Straight', score: 0, scored: false },
				{ id: 'Large Straight', score: 0, scored: false },
				{ id: 'Yahtzee', score: 0, scored: false },
				{ id: 'Upper Score', score: 0, scored: false },
				{ id: 'Total', score: 0, scored: false },
			],
		};
		this.handleStart = this.handleStart.bind(this);
		this.handleRoll = this.handleRoll.bind(this);
		this.handleDieClick = this.handleDieClick.bind(this);
		this.calculateSinglesScore = this.calculateSinglesScore.bind(this);
		this.saveScore = this.saveScore.bind(this);
		this.resetDiceAndRoll = this.resetDiceAndRoll.bind(this);
		this.calculateMultiKind = this.calculateMultiKind.bind(this);
	}

	handleStart(event) {
		// instead of having start as a state, maybe reveal "the board" and dice when it is clicked
		// once clicked the button disappears then
		event.preventDefault();
		this.setState({
			start: !this.state.start,
		});
	}

	changeValue(die) {
		// changle value based on id and hold status
		console.log(die);
		if (die.hold !== true) {
			die.value = Math.floor(Math.random() * 6) + 1;
		}
	}

	resetDiceSetHold(die) {
		die.hold = false;
	}

	handleRoll(event) {
		event.preventDefault();
		if (this.state.roll >= 3) {
			this.setState({
				roll: 0,
			});

			// need to choose score on scorecard if reach this point, should not be able to roll again until a scoring area is chosen

			this.state.diceSet.map((die) => {
				this.resetDiceSetHold(die);
			});
		} else {
			this.setState({
				roll: this.state.roll + 1,
			});
			this.state.diceSet.map((die) => {
				this.changeValue(die);
			});
		}
		console.log(this.state.diceSet);
	}

	resetDiceAndRoll() {
		this.setState({
			roll: 0,
		});
		this.state.diceSet.map((die) => {
			this.resetDiceSetHold(die);
		});
	}

	handleDieClick(id, hold) {
		const selectedDie = this.state.diceSet.findIndex((item) => item.id === id);

		//TODO: here you will update the state object for this item. You can figure out the index and go from there.
		let changedDice = [...this.state.diceSet];
		changedDice[selectedDie] = { ...changedDice[selectedDie], hold: hold };
		this.setState({
			diceSet: changedDice,
		});

		//console.log('it worked');
		//console.log(selectedDie);
	}

	// All scoring for ones, twos, threes, fours, fives, and sixes
	calculateSinglesScore = (event, targetValue, id) => {
		event.preventDefault();
		console.log(targetValue);
		let newScore = 0;
		//console.log('scorecard clicked');
		this.state.diceSet.forEach((element) => {
			if (element.value === targetValue) {
				newScore += targetValue;
			}
		});
		console.log(newScore);
		// send newScore and html id to a different function to update table
		this.saveScore(id, newScore);
		this.resetDiceAndRoll();
	};

	// ALL calucuate scoring functions need to take in id and pass id to saveScore with the newScore to save in the scoresheet

	// need three of a kind --> sum of all dice if true
	calculateMultiKind = (event, id) => {
		event.preventDefault();
		console.log('multipleKind');
		let newScore = 0;
		let maxCount = 0;
		let currentCount = 0;
		let diceArray = this.state.diceSet;
		for (let i = 0; i < diceArray.length; i++) {
			for (let j = i; j < diceArray.length; j++) {
				if (diceArray[i].value === diceArray[j].value) {
					currentCount++;
				}
				if (currentCount > maxCount) {
					maxCount = currentCount;
				}
			}
			currentCount = 0;
		}

		// check for yahtzee
		if (maxCount === 5 && id === 'Yahtzee') {
			newScore = 50;
		}
		//check for three of a Kind and higher
		else if (maxCount >= 4 && id === 'Four Of A Kind') {
			this.state.diceSet.forEach((element) => {
				return (newScore += element.value);
			});
		} else if (maxCount >= 3) {
			this.state.diceSet.forEach((element) => {
				return (newScore += element.value);
			});
		}
		console.log(newScore);
		//save score with id and newScore and then reset dice
		this.saveScore(id, newScore);
		this.resetDiceAndRoll();
	};

	// need four of a kind --> sum of all dice if true

	// need full house --> three of a kind and pair (25 points)

	// need small straight --> 4 numbers in a row (30 points)

	// need large straight --> 5 numbers in a row (40 points)

	// need chance -->  sum of all dice

	// need yahtzee --> five of a kind (50 points)  {further logic needed for multiple yahtzees}

	// need calculate all singles score function for bonus of 35 points if true (or keep it as a running total that is not shown just hidden in state?)

	// need calcualte all other scores function

	saveScore(id, newScore) {
		const selectedScore = this.state.scoresheet.findIndex(
			(item) => item.id === id
		);

		let changedScore = [...this.state.scoresheet];
		if (changedScore[selectedScore].scored === false) {
			changedScore[selectedScore] = {
				...changedScore[selectedScore],
				score: newScore,
				scored: true,
			};
			this.setState({
				scoresheet: changedScore,
			});
		}
	}

	render() {
		return (
			<div className="App">
				<h1>Welcome to Yahtzee!</h1>
				<button className="btn" onClick={this.handleStart}>
					Start Game
				</button>
				<div className="row">
					<div className="main">
						<DiceSet
							dice={this.state.diceSet}
							handleClick={this.handleDieClick}
						/>
						<div className="roll-again">
							<h2>Current Roll: {this.state.roll} </h2>
							<button className="roll-button" onClick={this.handleRoll}>
								Roll Again
							</button>
						</div>
					</div>
				</div>
				<div className="scorecard">
					<h1 className="center-text">Scorecard 2.0</h1>
					<ScoreSheet
						scoresheet={this.state.scoresheet}
						//handleScore={this.calculateSinglesScore}
						handleScore={this.calculateMultiKind}
					/>
				</div>
			</div>
		);
	}
}

const ScoreSheet = (props) => (
	<div>
		{props.scoresheet.map((el) => (
			<Cell key={el.id} {...el} handleScore={props.handleScore} />
		))}
	</div>
);

class Cell extends Component {
	constructor(props) {
		super(props);
		this.handleScore = this.handleScore.bind(this);
	}

	handleScore(event) {
		event.preventDefault();
		// singles
		//this.props.handleScore(event, this.props.targetValue, this.props.id);

		//multiKind
		this.props.handleScore(event, this.props.id);
	}

	render() {
		return (
			<div className="score-set">
				<h3>{this.props.id}</h3>
				<h4>{this.props.score}</h4>
				<button className="btn" onClick={this.handleScore}>
					Set Score
				</button>
				<input
					type="checkbox"
					id="scoredbox"
					readOnly
					checked={this.props.scored}
				/>
				<label htmlFor="scoredbox">Scored?</label>
			</div>
		);
	}
}

const DiceSet = (props) => (
	<div>
		{props.dice.map((die, index) => (
			<Die key={index} {...die} handleClick={props.handleClick} />
		))}
	</div>
);

class Die extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event) {
		event.preventDefault();

		this.props.handleClick(this.props.id, !this.props.hold);
	}

	render() {
		return (
			<div className="dice-set">
				<div className="die-appearance">
					<h1>{this.props.value}</h1>
				</div>
				<div className={`die ${this.props.hold ? 'hold' : ''}`}>
					<h3>{this.props.hold ? 'Held' : ''}</h3>
				</div>
				<button onClick={this.handleClick}>Change Hold Status</button>
			</div>
		);
	}
}

export default App;
