import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { BOT_CARDS } from "../data/botCards";
import { copyGameCodeToClipboard } from "../utils/gameStorage";
import Layout from "../components/Layout";
import BotCard from "../components/BotCard";
import ConfirmModal from "../components/ConfirmModal";
import styles from "./Game.module.css";
import cardReverseImg from "../assets/images/interface/card-reverse.jpg";

const Game: React.FC = () => {
  const navigate = useNavigate();
  const game = useGame();
  const [showExitModal, setShowExitModal] = useState(false);
  const [copyMessage, setCopyMessage] = useState<string>("");

  // Auto-start game when component mounts (temporarily disabled to debug infinite re-renders)
  // useEffect(() => {
  //   // Ensure game is started - fallback for direct navigation
  //   if (game.state.cardSequence.length === 0) {
  //     game.newGame();
  //   }
  // }, [game.state.cardSequence.length, game.newGame]);

  const handleBackToMenu = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    setShowExitModal(false);
    game.resetGame(); // Reset game state before returning to menu
    navigate("/");
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

  const currentCardId = game.getCurrentCard();
  const currentCard =
    currentCardId !== null
      ? BOT_CARDS.find((card) => card.id === currentCardId + 1)
      : null;

  // Determine primary action button state
  const getPrimaryAction = () => {
    const currentIndex = game.state.currentCardIndex;
    const totalCards = BOT_CARDS.length;

    // Stan początkowy - brak wylosowanej karty (0/13)
    if (currentIndex === -1) {
      // v0.3.0+ Check if bots are selected
      if (!game.state.botsSelected) {
        return {
          text: "🤖 Wybierz liczbę botów",
          action: () => {}, // Disabled - will show bot selection UI instead
          disabled: true,
          className: "btn-secondary",
        };
      }

      return {
        text: "🎯 Dobierz pierwszą kartę",
        action: game.drawCard,
        disabled: false,
        className: "btn-primary",
      };
    }

    // Ostatnia karta (12/13 - indeks 11)
    if (currentIndex === totalCards - 2) {
      return {
        text: "🎯 Dobierz ostatnią kartę",
        action: game.drawCard,
        disabled: false,
        className: "btn-primary",
      };
    }

    // Talia wyczerpana (13/13 - wszystkie karty dobrane)
    if (game.isDeckExhausted()) {
      return {
        text: "🔀 Przetasuj i dobierz kartę",
        action: game.shuffleDeck,
        disabled: false,
        className: "btn-secondary",
      };
    }

    // Stan normalny (1-11/13)
    return {
      text: "🎯 Dobierz następną kartę",
      action: game.drawCard,
      disabled: false,
      className: "btn-primary",
    };
  };

  const primaryAction = getPrimaryAction();

  return (
    <Layout title="Gra" backgroundType="game">
      <div className={styles.gameContainer}>
        <div className={styles.gameActive}>
          {/* Show game status only when cards are drawn (hide during bot selection and before first card) */}
          {game.state.botsSelected && game.state.currentCardIndex >= 0 && (
            <div className={styles.gameStatus}>
              <div className={styles.statusInfo}>
                <span className={styles.cardCounter}>
                  {`${game.state.currentCardIndex + 1}/${BOT_CARDS.length}`}
                </span>
                {game.state.botsSelected &&
                  game.state.botCount &&
                  game.state.botCount > 1 && (
                    <div className={styles.botInfo}>
                      <span>
                        Bot {game.state.currentBot}/{game.state.botCount}
                      </span>
                      <div className={styles.botSwitcher}>
                        {Array.from(
                          { length: game.state.botCount },
                          (_, i) => i + 1
                        ).map((botNumber) => (
                          <button
                            key={botNumber}
                            className={`${styles.botButton} ${
                              game.state.currentBot === botNumber
                                ? styles.active
                                : ""
                            }`}
                            onClick={() => game.switchBot(botNumber)}
                            title={`Przełącz na Bot ${botNumber}`}
                          >
                            {botNumber}
                          </button>
                        ))}
                      </div>
                    </div>
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
                  !game.state.botsSelected ? (
                    // v0.3.0+ Bot selection UI
                    <div className={styles.botSelection}>
                      <h3>Wybierz liczbę botów</h3>
                      <p>Wybierz ile botów będzie grać w tej rozgrywce</p>
                      <div className={styles.botButtons}>
                        {[1, 2, 3, 4].map((count) => (
                          <button
                            key={count}
                            className="btn-primary"
                            onClick={() => game.selectBots(count)}
                          >
                            {count} {count === 1 ? "bot" : "boty"}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Ready to start game
                    <div className={styles.cardReverse}>
                      <img
                        src={cardReverseImg}
                        alt="Zakryty stos kart"
                        className={styles.cardReverseImage}
                      />
                      <h3>Gotowy do gry</h3>
                      <p>
                        {game.state.botCount === 1
                          ? "1 bot, jedna talia"
                          : `${game.state.botCount} boty, wspólna talia`}
                      </p>
                      <p>Naciśnij przycisk, aby wylosować pierwszą kartę.</p>
                    </div>
                  )
                ) : (
                  <>
                    <h3>Koniec talii</h3>
                    <p>Naciśnij przycisk, aby przetasować i kontynuować grę.</p>
                  </>
                )}
              </div>
            )}
          </div>

          <div className={styles.gameControls}>
            <button
              className={primaryAction.className}
              onClick={primaryAction.action}
              disabled={primaryAction.disabled}
            >
              {primaryAction.text}
            </button>
          </div>
        </div>

        <div className={styles.bottomControls}>
          <button className="btn-secondary" onClick={handleBackToMenu}>
            ← Wróć do menu
          </button>
          {game.state.currentCardIndex >= 0 && (
            <button className="btn-tertiary" onClick={handleCopyGameCode}>
              📋 Kopiuj stan gry
            </button>
          )}
        </div>

        {copyMessage && <div className={styles.copyMessage}>{copyMessage}</div>}
      </div>

      <ConfirmModal
        isOpen={showExitModal}
        message="Czy na pewno chcesz wyjść do głównego menu?"
        confirmText={
          game.state.currentCardIndex >= 0
            ? "📋 Tak, skopiuj stan gry i wyjdź"
            : "Tak, wyjdź"
        }
        cancelText="Anuluj"
        onConfirm={
          game.state.currentCardIndex >= 0 ? confirmExitWithCopy : confirmExit
        }
        onCancel={cancelExit}
      />
    </Layout>
  );
};

export default Game;
