import { useState, useEffect } from "react";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("darkMode");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });
  const [view, setView] = useState("quiz"); // "quiz" | "results"

  // plus besoin de charger: on l'initialise via useState lazy init

  // Sauvegarder le thème dans localStorage et appliquer la classe
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`App ${darkMode ? "dark-mode" : ""}`}>
      <header className="app-header">
        <h1>Quiz RGIE Belgique</h1>
        <div className="header-right">
          <nav className="app-nav">
            <button
              onClick={() => setView("quiz")}
              aria-pressed={view === "quiz"}
              className={view === "quiz" ? "active" : ""}
            >
              Quiz
            </button>
            <button
              onClick={() => setView("results")}
              aria-pressed={view === "results"}
              className={view === "results" ? "active" : ""}
            >
              Résultats
            </button>
          </nav>
          <button
            className="theme-toggle"
            onClick={toggleDarkMode}
            aria-label={
              darkMode ? "Activer le mode clair" : "Activer le mode sombre"
            }
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </header>
      {view === "quiz" ? <Quiz /> : <Results />}
    </div>
  );
}

export default App;
