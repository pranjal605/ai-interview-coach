---
name: Gemini model selection
description: Which Gemini models work vs. fail for this project's API key, and why
---

## Rule
Always use `gemini-2.5-flash` in `geminiService.ts`. Wrap every `model.generateContent()` call in the `withRetry` helper (already implemented) to handle transient 503s.

**Why:**
- `gemini-1.5-flash` — HTTP 404. Deprecated and fully removed from the Generative Language API.
- `gemini-2.0-flash` / `gemini-2.0-flash-lite` — HTTP 429 with `limit: 0`. The API key's GCP project has zero free-tier quota allocated for these models.
- `gemini-2.5-flash` — Works. Returns 503 under high demand but retries resolve it.

**How to apply:**
- Do not switch models without first verifying the target model returns 2xx via a `curl` test against `/api/interview/question`.
- The `withRetry` wrapper in `geminiService.ts` retries on 503/overloaded errors up to 4 times with exponential backoff starting at 2 s.
