---
name: multi-stream-daily-updates
overview: Refactor Sutra’s daily update system into multiple themed, non-repetitive streams with a shared content engine, consistent archiving, and dedicated reading pages.
todos:
  - id: stream-taxonomy
    content: Document and standardize the five existing streams (trivia, market-pulse, code-sutra, genai-frontiers, actuarial-simplified) and ensure their type strings are consistent across API routes, Convex, and archive pages.
    status: completed
  - id: content-engine-refactor
    content: Refactor lib/gemini.ts into a shared content engine with a base prompt and per-stream configurations, plus a generic Gemini JSON caller with retry logic.
    status: completed
  - id: broadcast-helper
    content: Create a shared broadcast helper to send Resend broadcasts, archive editions in Convex, and ping IndexNow, used by all stream API routes.
    status: completed
  - id: api-routes-thin
    content: Simplify per-stream API routes to call the content engine and broadcast helper, removing duplicated Resend and Convex logic.
    status: completed
  - id: archive-consistency
    content: Verify that every stream archives to Convex and renders correctly in /archive/[type]/[slug], adjusting archive listing pages if needed for a better multi-stream browsing experience.
    status: completed
isProject: false
---

## Multi‑Stream Daily Updates Refactor

### High-level direction

- **Goal**: Keep multiple themed streams (Trivia, Market Pulse, Code Sutra, GenAI Frontiers, Actuarial Simplified), but power them with a **shared content engine** that pulls recent global news in tech, finance/markets, AI/agentic AI, economics, and insurance/actuarial, then renders each stream through its own narrative lens.
- **Result**: Less repetitive prompts and API code, more consistent structure across streams, and a clear archive surface so each edition has a dedicated page users can revisit.

### 1. Clarify and standardize stream taxonomy

- **Stream definition**: Treat each existing series as a **stream** with a clear purpose and domain focus:
  - **trivia**: Short weekly “Sutra Insight” on recent actuarial/insurance + AI news.
  - **market-pulse**: Economic & markets view with explicit insurance/actuarial implications.
  - **code-sutra**: Practical AI‑augmented coding workflow for actuaries / insurance engineers.
  - **genai-frontiers**: Frontier AI/agentic AI news with actuarial applications.
  - **actuarial-simplified**: One actuarial/insurance concept tied to a current event, explained simply.
- **Cadence strategy**: Keep the current cron schedule in `app/api/cron/route.ts` as the source of truth, but document it as a **multi‑stream calendar** (e.g., Mon: Actuarial Simplified + Digest, Tue: Code Sutra, Wed: Trivia, Fri: GenAI Frontiers, Sat: Market Pulse) so you can easily adjust later without changing email logic.
- **Type normalization**: Ensure `type` strings used in Convex (`broadcasts` table) and the archive routes match these stream identifiers exactly (e.g., `"genai-frontiers"`, `"market-pulse"`).

### 2. Data model and storage design

- **Reuse `broadcasts` collection**: Keep using the existing Convex `broadcasts` table (see `[convex/broadcasts.ts](convex/broadcasts.ts)`) to store all stream editions with fields `{ type, title, slug, data, publishedAt }`.
- **Standardize payload shape**:
  - Define TypeScript interfaces in a shared file (e.g., `lib/streams.ts`) for each stream’s `data` shape (matching the JSON produced by Gemini) to avoid ad‑hoc `any` usage.
  - Optionally add a **base schema** like `{ sections: Array<{ id; heading; content; meta? }> }` so streams can be rendered generically where possible, while still supporting type‑specific layouts.
- **Optional future extension**: Add `sources` metadata to the stored `data` payload (e.g., `{ url, title, publisher }[]`) if you want visible citations later; design the interfaces now so the content engine can start including them later without changing DB schema.

### 3. Content engine: unify Gemini usage

- **Single orchestrator**: Replace multiple ad‑hoc generator functions in `[lib/gemini.ts](lib/gemini.ts)` with a central **content engine** that accepts a stream identifier and returns typed content, e.g.:
  - `generateStreamContent("trivia")`
  - `generateStreamContent("market-pulse")`
  - …each delegating to a **map of stream configs** rather than duplicating logic.
- **Stream config structure** (in `lib/streams.ts` or similar):
  - `id`: `"trivia" | "market-pulse" | ...`
  - `domains`: arrays like `["tech", "finance", "ai", "agentic-ai", "economics", "insurance", "actuarial"]` with emphasis per stream (e.g., Market Pulse leans harder on `"economics"` + `"markets"`).
  - `promptTemplate`: a concise system prompt that plugs in the current date and domain focus.
  - `outputSchema`: TypeScript zod‑style or inferred structure documenting the JSON layout the model must emit.
- **Shared base prompt**:
  - Define a **base system prompt** that handles: recency (last 7 days), requirement to ground in real events, tie‑back to insurance/actuarial, and JSON‑only output.
  - Each stream’s prompt extends this base with its own tone/voice and section descriptions instead of rewriting the entire instruction block.
- **Retry and cleaning logic**:
  - Keep the existing retry/exponential backoff behavior, but factor it into a single helper (e.g., `callGeminiJson<T>(prompt, schemaName)`) that:
    - Calls Gemini with the requested model.
    - Strips

```fences.
    - Parses JSON and validates it against the expected interface shape (at least shallowly).

### 4. Email/broadcast orchestration refactor
- **Central sender utility**: Create a shared helper (e.g., `lib/broadcasts.ts`) used by all stream API routes:
  - Inputs: `{ type, title, audienceId, subject, fromLabel, replyTo, html, data, slugBase, archivePathPrefix }`.
  - Responsibilities:
    - Generate a slug via `sanitizeSlug(title)` + timestamp.
    - Call Resend `broadcasts.create` + `broadcasts.send`.
    - Save the edition via `convex.mutation(api.broadcasts.saveBroadcast, { type, title, slug, data })`.
    - Optionally call `submitUrlsToIndexNow(["https://sutra.aiactuaries.org/archive/${type}/${slug}"])`.
    - Return `{ broadcastId, slug, title }` to the route.
- **Thin per‑stream API routes** (under `app/api/[stream]/route.ts`):
  - For each stream, the `trigger...Broadcast` function becomes:
    1. Call `generateStreamContent(streamId)`.
    2. Generate HTML via a **per‑stream email template** helper (or a shared template with switchable sections).
    3. Call the shared broadcast sender.
- **Cron orchestrator alignment**: Keep `app/api/cron/route.ts` as the scheduler/orchestrator, but simplify it to only decide *which stream* to fire at a given time and call the appropriate thin `trigger...Broadcast` function.

### 5. Archive and dedicated page UX
- **Use existing archive routes**: Leverage the existing archive infra in `[app/archive/[type]/[slug]/page.tsx](app/archive/[type]/[slug]/page.tsx)` and `[app/archive/[type]/page.tsx](app/archive/[type]/page.tsx)` which already query Convex and render type‑specific layouts.
- **Ensure consistency across streams**:
  - Confirm that each API route (not just trivia) calls `saveBroadcast` with the correct `type` so that all streams appear in the archive pages.
  - For any stream not yet archiving, add the `convex.mutation(api.broadcasts.saveBroadcast, ...)` call and include the correct archive URL in `IndexNow` submissions.
- **Daily reading experience**:
  - Preserve the **beautiful, type‑specific layouts** already in `[slug]/page.tsx` (e.g., different card styles for Market Pulse vs GenAI Frontiers), but ensure they rely on the **typed `data` interfaces** from the content engine.
  - If desired, extend the main archive index `[app/archive/page.tsx](app/archive/page.tsx)` to highlight the latest edition from each stream at the top so users can quickly see “what’s new this week” without opening email.

### 6. Strategy for existing vs new streams
- **Recommendation given your "multiple streams" choice**:
  - Keep all five existing series as **named streams**, but:
    - Refactor them to use the new shared content engine and broadcast helper.
    - Tighten each stream’s prompt so it always **anchors back to insurance/actuarial** even when covering global tech/finance/AI/economic news.
  - Optionally introduce a **new meta‑stream** later (e.g., `sutra-daily-digest`) that combines short snippets from the day’s streams into one digest email if you decide you want a “master” daily view.
- **Transition**:
  - No DB migration needed if `broadcasts` already contains mixed `type`s; simply ensure new editions follow the same schema.
  - Old editions remain visible at existing `/archive/[type]/[slug]` URLs.

### 7. Architecture overview
- **Flow diagram**:

```mermaid
flowchart TD
  cronJob[Cron/External Scheduler]
  apiCron[GET /api/cron]
  streamRoute[Stream API route e.g. /api/trivia]
  contentEngine[Content Engine in lib/gemini or lib/streams]
  gemini[Gemini API]
  emailTemplate[Email HTML Template]
  broadcastHelper[Broadcast Helper]
  resend[Resend Broadcast]
  convexDB[Convex broadcasts]
  archivePage[Next.js /archive/[type]/[slug] page]
  subscriberEmail[Subscriber Inbox]

  cronJob --> apiCron
  apiCron --> streamRoute
  streamRoute --> contentEngine
  contentEngine --> gemini
  gemini --> contentEngine
  contentEngine --> emailTemplate
  emailTemplate --> broadcastHelper
  broadcastHelper --> resend
  broadcastHelper --> convexDB
  resend --> subscriberEmail
  convexDB --> archivePage
```

- **Key idea**: Streams differ mainly in templates and tone; the underlying fetch‑recent‑news + JSON‑generation + broadcast‑and‑archive pipeline is shared.

### 8. Future enhancements (optional, not required initially)

- **Editorial safety net**: Add an admin‑only preview route to generate but not send a stream, allowing manual edits/approval before a Resend broadcast.
- **Source citations in UI**: Surface the underlying news article links in the archive pages once the content engine starts returning `sources` metadata.
- **Analytics hooks**: Log open/link‑click metrics (from Resend webhooks) into Convex for each `broadcastId` and show a simple performance view per stream.

