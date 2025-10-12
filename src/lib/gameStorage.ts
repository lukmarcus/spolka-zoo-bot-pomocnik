import type { GameState, GameCodePreview } from "./types";

// Modern game code formats (v0.4.4)
// - ZS Single-bot: 'ZS' + card chars (0-9,A-C)
// - ZM Multi-shared: 'ZM' + [bots][current][card]Z[remaining] (0-9,A-C)
// - ZP Per-bot: 'ZP' + [bots][current][card]Z[bot1]Z[bot2]Z... (0-9,A-C)

const STORAGE_KEY = "zoo-bot-game-state";
const AUTO_SAVE_KEY = "zoo-bot-auto-save";

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

function encodePerBotReadable(gameState: GameState): string {
  if (
    !gameState.botDecks ||
    gameState.botDecks.length < 2 ||
    gameState.botDecks.length > 4
  ) {
    throw new Error("Invalid botDecks for ZP format");
  }

  const botCount = gameState.botDecks.length;
  const currentBot = gameState.currentBot || 1;

  if (currentBot < 1 || currentBot > botCount) {
    throw new Error("Invalid current bot for ZP");
  }

  // Get current card from current bot's deck
  const currentBotDeck = gameState.botDecks[currentBot - 1];
  const curCard =
    currentBotDeck.cardSequence[currentBotDeck.currentCardIndex] ?? 0;

  // Build header: ZP[botCount][currentBot][currentCard]
  let code = `ZP${botCount}${currentBot}${encodeCard(curCard)}`;

  // Build remaining blocks for each bot
  for (const botDeck of gameState.botDecks) {
    const remaining = botDeck.cardSequence.slice(botDeck.currentCardIndex + 1);
    const remainingCards = remaining.map(encodeCard).join("");
    code += `Z${remainingCards}`;
  }

  return code;
}

function decodePerBotPayload(payload: string): {
  botCount: number;
  currentBot: number;
  cur: number;
  botDecks: Array<{ remaining: number[] }>;
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

    // Split remaining payload by Z to get bot blocks
    const remainingPayload = payload.slice(4); // Everything after first Z
    const blocks = remainingPayload.split("Z");

    // Validate block count - must match botCount
    if (blocks.length !== botCount) return null;

    // Parse each bot's remaining cards
    const botDecks: Array<{ remaining: number[] }> = [];
    const allCardsUsed = new Set<number>();
    allCardsUsed.add(cur); // Current card is used

    for (let i = 0; i < botCount; i++) {
      const block = blocks[i];
      const remaining: number[] = [];
      const isCurrentBotBlock = i + 1 === currentBot;

      if (block.length > 0) {
        const chars = block.split("");
        for (const char of chars) {
          const card = decodeCard(char);

          // Validate: current card must NOT appear in CURRENT bot's remaining block
          if (isCurrentBotBlock && card === cur) return null;

          // Validate: no duplicates within this block
          if (remaining.includes(card)) return null;

          remaining.push(card);
        }
      }

      botDecks.push({ remaining });
      allCardsUsed.add(cur); // Track that current card is used
    }

    // Validate total card count - must be 1-13 (current + all remaining)
    if (allCardsUsed.size < 1 || allCardsUsed.size > 13) return null;

    return { botCount, currentBot, cur, botDecks };
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

  // For multi-bot (2-4 bots), check mode
  if (gameState.mode === "individual" && gameState.botDecks) {
    // Use ZP format for individual mode (per-bot decks)
    return encodePerBotReadable(gameState);
  }

  if (gameState.mode === "shared") {
    // Use ZM format for shared mode
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

  // All modern formats handled above - this should not happen
  throw new Error("Nieprawidłowy stan gry - nie można wygenerować kodu");
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

  const perBotMatch = trimmed.match(/^ZP([1-4])([1-4])([0-9A-C])(Z.*)$/i);
  if (perBotMatch) {
    const parsed = decodePerBotPayload(
      perBotMatch[1] + perBotMatch[2] + perBotMatch[3] + perBotMatch[4]
    );
    if (!parsed) return null;

    // Reconstruct full card sequences for each bot
    const totalCards = 13;
    const allCardsInGame = new Set<number>();
    allCardsInGame.add(parsed.cur);

    parsed.botDecks.forEach((deck) => {
      deck.remaining.forEach((card) => allCardsInGame.add(card));
    });

    const cardsAlreadyDrawn = totalCards - allCardsInGame.size;

    // Get all cards that were used (not in any remaining + not current)
    const allCards = Array.from({ length: totalCards }, (_, i) => i);
    const usedCards = allCards.filter((c) => !allCardsInGame.has(c));

    // Build botDecks array for GameState
    const botDecks = parsed.botDecks.map((deck, index) => {
      const botId = index + 1;
      const isCurrentBot = botId === parsed.currentBot;

      // For current bot: they are showing current card (already drawn)
      // For other bots: they haven't drawn current card yet
      const cardsDrawnByThisBot = totalCards - deck.remaining.length;
      let currentCardIdx;
      let thisBotsUsedCards;

      if (isCurrentBot) {
        // Current bot has already drawn the current card
        currentCardIdx = cardsDrawnByThisBot - 1; // Index of current card
        thisBotsUsedCards = Array.from(
          { length: cardsDrawnByThisBot - 1 },
          (_, i) => i
        );
        // Full sequence: used cards + current card + remaining
        const cardSequence = [
          ...thisBotsUsedCards,
          parsed.cur,
          ...deck.remaining,
        ];
        return {
          botId,
          cardSequence,
          currentCardIndex: currentCardIdx,
          usedCards: thisBotsUsedCards,
        };
      } else {
        // Other bots haven't drawn current card yet
        currentCardIdx = cardsDrawnByThisBot - 1; // Index of their next card to draw
        thisBotsUsedCards = Array.from(
          { length: cardsDrawnByThisBot },
          (_, i) => i
        );
        // Full sequence: used cards + remaining
        const cardSequence = [...thisBotsUsedCards, ...deck.remaining];
        return {
          botId,
          cardSequence,
          currentCardIndex: currentCardIdx,
          usedCards: thisBotsUsedCards,
        };
      }
    });

    return {
      mode: "individual",
      currentCardIndex: cardsAlreadyDrawn,
      cardSequence: [], // Not used in individual mode
      usedCards: usedCards,
      botCount: parsed.botCount,
      currentBot: parsed.currentBot,
      botsSelected: true,
      botDecks,
    };
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
      mode: "shared" as const,
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
      mode: "shared" as const,
    };
  }

  // Handle ZP codes - support partial codes during typing
  if (trimmed.match(/^ZP[1-4]?[1-4]?[0-9A-C]?(Z.*)?$/i)) {
    const perBotMatch = trimmed.match(/^ZP([1-4])([1-4])([0-9A-C])(Z.*)$/i);

    if (!perBotMatch) {
      // Partial code during typing - provide basic validation feedback
      const partialMatch = trimmed.match(
        /^ZP([1-4]?)([1-4]?)([0-9A-C]?)(Z.*)?$/i
      );
      if (partialMatch) {
        const [, botCountStr, currentBotStr] = partialMatch;

        // Basic validation for partial input
        if (botCountStr && currentBotStr) {
          const botCount = parseInt(botCountStr, 10);
          const currentBot = parseInt(currentBotStr, 10);

          if (currentBot > botCount) {
            return {
              isValid: false,
              errorMessage: `Aktualny bot (${currentBot}) poza zakresem (1-${botCount})`,
              botCount: botCount,
              currentBot: currentBot,
              currentCardIndex: -1,
              totalCards: 13,
              gameProgress: "0/13",
              isGameStarted: false,
              isDeckExhausted: false,
              mode: "individual" as const,
            };
          }
        }

        return {
          isValid: false,
          errorMessage: "Kod ZP niepełny - kontynuuj wpisywanie",
          botCount: botCountStr ? parseInt(botCountStr, 10) : 1,
          currentBot: currentBotStr ? parseInt(currentBotStr, 10) : 1,
          currentCardIndex: -1,
          totalCards: 13,
          gameProgress: "0/13",
          isGameStarted: false,
          isDeckExhausted: false,
          mode: "individual" as const,
        };
      }

      return {
        isValid: false,
        errorMessage: "Kod ZP niepełny",
        botCount: 1,
        currentBot: 1,
        currentCardIndex: -1,
        totalCards: 13,
        gameProgress: "0/13",
        isGameStarted: false,
        isDeckExhausted: false,
        mode: "individual" as const,
      };
    }

    // Full ZP code - decode and validate
    const parsed = decodePerBotPayload(
      perBotMatch[1] + perBotMatch[2] + perBotMatch[3] + perBotMatch[4]
    );
    if (!parsed) {
      // Try to provide more specific error messages
      const botCountChar = perBotMatch[1];
      const currentBotChar = perBotMatch[2];
      const botCount = parseInt(botCountChar, 10);
      const currentBot = parseInt(currentBotChar, 10);

      if (currentBot > botCount) {
        return {
          isValid: false,
          errorMessage: `Aktualny bot (${currentBot}) poza zakresem (1-${botCount})`,
          botCount: botCount,
          currentBot: currentBot,
          currentCardIndex: -1,
          totalCards: 13,
          gameProgress: "0/13",
          isGameStarted: false,
          isDeckExhausted: false,
          mode: "individual" as const,
        };
      }

      return {
        isValid: false,
        errorMessage:
          "Kod ZP zawiera nieprawidłowe dane (sprawdź duplikaty lub obecną kartę w blokach)",
        botCount: botCount,
        currentBot: currentBot,
        currentCardIndex: -1,
        totalCards: 13,
        gameProgress: "0/13",
        isGameStarted: false,
        isDeckExhausted: false,
        mode: "individual" as const,
      };
    }

    const totalCards = 13;
    const allCardsInGame = new Set<number>();
    allCardsInGame.add(parsed.cur);

    let totalRemaining = 0;
    parsed.botDecks.forEach((deck) => {
      totalRemaining += deck.remaining.length;
      deck.remaining.forEach((card) => allCardsInGame.add(card));
    });

    const cardsAlreadyDrawn = totalCards - allCardsInGame.size;
    const currentPosition = cardsAlreadyDrawn + 1;

    if (currentPosition <= 0 || currentPosition > totalCards) {
      return {
        isValid: false,
        errorMessage: "Kod ZP zawiera nieprawidłowy stan gry",
        botCount: parsed.botCount,
        currentBot: parsed.currentBot,
        currentCardIndex: -1,
        totalCards: 13,
        gameProgress: "0/13",
        isGameStarted: false,
        isDeckExhausted: false,
        mode: "individual" as const,
      };
    }

    // For ZP format, calculate per-bot positions
    // Each bot has independent deck progress: position = 13 - remaining_cards
    const botPositions = parsed.botDecks.map((botDeck, index) => {
      const botId = index + 1;

      // Each bot's position = cards already seen from their deck
      // Position = total cards (13) - remaining cards in their deck
      const cardsSeenByBot = totalCards - botDeck.remaining.length;
      const positionStr = `${cardsSeenByBot}/${totalCards}`;

      return {
        botId,
        position: positionStr,
      };
    });

    const gameProgress = `${currentPosition}/${totalCards}`;
    return {
      isValid: true,
      botCount: parsed.botCount,
      currentBot: parsed.currentBot,
      currentCardIndex: cardsAlreadyDrawn,
      totalCards,
      gameProgress,
      isGameStarted: true,
      isDeckExhausted: totalRemaining === 0,
      mode: "individual" as const,
      botPositions,
    };
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

  // Validate ZP format with proper per-bot validation
  const perBotMatch = trimmed.match(/^ZP([1-4])([1-4])([0-9A-C])(Z.*)$/i);
  if (perBotMatch) {
    const parsed = decodePerBotPayload(
      perBotMatch[1] + perBotMatch[2] + perBotMatch[3] + perBotMatch[4]
    );
    return parsed !== null; // This includes all ZP validation rules
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
