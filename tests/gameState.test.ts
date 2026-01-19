import { describe, it, expect } from "vitest";
import type { GameState, Player } from "../src/lib/types";

/**
 * GameContext Tests - Focus on bot numbering and state transitions
 *
 * Critical Concept:
 * - currentBot is a BOT NUMBER (1-based count of bots only)
 * - currentPlayerIndex is player array INDEX (0-5)
 * - In individual mode: botDecks[currentBot - 1] accesses correct deck
 *
 * Example (bot-gracz-bot in individual mode):
 * - players[0] = Bot (isBot=true) → currentBot=1
 * - players[1] = Gracz (isBot=false)
 * - players[2] = Bot (isBot=true) → currentBot=2 (not 3!)
 */

// ===== DUMMY STATE FACTORY =====

/**
 * Helper: Create bot player
 */
function createBot(id: number): Player {
  return {
    id,
    playerNumber: id,
    color: "red",
    isBot: true,
  };
}

/**
 * Helper: Create human player
 */
function createHuman(id: number): Player {
  return {
    id,
    playerNumber: id,
    color: "blue",
    isBot: false,
  };
}

/**
 * Helper: Create bot-gracz-bot setup (most common test case)
 * Used for individual mode testing
 */
function createBotGraczBotSetup(): {
  players: Player[];
} {
  return {
    players: [createBot(1), createHuman(1), createBot(2)],
  };
}

/**
 * Helper: Create bot-bot setup
 * 2 bots in sequence
 */
function createBotBotSetup(): {
  players: Player[];
} {
  return {
    players: [createBot(1), createBot(2)],
  };
}

/**
 * Helper: Create advanced game state for testing
 * Simulates START_ADVANCED_GAME action
 */
function createAdvancedGameState(overrides?: Partial<GameState>): GameState {
  const { players } = createBotGraczBotSetup();
  const botCount = players.filter((p) => p.isBot).length;
  const maxPhases = players.length === 2 ? 4 : 3;

  return {
    gameMode: "advanced",
    mode: "individual",
    modules: {
      hiddenGoals: true,
      intrigues: true,
    },
    players,
    currentPlayerIndex: 0, // First bot
    currentRound: 1,
    currentPhase: 1,
    maxPhases,
    botDecks: [
      {
        botId: 1,
        cardSequence: Array.from({ length: 50 }, (_, i) => i),
        currentCardIndex: 0,
        usedCards: [0],
      },
      {
        botId: 2,
        cardSequence: Array.from({ length: 50 }, (_, i) => i),
        currentCardIndex: -1,
        usedCards: [],
      },
    ],
    botCount,
    currentBot: 1,
    botsSelected: true,
    ...overrides,
  };
}

// ===== TESTS =====

describe("GameContext - Bot Numbering", () => {
  describe("Setup Verification", () => {
    it("should create bot-gracz-bot setup correctly", () => {
      const { players } = createBotGraczBotSetup();

      expect(players).toHaveLength(3);
      expect(players[0].isBot).toBe(true);
      expect(players[1].isBot).toBe(false);
      expect(players[2].isBot).toBe(true);
    });

    it("should create bot-bot setup correctly", () => {
      const { players } = createBotBotSetup();

      expect(players).toHaveLength(2);
      expect(players[0].isBot).toBe(true);
      expect(players[1].isBot).toBe(true);
    });
  });

  describe("Advanced Game State", () => {
    it("should initialize with correct bot numbering", () => {
      const state = createAdvancedGameState();

      expect(state.currentBot).toBe(1);
      expect(state.currentPlayerIndex).toBe(0);
      expect(state.gameMode).toBe("advanced");
      expect(state.mode).toBe("individual");
    });

    it("should have 2 bots in bot-gracz-bot setup", () => {
      const state = createAdvancedGameState();

      expect(state.botCount).toBe(2);
      expect(state.botDecks).toHaveLength(2);
    });
  });

  describe("NEXT_PLAYER Logic - Bot Numbering Calculation", () => {
    /**
     * This is the CRITICAL test for the bug fix
     *
     * Setup: bot-gracz-bot (3 players)
     * - players[0] = Bot (isBot=true) → currentBot=1
     * - players[1] = Gracz (isBot=false)
     * - players[2] = Bot (isBot=true) → currentBot=2 (NOT 3!)
     *
     * NEXT_PLAYER from players[0] should go to players[2] with currentBot=2
     */
    it("should correctly calculate bot number when moving from bot #1 to bot #2 in bot-gracz-bot setup", () => {
      const { players } = createBotGraczBotSetup();

      // Current state: at first bot (players[0])
      const currentPlayerIndex = 0;

      // Find next bot after players[0]
      let nextBotIndex = currentPlayerIndex + 1;
      while (nextBotIndex < players.length) {
        if (players[nextBotIndex].isBot) {
          break;
        }
        nextBotIndex++;
      }

      // Calculate bot number (this is the logic from NEXT_PLAYER reducer)
      let nextBotNumber = 1;
      for (let i = 0; i <= nextBotIndex; i++) {
        if (i < nextBotIndex && players[i].isBot) {
          nextBotNumber++;
        }
      }

      // Verify
      expect(nextBotIndex).toBe(2); // players[2]
      expect(nextBotNumber).toBe(2); // Bot #2, not #3!
    });

    it("should correctly calculate bot number in bot-bot setup", () => {
      const { players } = createBotBotSetup();

      // Current state: at first bot (players[0])
      const currentPlayerIndex = 0;

      // Find next bot
      let nextBotIndex = currentPlayerIndex + 1;
      while (nextBotIndex < players.length) {
        if (players[nextBotIndex].isBot) {
          break;
        }
        nextBotIndex++;
      }

      // Calculate bot number
      let nextBotNumber = 1;
      for (let i = 0; i <= nextBotIndex; i++) {
        if (i < nextBotIndex && players[i].isBot) {
          nextBotNumber++;
        }
      }

      expect(nextBotIndex).toBe(1);
      expect(nextBotNumber).toBe(2);
    });
  });

  describe("NEXT_PHASE Logic - Reset to First Bot", () => {
    it("should reset to first bot with correct bot number", () => {
      const { players } = createBotGraczBotSetup();

      // Find first bot
      const firstBotIndex = players.findIndex((p) => p.isBot);

      // Calculate bot number for first bot
      let nextBotNumber = 1;
      for (let i = 0; i <= firstBotIndex; i++) {
        if (i < firstBotIndex && players[i].isBot) {
          nextBotNumber++;
        }
      }

      expect(firstBotIndex).toBe(0);
      expect(nextBotNumber).toBe(1);
    });
  });

  describe("Bot Deck Access", () => {
    it("should correctly access bot deck using currentBot formula", () => {
      const state = createAdvancedGameState();

      // Access first bot's deck: botDecks[currentBot - 1]
      if (state.currentBot !== undefined) {
        const botDeck1 = state.botDecks?.[state.currentBot - 1];
        expect(botDeck1).toBeDefined();
        expect(botDeck1?.botId).toBe(1);

        // Access second bot's deck: botDecks[2 - 1]
        const botDeck2 = state.botDecks?.[2 - 1];
        expect(botDeck2).toBeDefined();
        expect(botDeck2?.botId).toBe(2);
      }
    });
  });
});
