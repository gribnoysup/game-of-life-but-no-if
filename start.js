const chalk = require('chalk');
const logUpdate = require('log-update');

const { GameOfLife } = require('./index');

const width = Math.max(18, parseInt(process.argv[2] || 0, 10));
const height = Math.max(18, parseInt(process.argv[3] || width, 10));

const padSize = width * 2;

const game = new GameOfLife(width, height);
const title = chalk.bgWhite.black.underline('Game of Life'.padEnd(padSize));

console.clear();

setInterval(() => {
  logUpdate(`
${title}
${game.printBoard()}
  `);

  game.tick();
}, 120);
