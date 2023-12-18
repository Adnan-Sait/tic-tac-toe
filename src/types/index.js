/**
 * @typedef {"x" | "o"}    PlayerSymbol
 */

/**
 * @typedef {Object} Player
 * @property {String} name
 * @property {Number} wins
 * @property {PlayerSymbol} symbol
 * @property {Boolean} isTurn
 */

/**
 * @template T
 * @typedef {Object} ReducerAction
 * @property {String} type
 * @property {T} payload
 */

/**
 * @typedef {Object} GridReducerPayload
 * @property {Player} player Player who made the selection.
 * @property {Number[]} cellIndex Indices of the selected cell.
 */
