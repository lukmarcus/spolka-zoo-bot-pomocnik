import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@ui/Layout";
import BottomControls from "@ui/BottomControls";
import type { Player, PlayerColor, GameModules } from "@lib/types";
import { calculateBonusCoins } from "@lib/types";
import setupStyles from "@game/GameSetup.module.css";
import styles from "@game/AdvancedGame.module.css";
import moneyIcon from "@images/interface/money.png";

const AVAILABLE_COLORS: PlayerColor[] = [
  "red",
  "yellow",
  "green",
  "orange",
  "blue",
];

const COLOR_BACKGROUNDS: Record<PlayerColor, string> = {
  red: "#da4833",
  yellow: "#f3ba3a",
  green: "#80ac48",
  orange: "#eb7433",
  blue: "#89c2cf",
};

const AdvancedGame: React.FC = () => {
  const navigate = useNavigate();
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedMode, setSelectedMode] = useState<"shared" | "individual">(
    "shared"
  );
  const [selectedModules, setSelectedModules] = useState<GameModules>({
    hiddenGoals: false,
    intrigues: false,
  });

  const handleConfirmCount = () => {
    // Inicjalizuj graczy na podstawie wybranej liczby
    const initialPlayers: Player[] = Array.from(
      { length: playerCount },
      (_, i) => ({
        id: i + 1,
        color: AVAILABLE_COLORS[i % AVAILABLE_COLORS.length],
        isBot: i > 0,
      })
    );
    setPlayers(initialPlayers);
    setIsConfigured(true);
  };

  const handleChangeCount = () => {
    setPlayers([]);
    setIsConfigured(false);
  };

  const handleColorChange = (playerId: number, newColor: PlayerColor) => {
    setPlayers((prev) => {
      // Sprawdź czy inny gracz ma już ten kolor
      const otherPlayerWithColor = prev.find(
        (p) => p.id !== playerId && p.color === newColor
      );

      if (otherPlayerWithColor) {
        // Zamień kolory między graczami
        const currentPlayerColor = prev.find((p) => p.id === playerId)!.color;
        return prev.map((p) => {
          if (p.id === playerId) return { ...p, color: newColor };
          if (p.id === otherPlayerWithColor.id)
            return { ...p, color: currentPlayerColor };
          return p;
        });
      } else {
        // Normalnie zmień kolor
        return prev.map((p) =>
          p.id === playerId ? { ...p, color: newColor } : p
        );
      }
    });
  };

  const handleBotToggle = (playerId: number) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, isBot: !p.isBot } : p))
    );
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
    // TODO: Uruchomienie gry z konfiguracją graczy
    console.log("Starting game with:", {
      players,
      mode: selectedMode,
      modules: selectedModules,
    });
  };

  // Policz boty
  const botCount = players.filter((p) => p.isBot).length;

  return (
    <Layout
      backgroundType="game"
      title="TRYB ZAAWANSOWANY"
      subtitle="Konfiguracja gry 🚧"
    >
      <div className="card">
        <section className="section">
          {/* Sekcja wyboru liczby graczy - zawsze widoczna */}
          <div style={{ marginBottom: isConfigured ? "1.5rem" : "0" }}>
            <h2>LICZBA WSZYSTKICH GRACZY</h2>
            <div className={setupStyles.botButtons}>
              {[2, 3, 4, 5].map((count) => (
                <button
                  key={count}
                  className={`${setupStyles.botOption} ${
                    playerCount === count ? setupStyles.selected : ""
                  }`}
                  onClick={() => setPlayerCount(count)}
                  disabled={isConfigured}
                  style={{
                    opacity: isConfigured ? 0.6 : 1,
                    cursor: isConfigured ? "not-allowed" : "pointer",
                    padding: "1rem",
                  }}
                >
                  <span className={setupStyles.botNumber}>{count}</span>
                  <span className={setupStyles.botLabel}>graczy</span>
                </button>
              ))}
            </div>

            {!isConfigured && (
              <div className={styles.continueButton}>
                <button className="btn-primary" onClick={handleConfirmCount}>
                  Dalej
                </button>
              </div>
            )}
          </div>

          {/* Sekcja konfiguracji graczy - pokazuje się po kliknięciu Dalej */}
          {isConfigured && (
            <>
              <h2>KONFIGURACJA GRACZY</h2>
              <div className={styles.changeCountButton}>
                <button className="btn-secondary" onClick={handleChangeCount}>
                  Zmień liczbę graczy
                </button>
              </div>

              {players.map((player) => (
                <div key={player.id} className={styles.playerCard}>
                  <div className={styles.playerHeader}>
                    <span className={styles.playerLabel}>
                      Gracz {player.id}:
                    </span>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={player.isBot}
                        onChange={() => handleBotToggle(player.id)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                    <span className={styles.playerType}>
                      {player.isBot ? "Bot" : "Człowiek"}
                    </span>
                  </div>

                  <div className={styles.colorSection}>
                    <span className={styles.colorLabel}>Kolor:</span>
                    <div className={styles.colorButtons}>
                      {AVAILABLE_COLORS.map((color) => (
                        <button
                          key={color}
                          className={`${styles.colorButton} ${
                            player.color === color ? styles.selected : ""
                          }`}
                          onClick={() => handleColorChange(player.id, color)}
                          style={{
                            backgroundColor: COLOR_BACKGROUNDS[color],
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Wybór trybu gry */}
              <section className="section">
                <h2>TRYB GRY</h2>
                <div className={setupStyles.modeButtons}>
                  {botCount === 1 ? (
                    <button
                      className={`${setupStyles.modeOption} ${setupStyles.selected}`}
                      disabled
                    >
                      Jedna talia
                    </button>
                  ) : (
                    <>
                      <button
                        className={`${setupStyles.modeOption} ${
                          selectedMode === "shared" ? setupStyles.selected : ""
                        }`}
                        onClick={() => handleModeSelection("shared")}
                      >
                        Wspólna talia
                      </button>
                      <button
                        className={`${setupStyles.modeOption} ${
                          selectedMode === "individual"
                            ? setupStyles.selected
                            : ""
                        }`}
                        onClick={() => handleModeSelection("individual")}
                      >
                        Osobne talie
                      </button>
                    </>
                  )}
                </div>
              </section>

              {/* Wybór modułów */}
              <section className="section">
                <h2>DODATKOWE MODUŁY</h2>
                <div className={setupStyles.moduleButtons}>
                  <label
                    className={`${setupStyles.moduleOption} ${
                      selectedModules.hiddenGoals ? setupStyles.selected : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedModules.hiddenGoals}
                      onChange={() => handleModuleToggle("hiddenGoals")}
                      className={setupStyles.moduleCheckbox}
                    />
                    <span className={setupStyles.moduleLabel}>Ukryte Cele</span>
                  </label>
                  <label
                    className={`${setupStyles.moduleOption} ${
                      selectedModules.intrigues ? setupStyles.selected : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedModules.intrigues}
                      onChange={() => handleModuleToggle("intrigues")}
                      className={setupStyles.moduleCheckbox}
                    />
                    <span className={setupStyles.moduleLabel}>Intrygi</span>
                  </label>
                </div>
                <div className={setupStyles.moduleSummary}>
                  <p className={setupStyles.summaryLine}>
                    Wybrano: {players.length} gracz
                    {players.length > 1 ? "y" : ""}
                    {" ("}
                    {players.filter((p) => p.isBot).length} bot
                    {players.filter((p) => p.isBot).length !== 1 ? "y" : ""}
                    {")"}
                    {botCount > 1 ? (
                      <>
                        ,{" "}
                        {selectedMode === "shared"
                          ? "wspólna talia"
                          : "osobne talie"}
                      </>
                    ) : null}
                  </p>
                  {(selectedModules.hiddenGoals ||
                    selectedModules.intrigues) && (
                    <p className={setupStyles.summaryLine}>
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
              </section>

              <div className={styles.startGameButton}>
                <button className="btn-primary" onClick={handleStartGame}>
                  Rozpocznij grę
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      <BottomControls onBackClick={() => navigate("/")} />
    </Layout>
  );
};

export default AdvancedGame;
