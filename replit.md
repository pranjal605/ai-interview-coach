# AI Interview Coach

A web app where users pick a job role and difficulty, answer AI-generated interview questions (by text or voice), and receive structured AI feedback with scores and performance charts.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/interview-coach run dev` — run the frontend (port 25252)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (auto-provisioned)
- Required env: `GEMINI_API_KEY` — Google Gemini API key (set in Secrets)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, shadcn/ui, Recharts, wouter, TanStack Query
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- AI: Google Gemini (`gemini-2.0-flash`) via `@google/generative-ai` SDK
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/db/src/schema/sessions.ts` — Interview sessions DB schema
- `artifacts/api-server/src/routes/interview.ts` — All interview API routes
- `artifacts/api-server/src/services/geminiService.ts` — Gemini AI integration
- `artifacts/interview-coach/src/` — React frontend
- `artifacts/interview-coach/src/context/session-context.tsx` — Global interview state
- `artifacts/interview-coach/src/hooks/` — useVoice (Web Speech API), etc.

## Architecture decisions

- OpenAPI-first: all API contracts defined in `lib/api-spec/openapi.yaml`, types generated via Orval
- Session state managed in React Context (no Redux) — tracks phase, questions, answers, scores, feedback
- Gemini AI called directly from the API server (never from client) — API key stays server-side
- Web Speech API used for voice input — no extra library, browser built-in
- PostgreSQL stores session history for post-interview review and stats

## Product

- Pick role (SWE, Data Analyst, PM, etc.), difficulty (Easy/Medium/Hard), and question count (3/5/10)
- AI generates role-specific interview questions with hints and expected keywords
- Answer by typing or speaking (voice via Web Speech API)
- 120-second timer per question with color-coded urgency
- AI evaluates each answer: score/10, strengths, improvements, model answer, keyword coverage
- Session summary with performance trend chart (Recharts LineChart)
- Job Description mode: paste any JD, AI generates 5 tailored questions
- Session history with expandable Q&A review and score charts

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `gemini-1.5-flash` is deprecated/removed from the Generative Language API — do not use it
- `gemini-2.0-flash` and `gemini-2.0-flash-lite` have free-tier quota of 0 for some API keys
- Use `gemini-2.5-flash` — it works but may return 503 under high demand; the service wraps all calls in retry logic with exponential backoff
- Always run `pnpm run typecheck:libs` after editing any `lib/*` package before checking artifact packages
- Import types from `@workspace/api-client-react` (barrel export), not from deep src paths
- Never call React hooks inside JSX — extract to component scope first

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
