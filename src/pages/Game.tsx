import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import styles from "./Game.module.css";

const Game: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToMenu = () => {
    const confirmLeave = window.confirm(
      "Czy na pewno chcesz wrócić do menu? Niezapisane dane zostaną utracone."
    );

    if (confirmLeave) {
      navigate("/");
    }
  };

  return (
    <Layout title="Gra">
      <div className={styles.gameContainer}>
        <div className={styles.placeholder}>
          <h2 className={styles.placeholderTitle}>Ekran gry w budowie</h2>
          <p className={styles.placeholderText}>
            Mechanika kart i botów będzie dostępna w wersji 0.1.0
          </p>

          <div className={styles.preview}>
            <div className={styles.mockCard}>
              <div className={styles.mockCardHeader}>
                <h3>Bot #1</h3>
                <span className={styles.mockCounter}>Karta 1/13</span>
              </div>

              <div className={styles.mockCardContent}>
                <h4>Karta Bota #1</h4>
                <div className={styles.mockEffect}>
                  <strong>Efekt:</strong> Lorem ipsum dolor sit amet consectetur
                </div>
                <div className={styles.mockAbility}>
                  <strong>Zdolność:</strong> Adipiscing elit sed do eiusmod
                </div>
              </div>

              <div className={styles.mockActions}>
                <button className="btn-primary" disabled>
                  Dobierz następną kartę
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.gameControls}>
          <button className="btn-secondary" onClick={handleBackToMenu}>
            ← Powrót do menu
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Game;
