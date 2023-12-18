import React, { useState, useReducer, useEffect } from "react";
import PlayGrid from "../../components/playGrid/PlayGrid";
import styles from "./PlayArea.module.css";
import classNames from "classnames";
import { isMoveAvailable, checkWinner } from "../../utilities/HelperFunctions";

/**
 * @type {PlayerSymbol[][]}
 */
const gridInitialState = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

/**
 * Reducer for the grid state.
 *
 * @param {PlayerSymbol[][]} state Current State
 * @param {ReducerAction<GridReducerPayload>} action
 */
function gridReducer(state, action) {
  const { type, payload } = action;
  let tempState;
  switch (type) {
    case "select-cell": {
      if (payload.cellIndex?.length === 2 && payload.player) {
        tempState = structuredClone(state);
        tempState[payload.cellIndex[0]][payload.cellIndex[1]] =
          payload.player.symbol;
      }
      break;
    }
    case "clear-all-cells": {
      tempState = gridInitialState;
      break;
    }
  }

  return tempState ?? state;
}

function PlayArea() {
  /**
   * @type {[Player, React.Dispatch<Player>]}
   */
  const [player1, setPlayer1] = useState({
    name: "Player 1",
    wins: 0,
    isTurn: false,
  });
  /**
   * @type {[Player, React.Dispatch<Player>]}
   */
  const [player2, setPlayer2] = useState({
    name: "Player 2",
    wins: 0,
    isTurn: false,
  });

  /**
   * @type {[String, React.Dispatch<String>]} Specifies which player is playing X.
   */
  const [xSymbolPlayer, setXSymbolPlayer] = useState("player1");

  /**
   * @type {[PlayerSymbol[][], React.Dispatch<ReducerAction<GridReducerPayload>>]}
   */
  const [gridState, dispatchGrid] = useReducer(gridReducer, gridInitialState);

  /**
   * @type {[Boolean, React.Dispatch<Boolean>]}
   */
  const [gameEnd, setGameEnd] = useState(false);

  /**
   * @type {[Number[][], React.Dispatch<Number[][]>]}
   */
  const [winningSequence, setWinningSequence] = useState([]);

  const activePlayer = player1.isTurn ? player1 : player2;

  const gameStatus = checkGameStatus();

  useEffect(() => {
    const winSequence = checkWinner(gridState);
    if (winSequence) {
      setWinningSequence(winSequence);
      setGameEnd(true);
    } else if (!isMoveAvailable(gridState)) {
      setGameEnd(true);
    } else {
      togglePlayerTurn();
    }
  }, [gridState]);

  useEffect(() => {
    switch (xSymbolPlayer) {
      case "player1": {
        setPlayer1((state) => {
          return { ...state, symbol: "x", isTurn: true };
        });
        setPlayer2((state) => {
          return { ...state, symbol: "o" };
        });
        break;
      }
      case "player2": {
        setPlayer1((state) => {
          return { ...state, symbol: "o" };
        });
        setPlayer2((state) => {
          return { ...state, symbol: "x", isTurn: true };
        });
        break;
      }
      default: {
      }
    }
  }, [xSymbolPlayer]);

  useEffect(() => {
    if (gameEnd && winningSequence.length > 0) {
      if (activePlayer === player1) {
        setPlayer1((state) => {
          return { ...state, wins: state.wins + 1 };
        });
      } else if (activePlayer === player2) {
        setPlayer2((state) => {
          return { ...state, wins: state.wins + 1 };
        });
      }
    }
  }, [gameEnd, winningSequence]);

  /**
   * Toggles the players turn.
   */
  function togglePlayerTurn() {
    setPlayer1((state) => {
      return { ...state, isTurn: !state.isTurn };
    });
    setPlayer2((state) => {
      return { ...state, isTurn: !state.isTurn };
    });
  }

  /**
   * Handles the cell selection.
   *
   * @param {Number[]} index  cell index.
   */
  function selectCell(index) {
    /**
     * @type {ReducerAction<GridReducerPayload>}
     */
    const action = {
      type: "select-cell",
      payload: {
        player: activePlayer,
        cellIndex: index,
      },
    };
    dispatchGrid(action);
  }

  /**
   * Handles the restart game button click.
   */
  function handleRestartGameClick() {
    setGameEnd(false);
    dispatchGrid({ type: "clear-all-cells" });
    setWinningSequence([]);

    if (xSymbolPlayer === "player1") {
      setXSymbolPlayer("player2");
    } else {
      setXSymbolPlayer("player1");
    }
  }

  /**
   * Checks game status.
   */
  function checkGameStatus() {
    if (gameEnd && winningSequence.length > 0) {
      return "win";
    } else if (gameEnd) {
      return "draw";
    } else {
      return "inprogress";
    }
  }

  /**
   * Renders the Game complete JSX.
   */
  function gameCompleteJsx() {
    return (
      <div className={styles.winOverlay}>
        <div className={styles.overlayContent}>
          {gameStatus === "win" && <p>Congratulations: {activePlayer.name}</p>}
          {gameStatus === "draw" && <p>Draw!!</p>}

          <button
            className={styles.restartBtn}
            tabIndex={0}
            onClick={handleRestartGameClick}
          >
            <span>Play again</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.playAreaSection}>
      <section className={styles.playerInfo}>
        <div
          className={classNames(styles.player, {
            [styles.activePlayer]: activePlayer.name === player1.name,
          })}
        >
          <p>{player1.name}</p>
          <p>Wins: {player1.wins}</p>
        </div>
        <div
          className={classNames(styles.player, {
            [styles.activePlayer]: activePlayer.name === player2.name,
          })}
        >
          <p>{player2.name}</p>
          <p>Wins: {player2.wins}</p>
        </div>
      </section>
      <PlayGrid gridState={gridState} selectCell={selectCell} />

      {gameEnd && gameCompleteJsx()}
    </div>
  );
}

export default PlayArea;
