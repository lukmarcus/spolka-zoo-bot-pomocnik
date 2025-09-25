import type { GameState, GameCodePreview } from "../types";

// Single authoritative implementation
// - Single-bot readable: 'ZS+' + card chars (0-9,a-c)
// - Legacy multi-bot: 'ZOO' + 16-char data section (13 cards + pos + botCount + currentBot)
// No compression/packing (per user request)

const STORAGE_KEY = "zoo-bot-game-state";
const AUTO_SAVE_KEY = "zoo-bot-auto-save";
const GAME_CODE_PREFIX = "ZOO";
const GAME_CODE_PREFIX_LOWER = GAME_CODE_PREFIX.toLowerCase();

function encodeCard(cardIndex: number): string {
  if (cardIndex < 0 || cardIndex > 12) throw new Error("Invalid card index");
  return cardIndex <= 9
    ? String(cardIndex)
    : String.fromCharCode(97 + cardIndex - 10);
}

function decodeCard(char: string): number {
  if (!char || char.length === 0) throw new Error("Empty card char");
  const c = char[0];
  if (c >= "0" && c <= "9") return parseInt(c, 10);
  const lc = c.toLowerCase();
  if (lc >= "a" && lc <= "c") return lc.charCodeAt(0) - 97 + 10;
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
    return { cur, remaining };
  } catch {
    return null;
  }
}

export function generateShareableCode(gameState: GameState): string {
  if (!gameState) throw new Error("gameState required");
  const botCount = gameState.botCount || 1;
  if (botCount === 1) {
    const seq = gameState.cardSequence || [];
    const curIndex =
      typeof gameState.currentCardIndex === "number"
        ? gameState.currentCardIndex
        : 0;
    const cur = seq[curIndex] ?? 0;
    const remaining = seq.slice(curIndex + 1);
    return encodeSingleBotReadable(cur, remaining);
  }

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
  const lower = code.trim().toLowerCase();

  const singleMatch = lower.match(/^zs([0-9a-c]+)$/);
  if (singleMatch) {
    const parsed = decodeSingleBotReadablePayload(singleMatch[1]);
    if (!parsed) return null;
    const cardSequence = [parsed.cur, ...parsed.remaining];
    return {
      mode: "shared",
      currentCardIndex: 0,
      cardSequence,
      usedCards: [],
      botCount: 1,
      currentBot: 1,
    };
  }

  if (lower.startsWith(GAME_CODE_PREFIX_LOWER)) {
    const data = lower.slice(3);
    if (data.length !== 16) return null;
    if (!/^[0-9a-c]+$/.test(data)) return null;
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

  const lower = code.trim().toLowerCase();

  const singleMatch = lower.match(/^zs([0-9a-c]+)$/);
  if (singleMatch) {
    const parsed = decodeSingleBotReadablePayload(singleMatch[1]);
    if (!parsed)
      return {
        isValid: false,
        errorMessage: "Nieprawidłowy kod",
        botCount: 1,
        currentBot: undefined,
        currentCardIndex: -1,
        totalCards: 13,
        gameProgress: "0/13",
        isGameStarted: false,
        isDeckExhausted: false,
      };
    const totalCards = 13;
    const cardsDrawn = 1;
    const gameProgress = `${cardsDrawn}/${totalCards}`;
    return {
      isValid: true,
      botCount: 1,
      currentBot: 1,
      currentCardIndex: 0,
      totalCards,
      gameProgress,
      isGameStarted: true,
      isDeckExhausted: parsed.remaining.length === 0,
    };
  }

  if (lower.startsWith(GAME_CODE_PREFIX_LOWER)) {
    const data = lower.slice(3);
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
    if (!/^[0-9a-c]+$/.test(data))
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
  const lower = code.trim().toLowerCase();
  if (/^zs/.test(lower)) return true;
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
