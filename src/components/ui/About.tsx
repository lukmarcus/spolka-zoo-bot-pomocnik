import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@ui/Layout";
import BottomControls from "@ui/BottomControls";
import styles from "@ui/About.module.css";
import gameCover from "@images/game/game-cover.jpg";
import coconutSaladLogo from "@images/logos/coconut-salad-logo.png";
import bggLogo from "@images/logos/bgg-logo.png";
import planszeoLogo from "@images/logos/planszeo-logo.png";
import facebookLogo from "@images/logos/facebook-logo.png";
import githubLogo from "@images/logos/github-logo.png";
import bugIcon from "@images/icons/bug.png";
import emailIcon from "@images/icons/email.png";
import changelogIcon from "@images/icons/changelog.png";

const About: React.FC = React.memo(() => {
  const navigate = useNavigate();

  const handleNavigateHome = useCallback(() => navigate("/"), [navigate]);

  return (
    <Layout
      backgroundType="home"
      title="INFORMACJE"
      subtitle="O grze planszowej i o aplikacji"
    >
      <div className="card">
        {/* Game section */}
        <section className="section">
          <h2>SPÓŁKA ZOO</h2>
          <div className="info-box">1-5 graczy • 45-90 min • od 10 lat</div>
          <div className={styles.linksRow}>
            <a
              href="https://www.coconutsalad.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-logo"
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
              className="btn-logo"
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
              className="btn-logo"
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
              className="btn-logo"
              title="BoardGameGeek"
            >
              <img
                src={bggLogo}
                alt="BoardGameGeek"
                className={styles.logoImage}
              />
            </a>
          </div>
          <div className="info-box">autor gry: Mateusz Kiszło</div>
          <div className={styles.gameCoverContainer}>
            <img
              src={gameCover}
              alt="Okładka gry Spółka ZOO"
              className={styles.gameCover}
            />
          </div>
        </section>

        {/* Application section */}
        <section className="section">
          <h2>BOT POMOCNIK</h2>
          <div className="info-box">autor: Marek Szumny</div>

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
        </section>
      </div>

      {/* Back button outside frame */}
      <BottomControls onBackClick={handleNavigateHome} />
    </Layout>
  );
});

About.displayName = "About";

export default About;
