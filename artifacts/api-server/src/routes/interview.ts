import { Router } from "express";
import { db } from "@workspace/db";
import { sessionsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import {
  StartSessionBody,
  GenerateQuestionBody,
  EvaluateAnswerBody,
  ParseJdQuestionsBody,
  GetSessionParams,
} from "@workspace/api-zod";
import { generateQuestion, evaluateAnswer, parseJD } from "../services/geminiService";
import { randomUUID } from "crypto";

const router = Router();

// POST /api/interview/sessions — start a session
router.post("/sessions", async (req, res, next) => {
  try {
    const body = StartSessionBody.parse(req.body);
    const id = `session_${Date.now()}_${randomUUID().slice(0, 9)}`;
    const [session] = await db
      .insert(sessionsTable)
      .values({
        id,
        role: body.role,
        difficulty: body.difficulty,
        totalQuestions: body.totalQuestions,
      })
      .returning();
    res.status(201).json({
      ...session,
      createdAt: session.createdAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/interview/sessions — list sessions
router.get("/sessions", async (req, res, next) => {
  try {
    const sessions = await db
      .select()
      .from(sessionsTable)
      .orderBy(sql`${sessionsTable.createdAt} desc`)
      .limit(20);
    res.json(
      sessions.map((s) => ({
        ...s,
        createdAt: s.createdAt.toISOString(),
      }))
    );
  } catch (err) {
    next(err);
  }
});

// GET /api/interview/sessions/:sessionId
router.get("/sessions/:sessionId", async (req, res, next) => {
  try {
    const { sessionId } = GetSessionParams.parse(req.params);
    const [session] = await db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.id, sessionId));
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }
    res.json({ ...session, createdAt: session.createdAt.toISOString() });
  } catch (err) {
    next(err);
  }
});

// POST /api/interview/question — generate a question
router.post("/question", async (req, res, next) => {
  try {
    const body = GenerateQuestionBody.parse(req.body);
    const question = await generateQuestion(body.role, body.difficulty);
    res.json(question);
  } catch (err) {
    next(err);
  }
});

// POST /api/interview/evaluate — evaluate an answer
router.post("/evaluate", async (req, res, next) => {
  try {
    const body = EvaluateAnswerBody.parse(req.body);
    const feedback = await evaluateAnswer(
      body.question,
      body.answer,
      body.expectedKeywords
    );

    // Persist to session
    const [session] = await db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.id, body.sessionId));

    if (session) {
      const updatedAnswers = [...session.answers, body.answer];
      const updatedScores = [...session.scores, feedback.score];
      const updatedQuestions = session.questions.includes(body.question)
        ? session.questions
        : [...session.questions, body.question];
      const updatedFeedback = [...(session.feedbackList as object[]), feedback];

      await db
        .update(sessionsTable)
        .set({
          answers: updatedAnswers,
          scores: updatedScores,
          questions: updatedQuestions,
          feedbackList: updatedFeedback,
        })
        .where(eq(sessionsTable.id, body.sessionId));
    }

    res.json(feedback);
  } catch (err) {
    next(err);
  }
});

// POST /api/interview/jd-questions — parse JD and generate questions
router.post("/jd-questions", async (req, res, next) => {
  try {
    const body = ParseJdQuestionsBody.parse(req.body);
    if (body.jdText.length < 50) {
      res.status(400).json({ error: "Job description must be at least 50 characters" });
      return;
    }
    const questions = await parseJD(body.jdText);
    res.json(questions);
  } catch (err) {
    next(err);
  }
});

// GET /api/interview/stats — aggregate stats
router.get("/stats", async (req, res, next) => {
  try {
    const sessions = await db.select().from(sessionsTable);

    const totalSessions = sessions.length;
    let totalScore = 0;
    let totalScoreCount = 0;
    let totalQuestions = 0;
    const roleCounts: Record<string, number> = {};

    for (const s of sessions) {
      for (const score of s.scores) {
        totalScore += score;
        totalScoreCount++;
      }
      totalQuestions += s.questions.length;
      roleCounts[s.role] = (roleCounts[s.role] ?? 0) + 1;
    }

    const averageScore = totalScoreCount > 0 ? totalScore / totalScoreCount : 0;
    const topRole =
      Object.entries(roleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

    res.json({
      totalSessions,
      averageScore: Math.round(averageScore * 10) / 10,
      topRole,
      totalQuestions,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
