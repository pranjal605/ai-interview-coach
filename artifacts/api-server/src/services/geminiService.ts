import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "../lib/logger";

if (!process.env["GEMINI_API_KEY"]) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

const genAI = new GoogleGenerativeAI(process.env["GEMINI_API_KEY"]);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

function stripMarkdown(text: string): string {
  return text.replace(/```json|```/g, "").trim();
}

export async function generateQuestion(role: string, difficulty: string) {
  const prompt = `You are a strict technical interviewer. Generate ONE ${difficulty} level interview question for a ${role} candidate. Return ONLY a raw JSON object with NO markdown, NO code blocks, NO extra text. Exact format: { "question": "...", "hint": "...", "expectedKeywords": ["keyword1", "keyword2", "keyword3"] }`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleaned = stripMarkdown(text);

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    logger.error({ raw: text }, "Gemini returned invalid JSON for generateQuestion");
    throw new Error("Gemini returned invalid JSON");
  }
}

export async function evaluateAnswer(
  question: string,
  answer: string,
  expectedKeywords: string[]
) {
  const prompt = `You are an expert technical interviewer. Evaluate the candidate's answer strictly and fairly.
Question: ${question}
Candidate's answer: ${answer}
Expected keywords: ${expectedKeywords.join(", ")}
Return ONLY a raw JSON object with NO markdown, NO code blocks, NO extra text. Exact format: { "score": <integer 1-10>, "strengths": ["...", "..."], "improvements": ["...", "..."], "modelAnswer": "...", "keywordCoverage": <integer 0-100> }`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleaned = stripMarkdown(text);

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    logger.error({ raw: text }, "Gemini returned invalid JSON for evaluateAnswer");
    throw new Error("Gemini returned invalid JSON");
  }
}

export async function parseJD(jdText: string) {
  const prompt = `Read this job description carefully and generate exactly 5 targeted interview questions a recruiter would ask. Job Description: ${jdText}
Return ONLY a raw JSON array with NO markdown, NO code blocks, NO extra text. Exact format: [{ "question": "...", "hint": "...", "expectedKeywords": ["..."] }, ...]`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleaned = stripMarkdown(text);

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    logger.error({ raw: text }, "Gemini returned invalid JSON for parseJD");
    throw new Error("Gemini returned invalid JSON");
  }
}
