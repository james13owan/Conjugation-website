import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import VERB_LIBRARY from "./verbs.json";
import "./VoicePractice.css";

const SUBJECTS = {
  yo: "I",
  tú: "you (informal)",
  él: "he/she",
  nosotros: "we",
  vosotros: "you all (Spain)",
  ellos: "they",
};

const MAX_COINS = 1000;
const COINS_PER_CORRECT = 50;
const LISTEN_DELAY = 500;

function isCloseMatch(input, target, threshold = 0.75) {
  input = input.toLowerCase().trim();
  target = target.toLowerCase().trim();

  if (input === target) return true;

  // Reject if lengths are too different
  const lengthDiff = Math.abs(input.length - target.length);
  if (lengthDiff > 3) return false;

  // FOCUS ON ENDING - Last 3-4 letters must match closely
  const endLength = Math.min(4, target.length);
  const targetEnd = target.slice(-endLength);
  const inputEnd = input.slice(-endLength);
  
  // Ending must be at least 75% similar
  const endDistance = levenshteinDistance(inputEnd, targetEnd);
  const endSimilarity = 1 - (endDistance / endLength);
  
  if (endSimilarity < 0.75) return false;

  // Check full word similarity
  const distance = levenshteinDistance(input, target);
  const maxLen = Math.max(input.length, target.length);
  const similarity = 1 - distance / maxLen;
  
  return similarity >= threshold;
}

function levenshteinDistance(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) matrix[i][j] = matrix[i - 1][j - 1];
      else
        matrix[i][j] =
          1 + Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]);
    }
  }
  return matrix[b.length][a.length];
}

export default function VoicePractice({ selectedTense, includeVosotros, onBack, onHome }) {
  const [feedback, setFeedback] = useState("");
  const [currentVerb, setCurrentVerb] = useState({});
  const [coins, setCoins] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [flashColor, setFlashColor] = useState("");
  const [timer, setTimer] = useState(10);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) return;
    selectNextVerb();
    SpeechRecognition.startListening({ continuous: true, language: "es-ES" });
    return () => SpeechRecognition.stopListening();
  }, []);

  useEffect(() => {
    if (isPaused) {
      clearInterval(timerRef.current);
      return;
    }
    
    if (timer <= 0) handleWrong();
    timerRef.current = setInterval(() => {
      setTimer((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timer, isPaused]);

  useEffect(() => {
    if (!transcript || isPaused) return;
    const timeout = setTimeout(() => checkAnswer(transcript), LISTEN_DELAY);
    return () => clearTimeout(timeout);
  }, [transcript, isPaused]);

  const selectNextVerb = () => {
    const verbList = Object.keys(VERB_LIBRARY);
    const randomVerb = verbList[Math.floor(Math.random() * verbList.length)];
    const verbData = VERB_LIBRARY[randomVerb];
    
    const tenseMap = {
      'Present': 'present',
      'Preterite': 'preterite',
      'Imperfect': 'imperfect',
      'Future': 'future',
      'Conditional': 'conditional',
      'Subjunctive': 'subjunctive',
    };

    const allTenseKeys = ['present', 'preterite', 'imperfect', 'future', 'conditional', 'subjunctive'];
    const tenseToUse = selectedTense === 'All Tenses'
      ? allTenseKeys[Math.floor(Math.random() * allTenseKeys.length)]
      : (tenseMap[selectedTense] || 'present');
    
    const subjectKeys = includeVosotros 
      ? Object.keys(SUBJECTS)
      : Object.keys(SUBJECTS).filter(s => s !== 'vosotros');
    
    const randomSubject = subjectKeys[Math.floor(Math.random() * subjectKeys.length)];
    const conjugated = verbData[tenseToUse][randomSubject];
    
    const tenseNames = {
      present: "Present",
      preterite: "Preterite (Past)",
      imperfect: "Imperfect (Past)",
      future: "Future",
      conditional: "Conditional",
      subjunctive: "Subjunctive",
    };
    
    setCurrentVerb({
      infinitive: randomVerb,
      english: verbData.english,
      tense: tenseToUse,
      tenseName: tenseNames[tenseToUse],
      subject: randomSubject,
      subjectEnglish: SUBJECTS[randomSubject],
      correctAnswer: conjugated,
      prompt: `${randomSubject} + ${randomVerb} (${tenseNames[tenseToUse]})`
    });
    
    resetTranscript();
    setTimer(10);
  };

  const checkAnswer = (answer) => {
    if (isCloseMatch(answer, currentVerb.correctAnswer)) {
      handleCorrect();
    } else if (answer.length > 1) {
      handleWrong();
    }
  };

  const handleCorrect = () => {
    setFeedback("✅ Correct!");
    setFlashColor("green");
    const newCoins = Math.min(coins + COINS_PER_CORRECT, MAX_COINS);
    setCoins(newCoins);
    setProgressPercent((newCoins / MAX_COINS) * 100);
    setTimeout(() => setFlashColor(""), 300);
    selectNextVerb();
  };

  const handleWrong = () => {
    setFeedback(`❌ Wrong! The answer was: "${currentVerb.correctAnswer}"`);
    setFlashColor("red");
    const newCoins = Math.max(coins - COINS_PER_CORRECT, 0);
    setCoins(newCoins);
    setProgressPercent((newCoins / MAX_COINS) * 100);
    setTimeout(() => setFlashColor(""), 300);
    selectNextVerb();
  };

  const handleBackClick = () => {
    SpeechRecognition.stopListening();
    clearInterval(timerRef.current);
    onBack();
  };

  const handlePause = () => {
    setIsPaused(true);
    SpeechRecognition.stopListening();
    clearInterval(timerRef.current);
  };

  const handleUnpause = () => {
    setIsPaused(false);
    SpeechRecognition.startListening({ continuous: true, language: "es-ES" });
  };

  const barHeight = `${progressPercent}%`;

  return (
    <div
      className="voice-practice-container"
      style={{
        backgroundImage: "url('/world-map2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        transition: "background-color 0.3s",
        backgroundColor: flashColor,
        position: "relative",
      }}
    >
      {isPaused && (
        <div
  style={{
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  }}
>
  <h1
    style={{
      color: "white",
      fontSize: "4rem",
      marginBottom: "2rem",
      textShadow: "0 4px 8px rgba(0,0,0,0.5)",
    }}
  >
    PAUSED
  </h1>
  
  <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
    <button
      onClick={handleUnpause}
      style={{
        padding: "1.5rem 3rem",
        fontSize: "1.5rem",
        fontWeight: "bold",
        borderRadius: "20px",
        border: "3px solid white",
        cursor: "pointer",
        background: "rgba(34, 197, 94, 0.9)",
        color: "white",
        boxShadow: "0 8px 16px rgba(0,0,0,0.4)",
        transition: "transform 0.2s, background 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "scale(1.05)";
        e.target.style.background = "rgba(22, 163, 74, 1)";
        e.target.style.boxShadow = "0 12px 24px rgba(0,0,0,0.6)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "scale(1.0)";
        e.target.style.background = "rgba(34, 197, 94, 0.9)";
        e.target.style.boxShadow = "0 8px 16px rgba(0,0,0,0.4)";
      }}
    >
      ▶ RESUME
    </button>

    <button
      onClick={handleBackClick}
      style={{
        padding: "1rem 2rem",
        fontSize: "1.2rem",
        fontWeight: "bold",
        borderRadius: "20px",
        border: "3px solid white",
        cursor: "pointer",
        background: "rgba(59, 130, 246, 0.9)",
        color: "white",
        boxShadow: "0 8px 16px rgba(0,0,0,0.4)",
        transition: "transform 0.2s, background 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "scale(1.05)";
        e.target.style.background = "rgba(37, 99, 235, 1)";
        e.target.style.boxShadow = "0 12px 24px rgba(0,0,0,0.6)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "scale(1.0)";
        e.target.style.background = "rgba(59, 130, 246, 0.9)";
        e.target.style.boxShadow = "0 8px 16px rgba(0,0,0,0.4)";
      }}
    >
      ← Back to Difficulty
    </button>
  </div>

  <p
    style={{
      color: "rgba(255, 255, 255, 0.7)",
      fontSize: "1.2rem",
      marginTop: "2rem",
      textAlign: "center",
    }}
  >
    Your progress has been saved
  </p>
</div>
      )}

      <button
        onClick={handleBackClick}
        style={{
          position: "absolute",
          bottom: "30px",
          left: "30px",
          padding: "0.75rem 1.25rem",
          borderRadius: "25px",
          border: "2px solid white",
          cursor: "pointer",
          background: "rgba(59, 130, 246, 0.9)",
          color: "white",
          fontSize: "1rem",
          fontWeight: "bold",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          transition: "transform 0.2s, background 0.2s, box-shadow 0.2s",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateX(-5px)";
          e.target.style.background = "rgba(37, 99, 235, 0.95)";
          e.target.style.boxShadow = "0 6px 16px rgba(0,0,0,0.5)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateX(0)";
          e.target.style.background = "rgba(59, 130, 246, 0.9)";
          e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
        }}
      >
        <span style={{ fontSize: "1.2rem" }}>←</span>
        <span>Back</span>
      </button>

      <button
        onClick={() => {
          SpeechRecognition.stopListening();
          clearInterval(timerRef.current);
          onHome();
        }}
        style={{
          position: "absolute",
          top: "30px",
          right: "30px",
          padding: "0.6rem 1.2rem",
          borderRadius: "25px",
          border: "2px solid white",
          cursor: "pointer",
          background: "rgba(30, 58, 138, 0.9)",
          color: "white",
          fontSize: "1rem",
          fontWeight: "bold",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          transition: "transform 0.2s, background 0.2s, box-shadow 0.2s",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.background = "rgba(30, 58, 138, 1)";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1.0)";
          e.currentTarget.style.background = "rgba(30, 58, 138, 0.9)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
        }}
      >
        🏠 Home
      </button>

      <div style={{ textAlign: "center", flex: 1 }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>Conjugate:</h2>
        
        <div style={{ 
          background: "rgba(255, 255, 255, 0.95)", 
          padding: "2rem", 
          borderRadius: "20px",
          margin: "0 auto",
          maxWidth: "600px",
          boxShadow: "0 8px 16px rgba(0,0,0,0.3)"
        }}>
          <p style={{ fontSize: "1.3rem", color: "#666", marginBottom: "10px" }}>
            <strong>{currentVerb.subject}</strong> ({currentVerb.subjectEnglish})
          </p>
          <h1 style={{ fontSize: "3.5rem", margin: "20px 0", color: "#1e40af" }}>
            {currentVerb.infinitive}
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "5px" }}>
            {currentVerb.english}
          </p>
          <p style={{ fontSize: "1rem", color: "#999" }}>
            Tense: <strong>{currentVerb.tenseName}</strong>
          </p>
        </div>
        
        <p style={{ marginTop: "20px", fontSize: "1.3rem", fontWeight: "bold" }}>{feedback}</p>
        <p style={{ marginTop: "10px", color: "gray", fontSize: "1rem" }}>
          You said: {transcript || "..."}
        </p>
        <p style={{ marginTop: "10px", fontSize: "1.2rem", fontWeight: "bold" }}>
          ⏱ Time left: {timer}s {isPaused && "(Paused)"}
        </p>
      </div>

      <div style={{ width: "60px", height: "80%", marginLeft: "40px", position: "relative", background: "#eee", borderRadius: "30px", display: "flex", flexDirection: "column-reverse", justifyContent: "flex-start", alignItems: "center" }}>
        <div style={{ position: "absolute", top: "-40px" }}>✈️</div>
        <div style={{ width: "100%", height: barHeight, background: "gold", borderRadius: "30px", transition: "height 0.5s" }}></div>
      </div>
    </div>
  );
}