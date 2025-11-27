import React, { useState } from "react";
import { useGame } from "@lib/GameContext";
import type { GameModules } from "@lib/types";
import { calculateBonusCoins } from "@lib/types";
import styles from "./GameSetup.module.css";
import moneyIcon from "@images/interface/money.png";

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
  const [selectedModules, setSelectedModules] = useState<GameModules>({
    hiddenGoals: false,
    intrigues: false,
  });

  const handleBotSelection = (count: number) => {
    setSelectedBotCount(count);
  };

  const handleModeSelection = (mode: "shared" | "individual") => {
    setSelectedMode(mode);
  };

  const handleModuleToggle = (module: keyof GameModules) => {
    setSelectedModules((prev) => ({
      ...prev,
      [module]: !prev[module],
    }));
  };

  const handleStartGame = () => {
    if (selectedBotCount) {
      game.state.mode = selectedMode;
      game.state.modules = selectedModules;
      game.selectBots(selectedBotCount);
      setTimeout(() => {
        game.drawCard();
        onGameStart();
      }, 100);
    }
  };

  return (
    <>
      <div className="card">
        <section className="section">
          <h2>LICZBA BOTÓW</h2>
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
        </section>

        {/* Mode selection section */}
        {selectedBotCount && (
          <section className="section">
            <h2>TRYB GRY</h2>
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
          </section>
        )}

        {/* Modules selection section */}
        {selectedBotCount && (
          <section className="section">
            <h2>DODATKOWE MODUŁY</h2>
            <div className={styles.moduleButtons}>
              <label
                className={`${styles.moduleOption} ${
                  selectedModules.hiddenGoals ? styles.selected : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedModules.hiddenGoals}
                  onChange={() => handleModuleToggle("hiddenGoals")}
                  className={styles.moduleCheckbox}
                />
                <span className={styles.moduleLabel}>Ukryte Cele</span>
              </label>
              <label
                className={`${styles.moduleOption} ${
                  selectedModules.intrigues ? styles.selected : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedModules.intrigues}
                  onChange={() => handleModuleToggle("intrigues")}
                  className={styles.moduleCheckbox}
                />
                <span className={styles.moduleLabel}>Intrygi</span>
              </label>
            </div>
            {selectedBotCount && (
              <div className={styles.moduleSummary}>
                <p className={styles.summaryLine}>
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
                {(selectedModules.hiddenGoals || selectedModules.intrigues) && (
                  <p className={styles.summaryLine}>
                    <strong>+{calculateBonusCoins(selectedModules)}</strong>
                    <img
                      src={moneyIcon}
                      alt="monet"
                      className="card-icon"
                      style={{ margin: "0 0.25rem" }}
                    />
                    dla każdego bota
                  </p>
                )}
              </div>
            )}
          </section>
        )}

        {/* Start game section */}
        <section className="section">
          {!selectedBotCount && (
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
        </section>
      </div>

      <div className="bottom-controls">
        <button className="btn-secondary" onClick={onBackToMenu}>
          ← Wróć do menu
        </button>
      </div>
    </>
  );
};

export default GameSetup;
