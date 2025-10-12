// Game Context - Spółka ZOO Bot Helper
// Manages bot card game state and actions

/* eslint-disable react-refresh/only-export-components */

import { createContext, useReducer, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import type { BotDeck, GameState, GameContextType } from "./types";
import { TOTAL_CARDS } from "./botCards";
import { loadAutoSavedGameState } from "./gameStorage";

// === CONTEXT ===

// Create context
export const GameContext = createContext<GameContextType | undefined>(
  undefined
);

// Game Actions
type GameAction =
  | { type: "DRAW_CARD" }
  | { type: "SHUFFLE_DECK" }
  | { type: "RESET_GAME" }
  | { type: "NEW_GAME" }
  | { type: "LOAD_GAME"; payload: GameState }
  | { type: "SELECT_BOTS"; payload: number } // v0.3.0+ bot count selection
  | { type: "SWITCH_BOT"; payload: number } // v0.3.0+ switch current bot
  | { type: "NEXT_BOT" } // v0.3.3+ go to next bot in sequence
  | { type: "NEXT_BOT_AND_DRAW" } // v0.3.3+ go to next bot and draw card
  | { type: "NEXT_BOT_AND_SHUFFLE_AND_DRAW" }; // v0.4.1+ atomic: switch to next bot, reshuffle if needed, and draw

// Utility function to generate shuffled sequence
function generateShuffledSequence(): number[] {
  const sequence = Array.from({ length: TOTAL_CARDS }, (_, i) => i);
  // Fisher-Yates shuffle
  for (let i = sequence.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
  }
  return sequence;
}

// Utility: generate botDecks for individual mode
function generateBotDecks(botCount: number): BotDeck[] {
  return Array.from({ length: botCount }, (_, idx) => ({
    botId: idx + 1,
    cardSequence: generateShuffledSequence(),
    currentCardIndex: -1,
    usedCards: [],
  }));
}

// Get initial state (with auto-save restore)
function getInitialState(): GameState {
  const autoSaved = loadAutoSavedGameState();
  if (autoSaved) {
    return {
      ...autoSaved,
      botsSelected: autoSaved.botCount ? true : false,
      mode: autoSaved.mode || "shared",
    };
  }
  return {
    mode: "shared",
    currentCardIndex: -1,
    cardSequence: [],
    usedCards: [],
    botCount: 1,
    currentBot: 1,
    botsSelected: false,
  };
}

function getCleanState(
  mode: "shared" | "individual" = "shared",
  botCount = 1
): GameState {
  if (mode === "individual") {
    return {
      mode,
      botDecks: generateBotDecks(botCount),
      botCount,
      currentBot: 1,
      botsSelected: false,
    };
  }
  return {
    mode,
    currentCardIndex: -1,
    cardSequence: [],
    usedCards: [],
    botCount,
    currentBot: 1,
    botsSelected: false,
  };
}

// Initial game state
const initialState: GameState = getInitialState();

// Game reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "NEW_GAME": {
      // Tryb shared/individual z zachowaniem botCount
      return getCleanState(state.mode, state.botCount || 1);
    }
    case "SELECT_BOTS": {
      // Tryb shared/individual z nową liczbą botów
      if (state.mode === "individual") {
        return {
          ...state,
          botCount: action.payload,
          botDecks: generateBotDecks(action.payload),
          currentBot: 1,
          botsSelected: true,
        };
      }
      // shared
      const shuffledSequence = generateShuffledSequence();
      return {
        ...state,
        botCount: action.payload,
        currentBot: 1,
        botsSelected: true,
        cardSequence: shuffledSequence,
        currentCardIndex: -1,
        usedCards: [],
      };
    }

    case "DRAW_CARD": {
      if (state.mode === "individual" && state.botDecks && state.currentBot) {
        // Pobierz deck aktualnego bota
        const botIdx = state.currentBot - 1;
        const botDecks = [...state.botDecks];
        const botDeck = botDecks[botIdx];
        if (!botDeck || botDeck.cardSequence.length === 0) return state;
        const nextIndex = botDeck.currentCardIndex + 1;
        if (
          nextIndex >= botDeck.cardSequence.length ||
          nextIndex >= TOTAL_CARDS
        )
          return state;
        const newUsedCards = [
          ...botDeck.usedCards,
          botDeck.cardSequence[nextIndex],
        ];
        botDecks[botIdx] = {
          ...botDeck,
          currentCardIndex: nextIndex,
          usedCards: newUsedCards,
        };
        return {
          ...state,
          botDecks,
        };
      }
      // shared mode
      const cardSequence = Array.isArray(state.cardSequence)
        ? state.cardSequence
        : [];
      const currentCardIndex =
        typeof state.currentCardIndex === "number"
          ? state.currentCardIndex
          : -1;
      const usedCards = Array.isArray(state.usedCards) ? state.usedCards : [];
      if (cardSequence.length === 0) {
        return state;
      }
      const nextIndex = currentCardIndex + 1;
      if (nextIndex >= cardSequence.length || nextIndex >= TOTAL_CARDS) {
        return state;
      }
      const newUsedCards = [...usedCards, cardSequence[nextIndex]];
      return {
        ...state,
        currentCardIndex: nextIndex,
        usedCards: newUsedCards,
      };
    }

    case "SHUFFLE_DECK": {
      // If individual mode, reshuffle only the current bot's deck
      if (state.mode === "individual" && state.botDecks && state.currentBot) {
        const botIdx = state.currentBot - 1;
        const botDecks = [...state.botDecks];
        const botDeck = botDecks[botIdx];
        if (!botDeck) return state;
        botDecks[botIdx] = {
          ...botDeck,
          cardSequence: generateShuffledSequence(),
          currentCardIndex: 0,
          usedCards: [],
        };
        return {
          ...state,
          botDecks,
        };
      }

      // Shared mode - reshuffle the shared deck
      return {
        ...state,
        currentCardIndex: 0,
        cardSequence: generateShuffledSequence(),
        usedCards: [],
      };
    }

    case "RESET_GAME":
      return getCleanState();

    case "LOAD_GAME":
      return action.payload;

    case "SWITCH_BOT": {
      return {
        ...state,
        currentBot: action.payload,
      };
    }

    case "NEXT_BOT": {
      // v0.3.3+ Go to next bot in sequence (1, 2, 3, 4 -> 1)
      const nextBot =
        state.currentBot && state.botCount
          ? (state.currentBot % state.botCount) + 1
          : 1;
      return {
        ...state,
        currentBot: nextBot,
      };
    }

    case "NEXT_BOT_AND_DRAW": {
      if (
        state.mode === "individual" &&
        state.botDecks &&
        state.currentBot &&
        state.botCount
      ) {
        const nextBot = (state.currentBot % state.botCount) + 1;
        // Draw for next bot
        const botIdx = nextBot - 1;
        const botDecks = [...state.botDecks];
        const botDeck = botDecks[botIdx];
        if (!botDeck || botDeck.cardSequence.length === 0)
          return { ...state, currentBot: nextBot };
        const nextIndex = botDeck.currentCardIndex + 1;
        if (
          nextIndex >= botDeck.cardSequence.length ||
          nextIndex >= TOTAL_CARDS
        )
          return { ...state, currentBot: nextBot };
        const newUsedCards = [
          ...botDeck.usedCards,
          botDeck.cardSequence[nextIndex],
        ];
        botDecks[botIdx] = {
          ...botDeck,
          currentCardIndex: nextIndex,
          usedCards: newUsedCards,
        };
        return {
          ...state,
          botDecks,
          currentBot: nextBot,
        };
      }
      // shared mode
      const cardSequence = Array.isArray(state.cardSequence)
        ? state.cardSequence
        : [];
      const currentCardIndex =
        typeof state.currentCardIndex === "number"
          ? state.currentCardIndex
          : -1;
      const usedCards = Array.isArray(state.usedCards) ? state.usedCards : [];
      if (cardSequence.length === 0) {
        return state;
      }
      const nextIndex = currentCardIndex + 1;
      if (nextIndex >= cardSequence.length || nextIndex >= TOTAL_CARDS) {
        return state;
      }
      const nextBot =
        state.currentBot && state.botCount
          ? (state.currentBot % state.botCount) + 1
          : 1;
      const newUsedCards = [...usedCards, cardSequence[nextIndex]];
      return {
        ...state,
        currentCardIndex: nextIndex,
        usedCards: newUsedCards,
        currentBot: nextBot,
      };
    }

    case "NEXT_BOT_AND_SHUFFLE_AND_DRAW": {
      // Atomic: switch to next bot, if its deck is exhausted then reshuffle that deck and draw,
      // otherwise draw normally. Works for both individual and shared modes.
      if (
        state.mode === "individual" &&
        state.botDecks &&
        state.currentBot &&
        state.botCount
      ) {
        const nextBot = (state.currentBot % state.botCount) + 1;
        const botIdx = nextBot - 1;
        const botDecks = [...state.botDecks];
        const botDeck = botDecks[botIdx];
        if (!botDeck || botDeck.cardSequence.length === 0) {
          return { ...state, currentBot: nextBot };
        }
        const nextIndex = botDeck.currentCardIndex + 1;
        // If nextIndex is out of range, reshuffle and draw first card
        if (
          nextIndex >= botDeck.cardSequence.length ||
          nextIndex >= TOTAL_CARDS
        ) {
          // reshuffle and draw index 0
          botDecks[botIdx] = {
            ...botDeck,
            cardSequence: generateShuffledSequence(),
            currentCardIndex: 0,
            usedCards: [
              /* first card will be set below */
            ],
          };
          botDecks[botIdx].usedCards = [botDecks[botIdx].cardSequence[0]];
          return {
            ...state,
            botDecks,
            currentBot: nextBot,
          };
        }
        // Normal draw for next bot
        const newUsedCards = [
          ...botDeck.usedCards,
          botDeck.cardSequence[nextIndex],
        ];
        botDecks[botIdx] = {
          ...botDeck,
          currentCardIndex: nextIndex,
          usedCards: newUsedCards,
        };
        return {
          ...state,
          botDecks,
          currentBot: nextBot,
        };
      }

      // Shared mode: switch to next bot and draw from shared deck, reshuffle if exhausted
      const cardSequence = Array.isArray(state.cardSequence)
        ? state.cardSequence
        : [];
      const currentCardIndex =
        typeof state.currentCardIndex === "number"
          ? state.currentCardIndex
          : -1;
      const usedCards = Array.isArray(state.usedCards) ? state.usedCards : [];
      if (cardSequence.length === 0) {
        return state;
      }
      const nextIndex = currentCardIndex + 1;
      const nextBot =
        state.currentBot && state.botCount
          ? (state.currentBot % state.botCount) + 1
          : 1;
      if (nextIndex >= cardSequence.length || nextIndex >= TOTAL_CARDS) {
        // reshuffle and draw first card
        const newSequence = generateShuffledSequence();
        return {
          ...state,
          cardSequence: newSequence,
          currentCardIndex: 0,
          usedCards: [newSequence[0]],
          currentBot: nextBot,
        };
      }
      const newUsedCards = [...usedCards, cardSequence[nextIndex]];
      return {
        ...state,
        currentCardIndex: nextIndex,
        usedCards: newUsedCards,
        currentBot: nextBot,
      };
    }

    default:
      return state;
  }
}

// Provider component
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const contextValue: GameContextType = useMemo(
    () => ({
      state,
      drawCard: () => dispatch({ type: "DRAW_CARD" }),
      shuffleDeck: () => dispatch({ type: "SHUFFLE_DECK" }),
      resetGame: () => dispatch({ type: "RESET_GAME" }),
      newGame: () => dispatch({ type: "NEW_GAME" }),
      loadGame: (gameState: GameState) =>
        dispatch({ type: "LOAD_GAME", payload: gameState }),
      selectBots: (count: number) =>
        dispatch({ type: "SELECT_BOTS", payload: count }),
      switchBot: (botNumber: number) =>
        dispatch({ type: "SWITCH_BOT", payload: botNumber }),
      nextBot: () => dispatch({ type: "NEXT_BOT" }), // v0.3.3+ go to next bot
      nextBotAndDraw: () => dispatch({ type: "NEXT_BOT_AND_DRAW" }), // v0.3.3+ go to next bot and draw
      nextBotAndShuffleAndDraw: () =>
        dispatch({ type: "NEXT_BOT_AND_SHUFFLE_AND_DRAW" }), // v0.4.1 atomic
      getCurrentCard: () => {
        if (state.mode === "individual" && state.botDecks && state.currentBot) {
          const botIdx = state.currentBot - 1;
          const botDeck = state.botDecks[botIdx];
          if (!botDeck || botDeck.cardSequence.length === 0) return null;
          const idx = botDeck.currentCardIndex;
          if (idx < 0 || idx >= botDeck.cardSequence.length) return null;
          return botDeck.cardSequence[idx];
        }
        // shared mode
        const cardSequence = state.cardSequence ?? [];
        const currentCardIndex = state.currentCardIndex ?? -1;
        if (
          cardSequence.length === 0 ||
          currentCardIndex < 0 ||
          currentCardIndex >= cardSequence.length
        ) {
          return null;
        }
        return cardSequence[currentCardIndex];
      },
      isDeckExhausted: () => {
        if (state.mode === "individual" && state.botDecks && state.currentBot) {
          const botIdx = state.currentBot - 1;
          const botDeck = state.botDecks[botIdx];
          if (!botDeck) return true;
          return botDeck.currentCardIndex >= TOTAL_CARDS - 1;
        }
        return (state.currentCardIndex ?? -1) >= TOTAL_CARDS - 1;
      },
      getCardsRemaining: () => {
        if (state.mode === "individual" && state.botDecks && state.currentBot) {
          const botIdx = state.currentBot - 1;
          const botDeck = state.botDecks[botIdx];
          if (!botDeck) return 0;
          return Math.max(0, TOTAL_CARDS - (botDeck.currentCardIndex + 1));
        }
        return Math.max(0, TOTAL_CARDS - ((state.currentCardIndex ?? -1) + 1));
      },
    }),
    [state]
  );

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
}

// === HOOK ===

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
