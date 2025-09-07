import React, { useMemo } from "react";

const SESSIONS_KEY = "quiz-rgie:sessions";

function loadSessions() {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(arr)) return [];
    return arr;
  } catch (e) {
    return [];
  }
}

function formatDate(ts) {
  if (!ts) return "—";
  try {
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
  } catch {
    return "—";
  }
}

export default function Results() {
  const sessions = useMemo(() => {
    const all = loadSessions();
    // trier par date maj/fin si disponible
    return [...all].sort(
      (a, b) =>
        (b.finishedAt || b.startedAt || 0) - (a.finishedAt || a.startedAt || 0)
    );
  }, []);

  return (
    <div className="results-page" style={{ padding: 16 }}>
      <h2>Résultats enregistrés</h2>
      {sessions.length === 0 ? (
        <p>Aucun résultat pour le moment.</p>
      ) : (
        <div className="results-table" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Nom</th>
                <th style={th}>Catégorie</th>
                <th style={th}>Score</th>
                <th style={th}>Statut</th>
                <th style={th}>Début</th>
                <th style={th}>Fin</th>
                <th style={th}>ID</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id}>
                  <td style={td}>{s.name || "(sans nom)"}</td>
                  <td style={td}>{s.category || "—"}</td>
                  <td style={td}>
                    {Number.isFinite(s.score) && Number.isFinite(s.total)
                      ? `${s.score}/${s.total}`
                      : "—"}
                  </td>
                  <td style={td}>
                    {s.status === "completed" ? "Terminé" : "En cours"}
                  </td>
                  <td style={td}>{formatDate(s.startedAt)}</td>
                  <td style={td}>{formatDate(s.finishedAt)}</td>
                  <td style={{ ...td, fontFamily: "monospace" }}>{s.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th = {
  textAlign: "left",
  borderBottom: "1px solid #ccc",
  padding: "8px",
};

const td = {
  borderBottom: "1px solid #eee",
  padding: "8px",
};
