import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GameProvider } from "@lib/GameContext";
import Home from "@ui/Home";
import Game from "@game/Game";
import LoadGame from "@ui/LoadGame";
import About from "@ui/About";
import "./globals.css";

function App() {
  return (
    <GameProvider>
      <Router basename="/spolka-zoo-bot-pomocnik">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/load" element={<LoadGame />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;
