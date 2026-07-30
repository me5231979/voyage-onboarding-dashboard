# Voyage — Vanderbilt Staff Onboarding Dashboard

A personalized, location- and role-aware onboarding experience for Vanderbilt staff, built in the Futures Learning Hub visual identity (black / white / flat gold — engraved, not bubbly) to match the [Vanderbilt Learning Series Course Library](https://me5231979.github.io/Course_Library/).

## The experience

1. **Welcome (Day 0)** — a hero video montage of people working together across campus and office settings (generated with Higgsfield), plus an identity card pre-populated from Oracle HCM. Nothing kills momentum like retyping data HR already has.
2. **Three-question personalization gate** — Location → Job family → Role, one screen each with progress dots. The job-family step searches Vanderbilt's real Skills-Based Job Architecture (18 families, 95 sub-families from SBJA), and picking a sub-family surfaces the skills that matter there. Selections drive parking vendor, safety contacts, state compliance tracks (CA gets the 2-hour harassment module, TN gets 1 hour), benefits nuances, and role depth (managers, clinical, research, faculty, student-facing).
3. **Live dashboard (Days 1–30)** — three swim lanes (Before Day 1 / Week 1 / Weeks 2–4), six priority tiles with Safety & Compliance carrying the red "Deadlines" accent, a real-time progress ring, benefits-window countdown, "Up next" logic (hard dates first, prerequisites respected), people-to-meet cards with Outlook-style intro scheduling, and announcements.
4. **Returning-learner view (Day 31+)** — universal search with rotating placeholder hints, "Pick up where you left off," role/department-tuned shelf, color-coded renewals calendar (green >60 / amber 30–60 / red <30 days), Explore Vanderbilt shelf, quick-action rails, and personal history.

## Compliance, from the matrix

The compliance path is generated from the Compliance Training Matrix (Master Matrix tab): one card per Course × State × Tier row, each deep-linked to the matching active course in Oracle Learn. Every requirement carries its legal basis (LEGAL with statutory citation, or ADVISORY policy), completion window, cadence, and worksite-trigger caveats (NY Retail Worker Safety, FL lodging human trafficking). A Compliance Center table on the dashboard shows the signed-in person exactly what their state and role tier require. The Day 31+ search also queries the full 44,000-course active catalog (lazy-loaded index) with Oracle Learn deep links.

## Click-based completion capture

Every card's primary CTA is the tracked completion signal. Clicks flip the status pill instantly ("Not started" → "Opened" → "Complete"). Items backed by an API source (Oracle Learn, Oracle HCM, Culture Amp, Vector Solutions) upgrade to **✓ Verified** — here simulated with a short delay standing in for the nightly reconciliation job. Click events are logged (`user, item, timestamp`) into `localStorage`, feeding the recently-viewed and completed rails. Confetti fires only for completions over 30 minutes, and `prefers-reduced-motion` kills it (and the hero video).

## Stack

Zero-dependency static site: hand-written HTML/CSS/JS, self-hosted fonts (Libre Caslon Display, Inter, Antonio), official VU lockups. All state in `localStorage`. Deployable on GitHub Pages via the included workflow.

- `index.html` — all four views (welcome, gate, dashboard, returning)
- `assets/css/styles.css` — shared FLH design system (same as Course Library)
- `assets/css/voyage.css` — dashboard-specific components
- `assets/js/data.js` — the personalization catalog (audience rules per item) plus the 12-program FLH portfolio (CHART, Leadership Redefined, Manager Voyage, SPEAK, Anchors Edge, Talent Marketplace, VAULT, Summit, Navigators Session, Compliance, Cohort Certification, Coaching)
- `assets/js/sbja.js` — generated from the SBJA workbook: family → sub-family architecture and per-sub-family skills
- `assets/js/app.js` — router, gate, renderers, click tracking, search
- `assets/video/hero-montage.mp4` — Higgsfield-generated hero montage (fetched by the `fetch-hero` workflow)

## Deploy

Enable **Settings → Pages → Source: GitHub Actions** and the `pages.yml` workflow publishes on every push to `main`.

This is a front-end prototype: source-system deep links point at public Vanderbilt pages, and Oracle HCM identity, department stats, and the nightly completion sync are simulated in `data.js`/`app.js` where the real integrations (REST pull at login, xAPI completion, Graph API invites) would attach.
