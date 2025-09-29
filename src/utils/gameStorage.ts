import type { GameState, GameCodePreview } from "../types";

// Single authoritative implementation
// - ZS Single-bot: 'ZS' + card chars (0-9,A-C)
// - ZM Multi-shared: 'ZM' + [bots][current][card]Z[remaining] (0-9,A-C)
// - ZOO Legacy: 'ZOO' + 16-char data section (13 cards + pos + botCount + currentBot)
// No compression/packing (per user request)

const STORAGE_KEY = "zoo-bot-game-state";
const AUTO_SAVE_KEY = "zoo-bot-auto-save";
const GAME_CODE_PREFIX = "ZOO";
const GAME_CODE_PREFIX_LOWER = GAME_CODE_PREFIX.toLowerCase();

function encodeCard(cardIndex: number): string {
  if (cardIndex < 0 || cardIndex > 12) throw new Error("Invalid card index");
  return cardIndex <= 9
    ? String(cardIndex)
    : String.fromCharCode(65 + cardIndex - 10);
}

function decodeCard(char: string): number {
  if (!char || char.length === 0) throw new Error("Empty card char");
  const c = char[0];
  if (c >= "0" && c <= "9") return parseInt(c, 10);
  const uc = c.toUpperCase();
  if (uc >= "A" && uc <= "C") return uc.charCodeAt(0) - 65 + 10;
  throw new Error("Invalid card char");
}

function encodeSingleBotReadable(curCard: number, remaining: number[]): string {
  return `ZS${[encodeCard(curCard), ...remaining.map(encodeCard)].join("")}`;
}

function decodeSingleBotReadablePayload(
  payload: string
): { cur: number; remaining: number[] } | null {
  if (!payload) return null;
  const chars = payload.split("");
  try {
    const cur = decodeCard(chars[0]);
    const remaining: number[] = [];
    for (let i = 1; i < chars.length; i++) remaining.push(decodeCard(chars[i]));

    // Validate card uniqueness - no duplicates allowed
    const allCards = [cur, ...remaining];
    const uniqueCards = new Set(allCards);
    if (uniqueCards.size !== allCards.length) return null;

    // Validate total card count - must be 1-13 (current + remaining)
    // Note: Range 0-12 is guaranteed by decodeCard() + uniqueness check
    if (allCards.length < 1 || allCards.length > 13) return null;

    return { cur, remaining };
  } catch {
    return null;
  }
}

function encodeMultiSharedReadable(
  botCount: number,
  currentBot: number,
  curCard: number,
  remaining: number[]
): string {
  if (botCount < 2 || botCount > 4) throw new Error("Invalid bot count for ZM");
  if (currentBot < 1 || currentBot > botCount)
    throw new Error("Invalid current bot for ZM");

  const remainingCards = remaining.map(encodeCard).join("");
  return `ZM${botCount}${currentBot}${encodeCard(curCard)}Z${remainingCards}`;
}

function decodeMultiSharedReadablePayload(payload: string): {
  botCount: number;
  currentBot: number;
  cur: number;
  remaining: number[];
} | null {
  if (!payload || payload.length < 4) return null; // Minimum: [bot][current][card]Z

  try {
    const botCount = parseInt(payload[0], 10);
    const currentBot = parseInt(payload[1], 10);

    // Validate bot parameters
    if (botCount < 2 || botCount > 4) return null;
    if (currentBot < 1 || currentBot > botCount) return null;

    // Parse current card at position 2
    const cur = decodeCard(payload[2]);

    // Find Z separator (should be at position 3)
    if (payload[3] !== "Z") return null;

    // Parse remaining cards after Z separator
    const remainingSection = payload.slice(4); // Everything after Z
    const remaining: number[] = [];

    if (remainingSection.length > 0) {
      const chars = remainingSection.split("");
      for (const char of chars) {
        remaining.push(decodeCard(char));
      }
    }

    // Validate card uniqueness - no duplicates allowed
    const allCards = [cur, ...remaining];
    const uniqueCards = new Set(allCards);
    if (uniqueCards.size !== allCards.length) return null;

    // Validate total card count - must be 1-13 (current + remaining)
    if (allCards.length < 1 || allCards.length > 13) return null;

    return { botCount, currentBot, cur, remaining };
  } catch {
    return null;
  }
}

export function generateShareableCode(gameState: GameState): string {
  if (!gameState) throw new Error("gameState required");
  const botCount = gameState.botCount || 1;

  if (botCount === 1) {
    // Use ZS format for single bot
    const seq = gameState.cardSequence || [];
    const curIndex =
      typeof gameState.currentCardIndex === "number"
        ? gameState.currentCardIndex
        : 0;
    const cur = seq[curIndex] ?? 0;
    const remaining = seq.slice(curIndex + 1);
    return encodeSingleBotReadable(cur, remaining);
  }

  // For multi-bot (2-4 bots), use ZM format for shared mode
  if (gameState.mode === "shared") {
    const seq = gameState.cardSequence || [];
    const curIndex =
      typeof gameState.currentCardIndex === "number"
        ? gameState.currentCardIndex
        : 0;
    const cur = seq[curIndex] ?? 0;
    const remaining = seq.slice(curIndex + 1);
    const currentBot = gameState.currentBot || 1;
    return encodeMultiSharedReadable(botCount, currentBot, cur, remaining);
  }

  // Fallback to legacy ZOO format for non-shared modes
  const encodedSequence = (gameState.cardSequence || [])
    .map(encodeCard)
    .join("");
  const encodedPosition = encodeCard(gameState.currentCardIndex ?? 0);
  const encodedBotCount = (gameState.botCount || 1).toString();
  const encodedCurrentBot = (gameState.currentBot || 1).toString();
  return (
    GAME_CODE_PREFIX +
    encodedSequence +
    encodedPosition +
    encodedBotCount +
    encodedCurrentBot
  ).toUpperCase();
}

export function loadFromShareableCode(code: string): GameState | null {
  if (!code || typeof code !== "string") return null;
  const trimmed = code.trim();

  const singleMatch = trimmed.match(/^ZS([0-9A-C]+)$/i);
  if (singleMatch) {
    const parsed = decodeSingleBotReadablePayload(singleMatch[1]);
    if (!parsed) return null;
    const tail = [parsed.cur, ...parsed.remaining];
    // compute how many cards were already drawn before this sequence
    const totalCards = 13;
    const totalCardsInSequence = tail.length; // current + remaining
    const cardsAlreadyDrawn = totalCards - totalCardsInSequence; // number of used cards

    // Reconstruct a full 13-card sequence: missing cards (used) followed by tail
    const allCards = Array.from({ length: totalCards }, (_, i) => i);
    const tailSet = new Set(tail);
    const usedCards = allCards.filter((c) => !tailSet.has(c));
    const cardSequence = [...usedCards, ...tail];

    return {
      mode: "shared",
      currentCardIndex: cardsAlreadyDrawn,
      cardSequence,
      usedCards: usedCards,
      botCount: 1,
      currentBot: 1,
      botsSelected: true,
    };
  }

  const multiMatch = trimmed.match(/^ZM([0-9A-C]+Z[0-9A-C]*)$/i);
  if (multiMatch) {
    const parsed = decodeMultiSharedReadablePayload(multiMatch[1]);
    if (!parsed) return null;
    const tail = [parsed.cur, ...parsed.remaining];
    // compute how many cards were already drawn before this sequence
    const totalCards = 13;
    const totalCardsInSequence = tail.length; // current + remaining
    const cardsAlreadyDrawn = totalCards - totalCardsInSequence; // number of used cards

    // Reconstruct full sequence
    const allCards = Array.from({ length: totalCards }, (_, i) => i);
    const tailSet = new Set(tail);
    const usedCards = allCards.filter((c) => !tailSet.has(c));
    const cardSequence = [...usedCards, ...tail];

    return {
      mode: "shared",
      currentCardIndex: cardsAlreadyDrawn,
      cardSequence,
      usedCards: usedCards,
      botCount: parsed.botCount,
      currentBot: parsed.currentBot,
      botsSelected: true,
    };
  }

  if (trimmed.toLowerCase().startsWith(GAME_CODE_PREFIX_LOWER)) {
    const data = trimmed.slice(3);
    if (data.length !== 16) return null;
    if (!/^[0-9A-C]+$/i.test(data)) return null;
    try {
      const seq = data.slice(0, 13).split("").map(decodeCard);
      const pos = decodeCard(data.slice(13, 14));
      const botCount = parseInt(data.slice(14, 15), 10);
      const currentBot = parseInt(data.slice(15, 16), 10);
      return {
        mode: "shared",
        currentCardIndex: pos,
        cardSequence: seq,
        usedCards: seq.slice(0, pos),
        botCount,
        currentBot,
        botsSelected: true,
      };
    } catch {
      return null;
    }
  }

  return null;
}

export function previewGameCode(code: string): GameCodePreview {
  if (!code)
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

  const trimmed = code.trim();

  const singleMatch = trimmed.match(/^ZS([0-9A-C]+)$/i);
  if (singleMatch) {
    const parsed = decodeSingleBotReadablePayload(singleMatch[1]);
    if (!parsed)
      return {
        isValid: false,
        errorMessage: "Kod zawiera nieprawidłowe lub powtarzające się karty",
        botCount: 1,
        currentBot: undefined,
        currentCardIndex: -1,
        totalCards: 13,
        gameProgress: "0/13",
        isGameStarted: false,
        isDeckExhausted: false,
      };
    const totalCards = 13;
    const totalCardsInSequence = 1 + parsed.remaining.length; // current + remaining
    const cardsAlreadyDrawn = totalCards - totalCardsInSequence; // cards drawn before this sequence
    const currentPosition = cardsAlreadyDrawn + 1; // current card position (1-based)

    // Prevent invalid states
    if (currentPosition <= 0 || currentPosition > totalCards) {
      return {
        isValid: false,
        errorMessage: "Nieprawidłowy stan gry - pozycja poza zakresem",
        botCount: 1,
        currentBot: undefined,
        currentCardIndex: -1,
        totalCards: 13,
        gameProgress: "0/13",
        isGameStarted: false,
        isDeckExhausted: false,
      };
    }

    const gameProgress = `${currentPosition}/${totalCards}`;
    return {
      isValid: true,
      botCount: 1,
      currentBot: 1,
      currentCardIndex: cardsAlreadyDrawn, // 0-based index
      totalCards,
      gameProgress,
      isGameStarted: true,
      isDeckExhausted: parsed.remaining.length === 0,
    };
  }

  const multiMatch = trimmed.match(/^ZM([0-9A-C]+Z[0-9A-C]*)$/i);
  if (multiMatch) {
    const parsed = decodeMultiSharedReadablePayload(multiMatch[1]);
    if (!parsed)
      return {
        isValid: false,
        errorMessage:
          "Kod ZM zawiera nieprawidłowe dane lub błędną liczbę botów",
        botCount: 1,
        currentBot: undefined,
        currentCardIndex: -1,
        totalCards: 13,
        gameProgress: "0/13",
        isGameStarted: false,
        isDeckExhausted: false,
      };

    const totalCards = 13;
    const totalCardsInSequence = 1 + parsed.remaining.length; // current + remaining
    const cardsAlreadyDrawn = totalCards - totalCardsInSequence; // cards drawn before this sequence
    const currentPosition = cardsAlreadyDrawn + 1; // current card position (1-based)

    // Prevent invalid states
    if (currentPosition <= 0 || currentPosition > totalCards) {
      return {
        isValid: false,
        errorMessage: "Kod ZM zawiera nieprawidłowy stan gry",
        botCount: parsed.botCount,
        currentBot: parsed.currentBot,
        currentCardIndex: -1,
        totalCards: 13,
        gameProgress: "0/13",
        isGameStarted: false,
        isDeckExhausted: false,
      };
    }

    const gameProgress = `${currentPosition}/${totalCards}`;
    return {
      isValid: true,
      botCount: parsed.botCount,
      currentBot: parsed.currentBot,
      currentCardIndex: cardsAlreadyDrawn, // 0-based index
      totalCards,
      gameProgress,
      isGameStarted: true,
      isDeckExhausted: parsed.remaining.length === 0,
    };
  }

  if (trimmed.toLowerCase().startsWith(GAME_CODE_PREFIX_LOWER)) {
    const data = trimmed.slice(3);
    if (data.length !== 16)
      return {
        isValid: false,
        errorMessage: "Stary format ZOO jest nieprawidłowy (tylko multi-bot)",
        botCount: 1,
        currentBot: undefined,
        currentCardIndex: -1,
        totalCards: 13,
        gameProgress: "0/13",
        isGameStarted: false,
        isDeckExhausted: false,
      };
    if (!/^[0-9A-C]+$/i.test(data))
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
    try {
      const pos = decodeCard(data.slice(13, 14));
      const botCount = parseInt(data.slice(14, 15), 10);
      const currentBot = parseInt(data.slice(15, 16), 10);
      const totalCards = 13;
      const cardsDrawn = Math.max(0, pos + 1);
      const gameProgress = `${cardsDrawn}/${totalCards}`;
      return {
        isValid: true,
        botCount,
        currentBot,
        currentCardIndex: pos,
        totalCards,
        gameProgress,
        isGameStarted: pos >= 0,
        isDeckExhausted: pos >= totalCards - 1,
      };
    } catch {
      return {
        isValid: false,
        errorMessage: "Błąd dekodowania",
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

  return {
    isValid: false,
    errorMessage: "Nieznany format kodu",
    botCount: 1,
    currentBot: undefined,
    currentCardIndex: -1,
    totalCards: 13,
    gameProgress: "0/13",
    isGameStarted: false,
    isDeckExhausted: false,
  };
}

export function isValidGameCode(code: string): boolean {
  if (!code || typeof code !== "string") return false;
  const trimmed = code.trim();

  // Validate ZS format with proper card validation
  const singleMatch = trimmed.match(/^ZS([0-9A-C]+)$/i);
  if (singleMatch) {
    const parsed = decodeSingleBotReadablePayload(singleMatch[1]);
    return parsed !== null; // This now includes duplicate/range validation
  }

  // Validate ZM format with proper multi-bot validation
  const multiMatch = trimmed.match(/^ZM([0-9A-C]+Z[0-9A-C]*)$/i);
  if (multiMatch) {
    const parsed = decodeMultiSharedReadablePayload(multiMatch[1]);
    return parsed !== null; // This includes bot count + card validation
  }

  // Validate legacy ZOO format
  const lower = trimmed.toLowerCase();
  if (lower.startsWith(GAME_CODE_PREFIX_LOWER)) {
    const data = lower.slice(3);
    return data.length === 16 && /^[0-9a-c]+$/.test(data);
  }

  return false;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.prepend(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    return true;
  } catch {
    return false;
  }
}

export async function copyGameCodeToClipboard(
  gameState: GameState
): Promise<string> {
  try {
    const code = generateShareableCode(gameState);
    const ok = await copyToClipboard(code);
    return ok
      ? "✅ Stan gry skopiowany do schowka!"
      : "❌ Nie udało się skopiować. Spróbuj ponownie.";
  } catch {
    return "❌ Błąd podczas generowania kodu gry.";
  }
}

export function autoSaveGameState(gameState: GameState): void {
  try {
    const serialized = JSON.stringify(gameState);
    localStorage.setItem(AUTO_SAVE_KEY, serialized);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // ignore
  }
}

export function loadAutoSavedGameState(): GameState | null {
  try {
    const s =
      localStorage.getItem(AUTO_SAVE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (!s) return null;
    return JSON.parse(s) as GameState;
  } catch {
    return null;
  }
}

export function clearAllSavedData(): void {
  localStorage.removeItem(AUTO_SAVE_KEY);
  localStorage.removeItem(STORAGE_KEY);
}
