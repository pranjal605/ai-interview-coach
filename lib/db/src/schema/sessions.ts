import { pgTable, text, integer, real, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const feedbackSchema = z.object({
  score: z.number(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  modelAnswer: z.string(),
  keywordCoverage: z.number(),
});

export type Feedback = z.infer<typeof feedbackSchema>;

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  role: text("role").notNull(),
  difficulty: text("difficulty").notNull(),
  totalQuestions: integer("total_questions").notNull().default(5),
  questions: text("questions").array().notNull().default([]),
  answers: text("answers").array().notNull().default([]),
  scores: real("scores").array().notNull().default([]),
  feedbackList: jsonb("feedback_list").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSessionSchema = createInsertSchema(sessionsTable).omit({ createdAt: true });
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessionsTable.$inferSelect;
