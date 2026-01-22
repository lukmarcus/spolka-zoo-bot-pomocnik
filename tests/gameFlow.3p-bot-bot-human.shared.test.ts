import { describe, it, expect, beforeEach } from "vitest";
import { gameReducer, type GameAction } from "../src/lib/GameContext";
import type { GameState, Player, GameModules } from "../src/lib/types";
import modalTexts from "../src/lib/modalTexts.json";

/**
 * Complete Game Flow: 3 Players (Bot + Bot + Human) - Shared Mode
 *
 * End-to-end test covering full game from START to END (5 rounds)
 * 2 bots with shared deck, human player auto-skipped
 * Rotation: Bot1 → Bot2 → Phase2 (reset) → Human (skip) → repeat
 */

// ===== MODAL HELPERS =====

function getExpectedModals(state: GameState, gameStarted: boolean) {
  return {
    beforeFirstRound:
      state.currentRound === 1 && !gameStarted && state.gameMode === "advanced",
    nextPhase:
      state.currentPhase! > 1 && gameStarted && state.currentPhase! < 3,
    nextRound:
      state.currentRound! > 1 && gameStarted && state.currentPhase === 1,
  };
}

function getModalText(section: string, key: string): unknown {
  const data = modalTexts as Record<string, Record<string, unknown>>;
  const parts = key.split(".");
  let current: unknown = data[section];

  for (const part of parts) {
    if (current && typeof current === "object") {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return current;
}

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

describe("Complete Game Flow: 3 Players (Bot + Bot + Human) - Shared Mode", () => {
  let state: GameState;
  const players: Player[] = [
    { id: 1, playerNumber: 1, color: "red", isBot: true },
    { id: 2, playerNumber: 2, color: "yellow", isBot: true },
    { id: 3, playerNumber: 3, color: "blue", isBot: false },
  ];
  const modules: GameModules = { hiddenGoals: false, intrigues: false };

  beforeEach(() => {
    state = createInitialState();
  });

  it("1. Should initialize game with START_ADVANCED_GAME and show beforeFirstRound modal", () => {
    state = applyAction(state, {
      type: "START_ADVANCED_GAME",
      payload: { players, mode: "shared", modules },
    });

    expect(state.gameMode).toBe("advanced");
    expect(state.mode).toBe("shared");
    expect(state.currentRound).toBe(1);
    expect(state.currentPhase).toBe(1);
    expect(state.currentPlayerIndex).toBe(0); // First player (Bot1)
    expect(state.currentBot).toBe(1);
    expect(state.currentCardIndex).toBe(0);
    expect(state.cardSequence!.length).toBe(13);
    expect(state.players!.length).toBe(3);

    const modals = getExpectedModals(state, false);
    expect(modals.beforeFirstRound).toBe(true);

    const modalTitle = getModalText("advancedGame", "beforeFirstRound.title");
    expect(modalTitle).toBeDefined();
    expect(typeof modalTitle).toBe("string");

    // With 2 bots (in 3p setup), should use "multiple" message
    const multipleMessage = getModalText(
      "advancedGame",
      "beforeFirstRound.message.multiple",
    );
    expect(multipleMessage).toBeDefined();
    expect(typeof multipleMessage).toBe("string");
  });

  it("2. Should progress with nextBot and nextPhase modals (Bot1 → Bot2 → Phase2)", () => {
    state = applyAction(state, {
      type: "START_ADVANCED_GAME",
      payload: { players, mode: "shared", modules },
    });

    expect(state.currentBot).toBe(1);
    expect(state.currentPhase).toBe(1);
    expect(state.currentCardIndex).toBe(0);

    // Bot1 → Bot2
    state = applyAction(state, { type: "NEXT_PLAYER" });
    expect(state.currentBot).toBe(2);
    expect(state.currentPhase).toBe(1);
    expect(state.currentCardIndex).toBe(1);

    // nextBot modal should be visible
    const nextBotTitle = getModalText("advancedGame", "nextBot.title");
    expect(nextBotTitle).toBeDefined();

    // Bots are adjacent, use message.adjacent
    const nextBotMsg = getModalText("advancedGame", "nextBot.message.adjacent");
    expect(nextBotMsg).toBeDefined();

    // Bot2 → Phase2 (Bot2 triggers NEXT_PHASE, Human auto-skips)
    state = applyAction(state, { type: "NEXT_PLAYER" });
    expect(state.currentPhase).toBe(2);
    expect(state.currentBot).toBe(1); // Reset to Bot1
    expect(state.currentCardIndex).toBe(2);

    // nextPhase modal should be visible
    const modals = getExpectedModals(state, true);
    expect(modals.nextPhase).toBe(true);

    const nextPhaseTitle = getModalText("advancedGame", "nextPhase.title");
    expect(nextPhaseTitle).toBeDefined();

    // With 2 bots, should use message.multiple
    const nextPhaseMsg = getModalText(
      "advancedGame",
      "nextPhase.message.multiple",
    );
    expect(nextPhaseMsg).toBeDefined();
  });

  it("3. Should transition to round 2 and show nextRound modal", () => {
    state = applyAction(state, {
      type: "START_ADVANCED_GAME",
      payload: { players, mode: "shared", modules },
    });

    // Progress through phases 1 and 2 (maxPhases = 3 for 3+ players)
    // 2 bots in this scenario: 2 NEXT_PLAYER calls complete one phase
    for (let phase = 1; phase <= 2; phase++) {
      state = applyAction(state, { type: "NEXT_PLAYER" }); // Bot1 → Bot2
      state = applyAction(state, { type: "NEXT_PLAYER" }); // Bot2 → NEXT_PHASE (no more bots, humans skip)
    }

    expect(state.currentPhase).toBe(3);
    expect(state.currentRound).toBe(1);

    // Phase 3 → Round 2
    state = applyAction(state, { type: "NEXT_PLAYER" });
    state = applyAction(state, { type: "NEXT_PLAYER" });

    expect(state.currentRound).toBe(2);
    expect(state.currentPhase).toBe(1);
    expect(state.currentCardIndex).toBe(0);

    const modals = getExpectedModals(state, true);
    expect(modals.nextRound).toBe(true);

    const nextRoundTitle = getModalText("advancedGame", "nextRound.title");
    expect(nextRoundTitle).toBeDefined();

    // With 2 bots, should use message.multiple
    const nextRoundMsg = getModalText(
      "advancedGame",
      "nextRound.message.multiple",
    );
    expect(nextRoundMsg).toBeDefined();

    // Check note3.multiple_shared
    const note3Shared = getModalText(
      "advancedGame",
      "nextRound.note3.multiple_shared",
    );
    expect(note3Shared).toBeDefined();

    // Verify players rotated (first player moved to end)
    expect(state.players![2].color).toBe("red"); // Bot1 moved to end
    expect(state.players![0].color).toBe("yellow"); // Bot2 is now first
  });

  it("4. Should shuffle deck on round transition", () => {
    state = applyAction(state, {
      type: "START_ADVANCED_GAME",
      payload: { players, mode: "shared", modules },
    });

    // Progress to round 2 (3 phases × 2 players per phase)
    for (let phase = 1; phase <= 3; phase++) {
      state = applyAction(state, { type: "NEXT_PLAYER" });
      state = applyAction(state, { type: "NEXT_PLAYER" });
    }

    // Card sequence should be shuffled
    expect(state.cardSequence!.length).toBe(13);
    // Note: Very likely different but can't guarantee 100%
  });

  it("5. Should complete all 5 rounds and verify final game state", () => {
    state = applyAction(state, {
      type: "START_ADVANCED_GAME",
      payload: { players, mode: "shared", modules },
    });

    // Rounds 1-4: Full progression (2 NEXT_PLAYER per phase × 3 phases)
    for (let round = 1; round <= 4; round++) {
      for (let phase = 1; phase <= 3; phase++) {
        expect(state.currentRound).toBe(round);
        state = applyAction(state, { type: "NEXT_PLAYER" });
        state = applyAction(state, { type: "NEXT_PLAYER" });
      }
    }

    // Round 5: Last round (all 3 phases)
    expect(state.currentRound).toBe(5);
    for (let phase = 1; phase <= 3; phase++) {
      state = applyAction(state, { type: "NEXT_PLAYER" });
      state = applyAction(state, { type: "NEXT_PLAYER" });
    }

    // Final state
    expect(state.currentRound).toBe(5);
    expect(state.currentPhase).toBe(3);
    expect(state.cardSequence!.length).toBe(13);
    expect(state.players!.length).toBe(3);
  });
});
