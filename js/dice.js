/* =============================================
   SNAKES & LADDERS — CHAOS EDITION
   js/dice.js — Dice Rolling Logic
   ============================================= */

import { getConfig } from './gameConfig.js';

let lastRoll = 0;

/**
 * Roll the dice using configured number of sides.
 * Returns a random integer between 1 and diceSides (inclusive).
 * Falls back to 6 sides if configuration is invalid.
 * @returns {number}
 */
export function roll() {
  const config = getConfig();
  let sides = config?.diceSides;

  // Validate dice sides
  if (!Number.isFinite(sides) || sides < 2) {
    sides = 6;
  }

  // Ensure sides is an integer
  sides = Math.floor(sides);

  // Generate random roll between 1 and sides
  lastRoll = Math.floor(Math.random() * sides) + 1;

  return lastRoll;
}

/**
 * Get the last dice roll result.
 * @returns {number}
 */
export function getLastRoll() {
  return lastRoll;
}

/**
 * Reset the stored dice result to 0.
 */
export function resetDice() {
  lastRoll = 0;
}
