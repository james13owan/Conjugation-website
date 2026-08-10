import React, { useState } from "react";

const BG = "/spain-poster-v3.png";

const TENSES = [
  "Present",
  "Preterite",
  "Imperfect",
  "Future",
  "Subjunctive",
  "Conditional",
];

const GRAIN = encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
  "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/>" +
  "<feColorMatrix type='saturate' values='0'/></filter>" +
  "<rect width='200' height='200' filter='url(%23n)'/></svg>"
);

/* ── Leather nameplate ── */
function Nameplate({ children }) {
  return (
    /* Gold border frame */
    <div style={{
      background: "linear-gradient(145deg, #c8922a, #7a5010, #c8922a, #7a5010)",
      borderRadius: "6px",
      padding: "3px",
      boxShadow: "0 24px 60px rgba(0,0,0,0.75), 0 0 0 1px rgba(40,18,4,0.9)",
    }}>
      {/* Inner leather surface */}
      <div style={{
        position: "relative",
        borderRadius: "4px",
        padding: "clamp(2rem, 4vh, 3rem) clamp(2.5rem, 6vw, 5rem)",
        background:
          "radial-gradient(ellipse at 30% 20%, #5c2c0e 0%, #2e1106 55%, #1e0b04 100%)",
        overflow: "hidden",
        boxShadow: "inset 0 2px 8px rgba(0,0,0,0.6), inset 0 -1px 4px rgba(200,140,40,0.08)",
      }}>
        {/* Leather grain overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,${GRAIN}")`,
          backgroundSize: "180px 180px",
          opacity: 0.18, mixBlendMode: "multiply",
        }} />
        {/* Subtle horizontal stitch lines */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(0,0,0,0.08) 28px, rgba(0,0,0,0.08) 29px)",
        }} />
        {/* Corner rivets */}
        {[
          { top: 10, left: 12 },
          { top: 10, right: 12 },
          { bottom: 10, left: 12 },
          { bottom: 10, right: 12 },
        ].map((pos, i) => (
          <div key={i} style={{
            position: "absolute", ...pos,
            width: 11, height: 11, borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, #e8c060, #8a5a10)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,220,100,0.3)",
          }} />
        ))}
        {/* Content */}
        {children}
      </div>
    </div>
  );
}

export default function LandingPage({ onStart, initialView = "welcome" }) {
  const [view,     setView]     = useState(initialView);
  const [vosotros, setVosotros] = useState(false);
  const [hovered,  setHovered]  = useState(null);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>

      {/* Poster */}
      <img src={BG} alt="" style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        objectFit: "cover", objectPosition: "center 30%",
        zIndex: 0,
      }} />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.08) 45%, rgba(0,0,0,0.60) 100%)",
      }} />

      {/* Film grain */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,${GRAIN}")`,
        backgroundSize: "200px 200px",
        opacity: 0.09, mixBlendMode: "overlay",
      }} />

      {/* ══════════════════════════════════════
          WELCOME VIEW
      ══════════════════════════════════════ */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: view === "welcome" ? 1 : 0,
        pointerEvents: view === "welcome" ? "auto" : "none",
        transition: "opacity 0.65s ease",
      }}>
        <Nameplate>
          <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>

            {/* Thin gold rule above title */}
            <div style={{
              height: "1px", marginBottom: "1.1rem",
              background: "linear-gradient(to right, transparent, rgba(200,155,45,0.7), transparent)",
            }} />

            {/* Title */}
            <h1 style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: "clamp(2.4rem, 6vw, 4.8rem)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(235, 200, 120, 0.97)",
              textShadow: "0 2px 16px rgba(0,0,0,0.6), 0 0 40px rgba(180,120,30,0.25)",
              margin: "0 0 0.7rem",
              lineHeight: 1.1,
            }}>
              Bienvenidos
            </h1>

            {/* Subtitle */}
            <p style={{
              fontFamily: "'EB Garamond', serif",
              fontStyle: "italic",
              fontSize: "clamp(0.95rem, 1.8vw, 1.3rem)",
              color: "rgba(205, 170, 105, 0.82)",
              letterSpacing: "0.05em",
              margin: "0 0 1.8rem",
            }}>
              Speak your way through the Spanish world.
            </p>

            {/* Thin gold rule below subtitle */}
            <div style={{
              height: "1px", marginBottom: "1.8rem",
              background: "linear-gradient(to right, transparent, rgba(200,155,45,0.7), transparent)",
            }} />

            {/* Enter button */}
            <button
              onMouseEnter={() => setHovered("enter")}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setView("tenses")}
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
                fontSize: "clamp(0.85rem, 1.4vw, 1.05rem)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: hovered === "enter"
                  ? "rgba(255, 235, 160, 1)"
                  : "rgba(225, 190, 110, 0.92)",
                background: hovered === "enter"
                  ? "rgba(180, 110, 20, 0.45)"
                  : "rgba(0, 0, 0, 0.25)",
                border: hovered === "enter"
                  ? "1.5px solid rgba(210, 165, 55, 0.80)"
                  : "1.5px solid rgba(180, 135, 40, 0.45)",
                borderRadius: "4px",
                padding: "0.7rem 3.5rem",
                cursor: "pointer",
                transform: hovered === "enter" ? "translateY(-2px)" : "translateY(0)",
                boxShadow: hovered === "enter"
                  ? "0 6px 24px rgba(0,0,0,0.5)"
                  : "0 3px 10px rgba(0,0,0,0.35)",
                transition: "all 0.20s ease",
              }}
            >
              Enter
            </button>
          </div>
        </Nameplate>
      </div>

      {/* ══════════════════════════════════════
          TENSES VIEW
      ══════════════════════════════════════ */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 10,
        opacity: view === "tenses" ? 1 : 0,
        pointerEvents: view === "tenses" ? "auto" : "none",
        transition: "opacity 0.65s ease",
      }}>

        {/* ── Grid + Vosotros together ── */}
        <div style={{
          position: "absolute",
          top: "12%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(92vw, 990px)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(0.7rem, 1.2vw, 1rem)",
        }}>
          {/* ── Banner ── */}
          <div style={{
            textAlign: "center",
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(1.3rem, 2.4vw, 1.9rem)",
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "rgba(240, 220, 165, 0.93)",
            textShadow: "0 2px 16px rgba(0,0,0,0.75)",
            marginBottom: "0.4rem",
          }}>
            How many countries will you visit today?
          </div>

          {/* 3×2 tense grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(0.9rem, 1.8vw, 1.5rem)",
          }}>
            {TENSES.map(name => {
              const on = hovered === name;
              return (
                <button
                  key={name}
                  onMouseEnter={() => setHovered(name)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onStart(name, vosotros)}
                  style={{
                    padding: "clamp(1.1rem, 2.2vh, 1.65rem) 0.75rem",
                    background: on ? "rgba(100,42,8,0.78)" : "rgba(10,5,2,0.62)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: on
                      ? "1.5px solid rgba(210,160,60,0.70)"
                      : "1.5px solid rgba(185,145,55,0.32)",
                    borderRadius: "8px",
                    color: on ? "rgba(255,235,185,1)" : "rgba(232,215,175,0.90)",
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "clamp(1.5rem, 2.4vw, 1.8rem)",
                    fontWeight: 600,
                    letterSpacing: "0.045em",
                    textAlign: "center",
                    cursor: "pointer",
                    transform: on ? "translateY(-3px)" : "translateY(0)",
                    boxShadow: on
                      ? "0 8px 28px rgba(0,0,0,0.55)"
                      : "0 3px 12px rgba(0,0,0,0.40)",
                    transition: "all 0.20s ease",
                  }}
                >
                  {name}
                </button>
              );
            })}
          </div>

          {/* ── Vosotros toggle — sits flush below the grid, right-aligned ── */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div
              onClick={() => setVosotros(v => !v)}
              style={{
                cursor: "pointer",
                userSelect: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                background: vosotros
                  ? "rgba(90, 55, 5, 0.88)"
                  : "rgba(8, 4, 1, 0.78)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: vosotros
                  ? "1.5px solid rgba(210,165,55,0.80)"
                  : "1.5px solid rgba(185,145,55,0.40)",
                borderRadius: "8px",
                padding: "0.6rem 1.1rem",
                transition: "all 0.28s ease",
                boxShadow: vosotros
                  ? "0 4px 20px rgba(180,130,25,0.30)"
                  : "0 2px 10px rgba(0,0,0,0.35)",
              }}
            >
              <span style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: vosotros
                  ? "rgba(255, 248, 220, 1)"
                  : "rgba(220, 195, 150, 0.92)",
                transition: "color 0.28s",
              }}>
                Vosotros
              </span>

              {/* Toggle pill */}
              <div style={{
                width: "44px", height: "24px",
                borderRadius: "12px",
                background: vosotros
                  ? "rgba(200,155,40,0.85)"
                  : "rgba(255,255,255,0.14)",
                position: "relative",
                flexShrink: 0,
                transition: "background 0.28s",
                border: "1px solid rgba(255,255,255,0.10)",
              }}>
                <div style={{
                  position: "absolute",
                  top: "3px",
                  left: vosotros ? "22px" : "3px",
                  width: "18px", height: "18px",
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 0.25s ease",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.45)",
                }} />
              </div>

              <span style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: vosotros
                  ? "rgba(255, 248, 220, 0.95)"
                  : "rgba(210, 180, 130, 0.88)",
                transition: "color 0.28s",
                minWidth: "1.8rem",
              }}>
                {vosotros ? "ON" : "OFF"}
              </span>
            </div>
          </div>
        </div>

        {/* ── All Tenses — big, emphatic ── */}
        <button
          onMouseEnter={() => setHovered("all")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onStart("All Tenses", vosotros)}
          style={{
            position: "absolute",
            bottom: "2.5%", left: "4%", right: "4%",
            zIndex: 5,
            background: hovered === "all"
              ? "linear-gradient(135deg, #d95522 0%, #b02a0a 100%)"
              : "linear-gradient(135deg, #c24018 0%, #9a2208 100%)",
            border: "none",
            /* Gold top highlight line */
            borderTop: "2px solid rgba(230,180,70,0.45)",
            borderBottom: "2px solid rgba(0,0,0,0.35)",
            borderRadius: "8px",
            padding: "clamp(1.1rem, 2.2vh, 1.5rem) 1.5rem",
            cursor: "pointer",
            transform: hovered === "all" ? "translateY(-3px)" : "translateY(0)",
            boxShadow: hovered === "all"
              ? "0 14px 40px rgba(0,0,0,0.65), 0 0 0 1px rgba(220,140,40,0.20)"
              : "0 7px 28px rgba(0,0,0,0.55), 0 0 0 1px rgba(180,100,20,0.20)",
            transition: "all 0.22s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.2rem",
          }}
        >
          {/* Left decorative line */}
          <span style={{
            flex: 1, height: "1.5px",
            background: "linear-gradient(to left, rgba(240,195,80,0.65), transparent)",
          }} />

          <span style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            fontSize: "clamp(1.1rem, 2vw, 1.45rem)",
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "rgba(255, 238, 195, 0.98)",
            textShadow: "0 1px 10px rgba(0,0,0,0.5)",
            whiteSpace: "nowrap",
          }}>
            ✦ &ensp; All Tenses &ensp; ✦
          </span>

          {/* Right decorative line */}
          <span style={{
            flex: 1, height: "1.5px",
            background: "linear-gradient(to right, rgba(240,195,80,0.65), transparent)",
          }} />
        </button>

      </div>
    </div>
  );
}
