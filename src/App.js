import { useState, useEffect } from "react";
import Quiz from "./components/Quiz";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Charger le thème depuis localStorage au démarrage
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

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
        <button
          className="theme-toggle"
          onClick={toggleDarkMode}
          aria-label={
            darkMode ? "Activer le mode clair" : "Activer le mode sombre"
          }
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </header>
      <Quiz />
    </div>
  );
}

export default App;
