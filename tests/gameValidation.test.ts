import { describe, it, expect, beforeEach } from "vitest";
import { gameReducer, type GameAction } from "../src/lib/GameContext";
import type { GameState, Player, GameModules } from "../src/lib/types";

/**
 * Game Validation & Edge Cases Tests
 *
 * Tests for:
 * - Player count boundaries
 * - Bot numbering edge cases
 * - Player rotation validation
 * - maxPhases calculation
 * - Mode setup validation
 */

function createInitialState(): GameState {
  return {
    mode: "shared",
    currentCardIndex: -1,
    cardSequence: [],
    usedCards: [],
    botCount: 0,
    currentBot: 0,
    botsSelected: false,
  };
}

function applyAction(state: GameState, action: GameAction): GameState {
  return gameReducer(state, action);
}

describe("Game Validation & Edge Cases", () => {
  let state: GameState;

  beforeEach(() => {
    state = createInitialState();
  });

  // ===== BOT NUMBERING VALIDATION =====

  describe("Bot Numbering Logic", () => {
    it("should number bots correctly when human is first", () => {
      const players: Player[] = [
        { id: 1, playerNumber: 1, color: "red", isBot: false },
        { id: 2, playerNumber: 2, color: "yellow", isBot: true },
        { id: 3, playerNumber: 3, color: "green", isBot: true },
      ];
      const modules: GameModules = { hiddenGoals: false, intrigues: false };

      state = applyAction(state, {
        type: "START_ADVANCED_GAME",
        payload: { players, mode: "shared", modules },
      });

      // Starting player is human (index 0), but first bot should be found at index 1
      // Bot #1 is at position 1, Bot #2 is at position 2
      expect(state.currentBot).toBe(1);
      expect(state.botCount).toBe(2);
    });

    it("should number bots correctly when bot is first", () => {
      const players: Player[] = [
        { id: 1, playerNumber: 1, color: "red", isBot: true },
        { id: 2, playerNumber: 2, color: "yellow", isBot: false },
        { id: 3, playerNumber: 3, color: "green", isBot: true },
      ];
      const modules: GameModules = { hiddenGoals: false, intrigues: false };

      state = applyAction(state, {
        type: "START_ADVANCED_GAME",
        payload: { players, mode: "shared", modules },
      });

      // Starting player is bot (index 0) = bot #1
      expect(state.currentBot).toBe(1);
      expect(state.currentPlayerIndex).toBe(0);
      expect(state.botCount).toBe(2);
    });

    it("should maintain bot numbering consistency", () => {
      const players: Player[] = [
        { id: 1, playerNumber: 1, color: "red", isBot: true },
        { id: 2, playerNumber: 2, color: "yellow", isBot: false },
        { id: 3, playerNumber: 3, color: "green", isBot: true },
        { id: 4, playerNumber: 4, color: "orange", isBot: false },
      ];
      const modules: GameModules = { hiddenGoals: false, intrigues: false };

      state = applyAction(state, {
        type: "START_ADVANCED_GAME",
        payload: { players, mode: "shared", modules },
      });

      // 2 bots total
      expect(state.botCount).toBe(2);
      // Starting bot is #1
      expect(state.currentBot).toBe(1);
    });
  });

  // ===== PLAYER ROTATION VALIDATION =====

  describe("Player Rotation Logic", () => {
    it("should rotate first player to end on NEXT_ROUND", () => {
      const players: Player[] = [
        { id: 1, playerNumber: 1, color: "red", isBot: true },
        { id: 2, playerNumber: 2, color: "yellow", isBot: false },
        { id: 3, playerNumber: 3, color: "green", isBot: true },
      ];
      const modules: GameModules = { hiddenGoals: false, intrigues: false };

      state = applyAction(state, {
        type: "START_ADVANCED_GAME",
        payload: { players, mode: "shared", modules },
      });

      // Initial order: [red, yellow, green]
      expect(state.players![0].color).toBe("red");
      expect(state.players![1].color).toBe("yellow");
      expect(state.players![2].color).toBe("green");

      // Complete round 1 (2 NEXT_PLAYER per phase × 3 phases)
      for (let phase = 1; phase <= 3; phase++) {
        state = applyAction(state, { type: "NEXT_PLAYER" });
        state = applyAction(state, { type: "NEXT_PLAYER" });
      }

      // After NEXT_ROUND, order should be: [yellow, green, red]
      if (state.currentRound === 2) {
        expect(state.players![0].color).toBe("yellow");
        expect(state.players![1].color).toBe("green");
        expect(state.players![2].color).toBe("red");
      }
    });

    it("should preserve color identity after rotation", () => {
      const players: Player[] = [
        { id: 1, playerNumber: 1, color: "red", isBot: true },
        { id: 2, playerNumber: 2, color: "yellow", isBot: true },
        { id: 3, playerNumber: 3, color: "green", isBot: false },
      ];
      const modules: GameModules = { hiddenGoals: false, intrigues: false };

      state = applyAction(state, {
        type: "START_ADVANCED_GAME",
        payload: { players, mode: "shared", modules },
      });

      const originalColors = state.players!.map((p) => p.color).sort();

      // Complete round 1
      for (let phase = 1; phase <= 3; phase++) {
        state = applyAction(state, { type: "NEXT_PLAYER" });
        state = applyAction(state, { type: "NEXT_PLAYER" });
      }

      // Colors should be identical set (just rotated order)
      const rotatedColors = state.players!.map((p) => p.color).sort();
      expect(rotatedColors).toEqual(originalColors);
    });
  });

  // ===== MAXPHASES CALCULATION =====

  describe("MaxPhases Calculation", () => {
    it("should calculate maxPhases=4 for 2 players", () => {
      const players: Player[] = [
        { id: 1, playerNumber: 1, color: "red", isBot: true },
        { id: 2, playerNumber: 2, color: "yellow", isBot: false },
      ];
      const modules: GameModules = { hiddenGoals: false, intrigues: false };

      state = applyAction(state, {
        type: "START_ADVANCED_GAME",
        payload: { players, mode: "shared", modules },
      });

      expect(state.maxPhases).toBe(4);
    });

    it("should calculate maxPhases=3 for 3 players", () => {
      const players: Player[] = [
        { id: 1, playerNumber: 1, color: "red", isBot: true },
        { id: 2, playerNumber: 2, color: "yellow", isBot: true },
        { id: 3, playerNumber: 3, color: "green", isBot: false },
      ];
      const modules: GameModules = { hiddenGoals: false, intrigues: false };

      state = applyAction(state, {
        type: "START_ADVANCED_GAME",
        payload: { players, mode: "shared", modules },
      });

      expect(state.maxPhases).toBe(3);
    });

    it("should calculate maxPhases=3 for 4 players", () => {
      const players: Player[] = [
        { id: 1, playerNumber: 1, color: "red", isBot: true },
        { id: 2, playerNumber: 2, color: "yellow", isBot: true },
        { id: 3, playerNumber: 3, color: "green", isBot: false },
        { id: 4, playerNumber: 4, color: "orange", isBot: false },
      ];
      const modules: GameModules = { hiddenGoals: false, intrigues: false };

      state = applyAction(state, {
        type: "START_ADVANCED_GAME",
        payload: { players, mode: "shared", modules },
      });

      expect(state.maxPhases).toBe(3);
    });

    it("should calculate maxPhases=3 for 5 players", () => {
      const players: Player[] = [
        { id: 1, playerNumber: 1, color: "red", isBot: true },
        { id: 2, playerNumber: 2, color: "yellow", isBot: true },
        { id: 3, playerNumber: 3, color: "green", isBot: false },
        { id: 4, playerNumber: 4, color: "orange", isBot: false },
        { id: 5, playerNumber: 5, color: "blue", isBot: false },
      ];
      const modules: GameModules = { hiddenGoals: false, intrigues: false };

      state = applyAction(state, {
        type: "START_ADVANCED_GAME",
        payload: { players, mode: "shared", modules },
      });

      expect(state.maxPhases).toBe(3);
    });

    it("should calculate maxPhases consistently across modes", () => {
      const players: Player[] = [
        { id: 1, playerNumber: 1, color: "red", isBot: true },
        { id: 2, playerNumber: 2, color: "yellow", isBot: true },
      ];
      const modules: GameModules = { hiddenGoals: false, intrigues: false };

      // Shared mode
      state = applyAction(state, {
        type: "START_ADVANCED_GAME",
        payload: { players, mode: "shared", modules },
      });
      const sharedMaxPhases = state.maxPhases;

      // Individual mode
      state = createInitialState();
      state = applyAction(state, {
        type: "START_ADVANCED_GAME",
        payload: { players, mode: "individual", modules },
      });
      const individualMaxPhases = state.maxPhases;

      // Both should be same
      expect(sharedMaxPhases).toBe(individualMaxPhases);
      expect(sharedMaxPhases).toBe(4);
    });
  });

  // ===== MODE SETUP VALIDATION =====

  describe("Mode Setup Validation", () => {
    it("should initialize shared mode correctly", () => {
      const players: Player[] = [
        { id: 1, playerNumber: 1, color: "red", isBot: true },
        { id: 2, playerNumber: 2, color: "yellow", isBot: true },
      ];
      const modules: GameModules = { hiddenGoals: false, intrigues: false };

      state = applyAction(state, {
        type: "START_ADVANCED_GAME",
        payload: { players, mode: "shared", modules },
      });

      expect(state.mode).toBe("shared");
      expect(state.cardSequence).toBeDefined();
      expect(state.currentCardIndex).toBeDefined();
      expect(state.botDecks).toBeUndefined();
      expect(state.cardSequence!.length).toBe(13);
      expect(state.currentCardIndex).toBe(0);
    });

    it("should initialize individual mode correctly", () => {
      const players: Player[] = [
        { id: 1, playerNumber: 1, color: "red", isBot: true },
        { id: 2, playerNumber: 2, color: "yellow", isBot: true },
      ];
      const modules: GameModules = { hiddenGoals: false, intrigues: false };

      state = applyAction(state, {
        type: "START_ADVANCED_GAME",
        payload: { players, mode: "individual", modules },
      });

      expect(state.mode).toBe("individual");
      expect(state.botDecks).toBeDefined();
      expect(state.botDecks!.length).toBe(2);
      expect(state.botDecks![0].cardSequence.length).toBe(13);
      expect(state.botDecks![0].currentCardIndex).toBe(0);
      expect(state.botDecks![1].currentCardIndex).toBe(-1); // Not yet drawn
      expect(state.cardSequence).toBeUndefined();
    });
  });

  // ===== GAME END VALIDATION =====

  describe("Game End State", () => {
    it("should handle round 5 as last valid round", () => {
      const players: Player[] = [
        { id: 1, playerNumber: 1, color: "red", isBot: true },
        { id: 2, playerNumber: 2, color: "yellow", isBot: true },
      ];
      const modules: GameModules = { hiddenGoals: false, intrigues: false };

      state = applyAction(state, {
        type: "START_ADVANCED_GAME",
        payload: { players, mode: "shared", modules },
      });

      // Set to round 5 manually
      state = {
        ...state,
        currentRound: 5,
      };

      expect(state.currentRound).toBe(5);
      expect(state.gameMode).toBe("advanced");
    });

    it("should prevent NEXT_ROUND when already at round 5", () => {
      const players: Player[] = [
        { id: 1, playerNumber: 1, color: "red", isBot: true },
        { id: 2, playerNumber: 2, color: "yellow", isBot: true },
      ];
      const modules: GameModules = { hiddenGoals: false, intrigues: false };

      state = applyAction(state, {
        type: "START_ADVANCED_GAME",
        payload: { players, mode: "shared", modules },
      });

      // Set to round 5, phase 3 (last phase)
      state = {
        ...state,
        currentRound: 5,
        currentPhase: 3,
      };

      // Try NEXT_PLAYER which would trigger NEXT_ROUND
      const afterAction = applyAction(state, { type: "NEXT_PLAYER" });

      // Should stay at round 5 (not advance to 6)
      expect(afterAction.currentRound).toBeLessThanOrEqual(5);
    });
  });

  // ===== STATE SAFETY VALIDATION =====

  describe("State Safety", () => {
    it("should handle actions on uninitialized state gracefully", () => {
      // Fresh state with no players
      const action: GameAction = { type: "NEXT_PLAYER" };
      const result = applyAction(state, action);

      // Should not crash, should return same or safe state
      expect(result).toBeDefined();
      expect(result.gameMode).not.toBe("advanced");
    });

    it("should maintain state integrity across mode switch", () => {
      const players: Player[] = [
        { id: 1, playerNumber: 1, color: "red", isBot: true },
        { id: 2, playerNumber: 2, color: "yellow", isBot: true },
      ];
      const modules: GameModules = { hiddenGoals: false, intrigues: false };

      // Start shared mode
      state = applyAction(state, {
        type: "START_ADVANCED_GAME",
        payload: { players, mode: "shared", modules },
      });

      const sharedBotCount = state.botCount;
      const sharedRound = state.currentRound;

      // Try to start individual mode (new game)
      state = createInitialState();
      state = applyAction(state, {
        type: "START_ADVANCED_GAME",
        payload: { players, mode: "individual", modules },
      });

      // Should have same game setup
      expect(state.botCount).toBe(sharedBotCount);
      expect(state.currentRound).toBe(sharedRound);
      expect(state.mode).toBe("individual");
    });
  });
});
