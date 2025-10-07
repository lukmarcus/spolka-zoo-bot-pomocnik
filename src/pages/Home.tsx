import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import LoadGameModal from "../components/LoadGameModal";
import { useGame } from "../context/GameContext";
import type { GameState } from "../types";
import styles from "./Home.module.css";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { loadGame, newGame } = useGame();
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);

  const handleStartGame = () => {
    newGame(); // Always start fresh game
    navigate("/game");
  };

  const menuOptions = [
    {
      id: "start-game",
      title: "Rozpocznij grę",
      description: "Uruchom boty z kartami",
      action: handleStartGame,
      primary: true,
    },
    {
      id: "load-game",
      title: "Wczytaj stan gry",
      description: "Użyj zapisanego kodu stanu gry",
      action: () => setIsLoadModalOpen(true),
      disabled: false,
    },
  ];

  return (
    <Layout backgroundType="home">
      <div className={styles.hero}>
        <h2 className={styles.heroTitle}>Bot Pomocnik</h2>
        <p className={styles.heroDescription}>
          Cyfrowy zamiennik dla kart botów w grze planszowej{" "}
          <strong>Spółka ZOO</strong>. Zarządzaj 1-4 botami, przełączaj między
          nimi i zapisuj stan gry.
        </p>
      </div>

      <div className={styles.menu}>
        {menuOptions.map((option) => (
          <button
            key={option.id}
            className={`${styles.menuButton} ${
              option.primary ? styles.primary : styles.secondary
            }`}
            onClick={option.action}
            disabled={option.disabled}
          >
            <div className={styles.menuButtonContent}>
              <h3 className={styles.menuButtonTitle}>{option.title}</h3>
              <p className={styles.menuButtonDescription}>
                {option.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      <LoadGameModal
        isOpen={isLoadModalOpen}
        onClose={() => setIsLoadModalOpen(false)}
        onLoadGame={(gameState: GameState) => {
          loadGame(gameState);
          setIsLoadModalOpen(false);
          navigate("/game");
        }}
      />
    </Layout>
  );
};

export default Home;
