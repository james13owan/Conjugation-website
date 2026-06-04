import React, { useState } from "react";
import LandingPage from "./LandingPage";
import LevelSelection from "./levelselection";
import VoicePractice from "./VoicePractice";

export default function App() {
  const [page, setPage] = useState("landing");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [includeVosotros, setIncludeVosotros] = useState(false);
  const [selectedTense, setSelectedTense] = useState("");

  const startLevelSelection = (tense, vosotros) => {
    setSelectedTense(tense);
    setIncludeVosotros(vosotros);
    setPage("level");
  };

  const startGame = (level) => {
    setSelectedLevel(level);
    setPage("game");
  };

  const goHome = () => {
    setPage("landing");
    setSelectedLevel("");
    setSelectedTense("");
  };

  return (
    <>
      {page === "landing" && <LandingPage onStart={startLevelSelection} />}
      {page === "level" && <LevelSelection onSelect={startGame} onBack={goHome} />}
      {page === "game" && (
        <VoicePractice
          selectedTense={selectedTense}
          includeVosotros={includeVosotros}
          level={selectedLevel}
          onBack={() => setPage("level")}
          onHome={goHome}
        />
      )}
    </>
  );
}
