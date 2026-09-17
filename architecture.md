# architecture.md — System Architecture

## High-level shape

Moxy is a **mobile-first web app** with a chat UI, backed by a **retrieval-grounded LLM layer** — meaning the model answers using a curated knowledge base (`data.md` → structured/embedded), not open-ended memory. This keeps answers accurate and makes "I don't know, let me connect you" a designed behavior rather than a failure mode.

```
┌─────────────────────┐
│   Mobile-first Web   │   React/Next.js PWA
│   Chat UI (Moxy)      │   suggestion chips, tutorial, handoff screen
└─────────┬────────────┘
          │ HTTPS/JSON
┌─────────▼────────────┐
│   API / Backend        │   Node.js (or serverless functions)
│   - chat endpoint       │
│   - retrieval endpoint  │
│   - handoff/contact API │
└─────────┬────────────┘
          │
┌─────────▼────────────┐        ┌───────────────────────┐
│  Knowledge Base Store  │◄──────┤  Content pipeline       │
│  (vector DB + source    │       │  data.md → chunk →      │
│   docs, e.g. Postgres/  │       │  embed → index          │
│   pgvector or a hosted  │       └───────────────────────┘
│   vector service)        │
└─────────┬────────────┘
          │ retrieved context
┌─────────▼────────────┐
│   LLM (Claude API)     │   grounded generation + guardrails
└───────────────────────┘
```

## Frontend

- **Framework:** React (Next.js recommended for routing + easy PWA setup) — mobile-first responsive CSS, no desktop-first retrofitting.
- **State:** Lightweight client state for chat history within a session; tutorial-seen flag stored in `localStorage`.
- **PWA basics:** installable icon, offline splash screen (the chat itself requires network, but the shell should load gracefully).
- **Key components:** ChatThread, MessageBubble, SuggestionChips, TutorialCarousel, HandoffCard, QuickLinksDrawer.

## Backend

- **Chat endpoint:** receives user message + short conversation history, calls the retrieval step, then calls the LLM with the retrieved context and a system prompt that encodes Moxy's persona and the "don't guess, hand off" rule.
- **Retrieval step:** embeds the user's question, searches the vector index built from `data.md` (and future source documents), returns top-matching chunks.
- **Handoff/contact endpoint:** returns the correct phone/email/WhatsApp link for a given topic (currently just Hyderabad admissions, extensible per-campus later).
- **Rate limiting & abuse protection:** basic throttling on the public chat endpoint.

## Knowledge base & content pipeline

- **Source of truth:** `data.md` (and any future internal documents IIHM provides — fee sheets, hostel info, faculty lists, once available).
- **Pipeline:** source docs → chunked into topic-sized pieces → embedded → stored in a vector index → retrieved at query time.
- **Update process:** whenever `data.md` (or new source docs) change, re-run the chunk/embed/index step. This should be a simple script, not a manual rebuild, since course/fee/admission info changes every cycle.
- **Guardrail data:** the "known gaps" list in `data.md` §9 is used to explicitly block Moxy from answering certain topic categories (fees, hostel, exact dates, named current staff) with anything other than a handoff.

## LLM layer

- **Model:** Claude API (model choice — e.g. a fast/cheap tier for most queries) with a system prompt defining Moxy's persona, tone, and the strict "only answer from retrieved context" rule.
- **Grounding rule:** if retrieval doesn't surface relevant context above a confidence/similarity threshold, the backend should skip the LLM call entirely and return the handoff response — avoids the LLM improvising.

## Hosting & infra (suggested, confirm with whoever owns IIHM's infra budget)

- Frontend: static/PWA hosting (e.g. Vercel, Netlify, or IIHM's existing web host).
- Backend: serverless functions or a small Node server.
- Vector store: Postgres + pgvector (simple, cheap) is enough at this scale; a hosted vector DB is an option if it needs to scale across all campuses later.
- Domain: ideally a subdomain of iihm.ac.in (e.g. `moxy.iihm.ac.in`) for brand trust — needs IIHM IT/marketing sign-off.

## Security & privacy

- No login required for MVP — anonymous chat sessions only.
- Don't store personally identifying info beyond what's needed for a handoff request (name/phone/email, only if the user explicitly submits it to reach a human) — align this with IIHM's existing privacy policy (`https://iihm.ac.in/my-iihm/mandatory-disclosure/privacy-policy`).
- Rate-limit and sanitize inputs to the LLM call to avoid prompt-injection style abuse from public users.

## Extensibility (post-MVP)

- Multi-campus: knowledge base is already structured by campus in `data.md`; add a campus-selector or auto-detect (e.g. via subdomain/query param) once more campuses' data is compiled.
- WhatsApp integration: the backend's chat endpoint can be reused behind a WhatsApp Business API webhook later.
- Multilingual: swap/extend the system prompt and add translated knowledge chunks.
