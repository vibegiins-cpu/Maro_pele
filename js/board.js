/* =============================================
   SNAKES & LADDERS — CHAOS EDITION
   js/board.js — Board Rendering & Management
   ============================================= */

import { getConfig } from './gameConfig.js';

/**
 * Render the complete game board inside #game-board.
 * Generates a 10x10 grid with traditional zig-zag numbering.
 * Marks snake and ladder starting cells.
 */
export function renderBoard() {
  const boardElement = document.getElementById('game-board');
  if (!boardElement) return;

  const config = getConfig();
  const rows = config.boardRows || 10;
  const cols = config.boardColumns || 10;
  const boardSize = config.boardSize || rows * cols;
  const snakes = config.snakes || [];
  const ladders = config.ladders || [];

  // Clear existing board content
  boardElement.innerHTML = '';

  // Create a document fragment to build the board efficiently
  const fragment = document.createDocumentFragment();

  // Build rows from top to bottom
  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    // Distance from bottom (0 = bottom row, rows-1 = top row)
    const bottomDistance = rows - 1 - rowIndex;

    // Starting number for this row
    const startNumber = bottomDistance * cols + 1;

    // Direction: even bottomDistance = left-to-right, odd = right-to-left
    const leftToRight = bottomDistance % 2 === 0;

    // Generate an array of positions for this row in display order (left to right)
    const positions = [];
    for (let col = 0; col < cols; col++) {
      if (leftToRight) {
        positions.push(startNumber + col);
      } else {
        positions.push(startNumber + (cols - 1 - col));
      }
    }

    // Create cells for this row
    for (const position of positions) {
      const cell = createCell(position, snakes, ladders, config);
      fragment.appendChild(cell);
    }
  }

  boardElement.appendChild(fragment);
}

/**
 * Create a single board cell element.
 * @param {number} position - Board position (1-100)
 * @param {Array} snakes - Snake start positions array
 * @param {Array} ladders - Ladder start positions array
 * @param {Object} config - Game configuration
 * @returns {HTMLElement}
 */
function createCell(position, snakes, ladders, config) {
  const cell = document.createElement('div');
  cell.className = 'board-cell';
  cell.dataset.position = position;
  cell.setAttribute('role', 'gridcell');
  cell.setAttribute('aria-label', `Square ${position}`);

  // Add number label
  const numberSpan = document.createElement('span');
  numberSpan.className = 'cell-number';
  numberSpan.textContent = position;
  cell.appendChild(numberSpan);

  // Mark snake start
  if (snakes.some(s => s.start === position)) {
    cell.classList.add('snake-cell');
    cell.dataset.snake = 'true';
  }

  // Mark ladder start
  if (ladders.some(l => l.start === position)) {
    cell.classList.add('ladder-cell');
    cell.dataset.ladder = 'true';
  }

  // Mark start cell
  if (config.startingPosition && position === config.startingPosition) {
    cell.classList.add('start-cell');
  }

  // Mark finish cell
  if (config.winningPosition && position === config.winningPosition) {
    cell.classList.add('finish-cell');
  }

  return cell;
}

/**
 * Get the DOM element for a specific board position.
 * @param {number} position - Board position (1-100)
 * @returns {HTMLElement|null}
 */
export function getBoardCell(position) {
  const boardElement = document.getElementById('game-board');
  if (!boardElement) return null;

  const cell = boardElement.querySelector(`[data-position="${position}"]`);
  return cell || null;
}

/**
 * Highlight a board cell by position.
 * Adds the 'highlighted-cell' class.
 * @param {number} position - Board position
 */
export function highlightCell(position) {
  const cell = getBoardCell(position);
  if (cell) {
    cell.classList.add('highlighted-cell');
  }
}

/**
 * Remove all board cell highlights.
 */
export function clearHighlights() {
  const boardElement = document.getElementById('game-board');
  if (!boardElement) return;

  const highlightedCells = boardElement.querySelectorAll('.highlighted-cell');
  highlightedCells.forEach(cell => {
    cell.classList.remove('highlighted-cell');
  });
}

/**
 * Reset the board by rendering it again from scratch.
 */
export function resetBoard() {
  renderBoard();
}
