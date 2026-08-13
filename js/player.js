/* =============================================
   SNAKES & LADDERS — CHAOS EDITION
   js/player.js — Player Cards & Board Pieces
   ============================================= */

import { getPlayers, getCurrentPlayer } from './gameState.js';
import { getBoardCell } from './board.js';

/**
 * Render all player cards in #player-list and place pieces on the board.
 */
export function renderPlayers() {
  const playerListElement = document.getElementById('player-list');
  const boardElement = document.getElementById('game-board');

  if (!playerListElement || !boardElement) return;

  clearPlayerUI();

  const players = getPlayers();
  const currentPlayer = getCurrentPlayer();

  // Render player cards
  players.forEach(player => {
    const card = createPlayerCard(player, currentPlayer?.id === player.id);
    playerListElement.appendChild(card);
  });

  // Render board pieces
  const pieceCountByCell = new Map();
  players.forEach(player => {
    const cell = getBoardCell(player.position);
    if (!cell) return;

    const count = pieceCountByCell.get(player.position) || 0;
    pieceCountByCell.set(player.position, count + 1);

    const piece = createPlayerPiece(player, count);
    cell.appendChild(piece);
  });
}

/**
 * Update the player UI based on latest game state.
 * Clears and re-renders both cards and pieces.
 */
export function updatePlayers() {
  renderPlayers();
}

/**
 * Reset player UI completely.
 */
export function resetPlayers() {
  clearPlayerUI();
  renderPlayers();
}

/**
 * Clear all player cards and board pieces from the DOM.
 */
function clearPlayerUI() {
  const playerListElement = document.getElementById('player-list');
  if (playerListElement) {
    playerListElement.innerHTML = '';
  }

  const boardElement = document.getElementById('game-board');
  if (boardElement) {
    const pieces = boardElement.querySelectorAll('.player-piece');
    pieces.forEach(piece => piece.remove());
  }
}

/**
 * Create a player card element.
 * @param {Object} player - Player data
 * @param {boolean} isCurrent - Whether this player is the current player
 * @returns {HTMLElement}
 */
function createPlayerCard(player, isCurrent) {
  const card = document.createElement('div');
  card.className = 'player-card';
  card.dataset.playerId = player.id;
  card.dataset.position = player.position;

  if (isCurrent) {
    card.classList.add('active-player', 'current-player');
  }

  // Add player color class
  card.classList.add(player.color);

  // Avatar / token
  const avatar = document.createElement('div');
  avatar.className = 'player-avatar';
  avatar.textContent = player.id.replace('player-', '');
  card.appendChild(avatar);

  // Info container
  const info = document.createElement('div');
  info.className = 'player-info';

  const name = document.createElement('div');
  name.className = 'player-name';
  name.textContent = player.name;
  info.appendChild(name);

  const statusRow = document.createElement('div');
  statusRow.className = 'player-status-row';

  const positionSpan = document.createElement('span');
  positionSpan.className = 'player-position';
  positionSpan.textContent = `Position: ${player.position}`;
  statusRow.appendChild(positionSpan);

  const scoreSpan = document.createElement('span');
  scoreSpan.className = 'player-score';
  scoreSpan.textContent = `Score: ${player.score}`;
  statusRow.appendChild(scoreSpan);

  info.appendChild(statusRow);
  card.appendChild(info);

  return card;
}

/**
 * Create a player piece element to be placed on the board.
 * @param {Object} player - Player data
 * @param {number} slotIndex - Zero-based index of piece in the same cell
 * @returns {HTMLElement}
 */
function createPlayerPiece(player, slotIndex) {
  const piece = document.createElement('div');
  piece.className = 'player-piece';
  piece.dataset.playerId = player.id;
  piece.classList.add(player.color);

  // Assign slot class (CSS handles positioning via .player-slot-N)
  const slotClass = `player-slot-${slotIndex + 1}`;
  piece.classList.add(slotClass);

  // Set player color CSS variable
  piece.style.setProperty('--player-color', `var(--${player.color})`);

  // Show player number inside piece for identification
  piece.textContent = player.id.replace('player-', '');

  return piece;
}
