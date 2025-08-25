// Game Context - Spółka ZOO Bot Helper
// Manages bot card game state and actions

/* eslint-disable react-refresh/only-export-components */

import { createContext, useReducer, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { GameState, GameContextType } from "../types";
import { TOTAL_CARDS } from "../data/botCards";
import {
  autoSaveGameState,
  loadAutoSavedGameState,
} from "../utils/gameStorage";

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
  | { type: "LOAD_GAME"; payload: GameState };

// Get initial state (with auto-save restore)
function getInitialState(): GameState {
  const autoSaved = loadAutoSavedGameState();
  if (autoSaved) {
    return autoSaved;
  }

  return {
    currentCardIndex: -1,
    cardSequence: [],
    usedCards: [],
    botCount: 1,
    currentBot: 1,
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
  };
}

// Initial game state
const initialState: GameState = getInitialState();

// Game reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "NEW_GAME": {
      const shuffledSequence = generateShuffledSequence();
      const cleanState = getCleanState();
      return {
        ...cleanState,
        cardSequence: shuffledSequence,
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

  const contextValue: GameContextType = {
    state,
    drawCard: () => dispatch({ type: "DRAW_CARD" }),
    shuffleDeck: () => dispatch({ type: "SHUFFLE_DECK" }),
    resetGame: () => dispatch({ type: "RESET_GAME" }),
    newGame: () => dispatch({ type: "NEW_GAME" }),
    loadGame: (gameState: GameState) =>
      dispatch({ type: "LOAD_GAME", payload: gameState }),
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
  };

  // Auto-save game state when it changes
  useEffect(() => {
    autoSaveGameState(state);
  }, [state]);

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
