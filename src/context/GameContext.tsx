// Game Context - Spółka ZOO Bot Helper
// Manages bot card game state and actions

/* eslint-disable react-refresh/only-export-components */

import { createContext, useReducer, useContext } from "react";
import type { ReactNode } from "react";
import type { GameState, GameContextType } from "../types";
import { TOTAL_CARDS } from "../data/botCards";

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
  | { type: "NEW_GAME" };

// Initial game state
const initialState: GameState = {
  currentCardIndex: 0,
  cardSequence: [],
  usedCards: [],
  shuffleCount: 0,
  gameStarted: false,
};

// Game reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "NEW_GAME": {
      const shuffledSequence = generateShuffledSequence();
      return {
        ...initialState,
        cardSequence: shuffledSequence,
        gameStarted: true,
      };
    }

    case "DRAW_CARD": {
      if (!state.gameStarted || state.currentCardIndex >= TOTAL_CARDS) {
        return state;
      }

      const newUsedCards = [
        ...state.usedCards,
        state.cardSequence[state.currentCardIndex],
      ];
      const newIndex = state.currentCardIndex + 1;

      // Check if deck is exhausted
      if (newIndex >= TOTAL_CARDS) {
        // Auto-shuffle for next round
        return {
          ...state,
          currentCardIndex: 0,
          cardSequence: generateShuffledSequence(),
          usedCards: [],
          shuffleCount: state.shuffleCount + 1,
        };
      }

      return {
        ...state,
        currentCardIndex: newIndex,
        usedCards: newUsedCards,
      };
    }

    case "SHUFFLE_DECK": {
      return {
        ...state,
        currentCardIndex: 0,
        cardSequence: generateShuffledSequence(),
        usedCards: [],
        shuffleCount: state.shuffleCount + 1,
      };
    }

    case "RESET_GAME":
      return initialState;

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
    getCurrentCard: () => {
      if (
        !state.gameStarted ||
        state.currentCardIndex >= state.cardSequence.length
      ) {
        return null;
      }
      return state.cardSequence[state.currentCardIndex];
    },
    isGameStarted: () => state.gameStarted,
    isDeckExhausted: () => state.currentCardIndex >= TOTAL_CARDS,
    getCardsRemaining: () => Math.max(0, TOTAL_CARDS - state.currentCardIndex),
  };

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
