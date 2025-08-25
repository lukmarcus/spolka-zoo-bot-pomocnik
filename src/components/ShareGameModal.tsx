// ShareGameModal - Component for sharing game state via code
// v0.2.0 - Save and load game functionality

import { useState } from "react";
import BaseModal from "./BaseModal";
import styles from "./ConfirmModal.module.css"; // Use existing modal styles
import { generateShareableCode, copyToClipboard } from "../utils/gameStorage";
import type { GameState } from "../types";

interface ShareGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
}

export default function ShareGameModal({
  isOpen,
  onClose,
  gameState,
}: ShareGameModalProps) {
  const [gameCode, setGameCode] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
      const code = generateShareableCode(gameState);
      setGameCode(code);
    } catch {
      alert("Nie udało się wygenerować kodu gry. Spróbuj ponownie.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = async () => {
    if (gameCode) {
      const success = await copyToClipboard(gameCode);
      if (success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        alert("Nie udało się skopiować kodu. Zaznacz kod i skopiuj ręcznie.");
      }
    }
  };

  const handleClose = () => {
    setGameCode("");
    setIsCopied(false);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      title="🔗 Udostępnij grę"
      onClose={handleClose}
      maxWidth="500px"
    >
      <div className={styles.content}>
        <p className={styles.message}>
          Wygeneruj kod gry, aby udostępnić aktualny stan gry innym graczom.
        </p>

        {!gameCode ? (
          <div style={{ textAlign: "center", margin: "1.5rem 0" }}>
            <button
              className={`${styles.button} ${styles.confirmButton}`}
              onClick={handleGenerateCode}
              disabled={isGenerating}
              style={{ width: "auto", padding: "0.75rem 1.5rem" }}
            >
              {isGenerating ? "🔄 Generowanie..." : "📝 Wygeneruj kod gry"}
            </button>
          </div>
        ) : (
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
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <input
                type="text"
                value={gameCode}
                readOnly
                onClick={(e) => e.currentTarget.select()}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  border: "1px solid var(--card-border)",
                  borderRadius: "var(--border-radius)",
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                  background: "#f9f9f9",
                }}
              />
              <button
                className={`${styles.button} ${styles.confirmButton}`}
                onClick={handleCopyCode}
                style={{
                  minWidth: "auto",
                  padding: "0.75rem",
                  background: isCopied ? "#28a745" : "var(--button-primary)",
                }}
                title="Skopiuj kod"
              >
                {isCopied ? "✅" : "📋"}
              </button>
            </div>

            {isCopied && (
              <p
                style={{
                  color: "#28a745",
                  fontSize: "0.9rem",
                  margin: "0 0 1rem 0",
                }}
              >
                ✅ Kod został skopiowany do schowka!
              </p>
            )}

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
                Jak użyć kodu:
              </h4>
              <ol
                style={{
                  margin: "0",
                  paddingLeft: "1.25rem",
                  color: "var(--text-primary)",
                }}
              >
                <li>Prześlij ten kod drugiemu graczowi</li>
                <li>W menu głównym wybierz "Wczytaj grę"</li>
                <li>Wprowadź kod i kliknij "Wczytaj"</li>
                <li>Gra zostanie wczytana w tym samym stanie</li>
              </ol>
            </div>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.button} ${styles.cancelButton}`}
          onClick={handleClose}
        >
          Zamknij
        </button>
      </div>
    </BaseModal>
  );
}
