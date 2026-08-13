/* =============================================
   SNAKES & LADDERS — CHAOS EDITION
   js/main.js — Application Entry Point
   ============================================= */

import * as gameConfig from './gameConfig.js';
import * as gameState from './gameState.js';
import * as board from './board.js';
import * as player from './player.js';
import * as dice from './dice.js';
import * as ui from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  initGame();
});

/**
 * Initialise the game by loading configuration,
 * setting up state, rendering the board and players,
 * and attaching event listeners.
 */
function initGame() {
  gameConfig.loadConfig();
  gameState.initGame();
  board.renderBoard();
  player.renderPlayers();
  setupEventListeners();
  ui.updateTurnInfo(gameState.getCurrentPlayer(), gameState.getTurnNumber());
}

/**
 * Attach all global event listeners.
 */
function setupEventListeners() {
  document.getElementById('roll-dice').addEventListener('click', onRollDice);
  document.getElementById('restart-game').addEventListener('click', onRestartGame);
  document.getElementById('open-settings').addEventListener('click', onOpenSettings);
  document.getElementById('play-again').addEventListener('click', onPlayAgain);

  // Close modal when clicking the close button
  document.querySelectorAll('.modal-close').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) ui.closeModal(modal);
    });
  });

  // Close modal when clicking the backdrop
  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', () => {
      const modal = backdrop.closest('.modal');
      if (modal) ui.closeModal(modal);
    });
  });
}

/**
 * Handle dice roll button click.
 */
function onRollDice() {
  const value = dice.roll();
  ui.updateDice(value);

  gameState.moveCurrentPlayer(value);

  ui.updateBoard();
  ui.updatePlayers();
  ui.updateGameLog(gameState.getLastEvent());
  ui.updateTurnInfo(gameState.getCurrentPlayer(), gameState.getTurnNumber());
}

/**
 * Handle restart game button click.
 */
function onRestartGame() {
  gameState.resetGame();
  board.resetBoard();
  player.resetPlayers();
  ui.resetUI();
  ui.updateTurnInfo(gameState.getCurrentPlayer(), gameState.getTurnNumber());
}

/**
 * Handle open settings button click.
 */
function onOpenSettings() {
  ui.showModal('settings-modal');
}

/**
 * Handle play again button click.
 */
function onPlayAgain() {
  onRestartGame();
}
