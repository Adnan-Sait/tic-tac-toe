import React, { useState, useReducer, useEffect, useRef } from 'react';
import classNames from 'classnames';

import PlayGrid from '../../components/playGrid/PlayGrid';
import {
  isMoveAvailable,
  checkWinner,
  generatePlayer,
} from '../../utilities/helperFunctions';
import { saveWinsInStorage } from '../../utilities/localStorageUtils';

import styles from './GamePage.module.css';

import tadaMp3 from '../../assets/tadaa.mp3';

/**
 * @type {PlayerSymbol[][]}
 */
const gridInitialState = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
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
    case 'select-cell': {
      if (payload.cellIndex?.length === 2 && payload.player) {
        tempState = structuredClone(state);
        tempState[payload.cellIndex[0]][payload.cellIndex[1]] =
          payload.player.symbol;
      }
      break;
    }
    case 'clear-all-cells': {
      tempState = gridInitialState;
      break;
    }
  }

  return tempState ?? state;
}

/**
 * Game Page Component.
 */
function GamePage() {
  /**
   * @type {import('react').RefObject<HTMLAudioElement>}
   */
  const audioRef = useRef();

  /**
   * @type {[Player, React.Dispatch<Player>]}
   */
  const [player1, setPlayer1] = useState(generatePlayer('Player 1', 'x', true));
  /**
   * @type {[Player, React.Dispatch<Player>]}
   */
  const [player2, setPlayer2] = useState(
    generatePlayer('Player 2', 'o', false),
  );

  /**
   * @type {[PlayerSymbol[][], React.Dispatch<ReducerAction<GridReducerPayload>>]}
   */
  const [gridState, dispatchGrid] = useReducer(gridReducer, gridInitialState);

  /**
   * @type {[WinningSequence, React.Dispatch<WinningSequence>]}
   */
  const [winningSequence, setWinningSequence] = useState({});

  const activePlayer = player1.isTurn ? player1 : player2;

  /**
   * @type {HTMLAudioElement}
   */
  const audioEl = audioRef.current || {};

  /**
   * @type {SymbolColor} Specifies the color for each symbol.
   */
  const symbolColor = {
    [player1.symbol]: 'player1',
    [player2.symbol]: 'player2',
  };

  const gameStatus = checkGameStatus();

  /**
   * Executed when the gridState changes.
   * Checks if a player has won or if all moves are exhausted.
   * If not, toggles the player's turn.
   *
   * The code logic does not run on mount.
   */
  useEffect(() => {
    if (gridState == gridInitialState) return;

    const winSequence = checkWinner(gridState);
    if (winSequence) {
      setWinningSequence(winSequence);
    } else if (!isMoveAvailable(gridState)) {
      setWinningSequence({ type: '' });
    } else {
      togglePlayerTurn();
    }
  }, [gridState]);

  useEffect(() => {
    if (winningSequence?.type) {
      if (activePlayer === player1) {
        setPlayer1((state) => {
          saveWinsInStorage('player1', state.wins + 1);
          return { ...state, wins: state.wins + 1 };
        });
      } else if (activePlayer === player2) {
        setPlayer2((state) => {
          saveWinsInStorage('player2', state.wins + 1);
          return { ...state, wins: state.wins + 1 };
        });
      }
    }
  }, [winningSequence]);

  // Plays the audio, when a player wins the game.
  useEffect(() => {
    if (gameStatus === 'win') {
      audioEl.play();
    }
  }, [gameStatus]);

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
      type: 'select-cell',
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
    dispatchGrid({ type: 'clear-all-cells' });
    setWinningSequence({});

    setPlayer1((state) => {
      const playSymbol = getOppositeSymbol(state.symbol);
      return {
        ...state,
        symbol: playSymbol,
        isTurn: playSymbol === 'x',
      };
    });
    setPlayer2((state) => {
      const playSymbol = getOppositeSymbol(state.symbol);
      return {
        ...state,
        symbol: playSymbol,
        isTurn: playSymbol === 'x',
      };
    });
  }

  /**
   * Returns the opposite symbol.
   *
   * @param {PlayerSymbol} symbol
   *
   * @returns {PlayerSymbol}
   */
  function getOppositeSymbol(symbol) {
    return symbol === 'x' ? 'o' : 'x';
  }

  /**
   * Clears stored data.
   */
  function clearStoredData() {
    localStorage.clear();
    window.location.reload();
  }

  /**
   * Checks game status.
   */
  function checkGameStatus() {
    if (winningSequence?.type) {
      return 'win';
    } else if (winningSequence?.type === '') {
      return 'draw';
    } else {
      return 'inprogress';
    }
  }

  /**
   * Renders the Game complete JSX.
   */
  function gameCompleteJsx() {
    return (
      <div className={styles.winOverlay}>
        <div className={styles.overlayContent}>
          {gameStatus === 'win' && <p>Congratulations: {activePlayer.name}</p>}
          {gameStatus === 'draw' && <p>Draw!!</p>}

          <button
            className={classNames(styles.restartBtn, 'btnOutline')}
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
      <div className={styles.gameOverview}>
        <section className={styles.playerInfo}>
          <div
            className={classNames(styles.player, styles.player1, {
              [styles.activePlayer]: activePlayer.name === player1.name,
            })}
          >
            <div>
              <span>{player1.name}</span>
              <span className={styles.symbol}>({player1.symbol})</span>
            </div>
            <p>Wins: {player1.wins}</p>
          </div>
          <div
            className={classNames(styles.player, styles.player2, {
              [styles.activePlayer]: activePlayer.name === player2.name,
            })}
          >
            <div>
              <span>{player2.name}</span>
              <span className={styles.symbol}>({player2.symbol})</span>
            </div>
            <p>Wins: {player2.wins}</p>
          </div>
        </section>
        <section className={styles.clearSavedDataSection}>
          <button className="btnOutline" onClick={clearStoredData} tabIndex={0}>
            <span>Clear Saved Data</span>
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
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </section>
      </div>
      <PlayGrid
        gridState={gridState}
        selectCell={selectCell}
        winningSequence={winningSequence}
        symbolColor={symbolColor}
      />

      <audio ref={audioRef} src={tadaMp3} />

      {winningSequence?.type !== undefined && gameCompleteJsx()}
    </div>
  );
}

export default GamePage;
