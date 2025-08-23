import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import questions from "../data/questions.json";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentQuestions, setCurrentQuestions] = useState([]);

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
    setSelectedCategory(categoryKey);
    setCurrentQuestions(questions[categoryKey]);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption("");
    setShowExplanation(false);
  };

  const handleAnswer = (option) => {
    setSelectedOption(option);
    const correct = option === currentQuestions[currentQuestion].reponse;
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    setSelectedOption("");
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
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

  // Sélection de catégorie
  if (!selectedCategory) {
    return (
      <div className="category-selection">
        <h2>Choisissez une catégorie de questions</h2>
        <div className="categories">
          {categories.map((category) => (
            <div key={category.key} className="category-card">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <p>
                <strong>{questions[category.key].length} questions</strong>
              </p>
              <button onClick={() => selectCategory(category.key)}>
                Commencer ce quiz
              </button>
            </div>
          ))}
        </div>
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
