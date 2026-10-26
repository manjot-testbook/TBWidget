# Testbook Widget

PRD and interactive design spec for the Testbook Android home-screen widget.

**Live design:** https://manjot-testbook.github.io/TBWidget/
**PRD:** [PRD.md](PRD.md)
**Screen catalogue:** https://manjot-testbook.github.io/TBAppScreens/

---

## What this is

A widget that turns Testbook from an app you open into a habit you keep.

- **Weekly hero:** `3/5 tests this week`
- **Daily subline:** `🔥 Day 6`
- **One AI line:** a specific, diagnostic next step
- **One tap:** into the next test, weak area, or in-progress attempt

The design page contains:

- 4×2 and 2×2 widget mockups
- Eleven live widget states (never started, active, at risk, badge, missed, lapsed, exam week, resume, stale, pass expired, logged out)
- Install bottom sheet and app-shortcut mockups
- Daily Brief notification and Android 16 Live Update
- Snapshot contract, refresh architecture, deep links
- Install funnel, metrics, and 8-week roadmap

## Repo structure

```text
TBWidget/
├── PRD.md              # Product requirements, analytics, data contract
├── README.md
└── docs/
    ├── index.html      # Interactive design gallery
    ├── styles.css      # Design system + page styles
    ├── app.js          # State gallery interactions
    └── .nojekyll       # GitHub Pages
```

## Run locally

```bash
python3 -m http.server 8080 --directory docs
# open http://localhost:8080
```

## Deploy

GitHub Pages serves the `main` branch from `/docs`.

```bash
git add .
git commit -m "feat: widget PRD and design gallery"
git push origin main
```

## Key decisions

1. **Weekly hero + daily subline.** Weekly tests match the existing Toppers Streak; daily streak is a new server-side service.
2. **Habit / streak is the primary job.** Score and Pass are secondary.
3. **Companion Daily Brief notification.** The widget is silent; sound and haptics live in an opt-in notification.
4. **App shortcuts ship first.** Zero install friction, one week of work, early signal on which entry point users choose.

## Platform reality

Android widgets cannot play audio, cannot vibrate on update, cannot animate continuously, and cannot live on the lock screen. The PRD treats those as constraints, not bugs: the widget is the billboard, the Daily Brief is the tap on the shoulder, and Android 16 Live Updates cover the evening window.

## Status

Draft v1.0 — October 2026. Awaiting sign-off on the daily-streak definition before engineering starts.
