# mvp.md — Moxy MVP Scope

## Goal of the MVP

Ship a chat-based web app that can reliably answer the most common questions a prospective student, current student, or visitor would ask IIHM Hyderabad's front desk — grounded strictly in verified data, mobile-first, with a first-time-user tutorial.

## Primary user personas

1. **Prospective student** (17–22) — researching courses, eligibility, admission steps, fees process, "is this worth it."
2. **Parent** — cares about safety, accreditation, placement track record, cost, hostel.
3. **Current student** — process questions (grievance redressal, contact details, where things are), less about marketing and more about "how do I do X."
4. **Walk-in visitor / recruiter / vendor** — wants a human quickly; Moxy's job here is fast, correct routing.

## Core intents Moxy must handle at launch

- **Courses & programs** — what's offered at Hyderabad, duration, affiliating university/body, what each program leads to.
- **Admission process** — the 3 ways to apply (in-person form, download+post, eCHAT online), fee for the form, next eCHAT date, how to check eCHAT results.
- **Eligibility & FAQs** — age range, stream requirements, qualification needed, whether it's equivalent to a degree, loan availability.
- **Campus info** — Hyderabad address, directions, facilities overview, accreditation (SBTET, THSC).
- **Contact routing** — right phone/email for admissions vs. general queries vs. director's office; WhatsApp handoff.
- **Placements** — general info on placement support and industry partners, pointer to the Superheroes/alumni page.
- **"I don't know" handling** — for fees, hostel, exact dates, timetables: Moxy admits the gap and hands off to a human contact instead of guessing.
- **First-time tutorial** — a short guided intro shown once per user explaining what Moxy can do, with example questions to tap.

## Explicitly out of scope for MVP (candidates for later phases)

- Multi-campus support (only Hyderabad data at launch; architecture should not block adding more campuses later).
- Login/authenticated student accounts, real-time timetable/attendance lookup.
- Payment processing (Moxy explains the process and links to eCHAT; it does not collect payments itself).
- Voice interface.
- Multilingual support beyond English (Telugu/Hindi could be a fast-follow given the Hyderabad audience).
- WhatsApp-native bot (v1 is a web app that can *link out* to IIHM's existing WhatsApp; a native WhatsApp bot is a later integration).

## Success criteria for MVP

- A first-time user can complete the onboarding tutorial in under 30 seconds.
- Moxy correctly answers the core intents above using only the verified `data.md` knowledge base — no hallucinated fees, dates, or seat numbers.
- Any question outside the knowledge base gets a clear "I don't have that yet, here's who to contact" response, not a made-up answer.
- The whole experience works cleanly on a small phone screen (360–400px wide) without horizontal scrolling or cramped tap targets.
