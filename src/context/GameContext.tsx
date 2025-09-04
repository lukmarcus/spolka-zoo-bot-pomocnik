// Game Context - Spółka ZOO Bot Helper
// Manages bot card game state and actions

/* eslint-disable react-refresh/only-export-components */

import { createContext, useReducer, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import type { GameState, GameContextType } from "../types";
import { TOTAL_CARDS } from "../data/botCards";
import { loadAutoSavedGameState } from "../utils/gameStorage";

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
  | { type: "NEXT_BOT_AND_DRAW" }; // v0.3.3+ go to next bot and draw card

// Get initial state (with auto-save restore)
function getInitialState(): GameState {
  const autoSaved = loadAutoSavedGameState();
  if (autoSaved) {
    // Ensure botsSelected is set for auto-saved games
    return {
      ...autoSaved,
      botsSelected: autoSaved.botCount ? true : false,
    };
  }

  return {
    currentCardIndex: -1,
    cardSequence: [],
    usedCards: [],
    botCount: 1,
    currentBot: 1,
    botsSelected: false, // v0.3.0+ require bot selection for new games
  };
}

// Get clean state for new game
function getCleanState(): GameState {
  return {
    currentCardIndex: -1,
    cardSequence: [],
    usedCards: [],
    botCount: 1,
    currentBot: 1,
    botsSelected: false, // v0.3.0+ require bot selection
  };
}

// Initial game state
const initialState: GameState = getInitialState();

// Game reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "NEW_GAME": {
      // v0.3.0+ Don't generate sequence until bots are selected
      const cleanState = getCleanState();
      return {
        ...cleanState,
        currentCardIndex: -1, // Start before first card
      };
    }

    case "DRAW_CARD": {
      // Game is started if cardSequence is not empty
      if (state.cardSequence.length === 0) {
        return state;
      }

      const nextIndex = state.currentCardIndex + 1;

      // Check if trying to draw beyond deck
      if (nextIndex >= TOTAL_CARDS) {
        return state; // Don't auto-shuffle, let user manually shuffle
      }

      const newUsedCards = [...state.usedCards, state.cardSequence[nextIndex]];

      return {
        ...state,
        currentCardIndex: nextIndex,
        usedCards: newUsedCards,
      };
    }

    case "SHUFFLE_DECK": {
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

    case "SELECT_BOTS": {
      const shuffledSequence = generateShuffledSequence();
      return {
        ...state,
        botCount: action.payload,
        currentBot: 1, // Start with first bot
        botsSelected: true,
        cardSequence: shuffledSequence,
        currentCardIndex: -1, // Ready to draw first card
      };
    }

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
      // v0.3.3+ Go to next bot and draw card for that bot
      if (state.cardSequence.length === 0) {
        return state;
      }

      const nextIndex = state.currentCardIndex + 1;

      // Check if trying to draw beyond deck
      if (nextIndex >= TOTAL_CARDS) {
        return state; // Don't auto-shuffle, let user manually shuffle
      }

      const nextBot =
        state.currentBot && state.botCount
          ? (state.currentBot % state.botCount) + 1
          : 1;

      const newUsedCards = [...state.usedCards, state.cardSequence[nextIndex]];

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
      getCurrentCard: () => {
        // Game is started if cardSequence is not empty and currentCardIndex is valid
        if (
          state.cardSequence.length === 0 ||
          state.currentCardIndex < 0 ||
          state.currentCardIndex >= state.cardSequence.length
        ) {
          return null;
        }
        return state.cardSequence[state.currentCardIndex];
      },
      isDeckExhausted: () => state.currentCardIndex >= TOTAL_CARDS - 1,
      getCardsRemaining: () =>
        Math.max(0, TOTAL_CARDS - (state.currentCardIndex + 1)),
    }),
    [state]
  );

  // Auto-save temporarily disabled to debug infinite re-render issue
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     autoSaveGameState(state);
  //   }, 300); // Debounce by 300ms

  //   return () => clearTimeout(timeoutId);
  // }, [state]);

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
