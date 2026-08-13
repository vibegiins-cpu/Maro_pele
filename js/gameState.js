/* =============================================
   SNAKES & LADDERS — CHAOS EDITION
   js/gameState.js — Central Game State Manager
   ============================================= */

import { getConfig } from './gameConfig.js';

/**
 * Runtime game state (private).
 */
let players = [];
let currentPlayerIndex = 0;
let turnNumber = 1;
let lastDiceValue = 0;
let lastEvent = null;
let winner = null;
let gameStatus = 'not_started'; // 'not_started' | 'playing' | 'finished'
let gameStarted = false;

/**
 * Create the default player objects based on the current config.
 * @param {Object} config
 * @returns {Array<Object>}
 */
function createPlayers(config) {
  const playerList = [];
  for (let i = 0; i < config.numPlayers; i++) {
    playerList.push({
      id: `player-${i + 1}`,
      name: `Player ${i + 1}`,
      position: config.startingPosition,
      color: `player-${i + 1}`,   // maps to CSS variable --player-N
      isActive: true,
      score: config.startingPosition,
      colorIndex: i + 1,
    });
  }
  return playerList;
}

/**
 * Move to the next active player in turn order.
 */
function advanceToNextPlayer() {
  if (players.length === 0) return;

  let nextIndex = (currentPlayerIndex + 1) % players.length;
  let attempts = 0;

  while (
    players[nextIndex] &&
    !players[nextIndex].isActive &&
    attempts < players.length
  ) {
    nextIndex = (nextIndex + 1) % players.length;
    attempts++;
  }

  currentPlayerIndex = nextIndex;
}

/**
 * Deep copy a plain object (JSON-safe).
 * @param {*} value
 * @returns {*}
 */
function copyObject(value) {
  if (value === null || typeof value !== 'object') return value;
  return JSON.parse(JSON.stringify(value));
}

/**
 * Initialise or reset the entire game state.
 */
export function initGame() {
  const config = getConfig();

  players = createPlayers(config);
  currentPlayerIndex = 0;
  turnNumber = 1;
  lastDiceValue = 0;
  lastEvent = null;
  winner = null;
  gameStatus = 'playing';
  gameStarted = true;
}

/**
 * Get the current player object.
 * @returns {Object|null}
 */
export function getCurrentPlayer() {
  if (!players.length) return null;
  return { ...players[currentPlayerIndex] };
}

/**
 * Get the current turn number.
 * @returns {number}
 */
export function getTurnNumber() {
  return turnNumber;
}

/**
 * Move the current player by the given dice value.
 * Handles snakes, ladders, win detection, and turn advancement.
 * @param {number} value - Dice roll value.
 * @returns {Object|null} - Event object describing the move, or null if invalid.
 */
export function moveCurrentPlayer(value) {
  if (gameStatus !== 'playing' || !gameStarted) return null;
  if (!players.length) return null;

  const player = players[currentPlayerIndex];
  if (!player || !player.isActive) return null;

  // Validate dice value
  if (!Number.isFinite(value) || value < 1) {
    return null;
  }

  const config = getConfig();
  const oldPosition = player.position;
  let newPosition = oldPosition + value;

  // Do not move beyond the winning square
  if (newPosition > config.winningPosition) {
    newPosition = oldPosition;
  }

  player.position = newPosition;
  lastDiceValue = value;

  let event = {
    type: 'move',
    playerId: player.id,
    playerName: player.name,
    diceValue: value,
    from: oldPosition,
    to: newPosition,
    snake: false,
    ladder: false,
    winner: false,
    message: `${player.name} rolled ${value} and moved from ${oldPosition} to ${newPosition}`,
  };

  // Check for snake head
  const snake = config.snakes.find(s => s.start === newPosition);
  if (snake) {
    player.position = snake.end;
    event.type = 'snake';
    event.snake = true;
    event.to = snake.end;
    event.message = `${player.name} landed on a snake! ${oldPosition} → ${snake.end}`;
  } else {
    // Check for ladder bottom
    const ladder = config.ladders.find(l => l.start === newPosition);
    if (ladder) {
      player.position = ladder.end;
      event.type = 'ladder';
      event.ladder = true;
      event.to = ladder.end;
      event.message = `${player.name} climbed a ladder! ${oldPosition} → ${ladder.end}`;
    }
  }

  player.score = player.position;
  lastEvent = event;

  // Check for winner
  if (player.position === config.winningPosition) {
    winner = { ...player };
    gameStatus = 'finished';
    event.type = 'win';
    event.winner = true;
    event.message = `${player.name} wins the game!`;
    return event;
  }

  // Advance to next player and increment turn
  advanceToNextPlayer();
  turnNumber += 1;

  return event;
}

/**
 * Get a deep copy of the latest event.
 * @returns {Object|null}
 */
export function getLastEvent() {
  return lastEvent ? copyObject(lastEvent) : null;
}

/**
 * Reset the game state completely.
 */
export function resetGame() {
  initGame();
}

/**
 * Get a copy of all players.
 * @returns {Array<Object>}
 */
export function getPlayers() {
  return players.map(p => ({ ...p }));
}

/**
 * Get a specific player by ID.
 * @param {string} id
 * @returns {Object|null}
 */
export function getPlayer(id) {
  const player = players.find(p => p.id === id);
  return player ? { ...player } : null;
}

/**
 * Get the current winner, if any.
 * @returns {Object|null}
 */
export function getWinner() {
  return winner ? { ...winner } : null;
}

/**
 * Get the current game status.
 * @returns {string}
 */
export function getGameStatus() {
  return gameStatus;
}

/**
 * Get the last dice value.
 * @returns {number}
 */
export function getLastDiceValue() {
  return lastDiceValue;
}

/**
 * Check if the game has finished.
 * @returns {boolean}
 */
export function isGameOver() {
  return gameStatus === 'finished';
}
