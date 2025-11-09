import React, { useState } from "react";
import { useGame } from "@lib/GameContext";
import styles from "./GameSetup.module.css";

interface GameSetupProps {
  onGameStart: () => void;
  onBackToMenu: () => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onGameStart, onBackToMenu }) => {
  const game = useGame();
  const [selectedBotCount, setSelectedBotCount] = useState<number | null>(null);
  const [selectedMode, setSelectedMode] = useState<"shared" | "individual">(
    "shared"
  );

  const handleBotSelection = (count: number) => {
    setSelectedBotCount(count);
  };

  const handleModeSelection = (mode: "shared" | "individual") => {
    setSelectedMode(mode);
  };

  const handleStartGame = () => {
    if (selectedBotCount) {
      // Ustaw tryb gry w stanie
      game.state.mode = selectedMode;
      game.selectBots(selectedBotCount);
      setTimeout(() => {
        game.drawCard();
        onGameStart();
      }, 100);
    }
  };

  return (
    <div>
      <div className="card">
        <section className="section">
          <h2>KONFIGURACJA GRY</h2>

          <h3>LICZBA BOTÓW</h3>
          <div className={styles.botButtons}>
            {[1, 2, 3, 4].map((count) => (
              <button
                key={count}
                className={`${styles.botOption} ${
                  selectedBotCount === count ? styles.selected : ""
                }`}
                onClick={() => handleBotSelection(count)}
              >
                <span className={styles.botNumber}>{count}</span>
                <span className={styles.botLabel}>
                  {count === 1 ? "bot" : "boty"}
                </span>
              </button>
            ))}
          </div>

          {/* Mode selection section */}
          {selectedBotCount && (
            <div>
              <h3>TRYB GRY</h3>
              <div className={styles.modeButtons}>
                {selectedBotCount === 1 ? (
                  <button
                    className={`${styles.modeOption} ${styles.selected}`}
                    disabled
                  >
                    Jedna talia
                  </button>
                ) : (
                  <>
                    <button
                      className={`${styles.modeOption} ${
                        selectedMode === "shared" ? styles.selected : ""
                      }`}
                      onClick={() => handleModeSelection("shared")}
                    >
                      Wspólna talia
                    </button>
                    <button
                      className={`${styles.modeOption} ${
                        selectedMode === "individual" ? styles.selected : ""
                      }`}
                      onClick={() => handleModeSelection("individual")}
                    >
                      Osobne talie
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Start game section */}
          <div>
            {selectedBotCount ? (
              <p className={styles.selectedInfo}>
                Wybrano: {selectedBotCount} bot
                {selectedBotCount > 1 ? "y" : ""}
                {selectedBotCount > 1 ? (
                  <>
                    ,{" "}
                    {selectedMode === "shared"
                      ? "wspólna talia"
                      : "osobne talie"}
                  </>
                ) : null}
              </p>
            ) : (
              <p className={styles.selectedInfo}>
                Wybierz ustawienia, aby rozpocząć
              </p>
            )}

            <button
              className={`btn-primary ${styles.startGameButton}`}
              onClick={handleStartGame}
              disabled={!selectedBotCount}
            >
              Rozpocznij grę
            </button>
          </div>
        </section>
      </div>

      <div className="bottom-controls">
        <button className="btn-secondary" onClick={onBackToMenu}>
          ← Wróć do menu
        </button>
      </div>
    </div>
  );
};

export default GameSetup;
