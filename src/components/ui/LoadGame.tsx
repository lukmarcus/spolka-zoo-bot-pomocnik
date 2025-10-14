// LoadGame - Full-screen component for loading game state from code
// Converted from LoadGameModal to provide better UX and responsive design

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import styles from "./LoadGame.module.css";
import { loadFromShareableCode, previewGameCode } from "@lib/gameStorage";
import { useGame } from "@lib/GameContext";
import type { GameCodePreview } from "@lib/types";

export default function LoadGame() {
  const navigate = useNavigate();
  const { loadGame } = useGame();
  const [gameCode, setGameCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gamePreview, setGamePreview] = useState<GameCodePreview | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.toUpperCase();
    const inputElement = e.target;
    const cursorPosition = inputElement.selectionStart;

    // Filter only allowed characters: 0-9, A-Z (but only 0-9,A-C are valid in the data part)
    const filteredValue = rawValue.replace(/[^0-9A-Z]/g, "");

    setGameCode(filteredValue);
    setError(null);

    // Restore cursor position after filtering
    setTimeout(() => {
      if (inputElement && cursorPosition !== null) {
        inputElement.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);

    // Validate from the first character
    if (filteredValue.length === 0) {
      // No error for empty input
      setGamePreview(null);
      return;
    }

    // Validate format (supports ZS, ZM, ZP formats)
    if (filteredValue.length >= 1 && !filteredValue.startsWith("Z")) {
      setGamePreview(null);
      setError(
        "Prawidłowy format: ZS (single-bot), ZM (multi-shared), ZP (per-bot)"
      );
      return;
    }

    if (filteredValue.length >= 2) {
      const prefix = filteredValue.substring(0, 2);
      if (prefix !== "ZS" && prefix !== "ZM" && prefix !== "ZP") {
        setGamePreview(null);
        setError(
          "Prawidłowy format: ZS (single-bot), ZM (multi-shared), ZP (per-bot)"
        );
        return;
      }
    }

    if (filteredValue.length >= 3) {
      const prefix = filteredValue.substring(0, 3);
      if (
        !prefix.startsWith("ZS") &&
        !prefix.startsWith("ZM") &&
        !prefix.startsWith("ZP")
      ) {
        setGamePreview(null);
        setError(
          "Prawidłowy format: ZS (single-bot), ZM (multi-shared), ZP (per-bot)"
        );
        return;
      }
    }

    // Check for invalid characters in data part
    if (filteredValue.length > 2) {
      let dataPart = "";

      if (filteredValue.startsWith("ZS")) {
        dataPart = filteredValue.substring(2);
      } else if (filteredValue.startsWith("ZM")) {
        dataPart = filteredValue.substring(2);
      } else if (filteredValue.startsWith("ZP")) {
        dataPart = filteredValue.substring(2);
      }

      if (dataPart.length > 0) {
        let invalidChars = "";
        if (filteredValue.startsWith("ZM") || filteredValue.startsWith("ZP")) {
          // ZM and ZP formats allow Z separator: [0-9A-C]+Z[0-9A-C]*
          invalidChars = dataPart.replace(/[0-9A-CZ]/g, "");
        } else {
          // ZS format only allows 0-9,A-C
          invalidChars = dataPart.replace(/[0-9A-C]/g, "");
        }

        if (invalidChars.length > 0) {
          setGamePreview(null);
          setError(
            "Prawidłowy format: ZS/ZM/ZP + 0-9,A-C (ZM/ZP z separatorem Z)"
          );
          return;
        }
      }
    }

    // Preview game state if code is potentially complete
    let shouldPreview = false;
    if (filteredValue.startsWith("ZS") && filteredValue.length >= 3) {
      shouldPreview = true; // ZS format can be short
    } else if (filteredValue.startsWith("ZM") && filteredValue.length >= 5) {
      shouldPreview = true; // ZM format needs at least ZM + bot count + current bot + card
    } else if (filteredValue.startsWith("ZP") && filteredValue.length >= 5) {
      shouldPreview = true; // ZP format needs at least ZP + bot count + current bot + card
    }

    if (shouldPreview) {
      const preview = previewGameCode(filteredValue);
      setGamePreview(preview);
      if (!preview.isValid) {
        setError(preview.errorMessage || "Nieprawidłowy kod gry");
      }
    }
  };

  const handleLoadGame = async () => {
    if (!gameCode.trim()) {
      setError("Wprowadź kod gry");
      return;
    }

    const preview = previewGameCode(gameCode);
    if (!preview.isValid) {
      setError(preview.errorMessage || "Nieprawidłowy format kodu gry");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const gameState = loadFromShareableCode(gameCode);
      if (gameState) {
        loadGame(gameState);
        navigate("/game");
      } else {
        setError("Nie udało się wczytać gry. Sprawdź kod i spróbuj ponownie.");
      }
    } catch {
      setError("Nie udało się wczytać gry. Sprawdź kod i spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleLoadGame();
    }
  };

  // Check if the current code is valid for button activation
  const isCodeValid =
    gameCode.length > 0 && (gamePreview === null ? false : gamePreview.isValid);

  return (
    <Layout
      title="Wczytaj stan gry"
      subtitle="Wprowadź skopiowany wcześniej kod gry"
      backgroundType="home"
    >
      <div className={styles.container}>
        <div className={styles.inputSection}>
          <label className={styles.label}>Kod stanu gry:</label>
          <input
            type="text"
            value={gameCode}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Wprowadź skopiowany wcześniej stan gry"
            className={`${styles.input} ${error ? styles.error : ""}`}
            autoFocus
          />
          {error && <div className={styles.errorMessage}>{error}</div>}
        </div>

        {gamePreview && gamePreview.isValid && (
          <div className={styles.preview}>
            <h3 className={styles.previewTitle}>✅ Podgląd stanu gry</h3>
            <div className={styles.previewContent}>
              {gamePreview.botCount === 1 ? (
                <>
                  <div className={styles.previewItem}>
                    <strong>Liczba botów:</strong> 1
                  </div>
                  <div className={styles.previewItem}>
                    <strong>Aktualna karta:</strong> {gamePreview.gameProgress}
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.previewItem}>
                    <strong>Liczba botów:</strong> {gamePreview.botCount}
                  </div>
                  <div className={styles.previewItem}>
                    <strong>Talia:</strong>{" "}
                    {gamePreview.mode === "individual" ? "osobna" : "wspólna"}
                  </div>
                  {gamePreview.currentBot && (
                    <div className={styles.previewItem}>
                      <strong>Aktualny bot:</strong> {gamePreview.currentBot}
                    </div>
                  )}
                  {gamePreview.botPositions ? (
                    <div className={styles.previewItem}>
                      <strong>Pozycje botów:</strong>
                      <div className={styles.botPositions}>
                        {gamePreview.botPositions.map((bot) => (
                          <div key={bot.botId} className={styles.botPosition}>
                            Bot {bot.botId}: {bot.position}
                            {bot.botId === gamePreview.currentBot ? " ⬅️" : ""}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.previewItem}>
                      <strong>Aktualna karta:</strong>{" "}
                      {gamePreview.gameProgress}
                    </div>
                  )}
                </>
              )}
              {gamePreview.isDeckExhausted && (
                <div
                  className={`${styles.previewItem} ${styles.deckExhausted}`}
                >
                  ⚠️ Talia wyczerpana
                </div>
              )}
            </div>
          </div>
        )}

        <div className={styles.instructions}>
          <h3 className={styles.instructionsTitle}>Jak wczytać stan gry:</h3>
          <ol className={styles.instructionsList}>
            <li>Skopiuj stan gry z trwającej rozgrywki</li>
            <li>Wprowadź stan gry w polu powyżej</li>
            <li>Zweryfikuj poprawność stanu gry</li>
            <li>Kliknij "Wczytaj stan gry" albo naciśnij Enter</li>
            <li>Gra zostanie wczytana w zapisanym stanie</li>
          </ol>

          <div className={styles.formatsInfo}>
            <h4>Obsługiwane formaty:</h4>
            <ul>
              <li>
                <strong>ZS</strong> - Jeden bot
              </li>
              <li>
                <strong>ZM</strong> - Kilka botów, wspólna talia
              </li>
              <li>
                <strong>ZP</strong> - Kilka botów, osobne talie
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.actions}>
          <button className="btn-secondary" onClick={() => navigate("/")}>
            ← Wróć do menu
          </button>
          <button
            className="btn-primary"
            onClick={handleLoadGame}
            disabled={!isCodeValid || isLoading}
          >
            {isLoading ? "Wczytywanie..." : "🎯 Wczytaj i rozpocznij grę"}
          </button>
        </div>
      </div>
    </Layout>
  );
}
