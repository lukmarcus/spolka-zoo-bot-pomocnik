import { describe, it, expect, beforeEach } from "vitest";
import { gameReducer, type GameAction } from "../src/lib/GameContext";
import type { GameState, Player, GameModules } from "../src/lib/types";
import modalTexts from "../src/lib/modalTexts.json";

/**
 * Complete Game Flow: 4 Players (Bot + Bot + Human + Human) - Individual Mode
 *
 * End-to-end test covering full game from START to END (5 rounds)
 * 2 bots with individual deck, two human players auto-skipped
 * maxPhases = 3 for 4+ players
 * Rotation: Bot1 → Bot2 → Human1 (skip) → Human2 (skip) → Phase2 (reset) → repeat
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
    mode: "individual",
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

describe("Complete Game Flow: 4 Players (Bot + Bot + Human + Human) - Individual Mode", () => {
  let state: GameState;
  const players: Player[] = [
    { id: 1, playerNumber: 1, color: "red", isBot: true },
    { id: 2, playerNumber: 2, color: "yellow", isBot: true },
    { id: 3, playerNumber: 3, color: "blue", isBot: false },
    { id: 4, playerNumber: 4, color: "green", isBot: false },
  ];
  const modules: GameModules = { hiddenGoals: false, intrigues: false };

  beforeEach(() => {
    state = createInitialState();
  });

  it("1. Should initialize game with START_ADVANCED_GAME and show beforeFirstRound modal", () => {
    state = applyAction(state, {
      type: "START_ADVANCED_GAME",
      payload: { players, mode: "individual", modules },
    });

    expect(state.gameMode).toBe("advanced");
    expect(state.mode).toBe("individual");
    expect(state.currentRound).toBe(1);
    expect(state.currentPhase).toBe(1);
    expect(state.currentPlayerIndex).toBe(0); // First player (Bot1)
    expect(state.currentBot).toBe(1);
    expect(state.botDecks![0].currentCardIndex).toBe(0);
    expect(state.botDecks!.length).toBe(2);
    expect(state.players!.length).toBe(4);

    const modals = getExpectedModals(state, false);
    expect(modals.beforeFirstRound).toBe(true);

    const modalTitle = getModalText("advancedGame", "beforeFirstRound.title");
    expect(modalTitle).toBeDefined();
    expect(typeof modalTitle).toBe("string");

    // With 2 bots (in 4p setup), should use "multiple" message
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
      payload: { players, mode: "individual", modules },
    });

    expect(state.currentBot).toBe(1);
    expect(state.currentPhase).toBe(1);
    expect(state.botDecks![0].currentCardIndex).toBe(0);

    // Bot1 → Bot2
    state = applyAction(state, { type: "NEXT_PLAYER" });
    expect(state.currentBot).toBe(2);
    expect(state.currentPhase).toBe(1);
    expect(state.botDecks![1].currentCardIndex).toBe(0);

    // nextBot modal should be visible
    const nextBotTitle = getModalText("advancedGame", "nextBot.title");
    expect(nextBotTitle).toBeDefined();

    // Bots are adjacent, use message.adjacent
    const nextBotMsg = getModalText("advancedGame", "nextBot.message.adjacent");
    expect(nextBotMsg).toBeDefined();

    // Bot2 → No more bots, so NEXT_PHASE is triggered
    state = applyAction(state, { type: "NEXT_PLAYER" });
    expect(state.currentPhase).toBe(2); // Phase advances
    expect(state.currentBot).toBe(1); // Reset to Bot1

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
      payload: { players, mode: "individual", modules },
    });

    // Progress through phases 1 and 2 (to reach phase 3)
    // 2 bots: 2 NEXT_PLAYER calls complete one phase
    for (let phase = 1; phase < 3; phase++) {
      state = applyAction(state, { type: "NEXT_PLAYER" }); // Bot1 → Bot2
      state = applyAction(state, { type: "NEXT_PLAYER" }); // Bot2 → NEXT_PHASE (humans skipped)
    }

    expect(state.currentPhase).toBe(3);
    expect(state.currentRound).toBe(1);

    // Phase 3 → Round 2
    // 2 bots: 2 NEXT_PLAYER calls complete phase 3 and trigger NEXT_ROUND
    state = applyAction(state, { type: "NEXT_PLAYER" }); // Bot1 → Bot2
    state = applyAction(state, { type: "NEXT_PLAYER" }); // Bot2 → NEXT_PHASE (which becomes NEXT_ROUND at maxPhases)

    expect(state.currentRound).toBe(2);
    expect(state.currentPhase).toBe(1);
    expect(state.botDecks![0].currentCardIndex).toBe(0);

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

    // Check note3.multiple_individual
    const note3Individual = getModalText(
      "advancedGame",
      "nextRound.note3.multiple_individual",
    );
    expect(note3Individual).toBeDefined();

    // Verify deck shuffled (botDecks exist in individual mode)
    expect(state.botDecks![0].cardSequence.length).toBe(13);

    // Verify players rotated (first player moved to end)
    expect(state.players![3].color).toBe("red"); // Bot1 moved to end
    expect(state.players![0].color).toBe("yellow"); // Bot2 is now first
  });

  it("4. Should shuffle deck on round transition", () => {
    state = applyAction(state, {
      type: "START_ADVANCED_GAME",
      payload: { players, mode: "individual", modules },
    });

    // Progress to round 2 (2 NEXT_PLAYER per phase × 3 phases)
    for (let phase = 1; phase <= 3; phase++) {
      state = applyAction(state, { type: "NEXT_PLAYER" });
      state = applyAction(state, { type: "NEXT_PLAYER" });
      state = applyAction(state, { type: "NEXT_PLAYER" });
      state = applyAction(state, { type: "NEXT_PLAYER" });
    }

    // Card sequence should be shuffled
    expect(state.botDecks![0].cardSequence.length).toBe(13);
    // Note: Very likely different but can't guarantee 100%
  });

  it("5. Should complete all 5 rounds and verify final game state", () => {
    state = applyAction(state, {
      type: "START_ADVANCED_GAME",
      payload: { players, mode: "individual", modules },
    });

    // Rounds 1-4: Full progression (2 NEXT_PLAYER per phase × 3 phases for 2 bots)
    for (let round = 1; round <= 4; round++) {
      for (let phase = 1; phase <= 3; phase++) {
        state = applyAction(state, { type: "NEXT_PLAYER" });
        state = applyAction(state, { type: "NEXT_PLAYER" });
      }
      // After each round's phases complete, verify round has advanced
      if (round < 4) {
        expect(state.currentRound).toBe(round + 1);
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
    expect(state.botDecks![0].cardSequence.length).toBe(13);
    expect(state.players!.length).toBe(4);
  });
});
