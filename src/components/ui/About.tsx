import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import styles from "./About.module.css";

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout
      backgroundType="home"
      title="INFORMACJE"
      subtitle="O grze i aplikacji"
    >
      <div className={styles.aboutContainer}>
        <div className={styles.aboutCard}>
          {/* Sekcja o grze */}
          <section className={styles.section}>
            <h2>O grze Spółka ZOO</h2>
            <div className={styles.gameInfo}>
              <p>
                <strong>Spółka ZOO</strong> to strategiczna gra planszowa dla
                2-4 graczy, w której zarządzasz zoo i konkurujesz z innymi
                graczami o najlepsze zwierzęta i atrakcje.
              </p>
              <div className={styles.gameDetails}>
                <div className={styles.detail}>
                  <span className={styles.label}>Liczba graczy:</span>
                  <span>2-4</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.label}>Czas gry:</span>
                  <span>60-90 minut</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.label}>Wiek:</span>
                  <span>12+</span>
                </div>
              </div>
              <div className={styles.links}>
                <a
                  href="https://boardgamegeek.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.externalLink}
                >
                  Zobacz na BoardGameGeek
                </a>
              </div>
            </div>
          </section>

          {/* Sekcja o aplikacji */}
          <section className={styles.section}>
            <h2>O aplikacji Bot Pomocnik</h2>
            <div className={styles.appInfo}>
              <p>
                Bot Pomocnik to cyfrowy zamiennik dla kart botów w grze Spółka
                ZOO. Aplikacja pozwala na łatwe zarządzanie kartami AI podczas
                gry solo lub z mniejszą liczbą graczy.
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
      </div>
    </Layout>
  );
};

export default About;
