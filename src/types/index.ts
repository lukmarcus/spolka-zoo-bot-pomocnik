// Typy dla aplikacji Spółka ZOO Bot Pomocnik

export interface BotCard {
  id: number; // 1-13
  name: string;
  effects: BotEffect[]; // 1-2 efekty
  ability?: string; // dodatkowa zdolność (opcjonalna)
  description: string; // pełny opis karty
  placeholder?: boolean; // czy to tymczasowa karta Lorem Ipsum
}

export interface BotEffect {
  type: "primary" | "secondary";
  description: string; // krótkie zdanie (jak w instrukcji)
  icon?: string; // własna ikona SVG/PNG specyficzna dla gry
}

export interface GameState {
  currentCardIndex: number; // aktualna pozycja w talii (0-12)
  cardSequence: number[]; // potasowana sekwencja kart (0-12)
  usedCards: number[]; // użyte karty w tej rundzie
  shuffleCount: number; // ile razy przetasowano
}

export interface Bot {
  id: string;
  name: string;
  currentCard?: number; // ID aktualnej karty
}

export interface MultiGameState {
  bots: Bot[];
  currentBotIndex: number;
  gameMode: "shared" | "separate"; // jedna talia vs osobne talie
  sharedDeck?: GameState; // dla trybu shared
  separateDecks?: { [botId: string]: GameState }; // dla trybu separate
}

// Enums jako const assertions (kompatybilne z erasableSyntaxOnly)
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
  botCount: number; // 1-4
  gameMode: GameMode;
  botNames: string[];
  autoSave: boolean;
}

// Game code format
export interface GameCode {
  version: string; // v1, v2, etc.
  botCount: number;
  gameMode: GameMode;
  currentStates: GameState | { [botId: string]: GameState }; // depends on mode
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
