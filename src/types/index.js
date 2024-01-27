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

/**
 * @typedef {Object} WinningSequence
 * @property {"row" | "column" | "diagonal-left" | "diagonal-right"} type
 * @property {Number[][]} sequence
 */

/**
 * @typedef {Object} SymbolColor
 * @property {String} x
 * @property {String} o
 */
