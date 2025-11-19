import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@lib/GameContext";
import Layout from "@ui/Layout";
import GameSetup from "./GameSetup";
import GamePlay from "./GamePlay";

const Game: React.FC = () => {
  const navigate = useNavigate();
  const game = useGame();
  const hasReset = useRef(false);

  React.useEffect(() => {
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
    // Handled by GameSetup component
  };

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

  const pageTitle = inActiveGame ? "GRA W TOKU" : "ROZPOCZNIJ GRĘ";
  const getPageSubtitle = () => {
    if (!inActiveGame) {
      return "Wybierz liczbę botów i tryb gry";
    }

    const botCount = game.state.botCount || 0;
    let mode;
    if (botCount === 1) {
      mode = "jedna talia";
    } else {
      mode = game.state.mode === "shared" ? "wspólna talia" : "osobne talie";
    }
    return `${botCount} bot${botCount > 1 ? "y" : ""}, ${mode}`;
  };

  return (
    <Layout
      title={pageTitle}
      subtitle={getPageSubtitle()}
      backgroundType="game"
    >
      {!inActiveGame ? (
        <GameSetup
          onGameStart={handleGameStart}
          onBackToMenu={handleBackToMenu}
        />
      ) : (
        <GamePlay onBackToMenu={handleBackToMenu} />
      )}
    </Layout>
  );
};

export default Game;
