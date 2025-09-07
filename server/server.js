import express from "express";
import cors from "cors";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_, res) => res.json({ ok: true }));

// Upsert session by id
app.post("/sessions", async (req, res) => {
  const payload = req.body || {};
  try {
    const data = {
      id: payload.id,
      name: payload.name || null,
      category: payload.category || null,
      currentQuestion: payload.currentQuestion ?? 0,
      score: payload.score ?? 0,
      showResult: !!payload.showResult,
      selectedOption: payload.selectedOption || null,
      showExplanation: !!payload.showExplanation,
      answers: payload.answers ? JSON.stringify(payload.answers) : null,
      startedAt: payload.startedAt ? new Date(payload.startedAt) : null,
      finishedAt: payload.finishedAt ? new Date(payload.finishedAt) : null,
      total: payload.total ?? 0,
      updatedAt: new Date(),
    };

    const saved = await prisma.session.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
    res.json(saved);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to save session" });
  }
});

app.get("/sessions/:id", async (req, res) => {
  try {
    const s = await prisma.session.findUnique({ where: { id: req.params.id } });
    if (!s) return res.status(404).json({ error: "Not found" });
    const result = {
      ...s,
      answers: s.answers ? JSON.parse(s.answers) : [],
    };
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch session" });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(`API listening on http://localhost:${port}`)
);
