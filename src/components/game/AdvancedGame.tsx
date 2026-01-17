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
  const [showFirstPhaseModal, setShowFirstPhaseModal] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  const { state } = game;

  // Check if we're in advanced mode
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

  // If no game state, don't render
  if (
    state.gameMode !== "advanced" ||
    !state.players ||
    state.players.length === 0
  ) {
    return null;
  }

  // Check if there's a next bot
  const hasNextBot = state.players
    .slice(state.currentPlayerIndex! + 1)
    .some((p) => p.isBot);

  // Index of the next bot (in the full list) or -1 if none exists
  const nextBotIndex = (() => {
    for (let i = state.currentPlayerIndex! + 1; i < state.players.length; i++) {
      if (state.players[i].isBot) return i;
    }
    return -1;
  })();

  const isNextBotAdjacent = nextBotIndex === state.currentPlayerIndex! + 1;

  // For nextBot when not adjacent - find ALL players between bots
  const nextBotIntermediatePlayers = (() => {
    if (isNextBotAdjacent || nextBotIndex === -1) return [];
    const players = [];
    for (let i = state.currentPlayerIndex! + 1; i < nextBotIndex; i++) {
      players.push({ index: i, ...state.players[i] });
    }
    return players;
  })();

  // Check if there's a next phase
  const hasNextPhase = state.currentPhase! < state.maxPhases!;

  // Check if there's a next round
  const hasNextRound = state.currentRound! < 5;

  // Whether the current player is the last player
  const isLastPlayer = state.currentPlayerIndex === state.players!.length - 1;

  // For nextPhase: whether the first player of the next phase is a bot
  // NOTE: This was previously used but is now unused since nextPhase is a single modal
  // const willBeFirstInNextPhase = isLastPlayer && state.players[0].isBot;

  // For nextPhase: players from the next one after the bot to the end of this phase
  const endOfPhaseIntermediatePlayers = (() => {
    const players = [];
    // Players BETWEEN the bot and the end of the phase (not including the bot itself)
    for (let i = state.currentPlayerIndex! + 1; i < state.players.length; i++) {
      players.push({ index: i, ...state.players[i] });
    }
    return players;
  })();

  // For nextPhase: players in the new phase from 0 to the first bot
  const nextPhaseIntermediatePlayers = (() => {
    if (!hasNextPhase) return [];
    const players = [];
    for (let i = 0; i < state.players.length; i++) {
      if (state.players[i].isBot) break;
      players.push({ index: i, ...state.players[i] });
    }
    return players;
  })();

  // For nextRound: players remaining in current phase and players in next round after rotation
  const nextRoundPlayers = (() => {
    if (!hasNextRound) return { endOfRound: [], startOfNextRound: [] };

    // Players remaining to act in current phase (after current player to end)
    const endOfRound = [];
    for (let i = state.currentPlayerIndex! + 1; i < state.players.length; i++) {
      endOfRound.push({ index: i, ...state.players[i] });
    }

    // After rotation, players from 0 to first bot in new round
    const rotatedPlayers = [...state.players.slice(1), state.players[0]];
    const startOfNextRound = [];
    for (let i = 0; i < rotatedPlayers.length; i++) {
      if (rotatedPlayers[i].isBot) break;
      startOfNextRound.push({ index: i, ...rotatedPlayers[i] });
    }

    return { endOfRound, startOfNextRound };
  })();

  // For firstPhase: players before first bot at game start
  const firstPhasePlayers = (() => {
    const players = [];
    for (let i = 0; i < state.players.length; i++) {
      if (state.players[i].isBot) break;
      players.push({ index: i, ...state.players[i] });
    }
    return players;
  })();

  // Color mappings for modals - same as in AdvancedSetup
  const colorToRGB: Record<string, string> = {
    red: "#da4833",
    yellow: "#f3ba3a",
    green: "#80ac48",
    orange: "#eb7433",
    blue: "#89c2cf",
  };

  const colorNames: Record<string, string> = {
    red: "Czerwony",
    yellow: "Żółty",
    green: "Zielony",
    orange: "Pomarańczowy",
    blue: "Niebieski",
  };

  // Text for the second button in the action modal — retrieved from modalTexts.json
  const getActionModalMessage = (): {
    message: string | React.ReactNode;
    notes?: string;
  } => {
    if (actionKey === "nextBot") {
      const messageKey = isNextBotAdjacent ? "adjacent" : "notAdjacent";
      const baseMessage = getModalText(
        "advancedGame",
        `nextBot.message.${messageKey}`
      ).message;

      const instructionLabel = getModalText(
        "advancedGame",
        "nextBot.instructionLabel"
      ).message;

      const centeredMessage = (
        <div>
          <p style={{ textAlign: "center" }}>{baseMessage}</p>
          {nextBotIntermediatePlayers.length > 0 && (
            <>
              <div className={styles.phaseLabel} style={{ marginTop: "12px" }}>
                {instructionLabel}
              </div>
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
                  <div key={player.index} className={styles.playerBox}>
                    <div
                      style={{
                        backgroundColor: colorToRGB[player.color] || "#999",
                      }}
                      className={styles.playerBoxContent}
                    >
                      Gracz {colorNames[player.color] || player.color}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      );

      return {
        message: centeredMessage,
        notes: undefined,
      };
    }

    if (actionKey === "nextPhase") {
      // Select message variant: depends on bot count
      const botCount = state.players!.filter((p) => p.isBot).length;
      const messageKey = botCount === 1 ? "single" : "multiple";

      const base = getModalText(
        "advancedGame",
        `nextPhase.message.${messageKey}`
      );

      const baseMessage = base.message;
      const marketPhase = getModalText(
        "advancedGame",
        "nextPhase.marketPhase"
      ).message;

      const centeredMessage = (
        <div>
          <p style={{ textAlign: "center" }}>{baseMessage}</p>
          {(endOfPhaseIntermediatePlayers.length > 0 ||
            nextPhaseIntermediatePlayers.length > 0) && (
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
                  <div className={styles.phaseLabel}>
                    {
                      getModalText(
                        "advancedGame",
                        "nextPhase.currentPhasePlayers"
                      ).message
                    }
                  </div>
                  {endOfPhaseIntermediatePlayers.map((player) => (
                    <div key={player.index} className={styles.playerBox}>
                      <div
                        style={{
                          backgroundColor: colorToRGB[player.color] || "#999",
                        }}
                        className={styles.playerBoxContent}
                      >
                        Gracz {colorNames[player.color] || player.color}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Market Phase */}
              {marketPhase && (
                <div className={styles.phaseLabel}>{marketPhase}</div>
              )}

              {/* Gracze z następnej fazy */}
              {nextPhaseIntermediatePlayers.length > 0 && (
                <>
                  <div className={styles.phaseLabel}>
                    {
                      getModalText("advancedGame", "nextPhase.nextPhasePlayers")
                        .message
                    }
                  </div>
                  {nextPhaseIntermediatePlayers.map((player) => (
                    <div key={player.index} className={styles.playerBox}>
                      <div
                        style={{
                          backgroundColor: colorToRGB[player.color] || "#999",
                        }}
                        className={styles.playerBoxContent}
                      >
                        Gracz {colorNames[player.color] || player.color}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      );

      return {
        message: centeredMessage,
        notes: undefined,
      };
    }

    if (actionKey === "nextRound") {
      const botCount = state.players!.filter((p) => p.isBot).length;

      const messageKey = botCount === 1 ? "single" : "multiple";
      const base = getModalText(
        "advancedGame",
        `nextRound.message.${messageKey}`
      );

      const baseMessage = base.message;

      const note1 = getModalText("advancedGame", "nextRound.note1");
      const note2 = getModalText("advancedGame", "nextRound.note2");
      const note5Key =
        botCount === 1
          ? "single"
          : state.mode === "shared"
          ? "multiple_shared"
          : "multiple_individual";
      const note3 = getModalText("advancedGame", `nextRound.note3.${note5Key}`);

      const currentPhaseLabel = getModalText(
        "advancedGame",
        "nextRound.phaseLabels.current"
      ).message;
      const nextRoundLabel = getModalText(
        "advancedGame",
        "nextRound.phaseLabels.next"
      ).message;

      const message = (
        <div>
          <p style={{ textAlign: "center" }}>{baseMessage}</p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginTop: "12px",
              alignItems: "center",
            }}
          >
            {/* Players remaining in current round */}
            {nextRoundPlayers.endOfRound.length > 0 && (
              <>
                <div className={styles.phaseLabel}>{currentPhaseLabel}</div>
                {nextRoundPlayers.endOfRound.map((player) => (
                  <div key={player.index} className={styles.playerBox}>
                    <div
                      style={{
                        backgroundColor: colorToRGB[player.color] || "#999",
                      }}
                      className={styles.playerBoxContent}
                    >
                      Gracz {colorNames[player.color] || player.color}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Market phase */}
            {note2?.message && <p>{note2.message}</p>}

            {/* Player rotation */}
            {note1?.message && <p>{note1.message}</p>}

            {/* Deck shuffle */}
            {note3?.message && <p>{note3.message}</p>}

            {/* Players to act in next round */}
            {nextRoundPlayers.startOfNextRound.length > 0 && (
              <>
                <div className={styles.phaseLabel}>{nextRoundLabel}</div>
                {nextRoundPlayers.startOfNextRound.map((player) => (
                  <div key={player.index} className={styles.playerBox}>
                    <div
                      style={{
                        backgroundColor: colorToRGB[player.color] || "#999",
                      }}
                      className={styles.playerBoxContent}
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

      return {
        message: message,
        notes: undefined,
      };
    }

    const key = isLastPlayer ? "endGame.last" : "endGame.notLast";
    const { message, notes } = getModalText("advancedGame", key);
    return { message, notes: notes ? notes.join("\n") : undefined };
  };

  // Dynamic text and button action
  // Labels come from modalTexts.json -> advancedGame.gameButtons
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
                <div className={styles.playerSquareNumber}>
                  G{player.playerNumber}
                </div>
                <div>{player.isBot ? "BOT" : "CZ"}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Przyciski akcji - przed kartą */}
        <section className="section">
          <h2>AKCJA BOTA</h2>
          <p style={{ textAlign: "center", marginBottom: "1rem" }}>
            {getModalText("advancedGame", "checkBotEffect.message").message}
          </p>
          <div className={styles.gameControls}>
            <button
              className="btn-primary"
              onClick={() => setShowDrawCardModal(true)}
            >
              {getModalText("advancedGame", "checkBotEffect.cancelText").message}
            </button>
            <button
              className="btn-primary"
              onClick={() => setShowActionModal(true)}
            >
              {getModalText("advancedGame", "checkBotEffect.confirmText").message}
            </button>
          </div>
        </section>
        {drawnCardObject && gameStarted && (
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

              // Build sections array (effects + ability)
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
            typeof drawLocal?.confirmText === "string"
              ? (drawLocal.confirmText as string)
              : undefined;
          return (
            <ConfirmModal
              isOpen={showDrawCardModal}
              title={
                drawLocalTitle ??
                getModalText("advancedGame", "drawCard.title").message
              }
              message={getModalText("advancedGame", "drawCard.message").message}
              confirmText={drawLocalConfirm ?? getModalText("advancedGame", "drawCard.confirmText").message}
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
          const { message } = getActionModalMessage();
          
          let confirmText = getModalText("advancedGame", "common.modalOk").message;
          if (actionKey === "nextBot") {
            confirmText = getModalText("advancedGame", "nextBot.confirmText").message;
          } else if (actionKey === "nextPhase") {
            confirmText = getModalText("advancedGame", "nextPhase.confirmText").message;
          } else if (actionKey === "nextRound") {
            confirmText = getModalText("advancedGame", "nextRound.confirmText").message;
          } else if (actionKey === "endGame") {
            confirmText = getModalText("advancedGame", "endGame.confirmText").message;
          }

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
              confirmText={confirmText}
              cancelText={modalCancel}
              onConfirm={() => {
                setShowActionModal(false);
                // nextBot: always execute directly (all content is in single modal)
                if (actionKey === "nextBot") {
                  game.nextPlayer();
                }
                // nextPhase: always execute directly (all content is in single modal)
                else if (actionKey === "nextPhase") {
                  game.nextPhase();
                }
                // nextRound: always execute directly (all content is in single modal)
                else if (actionKey === "nextRound") {
                  game.nextRound();
                } else if (actionKey === "endGame") {
                  navigate("/advanced-setup");
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
          let instructionTitle = "";
          let instructionMessage: string | React.ReactNode = "";
          let confirmButtonText = getModalText(
            "advancedGame",
            "common.modalOk"
          ).message;

          if (
            actionKey === "nextBot" &&
            nextBotIntermediatePlayers.length > 0
          ) {
            // nextBot z pośrednimi graczami - lista graczy jeden pod drugim
            instructionTitle = getModalText(
              "advancedGame",
              "nextBot.title"
            ).message;

            const confirmTextFromJson = getModalText(
              "advancedGame",
              "nextBot.confirmText"
            ).message;
            confirmButtonText = confirmTextFromJson;

            // Mapowanie kolorów na polskie nazwy
            const colorNames: Record<string, string> = {
              red: "Czerwony",
              yellow: "Żółty",
              green: "Zielony",
              orange: "Pomarańczowy",
              blue: "Niebieski",
            };

            // Renderuj jako JSX z listą graczy jeden pod drugim
            instructionMessage = (
              <div>
                <p>
                  {getModalText("advancedGame", "nextBot.message2").message}
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
                }
              }}
              onCancel={() => {
                setShowActionInstructionsModal(false);
              }}
            />
          );
        })()}

        {/* Modal dla pierwszej fazy na starcie gry */}
        {(() => {
          const botCount = state.players.filter((p) => p.isBot).length;
          const messageKey = botCount === 1 ? "single" : "multiple";
          const base = getModalText(
            "advancedGame",
            `firstPhase.message.${messageKey}`
          );

          const baseMessage = base.message;
          const phaseLabel = getModalText(
            "advancedGame",
            "firstPhase.phaseLabel"
          ).message;

          const message = (
            <div>
              <p style={{ textAlign: "center" }}>{baseMessage}</p>

              {firstPhasePlayers.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    marginTop: "12px",
                    alignItems: "center",
                  }}
                >
                  <div className={styles.phaseLabel}>{phaseLabel}</div>
                  {firstPhasePlayers.map((player) => (
                    <div key={player.index} className={styles.playerBox}>
                      <div
                        style={{
                          backgroundColor: colorToRGB[player.color] || "#999",
                        }}
                        className={styles.playerBoxContent}
                      >
                        Gracz {colorNames[player.color] || player.color}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );

          return (
            <ConfirmModal
              isOpen={showFirstPhaseModal && !gameStarted && firstPhasePlayers.length > 0}
              title={getModalText("advancedGame", "firstPhase.title").message}
              message={message}
              confirmText={getModalText("advancedGame", "firstPhase.confirmText").message}
              cancelText={getModalText("advancedGame", "firstPhase.cancelText").message}
              onConfirm={() => {
                setShowFirstPhaseModal(false);
                setGameStarted(true);
              }}
              onCancel={() => {
                setShowFirstPhaseModal(false);
                navigate("/advanced-setup");
              }}
            />
          );
        })()}
      </div>

      <BottomControls onBackClick={() => navigate("/")} />
    </Layout>
  );
}
