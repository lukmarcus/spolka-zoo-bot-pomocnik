import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@ui/Layout";
import type { Player, PlayerColor } from "@lib/types";
import styles from "@game/GameSetup.module.css";

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
            <h2>LICZBA GRACZY</h2>
            <div className={styles.botButtons}>
              {[2, 3, 4, 5].map((count) => (
                <button
                  key={count}
                  className={`${styles.botOption} ${
                    playerCount === count ? styles.selected : ""
                  }`}
                  onClick={() => setPlayerCount(count)}
                  disabled={isConfigured}
                  style={{
                    opacity: isConfigured ? 0.6 : 1,
                    cursor: isConfigured ? "not-allowed" : "pointer",
                  }}
                >
                  <span className={styles.botNumber}>{count}</span>
                  <span className={styles.botLabel}>
                    {count === 2
                      ? "graczy"
                      : count === 3 || count === 4
                      ? "graczy"
                      : "graczy"}
                  </span>
                </button>
              ))}
            </div>

            {!isConfigured && (
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "center",
                }}
              >
                <button className="btn-primary" onClick={handleConfirmCount}>
                  Dalej
                </button>
              </div>
            )}

            {isConfigured && (
              <div style={{ textAlign: "center" }}>
                <button
                  className="btn-secondary"
                  onClick={handleChangeCount}
                  style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}
                >
                  Zmień liczbę graczy
                </button>
              </div>
            )}
          </div>

          {/* Sekcja konfiguracji graczy - pokazuje się po kliknięciu Dalej */}
          {isConfigured && (
            <>
              <h2 style={{ marginBottom: "1rem" }}>KONFIGURACJA GRACZY</h2>
              <table
                style={{
                  width: "100%",
                  marginBottom: "1rem",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <th style={{ padding: "0.5rem", textAlign: "left" }}>
                      Gracz
                    </th>
                    <th style={{ padding: "0.5rem", textAlign: "center" }}>
                      Bot
                    </th>
                    <th style={{ padding: "0.5rem", textAlign: "left" }}>
                      Kolor
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr
                      key={player.id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <td style={{ padding: "0.5rem" }}>
                        <strong>Gracz {player.id}</strong>
                      </td>
                      <td style={{ padding: "0.5rem", textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={player.isBot}
                          onChange={() => handleBotToggle(player.id)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                      <td style={{ padding: "0.5rem" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.25rem",
                            flexWrap: "wrap",
                          }}
                        >
                          {AVAILABLE_COLORS.map((color) => (
                            <button
                              key={color}
                              onClick={() =>
                                handleColorChange(player.id, color)
                              }
                              style={{
                                flex: "1 1 auto",
                                minWidth: "40px",
                                height: "40px",
                                backgroundColor: COLOR_BACKGROUNDS[color],
                                border:
                                  player.color === color
                                    ? "3px solid #fff"
                                    : "2px solid rgba(255,255,255,0.3)",
                                borderRadius: "4px",
                                cursor: "pointer",
                                transition: "all 0.2s",
                              }}
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "center",
                }}
              >
                <button className="btn-primary" onClick={handleStartGame}>
                  Rozpocznij grę
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      <button className="btn-secondary" onClick={() => navigate("/")}>
        Powrót do menu
      </button>
    </Layout>
  );
};

export default AdvancedGame;
