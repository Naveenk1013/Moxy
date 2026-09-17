# design.md — UX & Product Design

## Design principles

1. **Mobile-first, always.** Design every screen at a 375px viewport first, then scale up. No feature ships if it doesn't work one-handed on a phone.
2. **Concierge, not sales bot.** Moxy should feel like a helpful, well-informed staff member — warm but efficient, never pushy about "apply now."
3. **Honest over impressive.** If the knowledge base doesn't have an answer, Moxy says so and routes to a human. This is a trust feature, not a limitation to hide.
4. **Low typing, high tapping.** Prospective students on mobile don't want to type long questions — offer tappable suggestion chips wherever possible.

## Moxy's persona

- **Name:** Moxy
- **Role framing:** IIHM's virtual concierge — think "front desk officer who's read every brochure and knows the campus inside out."
- **Tone:** Friendly, concise, encouraging without being salesy. Uses plain English, avoids jargon unless the user used it first (e.g., "eCHAT," "SBTET").
- **Avatar:** A simple, friendly chat-bubble/concierge-badge icon — avoid depicting a specific real person; keep it brand-neutral and approachable.

## Screens (v1)

1. **Splash / launch screen** — Moxy logo, one-line tagline ("Your IIHM Hyderabad concierge — ask me anything"), a "Get Started" button.
2. **First-time tutorial (3 short cards, swipeable)** — see below.
3. **Main chat screen** — message thread, input bar, 3–4 suggested-question chips above the keyboard that change based on context.
4. **Quick-links drawer / menu** — persistent access to: Courses, Admissions, Contact Us, Campus Info, "Talk to a human."
5. **Handoff screen** — shown whenever Moxy can't answer: displays the right phone/email/WhatsApp for Hyderabad admissions, with tap-to-call and tap-to-WhatsApp buttons.

## First-time-user tutorial (required for MVP)

Goal: get a brand-new visitor from "what is this" to "asking a real question" in under 30 seconds, without a wall of text.

- **Card 1 — Who's Moxy:** "Hi, I'm Moxy 👋 — IIHM Hyderabad's virtual concierge. Ask me about courses, admissions, or campus life, anytime."
- **Card 2 — How to use me:** Show 3 tappable example questions (e.g., "What courses do you offer?", "How do I apply?", "Where is the campus?") so the user learns by seeing real interaction, not being told rules.
- **Card 3 — Honesty note:** "I know a lot, but not everything — for fees, hostel seats, or exact dates I'll connect you straight to our admissions team." This sets expectations up front so a later "I don't know" doesn't feel like a broken bot.
- Tutorial is skippable at any point ("Skip" top-right), auto-dismisses after card 3, and is only shown once per user (stored client-side) with a way to replay it from the menu ("How Moxy works").

## Conversation design

- Every Moxy answer that references specific facts (fees process steps, contact numbers, program names) should be traceable to `data.md` — no invented specifics.
- Long answers get broken into short paragraphs or bullet points; avoid dense blocks of text on a phone screen.
- After most answers, offer 2–3 relevant follow-up chips (e.g., after "courses" answer, chips for "Eligibility," "How to apply," "Fees process").
- Any question touching fees, hostel, exact dates, or named current staff triggers the **handoff pattern**, not a best-guess answer.

## Visual direction

- Lean on IIHM's existing brand colors (maroon/deep-red and gold tones are typical of the group's marketing) so Moxy feels like an IIHM product, not a generic chatbot skin — confirm exact brand palette/logo usage rules with IIHM marketing before finalizing.
- Generous tap targets (min 44px), single-column layout, sticky input bar, chat bubbles with clear user/Moxy distinction.
- Avoid dense navigation — the whole point of a concierge is "just ask," not "go dig through a menu."

## Accessibility

- Sufficient color contrast for chat bubbles and buttons.
- All icons paired with text labels (no icon-only nav on first use).
- Support browser text-size scaling without breaking layout.
