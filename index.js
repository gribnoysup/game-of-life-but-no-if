const chalk = require('chalk');

const AWAKE = 1;
const SLEEPY = 0;

class FixedArray2D {
  constructor(w, h, init = Function.prototype) {
    this.width = w;
    this.height = h;

    this.array = Array.from({ length: w * h }, (value, index) =>
      init(this.__indexToCoords(index))
    );
  }

  __indexToCoords(index) {
    return [Math.floor(index / this.width), index % this.width];
  }

  __coordsToIndex(coords) {
    const [x, y] = coords;

    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.width * x + y;
    } else {
      return -1;
    }
  }

  get(coords) {
    return this.array[this.__coordsToIndex(coords)];
  }

  set(coords, value) {
    return (this.array[this.__coordsToIndex(coords)] = value);
  }

  each(fn) {
    this.array = this.array.map((value, index) =>
      fn(value, this.__indexToCoords(index), this)
    );
  }

  getAdjacentCells(coords) {
    const [x, y] = coords;

    const coordSet = [
      [x - 1, y - 1],
      [x - 1, y],
      [x - 1, y + 1],
      [x, y - 1],
      // --- current coords: [x, y]
      [x, y + 1],
      [x + 1, y - 1],
      [x + 1, y],
      [x + 1, y + 1],
    ]
      .map(coords => this.get(coords))
      .filter(value => value !== undefined);

    return coordSet;
  }
}

class GameOfLife {
  constructor(w = 5, h = 5) {
    this.board = new FixedArray2D(w, h, _ => Math.round(Math.random()));
  }

  printBoard() {
    let string = '';

    this.board.each((value, coords) => {
      const [x, y] = coords;

      if (y === 0) string += '\n';
      if (value === 0) string += chalk.bgWhite('  ');
      if (value === 1) string += chalk.bgMagenta('  ');

      return value;
    });

    return string.trim();
  }

  tick() {
    this.board.each((value, coords) => {
      const activeAdjacentCells = this.board
        .getAdjacentCells(coords)
        .reduce((acc, val) => acc + val, 0);

      return GameOfLife.getNextState(value, activeAdjacentCells);
    });
  }

  static getNextState(currentState, numberOfAdjacentCells) {
    return Math.floor(((numberOfAdjacentCells | currentState) ^ 12) / 15);
  }
}

module.exports = {
  AWAKE,
  SLEEPY,
  FixedArray2D,
  GameOfLife,
};
