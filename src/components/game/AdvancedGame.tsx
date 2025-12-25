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

  // Indeks następnego bota (w całej liście) lub -1 jeśli brak
  const nextBotIndex = (() => {
    for (let i = state.currentPlayerIndex! + 1; i < state.players.length; i++) {
      if (state.players[i].isBot) return i;
    }
    return -1;
  })();

  const isNextBotAdjacent = nextBotIndex === state.currentPlayerIndex! + 1;

  // Sprawdzenie czy jest następna faza
  const hasNextPhase = state.currentPhase! < state.maxPhases!;

  // Sprawdzenie czy jest następna runda
  const hasNextRound = state.currentRound! < 5;

  // Czy aktualny gracz jest ostatnim graczem
  const isLastPlayer = state.currentPlayerIndex === state.players!.length - 1;

  // Tekst dla modalu akcji drugiego przycisku
  const getActionModalMessage = (): { message: string; notes?: string } => {
    if (actionButtonText === "Następny bot") {
      if (isNextBotAdjacent) {
        return {
          message: "Czy dobrać kartę dla następnego bota w tej fazie?",
          notes: "Przejdziemy do następnego bota w tej fazie i dobierzemy dla niego kartę.",
        };
      } else {
        return {
          message: "Czy faza tego bota została już rozegrana?",
          notes:
            "Przed potwierdzeniem rozegraj fazę graczy między obecnym botem a następnym botem.",
        };
      }
    } else if (actionButtonText === "Koniec fazy") {
      if (isLastPlayer) {
        return {
          message: "Wszyscy gracze rozegrali obecną fazę. Czy przejść do następnej fazy?",
          notes: "Po przejściu do następnej fazy rozpocznie ją pierwszy bot.",
        };
      } else {
        return {
          message: "Rozegraj fazy wszystkich graczy i potwierdź.",
          notes: "Po potwierdzeniu faza zostanie zakończona i przejdziemy dalej.",
        };
      }
    } else if (actionButtonText === "Koniec rundy") {
      if (isLastPlayer) {
        return {
          message: "Wszyscy gracze rozegrali fazy w tej rundzie. Czy przejść do następnej rundy?",
          notes:
            "Talia zostanie w razie potrzeby przetasowana, a pierwszy gracz zmieniony.",
        };
      } else {
        return {
          message: "Rozegraj fazy wszystkich graczy w tej rundzie i potwierdź.",
          notes: "Po potwierdzeniu zakończymy rundę i przejdziemy do kolejnej.",
        };
      }
    } else {
      // Koniec gry
      if (isLastPlayer) {
        return {
          message: "Wszyscy gracze rozegrali fazy w tej rundzie. Czy przejść do końca gry?",
          notes: "Po potwierdzeniu nastąpi powrót do menu i reset stanu gry.",
        };
      } else {
        return {
          message: "Rozegraj rundę do końca i potwierdź.",
          notes: "Po potwierdzeniu gra zostanie zakończona.",
        };
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
    <Layout
      backgroundType="game"
      title="ZAAWANSOWANA GRA W TOKU"
      subtitle={(() => {
        const botCount = state.players.filter((p) => p.isBot).length;
        const deckMode =
          botCount === 1
            ? "jedna talia"
            : state.mode === "shared"
            ? "wspólna talia"
            : "osobne talie";
        return `${state.players.length} gracz${
          state.players.length > 1 ? "y" : ""
        } (${botCount} bot${botCount !== 1 ? "y" : ""}), ${deckMode}`;
      })()}
    >
      <div className="card">
        {/* Info o rundzie, fazie i graczach */}
        <section className={`section ${styles.infoSection}`}>
          <div className={styles.roundPhaseInfo}>
            Runda {state.currentRound}/5 • Faza {state.currentPhase}/
            {state.maxPhases}
          </div>

          {/* Kwadraty graczy */}
          <div className={styles.playersContainer}>
            {state.players.map((player, index) => (
              <div
                key={player.id}
                className={`${styles.playerSquare} ${
                  index === state.currentPlayerIndex
                    ? styles.active
                    : styles.inactive
                }`}
                style={{
                  backgroundColor: player.color,
                  color: player.color === "yellow" ? "#000" : "#fff",
                }}
              >
                <div className={styles.playerSquareNumber}>G{index + 1}</div>
                <div>{player.isBot ? "BOT" : "CZ"}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Przyciski akcji - przed kartą */}
        <section className="section">
          <h2>MOŻLIWE AKCJE</h2>
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
          title="DOBIERZ KARTĘ"
            message={"Czy dobrać nową kartę dla aktualnego bota?"}
            notes={
              "Obecna karta nie daje żadnych możliwych efektów dla tego bota."
            }
          confirmText="Dobierz"
          cancelText="Anuluj"
          onConfirm={() => {
            handleDrawCard();
            setShowDrawCardModal(false);
          }}
          onCancel={() => {
            setShowDrawCardModal(false);
          }}
        />

        {/* Modal potwierdzenia dla akcji drugiego przycisku */}
        {(() => {
          const { message, notes } = getActionModalMessage();
          return (
            <ConfirmModal
              isOpen={showActionModal}
              title={actionButtonText}
              message={message}
              notes={notes}
              confirmText={
                actionButtonText === "Następny bot"
                  ? "Tak, następny"
                  : actionButtonText === "Koniec fazy"
                  ? "Zakończ fazę"
                  : actionButtonText === "Koniec rundy"
                  ? "Zakończ rundę"
                  : "Zakończ grę"
              }
              cancelText="Anuluj"
              onConfirm={() => {
                if (actionButtonText === "Następny bot") {
                  game.nextPlayer();
                } else if (actionButtonText === "Koniec fazy") {
                  game.nextPhase();
                } else if (actionButtonText === "Koniec rundy") {
                  game.nextRound();
                } else {
                  // Koniec gry
                  game.resetGame();
                  navigate("/");
                }
                setShowActionModal(false);
              }}
              onCancel={() => {
                setShowActionModal(false);
              }}
            />
          );
        })()}
        
      </div>

      <BottomControls onBackClick={() => navigate("/")} />
    </Layout>
  );
}
