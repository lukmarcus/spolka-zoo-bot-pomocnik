import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import styles from "./About.module.css";
import gameCover from "../../assets/images/game-cover.jpg";

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout
      backgroundType="home"
      title="INFORMACJE"
      subtitle="O grze planszowej i o aplikacji"
    >
      <div className={styles.aboutCard}>
        {/* Sekcja o grze */}
        <section className={styles.section}>
          <h2>SPÓŁKA ZOO</h2>
          <div className={styles.gameInfoCompact}>
            1-5 graczy • 45-90 min • od 10 lat
          </div>
          <div className={styles.gameCoverContainer}>
            <img
              src={gameCover}
              alt="Okładka gry Spółka ZOO"
              className={styles.gameCover}
            />
          </div>
          <div className={styles.gameInfo}>
            <div className={styles.gameDetails}>
              <a
                href="https://boardgamegeek.com/boardgame/402521/spolka-zoo"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.detail} ${styles.linkDetail}`}
              >
                <span className={styles.label}>BoardGameGeek:</span>
                <span>Zobacz na BGG →</span>
              </a>
              <a
                href="https://planszeo.pl/gry-planszowe/animal-fair"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.detail} ${styles.linkDetail}`}
              >
                <span className={styles.label}>Planszeo:</span>
                <span>Zobacz na Planszeo →</span>
              </a>
              <a
                href="https://www.coconutsalad.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.detail} ${styles.linkDetail}`}
              >
                <span className={styles.label}>Wydawca:</span>
                <span>Coconut Salad →</span>
              </a>
            </div>
          </div>
        </section>

        {/* Sekcja o aplikacji */}
        <section className={styles.section}>
          <h2>BOT POMOCNIK</h2>
          <div className={styles.appInfo}>
            <p>
              Bot Pomocnik to cyfrowy zamiennik dla kart botów w grze Spółka
              ZOO. Aplikacja pozwala na łatwe zarządzanie kartami AI podczas gry
              solo lub z mniejszą liczbą graczy.
            </p>
            <div className={styles.features}>
              <h3>Funkcje aplikacji:</h3>
              <ul>
                <li>Losowanie i zarządzanie kartami botów</li>
                <li>Zapisywanie i wczytywanie stanu gry</li>
                <li>Intuicyjny interfejs dostosowany do gry</li>
                <li>Responsywny design dla urządzeń mobilnych</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Sekcja linków deweloperskich */}
        <section className={styles.section}>
          <h2>Deweloper i wsparcie</h2>
          <div className={styles.developerInfo}>
            <p>
              Aplikacja została stworzona z pasji do gier planszowych i
              programowania.
            </p>
            <div className={styles.links}>
              <a
                href="https://github.com/lukmarcus/spolka-zoo-bot-pomocnik"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.externalLink}
              >
                📦 Kod źródłowy na GitHub
              </a>
              <a
                href="https://github.com/lukmarcus/spolka-zoo-bot-pomocnik/issues"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.externalLink}
              >
                🐛 Zgłoś błąd lub sugestię
              </a>
            </div>
          </div>
        </section>

        {/* Przycisk powrotu */}
        <div className={styles.bottomControls}>
          <button className="btn-secondary" onClick={() => navigate("/")}>
            Powrót do menu głównego
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default About;
