/* =============================================
   SNAKES & LADDERS — CHAOS EDITION
   js/gameConfig.js — Central Game Configuration
   ============================================= */

/**
 * Private default configuration object.
 * Contains all tunable game settings.
 */
const DEFAULT_CONFIG = Object.freeze({
  boardSize: 100,                 // total number of cells (10x10)
  boardRows: 10,
  boardColumns: 10,
  minPlayers: 2,
  maxPlayers: 4,
  numPlayers: 2,                  // default player count
  diceSides: 6,
  startingPosition: 1,
  winningPosition: 100,
  turnDuration: 0,                // 0 = no turn timer
  animationDuration: 500,         // ms for piece movement / UI animations
  powersEnabled: true,
  eventsEnabled: true,
  challengesEnabled: true,
  soundEnabled: true,
  musicEnabled: true,
  difficulty: 'normal',           // 'easy' | 'normal' | 'hard'
  gameMode: 'chaos',              // 'classic' | 'chaos' | 'fast'
  snakes: [
    { start: 16, end: 6 },
    { start: 47, end: 26 },
    { start: 49, end: 11 },
    { start: 56, end: 53 },
    { start: 62, end: 19 },
    { start: 64, end: 60 },
    { start: 87, end: 24 },
    { start: 93, end: 73 },
    { start: 95, end: 75 },
    { start: 98, end: 78 }
  ],
  ladders: [
    { start: 1, end: 38 },
    { start: 4, end: 14 },
    { start: 9, end: 31 },
    { start: 21, end: 42 },
    { start: 28, end: 84 },
    { start: 36, end: 44 },
    { start: 51, end: 67 },
    { start: 71, end: 91 },
    { start: 80, end: 100 }
  ]
});

/**
 * Private mutable copy of the configuration.
 * This is what the game actually uses at runtime.
 */
let config = deepCopy(DEFAULT_CONFIG);

/**
 * Deep copy helper (JSON‑safe for config objects).
 * @param {*} value
 * @returns {*}
 */
function deepCopy(value) {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Load the configuration.
 * Currently resets to defaults; may be extended to read from localStorage
 * or a remote source later.
 */
export function loadConfig() {
  config = deepCopy(DEFAULT_CONFIG);
}

/**
 * Get a deep copy of the current configuration.
 * Prevents accidental external mutation of the internal state.
 * @returns {Object}
 */
export function getConfig() {
  return deepCopy(config);
}

/**
 * Reset the configuration to the original defaults.
 */
export function resetConfig() {
  config = deepCopy(DEFAULT_CONFIG);
}

/**
 * Merge a partial updates object into the current configuration.
 * @param {Object} updates - Key-value pairs to update.
 */
export function updateConfig(updates) {
  if (updates && typeof updates === 'object') {
    config = {
      ...config,
      ...updates
    };
  }
}

/**
 * Convenience getter for a single configuration key.
 * @param {string} key
 * @returns {*}
 */
export function getConfigValue(key) {
  return config[key];
}

/**
 * Convenience setter for a single configuration key.
 * @param {string} key
 * @param {*} value
 */
export function setConfigValue(key, value) {
  config[key] = value;
}
