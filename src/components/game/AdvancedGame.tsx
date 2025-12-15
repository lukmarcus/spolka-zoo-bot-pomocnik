import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@ui/Layout";
import BottomControls from "@ui/BottomControls";
import type { Player, PlayerColor } from "@lib/types";
import setupStyles from "@game/GameSetup.module.css";
import styles from "@game/AdvancedGame.module.css";

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

  const handleColorChange = (playerId: number, color: PlayerColor) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, color } : p))
    );
  };

  const handleBotToggle = (playerId: number) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, isBot: !p.isBot } : p))
    );
  };

  const handleStartGame = () => {
    // TODO: Uruchomienie gry z konfiguracją graczy
    console.log("Starting game with players:", players);
  };

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
              <table className={styles.configTable}>
                <thead>
                  <tr>
                    <th>Gracz</th>
                    <th className={styles.center}>Bot</th>
                    <th>Kolor</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.id}>
                      <td>
                        <strong>Gracz {player.id}</strong>
                      </td>
                      <td className={styles.center}>
                        <input
                          type="checkbox"
                          checked={player.isBot}
                          onChange={() => handleBotToggle(player.id)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                      <td>
                        <div className={styles.colorButtons}>
                          {AVAILABLE_COLORS.map((color) => (
                            <button
                              key={color}
                              className={`${styles.colorButton} ${
                                player.color === color ? styles.selected : ""
                              }`}
                              onClick={() =>
                                handleColorChange(player.id, color)
                              }
                              style={{
                                backgroundColor: COLOR_BACKGROUNDS[color],
                              }}
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

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
