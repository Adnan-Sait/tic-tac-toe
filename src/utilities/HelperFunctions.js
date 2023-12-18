/**
 * Checks if there is a winner.
 *
 * @param {PlayerSymbol[][]} grid Play Grid
 *
 * @returns {Number[][] | null} winning sequence or null if there isn't a winner.
 */
export function checkWinner(grid) {
  // row check
  for (let index = 0; index < grid.length; index++) {
    if (
      grid[index][0] !== "" &&
      grid[index][0] === grid[index][1] &&
      grid[index][1] === grid[index][2]
    ) {
      return [
        [index, 0],
        [index, 1],
        [index, 2],
      ];
    }
  }

  // column check
  for (let index = 0; index < grid.length; index++) {
    if (
      grid[0][index] !== "" &&
      grid[0][index] === grid[1][index] &&
      grid[1][index] === grid[2][index]
    ) {
      return [
        [0, index],
        [1, index],
        [2, index],
      ];
    }
  }

  // diagonal check
  // Left diagonal
  if (
    grid[0][0] !== "" &&
    grid[0][0] === grid[1][1] &&
    grid[1][1] === grid[2][2]
  ) {
    return [
      [0, 0],
      [1, 1],
      [2, 2],
    ];
  }

  // Right diagonal
  if (
    grid[0][2] !== "" &&
    grid[0][2] === grid[1][1] &&
    grid[1][1] === grid[2][0]
  ) {
    return [
      [0, 2],
      [1, 1],
      [2, 0],
    ];
  }

  return null;
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

  return grid1d.some((val) => val === "");
}
