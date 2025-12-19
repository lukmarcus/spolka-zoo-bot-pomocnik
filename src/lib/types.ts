export interface BotCard {
  id: number;
  effects: string[];
  ability: string;
}

export interface BotDeck {
  botId: number;
  cardSequence: number[];
  currentCardIndex: number;
  usedCards: number[];
}

export interface GameModules {
  hiddenGoals: boolean;
  intrigues: boolean;
}

// Player colors available in the game
export type PlayerColor = "red" | "yellow" | "green" | "orange" | "blue";

// Player in advanced mode
export interface Player {
  id: number;
  color: PlayerColor;
  isBot: boolean;
}

export interface GameState {
  gameMode?: "quick" | "advanced";
  mode: "shared" | "individual";
  modules?: GameModules;
  currentCardIndex?: number;
  cardSequence?: number[];
  usedCards?: number[];
  botDecks?: BotDeck[];
  botCount?: number;
  currentBot?: number;
  botsSelected?: boolean;
  // Advanced mode fields
  players?: Player[];
  currentPlayerIndex?: number;
  currentRound?: number;
  currentPhase?: number;
  maxPhases?: number;
}

export interface GameCodePreview {
  isValid: boolean;
  errorMessage?: string;
  botCount: number;
  currentBot?: number;
  currentCardIndex: number;
  totalCards: number;
  gameProgress: string;
  isGameStarted: boolean;
  isDeckExhausted: boolean;
  mode?: "shared" | "individual";
  botPositions?: Array<{ botId: number; position: string }>;
}

export interface GameContextType {
  state: GameState;
  drawCard: () => void;
  shuffleDeck: () => void;
  resetGame: () => void;
  newGame: () => void;
  loadGame: (gameState: GameState) => void;
  selectBots: (count: number) => void;
  switchBot: (botNumber: number) => void;
  nextBot: () => void;
  nextBotAndDraw: () => void;
  nextBotAndShuffleAndDraw?: () => void;
  endRound: (startingBot: number) => void;
  startAdvancedGame: (
    players: Player[],
    mode: "shared" | "individual",
    modules: GameModules
  ) => void;
  nextPlayer: () => void;
  nextPhase: () => void;
  nextRound: () => void;
  getCurrentCard: () => number | null;
  getCardById: (cardId: number) => BotCard | null;
  isDeckExhausted: () => boolean;
  getCardsRemaining: () => number;
}

// Additional types for future multi-bot functionality
export interface Bot {
  id: string;
  currentCard?: number;
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

// Helper function to calculate bonus coins from modules
export const calculateBonusCoins = (modules: GameModules): number => {
  let bonus = 0;
  if (modules.hiddenGoals) bonus += 20;
  if (modules.intrigues) bonus += 20;
  return bonus;
};
