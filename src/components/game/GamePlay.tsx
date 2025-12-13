import React, { useState } from "react";
import { useGame } from "@lib/GameContext";
import { BOT_CARDS } from "@lib/botCards";
import { copyGameCodeToClipboard } from "@lib/gameStorage";
import ConfirmModal from "@ui/ConfirmModal";
import EndRoundModal from "@ui/EndRoundModal";
import BottomControls from "@ui/BottomControls";
import styles from "@game/GamePlay.module.css";

interface GamePlayProps {
  onBackToMenu: () => void;
}

const GamePlay: React.FC<GamePlayProps> = ({ onBackToMenu }) => {
  const game = useGame();
  const [showExitModal, setShowExitModal] = useState(false);
  const [showEndRoundModal, setShowEndRoundModal] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"none" | "success" | "error">(
    "none"
  );
  const [buttonCopyStatus, setButtonCopyStatus] = useState<
    "idle" | "copied" | "error"
  >("idle");

  const handlePrimaryForCurrentBot = () => {
    if (game.isDeckExhausted()) {
      game.shuffleDeck();
      game.drawCard();
    } else {
      game.drawCard();
    }
  };

  const handleSecondaryForNextBot = () => {
    const nextBot = game.state.currentBot
      ? (game.state.currentBot % (game.state.botCount || 1)) + 1
      : 1;

    if (game.state.mode === "individual") {
      const nextDeck = game.state.botDecks?.[nextBot - 1];
      const nextIdx = nextDeck?.currentCardIndex ?? -1;
      const nextExhausted = nextIdx >= BOT_CARDS.length - 1;

      game.switchBot(nextBot);

      if (nextExhausted) {
        game.shuffleDeck();
      }
      game.drawCard();
    } else {
      if (game.isDeckExhausted()) {
        game.shuffleDeck();
      }
      game.switchBot(nextBot);
      game.drawCard();
    }
  };

  const isGameInProgress =
    game.state.botsSelected &&
    ((game.state.mode === "individual" &&
      game.state.botDecks &&
      game.state.currentBot &&
      (game.state.botDecks[game.state.currentBot - 1]?.currentCardIndex ??
        -1) >= 0) ||
      (game.state.mode !== "individual" &&
        typeof game.state.currentCardIndex === "number" &&
        game.state.currentCardIndex >= 0));

  const handleBackToMenuClick = () => {
    if (!isGameInProgress) {
      onBackToMenu();
      return;
    }

    setShowExitModal(true);
    setCopyStatus("none");
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
    } catch {
      setCopyStatus("error");
    }
  };

  const handleCopyGameCode = async () => {
    try {
      await copyGameCodeToClipboard(game.state);
      setButtonCopyStatus("copied");
      setTimeout(() => setButtonCopyStatus("idle"), 2500);
    } catch {
      setButtonCopyStatus("error");
      setTimeout(() => setButtonCopyStatus("idle"), 2500);
    }
  };

  const handleEndRound = (selectedBot: number) => {
    game.endRound(selectedBot);
    setShowEndRoundModal(false);
  };

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

  const getGameActions = () => {
    if (!game.state.botsSelected) {
      return { primary: null, secondary: null };
    }

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

    if (currentIndex === -1) {
      return { primary: null, secondary: null };
    }

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
            {isGameInProgress && (
              <button
                className={`btn-secondary ${styles.endRoundButton}`}
                onClick={() => setShowEndRoundModal(true)}
              >
                Koniec rundy
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

      <BottomControls
        onBackClick={handleBackToMenuClick}
        showCopyButton={
          (game.state.mode === "individual"
            ? game.state.botDecks && game.state.currentBot
              ? game.state.botDecks[game.state.currentBot - 1]
                  ?.currentCardIndex ?? -1
              : -1
            : typeof game.state.currentCardIndex === "number"
            ? game.state.currentCardIndex
            : -1) >= 0
        }
        onCopyClick={handleCopyGameCode}
        copyButtonDisabled={buttonCopyStatus === "copied"}
        copyButtonLabel={
          buttonCopyStatus === "copied"
            ? "✅ Skopiowano!"
            : buttonCopyStatus === "error"
            ? "❌ Błąd!"
            : "Kopiuj stan gry"
        }
      />

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

      <EndRoundModal
        isOpen={showEndRoundModal}
        botCount={game.state.botCount || 1}
        onConfirm={handleEndRound}
        onCancel={() => setShowEndRoundModal(false)}
      />
    </>
  );
};

export default GamePlay;
