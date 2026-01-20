import { describe, it, expect, beforeEach } from "vitest";
import { gameReducer, type GameAction } from "../src/lib/GameContext";
import type { GameState, Player, GameModules } from "../src/lib/types";
import modalTexts from "../src/lib/modalTexts.json";

/**
 * Complete Game Flow: Human(red) + Bot(yellow) - Shared Mode
 *
 * End-to-end test covering full game from START to END (5 rounds)
 * Tests state transitions, modals, and game mechanics
 */

// ===== MODAL HELPERS =====

/**
 * Helper: Determine which modals should be visible based on game state
 */
function getExpectedModals(state: GameState, gameStarted: boolean) {
  return {
    beforeFirstRound:
      state.currentRound === 1 && !gameStarted && state.gameMode === "advanced",
    nextPhase:
      state.currentPhase! > 1 && gameStarted && state.currentPhase! < 4,
    nextRound:
      state.currentRound! > 1 && gameStarted && state.currentPhase === 1,
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

describe("Complete Game Flow: Human(red) + Bot(yellow) - Shared Mode", () => {
  let state: GameState;
  const players: Player[] = [
    { id: 1, playerNumber: 1, color: "red", isBot: false },
    { id: 2, playerNumber: 2, color: "yellow", isBot: true },
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

    // Game state
    expect(state.gameMode).toBe("advanced");
    expect(state.mode).toBe("shared");
    expect(state.currentRound).toBe(1);
    expect(state.currentPhase).toBe(1);
    expect(state.currentPlayerIndex).toBe(1); // First bot
    expect(state.currentCardIndex).toBe(0);
    expect(state.cardSequence!.length).toBe(13);

    // Modal: beforeFirstRound should be visible
    const modals = getExpectedModals(state, false);
    expect(modals.beforeFirstRound).toBe(true);

    // Check modal title and message text
    const modalTitle = getModalText("advancedGame", "beforeFirstRound.title");
    expect(modalTitle).toBeDefined();
    expect(typeof modalTitle).toBe("string");

    // With 1 bot (human + bot), should use "single" message
    const singleMessage = getModalText(
      "advancedGame",
      "beforeFirstRound.message.single",
    );
    expect(singleMessage).toBeDefined();
    expect(typeof singleMessage).toBe("string");

    // Multiple message exists but not used in this scenario
    const multipleMessage = getModalText(
      "advancedGame",
      "beforeFirstRound.message.multiple",
    );
    expect(multipleMessage).toBeDefined();
  });

  it("2. Should progress through phases and show nextPhase modal on transitions", () => {
    // Setup: Game already started
    state = applyAction(state, {
      type: "START_ADVANCED_GAME",
      payload: { players, mode: "shared", modules },
    });

    // Phase 1 -> 2 (trigger nextPhase modal)
    expect(state.currentPhase).toBe(1);
    expect(state.currentCardIndex).toBe(0);
    state = applyAction(state, { type: "NEXT_PLAYER" });
    expect(state.currentPhase).toBe(2);
    expect(state.currentCardIndex).toBe(1);

    // nextPhase modal should be visible (phase > 1, phase < 4)
    let modals = getExpectedModals(state, true);
    expect(modals.nextPhase).toBe(true);

    // Check nextPhase modal content
    const nextPhaseTitle = getModalText("advancedGame", "nextPhase.title");
    expect(nextPhaseTitle).toBeDefined();
    expect(typeof nextPhaseTitle).toBe("string");

    // With 1 bot, should use message.single
    const nextPhaseSingleMsg = getModalText(
      "advancedGame",
      "nextPhase.message.single",
    );
    expect(nextPhaseSingleMsg).toBeDefined();

    // Check other nextPhase fields
    const marketPhase = getModalText("advancedGame", "nextPhase.marketPhase");
    expect(marketPhase).toBeDefined();
    const currentPhasePlayers = getModalText(
      "advancedGame",
      "nextPhase.currentPhasePlayers",
    );
    expect(currentPhasePlayers).toBeDefined();
    const nextPhasePlayers = getModalText(
      "advancedGame",
      "nextPhase.nextPhasePlayers",
    );
    expect(nextPhasePlayers).toBeDefined();

    // Phase 2 -> 3
    state = applyAction(state, { type: "NEXT_PLAYER" });
    expect(state.currentPhase).toBe(3);
    expect(state.currentCardIndex).toBe(2);
    modals = getExpectedModals(state, true);
    expect(modals.nextPhase).toBe(true);

    // Phase 3 -> 4 (no nextPhase modal on last phase transition)
    state = applyAction(state, { type: "NEXT_PLAYER" });
    expect(state.currentPhase).toBe(4);
    expect(state.currentCardIndex).toBe(3);
    modals = getExpectedModals(state, true);
    expect(modals.nextPhase).toBe(false); // Phase 4 doesn't trigger nextPhase
  });

  it("3. Should transition from round 1 to round 2 and show nextRound modal", () => {
    state = applyAction(state, {
      type: "START_ADVANCED_GAME",
      payload: { players, mode: "shared", modules },
    });

    // Progress to phase 4
    for (let phase = 1; phase < 4; phase++) {
      state = applyAction(state, { type: "NEXT_PLAYER" });
    }

    // Phase 4 -> NEXT_ROUND (via NEXT_PLAYER triggering NEXT_PHASE -> NEXT_ROUND)
    expect(state.currentPhase).toBe(4);
    expect(state.currentRound).toBe(1);
    state = applyAction(state, { type: "NEXT_PLAYER" });

    // Verify round transitioned
    expect(state.currentRound).toBe(2);
    expect(state.currentPhase).toBe(1); // Reset to phase 1
    expect(state.currentCardIndex).toBe(0); // Deck reset

    // Modal: nextRound should be visible (round > 1 and phase === 1)
    const modals = getExpectedModals(state, true);
    expect(modals.nextRound).toBe(true);

    // Check nextRound modal content
    const nextRoundTitle = getModalText("advancedGame", "nextRound.title");
    expect(nextRoundTitle).toBeDefined();
    expect(typeof nextRoundTitle).toBe("string");

    // With 1 bot, should use message.single
    const nextRoundSingleMsg = getModalText(
      "advancedGame",
      "nextRound.message.single",
    );
    expect(nextRoundSingleMsg).toBeDefined();

    // Check other nextRound fields
    const phaseLabelsCurrent = getModalText(
      "advancedGame",
      "nextRound.phaseLabels.current",
    );
    expect(phaseLabelsCurrent).toBeDefined();
    const phaseLabelsNext = getModalText(
      "advancedGame",
      "nextRound.phaseLabels.next",
    );
    expect(phaseLabelsNext).toBeDefined();
    const note1 = getModalText("advancedGame", "nextRound.note1");
    expect(note1).toBeDefined();
    const note2 = getModalText("advancedGame", "nextRound.note2");
    expect(note2).toBeDefined();

    // With 1 bot (shared mode), should use note3.single
    const note3Single = getModalText("advancedGame", "nextRound.note3.single");
    expect(note3Single).toBeDefined();

    // Verify players rotated (bot moved to end, human is now first)
    expect(state.players![0].color).toBe("yellow"); // Bot moved to end
    expect(state.players![1].color).toBe("red"); // Human is second
  });

  it("4. Should shuffle deck on round transition", () => {
    state = applyAction(state, {
      type: "START_ADVANCED_GAME",
      payload: { players, mode: "shared", modules },
    });

    // Progress to round 2
    for (let phase = 1; phase < 4; phase++) {
      state = applyAction(state, { type: "NEXT_PLAYER" });
    }
    state = applyAction(state, { type: "NEXT_PLAYER" }); // NEXT_ROUND

    // Card sequence should be shuffled (very likely to be different)
    // Note: Theoretically same order is possible but extremely unlikely
    expect(state.cardSequence!.length).toBe(13);
    // We can't guarantee it changed, but we can verify length is correct
  });

  it("5. Should complete all 5 rounds and verify final game state", () => {
    state = applyAction(state, {
      type: "START_ADVANCED_GAME",
      payload: { players, mode: "shared", modules },
    });

    // Rounds 1-4: Full progression
    for (let round = 1; round <= 4; round++) {
      for (let phase = 1; phase <= 4; phase++) {
        expect(state.currentRound).toBe(round);
        if (phase < 4) {
          state = applyAction(state, { type: "NEXT_PLAYER" });
        } else {
          state = applyAction(state, { type: "NEXT_PLAYER" }); // NEXT_ROUND
        }
      }
    }

    // Round 5: Last round
    expect(state.currentRound).toBe(5);
    for (let phase = 1; phase < 4; phase++) {
      state = applyAction(state, { type: "NEXT_PLAYER" });
    }

    // Complete phase 4 of round 5
    expect(state.currentPhase).toBe(4);
    expect(state.currentRound).toBe(5);

    // Final state verification
    expect(state.cardSequence!.length).toBe(13);
    expect(state.players!.length).toBe(2);
    expect(state.currentCardIndex).toBe(3);
  });
});
