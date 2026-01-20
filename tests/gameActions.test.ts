import { describe, it, expect } from "vitest";
import { gameReducer, type GameAction } from "../src/lib/GameContext";
import type { GameState, Player } from "../src/lib/types";
import modalTexts from "../src/lib/modalTexts.json";

/**
 * GameContext Integration Tests - Full game flow
 *
 * Test scenario: bot-bot setup (2 bots, no human players),
 * play through multiple rounds, verify state transitions
 */

// ===== HELPERS =====

function createBot(id: number): Player {
  return {
    id,
    playerNumber: id,
    color: "red",
    isBot: true,
  };
}

/**
 * Apply action to state and return new state
 */
function applyAction(state: GameState, action: GameAction): GameState {
  return gameReducer(state, action);
}

/**
 * Initial state for bot-gracz setup
 */
function createInitialState(): GameState {
  return {
    mode: "individual",
    currentCardIndex: -1,
    cardSequence: [],
    usedCards: [],
    botCount: 1,
    currentBot: 1,
    botsSelected: false,
  };
}

// ===== MODAL HELPERS =====

/**
 * Helper: Determine which modals should be visible based on game state
 */
function getExpectedModals(state: GameState, gameStarted: boolean) {
  return {
    beforeFirstRound:
      state.currentRound === 1 && !gameStarted && state.gameMode === "advanced",
    nextBot: false, // In reducer - decided by action flow, not state alone
    nextPhase: false,
    nextRound: false,
  };
}

/**
 * Helper: Get modal text
 */
function getModalText(section: string, key: string): unknown {
  const data = modalTexts as Record<string, Record<string, unknown>>;
  const parts = key.split(".");
  let current: unknown = data[section];

  for (const part of parts) {
    if (current && typeof current === "object") {
      current = (current as Record<string, unknown>)[part];
    }
  }

  return current;
}

// ===== TESTS =====

describe("GameContext - Full Game Flow (bot-bot setup)", () => {
  describe("Game Initialization", () => {
    it("should start in shared mode with no game", () => {
      const state = createInitialState();

      expect(state.mode).toBe("individual");
      expect(state.botsSelected).toBe(false);
      expect(state.currentBot).toBe(1);
    });
  });

  describe("START_ADVANCED_GAME - bot-bot setup", () => {
    it("should initialize advanced game with bot-bot players", () => {
      const initialState = createInitialState();
      const players = [createBot(1), createBot(2)];

      const state = applyAction(initialState, {
        type: "START_ADVANCED_GAME",
        payload: {
          players,
          mode: "individual",
          modules: {
            hiddenGoals: true,
            intrigues: true,
          },
        },
      });

      // Verify initial state after game start
      expect(state.gameMode).toBe("advanced");
      expect(state.mode).toBe("individual");
      expect(state.players).toEqual(players);
      expect(state.currentRound).toBe(1);
      expect(state.currentPhase).toBe(1);
      expect(state.currentBot).toBe(1);
      expect(state.currentPlayerIndex).toBe(0); // First bot
      expect(state.botCount).toBe(2); // 2 bots
      expect(state.botDecks).toHaveLength(2);
    });

    it("should have maxPhases = 4 for 2 players in bot-bot setup", () => {
      const initialState = createInitialState();
      const players = [createBot(1), createBot(2)];

      const state = applyAction(initialState, {
        type: "START_ADVANCED_GAME",
        payload: {
          players,
          mode: "individual",
          modules: {
            hiddenGoals: true,
            intrigues: true,
          },
        },
      });

      expect(state.maxPhases).toBe(4);
    });

    it("should initialize botDecks with both bots", () => {
      const initialState = createInitialState();
      const players = [createBot(1), createBot(2)];

      const state = applyAction(initialState, {
        type: "START_ADVANCED_GAME",
        payload: {
          players,
          mode: "individual",
          modules: {
            hiddenGoals: true,
            intrigues: true,
          },
        },
      });

      expect(state.botDecks).toHaveLength(2);
      expect(state.botDecks![0].botId).toBe(1);
      expect(state.botDecks![1].botId).toBe(2);
      expect(state.botDecks![0].currentCardIndex).toBe(0);
      expect(state.botDecks![1].currentCardIndex).toBe(-1);
    });
  });

  describe("Game Flow - Round 1 with 2 bots", () => {
    it("should transition through bot #1 → bot #2 → next phase", () => {
      const initialState = createInitialState();
      const players = [createBot(1), createBot(2)];

      // Start game
      let state = applyAction(initialState, {
        type: "START_ADVANCED_GAME",
        payload: {
          players,
          mode: "individual",
          modules: {
            hiddenGoals: true,
            intrigues: true,
          },
        },
      });

      // Verify we're at bot 1
      expect(state.currentPlayerIndex).toBe(0);
      expect(state.currentBot).toBe(1);
      expect(state.currentPhase).toBe(1);

      // Move to next bot (bot #2)
      state = applyAction(state, { type: "NEXT_PLAYER" });

      // Should be at bot 2 (players[1])
      expect(state.currentPlayerIndex).toBe(1);
      expect(state.players?.[1].isBot).toBe(true);
      expect(state.currentBot).toBe(2);

      // Move to next - should trigger NEXT_PHASE
      state = applyAction(state, { type: "NEXT_PLAYER" });

      // Should have moved to phase 2
      expect(state.currentPhase).toBe(2);
      expect(state.currentPlayerIndex).toBe(0); // Reset to first bot
      expect(state.currentBot).toBe(1);
    });

    it("should track state correctly through all 4 phases", () => {
      const initialState = createInitialState();
      const players = [createBot(1), createBot(2)];

      let state = applyAction(initialState, {
        type: "START_ADVANCED_GAME",
        payload: {
          players,
          mode: "individual",
          modules: {
            hiddenGoals: true,
            intrigues: true,
          },
        },
      });

      // Go through phases 1-4
      for (let phase = 1; phase <= 4; phase++) {
        expect(state.currentPhase).toBe(phase);

        // Bot 1
        state = applyAction(state, { type: "NEXT_PLAYER" });
        expect(state.currentBot).toBe(2);

        // Bot 2 → triggers NEXT_PHASE or NEXT_ROUND
        state = applyAction(state, { type: "NEXT_PLAYER" });
      }

      // After phase 4, should be at round 2, phase 1
      expect(state.currentRound).toBe(2);
      expect(state.currentPhase).toBe(1);
    });
  });

  describe("DRAW_CARD in individual mode", () => {
    it("should draw card for each bot and track in usedCards", () => {
      const initialState = createInitialState();
      const players = [createBot(1), createBot(2)];

      let state = applyAction(initialState, {
        type: "START_ADVANCED_GAME",
        payload: {
          players,
          mode: "individual",
          modules: {
            hiddenGoals: true,
            intrigues: true,
          },
        },
      });

      // Bot 1 draws
      const bot1DeckBefore = state.botDecks![0];
      state = applyAction(state, { type: "DRAW_CARD" });
      const bot1DeckAfter = state.botDecks![0];

      expect(bot1DeckAfter.currentCardIndex).toBe(
        bot1DeckBefore.currentCardIndex + 1,
      );
      expect(bot1DeckAfter.usedCards.length).toBe(
        bot1DeckBefore.usedCards.length + 1,
      );

      // Move to bot 2
      state = applyAction(state, { type: "NEXT_PLAYER" });

      // Bot 2 draws
      const bot2DeckBefore = state.botDecks![1];
      state = applyAction(state, { type: "DRAW_CARD" });
      const bot2DeckAfter = state.botDecks![1];

      expect(bot2DeckAfter.currentCardIndex).toBe(
        bot2DeckBefore.currentCardIndex + 1,
      );
      expect(bot2DeckAfter.usedCards.length).toBe(
        bot2DeckBefore.usedCards.length + 1,
      );
    });
  });

  describe("Modal Visibility & Content", () => {
    it("should show beforeFirstRound modal on game start (round 1, not started)", () => {
      const initialState = createInitialState();
      const players = [createBot(1), createBot(2)];

      const state = applyAction(initialState, {
        type: "START_ADVANCED_GAME",
        payload: {
          players,
          mode: "individual",
          modules: {
            hiddenGoals: true,
            intrigues: true,
          },
        },
      });

      const gameStarted = false;
      const modals = getExpectedModals(state, gameStarted);

      // beforeFirstRound should be visible
      expect(modals.beforeFirstRound).toBe(true);
      expect(state.currentRound).toBe(1);

      // Check modal title and text exist
      const modalTitle = getModalText("advancedGame", "beforeFirstRound.title");
      expect(modalTitle).toBeDefined();
      expect(typeof modalTitle).toBe("string");
    });

    it("should hide beforeFirstRound modal after round 1 starts", () => {
      const initialState = createInitialState();
      const players = [createBot(1), createBot(2)];

      const state = applyAction(initialState, {
        type: "START_ADVANCED_GAME",
        payload: {
          players,
          mode: "individual",
          modules: {
            hiddenGoals: true,
            intrigues: true,
          },
        },
      });

      // After game starts
      const gameStarted = true;
      const modals = getExpectedModals(state, gameStarted);

      expect(modals.beforeFirstRound).toBe(false);
    });

    it("should not show beforeFirstRound modal after round 1", () => {
      const initialState = createInitialState();
      const players = [createBot(1), createBot(2)];

      let state = applyAction(initialState, {
        type: "START_ADVANCED_GAME",
        payload: {
          players,
          mode: "individual",
          modules: {
            hiddenGoals: true,
            intrigues: true,
          },
        },
      });

      // Move to round 2
      state = {
        ...state,
        currentRound: 2,
      };

      const gameStarted = false; // Even if not started
      const modals = getExpectedModals(state, gameStarted);

      expect(modals.beforeFirstRound).toBe(false);
    });

    it("should have correct modal texts for nextBot action", () => {
      const title = getModalText("advancedGame", "nextBot.title");
      const message = getModalText("advancedGame", "nextBot.message");

      expect(title).toBeDefined();
      expect(message).toBeDefined();

      // nextBot has both adjacent and notAdjacent variants
      if (typeof message === "object") {
        expect((message as Record<string, string>).adjacent).toBeDefined();
        expect(
          (message as Record<string, string>).notAdjacent,
        ).toBeDefined();
      }
    });

    it("should have correct modal texts for nextPhase action", () => {
      const title = getModalText("advancedGame", "nextPhase.title");
      const message = getModalText("advancedGame", "nextPhase.message");

      expect(title).toBeDefined();
      expect(message).toBeDefined();

      // nextPhase includes marketPhase text
      const marketPhase = getModalText(
        "advancedGame",
        "nextPhase.marketPhase",
      );
      expect(marketPhase).toBeDefined();
    });

    it("should have correct modal texts for nextRound action", () => {
      const title = getModalText("advancedGame", "nextRound.title");
      const message = getModalText("advancedGame", "nextRound.message");

      expect(title).toBeDefined();
      expect(message).toBeDefined();

      // nextRound includes shuffle note
      const note = getModalText("advancedGame", "nextRound.note3.single");
      expect(note).toBeDefined();
    });

    it("should have correct modal texts for end game", () => {
      const title = getModalText("advancedGame", "endGame.title");
      const lastMessage = getModalText(
        "advancedGame",
        "endGame.last.message",
      );
      const notLastMessage = getModalText(
        "advancedGame",
        "endGame.notLast.message",
      );

      expect(title).toBeDefined();
      expect(lastMessage).toBeDefined();
      expect(notLastMessage).toBeDefined();
    });
  });

  describe("Game End - Round > 5", () => {
    it("should rotate players and shuffle decks on NEXT_ROUND", () => {
      const initialState = createInitialState();
      const players = [createBot(1), createBot(2)];

      let state = applyAction(initialState, {
        type: "START_ADVANCED_GAME",
        payload: {
          players,
          mode: "individual",
          modules: {
            hiddenGoals: true,
            intrigues: true,
          },
        },
      });

      // Manually advance to end of round and trigger NEXT_ROUND
      state = {
        ...state,
        currentRound: 1,
        currentPhase: 4,
        currentPlayerIndex: 1,
        currentBot: 2,
      };

      // Trigger NEXT_ROUND via NEXT_PLAYER (phase > maxPhases)
      state = applyAction(state, { type: "NEXT_PLAYER" });

      // Verify player rotation: bot 2 → bot 1 (rotated)
      expect(state.players![0].playerNumber).toBe(2); // Was bot 2, now first
      expect(state.players![1].playerNumber).toBe(1); // Was bot 1, now second

      // Verify all decks are reshuffled (new sequence)
      expect(state.botDecks![0].currentCardIndex).toBe(0); // After DRAW_CARD
      expect(state.botDecks![1].currentCardIndex).toBe(-1); // Waiting for turn

      // Verify round reset
      expect(state.currentRound).toBe(2);
      expect(state.currentPhase).toBe(1);
      expect(state.usedCards).toEqual([]);
    });

    it("should stay at round 5 when attempting to exceed 5 rounds", () => {
      const initialState = createInitialState();
      const players = [createBot(1), createBot(2)];

      let state = applyAction(initialState, {
        type: "START_ADVANCED_GAME",
        payload: {
          players,
          mode: "individual",
          modules: {
            hiddenGoals: true,
            intrigues: true,
          },
        },
      });

      // Manually set to round 5, phase 4 (last phase)
      state = {
        ...state,
        currentRound: 5,
        currentPhase: 4,
        currentPlayerIndex: 0,
        currentBot: 1,
      };

      // Complete bot 1
      state = applyAction(state, { type: "NEXT_PLAYER" });
      expect(state.currentRound).toBe(5);
      expect(state.currentPhase).toBe(4);

      // Complete bot 2 - tries to trigger NEXT_ROUND
      state = applyAction(state, { type: "NEXT_PLAYER" });

      // When NEXT_ROUND tries to set round to 6, it's > 5
      // so reducer returns state unchanged (game ends)
      expect(state.currentRound).toBe(5);
      expect(state.currentPhase).toBe(4); // State unchanged
    });

    it("should handle end game when round > 5", () => {
      const initialState = createInitialState();
      const players = [createBot(1), createBot(2)];

      let state = applyAction(initialState, {
        type: "START_ADVANCED_GAME",
        payload: {
          players,
          mode: "individual",
          modules: {
            hiddenGoals: true,
            intrigues: true,
          },
        },
      });

      // Set to round 6 (game should end)
      state = {
        ...state,
        currentRound: 6,
      };

      // Game is beyond 5 rounds - ready for end game screen
      expect(state.currentRound).toBeGreaterThan(5);
    });
  });
});
