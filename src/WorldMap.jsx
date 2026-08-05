import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { COUNTRIES, GEO_URL, SPANISH_ID_SET, getCompletedCodes, getCountryCoins, COINS_PER_COUNTRY, tenseKey } from "./countries.js";

export default function WorldMap({ onPlay, completedCodes: completedCodesProp, onHome, onViewMissed, selectedTense }) {
  const [completedCodes, setCompletedCodes] = useState(() => completedCodesProp || getCompletedCodes());
  const [selected, setSelected] = useState(null);
  const tk = tenseKey(selectedTense);
  const [accuracy] = useState(() => parseFloat(localStorage.getItem(`conj_${tk}_accuracy`) || "0"));
  const [lastCountryName] = useState(() => localStorage.getItem(`conj_${tk}_last_country_name`) || "");
  const [cumCorrect] = useState(() => parseInt(localStorage.getItem(`conj_${tk}_cumulative_correct`) || "0", 10));
  const [cumTotal] = useState(() => parseInt(localStorage.getItem(`conj_${tk}_cumulative_total`) || "0", 10));
  const totalAccuracy = cumTotal > 0 ? Math.round((cumCorrect / cumTotal) * 100) : 0;
  const [bestStreak] = useState(() => parseInt(localStorage.getItem(`conj_${tk}_streak`) || "0", 10));
  const [zoom, setZoom] = useState(1);
  const [mapCenter, setMapCenter] = useState([0, 15]);

  useEffect(() => {
    if (completedCodesProp) setCompletedCodes(completedCodesProp);
  }, [completedCodesProp]);

  // Current = first country not yet completed
  const currentIdx = COUNTRIES.findIndex((c) => !completedCodes.has(c.code));
  const currentCountry = currentIdx >= 0 ? COUNTRIES[currentIdx] : null;

  // Default selection to current country
  useEffect(() => {
    setSelected(currentCountry || COUNTRIES[COUNTRIES.length - 1]);
  }, [currentIdx]);

  const isCompleted = (code) => completedCodes.has(code);
  const isCurrent = (idx) => idx === currentIdx;
  const isLocked = (idx) => idx > currentIdx && currentIdx >= 0;

  const getCountryFill = (numId, hover) => {
    if (!SPANISH_ID_SET.has(numId)) return hover ? "#2a4060" : "#1e3350";
    const idx = COUNTRIES.findIndex((c) => c.numId === numId);
    const code = COUNTRIES[idx]?.code;
    if (isCompleted(code)) return `url(#flag-${code})`;
    if (isCurrent(idx)) return hover ? "#fbbf24" : "#f59e0b";
    return hover ? "#4f46e5" : "#3730a3";
  };

  const handleCountryClick = (numId) => {
    const idx = COUNTRIES.findIndex((c) => c.numId === numId);
    if (idx < 0) return;
    if (!isLocked(idx)) setSelected(COUNTRIES[idx]);
  };

  const selectedCoins = selected ? getCountryCoins(selected.code, selectedTense) : 0;
  const selectedCompleted = selected && isCompleted(selected.code);
  const selectedLocked = selected ? isLocked(COUNTRIES.findIndex((c) => c.code === selected.code)) : true;
  const countriesCompleted = completedCodes.size;

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0e2040", position: "relative", overflow: "hidden", fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>

      {/* MAP */}
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: 180, rotate: [60, 0, 0] }}
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          {COUNTRIES.filter(c => isCompleted(c.code)).map(c => (
            <pattern
              key={`flag-pattern-${c.code}`}
              id={`flag-${c.code}`}
              patternUnits="objectBoundingBox"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <image
                href={`https://flagcdn.com/${c.code.toLowerCase()}.svg`}
                x="0"
                y="0"
                width="1"
                height="1"
                preserveAspectRatio="xMidYMid slice"
              />
            </pattern>
          ))}
        </defs>

        <ZoomableGroup
          zoom={zoom}
          center={mapCenter}
          minZoom={0.8}
          maxZoom={20}
          onMoveEnd={({ coordinates, zoom: z }) => { setMapCenter(coordinates); setZoom(z); }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const numId = Number(geo.id);
                const isSpanish = SPANISH_ID_SET.has(numId);
                const idx = COUNTRIES.findIndex((c) => c.numId === numId);
                const code = COUNTRIES[idx]?.code;
                const completed = isCompleted(code);
                const isSelectedGeo = selected && selected.numId === numId;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => isSpanish && handleCountryClick(numId)}
                    style={{
                      default: {
                        fill: completed ? `url(#flag-${code})` : isSelectedGeo ? "#fbbf24" : getCountryFill(numId, false),
                        stroke: isSelectedGeo ? "#ffffffaa" : "#ffffff25",
                        strokeWidth: isSelectedGeo ? 1.5 / zoom : 0.5 / zoom,
                        outline: "none",
                      },
                      hover: {
                        fill: completed ? `url(#flag-${code})` : getCountryFill(numId, true),
                        stroke: isSpanish ? "#ffffff55" : "#ffffff25",
                        strokeWidth: (isSpanish ? 1 : 0.5) / zoom,
                        outline: "none",
                        cursor: isSpanish && !isLocked(idx) ? "pointer" : "default",
                      },
                      pressed: { fill: completed ? `url(#flag-${code})` : "#f59e0b", outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Lock markers */}
          {COUNTRIES.map((country, idx) => {
            if (!isLocked(idx)) return null;
            return (
              <Marker key={`lock-${country.code}`} coordinates={country.center}>
                <text textAnchor="middle" dominantBaseline="middle" style={{ fontSize: `${11 / zoom}px`, userSelect: "none", pointerEvents: "none" }}>🔒</text>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* HEADER */}
      <div style={{ position: "absolute", top: "20px", left: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
        <h1 style={{ color: "white", margin: 0, fontSize: "2rem", fontWeight: 900, letterSpacing: "0.02em" }}>Conjugación</h1>
        <span style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.75)", padding: "8px 18px", borderRadius: "12px", fontSize: "0.95rem" }}>
          Spanish Verb Journey
        </span>
        {selectedTense && (
          <span style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", color: "#fbbf24", padding: "8px 18px", borderRadius: "12px", fontSize: "0.95rem", fontWeight: 700 }}>
            {selectedTense}
          </span>
        )}
        {onHome && (
          <button
            onClick={onHome}
            title="Back to tense selection"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", width: "46px", height: "46px", borderRadius: "12px", fontSize: "1.4rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
          >
            🏠
          </button>
        )}
        {onViewMissed && (
          <button
            onClick={onViewMissed}
            style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.35)", color: "#f87171", padding: "0 18px", height: "46px", borderRadius: "12px", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(248,113,113,0.1)"}
          >
            📋 Missed Verbs
          </button>
        )}
      </div>

      {/* STATS */}
      <div style={{ position: "absolute", top: "20px", right: "24px", display: "flex", gap: "10px" }}>
        <StatChip label="Countries" value={`${countriesCompleted}/${COUNTRIES.length}`} valueColor="#4ade80" />
        <StatChip label={lastCountryName ? `Accuracy · ${lastCountryName}` : "Last Country"} value={lastCountryName ? `${accuracy}%` : "—"} valueColor="white" />
        <StatChip label="Total Accuracy" value={cumTotal > 0 ? `${totalAccuracy}%` : "—"} valueColor="#60a5fa" />
        <StatChip label="Best Streak" value={`🔥 ${bestStreak}`} valueColor="#fb923c" />
      </div>

      {/* ZOOM CONTROLS */}
      <div style={{ position: "absolute", right: "24px", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "4px" }}>
        {[
          { label: "+", action: () => setZoom(z => Math.min(z * 1.5, 20)) },
          { label: "⊙", action: () => { setZoom(1); setMapCenter([0, 15]); } },
          { label: "−", action: () => setZoom(z => Math.max(z / 1.5, 0.8)) },
        ].map(({ label, action }) => (
          <button
            key={label}
            onClick={action}
            style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", color: "rgba(255,255,255,0.75)", fontSize: label === "⊙" ? "1rem" : "1.2rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
          >
            {label}
          </button>
        ))}
      </div>

      {/* BOTTOM BAR — country info + play button, centered */}
      <div style={{ position: "absolute", bottom: "30px", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "stretch", gap: "16px", width: "max-content", maxWidth: "calc(100vw - 120px)" }}>
        {selected && (
          <div style={{ background: "rgba(10,25,60,0.88)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "16px", padding: "20px 22px", width: "360px", backdropFilter: "blur(12px)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "14px" }}>
              <div style={{ width: "52px", height: "52px", flexShrink: 0, border: `2px solid ${selectedCompleted ? "rgba(34,197,94,0.4)" : "rgba(245,158,11,0.35)"}`, borderRadius: "12px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.05)" }}>
                {selectedCompleted
                  ? <img src={`https://flagcdn.com/${selected.code.toLowerCase()}.svg`} alt={selected.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ color: "#f59e0b", fontSize: "1rem", fontWeight: 900 }}>{selected.code}</span>
                }
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ color: "white", fontWeight: 800, fontSize: "1.15rem" }}>{selected.name}</span>
                  {selectedCompleted && <span style={{ background: "rgba(34,197,94,0.15)", color: "#4ade80", padding: "2px 8px", borderRadius: "20px", fontSize: "0.7rem" }}>✓ Complete</span>}
                  {selectedLocked && <span style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", padding: "2px 8px", borderRadius: "20px", fontSize: "0.7rem" }}>🔒 Locked</span>}
                </div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", marginTop: "4px", lineHeight: 1.4 }}>
                  {selected.capital} • {selected.region} — <em>{selected.description}</em>
                </div>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", color: "rgba(255,255,255,0.55)", fontSize: "0.8rem" }}>
                <span>🪙 {selectedCoins} / {COINS_PER_COUNTRY}</span>
                {selectedCompleted && <span style={{ color: "#4ade80" }}>Completed!</span>}
              </div>
              <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "10px", height: "6px", overflow: "hidden" }}>
                <div style={{ width: `${(selectedCoins / COINS_PER_COUNTRY) * 100}%`, background: selectedCompleted ? "linear-gradient(90deg, #16a34a, #4ade80)" : "linear-gradient(90deg, #f59e0b, #fbbf24)", borderRadius: "10px", height: "100%", transition: "width 0.4s ease" }} />
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            const target = selectedLocked ? currentCountry : selected;
            if (target) onPlay(target, COUNTRIES.findIndex(c => c.code === target.code));
          }}
          disabled={!currentCountry && !selectedCompleted}
          style={{
            height: "100%",
            aspectRatio: "1 / 1",
            background: selectedLocked
              ? "rgba(255,255,255,0.08)"
              : "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
            border: selectedLocked ? "1px solid rgba(255,255,255,0.15)" : "none",
            borderRadius: "16px",
            color: selectedLocked ? "rgba(255,255,255,0.4)" : "white",
            fontSize: "1.3rem", fontWeight: 900, cursor: selectedLocked ? "default" : "pointer",
            boxShadow: selectedLocked ? "none" : "0 8px 24px rgba(239,68,68,0.35)",
            letterSpacing: "0.06em",
            transition: "transform 0.15s, box-shadow 0.15s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            if (!selectedLocked) {
              e.currentTarget.style.transform = "scale(1.06)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(239,68,68,0.5)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = selectedLocked ? "none" : "0 8px 24px rgba(239,68,68,0.35)";
          }}
        >
          {selectedCompleted ? "REPLAY ▶" : selectedLocked ? "🔒 LOCKED" : "PLAY ▶"}
        </button>
      </div>

      {/* Game complete banner */}
      {currentIdx === -1 && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "rgba(10,25,60,0.95)", border: "2px solid #f59e0b", borderRadius: "20px", padding: "30px 50px", textAlign: "center", backdropFilter: "blur(12px)" }}>
          <div style={{ fontSize: "3rem" }}>🏆</div>
          <h2 style={{ color: "#f59e0b", margin: "10px 0 5px", fontSize: "1.8rem" }}>Journey Complete!</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", margin: 0 }}>You've conquered all 20 Spanish-speaking countries!</p>
        </div>
      )}
    </div>
  );
}

function StatChip({ label, value, valueColor }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "12px", padding: "12px 20px", textAlign: "center", backdropFilter: "blur(8px)", minWidth: "100px" }}>
      <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", marginBottom: "4px" }}>{label}</div>
      <div style={{ color: valueColor, fontWeight: 800, fontSize: "1.2rem" }}>{value}</div>
    </div>
  );
}
