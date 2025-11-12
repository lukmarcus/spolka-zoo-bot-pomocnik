import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { useGame } from "@lib/GameContext";
import styles from "./Home.module.css";
import gameLogo from "../../assets/images/game/game-logo.png";

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
      title: "O GRZE I O APLIKACJI",
      description: "Informacje i linki",
      action: () => navigate("/about"),
      disabled: false,
    },
  ];

  return (
    <Layout
      backgroundType="home"
      title="BOT POMOCNIK"
      subtitle="Oficjalny cyfrowy zamiennik dla kart botów"
      logo={<img src={gameLogo} alt="Spółka ZOO" className={styles.gameLogo} />}
    >
      {menuOptions.map((option) => (
        <button
          key={option.id}
          className={`${styles.menuButton} ${
            option.primary ? styles.primary : styles.secondary
          }`}
          onClick={option.action}
          disabled={option.disabled}
        >
          <div className={styles.menuButtonTitle}>{option.title}</div>
          <p className={styles.menuButtonDescription}>{option.description}</p>
        </button>
      ))}
    </Layout>
  );
};

export default Home;
