/**
 * Retrieves wins count from local storage.
 *
 * @param {String} playerKey Player Key.
 *
 * @return {String} Wins Count.
 */
export function getWinsFromStorage(playerKey) {
  const count = localStorage.getItem(playerKey);

  return count ? Number.parseInt(count) : 0;
}

/**
 * Retrieves wins count from local storage.
 *
 * @param {String} playerKey Player Key.
 * @param {Number} winsCount Wins Count.
 */
export function saveWinsInStorage(playerKey, winsCount) {
  localStorage.setItem(playerKey, winsCount.toString());
}
