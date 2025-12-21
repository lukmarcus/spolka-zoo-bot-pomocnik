import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@lib/GameContext";
import Layout from "@ui/Layout";
import BottomControls from "@ui/BottomControls";
import ConfirmModal from "@ui/ConfirmModal";
import styles from "./AdvancedGame.module.css";

interface CardDisplayState {
  isVisible: boolean;
  cardId: number | null;
}

export default function AdvancedGame() {
  const navigate = useNavigate();
  const game = useGame();
  const [showNextPlayerModal, setShowNextPlayerModal] = useState(false);
  const [cardDisplay, setCardDisplay] = useState<CardDisplayState>({
    isVisible: false,
    cardId: null,
  });

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

  // Jeśli brak stanu gry, nie renderuj
  if (
    state.gameMode !== "advanced" ||
    !state.players ||
    state.players.length === 0
  ) {
    return null;
  }

  const currentPlayer = state.players[state.currentPlayerIndex!];
  const currentBotDeck = currentPlayer.isBot
    ? state.botDecks?.[state.currentPlayerIndex!]
    : null;
  const currentBotCard = currentBotDeck
    ? currentBotDeck.cardSequence[currentBotDeck.currentCardIndex]
    : null;

  // Sprawdzenie czy jest następny bot
  const hasNextBot = state.players
    .slice(state.currentPlayerIndex! + 1)
    .some((p) => p.isBot);

  // Sprawdzenie czy jest następna faza
  const hasNextPhase = state.currentPhase! < state.maxPhases!;

  // Sprawdzenie czy jest następna runda
  const hasNextRound = state.currentRound! < 5;

  // Dynamiczny tekst i akcja przycisku
  let actionButtonText = "Następny bot";
  let actionButtonAction: () => void;

  if (hasNextBot) {
    actionButtonText = "Następny bot";
    actionButtonAction = () => {
      setShowNextPlayerModal(true);
    };
  } else if (hasNextPhase) {
    actionButtonText = "Koniec fazy";
    actionButtonAction = () => {
      game.nextPhase();
    };
  } else if (hasNextRound) {
    actionButtonText = "Koniec rundy";
    actionButtonAction = () => {
      game.nextRound();
    };
  } else {
    actionButtonText = "Koniec gry";
    actionButtonAction = () => {
      navigate("/");
    };
  }

  const handleDrawCard = () => {
    const currentCardId = game.getCurrentCard();
    if (currentCardId !== null) {
      setCardDisplay({
        isVisible: !cardDisplay.isVisible,
        cardId: currentCardId,
      });
    }
  };

  return (
    <Layout backgroundType="game">
      <div className="card">
        {/* Header z informacjami o rundzie i fazie */}
        <section className="section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "1.3rem",
              fontWeight: "bold",
            }}
          >
            <div>Runda {state.currentRound}/5</div>
            <div>
              Faza {state.currentPhase}/{state.maxPhases}
            </div>
          </div>
        </section>

        {/* Aktualny gracz */}
        <section className="section">
          <h2>AKTUALNY GRACZ</h2>
          <div
            style={{
              padding: "2rem",
              borderRadius: "var(--border-radius)",
              textAlign: "center",
              backgroundColor: currentPlayer.color,
              color: currentPlayer.color === "yellow" ? "#000" : "#fff",
              fontSize: "1.8rem",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {currentPlayer.color.toUpperCase()}
            {currentPlayer.isBot && " (BOT)"}
          </div>
        </section>

        {/* Karta bota (jeśli aktualny gracz to bot) */}
        {currentBotCard && (
          <section className="section">
            <h3>KARTA BOTA</h3>
            <div
              className="card-content"
              style={{ fontSize: "1.3rem", fontWeight: "bold" }}
            >
              {currentBotCard}
            </div>
          </section>
        )}

        {/* Lista graczy */}
        <section className="section">
          <h3>GRACZE</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {state.players.map((player, index) => (
              <div
                key={player.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "1rem",
                  backgroundColor: "var(--card-bg)",
                  border:
                    index === state.currentPlayerIndex
                      ? "3px solid var(--button-primary)"
                      : "2px solid var(--card-border)",
                  borderRadius: "var(--border-radius)",
                  transition: "all 0.2s",
                  boxShadow:
                    index === state.currentPlayerIndex
                      ? "var(--shadow-medium)"
                      : "var(--shadow-light)",
                  transform:
                    index === state.currentPlayerIndex
                      ? "scale(1.02)"
                      : "scale(1)",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: player.color,
                    border: "2px solid var(--text-primary)",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                />
                <span style={{ fontSize: "1.1rem", fontWeight: "600" }}>
                  {player.color.toUpperCase()}
                  {player.isBot && " (BOT)"}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Wyświetlenie karty */}
        {cardDisplay.isVisible && cardDisplay.cardId !== null && (
          <CardDisplay cardId={cardDisplay.cardId} game={game} />
        )}

        {/* Przyciski akcji */}
        <section className="section">
          <div className={styles.gameControls}>
            <button className="btn-primary" onClick={handleDrawCard}>
              Dobierz kartę
            </button>
            <button className="btn-secondary" onClick={actionButtonAction}>
              {actionButtonText}
            </button>
          </div>
        </section>
      </div>

      {/* Modal potwierdzenia (tylko dla "Następny bot") */}
      {actionButtonText === "Następny bot" && (
        <ConfirmModal
          isOpen={showNextPlayerModal}
          message="Przejść do następnego bota?"
          onConfirm={() => {
            game.nextPlayer();
            setShowNextPlayerModal(false);
          }}
          onCancel={() => setShowNextPlayerModal(false)}
        />
      )}

      <BottomControls onBackClick={() => navigate("/")} />
    </Layout>
  );
}

// Komponent wyświetlenia karty
interface CardDisplayProps {
  cardId: number;
  game: ReturnType<typeof useGame>;
}

function CardDisplay({ cardId, game }: CardDisplayProps) {
  const card = game.getCardById(cardId);
  if (!card) return null;

  return (
    <section className="section">
      <h3>KARTA #{card.id}</h3>

      {/* Efekty */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h4
          style={{
            fontSize: "1.1rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Efekty:
        </h4>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
        >
          {card.effects.map((effect, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: "0.8rem",
                padding: "0.8rem",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderLeft: "4px solid var(--button-primary)",
                borderRadius: "4px",
              }}
            >
              <span
                style={{
                  fontWeight: "bold",
                  color: "var(--button-primary)",
                  minWidth: "25px",
                }}
              >
                {idx + 1}.
              </span>
              <div
                style={{
                  color: "var(--text-primary)",
                  lineHeight: "1.5",
                  fontSize: "1rem",
                }}
                dangerouslySetInnerHTML={{ __html: effect }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Zdolność */}
      <div
        style={{
          paddingTop: "1rem",
          borderTop: "2px solid var(--card-border)",
        }}
      >
        <h4
          style={{
            fontSize: "1.1rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Zdolność:
        </h4>
        <div
          style={{
            padding: "1.2rem",
            backgroundColor: "rgba(139, 69, 19, 0.05)",
            border: "2px solid var(--button-secondary)",
            borderRadius: "var(--border-radius)",
            color: "var(--text-primary)",
            lineHeight: "1.6",
            fontSize: "1.05rem",
            fontWeight: "500",
          }}
          dangerouslySetInnerHTML={{ __html: card.ability }}
        />
      </div>
    </section>
  );
}
