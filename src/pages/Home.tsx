import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import LoadGameModal from "../components/LoadGameModal";
import { useGame } from "../context/GameContext";
import type { GameState } from "../types";
import styles from "./Home.module.css";
import packageJson from "../../package.json";

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
      title: "Wczytaj grę",
      description: "Użyj kodu gry",
      action: () => setIsLoadModalOpen(true),
      disabled: false,
    },
    {
      id: "settings",
      title: "Ustawienia",
      description: "Liczba botów, tryb gry",
      action: () => {
        // TODO: Implementation in future version
        alert("Funkcja będzie dostępna w przyszłej wersji");
      },
      disabled: true,
    },
  ];

  return (
    <Layout backgroundType="home">
      <div className={styles.hero}>
        <h2 className={styles.heroTitle}>Bot Pomocnik</h2>
        <p className={styles.heroDescription}>
          Cyfrowy zamiennik dla kart botów w grze planszowej Spółka ZOO.
          Zarządzaj 1-4 botami, przełączaj między nimi i udostępniaj stan gry.
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

      <div className={styles.info}>
        <div className={styles.infoCard}>
          <h4>Wersja {packageJson.version}</h4>
          <ul className={styles.featureList}>
            <li>✅ Podstawowa nawigacja</li>
            <li>✅ Layout z kolorami z instrukcji</li>
            <li>✅ Poprawki responsywności</li>
            <li>✅ WCAG 320px compliance</li>
            <li>✅ Mechanika kart (v0.1.0)</li>
            <li>✅ Zapis/wczytywanie (v0.2.0)</li>
            <li>✅ Cross-device kody gry (v0.2.1)</li>
            <li>✅ Uproszczone kopiowanie (v0.2.2)</li>
            <li>✅ Multi-bot support (v0.3.0)</li>
            <li>⏳ Osobne talie botów (v0.4.0+ roadmap)</li>
          </ul>
        </div>
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
