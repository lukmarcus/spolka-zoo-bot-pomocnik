// Game Storage utilities for save/load functionality
// v0.2.3 - Game code preview and detection functionality

import type { GameState, GameCodePreview } from "../types";

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
    // Validate required shared-mode fields for single-bot compact encoding
    if (
      !gameState.cardSequence ||
      typeof gameState.currentCardIndex !== "number"
    ) {
      throw new Error(
        "gameState must include cardSequence and currentCardIndex for encoding"
      );
    }

    // Encode card sequence (13 cards)
    const encodedSequence = gameState.cardSequence.map(encodeCard).join("");

    // Encode current position in deck
    const encodedPosition = encodeCard(gameState.currentCardIndex as number);

    // Check if multi-bot format is needed
    const botCount = gameState.botCount || 1;
    const currentBot = gameState.currentBot || 1;

    if (botCount === 1) {
      // Single bot: use compact 'remaining-only' format (ZS+<base64url>) per spec
      // Build remaining-only representation: CUR = card at currentCardIndex; SEQ = cards after CUR
      const curIndex = gameState.currentCardIndex as number;
      const fullSeq = gameState.cardSequence as number[];
      if (curIndex < 0 || curIndex >= fullSeq.length) {
        throw new Error("Invalid currentCardIndex");
      }
      const curCard = fullSeq[curIndex];
      const remaining = fullSeq.slice(curIndex + 1);
      return encodeSingleBotCompact(curCard, remaining);
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
      ).toUpperCase();
    }
  } catch {
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
  // Convert to lowercase to handle uppercase input from UI
  const normalizedCode = gameCode.toLowerCase();

  try {
    // Validate format
    // Support legacy 'ZOO...' format or new compact 'ZS+' etc.
    if (normalizedCode.startsWith(GAME_CODE_PREFIX_LOWER)) {
      const dataSection = normalizedCode.slice(3); // Remove "ZOO" prefix

      // Auto-detect format based on length
      let cardSequence: number[];
      let currentCardIndex: number;
      let botCount = 1;
      let currentBot = 1;

      if (dataSection.length === 14) {
        // Single bot legacy format (17 chars total: ZOO + 14 data)
        const sequenceSection = dataSection.slice(0, 13);
        cardSequence = sequenceSection.split("").map(decodeCard);
        currentCardIndex = decodeCard(dataSection.slice(13));
      } else if (dataSection.length === 16) {
        // Multi-bot legacy format (19 chars total: ZOO + 16 data)
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
          return null;
        }
      } else {
        return null;
      }

      // Calculate used cards based on current position
      const usedCards = cardSequence.slice(0, currentCardIndex);

      // Construct game state
      const gameState: GameState = {
        mode: "shared",
        currentCardIndex,
        cardSequence,
        usedCards,
        botCount,
        currentBot,
      };

      return gameState;
    }

    // Otherwise fallthrough to compact-prefixed formats

    // continue below for compact handling

    // Compact-prefixed forms: ZS+, ZP+, ZM+
    // Expect format like 'zs+<base64url>'
    const compactMatch = normalizedCode.match(/^z([psm])\+([0-9a-z\-_]+)$/);
    if (!compactMatch) {
      return null;
    }

    const mode = compactMatch[1];
    const payload = compactMatch[2];

    if (mode === "s") {
      return decodeSingleBotCompact(payload);
    }

    // For now, we only implemented single-bot compact decoding
    return null;
  } catch {
    return null;
  }
}

// ---- Compact (nibble) helpers and single-bot compact implementation ----

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array | null {
  // restore padding correctly
  const cleaned = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = (4 - (cleaned.length % 4)) % 4;
  const b64 = cleaned + "=".repeat(pad);
  try {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

function packNibbles(nibbles: number[]): Uint8Array {
  const bytes = new Uint8Array(Math.ceil(nibbles.length / 2));
  for (let i = 0; i < nibbles.length; i += 2) {
    const high = nibbles[i] & 0x0f;
    const low = i + 1 < nibbles.length ? nibbles[i + 1] & 0x0f : 0x0;
    bytes[i >> 1] = (high << 4) | low;
  }
  return bytes;
}

function unpackNibbles(bytes: Uint8Array): number[] {
  const nibbles: number[] = [];
  for (let i = 0; i < bytes.length; i++) {
    nibbles.push((bytes[i] >> 4) & 0x0f);
    nibbles.push(bytes[i] & 0x0f);
  }
  return nibbles;
}

/**
 * Encode single-bot remaining-only compact code.
 * Returns string like 'ZS+<base64url>'
 * Inputs:
 *  - curCard: number (0..12)
 *  - remaining: number[] (each 0..12)
 */
function encodeSingleBotCompact(curCard: number, remaining: number[]): string {
  const VER = 1; // 4-bit version
  const N = 1;
  const C = 1;
  const nibbles: number[] = [];
  // Header: VER, N, C, CUR
  nibbles.push(VER & 0x0f, N & 0x0f, C & 0x0f, curCard & 0x0f);
  // Block for bot1: length + items
  nibbles.push(remaining.length & 0x0f);
  for (const v of remaining) nibbles.push(v & 0x0f);

  const bytes = packNibbles(nibbles);
  const payload = base64UrlEncode(bytes);
  return `ZS+${payload}`;
}

/**
 * Decode single-bot compact payload (base64url without prefix) and return GameState
 */
function decodeSingleBotCompact(payload: string): GameState | null {
  const bytes = base64UrlDecode(payload);
  if (!bytes) return null;
  const nibbles = unpackNibbles(bytes);
  if (nibbles.length < 4 + 1) return null; // header + at least length nibble

  const VER = nibbles[0];
  // For now support only VER = 1
  if (VER !== 1) return null;
  const N = nibbles[1];
  const C = nibbles[2];
  const CUR = nibbles[3];
  if (N !== 1 || C !== 1) return null;

  const L1 = nibbles[4];
  const expected = 5 + L1;
  if (nibbles.length < expected) return null;

  const remaining: number[] = [];
  for (let i = 0; i < L1; i++) {
    remaining.push(nibbles[5 + i]);
  }

  // Build GameState as per 'remaining-only' semantics:
  // cardSequence = [CUR, ...remaining], currentCardIndex = 0, usedCards = []
  const cardSequence = [CUR, ...remaining];
  const gameState: GameState = {
    mode: "shared",
    currentCardIndex: 0,
    cardSequence,
    usedCards: [],
    botCount: 1,
    currentBot: 1,
  };

  return gameState;
}

/**
 * Auto-save game state to localStorage
 */
export function autoSaveGameState(gameState: GameState): void {
  try {
    const serialized = JSON.stringify(gameState);
    localStorage.setItem(AUTO_SAVE_KEY, serialized);
    localStorage.setItem(STORAGE_KEY, serialized); // Backup
  } catch {
    // Silently fail
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
  } catch {
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
 * Preview game code without full decoding - v0.2.3 feature
 * Returns basic information about the game state without loading it
 */
export function previewGameCode(code: string): GameCodePreview {
  // Initial validation
  if (!code || typeof code !== "string") {
    return {
      isValid: false,
      errorMessage: "Kod gry jest pusty",
      botCount: 1,
      currentBot: undefined,
      currentCardIndex: -1,
      totalCards: 13,
      gameProgress: "0/13",
      isGameStarted: false,
      isDeckExhausted: false,
    };
  }

  // Normalize code (handle both cases)
  const normalizedCode = code.toLowerCase().trim();

  // Check prefix
  if (!normalizedCode.startsWith(GAME_CODE_PREFIX_LOWER)) {
    return {
      isValid: false,
      errorMessage: "Kod musi zaczynać się od 'ZOO'",
      botCount: 1,
      currentBot: undefined,
      currentCardIndex: -1,
      totalCards: 13,
      gameProgress: "0/13",
      isGameStarted: false,
      isDeckExhausted: false,
    };
  }

  const dataSection = normalizedCode.slice(3);

  // Validate length (14 chars for 1 bot, 16 chars for 2-4 bots)
  if (dataSection.length !== 14 && dataSection.length !== 16) {
    return {
      isValid: false,
      errorMessage: `Nieprawidłowa długość kodu (${
        dataSection.length + 3
      } znaków)`,
      botCount: 1,
      currentBot: undefined,
      currentCardIndex: -1,
      totalCards: 13,
      gameProgress: "0/13",
      isGameStarted: false,
      isDeckExhausted: false,
    };
  }

  // Validate characters
  const validChars = /^[0-9a-c]+$/;
  if (!validChars.test(dataSection)) {
    return {
      isValid: false,
      errorMessage: "Kod zawiera nieprawidłowe znaki",
      botCount: 1,
      currentBot: undefined,
      currentCardIndex: -1,
      totalCards: 13,
      gameProgress: "0/13",
      isGameStarted: false,
      isDeckExhausted: false,
    };
  }

  try {
    let currentCardIndex: number;
    let botCount: number;
    let currentBot: number | undefined;

    if (dataSection.length === 14) {
      // Single bot format: 13 chars (sequence) + 1 char (position)
      currentCardIndex = decodeCard(dataSection.slice(13));
      botCount = 1;
      currentBot = undefined; // No current bot for single bot
    } else {
      // Multi-bot format: 13 chars + 1 char (position) + 1 char (botCount) + 1 char (currentBot)
      currentCardIndex = decodeCard(dataSection.slice(13, 14));
      // Decode bot count from position 14
      botCount = parseInt(dataSection.slice(14, 15));
      // Decode current bot from position 15
      currentBot = parseInt(dataSection.slice(15, 16));
    }

    const totalCards = 13;
    const cardsDrawn = Math.max(0, currentCardIndex + 1);
    const gameProgress = `${cardsDrawn}/${totalCards}`;
    const isGameStarted = currentCardIndex >= 0;
    const isDeckExhausted = currentCardIndex >= totalCards - 1;

    return {
      isValid: true,
      botCount,
      currentBot,
      currentCardIndex,
      totalCards,
      gameProgress,
      isGameStarted,
      isDeckExhausted,
    };
  } catch {
    return {
      isValid: false,
      errorMessage: "Błąd dekodowania kodu gry",
      botCount: 1,
      currentBot: undefined,
      currentCardIndex: -1,
      totalCards: 13,
      gameProgress: "0/13",
      isGameStarted: false,
      isDeckExhausted: false,
    };
  }
}

/**
 * Validate game code format for v0.2.1
 */
export function isValidGameCode(code: string): boolean {
  // Convert to lowercase to handle uppercase input from UI
  const normalizedCode = code.toLowerCase();

  if (!normalizedCode.startsWith(GAME_CODE_PREFIX_LOWER)) {
    return false;
  }

  const dataSection = normalizedCode.slice(3);

  // Support both single bot (14 chars) and multi-bot (16 chars) formats
  if (dataSection.length !== 14 && dataSection.length !== 16) {
    return false;
  }

  // Validate all characters are valid (0-9, a-c)
  const validChars = /^[0-9a-c]+$/;
  return validChars.test(dataSection);
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
  } catch {
    return false;
  }
}

/**
 * Simple function to copy game code to clipboard with user feedback
 * Returns user-friendly message for display
 */
export async function copyGameCodeToClipboard(
  gameState: GameState
): Promise<string> {
  try {
    const code = generateShareableCode(gameState);
    const success = await copyToClipboard(code);
    return success
      ? "✅ Stan gry skopiowany do schowka!"
      : "❌ Nie udało się skopiować. Spróbuj ponownie.";
  } catch {
    return "❌ Błąd podczas generowania kodu gry.";
  }
}

// Legacy v0.2.0 functions removed:
// - serializeGameState()
// - deserializeGameData()
// - generateGameCode()
// - calculateChecksum()
// These are no longer needed with the new ultra-compact system
