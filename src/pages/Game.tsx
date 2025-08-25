import React, { useEffect, useState } from "react";
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

  // Auto-start game when component mounts (if needed)
  useEffect(() => {
    // Ensure game is started - fallback for direct navigation
    if (game.state.cardSequence.length === 0) {
      game.newGame();
    }
  }, [game]);

  const handleBackToMenu = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    setShowExitModal(false);
    game.resetGame(); // Reset game state before returning to menu
    navigate("/");
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
          <div className={styles.gameStatus}>
            <div className={styles.statusInfo}>
              <span className={styles.cardCounter}>
                {game.state.currentCardIndex === -1
                  ? `0/${BOT_CARDS.length}`
                  : `${game.state.currentCardIndex + 1}/${BOT_CARDS.length}`}
              </span>
            </div>
          </div>

          <div className={styles.cardArea}>
            {currentCard ? (
              <BotCard card={currentCard} className={styles.currentCard} />
            ) : (
              <div className={styles.noCard}>
                {game.state.currentCardIndex === -1 ? (
                  <div className={styles.cardReverse}>
                    <img
                      src={cardReverseImg}
                      alt="Zakryty stos kart"
                      className={styles.cardReverseImage}
                    />
                    <h3>Gotowy do gry</h3>
                    <p>Naciśnij przycisk, aby wylosować pierwszą kartę.</p>
                  </div>
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
        message="Czy na pewno wrócić do głównego menu? Stan gry zostanie utracony."
        confirmText="Tak"
        cancelText="Nie"
        onConfirm={confirmExit}
        onCancel={cancelExit}
        copyButtonText={
          game.state.currentCardIndex >= 0 ? "Kopiuj stan gry" : undefined
        }
        onCopy={
          game.state.currentCardIndex >= 0 ? handleCopyGameCode : undefined
        }
      />
    </Layout>
  );
};

export default Game;
