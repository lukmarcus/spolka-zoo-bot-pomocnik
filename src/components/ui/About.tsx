import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import styles from "./About.module.css";
import gameCover from "../../assets/images/game/game-cover.jpg";
import coconutSaladLogo from "../../assets/images/logos/coconut-salad-logo.png";
import bggLogo from "../../assets/images/logos/bgg-logo.png";
import planszeoLogo from "../../assets/images/logos/planszeo-logo.png";
import facebookLogo from "../../assets/images/logos/facebook-logo.png";
import githubLogo from "../../assets/images/logos/github-logo.png";
import bugIcon from "../../assets/images/icons/bug.png";
import emailIcon from "../../assets/images/icons/email.png";
import changelogIcon from "../../assets/images/icons/changelog.png";

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
        <section className="section">
          <h2>SPÓŁKA ZOO</h2>
          <div className={styles.gameInfoCompact}>
            1-5 graczy • 45-90 min • od 10 lat
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
          <div className={styles.gameInfoCompact}>
            autor gry: Mateusz Kiszło
          </div>
          <div className={styles.gameCoverContainer}>
            <img
              src={gameCover}
              alt="Okładka gry Spółka ZOO"
              className={styles.gameCover}
            />
          </div>
        </section>

        {/* Sekcja o aplikacji */}
        <section className="section">
          <h2>BOT POMOCNIK</h2>
          <div className={styles.appInfo}>
            <div className={styles.gameInfoCompact}>autor: Marek Szumny</div>
          </div>
        </section>

        {/* Sekcja linków deweloperskich */}
        <section className="section">
          <div className={styles.developerInfo}>
            <div className={styles.devGrid}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  window.open(
                    "https://github.com/lukmarcus/spolka-zoo-bot-pomocnik",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
                aria-label="Kod źródłowy na GitHub (otworzy nową kartę)"
              >
                <img src={githubLogo} alt="GitHub" className={styles.icon} />
                GitHub
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  window.open(
                    "https://github.com/lukmarcus/spolka-zoo-bot-pomocnik/blob/main/CHANGELOG.md",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                <img
                  src={changelogIcon}
                  alt="Changelog"
                  className={styles.icon}
                />
                Changelog
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  window.open(
                    "https://github.com/lukmarcus/spolka-zoo-bot-pomocnik/issues/new",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
                aria-label="Zgłoś błąd lub sugestię (otworzy nową kartę)"
              >
                <img src={bugIcon} alt="Zgłoszenie" className={styles.icon} />
                Zgłoś błąd
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => window.open("mailto:lukmarcus@gmail.com")}
              >
                <img src={emailIcon} alt="Email" className={styles.icon} />
                Napisz
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Przycisk powrotu poza ramką */}
      <div className={styles.bottomControls}>
        <button className="btn-secondary" onClick={() => navigate("/")}>
          ← Wróć do menu
        </button>
      </div>
    </Layout>
  );
};

export default About;
