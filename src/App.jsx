import React, { useState } from "react";
import LandingPage from "./LandingPage";
import WorldMap from "./WorldMap";
import CountryIntro from "./CountryIntro";
import VoicePractice from "./VoicePractice";
import FlightAnimation from "./FlightAnimation";
import GameComplete from "./GameComplete";
import MissedVerbs from "./MissedVerbs";
import { COUNTRIES, getCompletedCodes, saveCompletedCodes } from "./countries.js";

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedTense, setSelectedTense] = useState("All Tenses");
  const [includeVosotros, setIncludeVosotros] = useState(false);
  const [completedCodes, setCompletedCodes] = useState(() => getCompletedCodes("All Tenses"));
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryIndex, setCountryIndex] = useState(0);
  const [nextCountry, setNextCountry] = useState(null);
  const [prevPage, setPrevPage] = useState("map");

  const handleTenseSelect = (tense, vosotros) => {
    setSelectedTense(tense);
    setIncludeVosotros(vosotros);
    setCompletedCodes(getCompletedCodes(tense));
    setPage("map");
  };

  const handlePlay = (country, idx) => {
    setSelectedCountry(country);
    setCountryIndex(idx);
    setPage("intro");
  };

  const handleCountryComplete = () => {
    const newCompleted = new Set([...completedCodes, selectedCountry.code]);
    setCompletedCodes(newCompleted);
    saveCompletedCodes(newCompleted, selectedTense);

    const nextIdx = countryIndex + 1;
    if (nextIdx >= COUNTRIES.length) {
      setPage("gameComplete");
    } else {
      setNextCountry(COUNTRIES[nextIdx]);
      setPage("flying");
    }
  };

  const handleFlightComplete = () => {
    setSelectedCountry(nextCountry);
    setCountryIndex(COUNTRIES.findIndex(c => c.code === nextCountry.code));
    setNextCountry(null);
    setPage("intro");
  };

  const goHome = () => {
    setPage("home");
    setSelectedCountry(null);
    setNextCountry(null);
  };

  const handlePlayAgain = () => {
    const tk = selectedTense.toLowerCase().replace(/\s+/g, "_");
    setCompletedCodes(new Set());
    saveCompletedCodes(new Set(), selectedTense);
    COUNTRIES.forEach((c) => localStorage.removeItem(`conj_${tk}_${c.code}`));
    localStorage.removeItem(`conj_${tk}_missed_verbs`);
    setPage("home");
    setSelectedCountry(null);
  };

  return (
    <>
      {page === "home" && (
        <LandingPage onStart={handleTenseSelect} />
      )}
      {page === "map" && (
        <WorldMap onPlay={handlePlay} completedCodes={completedCodes} onHome={goHome} selectedTense={selectedTense} onViewMissed={() => { setPrevPage("map"); setPage("missed"); }} />
      )}
      {page === "intro" && selectedCountry && (
        <CountryIntro
          country={selectedCountry}
          selectedTense={selectedTense}
          stopNumber={countryIndex + 1}
          totalStops={COUNTRIES.length}
          onContinue={() => setPage("game")}
          onBack={() => setPage("map")}
        />
      )}
      {page === "game" && selectedCountry && (
        <VoicePractice
          selectedTense={selectedTense}
          includeVosotros={includeVosotros}
          country={selectedCountry}
          onBack={() => setPage("map")}
          onHome={goHome}
          onCountryComplete={handleCountryComplete}
        />
      )}
      {page === "flying" && selectedCountry && nextCountry && (
        <FlightAnimation
          fromCountry={selectedCountry}
          toCountry={nextCountry}
          completedCodes={completedCodes}
          onComplete={handleFlightComplete}
        />
      )}
      {page === "gameComplete" && (
        <GameComplete onPlayAgain={handlePlayAgain} selectedTense={selectedTense} onViewMissed={() => { setPrevPage("gameComplete"); setPage("missed"); }} />
      )}
      {page === "missed" && (
        <MissedVerbs selectedTense={selectedTense} onBack={() => setPage(prevPage)} />
      )}
    </>
  );
}
