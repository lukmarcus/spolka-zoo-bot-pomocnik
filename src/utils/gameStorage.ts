// Game Storage utilities for save/load functionality
// v0.2.1 - Ultra-compact custom encoding system

import type { GameState } from "../types";

// Storage keys
const STORAGE_KEY = "zoo-bot-game-state";
const AUTO_SAVE_KEY = "zoo-bot-auto-save";

// Game code utilities
const GAME_CODE_PREFIX = "ZOO";
const GAME_CODE_PREFIX_LOWER = "zoo";

/**
 * Encode card number (0-12) to alphanumeric char (0-9, a-c)
 */
function encodeCard(cardIndex: number): string {
  if (cardIndex < 0 || cardIndex > 12) {
    throw new Error(`Invalid card index: ${cardIndex}. Must be 0-12.`);
  }

  // 0-9 → '0'-'9', 10-12 → 'a'-'c'
  return cardIndex <= 9
    ? cardIndex.toString()
    : String.fromCharCode(97 + cardIndex - 10);
}

/**
 * Decode alphanumeric char (0-9, a-c or A-C) to card number (0-12)
 */
function decodeCard(char: string): number {
  if (char >= "0" && char <= "9") {
    return parseInt(char);
  }
  // Handle both lowercase and uppercase
  const lowerChar = char.toLowerCase();
  if (lowerChar >= "a" && lowerChar <= "c") {
    return lowerChar.charCodeAt(0) - 97 + 10;
  }
  throw new Error(`Invalid card character: ${char}. Must be 0-9 or a-c.`);
}

/**
 * Generate ultra-compact game code from game state
 * Format for 1 bot: ZOO + 13 chars (card sequence) + 1 char (current position) = 17 chars total
 * Format for 2-4 bots: ZOO + 13 chars + 1 char + 2 chars (bot info) = 19 chars total
 * Example: ZOO72b08391c64a55 (1 bot, 17 chars)
 */
export function generateShareableCode(gameState: GameState): string {
  try {
    // Encode card sequence (13 cards)
    const encodedSequence = gameState.cardSequence.map(encodeCard).join("");

    // Encode current position in deck
    const encodedPosition = encodeCard(gameState.currentCardIndex);

    // Check if multi-bot format is needed
    const botCount = gameState.botCount || 1;
    const currentBot = gameState.currentBot || 1;

    if (botCount === 1) {
      // Single bot format: ZOO + sequence + position (17 chars)
      return GAME_CODE_PREFIX + encodedSequence + encodedPosition;
    } else {
      // Multi-bot format: ZOO + sequence + position + botCount + currentBot (19 chars)
      const encodedBotCount = botCount.toString();
      const encodedCurrentBot = currentBot.toString();
      return (
        GAME_CODE_PREFIX +
        encodedSequence +
        encodedPosition +
        encodedBotCount +
        encodedCurrentBot
      );
    }
  } catch (error) {
    console.error("Failed to generate shareable code:", error);
    throw new Error("Failed to generate game code");
  }
}

/**
 * Load game state from ultra-compact code
 * Supports v0.2.1+ format:
 * - 17 chars: ZOO + 14 data chars (1 bot)
 * - 19 chars: ZOO + 16 data chars (2-4 bots)
 */
export function loadFromShareableCode(gameCode: string): GameState | null {
  console.log("🚀 loadFromShareableCode called with:", gameCode);

  // Convert to lowercase to handle uppercase input from UI
  const normalizedCode = gameCode.toLowerCase();
  console.log("🔄 Normalized to:", normalizedCode);

  try {
    // Validate format
    if (!normalizedCode.startsWith(GAME_CODE_PREFIX_LOWER)) {
      console.warn("❌ Invalid game code: missing ZOO prefix");
      return null;
    }

    const dataSection = normalizedCode.slice(3); // Remove "ZOO" prefix
    console.log("📊 Data section:", dataSection, "length:", dataSection.length);

    // Auto-detect format based on length
    let cardSequence: number[];
    let currentCardIndex: number;
    let botCount = 1;
    let currentBot = 1;

    if (dataSection.length === 14) {
      // Single bot format (17 chars total: ZOO + 14 data)
      const sequenceSection = dataSection.slice(0, 13);
      cardSequence = sequenceSection.split("").map(decodeCard);
      currentCardIndex = decodeCard(dataSection.slice(13));
    } else if (dataSection.length === 16) {
      // Multi-bot format (19 chars total: ZOO + 16 data)
      const sequenceSection = dataSection.slice(0, 13);
      cardSequence = sequenceSection.split("").map(decodeCard);
      currentCardIndex = decodeCard(dataSection.slice(13, 14));

      // Decode bot information
      botCount = parseInt(dataSection.slice(14, 15));
      currentBot = parseInt(dataSection.slice(15, 16));

      // Validate bot numbers
      if (
        botCount < 2 ||
        botCount > 4 ||
        currentBot < 1 ||
        currentBot > botCount
      ) {
        console.warn(
          `Invalid bot configuration: ${botCount} bots, current bot ${currentBot}`
        );
        return null;
      }
    } else {
      console.warn(
        `Invalid game code: expected 14 or 16 data chars, got ${dataSection.length}`
      );
      return null;
    }

    // Calculate used cards based on current position
    const usedCards = cardSequence.slice(0, currentCardIndex);

    // Construct game state
    const gameState: GameState = {
      currentCardIndex,
      cardSequence,
      usedCards,
      botCount,
      currentBot,
    };

    return gameState;
  } catch (error) {
    console.error("Failed to load from shareable code:", error);
    return null;
  }
}

/**
 * Auto-save game state to localStorage
 */
export function autoSaveGameState(gameState: GameState): void {
  try {
    const serialized = JSON.stringify(gameState);
    localStorage.setItem(AUTO_SAVE_KEY, serialized);
    localStorage.setItem(STORAGE_KEY, serialized); // Backup
  } catch (error) {
    console.error("Failed to auto-save game state:", error);
  }
}

/**
 * Load auto-saved game state from localStorage
 */
export function loadAutoSavedGameState(): GameState | null {
  try {
    const serialized = localStorage.getItem(AUTO_SAVE_KEY);
    if (serialized) {
      return JSON.parse(serialized) as GameState;
    }

    // Fallback to old key
    const oldFormat = localStorage.getItem(STORAGE_KEY);
    if (oldFormat) {
      return JSON.parse(oldFormat) as GameState;
    }

    return null;
  } catch (error) {
    console.error("Failed to load auto-saved game state:", error);
    return null;
  }
}

/**
 * Clear all saved game data
 */
export function clearAllSavedData(): void {
  localStorage.removeItem(AUTO_SAVE_KEY);
  localStorage.removeItem(STORAGE_KEY);

  // Clear v0.2.0 game codes (no longer supported)
  const allKeys = Object.keys(localStorage).filter((key) =>
    key.startsWith("game-code-")
  );
  allKeys.forEach((key) => localStorage.removeItem(key));
}

/**
 * Validate game code format for v0.2.1
 */
export function isValidGameCode(code: string): boolean {
  console.log("🔍 isValidGameCode called with:", code);

  // Convert to lowercase to handle uppercase input from UI
  const normalizedCode = code.toLowerCase();
  console.log("🔄 Normalized to:", normalizedCode);

  if (!normalizedCode.startsWith(GAME_CODE_PREFIX_LOWER)) {
    console.log("❌ Missing ZOO prefix");
    return false;
  }

  const dataSection = normalizedCode.slice(3);
  console.log("📊 Data section:", dataSection, "length:", dataSection.length);

  // Support both single bot (14 chars) and multi-bot (16 chars) formats
  if (dataSection.length !== 14 && dataSection.length !== 16) {
    console.log("❌ Invalid length:", dataSection.length, "expected 14 or 16");
    return false;
  }

  // Validate all characters are valid (0-9, a-c)
  const validChars = /^[0-9a-c]+$/;
  const isValidPattern = validChars.test(dataSection);
  console.log("🔤 Pattern test [0-9a-c]:", isValidPattern);

  if (!isValidPattern) {
    // Debug invalid characters
    for (let i = 0; i < dataSection.length; i++) {
      const char = dataSection[i];
      const charValid = /[0-9a-c]/.test(char);
      if (!charValid) {
        console.log("❌ Invalid character at position", i, ":", char);
      }
    }
  }

  console.log("✅ Final result:", isValidPattern);
  return isValidPattern;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";
      document.body.prepend(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      return true;
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

// Legacy v0.2.0 functions removed:
// - serializeGameState()
// - deserializeGameData()
// - generateGameCode()
// - calculateChecksum()
// These are no longer needed with the new ultra-compact system
