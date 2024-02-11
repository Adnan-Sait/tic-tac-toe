import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './PlayerRecord.module.css';

export default function PlayerRecord({ player1, player2, activePlayer }) {
  /**
   * Clears stored data.
   */
  function clearStoredData() {
    localStorage.clear();
    window.location.reload();
  }

  return (
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
  );
}

PlayerRecord.propTypes = {
  player1: PropTypes.object.isRequired,
  player2: PropTypes.object.isRequired,
  activePlayer: PropTypes.object.isRequired,
};
