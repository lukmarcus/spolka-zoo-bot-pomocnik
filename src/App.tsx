import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GameProvider } from "@lib/GameContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "@ui/Home";
import Game from "@game/Game";
import AdvancedSetup from "@game/AdvancedSetup";
import LoadGame from "@ui/LoadGame";
import About from "@ui/About";
import Rules from "@ui/Rules";
import "./globals.css";

function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <Router basename="/spolka-zoo-bot-pomocnik">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="/advanced-setup" element={<AdvancedSetup />} />
            <Route path="/load" element={<LoadGame />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Router>
      </GameProvider>
    </ErrorBoundary>
  );
}

export default App;
