import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import styles from "./Home.module.css";
import packageJson from "../../package.json";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const menuOptions = [
    {
      id: "start-game",
      title: "Rozpocznij grę",
      description: "Uruchom boty z kartami",
      action: () => navigate("/game"),
      primary: true,
    },
    {
      id: "load-game",
      title: "Wczytaj grę",
      description: "Użyj kodu gry",
      action: () => {
        // TODO: Implementation in v0.2.0
        alert("Funkcja będzie dostępna w wersji 0.2.0");
      },
      disabled: true,
    },
    {
      id: "settings",
      title: "Ustawienia",
      description: "Liczba botów, tryb gry",
      action: () => {
        // TODO: Implementation in v0.3.0
        alert("Funkcja będzie dostępna w wersji 0.3.0");
      },
      disabled: true,
    },
  ];

  return (
    <Layout>
      <div className={styles.hero}>
        <h2 className={styles.heroTitle}>Bot Pomocnik</h2>
        <p className={styles.heroDescription}>
          Cyfrowy zamiennik dla kart botów w grze planszowej Spółka ZOO.
          Zarządzaj 1-4 botami, ich kartami i stanem gry.
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
            <li>⏳ Mechanika kart (v0.1.0)</li>
            <li>⏳ Zapis/wczytywanie (v0.2.0)</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
