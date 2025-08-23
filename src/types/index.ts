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
  shuffleCount: number; // how many times shuffled
  gameStarted: boolean; // whether game has been started
}

export interface GameContextType {
  state: GameState;
  drawCard: () => void;
  shuffleDeck: () => void;
  resetGame: () => void;
  newGame: () => void;
  loadGame: (gameState: GameState) => void;
  getCurrentCard: () => number | null;
  isGameStarted: () => boolean;
  isDeckExhausted: () => boolean;
  getCardsRemaining: () => number;
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
