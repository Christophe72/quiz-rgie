-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "category" TEXT,
    "currentQuestion" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,
    "showResult" BOOLEAN NOT NULL DEFAULT false,
    "selectedOption" TEXT,
    "showExplanation" BOOLEAN NOT NULL DEFAULT false,
    "answers" TEXT,
    "startedAt" DATETIME,
    "finishedAt" DATETIME,
    "total" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
