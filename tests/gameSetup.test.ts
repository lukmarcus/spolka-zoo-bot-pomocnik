import { describe, it, expect, beforeEach } from "vitest";
import type { Player, PlayerColor, GameModules } from "../src/lib/types";

/**
 * Advanced Game Setup Tests
 *
 * Tests the setup logic for Advanced mode:
 * - Player management (add/remove)
 * - Color management with swap logic
 * - Bot/Human toggle
 * - Mode selection (shared vs individual) availability
 * - Module selection
 * - Validation rules
 */

const AVAILABLE_COLORS: PlayerColor[] = [
  "red",
  "yellow",
  "green",
  "orange",
  "blue",
];

function createInitialPlayers(): Player[] {
  return [
    { id: 1, playerNumber: 1, color: "red", isBot: false },
    { id: 2, playerNumber: 2, color: "yellow", isBot: true },
  ];
}

function addPlayer(players: Player[]): Player[] {
  if (players.length >= 5) return players;

  const usedColors = players.map((p) => p.color);
  const nextColor =
    AVAILABLE_COLORS.find((c) => !usedColors.includes(c)) ||
    AVAILABLE_COLORS[players.length % AVAILABLE_COLORS.length];

  return [
    ...players,
    {
      id: Math.max(...players.map((p) => p.id)) + 1,
      playerNumber: players.length + 1,
      color: nextColor,
      isBot: true,
    },
  ];
}

function removePlayer(players: Player[]): Player[] {
  if (players.length <= 2) return players;
  return players.slice(0, -1);
}

function changeColor(
  players: Player[],
  playerId: number,
  newColor: PlayerColor
): Player[] {
  const otherPlayerWithColor = players.find(
    (p) => p.id !== playerId && p.color === newColor
  );

  if (otherPlayerWithColor) {
    const currentPlayerColor = players.find((p) => p.id === playerId)!.color;
    return players.map((p) => {
      if (p.id === playerId) return { ...p, color: newColor };
      if (p.id === otherPlayerWithColor.id)
        return { ...p, color: currentPlayerColor };
      return p;
    });
  } else {
    return players.map((p) =>
      p.id === playerId ? { ...p, color: newColor } : p
    );
  }
}

function toggleBot(players: Player[], playerId: number): Player[] {
  return players.map((p) =>
    p.id === playerId ? { ...p, isBot: !p.isBot } : p
  );
}

function getBotCount(players: Player[]): number {
  return players.filter((p) => p.isBot).length;
}

function calculateBonusCoins(modules: GameModules): number {
  let bonus = 0;
  if (modules.hiddenGoals) bonus += 20;
  if (modules.intrigues) bonus += 20;
  return bonus;
}

describe("Advanced Game Setup", () => {
  let players: Player[];

  beforeEach(() => {
    players = createInitialPlayers();
  });

  describe("Player Management", () => {
    it("should initialize with 2 players (1 human, 1 bot)", () => {
      expect(players.length).toBe(2);
      expect(players[0].isBot).toBe(false);
      expect(players[1].isBot).toBe(true);
    });

    it("should add players up to 5", () => {
      for (let i = 0; i < 3; i++) {
        players = addPlayer(players);
      }
      expect(players.length).toBe(5);
    });

    it("should not add more than 5 players", () => {
      for (let i = 0; i < 4; i++) {
        players = addPlayer(players);
      }
      const before = players.length;
      players = addPlayer(players);
      expect(players.length).toBe(before);
    });

    it("should remove players down to 2", () => {
      players = addPlayer(players);
      players = addPlayer(players);
      expect(players.length).toBe(4);

      players = removePlayer(players);
      expect(players.length).toBe(3);
    });

    it("should not remove below 2 players", () => {
      const before = players.length;
      players = removePlayer(players);
      expect(players.length).toBe(before);
    });
  });

  describe("Color Management", () => {
    it("should change color without conflict", () => {
      players = changeColor(players, 1, "green");
      expect(players[0].color).toBe("green");
    });

    it("should swap colors when target is taken", () => {
      // Player 1 (red) tries to take Player 2's color (yellow)
      // Should swap: Player 1 -> yellow, Player 2 -> red
      players = changeColor(players, 1, players[1].color); // Swap with player 2
      expect(players[0].color).toBe("yellow");
      expect(players[1].color).toBe("red");
    });

    it("should maintain unique colors", () => {
      for (let i = 0; i < 3; i++) {
        players = addPlayer(players);
      }

      const colors = players.map((p) => p.color);
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(colors.length);
    });
  });

  describe("Bot Toggle", () => {
    it("should toggle player between human and bot", () => {
      expect(players[0].isBot).toBe(false);
      players = toggleBot(players, 1);
      expect(players[0].isBot).toBe(true);
    });

    it("should count bots correctly", () => {
      expect(getBotCount(players)).toBe(1);

      players = toggleBot(players, 1);
      expect(getBotCount(players)).toBe(2);

      players = addPlayer(players);
      expect(getBotCount(players)).toBe(3);
    });
  });

  describe("Mode Selection", () => {
    it("should only allow mode selection with 2+ bots", () => {
      // 1 human + 1 bot = 1 bot total -> NO mode selection
      expect(getBotCount(players)).toBe(1);

      // Add another bot -> 2 bots -> YES mode selection
      players = addPlayer(players);
      expect(getBotCount(players)).toBe(2);
    });

    it("should show mode buttons only when botCount > 1", () => {
      const modeSelectionAvailable = getBotCount(players) > 1;
      expect(modeSelectionAvailable).toBe(false);

      players = addPlayer(players);
      const modeSelectionAvailable2 = getBotCount(players) > 1;
      expect(modeSelectionAvailable2).toBe(true);
    });
  });

  describe("Module Selection", () => {
    it("should initialize modules as disabled", () => {
      const modules: GameModules = {
        hiddenGoals: false,
        intrigues: false,
      };
      expect(calculateBonusCoins(modules)).toBe(0);
    });

    it("should calculate bonus coins correctly", () => {
      expect(
        calculateBonusCoins({ hiddenGoals: true, intrigues: false })
      ).toBe(20);
      expect(
        calculateBonusCoins({ hiddenGoals: false, intrigues: true })
      ).toBe(20);
      expect(
        calculateBonusCoins({ hiddenGoals: true, intrigues: true })
      ).toBe(40);
    });
  });

  describe("Validation", () => {
    it("should require at least 1 bot", () => {
      expect(getBotCount(players) > 0).toBe(true);

      players = toggleBot(players, 2); // Remove only bot
      expect(getBotCount(players) > 0).toBe(false);
    });

    it("should enforce min 2 and max 5 players", () => {
      expect(players.length).toBeGreaterThanOrEqual(2);
      expect(players.length).toBeLessThanOrEqual(5);

      for (let i = 0; i < 3; i++) {
        players = addPlayer(players);
      }
      expect(players.length).toBeLessThanOrEqual(5);
    });
  });
});
