import { describe, it, expect, beforeEach } from "vitest";
import { gameReducer, type GameAction } from "../src/lib/GameContext";
import type { GameState, Player, GameModules } from "../src/lib/types";
import modalTexts from "../src/lib/modalTexts.json";

/**
 * Complete Game Flow: Bot(red) + Bot(yellow) - Shared Mode
 *
 * End-to-end test covering full game from START to END (5 rounds)
 * 2 bots with shared deck
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

describe("Complete Game Flow: Bot(red) + Bot(yellow) - Shared Mode", () => {
  let state: GameState;
  const players: Player[] = [
    { id: 1, playerNumber: 1, color: "red", isBot: true },
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

    expect(state.gameMode).toBe("advanced");
    expect(state.mode).toBe("shared");
    expect(state.currentRound).toBe(1);
    expect(state.currentPhase).toBe(1);
    expect(state.currentPlayerIndex).toBe(0);
    expect(state.currentBot).toBe(1);
    expect(state.botDecks).toBeUndefined();
    expect(state.cardSequence!.length).toBe(13);
    expect(state.currentCardIndex).toBe(0);

    const modals = getExpectedModals(state, false);
    expect(modals.beforeFirstRound).toBe(true);

    const modalTitle = getModalText("advancedGame", "beforeFirstRound.title");
    expect(modalTitle).toBeDefined();
    expect(typeof modalTitle).toBe("string");

    // 2 bots (bot + bot), should use "multiple" message
    const multipleMessage = getModalText(
      "advancedGame",
      "beforeFirstRound.message.multiple",
    );
    expect(multipleMessage).toBeDefined();
    expect(typeof multipleMessage).toBe("string");

    const singleMessage = getModalText(
      "advancedGame",
      "beforeFirstRound.message.single",
    );
    expect(singleMessage).toBeDefined();
  });

  it("2. Should progress through phases with 2 bots and show nextPhase modal", () => {
    state = applyAction(state, {
      type: "START_ADVANCED_GAME",
      payload: { players, mode: "shared", modules },
    });

    state = applyAction(state, { type: "NEXT_PLAYER" });
    expect(state.currentBot).toBe(2);
    expect(state.currentPhase).toBe(1);
    expect(state.currentCardIndex).toBe(1);

    // After switching to bot 2, nextBot modal should be visible (adjacent bots)
    const nextBotTitle = getModalText("advancedGame", "nextBot.title");
    expect(nextBotTitle).toBeDefined();
    expect(typeof nextBotTitle).toBe("string");

    // Bots are adjacent, so use message.adjacent
    const nextBotAdjacentMsg = getModalText(
      "advancedGame",
      "nextBot.message.adjacent",
    );
    expect(nextBotAdjacentMsg).toBeDefined();

    // Check other nextBot fields
    const instructionLabel = getModalText(
      "advancedGame",
      "nextBot.instructionLabel",
    );
    expect(instructionLabel).toBeDefined();
    const confirmText = getModalText("advancedGame", "nextBot.confirmText");
    expect(confirmText).toBeDefined();

    state = applyAction(state, { type: "NEXT_PLAYER" });
    expect(state.currentPhase).toBe(2);
    expect(state.currentBot).toBe(1);
    expect(state.currentCardIndex).toBe(2);

    let modals = getExpectedModals(state, true);
    expect(modals.nextPhase).toBe(true);

    // Check nextPhase modal content
    const nextPhaseTitle = getModalText("advancedGame", "nextPhase.title");
    expect(nextPhaseTitle).toBeDefined();
    expect(typeof nextPhaseTitle).toBe("string");

    // With 2 bots, should use message.multiple
    const nextPhaseMultipleMsg = getModalText(
      "advancedGame",
      "nextPhase.message.multiple",
    );
    expect(nextPhaseMultipleMsg).toBeDefined();

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

    state = applyAction(state, { type: "NEXT_PLAYER" });
    state = applyAction(state, { type: "NEXT_PLAYER" });
    expect(state.currentPhase).toBe(3);
    modals = getExpectedModals(state, true);
    expect(modals.nextPhase).toBe(true);

    state = applyAction(state, { type: "NEXT_PLAYER" });
    state = applyAction(state, { type: "NEXT_PLAYER" });
    expect(state.currentPhase).toBe(4);
    modals = getExpectedModals(state, true);
    expect(modals.nextPhase).toBe(false);
  });

  it("3. Should transition to round 2 and show nextRound modal", () => {
    state = applyAction(state, {
      type: "START_ADVANCED_GAME",
      payload: { players, mode: "shared", modules },
    });

    for (let phase = 1; phase < 4; phase++) {
      state = applyAction(state, { type: "NEXT_PLAYER" });
      state = applyAction(state, { type: "NEXT_PLAYER" });
    }

    state = applyAction(state, { type: "NEXT_PLAYER" });
    expect(state.currentPhase).toBe(4);
    expect(state.currentRound).toBe(1);

    state = applyAction(state, { type: "NEXT_PLAYER" });
    expect(state.currentRound).toBe(2);
    expect(state.currentPhase).toBe(1);
    expect(state.currentCardIndex).toBe(0);

    const modals = getExpectedModals(state, true);
    expect(modals.nextRound).toBe(true);

    // Check nextRound modal content
    const nextRoundTitle = getModalText("advancedGame", "nextRound.title");
    expect(nextRoundTitle).toBeDefined();
    expect(typeof nextRoundTitle).toBe("string");

    // With 2 bots, should use message.multiple
    const nextRoundMultipleMsg = getModalText(
      "advancedGame",
      "nextRound.message.multiple",
    );
    expect(nextRoundMultipleMsg).toBeDefined();

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

    // With 2 bots (shared mode), should use note3.multiple_shared
    const note3Shared = getModalText(
      "advancedGame",
      "nextRound.note3.multiple_shared",
    );
    expect(note3Shared).toBeDefined();

    expect(state.players![0].color).toBe("yellow");
    expect(state.players![1].color).toBe("red");
  });

  it("4. Should shuffle deck on round transition", () => {
    state = applyAction(state, {
      type: "START_ADVANCED_GAME",
      payload: { players, mode: "shared", modules },
    });

    for (let phase = 1; phase < 4; phase++) {
      state = applyAction(state, { type: "NEXT_PLAYER" });
      state = applyAction(state, { type: "NEXT_PLAYER" });
    }
    state = applyAction(state, { type: "NEXT_PLAYER" });
    state = applyAction(state, { type: "NEXT_PLAYER" });

    expect(state.cardSequence!.length).toBe(13);
    expect(state.botDecks).toBeUndefined();
  });

  it("5. Should complete all 5 rounds and verify final game state", () => {
    state = applyAction(state, {
      type: "START_ADVANCED_GAME",
      payload: { players, mode: "shared", modules },
    });

    for (let round = 1; round <= 4; round++) {
      for (let phase = 1; phase <= 4; phase++) {
        expect(state.currentRound).toBe(round);
        state = applyAction(state, { type: "NEXT_PLAYER" });
        if (phase < 4) {
          state = applyAction(state, { type: "NEXT_PLAYER" });
        } else {
          state = applyAction(state, { type: "NEXT_PLAYER" });
        }
      }
    }

    expect(state.currentRound).toBe(5);
    for (let phase = 1; phase < 4; phase++) {
      state = applyAction(state, { type: "NEXT_PLAYER" });
      state = applyAction(state, { type: "NEXT_PLAYER" });
    }

    state = applyAction(state, { type: "NEXT_PLAYER" });
    expect(state.currentPhase).toBe(4);
    expect(state.currentRound).toBe(5);

    expect(state.cardSequence!.length).toBe(13);
    expect(state.botDecks).toBeUndefined();
    expect(state.players!.length).toBe(2);
  });
});
