import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { BOT_CARDS } from "../data/botCards";
import Layout from "../components/Layout";
import BotCard from "../components/BotCard";
import styles from "./Game.module.css";

const Game: React.FC = () => {
  const navigate = useNavigate();
  const game = useGame();

  // Auto-start game when component mounts
  useEffect(() => {
    if (!game.isGameStarted()) {
      game.newGame();
    }
  }, [game]);

  const handleBackToMenu = () => {
    const confirmLeave = window.confirm(
      "Czy na pewno chcesz wrócić do menu? Niezapisane dane zostaną utracone."
    );

    if (confirmLeave) {
      navigate("/");
    }
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
    <Layout title="Gra">
      <div className={styles.gameContainer}>
        <div className={styles.gameActive}>
          <div className={styles.gameStatus}>
            <div className={styles.statusInfo}>
              <span className={styles.cardCounter}>
                {game.state.currentCardIndex === -1
                  ? `0/${BOT_CARDS.length}`
                  : `${game.state.currentCardIndex + 1}/${BOT_CARDS.length}`}
              </span>
              {game.state.shuffleCount > 0 && (
                <span className={styles.shuffleInfo}>
                  Przetasowano: {game.state.shuffleCount}x
                </span>
              )}
            </div>
          </div>

          <div className={styles.cardArea}>
            {currentCard ? (
              <BotCard card={currentCard} className={styles.currentCard} />
            ) : (
              <div className={styles.noCard}>
                {game.state.currentCardIndex === -1 ? (
                  <>
                    <h3>Gotowy do gry</h3>
                    <p>Naciśnij przycisk, aby wylosować pierwszą kartę.</p>
                  </>
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
            ← Powrót do menu
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Game;
