import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import VERB_LIBRARY from "./verbs.json";
import { COINS_PER_CORRECT, COINS_PER_COUNTRY, getCountryCoins, saveCountryCoins, COUNTRIES, isFlightRoute, isBoatRoute, tenseKey } from "./countries.js";

const SUBJECTS = { yo: "I", tú: "you (informal)", él: "he/she", nosotros: "we", vosotros: "you all", ellos: "they" };
const TIMER_BY_DIFFICULTY = { beginner: 10, intermediate: 5, advanced: 2 };
const RADIUS = 173;
const STROKE = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const LISTEN_DELAY = 600;

const STARS = Array.from({ length: 45 }, (_, i) => ({
  id: i, left: (i * 97 + 13) % 100, top: (i * 67 + 31) % 100,
  size: (i % 3) + 1.5, opacity: 0.06 + (i % 5) * 0.06,
  color: ["#4ade80", "#60a5fa", "#a78bfa", "#fbbf24"][i % 4],
}));

function isCloseMatch(input, target, threshold = 0.75) {
  input = input.toLowerCase().trim();
  target = target.toLowerCase().trim();
  if (input === target) return true;
  if (Math.abs(input.length - target.length) > 3) return false;
  const endLen = Math.min(4, target.length);
  if (1 - levenshteinDistance(input.slice(-endLen), target.slice(-endLen)) / endLen < 0.75) return false;
  return 1 - levenshteinDistance(input, target) / Math.max(input.length, target.length) >= threshold;
}

function levenshteinDistance(a, b) {
  const m = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let i = 0; i <= a.length; i++) m[0][i] = i;
  for (let i = 1; i <= b.length; i++)
    for (let j = 1; j <= a.length; j++)
      m[i][j] = b[i-1] === a[j-1] ? m[i-1][j-1] : 1 + Math.min(m[i-1][j-1], m[i][j-1], m[i-1][j]);
  return m[b.length][a.length];
}

export default function VoicePractice({ selectedTense, includeVosotros, difficulty, country, onBack, onHome, onCountryComplete }) {
  const MAX_TIMER = TIMER_BY_DIFFICULTY[difficulty] ?? 8;
  const tk = tenseKey(selectedTense);
  const [currentVerb, setCurrentVerb] = useState({});
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [timerProgress, setTimerProgress] = useState(1); // 1 = full, 0 = empty
  const [isPaused, setIsPaused] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [countryCoins, setCountryCoins] = useState(() => getCountryCoins(country?.code || "", selectedTense));
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem(`conj_${tk}_current_streak`) || "0", 10));

  const rafRef = useRef(null);
  const timeLeftRef = useRef(MAX_TIMER);
  const lastTsRef = useRef(null);
  const processingRef = useRef(false);
  const handleWrongRef = useRef(null);

  const { transcript, resetTranscript } = useSpeechRecognition();

  const progressPct = Math.min((countryCoins / COINS_PER_COUNTRY) * 100, 100);
  const planePct = Math.max(progressPct, 2);
  const currentCountryIdx = COUNTRIES.findIndex(c => c.code === country?.code);
  const nextCountry = COUNTRIES[currentCountryIdx + 1];
  const isFlightNext = nextCountry ? isFlightRoute(country?.code, nextCountry.code) : false;
  const isBoatNext = nextCountry ? isBoatRoute(country?.code, nextCountry.code) : false;
  const transportIcon = isBoatNext ? "⛴️" : isFlightNext ? "✈️" : "🚌";
  const timerDashOffset = CIRCUMFERENCE * (1 - timerProgress);
  const timerColor = timerProgress > 0.625 ? "#22c55e" : timerProgress > 0.25 ? "#eab308" : "#ef4444";

  const [timerKey, setTimerKey] = useState(0);
  const [streakAnimKey, setStreakAnimKey] = useState(0);

  useEffect(() => {
    if (country?.name) localStorage.setItem(`conj_${tk}_last_country_name`, country.name);
    selectNextVerb();
    return () => { SpeechRecognition.stopListening(); cancelAnimationFrame(rafRef.current); };
  }, []);

  // Smooth RAF countdown — restarts whenever timerKey changes or pause toggles
  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    if (isPaused || showComplete) { lastTsRef.current = null; return; }

    const tick = (ts) => {
      if (lastTsRef.current !== null) {
        timeLeftRef.current = Math.max(timeLeftRef.current - (ts - lastTsRef.current) / 1000, 0);
      }
      lastTsRef.current = ts;
      setTimerProgress(timeLeftRef.current / MAX_TIMER);

      if (timeLeftRef.current > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else if (!processingRef.current) {
        handleWrongRef.current?.();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [timerKey, isPaused, showComplete]);

  useEffect(() => {
    if (!transcript || isPaused || !voiceActive || showComplete) return;
    const t = setTimeout(() => { if (transcript.trim()) checkAnswer(transcript); }, LISTEN_DELAY);
    return () => clearTimeout(t);
  }, [transcript, isPaused, voiceActive, showComplete]);

  const selectNextVerb = () => {
    const verbList = Object.keys(VERB_LIBRARY);
    const verb = verbList[Math.floor(Math.random() * verbList.length)];
    const data = VERB_LIBRARY[verb];
    const tenseMap = { Present: "present", Preterite: "preterite", Imperfect: "imperfect", Future: "future", Conditional: "conditional", Subjunctive: "subjunctive" };
    const allTenses = ["present","preterite","imperfect","future","conditional","subjunctive"];
    const tenseKey = selectedTense === "All Tenses" ? allTenses[Math.floor(Math.random() * allTenses.length)] : (tenseMap[selectedTense] || "present");
    const tenseNames = { present:"Present", preterite:"Preterite", imperfect:"Imperfect", future:"Future", conditional:"Conditional", subjunctive:"Subjunctive" };
    const subjects = includeVosotros ? Object.keys(SUBJECTS) : Object.keys(SUBJECTS).filter((s) => s !== "vosotros");
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    setCurrentVerb({ infinitive: verb, english: data.english, tense: tenseKey, tenseName: tenseNames[tenseKey], subject, subjectEnglish: SUBJECTS[subject], correctAnswer: data[tenseKey][subject] });
    timeLeftRef.current = MAX_TIMER;
    lastTsRef.current = null;
    setTimerProgress(1);
    setTimerKey((k) => k + 1);
    resetTranscript(); setFeedback(""); setFeedbackType("");
    processingRef.current = false;
  };

  const checkAnswer = (answer) => {
    if (processingRef.current) return;
    if (isCloseMatch(answer, currentVerb.correctAnswer)) handleCorrect();
    else if (answer.trim().length > 1) handleWrong(answer);
  };

  const handleCorrect = () => {
    if (processingRef.current) return;
    processingRef.current = true;
    cancelAnimationFrame(rafRef.current);
    setFeedback("✅ Correct!"); setFeedbackType("correct");

    const newCoins = Math.min(countryCoins + COINS_PER_CORRECT, COINS_PER_COUNTRY);
    setCountryCoins(newCoins);
    saveCountryCoins(country?.code || "", newCoins, selectedTense);

    const nc = sessionCorrect + 1, nt = sessionTotal + 1, ns = streak + 1;
    setSessionCorrect(nc); setSessionTotal(nt); setStreak(ns);
    if (ns >= 3) setStreakAnimKey(k => k + 1);
    const acc = Math.round((nc / nt) * 100);
    localStorage.setItem(`conj_${tk}_accuracy`, acc.toString());
    localStorage.setItem(`conj_${tk}_current_streak`, String(ns));
    const cumC = parseInt(localStorage.getItem(`conj_${tk}_cumulative_correct`) || "0", 10) + 1;
    const cumT = parseInt(localStorage.getItem(`conj_${tk}_cumulative_total`) || "0", 10) + 1;
    localStorage.setItem(`conj_${tk}_cumulative_correct`, String(cumC));
    localStorage.setItem(`conj_${tk}_cumulative_total`, String(cumT));
    const best = parseInt(localStorage.getItem(`conj_${tk}_streak`) || "0", 10);
    if (ns > best) localStorage.setItem(`conj_${tk}_streak`, ns.toString());

    if (newCoins >= COINS_PER_COUNTRY) {
      setTimeout(() => { setShowComplete(true); setTimeout(onCountryComplete, 2200); }, 400);
    } else {
      setTimeout(selectNextVerb, 800);
    }
  };

  const handleWrong = (userAnswer = transcript) => {
    if (processingRef.current) return;
    processingRef.current = true;
    cancelAnimationFrame(rafRef.current);
    setFeedback(`❌ "${currentVerb.correctAnswer}"`); setFeedbackType("wrong"); setStreak(0); localStorage.setItem(`conj_${tk}_current_streak`, "0");
    const missed = JSON.parse(localStorage.getItem(`conj_${tk}_missed_verbs`) || "[]");
    missed.push({ infinitive: currentVerb.infinitive, english: currentVerb.english, subject: currentVerb.subject, tenseName: currentVerb.tenseName, correctAnswer: currentVerb.correctAnswer, userAnswer: userAnswer.trim() || "—", difficulty: difficulty || "intermediate" });
    localStorage.setItem(`conj_${tk}_missed_verbs`, JSON.stringify(missed));

    const newCoins = Math.max(countryCoins - COINS_PER_CORRECT, 0);
    setCountryCoins(newCoins);
    saveCountryCoins(country?.code || "", newCoins, selectedTense);

    const nt = sessionTotal + 1;
    setSessionTotal(nt);
    if (sessionCorrect > 0) localStorage.setItem(`conj_${tk}_accuracy`, Math.round((sessionCorrect / nt) * 100).toString());
    const cumT = parseInt(localStorage.getItem(`conj_${tk}_cumulative_total`) || "0", 10) + 1;
    localStorage.setItem(`conj_${tk}_cumulative_total`, String(cumT));
    setTimeout(selectNextVerb, 1300);
  };

  // Keep ref current so the RAF loop always calls the latest version
  handleWrongRef.current = handleWrong;

  const toggleVoice = () => {
    if (voiceActive) { SpeechRecognition.stopListening(); setVoiceActive(false); }
    else { SpeechRecognition.startListening({ continuous: true, language: "es-ES" }); setVoiceActive(true); resetTranscript(); }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "radial-gradient(ellipse at 50% 20%, #1a2a4a 0%, #0d1a30 45%, #060d1a 100%)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", fontFamily: "'Segoe UI', Tahoma, sans-serif", color: "white" }}>
      <style>{`
        @keyframes streakPop {
          0%   { transform: translateY(-50%) scale(0.4); opacity: 0; }
          60%  { transform: translateY(-50%) scale(1.15); opacity: 1; }
          80%  { transform: translateY(-50%) scale(0.95); }
          100% { transform: translateY(-50%) scale(1); opacity: 1; }
        }
        @keyframes streakGlow {
          0%, 100% { box-shadow: var(--streak-glow-a); }
          50%       { box-shadow: var(--streak-glow-b); }
        }
      `}</style>

      {/* Stars */}
      {STARS.map((s) => (
        <div key={s.id} style={{ position: "absolute", left: `${s.left}%`, top: `${s.top}%`, width: `${s.size}px`, height: `${s.size}px`, borderRadius: "50%", background: s.color, opacity: s.opacity, pointerEvents: "none" }} />
      ))}

      {/* TOP PROGRESS BAR */}
      <div style={{ width: "100%", height: "65px", background: "rgba(255,255,255,0.05)", flexShrink: 0, position: "relative" }}>
        <div style={{ width: `${planePct}%`, height: "100%", background: "linear-gradient(90deg, #16a34a, #22c55e, #86efac, #fbbf24)", position: "relative", transition: "width 0.5s ease", borderRadius: "0 6px 6px 0" }}>
          <span style={{ position: "absolute", right: "-16px", top: "16px", fontSize: "30px", lineHeight: 1 }}>{transportIcon}</span>
        </div>
      </div>

      {/* TOP NAV */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 30px", flexShrink: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", padding: "9px 21px", borderRadius: "21px", cursor: "pointer", fontSize: "1.23rem" }}>← Map</button>
          {country && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ background: "rgba(255,255,255,0.12)", color: "white", padding: "5px 14px", borderRadius: "8px", fontSize: "1.17rem", fontWeight: 700 }}>{country.code}</span>
              <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600, fontSize: "1.38rem" }}>{country.name}</span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", padding: "9px 24px", borderRadius: "21px", fontSize: "1.32rem", fontWeight: 700 }}>
            🪙 <span style={{ color: "#fbbf24" }}>{countryCoins}</span><span style={{ color: "rgba(255,255,255,0.4)" }}> / {COINS_PER_COUNTRY}</span>
          </div>
          <button onClick={() => setIsPaused((p) => !p)} style={{ width: "54px", height: "54px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.35rem" }}>
            {isPaused ? "▶" : "⏸"}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "18px", position: "relative", zIndex: 1, paddingBottom: "10vh" }}>

        {/* Tense badge */}
        <div style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.35)", color: "#4ade80", padding: "10px 36px", borderRadius: "30px", fontSize: "1.55rem", fontWeight: 700, letterSpacing: "0.12em" }}>
          {currentVerb.tenseName?.toUpperCase() || "—"}
        </div>

        {/* Circular timer card — feedback/transcript anchored below it so they never shift the circle */}
        <div style={{ position: "relative", width: "405px", height: "405px" }}>
          <svg width="405" height="405" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
            <circle cx="203" cy="203" r={RADIUS} fill="none" stroke="#374151" strokeWidth={STROKE} />
            <circle
              cx="203" cy="203" r={RADIUS}
              fill="none"
              stroke={timerColor}
              strokeWidth={STROKE}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={timerDashOffset}
              strokeLinecap="round"
              style={{ transition: "stroke 0.3s" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: "48px", background: "white", borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "18px" }}>
            <div style={{ fontSize: "1.45rem", marginBottom: "6px" }}>
              <span style={{ color: "#6b7280", fontWeight: 800, textTransform: "capitalize" }}>{currentVerb.subject}</span>
              <span style={{ color: "#a1a1aa", fontWeight: 400 }}> ({currentVerb.subjectEnglish})</span>
            </div>
            <div style={{
              color: "#0f172a",
              fontSize: currentVerb.infinitive?.length > 9 ? "2.1rem" : currentVerb.infinitive?.length > 7 ? "2.4rem" : "2.8rem",
              fontWeight: 900,
              lineHeight: 1.1,
              wordBreak: "break-word",
            }}>
              {currentVerb.infinitive}
            </div>
            <div style={{ color: "#94a3b8", fontSize: "1.08rem", fontStyle: "italic", marginTop: "6px" }}>
              {currentVerb.english}
            </div>
          </div>

          {/* Feedback — absolutely positioned below the circle, never shifts layout */}
          <div style={{ position: "absolute", top: "calc(100% + 14px)", left: "50%", transform: "translateX(-50%)", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap" }}>
            {feedback && <span style={{ color: feedbackType === "correct" ? "#4ade80" : "#f87171", fontWeight: 700, fontSize: "2.4rem" }}>{feedback}</span>}
          </div>

          {/* You said — absolutely positioned below feedback */}
          <div style={{ position: "absolute", top: "calc(100% + 72px)", left: "50%", transform: "translateX(-50%)", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap" }}>
            {voiceActive && transcript && <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "1.28rem" }}>You said: <em>{transcript}</em></span>}
          </div>
        </div>
      </div>

      {/* BOTTOM MIC */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", padding: "16px 20px 40px", flexShrink: 0, zIndex: 10, marginBottom: "10vh" }}>
        <button
          onClick={toggleVoice}
          disabled={showComplete}
          style={{
            width: "120px", height: "120px", borderRadius: "50%",
            background: voiceActive
              ? "radial-gradient(circle, rgba(239,68,68,0.35) 0%, rgba(239,68,68,0.15) 100%)"
              : "radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(59,130,246,0.2) 100%)",
            border: `3px solid ${voiceActive ? "rgba(239,68,68,0.7)" : "rgba(99,102,241,0.6)"}`,
            boxShadow: voiceActive
              ? "0 0 40px rgba(239,68,68,0.4), 0 0 80px rgba(239,68,68,0.15)"
              : "0 0 30px rgba(99,102,241,0.3)",
            cursor: showComplete ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "3rem",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => { if (!showComplete && !voiceActive) e.currentTarget.style.boxShadow = "0 0 50px rgba(99,102,241,0.5)"; }}
          onMouseLeave={(e) => { if (!voiceActive) e.currentTarget.style.boxShadow = "0 0 30px rgba(99,102,241,0.3)"; }}
        >
          🎙️
        </button>
        <p style={{ color: voiceActive ? "rgba(239,68,68,0.8)" : "rgba(255,255,255,0.3)", fontSize: "0.85rem", margin: 0, fontWeight: voiceActive ? 600 : 400, transition: "color 0.2s" }}>
          {voiceActive ? "Listening…" : "Tap to speak"}
        </p>
      </div>

      {/* STREAK BADGE */}
      {(() => {
        if (streak < 3) return null;
        const sc = streak >= 10
          ? { emoji: "👑", label: "¡LEYENDA!", sub: "¡Eres un maestro!", color: "#fbbf24", glowA: "0 0 24px rgba(251,191,36,0.6), 0 0 60px rgba(251,191,36,0.3)", glowB: "0 0 40px rgba(251,191,36,0.9), 0 0 90px rgba(251,191,36,0.5)", border: "rgba(251,191,36,0.7)", bg: "rgba(20,15,0,0.85)" }
          : streak >= 7
          ? { emoji: "⚡", label: "¡IMPARABLE!", sub: "¡No te detengas!", color: "#a78bfa", glowA: "0 0 24px rgba(167,139,250,0.6), 0 0 60px rgba(167,139,250,0.25)", glowB: "0 0 40px rgba(167,139,250,0.9), 0 0 90px rgba(167,139,250,0.45)", border: "rgba(167,139,250,0.65)", bg: "rgba(10,5,20,0.85)" }
          : streak >= 5
          ? { emoji: "🔥🔥", label: "¡INCREÍBLE!", sub: "¡Estás volando!", color: "#ef4444", glowA: "0 0 24px rgba(239,68,68,0.55), 0 0 55px rgba(239,68,68,0.25)", glowB: "0 0 40px rgba(239,68,68,0.85), 0 0 85px rgba(239,68,68,0.4)", border: "rgba(239,68,68,0.6)", bg: "rgba(20,5,5,0.85)" }
          : { emoji: "🔥", label: "¡EN FUEGO!", sub: "¡Sigue así!", color: "#f97316", glowA: "0 0 20px rgba(249,115,22,0.5), 0 0 50px rgba(249,115,22,0.2)", glowB: "0 0 35px rgba(249,115,22,0.8), 0 0 75px rgba(249,115,22,0.35)", border: "rgba(249,115,22,0.55)", bg: "rgba(20,8,0,0.85)" };
        return (
          <div
            key={streakAnimKey}
            style={{
              position: "absolute",
              top: "50%",
              right: "28px",
              transform: "translateY(-50%)",
              background: sc.bg,
              border: `2px solid ${sc.border}`,
              borderRadius: "18px",
              padding: "18px 22px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              zIndex: 50,
              animation: "streakPop 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards, streakGlow 2s ease-in-out infinite",
              "--streak-glow-a": sc.glowA,
              "--streak-glow-b": sc.glowB,
              minWidth: "110px",
            }}
          >
            <div style={{ fontSize: "2.6rem", lineHeight: 1 }}>{sc.emoji}</div>
            <div style={{ color: sc.color, fontWeight: 900, fontSize: "0.85rem", letterSpacing: "0.12em", marginTop: "4px" }}>{sc.label}</div>
            <div style={{ color: "white", fontWeight: 900, fontSize: "3rem", lineHeight: 1 }}>{streak}</div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem", textAlign: "center" }}>{sc.sub}</div>
          </div>
        );
      })()}

      {/* PAUSE OVERLAY */}
      {isPaused && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.82)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 200, gap: "16px" }}>
          <h1 style={{ color: "white", fontSize: "3.5rem", margin: 0, fontWeight: 900 }}>PAUSED</h1>
          <button onClick={() => setIsPaused(false)} style={{ padding: "1rem 3rem", background: "rgba(34,197,94,0.9)", border: "2px solid white", borderRadius: "20px", color: "white", fontSize: "1.3rem", fontWeight: 700, cursor: "pointer" }}>▶ RESUME</button>
          <button onClick={onBack} style={{ padding: "0.75rem 2rem", background: "rgba(59,130,246,0.9)", border: "2px solid white", borderRadius: "20px", color: "white", fontSize: "1rem", fontWeight: 700, cursor: "pointer" }}>← Back to Map</button>
        </div>
      )}

      {/* COUNTRY COMPLETE OVERLAY */}
      {showComplete && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 300, gap: "20px" }}>
          <div style={{ fontSize: "5rem", animation: "pulse 0.6s ease-in-out infinite alternate" }}>🎉</div>
          <h1 style={{ color: "#4ade80", fontSize: "3rem", margin: 0, fontWeight: 900 }}>
            {country?.name} Complete!
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.2rem", margin: 0 }}>
            300 / 300 coins earned {transportIcon}
          </p>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.9rem", margin: 0 }}>
            {isBoatNext ? "Boarding the ferry to Montevideo..." : isFlightNext ? "Boarding your flight to next destination..." : "Boarding the bus to next destination..."}
          </p>
        </div>
      )}
    </div>
  );
}
