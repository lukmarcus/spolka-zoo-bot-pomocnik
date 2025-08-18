import React from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { BOT_CARDS } from "../data/botCards";
import Layout from "../components/Layout";
import BotCard from "../components/BotCard";
import styles from "./Game.module.css";

const Game: React.FC = () => {
  const navigate = useNavigate();
  const game = useGame();

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

  return (
    <Layout title="Gra">
      <div className={styles.gameContainer}>
        {!game.isGameStarted() ? (
          <div className={styles.gameStart}>
            <h2 className={styles.startTitle}>Spółka ZOO Bot Pomocnik</h2>
            <p className={styles.startDescription}>
              Kliknij "Rozpocznij grę" aby przetasować talię i wylosować
              pierwszą kartę bota.
            </p>
            <button className="btn-primary" onClick={game.newGame}>
              🎲 Rozpocznij grę
            </button>
          </div>
        ) : (
          <div className={styles.gameActive}>
            <div className={styles.gameStatus}>
              <div className={styles.statusInfo}>
                <span className={styles.cardCounter}>
                  Karta {game.state.currentCardIndex + 1}/{BOT_CARDS.length}
                </span>
                <span className={styles.remainingCards}>
                  Pozostało: {game.getCardsRemaining()}
                </span>
              </div>

              {game.state.shuffleCount > 0 && (
                <span className={styles.shuffleInfo}>
                  Przetasowano: {game.state.shuffleCount}x
                </span>
              )}
            </div>

            <div className={styles.cardArea}>
              {currentCard ? (
                <BotCard card={currentCard} className={styles.currentCard} />
              ) : (
                <div className={styles.noCard}>
                  <h3>Koniec talii</h3>
                  <p>Wszystkie karty zostały wykorzystane.</p>
                </div>
              )}
            </div>

            <div className={styles.gameControls}>
              <button
                className="btn-primary"
                onClick={game.drawCard}
                disabled={game.isDeckExhausted()}
              >
                {game.isDeckExhausted()
                  ? "Talia wyczerpana"
                  : "🎯 Dobierz następną kartę"}
              </button>

              <button className="btn-secondary" onClick={game.shuffleDeck}>
                🔀 Przetasuj talię
              </button>

              <button className="btn-outline" onClick={game.resetGame}>
                🔄 Reset gry
              </button>
            </div>
          </div>
        )}

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
