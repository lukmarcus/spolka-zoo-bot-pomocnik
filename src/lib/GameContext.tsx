// Game Context - Spolka ZOO Bot Helper

/* eslint-disable react-refresh/only-export-components */

import { createContext, useReducer, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import type {
  BotDeck,
  GameState,
  GameContextType,
  Player,
  GameModules,
  BotCard,
} from "./types";
import { TOTAL_CARDS, BOT_CARDS } from "./botCards";
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
  | { type: "SELECT_BOTS"; payload: number }
  | { type: "SWITCH_BOT"; payload: number }
  | { type: "NEXT_BOT" }
  | { type: "NEXT_BOT_AND_DRAW" }
  | { type: "NEXT_BOT_AND_SHUFFLE_AND_DRAW" }
  | { type: "END_ROUND"; payload: number }
  | {
      type: "START_ADVANCED_GAME";
      payload: {
        players: Player[];
        mode: "shared" | "individual";
        modules: GameModules;
      };
    }
  | { type: "NEXT_PLAYER" }
  | { type: "NEXT_PHASE" }
  | { type: "NEXT_ROUND" };

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
      // Shared/individual mode preserving botCount
      return getCleanState(state.mode, state.botCount || 1);
    }
    case "SELECT_BOTS": {
      if (state.mode === "individual") {
        return {
          ...state,
          botCount: action.payload,
          botDecks: generateBotDecks(action.payload),
          currentBot: 1,
          botsSelected: true,
        };
      }
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
        // Get current bot's deck
        const botIdx = state.currentBot - 1;
        const botDecks = [...state.botDecks];
        const botDeck = botDecks[botIdx];
        if (!botDeck || botDeck.cardSequence.length === 0) return state;
        const nextIndex = botDeck.currentCardIndex + 1;

        // Jeśli osiągnęliśmy koniec talii, tasuj
        if (
          nextIndex >= botDeck.cardSequence.length ||
          nextIndex >= TOTAL_CARDS
        ) {
          botDecks[botIdx] = {
            ...botDeck,
            cardSequence: generateShuffledSequence(),
            currentCardIndex: -1,
            usedCards: [],
          };
          // Spróbuj dobrać kartę z nowej talii
          return gameReducer({ ...state, botDecks }, { type: "DRAW_CARD" });
        }

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

      // Jeśli osiągnęliśmy koniec talii, tasuj
      if (nextIndex >= cardSequence.length || nextIndex >= TOTAL_CARDS) {
        const newState = {
          ...state,
          currentCardIndex: -1,
          cardSequence: generateShuffledSequence(),
          usedCards: [],
        };
        // Spróbuj dobrać kartę z nowej talii
        return gameReducer(newState, { type: "DRAW_CARD" });
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
          currentCardIndex: -1,
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
        currentCardIndex: -1,
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

    case "END_ROUND": {
      const startingBot = action.payload;

      if (state.mode === "individual" && state.botDecks) {
        // Reshuffle all bot decks
        const botDecks = state.botDecks.map((deck) => ({
          ...deck,
          cardSequence: generateShuffledSequence(),
          currentCardIndex: -1,
          usedCards: [] as number[],
        }));

        // Switch to starting bot and draw first card
        const botIdx = startingBot - 1;
        const startingDeck = botDecks[botIdx];
        if (startingDeck && startingDeck.cardSequence.length > 0) {
          botDecks[botIdx] = {
            ...startingDeck,
            currentCardIndex: 0,
            usedCards: [startingDeck.cardSequence[0]] as number[],
          };
        }

        return {
          ...state,
          currentBot: startingBot,
          botDecks,
        };
      }

      // Shared mode - reshuffle and draw first card
      const newSequence = generateShuffledSequence();
      return {
        ...state,
        currentBot: startingBot,
        cardSequence: newSequence,
        currentCardIndex: 0,
        usedCards: [newSequence[0]],
      };
    }

    case "NEXT_BOT": {
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

    case "START_ADVANCED_GAME": {
      const { players, mode, modules } = action.payload;
      const botPlayers = players.filter((p) => p.isBot);
      const botCount = botPlayers.length;
      const maxPhases = players.length === 2 ? 4 : 3;

      if (mode === "individual") {
        // Znajdź pierwszego bota
        const firstBotIndex = players.findIndex((p) => p.isBot);
        const startingBotIndex = firstBotIndex !== -1 ? firstBotIndex : 0;

        const botDecks = generateBotDecks(botCount);
        // Wylosuj pierwszą kartę dla pierwszego bota
        botDecks[0] = {
          ...botDecks[0],
          currentCardIndex: 0,
        };

        return {
          gameMode: "advanced",
          mode: "individual",
          modules,
          players,
          currentPlayerIndex: startingBotIndex,
          currentRound: 1,
          currentPhase: 1,
          maxPhases,
          botDecks,
          botCount,
          currentBot: 1,
          botsSelected: true,
        };
      }

      // Tryb shared - też reset na pierwszego bota
      const firstBotIndex = players.findIndex((p) => p.isBot);
      const startingBotIndex = firstBotIndex !== -1 ? firstBotIndex : 0;

      return {
        gameMode: "advanced",
        mode: "shared",
        modules,
        players,
        currentPlayerIndex: startingBotIndex,
        currentRound: 1,
        currentPhase: 1,
        maxPhases,
        cardSequence: generateShuffledSequence(),
        currentCardIndex: 0, // Wylosuj pierwszą kartę
        usedCards: [],
        botCount,
        currentBot: 1,
        botsSelected: true,
      };
    }

    case "NEXT_PLAYER": {
      if (state.gameMode !== "advanced" || !state.players) return state;

      // Znajdź kolejnego bota (omijając ludzi)
      let nextBotIndex = state.currentPlayerIndex! + 1;
      while (nextBotIndex < state.players.length) {
        if (state.players[nextBotIndex].isBot) {
          break;
        }
        nextBotIndex++;
      }

      // Jeśli nie ma więcej botów, przejdź do następnej fazy
      if (nextBotIndex >= state.players.length) {
        return gameReducer(state, { type: "NEXT_PHASE" });
      }

      // Zaktualizuj currentBot dla trybu individual - to indeks +1 (1-based)
      const nextBot = nextBotIndex + 1;
      const newState = {
        ...state,
        currentPlayerIndex: nextBotIndex,
        currentBot: nextBot,
      };

      // Dobrać kartę dla nowego gracza
      return gameReducer(newState, { type: "DRAW_CARD" });
    }

    case "NEXT_PHASE": {
      if (state.gameMode !== "advanced" || !state.players) return state;

      const nextPhase = state.currentPhase! + 1;

      // Jeśli przekroczyliśmy maksymalną liczbę faz, przejdź do następnej rundy
      if (nextPhase > state.maxPhases!) {
        return gameReducer(state, { type: "NEXT_ROUND" });
      }

      // Znajdź pierwszego bota
      const firstBotIndex = state.players.findIndex((p) => p.isBot);
      const resetPlayerIndex = firstBotIndex !== -1 ? firstBotIndex : 0;
      const nextBot = resetPlayerIndex + 1;

      const newState = {
        ...state,
        currentPhase: nextPhase,
        currentPlayerIndex: resetPlayerIndex,
        currentBot: nextBot,
      };

      // Dobrać kartę dla nowego gracza
      return gameReducer(newState, { type: "DRAW_CARD" });
    }

    case "NEXT_ROUND": {
      if (state.gameMode !== "advanced" || !state.players) return state;

      const nextRound = state.currentRound! + 1;

      // If we exceed 5 rounds, the game ends
      if (nextRound > 5) {
        // TODO: Transition to game end screen
        return state;
      }

      // Rotate players: first player moves to the end
      const rotatedPlayers = [...state.players.slice(1), state.players[0]];

      // New starting player is at index 0 (after rotation)
      const newStartingPlayer = 0;

      // Find the first bot from the starting player
      let firstBotInRound = newStartingPlayer;
      while (firstBotInRound < rotatedPlayers.length) {
        if (rotatedPlayers[firstBotInRound].isBot) break;
        firstBotInRound++;
      }
      // If not found, search from the beginning
      if (firstBotInRound >= rotatedPlayers.length) {
        firstBotInRound = rotatedPlayers.findIndex((p) => p.isBot);
      }
      const nextBot = firstBotInRound >= 0 ? firstBotInRound + 1 : 1;

      // Shuffle the deck
      let newBotDecks = state.botDecks;
      let newCardSequence = state.cardSequence;
      let newCurrentCardIndex = state.currentCardIndex;

      if (state.mode === "individual" && state.botDecks) {
        // In individual mode, shuffle all bot decks
        newBotDecks = state.botDecks.map((deck) => ({
          ...deck,
          cardSequence: generateShuffledSequence(),
          currentCardIndex: -1,
          usedCards: [],
        }));
      } else if (state.mode === "shared") {
        // In shared mode, shuffle the common deck
        newCardSequence = generateShuffledSequence();
        newCurrentCardIndex = -1;
      }

      const newState = {
        ...state,
        currentRound: nextRound,
        currentPhase: 1,
        currentPlayerIndex: newStartingPlayer,
        players: rotatedPlayers,
        currentBot: nextBot,
        botDecks: newBotDecks,
        cardSequence: newCardSequence,
        currentCardIndex: newCurrentCardIndex,
        usedCards: [],
      };

      // Draw a card for the first bot of the round
      return gameReducer(newState, { type: "DRAW_CARD" });
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
      nextBot: () => dispatch({ type: "NEXT_BOT" }),
      nextBotAndDraw: () => dispatch({ type: "NEXT_BOT_AND_DRAW" }),
      nextBotAndShuffleAndDraw: () =>
        dispatch({ type: "NEXT_BOT_AND_SHUFFLE_AND_DRAW" }),
      endRound: (startingBot: number) =>
        dispatch({ type: "END_ROUND", payload: startingBot }),
      startAdvancedGame: (
        players: Player[],
        mode: "shared" | "individual",
        modules: GameModules
      ) =>
        dispatch({
          type: "START_ADVANCED_GAME",
          payload: { players, mode, modules },
        }),
      nextPlayer: () => dispatch({ type: "NEXT_PLAYER" }),
      nextPhase: () => dispatch({ type: "NEXT_PHASE" }),
      nextRound: () => dispatch({ type: "NEXT_ROUND" }),
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
      getCardById: (cardId: number): BotCard | null => {
        const card = BOT_CARDS.find((c) => c.id === cardId);
        return card || null;
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
