// Types for Spółka ZOO Bot Helper application

export interface BotCard {
  id: number; // 1-13
  effects: string[]; // 1-2 effects as strings (simplified for v0.1.0)
  ability: string; // additional ability (always present)
}

export interface BotDeck {
  botId: number;
  cardSequence: number[];
  currentCardIndex: number;
  usedCards: number[];
}

export interface GameState {
  mode: "shared" | "individual"; // tryb gry: wspólna talia lub osobne talie
  currentCardIndex?: number; // tylko dla trybu shared
  cardSequence?: number[]; // tylko dla trybu shared
  usedCards?: number[]; // tylko dla trybu shared
  botDecks?: BotDeck[]; // tylko dla trybu individual
  botCount?: number; // 1-4 bots (default: 1)
  currentBot?: number; // 1-4 current bot (default: 1)
  botsSelected?: boolean; // czy wybrano boty
}

export interface GameCodePreview {
  isValid: boolean;
  errorMessage?: string;
  botCount: number;
  currentBot?: number; // Current active bot (1-based)
  currentCardIndex: number;
  totalCards: number;
  gameProgress: string; // "0/13", "5/13", etc.
  isGameStarted: boolean;
  isDeckExhausted: boolean;
  mode?: "shared" | "individual"; // v0.4.3+ deck mode
  botPositions?: Array<{ botId: number; position: string }>; // v0.4.3+ per-bot positions for ZP
}

export interface GameContextType {
  state: GameState;
  drawCard: () => void;
  shuffleDeck: () => void;
  resetGame: () => void;
  newGame: () => void;
  loadGame: (gameState: GameState) => void;
  selectBots: (count: number) => void; // v0.3.0+ bot selection
  switchBot: (botNumber: number) => void; // v0.3.0+ bot switching
  nextBot: () => void; // v0.3.3+ go to next bot in sequence
  nextBotAndDraw: () => void; // v0.3.3+ go to next bot and draw card
  nextBotAndShuffleAndDraw?: () => void; // v0.4.1+ atomic: switch to next bot, reshuffle (if needed) and draw
  getCurrentCard: () => number | null;
  isDeckExhausted: () => boolean;
  getCardsRemaining: () => number;
  // isGameStarted removed - determined by currentCardIndex >= 0
}

// Additional types for future multi-bot functionality
export interface Bot {
  id: string;
  currentCard?: number; // ID of current card
}

export interface MultiGameState {
  bots: Bot[];
  currentBotIndex: number;
  mode: "shared" | "individual";
  botDecks?: BotDeck[];
}

// Enums as const assertions (compatible with erasableSyntaxOnly)
export const GameMode = {
  SHARED: "shared",
  SEPARATE: "separate",
} as const;

export const CardType = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
} as const;

export type GameModeType = (typeof GameMode)[keyof typeof GameMode];
export type CardTypeType = (typeof CardType)[keyof typeof CardType];
