import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
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
      xIsNext: true,
      stepNumber: 0,
      history: [
        {
          squares: Array(9).fill(null)
        }
      ]
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = this.state.history[history.length - 1];
    const squares = current.squares.slice();

    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      history: history.concat([
        {
          squares: squares
        }
      ])
    });
  }

  calculateWinner(squares) {
    if (squares.every(s => s === null)) {
      return null;
    }
    const teams = ['X', 'O'];
    const wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [6, 4, 2]
    ];

    for (const team of teams) {
      for (const combo of wins) {
        if (combo.every(s => squares[s] === team)) {
          return team;
        }
      }
    }
    return false;
  }

  handleJumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = this.state.history[this.state.stepNumber];

    const winner = this.calculateWinner(current.squares);
    const team = this.state.xIsNext ? 'X' : 'O';
    let status = `${team}'s turn.`;
    let title = 'Start your game.';
    if (!!winner) {
      title = `${winner} wins!`;
      status = `Well done, ${winner}`;
    } else if (winner === false) {
      title = 'Game is in progress.';
    }

    const moves = history.map((step, move) => {
      const text = move ? `Jump to move #${move}` : 'Jump to game start';
      return (
        <li key={move}>
          <button onClick={() => this.handleJumpTo(move)}>{text}</button>
        </li>
      );
    });

    return (
      <div>
        <h2 className="title">{title}</h2>
        <div className="game">
          <div className="game-board">
            <Board
              title={title}
              status={status}
              squares={current.squares}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById('root'));
