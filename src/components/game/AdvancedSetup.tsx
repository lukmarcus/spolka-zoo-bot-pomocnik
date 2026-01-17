import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@ui/Layout";
import BottomControls from "@ui/BottomControls";
import type { Player, PlayerColor, GameModules } from "@lib/types";
import { calculateBonusCoins } from "@lib/types";
import { useGame } from "@lib/GameContext";
import setupStyles from "@game/GameSetup.module.css";
import styles from "@game/AdvancedSetup.module.css";
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
  const game = useGame();
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, playerNumber: 1, color: "red", isBot: false },
    { id: 2, playerNumber: 2, color: "yellow", isBot: true },
  ]);
  const [selectedMode, setSelectedMode] = useState<"shared" | "individual">(
    "shared"
  );
  const [selectedModules, setSelectedModules] = useState<GameModules>({
    hiddenGoals: false,
    intrigues: false,
  });

  // Wczytaj poprzednią konfigurację jeśli gra była już uruchomiona
  useEffect(() => {
    if (game.state.gameMode === "advanced" && game.state.players && game.state.players.length > 0) {
      setPlayers(game.state.players);
      setSelectedMode(game.state.mode || "shared");
      setSelectedModules(game.state.modules || { hiddenGoals: false, intrigues: false });
    }
  }, []);

  const handleAddPlayer = () => {
    if (players.length < 5) {
      const usedColors = players.map((p) => p.color);
      const nextColor =
        AVAILABLE_COLORS.find((c) => !usedColors.includes(c)) ||
        AVAILABLE_COLORS[players.length % AVAILABLE_COLORS.length];

      setPlayers((prev) => [
        ...prev,
        {
          id: Math.max(...prev.map((p) => p.id)) + 1,
          playerNumber: prev.length + 1,
          color: nextColor,
          isBot: true,
        },
      ]);
    }
  };

  const handleRemovePlayer = () => {
    if (players.length > 2) {
      setPlayers((prev) => prev.slice(0, -1));
    }
  };

  const handleColorChange = (playerId: number, newColor: PlayerColor) => {
    setPlayers((prev) => {
      const otherPlayerWithColor = prev.find(
        (p) => p.id !== playerId && p.color === newColor
      );

      if (otherPlayerWithColor) {
        const currentPlayerColor = prev.find((p) => p.id === playerId)!.color;
        return prev.map((p) => {
          if (p.id === playerId) return { ...p, color: newColor };
          if (p.id === otherPlayerWithColor.id)
            return { ...p, color: currentPlayerColor };
          return p;
        });
      } else {
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
    game.startAdvancedGame(players, selectedMode, selectedModules);
    navigate("/advanced-game");
  };

  const botCount = players.filter((p) => p.isBot).length;

  return (
    <Layout
      backgroundType="game"
      title="TRYB ZAAWANSOWANY"
      subtitle="Konfiguracja gry 🚧"
    >
      <div className="card">
        <section className="section">
          <h2>KONFIGURACJA GRACZY</h2>

          <div className={styles.playerControls}>
            <span className={styles.playerCountLabel}>Liczba graczy:</span>
            <span className={styles.playerCount}>{players.length}</span>
            <button
              className={styles.playerButton}
              onClick={handleRemovePlayer}
              disabled={players.length <= 2}
              style={{ opacity: players.length <= 2 ? 0.5 : 1 }}
            >
              −
            </button>
            <button
              className={styles.playerButton}
              onClick={handleAddPlayer}
              disabled={players.length >= 5}
              style={{ opacity: players.length >= 5 ? 0.5 : 1 }}
            >
              +
            </button>
          </div>

          {players.map((player) => (
            <div key={player.id} className={styles.playerCard}>
              <div className={styles.playerHeader}>
                <span className={styles.playerLabel}>Gracz {player.id}:</span>
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

          {botCount === 0 ? (
            <section className="section">
              <div className={styles.noBotWarning}>
                <p>⚠️ Musisz wybrać przynajmniej jednego bota</p>
                <p className={styles.warningSubtext}>
                  Przełącz dowolnego gracza na "Bot" za pomocą przełącznika
                </p>
              </div>
            </section>
          ) : (
            <>
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

              <section className="section">
                <button className="btn-primary" onClick={handleStartGame}>
                  Rozpocznij grę
                </button>
              </section>
            </>
          )}
        </section>
      </div>

      <BottomControls onBackClick={() => navigate("/")} />
    </Layout>
  );
};

export default AdvancedGame;
