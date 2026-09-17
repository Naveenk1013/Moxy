# instructions.md — Setup & Development Guide

> This is the developer-facing setup guide. For the **in-app first-time-user tutorial** that visitors see, see `design.md` → "First-time-user tutorial" — that's a product feature, not a dev doc.

## Prerequisites

- Node.js (LTS version) and npm/yarn/pnpm
- A Claude API key (Anthropic) for the LLM layer
- A Postgres instance with the `pgvector` extension (or your chosen vector store)
- Git

## Recommended repo structure

```
moxy/
├── apps/
│   └── web/              # Next.js mobile-first frontend
├── services/
│   └── api/               # backend: chat, retrieval, handoff endpoints
├── knowledge-base/
│   ├── source/             # raw source docs (data.md lives here or is synced from here)
│   └── pipeline/            # chunk/embed/index scripts
├── docs/                    # this documentation set (readme.md, mvp.md, design.md, architecture.md, data.md, progress.md)
└── .env.example
```

## First-time setup

1. **Clone the repo** and install dependencies in each workspace (`apps/web`, `services/api`).
2. **Environment variables** — copy `.env.example` to `.env` and fill in:
   - `ANTHROPIC_API_KEY` — Claude API key
   - `DATABASE_URL` — Postgres connection string (with pgvector enabled)
   - `NEXT_PUBLIC_API_BASE_URL` — where the frontend should call the backend
3. **Build the knowledge base index:**
   - Place `data.md` (and any additional verified source docs) in `knowledge-base/source/`.
   - Run the pipeline script to chunk, embed, and index the content into the vector store. (Script name/command TBD once the pipeline is implemented — document it here once built.)
4. **Run the backend** locally (dev command TBD based on chosen framework, e.g. `npm run dev` in `services/api`).
5. **Run the frontend** locally (`npm run dev` in `apps/web`), and open it on a real phone or a narrow browser window (375px) to test mobile-first behavior properly — don't just eyeball it on a desktop-width browser.

## Updating the knowledge base

Whenever IIHM shares updated info (new fees, hostel details, faculty list, revised admission steps):

1. Update `data.md` (or the relevant source doc) directly — keep facts sourced and dated.
2. Re-run the chunk/embed/index pipeline so the vector store reflects the change.
3. Spot-check a few real questions in the chat UI to confirm Moxy is pulling the updated info, not stale cached context.
4. Log the change in `progress.md`.

## Testing checklist before any deploy

- [ ] Tutorial shows correctly on first visit, is skippable, and doesn't reappear after being seen.
- [ ] Core intents from `mvp.md` all return correct, non-hallucinated answers.
- [ ] Any question about fees/hostel/exact dates/named staff triggers the handoff card, not a guess.
- [ ] Layout works cleanly at 360–400px width with no horizontal scroll.
- [ ] Tap targets are comfortably tappable one-handed.
- [ ] Handoff buttons (call/WhatsApp/email) actually open the right app with the right number.

## Deployment

- Frontend and backend deploy targets to be confirmed with whoever owns IIHM's hosting/infra (see `architecture.md` → Hosting & infra).
- Recommend a staging environment pointed at a copy of the knowledge base before pushing changes live, since Moxy is public-facing and represents IIHM directly.
