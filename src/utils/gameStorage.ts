// Game Storage utilities for save/load functionality
// v0.2.0 - Save and load game state

import type { GameState } from "../types";

// Storage keys
const STORAGE_KEY = "zoo-bot-game-state";
const AUTO_SAVE_KEY = "zoo-bot-auto-save";

// Game code utilities
const GAME_CODE_PREFIX = "ZOO";
const GAME_CODE_LENGTH = 6;

/**
 * Interface for serialized game data
 */
export interface SerializedGameData {
  version: string;
  timestamp: number;
  gameState: GameState;
  checksum: string;
}

/**
 * Generate a random game code
 */
function generateGameCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = GAME_CODE_PREFIX;

  for (let i = 0; i < GAME_CODE_LENGTH; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * Calculate simple checksum for data validation
 */
function calculateChecksum(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

/**
 * Serialize game state to Base64 string
 */
export function serializeGameState(gameState: GameState): string {
  const data: SerializedGameData = {
    version: "0.2.0",
    timestamp: Date.now(),
    gameState,
    checksum: "",
  };

  const jsonString = JSON.stringify(data);
  data.checksum = calculateChecksum(jsonString);

  const finalJsonString = JSON.stringify(data);
  return btoa(finalJsonString);
}

/**
 * Deserialize Base64 string to game state
 */
export function deserializeGameState(base64Data: string): GameState | null {
  try {
    const jsonString = atob(base64Data);
    const data: SerializedGameData = JSON.parse(jsonString);

    // Validate structure
    if (!data.gameState || typeof data.timestamp !== "number") {
      return null;
    }

    // Validate checksum
    const dataForChecksum = { ...data, checksum: "" };
    const expectedChecksum = calculateChecksum(JSON.stringify(dataForChecksum));

    if (data.checksum !== expectedChecksum) {
      console.warn("Game data checksum mismatch");
      return null;
    }

    return data.gameState;
  } catch (error) {
    console.error("Failed to deserialize game state:", error);
    return null;
  }
}

/**
 * Generate shareable game code from game state
 */
export function generateShareableCode(gameState: GameState): string {
  const serialized = serializeGameState(gameState);
  const gameCode = generateGameCode();

  // Store in localStorage with game code as key
  const codeKey = `game-code-${gameCode}`;
  localStorage.setItem(codeKey, serialized);

  // Clean up old codes (keep only last 10)
  const allKeys = Object.keys(localStorage).filter((key) =>
    key.startsWith("game-code-")
  );
  if (allKeys.length > 10) {
    allKeys.slice(0, allKeys.length - 10).forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  return gameCode;
}

/**
 * Load game state from shareable code
 */
export function loadFromShareableCode(gameCode: string): GameState | null {
  if (!gameCode.startsWith(GAME_CODE_PREFIX)) {
    return null;
  }

  const codeKey = `game-code-${gameCode}`;
  const serialized = localStorage.getItem(codeKey);

  if (!serialized) {
    return null;
  }

  return deserializeGameState(serialized);
}

/**
 * Auto-save game state to localStorage
 */
export function autoSaveGameState(gameState: GameState): void {
  try {
    const serialized = serializeGameState(gameState);
    localStorage.setItem(AUTO_SAVE_KEY, serialized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
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
      return deserializeGameState(serialized);
    }

    // Fallback to old format
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

  // Clear game codes
  const allKeys = Object.keys(localStorage).filter((key) =>
    key.startsWith("game-code-")
  );
  allKeys.forEach((key) => localStorage.removeItem(key));
}

/**
 * Validate game code format
 */
export function isValidGameCode(code: string): boolean {
  const regex = new RegExp(
    `^${GAME_CODE_PREFIX}[A-Z0-9]{${GAME_CODE_LENGTH}}$`
  );
  return regex.test(code.toUpperCase());
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
