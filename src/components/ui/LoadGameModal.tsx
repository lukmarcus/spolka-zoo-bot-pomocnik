// LoadGameModal - Component for loading game state from code
// v0.2.3 - Game state preview and improved UX

import { useState } from "react";
import BaseModal from "./BaseModal";
import baseStyles from "./BaseModal.module.css";
import styles from "./LoadGameModal.module.css";
import { loadFromShareableCode, previewGameCode } from "@lib/gameStorage";
import type { GameState, GameCodePreview } from "@lib/types";

interface LoadGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadGame: (gameState: GameState) => void;
}

export default function LoadGameModal({
  isOpen,
  onClose,
  onLoadGame,
}: LoadGameModalProps) {
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
        onLoadGame(gameState);
        handleClose();
      } else {
        setError("Nie udało się wczytać gry. Sprawdź kod i spróbuj ponownie.");
      }
    } catch {
      setError("Nie udało się wczytać gry. Sprawdź kod i spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setGameCode("");
    setError(null);
    setGamePreview(null);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleLoadGame();
    }
  };

  // Check if the current code is valid for button activation
  // Button should be disabled if code is empty, too short, or preview shows invalid
  const isCodeValid =
    gameCode.length > 0 && (gamePreview === null ? false : gamePreview.isValid);

  return (
    <BaseModal
      isOpen={isOpen}
      title="📥 Wczytaj stan gry"
      onClose={handleClose}
      maxWidth="500px"
    >
      <div className={baseStyles.content}>
        <label className={styles.label}>Stan gry:</label>
        <input
          type="text"
          value={gameCode}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Wprowadź skopiowany wcześniej stan gry"
          className={`${styles.input} ${error ? styles.error : ""}`}
          disabled={isLoading}
          autoFocus
        />

        {error && <p className={styles.error}>⚠️ {error}</p>}

        {gamePreview && gamePreview.isValid && (
          <div className={styles.preview}>
            <h4 className={styles.previewTitle}>✅ Podgląd stanu gry</h4>
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
                      <div style={{ marginLeft: "1rem", marginTop: "0.25rem" }}>
                        {gamePreview.botPositions.map((bot) => (
                          <div key={bot.botId}>
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
            </div>
          </div>
        )}

        <div className={styles.instructions}>
          <h4 className={styles.instructionsTitle}>Jak wczytać stan gry:</h4>
          <ol className={styles.instructionsList}>
            <li>Skopiuj stan gry z trwającej rozgrywki</li>
            <li>Wprowadź stan gry w polu powyżej</li>
            <li>Zweryfikuj poprawność stanu gry</li>
            <li>Kliknij "Wczytaj stan gry" albo naciśnij Enter</li>
            <li>Gra zostanie wczytana w zapisanym stanie</li>
          </ol>
        </div>
      </div>

      <div className={`${baseStyles.actions} ${styles.actions}`}>
        <button
          className={`${baseStyles.button} ${baseStyles.cancelButton}`}
          onClick={handleClose}
          disabled={isLoading}
        >
          Anuluj
        </button>
        <button
          className={`${baseStyles.button} ${baseStyles.confirmButton}`}
          onClick={handleLoadGame}
          disabled={isLoading || !isCodeValid}
        >
          {isLoading ? "🔄 Wczytywanie..." : "📥 Wczytaj stan gry"}
        </button>
      </div>
    </BaseModal>
  );
}
