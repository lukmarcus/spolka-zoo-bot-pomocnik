import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import styles from "./About.module.css";
import gameCover from "../../assets/images/game/game-cover.jpg";
import coconutSaladLogo from "../../assets/images/logos/coconut-salad-logo.png";
import bggLogo from "../../assets/images/logos/bgg-logo.png";
import planszeoLogo from "../../assets/images/logos/planszeo-logo.png";
import facebookLogo from "../../assets/images/logos/facebook-logo.png";

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
          <div className={styles.gameInfoCompact}>
            autor gry: Mateusz Kiszło
          </div>
          <div className={styles.gameLinks}>
            <div className={styles.linksRow}>
              <a
                href="https://www.coconutsalad.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.logoButton}
                title="Coconut Salad"
              >
                <img
                  src={coconutSaladLogo}
                  alt="Coconut Salad"
                  className={styles.logoImage}
                />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100082443393992"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.logoButton}
                title="Facebook"
              >
                <img
                  src={facebookLogo}
                  alt="Facebook"
                  className={styles.logoImage}
                />
              </a>
              <a
                href="https://planszeo.pl/gry-planszowe/animal-fair"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.logoButton}
                title="Planszeo"
              >
                <img
                  src={planszeoLogo}
                  alt="Planszeo"
                  className={styles.logoImage}
                />
              </a>
              <a
                href="https://boardgamegeek.com/boardgame/402521/spolka-zoo"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.logoButton}
                title="BoardGameGeek"
              >
                <img
                  src={bggLogo}
                  alt="BoardGameGeek"
                  className={styles.logoImage}
                />
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
