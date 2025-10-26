import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { useGame } from "@lib/GameContext";
import styles from "./Home.module.css";
import gameLogo from "../../assets/images/game-logo.png";

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
      title: "ROZPOCZNIJ GRĘ",
      description: "Uruchom boty z kartami",
      action: handleStartGame,
      primary: true,
    },
    {
      id: "load-game",
      title: "WCZYTAJ STAN GRY",
      description: "Użyj zapisanego kodu stanu gry",
      action: () => navigate("/load"),
      disabled: false,
    },
    {
      id: "about",
      title: "O GRZE I APLIKACJI",
      description: "Informacje i linki",
      action: () => navigate("/about"),
      disabled: false,
    },
  ];

  return (
    <Layout
      backgroundType="home"
      title="BOT POMOCNIK"
      subtitle="Cyfrowy zamiennik dla kart botów"
      logo={<img src={gameLogo} alt="Spółka ZOO" className={styles.gameLogo} />}
    >
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
