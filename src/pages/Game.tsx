import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { BOT_CARDS } from "../data/botCards";
import { copyGameCodeToClipboard } from "../utils/gameStorage";
import Layout from "../components/Layout";
import BotCard from "../components/BotCard";
import ConfirmModal from "../components/ConfirmModal";
import styles from "./Game.module.css";

const Game: React.FC = () => {
  const navigate = useNavigate();
  const game = useGame();
  const [showExitModal, setShowExitModal] = useState(false);
  const [copyMessage, setCopyMessage] = useState<string>("");
  const [selectedBotCount, setSelectedBotCount] = useState<number | null>(null);
  const [selectedMode, setSelectedMode] = useState<"shared" | "individual">(
    "shared"
  );

  // v0.3.2 Reset game state on page refresh to ensure clean bot selection
  React.useEffect(() => {
    // If we're in an inconsistent state (bots not selected but cards drawn), reset
    if (
      !game.state.botsSelected &&
      typeof game.state.currentCardIndex === "number" &&
      game.state.currentCardIndex >= 0
    ) {
      game.resetGame();
    }
  }, [game, game.state.botsSelected, game.state.currentCardIndex]);

  const handleBackToMenu = () => {
    // v0.3.2 Simplified exit - no modal during bot selection
    if (!game.state.botsSelected) {
      // During bot selection, exit immediately without modal
      game.resetGame();
      navigate("/");
    } else {
      // During game, show modal for confirmation
      setShowExitModal(true);
    }
  };

  const confirmExitWithCopy = async () => {
    // First copy the game code
    const message = await copyGameCodeToClipboard(game.state);
    setCopyMessage(message);

    // Then exit after a short delay to show the toast
    setTimeout(() => {
      setShowExitModal(false);
      game.resetGame();
      navigate("/");
    }, 500); // Short delay to see the copy confirmation
  };

  const cancelExit = () => {
    setShowExitModal(false);
  };

  const handleCopyGameCode = async () => {
    const message = await copyGameCodeToClipboard(game.state);
    setCopyMessage(message);
    setTimeout(() => setCopyMessage(""), 3000);
  };

  const handleBotSelection = (count: number) => {
    setSelectedBotCount(count);
  };

  const handleModeSelection = (mode: "shared" | "individual") => {
    setSelectedMode(mode);
  };

  const handleStartGame = () => {
    if (selectedBotCount) {
      // Ustaw tryb gry w stanie
      game.state.mode = selectedMode;
      game.selectBots(selectedBotCount);
      setTimeout(() => {
        game.drawCard();
      }, 100);
    }
  };

  // v0.3.3 Handle shuffle for next bot
  const handleShuffleForNextBot = () => {
    game.nextBot();
    setTimeout(() => game.shuffleDeck(), 50); // Small delay to ensure bot switch happens first
  };

  const currentCardId = game.getCurrentCard();
  const currentCard =
    typeof currentCardId === "number"
      ? BOT_CARDS.find((card) => card.id === currentCardId + 1)
      : null;

  // Determine whether to show the top game status: only when bots are selected AND
  // the relevant deck (shared or current bot's deck) has at least one drawn card.
  const showGameStatus = (() => {
    if (!game.state.botsSelected) return false;
    if (game.state.mode === "individual") {
      if (!game.state.botDecks || !game.state.currentBot) return false;
      const idx =
        game.state.botDecks[game.state.currentBot - 1]?.currentCardIndex ?? -1;
      return typeof idx === "number" && idx >= 0;
    }
    const sharedIdx =
      typeof game.state.currentCardIndex === "number"
        ? game.state.currentCardIndex
        : -1;
    return sharedIdx >= 0;
  })();

  // v0.3.3 New game action logic - two buttons
  const getGameActions = () => {
    // During bot selection, no buttons are shown
    if (!game.state.botsSelected) {
      return { primary: null, secondary: null };
    }

    // Determine current index depending on mode
    let currentIndex = -1;
    if (
      game.state.mode === "individual" &&
      game.state.botDecks &&
      game.state.currentBot
    ) {
      const botDeck = game.state.botDecks[game.state.currentBot - 1];
      currentIndex = botDeck ? botDeck.currentCardIndex : -1;
    } else {
      currentIndex =
        typeof game.state.currentCardIndex === "number"
          ? game.state.currentCardIndex
          : -1;
    }

    // If no cards drawn yet for the current deck
    if (currentIndex === -1) {
      return { primary: null, secondary: null };
    }

    // Deck exhausted - two buttons: shuffle for current bot, or shuffle for next bot
    if (game.isDeckExhausted()) {
      return {
        primary: {
          text: `🔀 Przetasuj i dobierz kartę dla Bota ${game.state.currentBot}`,
          action: game.shuffleDeck,
          disabled: false,
          className: "btn-secondary",
        },
        secondary:
          game.state.botCount && game.state.botCount > 1
            ? {
                text: "👥 Przetasuj i dobierz dla następnego bota",
                action: handleShuffleForNextBot,
                disabled: false,
                className: "btn-secondary",
              }
            : null,
      };
    }

    // Normal game state - two action buttons
    return {
      primary: {
        text: `🎯 Dobierz kolejną kartę dla Bota ${game.state.currentBot}`,
        action: game.drawCard,
        disabled: false,
        className: "btn-primary",
      },
      secondary:
        game.state.botCount && game.state.botCount > 1
          ? {
              text: "👥 Dobierz kartę dla następnego Bota",
              action: game.nextBotAndDraw,
              disabled: false,
              className: "btn-secondary",
            }
          : null,
    };
  };

  const gameActions = getGameActions();

  return (
    <Layout title="Gra" backgroundType="game">
      <div className={styles.gameContainer}>
        <div className={styles.gameActive}>
          {/* Show game status only when cards are drawn (hide during bot selection and before first card) */}
          {showGameStatus && (
            <div className={styles.gameStatus}>
              <div className={styles.statusInfo}>
                <span className={styles.cardCounter}>
                  📊 Karta{" "}
                  {game.state.mode === "individual" &&
                  game.state.botDecks &&
                  game.state.currentBot
                    ? (game.state.botDecks[game.state.currentBot - 1]
                        ?.currentCardIndex ?? -1) + 1
                    : typeof game.state.currentCardIndex === "number"
                    ? game.state.currentCardIndex + 1
                    : 0}
                  /{BOT_CARDS.length}
                </span>
                <span className={styles.cardsLeft}>
                  🃏 Pozostało: {game.getCardsRemaining()}
                </span>
                {game.state.botCount && game.state.botCount > 1 && (
                  <div className={styles.botInfo}>
                    <div className={styles.currentBotIndicator}>
                      <span className={styles.botIndicatorText}>
                        🤖 Bot {game.state.currentBot}/{game.state.botCount}
                      </span>
                    </div>
                  </div>
                )}
                {game.isDeckExhausted() && (
                  <span className={styles.deckExhausted}>
                    🔔 Talia wyczerpana!
                  </span>
                )}
              </div>
            </div>
          )}

          <div className={styles.cardArea}>
            {currentCard ? (
              <BotCard card={currentCard} className={styles.currentCard} />
            ) : (
              <div className={styles.noCard}>
                {game.state.currentCardIndex === -1 ? (
                  // v0.3.2 Always show bot selection when no cards are drawn
                  <div className={styles.botSelection}>
                    <div className={styles.botSelectionContent}>
                      <h3>Wybierz liczbę botów</h3>
                      <p>Wybierz ile botów będzie brać udział w tej grze</p>
                      <div className={styles.botButtons}>
                        {[1, 2, 3, 4].map((count) => (
                          <button
                            key={count}
                            className={`${styles.botOption} ${
                              selectedBotCount === count ? styles.selected : ""
                            }`}
                            onClick={() => handleBotSelection(count)}
                          >
                            <span className={styles.botNumber}>{count}</span>
                            <span className={styles.botLabel}>
                              {count === 1 ? "bot" : "boty"}
                            </span>
                          </button>
                        ))}
                      </div>
                      {/* Show mode selection only when 2-4 bots selected */}
                      {selectedBotCount && selectedBotCount >= 2 ? (
                        <>
                          <h3>Wybierz tryb gry</h3>
                          <p>
                            Wybierz czy boty mają wspólną talię czy osobne talie
                          </p>
                          <div className={styles.modeButtons}>
                            <button
                              className={`${styles.modeOption} ${
                                selectedMode === "shared" ? styles.selected : ""
                              }`}
                              onClick={() => handleModeSelection("shared")}
                            >
                              Wspólna talia
                            </button>
                            <button
                              className={`${styles.modeOption} ${
                                selectedMode === "individual"
                                  ? styles.selected
                                  : ""
                              }`}
                              onClick={() => handleModeSelection("individual")}
                            >
                              Osobne talie
                            </button>
                          </div>
                        </>
                      ) : null}

                      <div className={styles.startGameSection}>
                        {selectedBotCount ? (
                          <p className={styles.selectedInfo}>
                            Wybrano: {selectedBotCount} bot
                            {selectedBotCount > 1 ? "y" : ""}, tryb:{" "}
                            {selectedMode === "shared"
                              ? "wspólna talia"
                              : "osobne talie"}
                          </p>
                        ) : (
                          <p className={styles.selectedInfo}>
                            Wybierz liczbę botów aby rozpocząć
                          </p>
                        )}
                        <button
                          className={`btn-primary ${styles.startGameButton}`}
                          onClick={handleStartGame}
                          disabled={!selectedBotCount}
                        >
                          🎯 Rozpocznij grę
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Deck exhausted
                  <>
                    <h3>Koniec talii</h3>
                    <p>Naciśnij przycisk, aby przetasować i kontynuować grę.</p>
                  </>
                )}
              </div>
            )}
          </div>

          <div className={styles.gameControls}>
            {gameActions.primary && (
              <button
                className={gameActions.primary.className}
                onClick={gameActions.primary.action}
                disabled={gameActions.primary.disabled}
              >
                {gameActions.primary.text}
              </button>
            )}
            {gameActions.secondary && (
              <button
                className={gameActions.secondary.className}
                onClick={gameActions.secondary.action}
                disabled={gameActions.secondary.disabled}
              >
                {gameActions.secondary.text}
              </button>
            )}
          </div>
        </div>

        <div className={styles.bottomControls}>
          <button className="btn-secondary" onClick={handleBackToMenu}>
            ← Wróć do menu
          </button>
          {(game.state.mode === "individual"
            ? game.state.botDecks && game.state.currentBot
              ? game.state.botDecks[game.state.currentBot - 1]
                  ?.currentCardIndex ?? -1
              : -1
            : typeof game.state.currentCardIndex === "number"
            ? game.state.currentCardIndex
            : -1) >= 0 && (
            <button className="btn-tertiary" onClick={handleCopyGameCode}>
              💾 Kopiuj stan gry
            </button>
          )}
        </div>

        {copyMessage && <div className={styles.copyMessage}>{copyMessage}</div>}
      </div>

      <ConfirmModal
        isOpen={showExitModal}
        message="🚪 Czy na pewno chcesz wyjść do głównego menu?"
        confirmText="💾 Tak, skopiuj stan gry i wyjdź"
        cancelText="Anuluj"
        onConfirm={confirmExitWithCopy}
        onCancel={cancelExit}
      />
    </Layout>
  );
};

export default Game;
