import React, { useState } from "react";
import Home from "./Home";
import LevelSelection from "./levelselection";
import VoicePractice from "./VoicePractice";

export default function App() {
  const [page, setPage] = useState("home"); // home, level, game
  const [selectedLevel, setSelectedLevel] = useState("");
  const [includeVosotros, setIncludeVosotros] = useState(false);
  const [selectedTense, setSelectedTense] = useState("");

  const startLevelSelection = (tense, includeVosotros) => {
  setSelectedTense(tense);
  setIncludeVosotros(includeVosotros);
  setPage("level");
};

  const startGame = (level) => {
    setSelectedLevel(level);
    setPage("game");
  };

  const goHome = () => {
    setPage("home");
    setSelectedLevel("");
    setSelectedTense("");
  };

  return (
  <>
    {page === "home" && <Home onStart={startLevelSelection} />}
    {page === "level" && <LevelSelection onSelect={startGame} onBack={() => setPage("home")} />}
    {page === "game" && (
      <VoicePractice
        selectedTense={selectedTense}
        includeVosotros={includeVosotros}
        level={selectedLevel}
        onBack={() => setPage("level")}
      />
    )}
  </>
);
}
