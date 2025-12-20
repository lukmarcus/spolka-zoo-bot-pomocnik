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
    <Layout>
      <div className={styles.container}>
        {/* Header z informacjami o rundzie i fazie */}
        <div className={styles.header}>
          <div className={styles.roundInfo}>Runda {state.currentRound}/5</div>
          <div className={styles.phaseInfo}>
            Faza {state.currentPhase}/{state.maxPhases}
          </div>
        </div>

        {/* Aktualny gracz */}
        <div className={styles.currentPlayerSection}>
          <h2 className={styles.sectionTitle}>Aktualny gracz</h2>
          <div
            className={styles.playerCard}
            style={{
              backgroundColor: currentPlayer.color,
              color: currentPlayer.color === "yellow" ? "#000" : "#fff",
            }}
          >
            <div className={styles.playerName}>
              {currentPlayer.color.toUpperCase()}
              {currentPlayer.isBot && " (BOT)"}
            </div>
          </div>
        </div>

        {/* Karta bota (jeśli aktualny gracz to bot) */}
        {currentBotCard && (
          <div className={styles.botCardSection}>
            <h3 className={styles.sectionTitle}>Karta bota</h3>
            <div className={styles.botCard}>
              <div className={styles.botCardContent}>{currentBotCard}</div>
            </div>
          </div>
        )}

        {/* Lista graczy */}
        <div className={styles.playersSection}>
          <h3 className={styles.sectionTitle}>Gracze</h3>
          <div className={styles.playersList}>
            {state.players.map((player, index) => (
              <div
                key={player.id}
                className={`${styles.playerItem} ${
                  index === state.currentPlayerIndex ? styles.active : ""
                }`}
                style={{ borderColor: player.color }}
              >
                <div
                  className={styles.playerColorDot}
                  style={{ backgroundColor: player.color }}
                />
                <span className={styles.playerItemName}>
                  {player.color.toUpperCase()}
                  {player.isBot && " (BOT)"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Wyświetlenie karty */}
        {cardDisplay.isVisible && cardDisplay.cardId !== null && (
          <CardDisplay cardId={cardDisplay.cardId} game={game} />
        )}

        {/* Przyciski akcji */}
        <div className={styles.actions}>
          <button className={styles.actionButton} onClick={handleDrawCard}>
            Dobierz kartę
          </button>
          <button className={styles.actionButton} onClick={actionButtonAction}>
            {actionButtonText}
          </button>
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
      </div>
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
    <div className={styles.cardSection}>
      <div className={styles.cardDisplay}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Karta #{card.id}</h3>
        </div>

        <div className={styles.cardBody}>
          {/* Efekty */}
          <div className={styles.effectsSection}>
            <h4 className={styles.cardSectionLabel}>Efekty:</h4>
            <div className={styles.effectsList}>
              {card.effects.map((effect, idx) => (
                <div key={idx} className={styles.effectItem}>
                  <span className={styles.effectNumber}>{idx + 1}.</span>
                  <div
                    className={styles.effectContent}
                    dangerouslySetInnerHTML={{ __html: effect }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Zdolność */}
          <div className={styles.abilitySection}>
            <h4 className={styles.cardSectionLabel}>Zdolność:</h4>
            <div
              className={styles.abilityContent}
              dangerouslySetInnerHTML={{ __html: card.ability }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
