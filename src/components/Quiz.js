import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import questions from "../data/questions.json";

// --- Helpers session/stockage (hors composant pour stabilité) ---
const uuid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });

const SESSIONS_KEY = "quiz-rgie:sessions"; // tableau de meta sessions
const ACTIVE_KEY = "quiz-rgie:activeSessionId";
const sessionStorageKey = (id) => `quiz-rgie:session:${id}`;

const loadSessions = () => {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Impossible de charger les sessions:", e);
    return [];
  }
};

const upsertSessionMeta = (meta) => {
  const sessions = loadSessions();
  const idx = sessions.findIndex((s) => s.id === meta.id);
  if (idx >= 0) sessions[idx] = { ...sessions[idx], ...meta };
  else sessions.unshift(meta);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

const removeSessionMeta = (id) => {
  const sessions = loadSessions().filter((s) => s.id !== id);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentQuestions, setCurrentQuestions] = useState([]);

  // --- Nouveaux états pour session/persistance ---
  const [sessionId, setSessionId] = useState(null);
  const [participantName, setParticipantName] = useState("");
  const [answers, setAnswers] = useState([]); // {qIndex, option, correct}
  const [startedAt, setStartedAt] = useState(null);
  const [finishedAt, setFinishedAt] = useState(null);

  const categories = [
    {
      key: "RGIE_Belgique_FAQ",
      name: "RGIE - Questions de base",
      description: "Questions fondamentales sur le RGIE",
    },
    {
      key: "RGIE_2019_Technique_Avance",
      name: "RGIE 2019 - Technique avancée",
      description: "Questions techniques avancées basées sur le RGIE 2019",
    },
    {
      key: "RGIE_Belgique_Installation_Electrique",
      name: "Installation électrique",
      description: "Questions sur les installations électriques",
    },
  ];

  const selectCategory = (categoryKey) => {
    if (!participantName || participantName.trim().length < 2) {
      alert("Veuillez saisir un nom pour la session avant de commencer.");
      return;
    }
    const newId = uuid();
    setSessionId(newId);
    localStorage.setItem(ACTIVE_KEY, newId);

    setSelectedCategory(categoryKey);
    setCurrentQuestions(questions[categoryKey]);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption("");
    setShowExplanation(false);
    setAnswers([]);
    const now = Date.now();
    setStartedAt(now);
    setFinishedAt(null);

    // Crée/MAJ meta
    upsertSessionMeta({
      id: newId,
      name: participantName.trim(),
      category: categoryKey,
      startedAt: now,
      finishedAt: null,
      status: "in-progress",
    });
  };

  const handleAnswer = (option) => {
    setSelectedOption(option);
    const correct = option === currentQuestions[currentQuestion].reponse;
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
    }
    setShowExplanation(true);

    // Enregistrer réponse
    setAnswers((prev) => {
      const next = [...prev];
      const idx = next.findIndex((a) => a.qIndex === currentQuestion);
      const entry = { qIndex: currentQuestion, option, correct };
      if (idx >= 0) next[idx] = entry;
      else next.push(entry);
      return next;
    });
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    setSelectedOption("");
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
      const end = Date.now();
      setFinishedAt(end);
      if (sessionId) {
        upsertSessionMeta({
          id: sessionId,
          name: participantName.trim(),
          category: selectedCategory,
          startedAt,
          finishedAt: end,
          status: "completed",
          score,
          total: currentQuestions.length,
        });
      }
    }
  };

  const resetQuiz = () => {
    setSelectedCategory(null);
    setCurrentQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption("");
    setShowExplanation(false);
    setAnswers([]);
    setStartedAt(null);
    setFinishedAt(null);
    // On ne supprime pas la sessionId ici pour permettre la reprise effacée par l'utilisateur
  };

  // Effet de confettis quand le quiz est terminé avec un bon score
  useEffect(() => {
    if (showResult && score >= Math.ceil(currentQuestions.length * 0.6)) {
      // Seuil adaptatif : 60% de bonnes réponses
      // Délai pour laisser le temps au composant de s'afficher
      const timer = setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        // Deuxième explosion de confettis
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
          });
        }, 250);
        // Troisième explosion de confettis
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
          });
        }, 400);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [showResult, score, currentQuestions.length]);

  // Sauvegarde automatique de la progression dans localStorage
  useEffect(() => {
    if (!sessionId) return;
    try {
      const payload = {
        id: sessionId,
        name: participantName,
        category: selectedCategory,
        currentQuestion,
        score,
        showResult,
        selectedOption,
        showExplanation,
        answers,
        startedAt,
        finishedAt,
        total: currentQuestions?.length ?? 0,
        updatedAt: Date.now(),
      };
      localStorage.setItem(
        sessionStorageKey(sessionId),
        JSON.stringify(payload)
      );

      // MAJ meta légère
      upsertSessionMeta({
        id: sessionId,
        name: participantName || "",
        category: selectedCategory || null,
        startedAt: startedAt || null,
        finishedAt: finishedAt || null,
        status: showResult ? "completed" : "in-progress",
        score,
        total: currentQuestions?.length ?? 0,
      });

      // Synchronisation optionnelle avec une API (Prisma/SQLite)
      if (process.env.REACT_APP_SYNC_ENABLED === "true") {
        (async () => {
          try {
            await fetch(`${API_BASE}/sessions`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
          } catch (e) {
            // on ignore les erreurs réseau pour ne pas gêner l'UX
          }
        })();
      }
    } catch (e) {
      console.warn("Erreur de sauvegarde localStorage:", e);
    }
  }, [
    sessionId,
    participantName,
    selectedCategory,
    currentQuestion,
    score,
    showResult,
    selectedOption,
    showExplanation,
    answers,
    startedAt,
    finishedAt,
    currentQuestions,
  ]);

  // Reprendre une session sauvegardée
  const resumeSession = (id) => {
    try {
      const raw = localStorage.getItem(sessionStorageKey(id));
      if (!raw) return;
      const data = JSON.parse(raw);
      setSessionId(id);
      localStorage.setItem(ACTIVE_KEY, id);
      setParticipantName(data.name || "");
      setSelectedCategory(data.category);
      setCurrentQuestions(questions[data.category] || []);
      setCurrentQuestion(data.currentQuestion || 0);
      setScore(data.score || 0);
      setShowResult(!!data.showResult);
      setSelectedOption(data.selectedOption || "");
      setShowExplanation(!!data.showExplanation);
      setAnswers(data.answers || []);
      setStartedAt(data.startedAt || null);
      setFinishedAt(data.finishedAt || null);
    } catch (e) {
      console.warn("Impossible de reprendre la session:", e);
    }
  };

  const deleteSession = (id) => {
    try {
      localStorage.removeItem(sessionStorageKey(id));
      removeSessionMeta(id);
      const active = localStorage.getItem(ACTIVE_KEY);
      if (active === id) localStorage.removeItem(ACTIVE_KEY);
      // Si on est sur l'écran de sélection, forcer un rafraîchissement léger via set state no-op
      setParticipantName((n) => n);
    } catch (e) {
      console.warn("Impossible de supprimer la session:", e);
    }
  };

  // Sélection de catégorie + gestion de session
  if (!selectedCategory) {
    const savedSessions = loadSessions();
    return (
      <div className="category-selection">
        <h2>Choisissez une catégorie de questions</h2>
        <div className="session-header" style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8 }}>
            Votre nom (session):
          </label>
          <input
            type="text"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            placeholder="Ex: Christophe"
            style={{ padding: 8, width: "100%", maxWidth: 320 }}
          />
          {participantName?.trim() && (
            <small style={{ display: "block", marginTop: 6, color: "#666" }}>
              Un identifiant sera généré automatiquement au démarrage.
            </small>
          )}
        </div>
        <div className="categories">
          {categories.map((category) => (
            <div key={category.key} className="category-card">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <p>
                <strong>{questions[category.key].length} questions</strong>
              </p>
              <button
                onClick={() => selectCategory(category.key)}
                disabled={!participantName?.trim()}
                title={
                  !participantName?.trim()
                    ? "Saisissez un nom pour démarrer"
                    : ""
                }
              >
                Commencer ce quiz
              </button>
            </div>
          ))}
        </div>

        {savedSessions && savedSessions.length > 0 && (
          <div className="saved-sessions" style={{ marginTop: 24 }}>
            <h3>Sessions sauvegardées</h3>
            <ul>
              {savedSessions.map((s) => (
                <li key={s.id} style={{ marginBottom: 8 }}>
                  <strong>{s.name || "(sans nom)"}</strong> ·{" "}
                  {s.category || "(catégorie ?)"} -{" "}
                  {s.status === "completed" ? "terminée" : "en cours"}
                  {s.total ? ` · ${s.score ?? 0}/${s.total}` : ""}{" "}
                  <button
                    style={{ marginLeft: 8 }}
                    onClick={() => resumeSession(s.id)}
                  >
                    Reprendre
                  </button>
                  <button
                    style={{ marginLeft: 8 }}
                    onClick={() => deleteSession(s.id)}
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / currentQuestions.length) * 100);
    return (
      <div className="result">
        <h2>Résultats</h2>
        <p>
          Votre score: {score}/{currentQuestions.length} ({percentage}%)
        </p>
        {participantName && (
          <p>
            Session: <strong>{participantName}</strong>
            {sessionId ? (
              <>
                {" "}
                · ID: <code>{sessionId}</code>
              </>
            ) : null}
          </p>
        )}
        {score >= Math.ceil(currentQuestions.length * 0.6) && (
          <div className="celebration">
            <h3>🎉 Félicitations ! Excellent travail ! 🎉</h3>
            <p>
              Vous avez réussi {score} questions sur {currentQuestions.length} !
            </p>
          </div>
        )}
        <button onClick={resetQuiz}>Choisir une autre catégorie</button>
        <button
          onClick={() =>
            selectCategory(
              categories.find((c) => c.key === selectedCategory)?.key
            )
          }
        >
          Recommencer cette catégorie
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2>
        Question {currentQuestion + 1}/{currentQuestions.length}
      </h2>
      <div className="category-info">
        <small>
          {categories.find((c) => c.key === selectedCategory)?.name}
        </small>
      </div>
      <h3>{currentQuestions[currentQuestion].question}</h3>

      <div className="options">
        {currentQuestions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showExplanation && handleAnswer(option)}
            className={`
              ${selectedOption === option ? "selected" : ""}
              ${
                showExplanation &&
                option === currentQuestions[currentQuestion].reponse
                  ? "correct"
                  : ""
              }
              ${
                showExplanation && selectedOption === option && !isCorrect
                  ? "incorrect"
                  : ""
              }
            `}
            disabled={showExplanation}
          >
            {option}
          </button>
        ))}
      </div>

      {showExplanation && (
        <div className="explanation">
          <h4>{isCorrect ? "Correct! ✅" : "Incorrect ❌"}</h4>
          <p>
            <strong>Réponse correcte :</strong>{" "}
            {currentQuestions[currentQuestion].reponse}
          </p>
          {currentQuestions[currentQuestion].explication && (
            <div className="detailed-explanation">
              <h5>Explication :</h5>
              <p>{currentQuestions[currentQuestion].explication}</p>
            </div>
          )}
          <button onClick={handleNextQuestion}>
            {currentQuestion === currentQuestions.length - 1
              ? "Voir les résultats"
              : "Question suivante"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
