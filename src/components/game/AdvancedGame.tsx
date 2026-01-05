import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@lib/GameContext";
import { BOT_CARDS } from "@lib/botCards";
import Layout from "@ui/Layout";
import BottomControls from "@ui/BottomControls";
import ConfirmModal from "@ui/ConfirmModal";
import getModalText from "@lib/getModalText";
import modalTexts from "@lib/modalTexts.json";
import styles from "./AdvancedGame.module.css";

export default function AdvancedGame() {
  const navigate = useNavigate();
  const game = useGame();
  const [showDrawCardModal, setShowDrawCardModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showActionInstructionsModal, setShowActionInstructionsModal] =
    useState(false);

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

  // Dla nextBot gdy nie jest sąsiedni - znajdź WSZYSTKICH graczy między botami
  const nextBotIntermediatePlayers = (() => {
    if (isNextBotAdjacent || nextBotIndex === -1) return [];
    const players = [];
    for (let i = state.currentPlayerIndex! + 1; i < nextBotIndex; i++) {
      players.push({ index: i, ...state.players[i] });
    }
    return players;
  })();

  // Sprawdzenie czy jest następna faza
  const hasNextPhase = state.currentPhase! < state.maxPhases!;

  // Sprawdzenie czy jest następna runda
  const hasNextRound = state.currentRound! < 5;

  // Czy aktualny gracz jest ostatnim graczem
  const isLastPlayer = state.currentPlayerIndex === state.players!.length - 1;

  // Dla nextPhase: czy pierwszy gracz nowej fazy jest botem
  const willBeFirstInNextPhase = isLastPlayer && state.players[0].isBot;

  // Oblicz indeks gracza, który zacznie następną runę
  const nextRoundStartIndex =
    (state.currentPlayerIndex! + 1) % state.players.length;

  const isFirstInNextRoundABot =
    state.players[nextRoundStartIndex]?.isBot ?? false;

  // Dla nextPhase: gracze od następnego po bocie do końca tej fazy
  const endOfPhaseIntermediatePlayers = (() => {
    const players = [];
    // Gracze POMIĘDZY botem a końcem fazy (nie włączając samego bota)
    for (let i = state.currentPlayerIndex! + 1; i < state.players.length; i++) {
      players.push({ index: i, ...state.players[i] });
    }
    return players;
  })();

  // Dla nextPhase: gracze w nowej fazie od 0 do pierwszego bota
  const nextPhaseIntermediatePlayers = (() => {
    if (!hasNextPhase) return [];
    const players = [];
    for (let i = 0; i < state.players.length; i++) {
      if (state.players[i].isBot) break;
      players.push({ index: i, ...state.players[i] });
    }
    return players;
  })();

  // Tekst dla modalu akcji drugiego przycisku — pobierany z modalTexts.json
  const getActionModalMessage = (): {
    message: string | React.ReactNode;
    notes?: string;
  } => {
    if (actionKey === "nextBot") {
      const nextBotNode = (
        modalTexts as unknown as { advancedGame?: Record<string, unknown> }
      )?.advancedGame?.nextBot as Record<string, unknown> | undefined;

      const baseMessage =
        typeof nextBotNode?.message === "string"
          ? (nextBotNode.message as string)
          : "";

      const notesParts: string[] = [];
      // Dla nextBot: bez dodatkowych notatek w pierwszym modalu
      // (niezależnie od tego czy sąsiedni czy nie)

      // Zawiń message w div wycentrowany
      const centeredMessage = (
        <div style={{ textAlign: "center" }}>{baseMessage}</div>
      );

      return {
        message: centeredMessage,
        notes: notesParts.length ? notesParts.join("\n") : undefined,
      };
    }

    if (actionKey === "nextPhase") {
      const base = getModalText("advancedGame", "nextPhase.message");

      const baseMessage = base.message;

      // Dla nextPhase: brak notatek - drugi modal pokazuje scenariusz wizualnie
      const noteOrder: string[] = [];

      const noteMap: Record<string, string | undefined> = {};

      const allNotes: string[] = noteOrder
        .map((k) => noteMap[k])
        .filter((m): m is string => typeof m === "string");

      // Zawiń message w div wycentrowany - bez notatek w pierwszym modalu
      const centeredMessage = (
        <div style={{ textAlign: "center" }}>{baseMessage}</div>
      );

      return {
        message: centeredMessage,
        notes: allNotes.length ? allNotes.join("\n") : undefined,
      };
    }

    if (actionKey === "nextRound") {
      // choose note2: whether bot is last or not
      const note2Key = isLastPlayer ? "last" : "notLast";

      // choose note3: 'first' or 'notFirst' - first player of NEXT ROUND
      const note3Key = isFirstInNextRoundABot ? "first" : "notFirst";

      // choose note4: depends on last/notLast and first player of next round
      const note4Variant = `${isLastPlayer ? "last" : "notLast"}_${
        isFirstInNextRoundABot ? "first" : "notFirst"
      }`;

      // choose note5: depends on bot count and deck mode
      const botCount = state.players!.filter((p) => p.isBot).length;
      let note5Key: string;
      if (botCount === 1) {
        note5Key = "single";
      } else if (state.mode === "shared") {
        note5Key = "multiple_shared";
      } else {
        note5Key = "multiple_individual";
      }

      // choose note6: depends on bot count only
      const note6Key = botCount === 1 ? "single" : "multiple";

      const base = getModalText("advancedGame", "nextRound.message");
      const note1 = getModalText("advancedGame", "nextRound.note1");
      const note2 = getModalText("advancedGame", `nextRound.note2.${note2Key}`);
      const note3 = getModalText("advancedGame", `nextRound.note3.${note3Key}`);
      const note4 = getModalText(
        "advancedGame",
        `nextRound.note4.${note4Variant}`
      );
      const note5 = getModalText("advancedGame", `nextRound.note5.${note5Key}`);
      const note6 = getModalText("advancedGame", `nextRound.note6.${note6Key}`);

      const baseMessage = base.message;
      // build notes in the order specified by modalTexts.json -> advancedGame.nextRound.noteOrder
      const noteOrder: string[] = (
        modalTexts as unknown as {
          advancedGame?: AdvancedGameTexts;
        }
      )?.advancedGame?.nextRound?.noteOrder ?? [
        "note1",
        "note2",
        "note3",
        "note4",
        "note5",
        "note6",
      ];

      const noteMap: Record<string, string | undefined> = {
        note1: note1?.message,
        note2: note2?.message,
        note3: note3?.message,
        note4: note4?.message,
        note5: note5?.message,
        note6: note6?.message,
      };

      const notesParts: string[] = noteOrder
        .map((k) => noteMap[k])
        .filter((m): m is string => typeof m === "string");

      return {
        message: baseMessage,
        notes: notesParts.length ? notesParts.join("\n") : undefined,
      };
    }

    const key = isLastPlayer ? "endGame.last" : "endGame.notLast";
    const { message, notes } = getModalText("advancedGame", key);
    return { message, notes: notes ? notes.join("\n") : undefined };
  };

  // Dynamiczny tekst i akcja przycisku
  // labels come from modalTexts.json -> advancedGame.gameButtons
  type UiRoot = {
    gameButtons?: Record<string, string>;
    modalTitles?: Record<string, string>;
    modalConfirm?: Record<string, string>;
    modalCancel?: string;
    common?: { modalCancel?: string; modalOk?: string };
  };

  // Partial typing for modalTexts. We only declare the parts we access.
  type NextPhaseNode = {
    gameButton?: string;
    modalTitle?: string;
    modalConfirm?: string;
    message?: string;
    noteOrder?: string[];
    note1?: Record<string, string>;
    note2?: Record<string, string>;
    note3?: Record<string, string>;
    note4?: Record<string, string>;
    note5?: Record<string, string>;
  };

  type AdvancedGameTexts = {
    gameButtons?: Record<string, string>;
    modalTitles?: Record<string, string>;
    modalConfirm?: Record<string, string>;
    common?: { modalCancel?: string };
    nextPhase?: NextPhaseNode;
    nextRound?: NextPhaseNode;
    nextBot?: NextPhaseNode;
    drawCard?: NextPhaseNode;
  };

  const uiRoot = (modalTexts as unknown as { advancedGame?: AdvancedGameTexts })
    ?.advancedGame as UiRoot | undefined;

  // new: prefer nextPhase-local strings if present
  const nextPhaseNode = (
    modalTexts as unknown as { advancedGame?: AdvancedGameTexts }
  )?.advancedGame?.nextPhase as NextPhaseNode | undefined;

  const getUiString = (
    localNode: Record<string, unknown> | undefined,
    globalNode: Record<string, unknown> | undefined,
    key: string,
    defaultValue: string
  ) => {
    if (
      localNode &&
      typeof (localNode as Record<string, unknown>)[key] === "string"
    )
      return (localNode as Record<string, string>)[key];
    if (
      globalNode &&
      typeof (globalNode as Record<string, unknown>)[key] === "string"
    )
      return (globalNode as Record<string, string>)[key];
    return defaultValue;
  };

  const modalCancel = getModalText(
    "advancedGame",
    "common.modalCancel"
  ).message;

  // access advancedGame raw object safely for modal-specific overrides (drawCard, etc.)
  const advancedTexts = modalTexts as unknown as {
    advancedGame?: Record<string, unknown>;
  };

  const nextBotNode = advancedTexts?.advancedGame?.nextBot as
    | Record<string, unknown>
    | undefined;
  const nextRoundNode = advancedTexts?.advancedGame?.nextRound as
    | Record<string, unknown>
    | undefined;
  const endGameNode = advancedTexts?.advancedGame?.endGame as
    | Record<string, unknown>
    | undefined;

  const commonOk = uiRoot?.common?.modalOk || "Tak";

  let actionKey: "nextBot" | "nextPhase" | "nextRound" | "endGame" = "nextBot";

  if (hasNextBot) {
    actionKey = "nextBot";
  } else if (hasNextPhase) {
    actionKey = "nextPhase";
  } else if (hasNextRound) {
    actionKey = "nextRound";
  } else {
    actionKey = "endGame";
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
          <h2>AKCJA BOTA</h2>
          <p style={{ textAlign: "center", marginBottom: "1rem" }}>
            Czy Bot wykonał przynajmniej jeden efekt z aktualnej karty?
          </p>
          <div className={styles.gameControls}>
            <button
              className="btn-primary"
              onClick={() => setShowDrawCardModal(true)}
            >
              Nie, dobierz kartę
            </button>
            <button
              className="btn-primary"
              onClick={() => setShowActionModal(true)}
            >
              Tak, przejdź dalej
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
        {(() => {
          const drawLocal = advancedTexts?.advancedGame?.drawCard as
            | Record<string, unknown>
            | undefined;
          const drawLocalTitle =
            typeof drawLocal?.title === "string"
              ? (drawLocal.title as string)
              : undefined;
          const drawLocalConfirm =
            typeof drawLocal?.modalConfirm === "string"
              ? (drawLocal.modalConfirm as string)
              : undefined;
          return (
            <ConfirmModal
              isOpen={showDrawCardModal}
              title={
                drawLocalTitle ??
                getModalText("advancedGame", "drawCard.title").message
              }
              message={getModalText("advancedGame", "drawCard.message").message}
              confirmText={drawLocalConfirm ?? commonOk}
              cancelText={modalCancel}
              onConfirm={() => {
                handleDrawCard();
                setShowDrawCardModal(false);
              }}
              onCancel={() => {
                setShowDrawCardModal(false);
              }}
            />
          );
        })()}

        {/* Modal potwierdzenia dla akcji drugiego przycisku */}
        {(() => {
          const { message, notes } = getActionModalMessage();
          return (
            <ConfirmModal
              isOpen={showActionModal}
              title={
                actionKey === "nextBot"
                  ? getUiString(nextBotNode, undefined, "title", "")
                  : actionKey === "nextPhase"
                  ? getUiString(nextPhaseNode, undefined, "title", "")
                  : actionKey === "nextRound"
                  ? getUiString(nextRoundNode, undefined, "title", "")
                  : (endGameNode?.title as string) || ""
              }
              message={message}
              notes={notes}
              confirmText={commonOk}
              cancelText={modalCancel}
              onConfirm={() => {
                setShowActionModal(false);
                // Dla nextBot: jeśli sąsiedni, wykonaj od razu bez drugiego modala
                if (actionKey === "nextBot" && isNextBotAdjacent) {
                  game.nextPlayer();
                }
                // Dla nextBot: jeśli NIE sąsiedni, pokaż drugi modal z listą graczy
                else if (
                  actionKey === "nextBot" &&
                  nextBotIntermediatePlayers.length > 0
                ) {
                  setShowActionInstructionsModal(true);
                }
                // Dla nextPhase: jeśli bot kończy fazę i następny bot zaczyna nową fazę, bez drugiego modala
                else if (
                  actionKey === "nextPhase" &&
                  isLastPlayer &&
                  willBeFirstInNextPhase
                ) {
                  game.nextPhase();
                }
                // Dla nextPhase: pokaż drugi modal jeśli są gracze do wyświetlenia
                else if (
                  actionKey === "nextPhase" &&
                  (endOfPhaseIntermediatePlayers.length > 0 ||
                    nextPhaseIntermediatePlayers.length > 0)
                ) {
                  setShowActionInstructionsModal(true);
                }
                // W pozostałych przypadkach pokaż drugi modal jeśli są notatki
                else if (notes && actionKey !== "endGame") {
                  setShowActionInstructionsModal(true);
                } else {
                  // Wykonaj akcję bezpośrednio
                  if (actionKey === "nextPhase") {
                    game.nextPhase();
                  } else if (actionKey === "nextRound") {
                    game.nextRound();
                  } else if (actionKey === "endGame") {
                    navigate("/advanced-setup");
                  }
                }
              }}
              onCancel={() => {
                setShowActionModal(false);
              }}
            />
          );
        })()}

        {/* Modal instrukcji dla akcji */}
        {(() => {
          const { notes } = getActionModalMessage();
          let instructionTitle = "";
          let instructionMessage: string | React.ReactNode = "";
          let confirmButtonText = commonOk;

          if (
            actionKey === "nextBot" &&
            nextBotIntermediatePlayers.length > 0
          ) {
            // nextBot z pośrednimi graczami - lista graczy jeden pod drugim
            instructionTitle = getModalText(
              "advancedGame",
              "nextBotInstruction.title"
            ).message;

            const confirmTextFromJson = getModalText(
              "advancedGame",
              "nextBotInstruction.confirmText"
            ).message;
            confirmButtonText = confirmTextFromJson.startsWith("[BŁĄD")
              ? commonOk
              : confirmTextFromJson;

            // Mapowanie kolorów na polskie nazwy
            const colorNames: Record<string, string> = {
              red: "Czerwony",
              yellow: "Żółty",
              green: "Zielony",
              orange: "Pomarańczowy",
              blue: "Niebieski",
            };

            // Konwertuj color hex do RGB dla przezroczystości
            const colorToRGB: Record<string, string> = {
              red: "#FF6B6B",
              yellow: "#FFD93D",
              green: "#6BCB77",
              orange: "#FF8C42",
              blue: "#4D96FF",
            };

            // Renderuj jako JSX z listą graczy jeden pod drugim
            instructionMessage = (
              <div>
                <p>
                  {
                    getModalText("advancedGame", "nextBotInstruction.message")
                      .message
                  }
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    marginTop: "12px",
                    alignItems: "center",
                  }}
                >
                  {nextBotIntermediatePlayers.map((player) => (
                    <div
                      key={player.index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          padding: "8px 16px",
                          backgroundColor: colorToRGB[player.color] || "#999",
                          borderRadius: "6px",
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "#000",
                          minWidth: "200px",
                          textAlign: "center",
                        }}
                      >
                        Gracz {colorNames[player.color] || player.color}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          } else if (
            actionKey === "nextPhase" &&
            (endOfPhaseIntermediatePlayers.length > 0 ||
              nextPhaseIntermediatePlayers.length > 0)
          ) {
            // nextPhase - wyświetl graczy z kolorami
            instructionTitle = getModalText(
              "advancedGame",
              "nextPhaseInstruction.title"
            ).message;

            const confirmTextFromJson = getModalText(
              "advancedGame",
              "nextPhaseInstruction.confirmText"
            ).message;
            confirmButtonText = confirmTextFromJson.startsWith("[BŁĄD")
              ? commonOk
              : confirmTextFromJson;

            // Mapowanie kolorów na polskie nazwy (jak w nextBot)
            const colorNames: Record<string, string> = {
              red: "Czerwony",
              green: "Zielony",
              blue: "Niebieski",
              yellow: "Żółty",
              orange: "Pomarańczowy",
              purple: "Fioletowy",
            };

            // Konwertuj color hex do RGB dla przezroczystości
            const colorToRGB: Record<string, string> = {
              red: "#FF6B6B",
              yellow: "#FFD93D",
              green: "#6BCB77",
              orange: "#FF8C42",
              blue: "#4D96FF",
            };

            // Renderuj graczy jeden pod drugim
            instructionMessage = (
              <div>
                <p>
                  {
                    getModalText("advancedGame", "nextPhaseInstruction.message")
                      .message
                  }
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    marginTop: "12px",
                    alignItems: "center",
                  }}
                >
                  {/* Gracze z końca tej fazy */}
                  {endOfPhaseIntermediatePlayers.length > 0 && (
                    <>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "#666",
                          marginTop: "8px",
                        }}
                      >
                        W tej fazie:
                      </div>
                      {endOfPhaseIntermediatePlayers.map((player) => (
                        <div
                          key={player.index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              padding: "8px 16px",
                              backgroundColor:
                                colorToRGB[player.color] || "#999",
                              borderRadius: "6px",
                              fontSize: "16px",
                              fontWeight: "bold",
                              color: "#000",
                              minWidth: "200px",
                              textAlign: "center",
                            }}
                          >
                            Gracz {colorNames[player.color] || player.color}
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Gracze z następnej fazy */}
                  {nextPhaseIntermediatePlayers.length > 0 && (
                    <>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "#666",
                          marginTop: "8px",
                        }}
                      >
                        W następnej fazie:
                      </div>
                      {nextPhaseIntermediatePlayers.map((player) => (
                        <div
                          key={player.index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              padding: "8px 16px",
                              backgroundColor:
                                colorToRGB[player.color] || "#999",
                              borderRadius: "6px",
                              fontSize: "16px",
                              fontWeight: "bold",
                              color: "#000",
                              minWidth: "200px",
                              textAlign: "center",
                            }}
                          >
                            Gracz {colorNames[player.color] || player.color}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            );
          } else if (actionKey === "nextPhase" && notes) {
            // nextPhase - fallback na notatki jeśli brak graczy
            instructionTitle = getModalText(
              "advancedGame",
              "nextPhaseInstruction.title"
            ).message;

            const confirmTextFromJson = getModalText(
              "advancedGame",
              "nextPhaseInstruction.confirmText"
            ).message;
            confirmButtonText = confirmTextFromJson.startsWith("[BŁĄD")
              ? commonOk
              : confirmTextFromJson;

            // Renderuj notatki
            instructionMessage = (
              <div>
                {notes.split("\n").map((line: string, index: number) => (
                  <p key={index} style={{ margin: "8px 0", textAlign: "left" }}>
                    {line}
                  </p>
                ))}
              </div>
            );
          } else {
            // Dla nextRound i innych
            instructionTitle = getModalText(
              "advancedGame",
              "instructionModal.title"
            ).message;
            instructionMessage = getModalText(
              "advancedGame",
              "instructionModal.message"
            ).message;
          }

          return (
            <ConfirmModal
              isOpen={showActionInstructionsModal}
              title={instructionTitle}
              message={instructionMessage}
              confirmText={confirmButtonText}
              cancelText={undefined}
              onConfirm={() => {
                setShowActionInstructionsModal(false);
                if (actionKey === "nextBot") {
                  game.nextPlayer();
                } else if (actionKey === "nextPhase") {
                  game.nextPhase();
                } else if (actionKey === "nextRound") {
                  game.nextRound();
                }
              }}
              onCancel={() => {
                setShowActionInstructionsModal(false);
              }}
            />
          );
        })()}
      </div>

      <BottomControls onBackClick={() => navigate("/")} />
    </Layout>
  );
}
