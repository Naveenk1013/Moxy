# Moxy — IIHM Virtual Concierge

Moxy is a mobile-first web chatbot that acts as a 24/7 virtual concierge for IIHM (starting with the **Hyderabad campus**). It answers questions about admissions, courses, campus life, placements, and day-to-day student/visitor queries — the same way a knowledgeable front-desk officer would, but always available.

## What Moxy is for

- **Prospective students & parents** — courses, eligibility, fees process, admission steps, eCHAT dates, campus facilities.
- **Current students** — timetables/notices (where available), FAQs about processes (ID cards, grievance redressal, etc.), campus navigation.
- **Visitors / recruiters / partners** — general info, contact routing, directions.

Moxy is a **concierge**, not a replacement for the admissions office. When it doesn't know something (fees, hostel seats, exact dates), it says so plainly and routes the person to a human — see `data.md` §9.

## Project documents

| File | What it covers |
|---|---|
| `readme.md` | This file — project overview and doc index |
| `mvp.md` | What ships in v1 vs. later phases; core user intents |
| `design.md` | UX/UI, mobile-first layout, Moxy's persona & conversation style, first-time-user tutorial |
| `architecture.md` | System design — frontend, backend, LLM layer, data/knowledge base, hosting, integrations |
| `data.md` | The scraped/compiled IIHM knowledge base that powers Moxy's answers |
| `instructions.md` | How to set up, run, and develop the project locally |
| `progress.md` | Living status tracker — phases, what's done, what's next |

## Quick facts about this build

- **Platform:** Web app, **mobile-first** responsive design (works fine on desktop, but every design decision starts from a phone screen).
- **Primary campus for v1:** IIHM Hyderabad (Naveen's home campus) — architecture is built so other campuses can be added later without a rewrite.
- **Core interaction:** Chat interface, powered by an LLM grounded in `data.md`'s knowledge base (retrieval, not free-form guessing).
- **Must-have for launch:** a first-time-user tutorial/onboarding flow so new visitors immediately understand what Moxy can and can't do.

## 🚀 Deployment to GitHub & Netlify

### 1. Push to GitHub
Make sure your secret `.env` file is NOT committed (it is already included in `.gitignore`):
```bash
git init
git add .
git commit -m "feat: Moxy AI Concierge with Dark Mode, Voice, WhatsApp Share & Live IRCTC Telemetry"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### 2. Deploy on Netlify
1. Log in to [Netlify](https://app.netlify.com/) and click **"Add new site" ➔ "Import an existing project"**.
2. Select **GitHub** and authorize your repository.
3. Build Settings (auto-detected via `netlify.toml`):
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
   - **Functions Directory:** `netlify/functions`
4. Add the following **Environment Variables** in Netlify Dashboard under **Site configuration ➔ Environment variables**:
   - `ANTHROPIC_API_KEY`: Your Anthropic API Key (`sk-ant-...`)
   - `ANTHROPIC_MODEL`: `claude-haiku-4-5-20251001`
   - `RAPIDAPI_KEY`: Your RapidAPI Key for IRCTC live PNR & train telemetry
   - `AVIATIONSTACK_API_KEY`: Your Aviationstack API Key for flight tracking
   - `GOOGLE_MAPS_API_KEY`: Your Google Maps Platform Key for routes & distance
5. Click **"Deploy site"**. Your Moxy Virtual Concierge will be live globally with automated CI/CD!

---

## 🌟 Key Features
- **Luxury Concierge UI**: Frosted sapphire glass, gold accents, floating input capsule, and responsive mobile-first shell.
- **🌙 Luxury Dark Mode**: 1-Tap sun/moon toggle persisted via `localStorage` with deep midnight sapphire surfaces.
- **💬 1-Tap WhatsApp Sharing**: Share any concierge briefing, PNR status, itinerary pass, SOS helplines, or metro route directly to WhatsApp with clean emojis and formatting.
- **🎙️ Voice Concierge**: Speech-to-Text microphone input + Web Speech API audio readout (`🔊 Listen` / `⏹️ Stop`).
- **🚆 Live IRCTC Telemetry**: Real-time 10-digit PNR seat allocations and live train GPS delay tracking with zero data fabrication.
- **🚇 Hyderabad Metro Guide**: Red, Blue, Green line transit calculations, interchange hubs, and station stop lists.
- **🚨 Tourist Emergency SOS Hub**: 1-Tap direct-dial helplines (`112`, `139`, `108`, `1363`, `1091`) and nearby 24/7 hospitals.
- **🍱 Food on Track**: Station platform culinary radar with must-try regional delicacies and IRCTC eCatering instructions.
- **💨 FX Converter & Bill Splitter**: Live currency conversion (USD, EUR, GBP, AED, SAR, SGD, JPY to INR) and group dining cost splitter.
- **🖨️ Offline Itinerary Pass**: Print & PDF export mode for travel itineraries.
