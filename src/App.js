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
		};
		this.handleStart = this.handleStart.bind(this);
	}

	handleStart(event) {
		event.preventDefault();
		this.setState({
			start: !this.state.start,
		});
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
						<DiceSet dice={this.state.diceSet} />
					</div>
				</div>
			</div>
		);
	}
}

const DiceSet = (props) => (
	<div>
		{props.dice.map((die) => (
			<Die key={die.id} {...die} />
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
	}

	handleClick(event) {
		event.preventDefault();
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
