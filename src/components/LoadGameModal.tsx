// LoadGameModal - Component for loading game state from code
// v0.2.0 - Save and load game functionality

import { useState } from "react";
import BaseModal from "./BaseModal";
import styles from "./ConfirmModal.module.css"; // Use existing modal styles
import { loadFromShareableCode, isValidGameCode } from "../utils/gameStorage";
import type { GameState } from "../types";

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setGameCode(value);
    setError(null);
  };

  const handleLoadGame = async () => {
    if (!gameCode.trim()) {
      setError("Wprowadź kod gry");
      return;
    }

    if (!isValidGameCode(gameCode)) {
      setError("Nieprawidłowy format kodu gry");
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
    } catch (error) {
      console.error("Failed to load game:", error);
      setError("Nie udało się wczytać gry. Sprawdź kod i spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setGameCode("");
    setError(null);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleLoadGame();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="📥 Wczytaj grę"
      onClose={handleClose}
      maxWidth="500px"
    >
      <div className={styles.content}>
        <p className={styles.message}>
          Wprowadź kod gry, aby wczytać stan gry udostępniony przez innego
          gracza.
        </p>

        <div style={{ margin: "1.5rem 0" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "500",
              color: "var(--text-primary)",
            }}
          >
            Kod gry:
          </label>
          <input
            type="text"
            value={gameCode}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Wprowadź kod gry (np. ABCD1234...)"
            style={{
              width: "100%",
              padding: "0.75rem",
              border: `1px solid ${error ? "#dc3545" : "var(--card-border)"}`,
              borderRadius: "var(--border-radius)",
              fontFamily: "monospace",
              fontSize: "0.9rem",
              background: error ? "#fff5f5" : "white",
              textTransform: "uppercase",
            }}
            disabled={isLoading}
            autoFocus
          />

          {error && (
            <p
              style={{
                color: "#dc3545",
                fontSize: "0.85rem",
                margin: "0.5rem 0 0 0",
              }}
            >
              ⚠️ {error}
            </p>
          )}
        </div>

        <div
          style={{
            background: "#f9f9f9",
            padding: "1rem",
            borderRadius: "var(--border-radius)",
            border: "1px solid var(--card-border)",
          }}
        >
          <h4
            style={{
              margin: "0 0 0.5rem 0",
              color: "var(--text-primary)",
            }}
          >
            Jak wczytać grę:
          </h4>
          <ol
            style={{
              margin: "0",
              paddingLeft: "1.25rem",
              color: "var(--text-primary)",
            }}
          >
            <li>Otrzymaj kod gry od innego gracza</li>
            <li>Wprowadź kod w polu powyżej</li>
            <li>Kliknij "Wczytaj grę" lub naciśnij Enter</li>
            <li>Gra zostanie wczytana w udostępnionym stanie</li>
          </ol>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.button} ${styles.cancelButton}`}
          onClick={handleClose}
          disabled={isLoading}
        >
          Anuluj
        </button>
        <button
          className={`${styles.button} ${styles.confirmButton}`}
          onClick={handleLoadGame}
          disabled={isLoading || !gameCode.trim()}
        >
          {isLoading ? "🔄 Wczytywanie..." : "📥 Wczytaj grę"}
        </button>
      </div>
    </BaseModal>
  );
}
