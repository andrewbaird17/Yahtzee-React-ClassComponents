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
			],
			straightSheet: [
				{ id: 'Small Straight', score: 0, scored: false },
				{ id: 'Large Straight', score: 0, scored: false },
			],
			multiSheet: [
				{ id: 'Three Of A Kind', score: 0, scored: false },
				{ id: 'Four Of A Kind', score: 0, scored: false },
				{ id: 'Full House', score: 0, scored: false },
				{ id: 'Yahtzee', score: 0, scored: false },
			],
			chanceSheet: [{ id: 'Chance', score: 0, scored: false }],
			totalBonus: [
				{ id: 'Upper Score', score: 0 },
				{ id: 'Bonus for Upper', score: 0 },
				{ id: 'Total', score: 0 },
			],
		};
		this.handleStart = this.handleStart.bind(this);
		this.handleRoll = this.handleRoll.bind(this);
		this.handleDieClick = this.handleDieClick.bind(this);
		this.calculateSinglesScore = this.calculateSinglesScore.bind(this);
		this.calculateMultiKind = this.calculateMultiKind.bind(this);
		this.calculateStraights = this.calculateStraights.bind(this);
		this.caluclateChance = this.caluclateChance.bind(this);
		this.calculateTotal = this.calculateTotal.bind(this);
		this.calculateBonus = this.calculateBonus.bind(this);
		this.saveScoreSingles = this.saveScoreSingles.bind(this);
		this.saveScoreMulti = this.saveScoreMulti.bind(this);
		this.saveScoreStraights = this.saveScoreStraights.bind(this);
		this.saveBonusScore = this.saveBonusScore.bind(this);
		this.saveTotalScore = this.saveTotalScore.bind(this);
		this.resetDiceAndRoll = this.resetDiceAndRoll.bind(this);
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
		//console.log(die);
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
				return this.resetDiceSetHold(die);
			});
		} else {
			this.setState({
				roll: this.state.roll + 1,
			});
			this.state.diceSet.map((die) => {
				return this.changeValue(die);
			});
		}
		//console.log(this.state.diceSet);
	}

	resetDiceAndRoll() {
		this.setState({
			roll: 0,
		});
		this.state.diceSet.map((die) => {
			return this.resetDiceSetHold(die);
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

	// Bonus check function of singles scoresheet --> 35 points if true
	calculateBonus() {
		let runningTotal = 0;
		let bonus = 0;
		this.state.scoresheet.forEach((element) => {
			runningTotal += element.score;
		});
		if (runningTotal >= 63) {
			bonus = 35;
		}
		this.saveBonusScore(bonus);
	}

	// Total point to sum up all of the scoresheets
	calculateTotal() {
		let runningTotal = 0;
		//scoresheet, straightSheet, multiSheet, chanceSheet, and bonus within totalBonus
		this.state.scoresheet.forEach((element) => {
			runningTotal += element.score;
		});
		this.state.straightSheet.forEach((element) => {
			runningTotal += element.score;
		});
		this.state.multiSheet.forEach((element) => {
			runningTotal += element.score;
		});
		this.state.chanceSheet.forEach((element) => {
			runningTotal += element.score;
		});
		let bonus = this.state.totalBonus[1];
		runningTotal += bonus.score;
		//console.log(runningTotal);
		this.saveTotalScore(runningTotal);
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
		this.saveScoreSingles(id, newScore);
		this.resetDiceAndRoll();
		this.calculateTotal();
	};

	// three of a kind --> sum of all dice if true
	// four of a kind --> sum of all dice if true
	// full house --> 25 points if true
	// yahtzee --> five of a kind (50 points)  {further logic needed for multiple yahtzees}
	calculateMultiKind = (event, id) => {
		event.preventDefault();
		console.log('multipleKind');
		let newScore = 0;
		let secondMaxCount = 0;
		let maxCount = 1;
		let currentCount = 0;
		let diceArray = this.state.diceSet;
		// go through diceset and see what the highest count of a single number is
		for (let i = 0; i < diceArray.length; i++) {
			for (let j = i; j < diceArray.length; j++) {
				if (diceArray[i].value === diceArray[j].value) {
					currentCount++;
				}
				if (currentCount >= maxCount) {
					secondMaxCount = maxCount;
					maxCount = currentCount;
				} else if (currentCount > secondMaxCount) {
					secondMaxCount = currentCount;
				}
			}
			currentCount = 0;
		}

		// check for yahtzee
		if (maxCount === 5 && id === 'Yahtzee') {
			newScore = 50;
		}
		//check for if four of a kind was clicked
		else if (maxCount >= 4 && id === 'Four Of A Kind') {
			this.state.diceSet.forEach((element) => {
				return (newScore += element.value);
			});
			//check for three of a kind
		} else if (maxCount === 3 && secondMaxCount === 2) {
			newScore = 25;
		} else if (maxCount >= 3) {
			if (id === 'Three Of A Kind') {
				this.state.diceSet.forEach((element) => {
					return (newScore += element.value);
				});
			}
			//if four of a kind or yahtzee is selected but previous conditions are not met
			else {
				console.log(maxCount);
				console.log(secondMaxCount);
				newScore = 0;
			}
		}
		// if no conditions are met, the score stays zero
		console.log(newScore);
		//save score with id and newScore and then reset dice
		this.saveScoreMulti(id, newScore);
		this.resetDiceAndRoll();
		this.calculateTotal();
	};

	// small straight --> 4 numbers in a row (30 points)
	// large straight --> 5 numbers in a row (40 points)
	calculateStraights = (event, id) => {
		event.preventDefault();
		console.log('straights');
		let newScore = 0;
		let diceArray = this.state.diceSet;
		let straightCount = 1;
		let maxStraight = 1;

		// try and sort the diceSet based on values
		const sorted = diceArray.sort((a, b) => a.value - b.value);
		console.log(sorted);

		const noDuplicates = [
			...new Map(sorted.map((item) => [item['value'], item])).values(),
		];
		console.log(noDuplicates);

		// logic to determine small vs large straight
		for (let i = 1; i < noDuplicates.length; i++) {
			if (noDuplicates[i - 1].value === noDuplicates[i].value - 1) {
				straightCount++;
			}
		}
		if (straightCount > maxStraight) {
			maxStraight = straightCount;
		}
		console.log(maxStraight);

		if (maxStraight === 5 && id === 'Large Straight') {
			newScore = 40;
		} else if (maxStraight >= 4 && id === 'Small Straight') {
			newScore = 30;
		} else {
			newScore = 0;
		}
		this.saveScoreStraights(id, newScore);
		this.resetDiceAndRoll();
		this.calculateBonus();
		this.calculateTotal();
	};

	//chance -->  sum of all dice
	caluclateChance = (event, id) => {
		event.preventDefault();
		console.log('chance');
		let newScore = 0;
		this.state.diceSet.forEach((element) => {
			return (newScore += element.value);
		});
		this.saveScoreChance(id, newScore);
		this.resetDiceAndRoll();
		this.calculateTotal();
	};

	saveTotalScore(newScore) {
		const totalScore = this.state.totalBonus.findIndex(
			(item) => item.id === 'Total'
		);
		let changedTotal = [...this.state.totalBonus];
		changedTotal[totalScore] = {
			...changedTotal[totalScore],
			score: newScore,
		};
		this.setState({
			totalBonus: changedTotal,
		});
	}

	saveBonusScore(newScore) {
		const bonusScore = this.state.totalBonus.findIndex(
			(item) => item.id === 'Bonus for Upper'
		);
		let changedTotal = [...this.state.totalBonus];
		changedTotal[bonusScore] = {
			...changedTotal[bonusScore],
			score: newScore,
		};
		this.setState({
			totalBonus: changedTotal,
		});
	}

	saveScoreSingles(id, newScore) {
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

	saveScoreChance(id, newScore) {
		const selectedScore = this.state.chanceSheet.findIndex(
			(item) => item.id === id
		);

		let changedScore = [...this.state.chanceSheet];
		if (changedScore[selectedScore].scored === false) {
			changedScore[selectedScore] = {
				...changedScore[selectedScore],
				score: newScore,
				scored: true,
			};
			this.setState({
				chanceSheet: changedScore,
			});
		}
	}

	saveScoreMulti(id, newScore) {
		const selectedScore = this.state.multiSheet.findIndex(
			(item) => item.id === id
		);

		let changedScore = [...this.state.multiSheet];
		if (changedScore[selectedScore].scored === false) {
			changedScore[selectedScore] = {
				...changedScore[selectedScore],
				score: newScore,
				scored: true,
			};
			this.setState({
				multiSheet: changedScore,
			});
		}
	}

	saveScoreStraights(id, newScore) {
		const selectedScore = this.state.straightSheet.findIndex(
			(item) => item.id === id
		);

		let changedScore = [...this.state.straightSheet];
		if (changedScore[selectedScore].scored === false) {
			changedScore[selectedScore] = {
				...changedScore[selectedScore],
				score: newScore,
				scored: true,
			};
			this.setState({
				straightSheet: changedScore,
			});
		}
	}

	render() {
		return (
			<div className="App">
				<h1>Welcome to Yahtzee!</h1>
				<h3>
					A classic remake of the dice game without the hassle of real dice!
				</h3>
				<button
					className={this.state.start ? 'hidden' : 'btn'}
					onClick={this.handleStart}
				>
					Start Game
				</button>
				<div className={this.state.start ? '' : 'hidden'}>
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
						<h3 className="center-text">
							By the end of Roll 3, select the scoring area to score, no repeat
							selections allowed
						</h3>
						<SingleScores
							scoresheet={this.state.scoresheet}
							handleScore={this.calculateSinglesScore}
						/>
						<MultiScores
							scoresheet={this.state.multiSheet}
							handleScore={this.calculateMultiKind}
						/>
						<StraightScores
							scoresheet={this.state.straightSheet}
							handleScore={this.calculateStraights}
						/>
						<ChanceScore
							scoresheet={this.state.chanceSheet}
							handleScore={this.caluclateChance}
						/>
						<div>
							<h2>Total Points</h2>
							<h3>{this.state.totalBonus[2].score}</h3>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const SingleScores = (props) => (
	<div>
		{props.scoresheet.map((el) => (
			<Cell key={el.id} {...el} handleScore={props.handleScore} />
		))}
	</div>
);

const MultiScores = (props) => (
	<div>
		{props.scoresheet.map((el) => (
			<Cell key={el.id} {...el} handleScore={props.handleScore} />
		))}
	</div>
);

const StraightScores = (props) => (
	<div>
		{props.scoresheet.map((el) => (
			<Cell key={el.id} {...el} handleScore={props.handleScore} />
		))}
	</div>
);

const ChanceScore = (props) => (
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

		if (
			this.props.id === 'Three Of A Kind' ||
			this.props.id === 'Four Of A Kind' ||
			this.props.id === 'Full House' ||
			this.props.id === 'Yahtzee'
		) {
			//multiKind
			this.props.handleScore(event, this.props.id);
		} else if (
			this.props.id === 'Small Straight' ||
			this.props.id === 'Large Straight'
		) {
			//straights
			this.props.handleScore(event, this.props.id);
		} else if (this.props.id === 'Chance') {
			this.props.handleScore(event, this.props.id);
		} else {
			//Singles
			this.props.handleScore(event, this.props.targetValue, this.props.id);
		}
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
