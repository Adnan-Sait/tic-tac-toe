import { useRef, useEffect } from 'react';
import styles from './PlayGrid.module.css';

/**
 * Play Grid
 *
 * @param {Object} param0 Props
 * @param {PlayerSymbol[][]} param0.gridState
 * @param {Function} param0.selectCell
 * @param {WinningSequence} param0.winningSequence
 * @param {SymbolColor} param0.symbolColor
 */
function PlayGrid({ gridState, selectCell, winningSequence, symbolColor }) {
  const gridRef = useRef();
  const canvasRef = useRef();

  /**
   * @type {PlayerSymbol[]}
   */
  const gridState1D = [].concat(...gridState);

  /**
   * Setting the canvas height and width proportional to the grid.
   * This is required to be able to draw the line anywhere on the grid.
   *
   * Padding added to accommodate lineEnd styling.
   */
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.height = gridRef.current?.offsetHeight
        ? gridRef.current.offsetHeight + 20
        : 0;
      canvasRef.current.width = gridRef.current?.offsetWidth
        ? gridRef.current.offsetWidth + 20
        : 0;
    }
  }, [gridRef.current?.offsetWidth, gridRef.current?.offsetHeight]);

  /**
   * When the winning sequence is defined a line is drawn over the sequence.
   * Else the line is removed.
   */
  useEffect(() => {
    if (!canvasRef.current || !winningSequence) return;

    if (winningSequence.sequence?.length) {
      const indicies1D = winningSequence.sequence.map((item) => {
        const index = item[0] * 3 + item[1];

        return index;
      });

      // Picking the first index and last index of the winning sequence.
      drawLineOnGrid(indicies1D[0], indicies1D.at(-1), winningSequence.type);
    } else {
      canvasRef.current.classList.remove(styles.show);

      const context = canvasRef.current.getContext('2d');
      context.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
    }
  }, [winningSequence, canvasRef.current]);

  /**
   * Maps the player color to the particular symbol.
   *
   * Example:
   * X --> Player 1
   * O --> Player 2
   */
  useEffect(() => {
    if (symbolColor && symbolColor.x && symbolColor.o) {
      const xColor = `var(--app-color-${symbolColor.x})`;
      const oColor = `var(--app-color-${symbolColor.o})`;

      document.documentElement.style.setProperty(
        '--board-symbol-color-x',
        xColor,
      );
      document.documentElement.style.setProperty(
        '--board-symbol-color-o',
        oColor,
      );
    }
  }, [symbolColor]);

  /**
   * Retrieves the grid items from the DOM.
   *
   * @returns {HTMLElement[]} Grid Item elements
   */
  function getGridItems() {
    return document.querySelectorAll("[data-selector='grid-item']");
  }

  /**
   * Converts the viewport coordinates to grid coordinates.
   *
   * @param {Number[]} lineTopLeftCoordinates Array with 2 values, left coordinate, and top coordinate.
   * @param {Number[]} canvasTopLeftCoordinates Array with 2 values, left coordinate, and top coordinate.
   *
   * @returns {Number[]} Converted coordinates left and top.
   */
  function convertCoordinatesViewportToGrid(
    lineTopLeftCoordinates,
    canvasTopLeftCoordinates,
  ) {
    const left = lineTopLeftCoordinates[0] - canvasTopLeftCoordinates[0];
    const top = lineTopLeftCoordinates[1] - canvasTopLeftCoordinates[1];
    return [left, top];
  }

  /**
   * Draws a line over the winning sequence.
   *
   * @param {Number} startIndex Index of the grid item where line should start.
   * @param {Number} endIndex   Index of the grid item where line should end.
   * @param {"row" | "column" | "diagonal-left" | "diagonal-right"} strokeDirection The stroke direction
   */
  function drawLineOnGrid(startIndex, endIndex, strokeDirection) {
    if (!canvasRef.current) return;

    const gridItemsElArr = getGridItems();

    if (gridItemsElArr.length === 0) return;

    const startGridItemEl = gridItemsElArr[startIndex];
    const endGridItemEl = gridItemsElArr[endIndex];

    if (!startGridItemEl || !endGridItemEl) return;

    const ctx = canvasRef.current.getContext('2d');

    ctx.strokeStyle = 'green';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';

    const { left: canvasLeft, top: canvasTop } =
      canvasRef.current.getBoundingClientRect();

    let startDimensions = startGridItemEl.getBoundingClientRect();
    let endDimensions = endGridItemEl.getBoundingClientRect();

    let startX = 0,
      startY = 0,
      endX = 0,
      endY = 0;

    /**
     * Setting coordinates based on the direction and orientation of the winning sequence.
     */
    switch (strokeDirection) {
      case 'row': {
        startX = startDimensions.left;
        startY = startDimensions.top + startDimensions.height / 2;
        endX = endDimensions.right;
        endY = endDimensions.top + endDimensions.height / 2;
        break;
      }
      case 'column': {
        startX = startDimensions.left + startDimensions.width / 2;
        startY = startDimensions.top;
        endX = endDimensions.left + endDimensions.width / 2;
        endY = endDimensions.bottom;
        break;
      }
      case 'diagonal-left': {
        startX = startDimensions.left;
        startY = startDimensions.top;
        endX = endDimensions.right;
        endY = endDimensions.bottom;
        break;
      }
      case 'diagonal-right': {
        startX = startDimensions.right;
        startY = startDimensions.top;
        endX = endDimensions.left;
        endY = endDimensions.bottom;
        break;
      }
    }

    // Converting viewport coordinates to grid coordinates
    [startX, startY] = convertCoordinatesViewportToGrid(
      [startX, startY],
      [canvasLeft, canvasTop],
    );
    [endX, endY] = convertCoordinatesViewportToGrid(
      [endX, endY],
      [canvasLeft, canvasTop],
    );

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    canvasRef.current.classList.add(styles.show);
  }

  /**
   * Handles the selection of the grid cell.
   *
   * @param {Event} event Event
   * @param {Number} index Index of the selected cell.
   */
  function cellSelectHandler(event, index) {
    // if the cell is already selected, do nothing.
    if (gridState1D[index] !== '') return;

    const row = Math.floor(index / 3);
    const column = index % 3;

    selectCell([row, column]);
  }

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <section ref={gridRef} className={styles.playGrid}>
        {gridState1D.map((val, index) => {
          return (
            <div
              key={index}
              className={styles.gridItem}
              data-selector="grid-item"
              onClick={(event) => cellSelectHandler(event, index)}
            >
              {val && <span className={styles.symbol} data-symbol={val} />}
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default PlayGrid;
