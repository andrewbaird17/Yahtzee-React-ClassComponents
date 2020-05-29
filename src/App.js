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
				{ id: 'ones', score: 0, targetValue: 1, scored: false },
				{ id: 'twos', score: 0, targetValue: 2, scored: false },
				{ id: 'threes', score: 0, targetValue: 3, scored: false },
				{ id: 'fours', score: 0, targetValue: 4, scored: false },
				{ id: 'fives', score: 0, targetValue: 5, scored: false },
				{ id: 'sixes', score: 0, targetValue: 6, scored: false },
				{ id: 'threeOfAKind', score: 0, scored: false },
				{ id: 'fourOfAKind', score: 0, scored: false },
				{ id: 'fullHouse', score: 0, scored: false },
				{ id: 'smallStraight', score: 0, scored: false },
				{ id: 'largeStraight', score: 0, scored: false },
				{ id: 'yahtzee', score: 0, scored: false },
				{ id: 'upperScore', score: 0, scored: false },
				{ id: 'total', score: 0, scored: false },
			],
		};
		this.handleStart = this.handleStart.bind(this);
		this.handleRoll = this.handleRoll.bind(this);
		this.handleDieClick = this.handleDieClick.bind(this);
		this.calculateSinglesScore = this.calculateSinglesScore.bind(this);
		this.saveScore = this.saveScore.bind(this);
	}

	/* 	componentDidMount() {
		console.log(this.state.diceSet);
	} */

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
			// need to choose score on scorecard if reach this point
			this.setState({
				roll: 0,
			});
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
	};

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
						handleScore={this.calculateSinglesScore}
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

		this.props.handleScore(event, this.props.targetValue, this.props.id);
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
