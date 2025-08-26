// LoadGameModal - Component for loading game state from code
// v0.2.3 - Game state preview and improved UX

import { useState } from "react";
import BaseModal from "./BaseModal";
import styles from "./ConfirmModal.module.css"; // Use existing modal styles
import { loadFromShareableCode, previewGameCode } from "../utils/gameStorage";
import type { GameState, GameCodePreview } from "../types";

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
    // Allow all alphanumeric characters (ZOO prefix + 0-9, A-C for data)
    const value = e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, "");
    setGameCode(value);
    setError(null);

    // Preview game state if code is long enough
    if (value.length >= 14) {
      const preview = previewGameCode(value);
      setGamePreview(preview);
      if (!preview.isValid) {
        setError(preview.errorMessage || "Nieprawidłowy kod gry");
      }
    } else {
      setGamePreview(null);
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

          {gamePreview && gamePreview.isValid && (
            <div
              style={{
                background: "#e8f5e8",
                border: "1px solid #28a745",
                borderRadius: "var(--border-radius)",
                padding: "0.75rem",
                margin: "0.75rem 0",
              }}
            >
              <h4
                style={{
                  margin: "0 0 0.5rem 0",
                  color: "#155724",
                  fontSize: "0.9rem",
                }}
              >
                ✅ Podgląd stanu gry
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                  fontSize: "0.85rem",
                  color: "#155724",
                }}
              >
                <div>
                  <strong>Postęp:</strong> {gamePreview.gameProgress}
                </div>
                <div>
                  <strong>Boty:</strong> {gamePreview.botCount}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  {gamePreview.isDeckExhausted
                    ? "Talia wyczerpana"
                    : gamePreview.isGameStarted
                    ? "Gra w toku"
                    : "Początek gry"}
                </div>
              </div>
            </div>
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
