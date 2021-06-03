import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

function Square(props) {
  return (
    <button 
    className={props.winningSquare ? "square-highlited" : "square"} 
    onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
renderSquare(i) {
  return (
    <Square 
      value={this.props.board[i]} 
      onClick={() => this.props.onClick(i)}
      winningSquare={this.props.winningSquares ? this.props.winningSquares.includes(i) : false}
      />
  );
}

render() {
  return (
    <div>
      <div className="board-row">
        {this.renderSquare(0)}
        {this.renderSquare(1)}
        {this.renderSquare(2)}
      </div>
      <div className="board-row">
        {this.renderSquare(3)}
        {this.renderSquare(4)}
        {this.renderSquare(5)}
      </div>
      <div className="board-row">
        {this.renderSquare(6)}
        {this.renderSquare(7)}
        {this.renderSquare(8)}
      </div>
    </div>
  );
}
}

class Game extends React.Component {
constructor(props) {
  super(props);
  this.state = {
    history : [Array(9).fill(null),],
    xIsNext : true
  };
}

nextPlayer() {
  return this.state.xIsNext ? 'X' : 'O';
}

handleClick(i) {
  const newBoard = this.state.history[this.state.history.length - 1].slice();
  // dont respond to click if there is a winner or the square is filled
  if (calculateWinner(newBoard) || newBoard[i]) {
    return;
  }
  
  newBoard[i] = this.nextPlayer();
  const newHistory = this.state.history.slice();
  newHistory.push(newBoard);
  // push to array the new board that is created
  this.setState(
    (state,props) => 
    ({history : newHistory, xIsNext : !this.state.xIsNext})
    );
}

createListItems() {
  return this.state.history.map((board, move) => {
    const desc = move ? 'Go to move ' + move : 'Go to game start';
    return (<li key={move}>
        <button onClick={() => this.goBackToMove(move)}>{desc}</button>
    </li>);
  });
}

goBackToMove(move) {
  const newHistory = this.state.history.slice(0, move+1);
  this.setState({history: newHistory, xIsNext: move%2 ? false : true});
}

render() {
  const history = this.state.history;
  const current = history[history.length -1];
  const winner = calculateWinner(current);
  let status;
  
  if (winner) {
    status = 'The winner is: ' + winner.winner;
  } else {
    status = 'Next player is: ' + this.nextPlayer();
  }
  
  return (
    <div className="game">
      <Clock className="clock"/>
      <div className="game-board">

        <Board 
          board={this.state.history[this.state.history.length - 1]} 
          onClick={(i) => this.handleClick(i)}
          winningSquares={winner ? winner.winningSquares : null}/>

        <div className="game-info">
          <div className="status">{status}</div>
          <ol>
            {this.createListItems()}
          </ol>
        </div>

      </div>
    </div>
  );
}
}

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time : new Date()
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({time: new Date()});
  }

  render() {
    return (
      <div>
        {this.state.time.toLocaleTimeString()}
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
<Game />,
document.getElementById('root')
);

function calculateWinner(squares) {
const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
for (let i = 0; i < lines.length; i++) {
  const [a, b, c] = lines[i];
  if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    return {winner: squares[a], winningSquares: [a, b, c]};
  }
}
return null;
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
