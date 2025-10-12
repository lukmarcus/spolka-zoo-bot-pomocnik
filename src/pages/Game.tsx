import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import Layout from "../components/Layout";
import GameSetup from "../components/game/GameSetup";
import GamePlay from "../components/game/GamePlay";
import styles from "./Game.module.css";

const Game: React.FC = () => {
  const navigate = useNavigate();
  const game = useGame();
  const hasReset = useRef(false);

  // Reset game state on page refresh to ensure clean bot selection
  React.useEffect(() => {
    // Only reset once on component mount
    if (!hasReset.current && !game.state.botsSelected) {
      hasReset.current = true;
      game.resetGame();
    }
  }, [game, game.state.botsSelected]);

  const handleBackToMenu = () => {
    game.resetGame();
    navigate("/");
  };

  const handleGameStart = () => {
    // Game start is handled by GameSetup component
    // The setup component draws the first card and transitions to GamePlay
  };

  // Check if we're actually in a game (cards have been drawn)
  const inActiveGame =
    game.state.botsSelected &&
    ((game.state.mode === "individual" &&
      game.state.botDecks &&
      game.state.currentBot &&
      (game.state.botDecks[game.state.currentBot - 1]?.currentCardIndex ??
        -1) >= 0) ||
      (game.state.mode !== "individual" &&
        typeof game.state.currentCardIndex === "number" &&
        game.state.currentCardIndex >= 0));

  // Dynamic title based on actual game state
  const pageTitle = inActiveGame ? "Gra w toku" : "Rozpocznij grę";

  // Dynamic subtitle based on game state
  const getPageSubtitle = () => {
    if (!inActiveGame) {
      return "Wybierz liczbę botów";
    }

    const botCount = game.state.botCount || 0;
    const mode =
      game.state.mode === "shared" ? "wspólna talia" : "osobne talie";
    return `${botCount} bot${botCount > 1 ? "y" : ""}, ${mode}`;
  };

  return (
    <Layout
      title={pageTitle}
      subtitle={getPageSubtitle()}
      backgroundType="game"
    >
      <div className={styles.gameContainer}>
        {!inActiveGame ? (
          <GameSetup onGameStart={handleGameStart} />
        ) : (
          <GamePlay onBackToMenu={handleBackToMenu} />
        )}
      </div>
    </Layout>
  );
};

export default Game;
