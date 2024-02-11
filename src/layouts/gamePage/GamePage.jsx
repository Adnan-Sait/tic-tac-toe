import React, { useState, useReducer, useEffect, useRef } from 'react';
import classNames from 'classnames';

import PlayGrid from '../../components/playGrid/PlayGrid';
import {
  isMoveAvailable,
  checkWinner,
  generatePlayer,
  getOppositeSymbol,
} from '../../utilities/helperFunctions';
import { saveWinsInStorage } from '../../utilities/localStorageUtils';

import styles from './GamePage.module.css';

import tadaMp3 from '../../assets/tadaa.mp3';
import PlayerRecord from '../../components/playerRecord/PlayerRecord';

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

  const [activeSymbol, setActiveSymbol] = useState('x');

  /**
   * @type {[Player, React.Dispatch<Player>]}
   */
  const [player1, setPlayer1] = useState(
    generatePlayer('Player 1', activeSymbol),
  );
  /**
   * @type {[Player, React.Dispatch<Player>]}
   */
  const [player2, setPlayer2] = useState(
    generatePlayer('Player 2', getOppositeSymbol(activeSymbol)),
  );

  /**
   * @type {[PlayerSymbol[][], React.Dispatch<ReducerAction<GridReducerPayload>>]}
   */
  const [gridState, dispatchGrid] = useReducer(gridReducer, gridInitialState);

  /**
   * @type {[WinningSequence, React.Dispatch<WinningSequence>]}
   */
  const [winningSequence, setWinningSequence] = useState({});

  const activePlayer = getActivePlayer();

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
   * Returns the active player.
   *
   * @returns {Player} Active Player
   */
  function getActivePlayer() {
    if (player1.symbol === activeSymbol) {
      return player1;
    }

    return player2;
  }

  /**
   * Toggles the players turn.
   */
  function togglePlayerTurn() {
    setActiveSymbol((state) => getOppositeSymbol(state));
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
    setActiveSymbol('x');

    setPlayer1((state) => {
      const playSymbol = getOppositeSymbol(state.symbol);
      return {
        ...state,
        symbol: playSymbol,
      };
    });
    setPlayer2((state) => {
      const playSymbol = getOppositeSymbol(state.symbol);
      return {
        ...state,
        symbol: playSymbol,
      };
    });
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
      <PlayerRecord
        player1={player1}
        player2={player2}
        activePlayer={activePlayer}
      />
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
