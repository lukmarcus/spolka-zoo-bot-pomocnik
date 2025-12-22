import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@lib/GameContext";
import { BOT_CARDS } from "@lib/botCards";
import Layout from "@ui/Layout";
import BottomControls from "@ui/BottomControls";
import ConfirmModal from "@ui/ConfirmModal";
import styles from "./AdvancedGame.module.css";

export default function AdvancedGame() {
  const navigate = useNavigate();
  const game = useGame();
  const [showDrawCardModal, setShowDrawCardModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);

  const { state } = game;

  // Sprawdzenie czy jesteśmy w trybie zaawansowanym
  useEffect(() => {
    if (
      state.gameMode !== "advanced" ||
      !state.players ||
      state.players.length === 0
    ) {
      navigate("/advanced-setup");
    }
  }, [state.gameMode, state.players, navigate]);

  const handleDrawCard = () => {
    if (game.isDeckExhausted()) {
      game.shuffleDeck();
    }
    game.drawCard();
  };

  // Jeśli brak stanu gry, nie renderuj
  if (
    state.gameMode !== "advanced" ||
    !state.players ||
    state.players.length === 0
  ) {
    return null;
  }

  // Sprawdzenie czy jest następny bot
  const hasNextBot = state.players
    .slice(state.currentPlayerIndex! + 1)
    .some((p) => p.isBot);

  // Sprawdzenie czy jest następna faza
  const hasNextPhase = state.currentPhase! < state.maxPhases!;

  // Sprawdzenie czy jest następna runda
  const hasNextRound = state.currentRound! < 5;

  // Czy aktualny gracz jest ostatnim graczem
  const isLastPlayer = state.currentPlayerIndex === state.players!.length - 1;

  // Tekst dla modalu akcji drugiego przycisku
  const getActionModalMessage = (): string => {
    if (actionButtonText === "Następny bot") {
      return "Czy faza tego bota została już rozegrana?";
    } else if (actionButtonText === "Koniec fazy") {
      if (isLastPlayer) {
        return "Wszyscy gracze rozegrali obecną fazę, czy przejść do następnej fazy?";
      } else {
        return "Rozegraj fazy wszystkich graczy i potwierdź";
      }
    } else if (actionButtonText === "Koniec rundy") {
      if (isLastPlayer) {
        return "Wszyscy gracze rozegrali fazy w tej rundzie, czy przejść do następnej rundy?";
      } else {
        return "Rozegraj fazy wszystkich graczy w tej rundzie i potwierdź";
      }
    } else {
      // Koniec gry
      if (isLastPlayer) {
        return "Wszyscy gracze rozegrali fazy w tej rundzie, czy przejść do końca gry?";
      } else {
        return "Rozegraj rundę do końca i potwierdź";
      }
    }
  };

  // Dynamiczny tekst i akcja przycisku
  let actionButtonText = "Następny bot";
  let actionButtonAction: () => void;

  if (hasNextBot) {
    actionButtonText = "Następny bot";
    actionButtonAction = () => setShowActionModal(true);
  } else if (hasNextPhase) {
    actionButtonText = "Koniec fazy";
    actionButtonAction = () => setShowActionModal(true);
  } else if (hasNextRound) {
    actionButtonText = "Koniec rundy";
    actionButtonAction = () => setShowActionModal(true);
  } else {
    actionButtonText = "Koniec gry";
    actionButtonAction = () => setShowActionModal(true);
  }

  // Pobierz kartę z GameContext (używając getCurrentCard jak w GamePlay)
  const currentCardId = game.getCurrentCard();
  const drawnCardObject =
    currentCardId !== null
      ? BOT_CARDS.find((card) => card.id === currentCardId + 1)
      : null;

  return (
    <Layout backgroundType="game">
      <div className="card">
        {/* Header z informacjami o rundzie, fazie i gracze */}
        <section className="section" style={{ paddingBottom: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "0.8rem",
            }}
          >
            <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
              Runda {state.currentRound}/5 • Faza {state.currentPhase}/
              {state.maxPhases}
            </div>
          </div>

          {/* Kwadraty graczy */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {state.players.map((player, index) => (
              <div
                key={player.id}
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: player.color,
                  border:
                    index === state.currentPlayerIndex
                      ? "4px solid var(--button-primary)"
                      : "2px solid rgba(0,0,0,0.1)",
                  borderRadius: "6px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: player.color === "yellow" ? "#000" : "#fff",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  transition: "all 0.2s",
                  textAlign: "center",
                  padding: "0.25rem",
                  lineHeight: "1.1",
                  boxShadow:
                    index === state.currentPlayerIndex
                      ? "0 4px 8px rgba(139,69,19,0.3)"
                      : "none",
                }}
              >
                <div>G{index + 1}</div>
                <div>{player.isBot ? "BOT" : "CZ"}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Przyciski akcji - przed kartą */}
        <section className="section">
          <h2>DOBIERZ KARTĘ</h2>
          <div className={styles.gameControls}>
            <button
              className="btn-primary"
              onClick={() => setShowDrawCardModal(true)}
            >
              Dobierz kartę
            </button>
            <button className="btn-secondary" onClick={actionButtonAction}>
              {actionButtonText}
            </button>
          </div>
        </section>

        {/* Karta bota - wyświetlona dla aktualnego bota */}
        {drawnCardObject && (
          <section className="section">
            <h2>
              AKTUALNA KARTA (
              {(state.mode === "individual"
                ? state.botDecks && state.currentBot
                  ? (state.botDecks[state.currentBot - 1]?.currentCardIndex ??
                      -1) + 1
                  : 0
                : typeof state.currentCardIndex === "number"
                ? state.currentCardIndex + 1
                : 0) +
                "/" +
                BOT_CARDS.length}
              )
            </h2>
            {(() => {
              // Determine effect labels based on number of effects
              const getEffectLabel = (index: number, totalEffects: number) => {
                if (totalEffects === 1) {
                  return "EFEKT";
                } else {
                  if (index === 0) return "PIERWSZY EFEKT";
                  if (index === 1) return "DRUGI EFEKT";
                  return `EFEKT ${index + 1}`;
                }
              };

              // build sections array (effects + ability)
              const sections = drawnCardObject.effects.map((effect, index) => ({
                key: `effect-${index}`,
                title: getEffectLabel(index, drawnCardObject.effects.length),
                html: effect,
              }));

              sections.push({
                key: `ability`,
                title: "ZDOLNOSĆ DODATKOWA",
                html: drawnCardObject.ability as string,
              });

              return (
                <>
                  {sections.map((s) => (
                    <div key={s.key}>
                      <h3>{s.title}</h3>
                      <div className="card-content">
                        <p dangerouslySetInnerHTML={{ __html: s.html }} />
                      </div>
                    </div>
                  ))}
                </>
              );
            })()}
          </section>
        )}

        {/* Modal potwierdzenia dla dobrania karty */}
        <ConfirmModal
          isOpen={showDrawCardModal}
          message="Dobrać kartę dla aktualnego bota?"
          onConfirm={() => {
            handleDrawCard();
            setShowDrawCardModal(false);
          }}
          onCancel={() => {
            setShowDrawCardModal(false);
          }}
        />

        {/* Modal potwierdzenia dla akcji drugiego przycisku */}
        <ConfirmModal
          isOpen={showActionModal}
          message={getActionModalMessage()}
          onConfirm={() => {
            if (actionButtonText === "Następny bot") {
              game.nextPlayer();
            } else if (actionButtonText === "Koniec fazy") {
              game.nextPhase();
            } else if (actionButtonText === "Koniec rundy") {
              game.nextRound();
            } else {
              // Koniec gry
              navigate("/");
            }
            setShowActionModal(false);
          }}
          onCancel={() => {
            setShowActionModal(false);
          }}
        />
      </div>

      <BottomControls onBackClick={() => navigate("/")} />
    </Layout>
  );
}
