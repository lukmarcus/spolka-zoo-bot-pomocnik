import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GameProvider } from "./lib/GameContext";
import Home from "./components/ui/Home";
import Game from "./components/game/Game";
import "./globals.css";

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;
