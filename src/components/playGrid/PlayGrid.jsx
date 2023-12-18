import styles from "./PlayGrid.module.css";

/**
 * Play Grid
 *
 * @param {Object} param0 Props
 * @param {PlayerSymbol[][]} param0.gridState
 */
function PlayGrid({ gridState, selectCell }) {
  /**
   * @type {PlayerSymbol[]}
   */
  const gridState1D = [].concat(...gridState);

  /**
   * Handles the selection of the grid cell.
   *
   * @param {Event} event Event
   * @param {Number} index Index of the selected cell.
   */
  function cellSelectHandler(event, index) {
    if (gridState1D[index] !== "") return;

    const row = Math.floor(index / 3);
    const column = index % 3;

    selectCell([row, column]);
  }

  return (
    <section className={styles.playGrid}>
      {gridState1D.map((val, index) => {
        return (
          <div
            key={index}
            className={styles.gridItem}
            onClick={(event) => cellSelectHandler(event, index)}
          >
            {val && <span className={styles.symbol} data-symbol={val} />}
          </div>
        );
      })}
    </section>
  );
}

export default PlayGrid;
