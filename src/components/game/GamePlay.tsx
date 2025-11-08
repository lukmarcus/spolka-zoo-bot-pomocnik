import React, { useState } from "react";
import { useGame } from "@lib/GameContext";
import { BOT_CARDS } from "@lib/botCards";
import { copyGameCodeToClipboard } from "@lib/gameStorage";
import ConfirmModal from "@ui/ConfirmModal";
import styles from "./GamePlay.module.css";
import cardStyles from "@ui/BotCard.module.css";

interface GamePlayProps {
  onBackToMenu: () => void;
}

const GamePlay: React.FC<GamePlayProps> = ({ onBackToMenu }) => {
  const game = useGame();
  const [showExitModal, setShowExitModal] = useState(false);
  const [copyMessage, setCopyMessage] = useState<string>("");

  // v0.4.0 Handlers per-user spec:
  const handlePrimaryForCurrentBot = () => {
    if (game.isDeckExhausted()) {
      game.shuffleDeck(); // Shuffle the current bot's deck
      game.drawCard();
    } else {
      game.drawCard();
    }
  };

  const handleSecondaryForNextBot = () => {
    // Find the next bot in a rotational manner
    const nextBot = game.state.currentBot
      ? (game.state.currentBot % (game.state.botCount || 1)) + 1
      : 1;

    // If individual mode, check if the NEXT bot's deck is exhausted before switching
    if (game.state.mode === "individual") {
      const nextDeck = game.state.botDecks?.[nextBot - 1];
      const nextIdx = nextDeck?.currentCardIndex ?? -1;
      const nextExhausted = nextIdx >= BOT_CARDS.length - 1;

      // Switch to next bot first
      game.switchBot(nextBot);

      // If next bot's deck is exhausted after switching, shuffle then draw
      if (nextExhausted) {
        game.shuffleDeck(); // This shuffles the newly-active bot's deck
      }
      game.drawCard(); // Draw for the newly-active bot
    } else {
      // In shared mode, we switch to next bot and draw from shared deck
      // If the shared deck is exhausted, shuffle first
      if (game.isDeckExhausted()) {
        game.shuffleDeck();
      }
      game.switchBot(nextBot);
      game.drawCard();
    }
  };

  const handleCopyGameCode = async () => {
    try {
      const message = await copyGameCodeToClipboard(game.state);
      setCopyMessage(message);
      setTimeout(() => setCopyMessage(""), 2500);
    } catch {
      setCopyMessage("❌ Błąd kopiowania");
      setTimeout(() => setCopyMessage(""), 2500);
    }
  };

  const handleBackToMenuClick = () => {
    // Check if we're actually in a game (cards have been drawn)
    const inActiveGame =
      game.state.botsSelected &&
      ((game.state.mode === "individual" &&
        game.state.botDecks &&
        game.state.currentBot &&
        (game.state.botDecks[game.state.currentBot - 1]?.currentCardIndex ??
          -1) >= 0) ||
        (game.state.mode !== "individual" &&
          typeof game.state.currentCardIndex === "number" &&
          game.state.currentCardIndex >= 0));

    if (!inActiveGame) {
      // During bot selection or before any cards drawn, exit immediately without modal
      onBackToMenu();
      return;
    }

    // If in active game, show confirmation modal
    setShowExitModal(true);
  };

  const confirmExitWithCopy = async () => {
    try {
      await copyGameCodeToClipboard(game.state);
    } catch (error) {
      console.error("Error copying game code:", error);
    }
    setShowExitModal(false);
    onBackToMenu();
  };

  const confirmExitWithoutCopy = () => {
    setShowExitModal(false);
    onBackToMenu();
  };

  const cancelExit = () => {
    setShowExitModal(false);
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
        game.state.botCount && game.state.botCount > 1
          ? `Ten bot`
          : `Dobierz kartę`,
      action: handlePrimaryForCurrentBot,
      disabled: false,
      className: "btn-primary",
    };
    let secondary: {
      text: string;
      action: () => void;
      disabled: boolean;
      className: string;
    } | null = null;

    if (game.state.botCount && game.state.botCount > 1) {
      secondary = {
        text: `Następny bot`,
        action: handleSecondaryForNextBot,
        disabled: false,
        className: "btn-secondary",
      };
    }

    return { primary, secondary };
  };

  const gameActions = getGameActions();

  return (
    <>
      <div className="card">
        {showGameStatus && (
          <div className={styles.gameStatus}>
            <div className={styles.statusInfo}>
              <span className={styles.cardCounter}>
                {(game.state.mode === "individual"
                  ? game.state.botDecks && game.state.currentBot
                    ? (game.state.botDecks[game.state.currentBot - 1]
                        ?.currentCardIndex ?? -1) + 1
                    : 0
                  : typeof game.state.currentCardIndex === "number"
                  ? game.state.currentCardIndex + 1
                  : 0) +
                  "/" +
                  BOT_CARDS.length}
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
            </div>
          </div>
        )}

        <section className="section">
          <h2>DOBIERZ KARTĘ</h2>
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
        </section>

        {currentCard && (
          <section className="section">
            <h2>AKTUALNA KARTA</h2>
            {(() => {
              // Determine effect labels based on number of effects
              const getEffectLabel = (index: number, totalEffects: number) => {
                if (totalEffects === 1) {
                  return "EFEKT";
                } else {
                  if (index === 0) return "PIERWSZY EFEKT";
                  if (index === 1) return "DRUGI EFEKT";
                  return `EFEKT ${index + 1}`; // fallback for more than 2 effects
                }
              };

              // build sections array (effects + ability)
              const sections = currentCard.effects.map((effect, index) => ({
                key: `effect-${index}`,
                title: getEffectLabel(index, currentCard.effects.length),
                html: effect,
              }));

              sections.push({
                key: `ability`,
                title: "ZDOLNOSĆ DODATKOWA",
                html: currentCard.ability as string,
              });

              return sections.length > 1 ? (
                <div className={cardStyles.sections}>
                  {sections.map((s) => (
                    <div key={s.key} className={cardStyles.section}>
                      <h3 className={cardStyles.sectionTitle}>{s.title}</h3>
                      <p
                        className={cardStyles.sectionText}
                        dangerouslySetInnerHTML={{ __html: s.html }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                // single section - render directly to avoid unnecessary wrapper
                <div className={cardStyles.section}>
                  <h3 className={cardStyles.sectionTitle}>
                    {sections[0].title}
                  </h3>
                  <p
                    className={cardStyles.sectionText}
                    dangerouslySetInnerHTML={{ __html: sections[0].html }}
                  />
                </div>
              );
            })()}
          </section>
        )}
      </div>

      <div className="bottom-controls">
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
        <button className="btn-secondary" onClick={handleBackToMenuClick}>
          ← Wróć do menu
        </button>
      </div>

      {copyMessage && <div className={styles.copyMessage}>{copyMessage}</div>}

      <ConfirmModal
        isOpen={showExitModal}
        title="🚪 Wyjście z gry"
        message="Czy na pewno chcesz wyjść do głównego menu?"
        confirmText="💾 Skopiuj stan gry i wyjdź"
        copyButtonText="🚪 Wyjdź bez zapisu"
        cancelText="Anuluj"
        onConfirm={confirmExitWithCopy}
        onCopy={confirmExitWithoutCopy}
        onCancel={cancelExit}
      />
    </>
  );
};

export default GamePlay;
