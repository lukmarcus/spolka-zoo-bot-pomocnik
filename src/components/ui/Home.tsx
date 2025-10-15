import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { useGame } from "@lib/GameContext";
import styles from "./Home.module.css";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { newGame } = useGame();

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
      action: () => navigate("/load"),
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
    </Layout>
  );
};

export default Home;
