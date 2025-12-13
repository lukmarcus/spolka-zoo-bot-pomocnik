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

export interface GameState {
  mode: "shared" | "individual";
  modules?: GameModules;
  currentCardIndex?: number;
  cardSequence?: number[];
  usedCards?: number[];
  botDecks?: BotDeck[];
  botCount?: number;
  currentBot?: number;
  botsSelected?: boolean;
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
  getCurrentCard: () => number | null;
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
