import { getWinsFromStorage } from './localStorageUtils';

/**
 * Checks if there is a winner.
 *
 * @param {PlayerSymbol[][]} grid Play Grid
 *
 * @returns {WinningSequence | null} winning sequence or null if there isn't a winner.
 */
export function checkWinner(grid) {
  /**
   * @type {WinningSequence}
   */
  let sequence = null;

  // row check
  for (let index = 0; index < grid.length; index++) {
    if (
      grid[index][0] !== '' &&
      grid[index][0] === grid[index][1] &&
      grid[index][1] === grid[index][2]
    ) {
      sequence = {
        type: 'row',
        sequence: [
          [index, 0],
          [index, 1],
          [index, 2],
        ],
      };
      return sequence;
    }
  }

  // column check
  for (let index = 0; index < grid.length; index++) {
    if (
      grid[0][index] !== '' &&
      grid[0][index] === grid[1][index] &&
      grid[1][index] === grid[2][index]
    ) {
      sequence = {
        type: 'column',
        sequence: [
          [0, index],
          [1, index],
          [2, index],
        ],
      };
      return sequence;
    }
  }

  // diagonal check
  // Left diagonal
  if (
    grid[0][0] !== '' &&
    grid[0][0] === grid[1][1] &&
    grid[1][1] === grid[2][2]
  ) {
    sequence = {
      type: 'diagonal-left',
      sequence: [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
    };
    return sequence;
  }

  // Right diagonal
  if (
    grid[0][2] !== '' &&
    grid[0][2] === grid[1][1] &&
    grid[1][1] === grid[2][0]
  ) {
    sequence = {
      type: 'diagonal-right',
      sequence: [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    };
    return sequence;
  }

  return sequence;
}

/**
 * Checks if there are any other moves available.
 *
 * @param {PlayerSymbol[][]} grid Play Grid
 *
 * @returns {Boolean} True if moves are available, else false.
 */
export function isMoveAvailable(grid) {
  const grid1d = [].concat(...grid);

  return grid1d.some((val) => val === '');
}

/**
 * Creates the player object.
 *
 * @param {String} name Player Name
 * @param {PlayerSymbol} symbol Player Symbol
 * @returns {Player} player object
 */
export function generatePlayer(name, symbol) {
  const playerKey = generatePlayerKey(name);
  const wins = getWinsFromStorage(playerKey);

  return {
    name,
    wins,
    symbol,
  };
}

/**
 * Returns the opposite symbol.
 *
 * @param {PlayerSymbol} symbol
 *
 * @returns {PlayerSymbol}
 */
export function getOppositeSymbol(symbol) {
  return symbol === 'x' ? 'o' : 'x';
}

/**
 * Generates a player key from the name.
 * Converts to lowercase and replaces whitespace characters.
 *
 * @param {String} playerName Player Name
 */
function generatePlayerKey(playerName = '') {
  return playerName.toLowerCase().replace(/\s/g, '');
}
