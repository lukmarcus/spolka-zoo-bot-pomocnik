// Types for Spółka ZOO Bot Helper application

export interface BotCard {
  id: number; // 1-13
  name: string;
  effects: string[]; // 1-2 effects as strings (simplified for v0.1.0)
  ability?: string; // additional ability (optional)
}

export interface GameState {
  currentCardIndex: number; // current position in deck (0-12)
  cardSequence: number[]; // shuffled card sequence (0-12)
  usedCards: number[]; // used cards in this round
  // v0.2.1+ multi-bot support (optional)
  botCount?: number; // 1-4 bots (default: 1)
  currentBot?: number; // 1-4 current bot (default: 1)
  // shuffleCount removed - not needed in v0.2.1
  // gameStarted removed - code existence = game started
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
}

export interface GameContextType {
  state: GameState;
  drawCard: () => void;
  shuffleDeck: () => void;
  resetGame: () => void;
  newGame: () => void;
  loadGame: (gameState: GameState) => void;
  getCurrentCard: () => number | null;
  isDeckExhausted: () => boolean;
  getCardsRemaining: () => number;
  // isGameStarted removed - determined by currentCardIndex >= 0
}

// Additional types for future multi-bot functionality
export interface Bot {
  id: string;
  name: string;
  currentCard?: number; // ID of current card
}

export interface MultiGameState {
  bots: Bot[];
  currentBotIndex: number;
  gameMode: "shared" | "separate"; // shared deck vs separate decks
  sharedDeck?: GameState; // for shared mode
  separateDecks?: { [botId: string]: GameState }; // for separate mode
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
