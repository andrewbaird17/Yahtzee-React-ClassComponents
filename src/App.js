import React, { Component } from 'react';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			start: false,
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
			roll: 0,
		};
		this.handleStart = this.handleStart.bind(this);
		this.handleRoll = this.handleRoll.bind(this);
		this.handleDieClick = this.handleDieClick.bind(this);
	}

	componentDidMount() {
		console.log(this.state.diceSet);
	}

	componentDidUpdate(prevProps) {
		if (this.props.diceSet !== prevProps.diceSet) {
		}
	}

	handleStart(event) {
		event.preventDefault();
		this.setState({
			start: !this.state.start,
		});
	}

	handleRoll(event) {
		event.preventDefault();
		if (this.state.roll === 3) {
			this.setState({
				roll: 1,
			});
		} else {
			this.setState({
				roll: this.state.roll + 1,
				diceSet: this.state.diceSet.map((die, index) => {
					console.log(die);
					if (die.hold === true) {
						return die.value;
					} else {
						return (die.value = Math.floor(Math.random() * 6) + 1);
					}
				}),
			});
		}
		console.log(this.state.diceSet);
	}

	handleDieClick(id, hold) {

		const selectedDie = this.state.diceSet.find(item => item.id === id);



		//TODO: here you will update the state object for this item. You can figure out the index and go from there.



		console.log('it worked')
		console.log(selectedDie)

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
						<DiceSet dice={this.state.diceSet} handleClick={this.handleDieClick} />
						<div className="roll-again">
							<h2>Current Roll: {this.state.roll} </h2>
							<button className="roll-button" onClick={this.handleRoll}>
								Roll Again
							</button>
						</div>
					</div>
				</div>
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
		this.state = {
			id: null,
			value: null,
			hold: false,
		};
		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		this.setState({
			id: this.props.id,
			value: this.props.value,
			hold: this.props.hold,
		});
		console.log(this.props);
	}

	handleClick(event) {
		event.preventDefault();


		this.props.handleClick(
			this.state.id,
			!this.state.hold
		);

		this.setState({
			hold: !this.state.hold,
		});

	}

	render() {
		return (
			<div className="dice-set">
				<div className="die-appearance">
					<h1>{this.state.value}</h1>
				</div>
				<div className={`die ${this.state.hold ? 'hold' : ''}`}>
					<h3>{this.state.hold ? 'Held' : ''}</h3>
				</div>
				<button onClick={this.handleClick}>Change Hold Status</button>
			</div>
		);
	}
}

export default App;
