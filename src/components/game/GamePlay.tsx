import React, { useState } from "react";
import { useGame } from "@lib/GameContext";
import { BOT_CARDS } from "@lib/botCards";
import { copyGameCodeToClipboard } from "@lib/gameStorage";
import ConfirmModal from "@ui/ConfirmModal";
import styles from "./GamePlay.module.css";

interface GamePlayProps {
  onBackToMenu: () => void;
}

const GamePlay: React.FC<GamePlayProps> = ({ onBackToMenu }) => {
  const game = useGame();
  const [showExitModal, setShowExitModal] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"none" | "success" | "error">(
    "none"
  );
  const [buttonCopyStatus, setButtonCopyStatus] = useState<
    "idle" | "copied" | "error"
  >("idle");

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
    setCopyStatus("none"); // Reset copy status when modal opens
  };

  const confirmExitWithoutCopy = () => {
    setShowExitModal(false);
    onBackToMenu();
  };

  const cancelExit = () => {
    setShowExitModal(false);
  };

  const copyGameCode = async () => {
    try {
      await copyGameCodeToClipboard(game.state);
      setCopyStatus("success");
    } catch (error) {
      console.error("Error copying game code:", error);
      setCopyStatus("error");
    }
  };

  const handleCopyGameCode = async () => {
    try {
      await copyGameCodeToClipboard(game.state);
      setButtonCopyStatus("copied");
      setTimeout(() => setButtonCopyStatus("idle"), 2500);
    } catch (error) {
      console.error("Error copying game code:", error);
      setButtonCopyStatus("error");
      setTimeout(() => setButtonCopyStatus("idle"), 2500);
    }
  };

  // Generate modal message with copy status
  const getModalMessage = () => {
    const baseMessage = "Czy na pewno chcesz wyjść z gry do menu?";

    if (copyStatus === "none") {
      return `${baseMessage}\nPamiętaj o skopiowaniu stanu gry!`;
    } else if (copyStatus === "success") {
      return `${baseMessage}\n✅ Skopiowano stan gry!`;
    } else {
      return `${baseMessage}\n❌ Nie udało się skopiować stanu gry!`;
    }
  };

  const currentCardId = game.getCurrentCard();
  const currentCard =
    typeof currentCardId === "number"
      ? BOT_CARDS.find((card) => card.id === currentCardId + 1)
      : null;

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
          ? `Dla tego bota (${game.state.currentBot}/${game.state.botCount})`
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
      const nextBot = game.state.currentBot
        ? (game.state.currentBot % (game.state.botCount || 1)) + 1
        : 1;
      secondary = {
        text: `Dla następnego bota (${nextBot}/${game.state.botCount})`,
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
        <section
          className="section"
          style={
            game.state.botCount && game.state.botCount > 1
              ? {}
              : { paddingTop: "0.75rem" }
          }
        >
          {game.state.botCount && game.state.botCount > 1 && (
            <h2>DOBIERZ KARTĘ</h2>
          )}
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
            <h2>
              AKTUALNA KARTA (
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
              )
            </h2>
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

              return (
                <>
                  {sections.map((s) => (
                    <React.Fragment key={s.key}>
                      <h3>{s.title}</h3>
                      <div className="card-content">
                        <p dangerouslySetInnerHTML={{ __html: s.html }} />
                      </div>
                    </React.Fragment>
                  ))}
                </>
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
          <button
            className="btn-tertiary"
            onClick={handleCopyGameCode}
            disabled={buttonCopyStatus === "copied"}
          >
            {buttonCopyStatus === "copied"
              ? "✅ Skopiowano!"
              : buttonCopyStatus === "error"
              ? "❌ Błąd!"
              : "Kopiuj stan gry"}
          </button>
        )}
        <button className="btn-secondary" onClick={handleBackToMenuClick}>
          ← Wróć do menu
        </button>
      </div>

      <ConfirmModal
        isOpen={showExitModal}
        title="WYJŚCIE Z GRY"
        message={getModalMessage()}
        confirmText="Wyjdź"
        copyButtonText="Kopiuj stan gry"
        cancelText="Anuluj"
        onConfirm={confirmExitWithoutCopy}
        onCopy={copyGameCode}
        onCancel={cancelExit}
      />
    </>
  );
};

export default GamePlay;
