// Types for Spółka ZOO Bot Helper application

export interface BotCard {
  id: number; // 1-13
  name: string;
  effects: BotEffect[]; // 1-2 effects
  ability?: string; // additional ability (optional)
  description: string; // full card description
  placeholder?: boolean; // whether this is a temporary Lorem Ipsum card
}

export interface BotEffect {
  type: "primary" | "secondary";
  description: string; // short sentence (as in the rulebook)
  icon?: string; // custom SVG/PNG icon specific to the game
}

export interface GameState {
  currentCardIndex: number; // current position in deck (0-12)
  cardSequence: number[]; // shuffled card sequence (0-12)
  usedCards: number[]; // used cards in this round
  shuffleCount: number; // how many times shuffled
}

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

export type GameMode = (typeof GameMode)[keyof typeof GameMode];
export type CardType = (typeof CardType)[keyof typeof CardType];

// Route types
export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  label: string;
}

// Menu options
export interface MenuOption {
  id: string;
  label: string;
  description?: string;
  action: () => void;
  disabled?: boolean;
}

// Game settings
export interface GameSettings {
  botCount: number; // 1-4 bots
  gameMode: GameMode;
  botNames: string[];
  autoSave: boolean;
}

// Game code format
export interface GameCode {
  version: string; // version format: v1, v2, etc.
  botCount: number;
  gameMode: GameMode;
  currentStates: GameState | { [botId: string]: GameState }; // depends on game mode
  checksum: string;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

// Local storage keys
export const STORAGE_KEYS = {
  LAST_GAME: "spolka-zoo-last-game",
  SETTINGS: "spolka-zoo-settings",
  GAME_HISTORY: "spolka-zoo-history",
} as const;

// Constants
export const CONSTANTS = {
  MAX_BOTS: 4,
  MIN_BOTS: 1,
  CARDS_PER_DECK: 13,
  MAX_GAME_CODE_LENGTH: 256,
} as const;
