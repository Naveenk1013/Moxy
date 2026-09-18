# Moxy Concierge — Security Architecture & Anti-Abuse Specification

## 1. Overview & Threat Model

Moxy connects to several production API services (Anthropic Claude Haiku 4.5, RapidAPI Indian Railways, Aviationstack Flights, Google Maps Routes). Without strict protection, public endpoints can be vulnerable to:
1. **API Quota & Budget Exhaustion**: Automated loops or scrapers making hundreds of calls/minute, depleting paid quotas.
2. **Denial of Service (DoS)**: High-concurrency requests tying up Netlify serverless execution limits.
3. **Prompt Injection & Model Manipulation**: Malicious actors sending oversized payloads or adversarial instructions to bypass safety guidelines.
4. **Scraping & Unauthorized Embedding**: Third-party websites embedding Moxy's `/api/chat` function into their own domains.
5. **Credential Exfiltration**: Leaking private API keys to the browser or in client-side bundles.

---

## 2. Multi-Layer Defense Architecture

```
[ User / Client Browser ]
           │
           ▼
[ Layer 1: Origin & CORS Gatekeeper ]  ───> Rejects non-whitelisted domains / direct curl
           │
           ▼
[ Layer 2: Client Fingerprinting & Rate Limiting ] ───> Sliding-window IP/Token bucket limit
           │
           ▼
[ Layer 3: Input Sanitization & Payload Guard ]   ───> Enforces max characters (500 chars), history limits
           │
           ▼
[ Layer 4: Caching & Circuit Breaker Layer ]       ───> Returns cached results (trains/weather/places)
           │
           ▼
[ Layer 5: Upstream API Orchestration ]           ───> Claude Haiku 4.5 + RapidAPI + Google Maps
```

---

## 3. Specific Security Controls

### A. Strict CORS & Origin Lockdown
- Restrict `Access-Control-Allow-Origin` strictly to your production domain (e.g., `https://moxy.iihm.ac.in` or `https://your-site.netlify.app`) and `http://localhost:5173` in development.
- Reject requests with missing or disallowed `Origin` or `Referer` headers when called from external automation tools.

### B. Sliding-Window Rate Limiting (Serverless Layer)
- **Per-IP Limits**:
  - Max **10 requests per minute** per IP.
  - Max **60 requests per hour** per IP.
- **Headers Returned**:
  - `X-RateLimit-Limit`: Maximum allowed requests in window.
  - `X-RateLimit-Remaining`: Remaining request quota.
  - `X-RateLimit-Reset`: Unix epoch timestamp when quota resets.
- **HTTP 429 Response**: Returns `{ error: "Rate limit exceeded. Please wait a moment before sending another request." }` with a `Retry-After` header.
- **Storage Strategy**:
  - *Option 1 (Zero-dependency / Memory)*: In-memory LRU map inside `netlify/functions/chat.js` for ephemeral warm-instance throttling.
  - *Option 2 (Production Persistent)*: **Upstash Redis** (REST API) or **Netlify Blobs** for multi-region synchronized rate tracking across serverless cold starts.

### C. Request Payload Constraints
- **Message Content**: Max **500 characters** per user message (blocks large token injection payloads).
- **History Depth**: Only send the last **6 conversation turns** (3 user + 3 assistant) to Claude, preventing unbounded context window inflation.
- **Input Type Enforcement**: Validate that `messages` is an array of `{ role, content }` objects; reject malformed JSON.

### D. Client-Side Debouncing & Spam Mitigation
- Disable input field and send button immediately upon submission (`isLoading === true`).
- Enforce a minimum **1.5-second cooldown** between consecutive user prompts.
- Rapid duplicate message detection (prevent rapid double-clicks from triggering redundant API requests).

### E. Telemetry & Response Caching (Cost Reduction)
- Static & semi-static queries (e.g., City weather for the day, station timetable, place guides) cached for **5 to 15 minutes**.
- If multiple users ask for the weather in Hyderabad or Train 22960 within 10 minutes, serve cached data without consuming external API credits.

### F. Optional Bot Challenge (Cloudflare Turnstile)
- Lightweight, zero-friction invisible Turnstile widget on the client side.
- Frontend submits a verification token with each chat turn.
- Netlify Function verifies token with Cloudflare before invoking Anthropic or RapidAPI.

---

## 4. Environment Secrets Safeguards

- Private keys (`ANTHROPIC_API_KEY`, `RAPIDAPI_KEY`, `GOOGLE_MAPS_API_KEY`, `AVIATIONSTACK_API_KEY`) must **NEVER** have the `VITE_` prefix for production client exposure.
- All external API orchestration runs strictly within Netlify serverless functions (`netlify/functions/chat.js`), keeping credentials confidential.
- `.env` remains permanently tracked in [`.gitignore`](file:///c:/Users/NAVEEN/Desktop/Lancealot/Moxy/.gitignore).

---

## 5. Implementation Checklist

- [ ] **Phase 1: Serverless Rate Limiter**
  - Implement sliding-window rate limiting in `netlify/functions/chat.js`.
  - Add client IP extraction (`client-ip`, `x-forwarded-for`, `x-nf-client-connection-ip`).
  - Return proper `429 Too Many Requests` responses with `Retry-After`.

- [ ] **Phase 2: Payload Guardrails**
  - Add request body schema validation.
  - Enforce 500-character input caps and history truncation.

- [ ] **Phase 3: CORS & Header Hardening**
  - Restrict CORS headers to verified production and local dev origins.
  - Add security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`).

- [ ] **Phase 4: Telemetry Caching**
  - Add short-term in-memory cache for external railway and weather tool responses.

- [ ] **Phase 5: Client Cooldown & Spam Protection**
  - Add UI debounce timer and visual feedback when rate limited.
