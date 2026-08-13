/* =============================================
   SNAKES & LADDERS — CHAOS EDITION
   js/ui.js — UI Update & Modal Management
   ============================================= */

import { clearHighlights } from './board.js';
import { updatePlayers as refreshPlayers } from './player.js';

let openModalCount = 0;

/**
 * Safely find an element by ID or return the element itself.
 * @param {string|HTMLElement} elementOrId
 * @returns {HTMLElement|null}
 */
function resolveElement(elementOrId) {
  if (typeof elementOrId === 'string') {
    return document.getElementById(elementOrId);
  }
  return elementOrId || null;
}

/**
 * Update the current player and turn information in the UI.
 * @param {Object} currentPlayer - Player object
 * @param {number} turnNumber - Current turn number
 */
export function updateTurnInfo(currentPlayer, turnNumber) {
  const playerNameEl = document.getElementById('current-player-name');
  const turnNumberEl = document.getElementById('turn-number');
  const statusEl = document.getElementById('game-status');

  if (playerNameEl && currentPlayer) {
    playerNameEl.textContent = currentPlayer.name;
  }

  if (turnNumberEl) {
    turnNumberEl.textContent = turnNumber;
  }

  if (statusEl && currentPlayer) {
    statusEl.textContent = `${currentPlayer.name}'s turn`;
  }
}

/**
 * Update the visible dice display with the rolled value.
 * @param {number} value - Dice roll result
 */
export function updateDice(value) {
  const diceEl = document.getElementById('dice');
  if (!diceEl) return;

  // Remove old animation classes
  diceEl.classList.remove('rolling', 'shaking', 'result');

  // Set display value
  diceEl.textContent = value;

  // Add result animation
  diceEl.classList.add('result');
}

/**
 * Refresh the game board visuals (cells, pieces, highlights).
 */
export function updateBoard() {
  // Clear any previous highlights
  clearHighlights();

  // Re-render player pieces
  refreshPlayers();
}

/**
 * Refresh player cards and board pieces.
 */
export function updatePlayers() {
  refreshPlayers();
}

/**
 * Add a new entry to the game log.
 * @param {Object|null} event - Event object describing the last action
 */
export function updateGameLog(event) {
  const logContainer = document.getElementById('game-log');
  if (!logContainer || !event) return;

  const entry = document.createElement('div');
  entry.className = `log-entry log-${event.type || 'info'}`;
  entry.textContent = event.message || 'Unknown event';

  // Prepend to show newest first
  logContainer.prepend(entry);

  // Limit log entries to avoid unbounded growth
  const maxEntries = 50;
  while (logContainer.children.length > maxEntries) {
    logContainer.removeChild(logContainer.lastChild);
  }
}

/**
 * Reset the visible UI to a clean state.
 * Does not reset game state.
 */
export function resetUI() {
  // Reset dice
  const diceEl = document.getElementById('dice');
  if (diceEl) {
    diceEl.textContent = '🎲';
    diceEl.classList.remove('rolling', 'shaking', 'result');
  }

  // Clear game log
  const logContainer = document.getElementById('game-log');
  if (logContainer) {
    logContainer.innerHTML = '';
  }

  // Clear board highlights
  clearHighlights();

  // Close any open modals
  const openModals = document.querySelectorAll('.modal:not(.hidden)');
  openModals.forEach(modal => {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  });

  // Reset body overflow
  document.body.style.overflow = '';
  openModalCount = 0;

  // Reset status text
  const statusEl = document.getElementById('game-status');
  if (statusEl) {
    statusEl.textContent = "Player 1's turn";
  }
}

/**
 * Show a modal by ID or element.
 * @param {string|HTMLElement} modalId
 */
export function showModal(modalId) {
  const modal = resolveElement(modalId);
  if (!modal) return;

  // Remove hidden class and update ARIA
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');

  // Increment open modal count
  openModalCount++;

  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';

  // Focus management: focus the close button if available, else modal itself
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) {
    closeBtn.focus();
  } else {
    modal.setAttribute('tabindex', '-1');
    modal.focus();
  }
}

/**
 * Close a modal by ID or element.
 * @param {string|HTMLElement} modal
 */
export function closeModal(modal) {
  const modalEl = resolveElement(modal);
  if (!modalEl) return;

  // Add hidden class and update ARIA
  modalEl.classList.add('hidden');
  modalEl.setAttribute('aria-hidden', 'true');

  // Decrement open modal count
  if (openModalCount > 0) {
    openModalCount--;
  }

  // Restore body overflow when no modals are open
  if (openModalCount === 0) {
    document.body.style.overflow = '';
  }
}
