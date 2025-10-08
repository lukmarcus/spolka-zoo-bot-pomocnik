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

  // v0.4.0 Handlers per-user spec:
  // Primary: act on CURRENT bot - draw if possible, otherwise shuffle this bot (which also draws)
  const handlePrimaryForCurrentBot = () => {
    if (game.state.mode === "individual") {
      if (game.isDeckExhausted()) {
        // current bot exhausted -> reshuffle this bot (shuffleDeck sets currentCardIndex = 0)
        game.shuffleDeck();
      } else {
        // draw next card for current bot
        game.drawCard();
      }
    } else {
      // shared mode: if shared deck exhausted -> reshuffle shared deck, otherwise draw
      if (game.isDeckExhausted()) {
        game.shuffleDeck();
      } else {
        game.drawCard();
      }
    }
  };

  // Secondary: act on NEXT bot - always ensure the next bot ends up with a drawn card.
  const handleSecondaryForNextBot = () => {
    if (!game.state.botCount || game.state.botCount <= 1) return;

    const nextBot = game.state.currentBot
      ? (game.state.currentBot % game.state.botCount) + 1
      : 1;

    if (game.state.mode === "individual") {
      const nextDeck = game.state.botDecks?.[nextBot - 1];
      const nextIdx = nextDeck?.currentCardIndex ?? -1;
      const nextExhausted = nextIdx >= BOT_CARDS.length - 1;

      if (nextExhausted) {
        // Use atomic action: switch to next bot, reshuffle its deck, and draw
        game.nextBotAndShuffleAndDraw?.();
      } else {
        // Draw for next bot (this action will switch bot and draw)
        game.nextBotAndDraw();
      }
    } else {
      // shared mode: use atomic action when exhausted
      if (game.isDeckExhausted()) {
        game.nextBotAndShuffleAndDraw?.();
      } else {
        game.nextBotAndDraw();
      }
    }
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

    // Decide button semantics according to the user's specification.
    // Primary: operate on CURRENT bot (draw or shuffle+draw when exhausted)
    // Secondary: operate on NEXT bot (draw or switch+shuffle+draw when exhausted)
    const primary = {
      text:
        game.state.mode === "individual"
          ? game.isDeckExhausted()
            ? `🔀 Przetasuj talię tego Bota i dobierz kartę`
            : `🎯 Dobierz kartę dla Bota ${game.state.currentBot}`
          : game.isDeckExhausted()
          ? `🔀 Przetasuj talię i dobierz kartę`
          : `🎯 Dobierz kartę`,
      action: handlePrimaryForCurrentBot,
      disabled: false,
      className: game.isDeckExhausted() ? "btn-secondary" : "btn-primary",
    };

    let secondary = null;
    if (game.state.botCount && game.state.botCount > 1) {
      // compute next bot exhaustion state for labeling
      const nextBot = game.state.currentBot
        ? (game.state.currentBot % game.state.botCount) + 1
        : 1;
      const nextDeck = game.state.botDecks?.[nextBot - 1];
      const nextIdx = nextDeck?.currentCardIndex ?? -1;
      const nextExhausted = nextIdx >= BOT_CARDS.length - 1;

      secondary = {
        text:
          game.state.mode === "individual"
            ? nextExhausted
              ? `👥 Przetasuj talię następnego bota i dobierz dla niego kartę`
              : `👥 Dobierz kartę dla następnego Bota`
            : game.isDeckExhausted()
            ? `👥 Przetasuj i dobierz dla następnego bota`
            : `👥 Dobierz kartę dla następnego Bota`,
        action: handleSecondaryForNextBot,
        disabled: false,
        className: "btn-secondary",
      };
    }

    return { primary, secondary };
  };

  const gameActions = getGameActions();

  // Dynamic title based on game state
  const pageTitle = game.state.botsSelected ? "Gra w toku" : "Rozpocznij grę";

  // Dynamic subtitle based on game state
  const getPageSubtitle = () => {
    if (!game.state.botsSelected) {
      return "Wybierz liczbę botów i tryb gry";
    }

    const botCount = game.state.botCount || 0;
    const botText = botCount === 1 ? "bot" : "boty";

    if (botCount === 1) {
      return `${botCount} ${botText}`;
    } else {
      const modeText =
        game.state.mode === "shared" ? "wspólna talia" : "osobne talie";
      return `${botCount} ${botText} • ${modeText}`;
    }
  };

  return (
    <Layout
      title={pageTitle}
      subtitle={getPageSubtitle()}
      backgroundType="game"
    >
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
                {/* Remaining cards info removed by user request */}
                {game.state.botCount && game.state.botCount > 1 && (
                  <div className={styles.botInfo}>
                    <div className={styles.currentBotIndicator}>
                      <span className={styles.botIndicatorText}>
                        🤖 Bot {game.state.currentBot}/{game.state.botCount}
                      </span>
                    </div>
                  </div>
                )}
                {/* Deck exhausted visual notification removed per user request */}
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
                      <h2>Liczba botów</h2>
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
                      {/* Show mode selection - hidden for single bot to maintain layout */}
                      <div
                        className={`${styles.modeSection} ${
                          selectedBotCount && selectedBotCount >= 2
                            ? styles.visible
                            : styles.hidden
                        }`}
                      >
                        <h2>Tryb gry</h2>
                        <div className={styles.modeButtons}>
                          <button
                            className={`${styles.modeOption} ${
                              selectedMode === "shared" ? styles.selected : ""
                            }`}
                            onClick={() => handleModeSelection("shared")}
                            disabled={selectedBotCount === 1}
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
                            disabled={selectedBotCount === 1}
                          >
                            Osobne talie
                          </button>
                        </div>
                      </div>

                      <div className={styles.startGameSection}>
                        {selectedBotCount ? (
                          <p className={styles.selectedInfo}>
                            Wybrano: {selectedBotCount} bot
                            {selectedBotCount > 1 ? "y" : ""}
                            {selectedBotCount > 1 ? (
                              <>
                                ,{" "}
                                {selectedMode === "shared"
                                  ? "wspólna talia"
                                  : "osobne talie"}
                              </>
                            ) : null}
                          </p>
                        ) : (
                          <p className={styles.selectedInfo}>
                            Najpierw wybierz liczbę botów
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
