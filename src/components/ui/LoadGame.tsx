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
      setError("Kod musi zaczynać się od Z");
      return;
    }

    if (filteredValue.length >= 2) {
      const prefix = filteredValue.substring(0, 2);
      if (prefix !== "ZS" && prefix !== "ZM" && prefix !== "ZP") {
        setGamePreview(null);
        setError("Nieprawidłowy prefiks - użyj ZS, ZM albo ZP");
        return;
      }

      // Format-specific validation
      if (prefix === "ZS") {
        // ZS: sprawdź duplikaty kart (każda karta może wystąpić tylko raz)
        if (filteredValue.length >= 3) {
          const cards = filteredValue.substring(2); // wszystkie karty po ZS
          const uniqueCards = new Set(cards);
          if (uniqueCards.size !== cards.length) {
            setGamePreview(null);
            setError("Każda karta może wystąpić tylko raz w kodzie");
            return;
          }
          // Nie sprawdzamy cards.length > 13 bo jest to niemożliwe:
          // - Talia ma tylko 13 unikatowych kart (0-9,A-C)
          // - Jeśli nie ma duplikatów, maksimum to 13 kart
          // - Inne znaki są już odfiltrowane wcześniej
        }
      } else if (prefix === "ZM") {
        // ZM: minimum 6 znaków (ZM + n_botów + aktualny + karta + Z + pozostałe)
        if (filteredValue.length >= 3) {
          const botCount = parseInt(filteredValue.charAt(2));
          if (isNaN(botCount) || botCount < 2 || botCount > 4) {
            setGamePreview(null);
            setError("ZM: liczba botów musi być 2-4");
            return;
          }
          if (filteredValue.length >= 4) {
            const currentBot = parseInt(filteredValue.charAt(3));
            if (isNaN(currentBot) || currentBot < 1 || currentBot > botCount) {
              setGamePreview(null);
              setError(`ZM: aktualny bot musi być 1-${botCount}`);
              return;
            }
          }
          // Podstawowa walidacja - szczegóły w gameStorage.ts
        }
      } else if (prefix === "ZP") {
        // ZP: podobna logika do ZM, ale wymaga więcej separatorów Z
        if (filteredValue.length >= 3) {
          const botCount = parseInt(filteredValue.charAt(2));
          if (isNaN(botCount) || botCount < 2 || botCount > 4) {
            setGamePreview(null);
            setError("ZP: liczba botów musi być 2-4");
            return;
          }
          if (filteredValue.length >= 4) {
            const currentBot = parseInt(filteredValue.charAt(3));
            if (isNaN(currentBot) || currentBot < 1 || currentBot > botCount) {
              setGamePreview(null);
              setError(`ZP: aktualny bot musi być 1-${botCount}`);
              return;
            }
          }
          if (filteredValue.length >= 6) {
            const separatorCount = (filteredValue.match(/Z/g) || []).length;
            if (separatorCount === 0) {
              setGamePreview(null);
              setError("ZP: brakuje separatorów Z");
              return;
            }

            // Szczegóły walidacji w gameStorage.ts
          }
        }
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
            "Kod zawiera nieprawidłowe znaki - używaj tylko cyfr 0-9 i liter A-C"
          );
          return;
        }
      }
    }

    // Preview game state if code is potentially complete
    let shouldPreview = false;
    if (filteredValue.startsWith("ZS") && filteredValue.length >= 3) {
      shouldPreview = true; // ZS: minimum ZS + obecna karta
    } else if (filteredValue.startsWith("ZM") && filteredValue.length >= 5) {
      // ZM: zawsze wywołaj preview dla kodów >= 5 znaków (ZM + bots + current + card)
      // Szczegółowa walidacja w gameStorage.ts
      shouldPreview = true;
    } else if (filteredValue.startsWith("ZP") && filteredValue.length >= 6) {
      // ZP: sprawdź czy są jakiekolwiek separatory Z po prefiksie
      const dataWithoutPrefix = filteredValue.substring(2);
      const hasAnySeparator = dataWithoutPrefix.includes("Z");
      shouldPreview = hasAnySeparator; // ZP: minimum ZP + n_botów + aktualny + karta + Z
    }

    if (shouldPreview) {
      const preview = previewGameCode(filteredValue);
      setGamePreview(preview);
      if (!preview.isValid) {
        setError(preview.errorMessage || "Kod jest niepełny lub zawiera błędy");
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
      title="WCZYTAJ STAN GRY"
      subtitle="Kontynuuj wcześniej zapisaną grę"
      backgroundType="home"
    >
      <div className="card">
        <div className={styles.loadGameContent}>
          {/* Input Section */}
          <div className="section">
            <h2>KOD STANU GRY</h2>
            <label htmlFor="gameCode" className={styles.label}>
              Miejsce na kod stanu gry
            </label>
            <input
              id="gameCode"
              type="text"
              value={gameCode}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="np. ZS1A2B3C..."
              className={`${styles.input} ${error ? styles.error : ""}`}
              autoFocus
            />
            {error && <div className={styles.errorMessage}>{error}</div>}
          </div>

          {/* Preview Section */}
          {gamePreview && gamePreview.isValid && (
            <div className="info-box">
              <h2>PODGLĄD STANU GRY</h2>
              <div className={styles.previewContent}>
                {gamePreview.botCount === 1 ? (
                  <>
                    <div className={styles.previewItem}>
                      <strong>Liczba botów:</strong> 1
                    </div>
                    <div className={styles.previewItem}>
                      <strong>Aktualna karta:</strong>{" "}
                      {gamePreview.gameProgress}
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
                        <strong>Stany talii:</strong>
                        <div className={styles.botSummary}>
                          {" "}
                          {gamePreview.botPositions.map((bot, index) => {
                            const isActive =
                              bot.botId === gamePreview.currentBot;
                            return (
                              <span key={bot.botId}>
                                {index > 0 && " • "}
                                <span
                                  className={
                                    isActive ? styles.currentBotText : ""
                                  }
                                >
                                  {bot.botId} ({bot.position})
                                </span>
                              </span>
                            );
                          })}
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

          {/* Load Game Button - only when valid preview */}
          {gamePreview?.isValid && (
            <div className={styles.actions}>
              <button
                className="btn-primary"
                onClick={handleLoadGame}
                disabled={!isCodeValid || isLoading}
              >
                {isLoading ? "Wczytywanie..." : "Wczytaj i kontynuuj grę"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Back button outside the card */}
  <div className={`bottom-controls`}>
        <button className="btn-secondary" onClick={() => navigate("/")}>
          ← Wróć do menu
        </button>
      </div>
    </Layout>
  );
}
