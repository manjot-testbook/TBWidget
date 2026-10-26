# Testbook Home Screen Widget — PRD

| | |
|---|---|
| **Status** | Draft for design review |
| **Version** | 1.0 |
| **Date** | 26 October 2026 |
| **Owner** | Product — Manjot |
| **App version** | 9.11.x |
| **Platform** | Android (`minSdk 23`, `targetSdk 36`) |
| **Surfaces** | Home screen widget, app shortcuts, Daily Brief notification, Android 16 Live Update |

---

## 1. TL;DR

Testbook has 94 screens and 12 product flows, but **zero presence on the Android home screen**. The widget is not another dashboard. It is a daily commitment contract:

- **Weekly hero:** `3/5 tests this week` — the exam-specific goal.
- **Daily subline:** `🔥 Day 6` — the habit loop.
- **One AI line:** a specific, diagnostic next step.
- **One tap:** into the next test, weak area, or in-progress attempt.

**V1 ships:** a 4×2 and 2×2 Streak widget, a daily-study-streak service, an install bottom sheet, app shortcuts, a companion Daily Brief notification, and full OS-surface analytics.

**V1 does not ship:** a lock-screen widget, audio from the widget itself, a 4×4 analytics grid, or a new monetisation surface.

---

## 2. Why now

1. **Push and WhatsApp are rented channels.** They are noisy, permission-gated, and easy to ignore. The home screen is owned by the user and always visible.
2. **The funnel is too long.** A cold user needs roughly six transitions to start a test: Home → Tests → Test Series → Exam Level Modal → Section List → Pre-Instructions → Start. A widget reduces the first four to one tap.
3. **The streak already exists.** `TestSeriesService.getTestSubmissionsStreak()` returns the weekly attempt count, day-by-day timeline, current/next badge, and the next test action. Roughly 80% of the widget's data is already available.
4. **The audience is habit-shaped.** Government-exam aspirants study in daily slices. A weekly goal plus a daily streak fits the behaviour better than another feed.
5. **The platform is ready.** The app already targets Android 16 (`targetSdk 36`), uses Compose, WorkManager, and FCM, and has a deep-link router. The missing pieces are Glance, an AppWidgetProvider, and a daily-streak aggregate.
6. **Widget installers are a high-intent segment.** They are telling you they want Testbook in their daily field of view. That is a useful cohort for Pass experiments, not a vanity metric.

---

## 3. Problem statement

> The app is opened with intent, but not with habit. Users do not know what the smallest useful next action is, and their progress is buried inside the Tests tab and Test Analysis. Re-engagement depends on notifications the user can mute, while the home screen — the one surface they see dozens of times a day — says nothing about their preparation.

### What the user feels

- “I don't know what to do today.”
- “I'll open it when I have time for a full mock.”
- “I don't want to see a low score right now.”
- “I forgot I had a streak.”
- “Is my Pass still active?”

### What the business feels

- Push CTR decays as volume rises.
- WhatsApp is effective but operationally expensive and outside the product.
- The funnel from app open to test start leaks at the test-series picker.
- Pass renewal is a last-minute, in-app-only conversation.

---

## 4. Goals and non-goals

### Goals

| ID | Goal | Primary metric |
|---|---|---|
| G1 | Increase test starts from outside the app | Widget-attributed test starts / weekly active widget user |
| G2 | Improve retention for the prompted cohort | D7 and D30 retention lift vs prompt holdout |
| G3 | Make progress visible without opening the app | Weekly active widget rate among pinned users |
| G4 | Establish OS-surface measurement | Install funnel, update freshness, tap-through, attribution coverage |
| G5 | Create a high-intent cohort for Pass | Pass conversion lift among expired widget users (guardrail: trust) |

### Non-goals

- Replace push or WhatsApp. The widget is pull, not push.
- Build a full analytics dashboard on the home screen.
- Ship a lock-screen widget. Android has no general third-party lock-screen widget API.
- Play audio or vibrate from the widget itself. The platform does not support it.
- Invent a second streak definition that conflicts with the Tests tab.
- Monetise anxiety with fake countdowns or invented deadlines.

---

## 5. Users and segments

| Segment | State | What they need from the widget |
|---|---|---|
| **New user** | 0–2 tests | A first step, not a zero-state lecture: “First mock = first data point.” |
| **Active streaker** | Studied today | Confirmation and momentum: “Day 6. Streak secured.” |
| **At risk** | No study today, streak > 0 | A tiny action before midnight: “5 min enough?” |
| **Lapsed** | 7+ days inactive | A shame-free restart: “One sectional restarts it.” |
| **Exam week** | Exam within 7 days | Countdown and the last high-value mock. |
| **In progress** | Test started, not submitted | Resume, with question number and time left. |
| **Pass expired** | No active Pass | A value-framed renewal, capped and live-priced. |
| **Super user** | Super Pass active | Course/streak consistency; do not pitch Pass. |
| **Logged out** | No session | A one-line sign-in prompt; no stale personal data. |

### Primary persona

**Riya, 24, SSC CGL aspirant, Tier-2 city, 4 GB Android phone.** Studies 60–90 minutes on weekdays, 3–4 hours on Sundays. Uses YouTube and Telegram for concepts, Testbook for mocks. Opens the app 3–4 times a week, usually with a specific test in mind. Wants to feel consistent but does not want another app nagging her.

### Secondary persona

**Arjun, 27, Railway aspirant, working full-time.** Studies at 10 PM. Needs a 10-minute action, not a 2-hour plan. A widget that says “20 Qs · 3 min” is more useful than a feed.

---

## 6. Product principles

1. **Glance, not browse.** If it needs a scroll, it belongs in the app.
2. **One hero, one action.** One number, one CTA. Never two competing buttons.
3. **Diagnostic, not cheerleading.** “Algebra 42% — 10 Qs” beats “You've got this!”
4. **Silent by default.** Sound and haptics are opt-in and live in the notification, not the widget.
5. **Never fake urgency or price.** Live data only. A ₹499 line must match checkout.
6. **One source of truth.** The widget and the Tests tab must never disagree.
7. **Privacy is a feature.** Users can hide score and accuracy from the widget.
8. **Earn the home screen.** The install prompt must appear at a moment of pride or intent, not on cold launch.

---

## 7. What exists today

### 7.1 In the app

| Asset | Where | What it gives us |
|---|---|---|
| Toppers Streak API | `repo-module/.../TestSeriesService.kt:240` — `getTestSubmissionsStreak()` | Weekly attempt count, day timeline, current/next badge, next test action |
| Toppers Streak helper | `models-module/.../ToppersStreakHelper.kt` | Maps API → widget model; already handles states and badge progress |
| Toppers Streak visual | `legacy/.../composables/ToppersStreakWidget.kt` | In-app card; weekly pills, badge, share CTA |
| Test analysis | `MiniAnalysis.accuracy`, `Analysis.accuracy/percentile/rank` | Last-test proof |
| Test series stats | `StudentStats.testsAttempted` | Per-series attempts |
| Attempted tests | `StudentService.getAttemptedTests()` | Cross-exam history |
| Pass state | Pass module + live price API | Renewal strip |
| Deep links | `AppDeepLinkRouter` | Test, analysis, pass, practice, daily quiz, exam page |
| FCM | `notifications-module/.../TbFCMService.kt` | Silent widget refresh |
| WorkManager | `base-ui-module`, `libs-module` | Periodic refresh |
| Compose | App-wide | Glance fits the codebase |

> **Naming note:** the code calls the in-app card `ToppersStreakWidget`, but it is a RecyclerView/Compose card inside the Tests tab. It is not an Android home-screen widget. Do not let the team confuse the two.

### 7.2 What is missing

| Gap | Impact | Mitigation |
|---|---|---|
| No `AppWidgetProvider`, no Glance dependency | Cannot ship a home-screen widget | Add `widget-module` with Glance |
| No universal daily streak | “Day 6” cannot be derived for all users | Build the daily-streak service (Section 9) |
| No global accuracy/tests aggregate | The report widget needs a rollup | Snapshot endpoint computes it |
| No `shortcuts.xml` | No long-press entry points | Add static + dynamic shortcuts |
| No widget analytics | Cannot measure installs or taps | Add `widget_*` event namespace |
| Price varies by surface | A hardcoded ₹499 would be wrong | Always use the live price payload |

### 7.3 Platform constraints

| Constraint | Reality | Product decision |
|---|---|---|
| Audio | Widgets cannot play sound | Move audio to Daily Brief / in-app TTS |
| Haptics | Updates cannot vibrate | Haptic on the notification, not the update |
| Animation | Glance has no continuous animation | Four static flame states |
| Refresh | `updatePeriodMillis` minimum is 30 min; Doze delays workers | FCM + 4×/day WorkManager + on-open refresh |
| Lock screen | No general third-party widget API | Android 16 Live Update for the evening window |
| Impressions | Launcher does not report widget visibility | Measure installs, updates, taps; never claim views |

---

## 8. Solution

### 8.1 Product thesis

A widget is **pull, not push**. It does not bring the user back the way a notification does. It does three quieter jobs:

1. **Contract** — make the weekly goal and daily streak visible enough that breaking them feels real.
2. **Proof** — show that the last mock moved the needle.
3. **Next step** — remove the “what should I do now?” decision.

The north star is **weekly active widget users who start a test** — not installs.

### 8.2 Widget family

| Widget | Size | Content | Tap target | Release |
|---|---|---|---|---|
| **Streak** | 4×2 | Weekly hero, daily streak, day pills, AI line, CTA | Next test / save streak | V1 |
| **Streak** | 2×2 | Weekly number + daily streak + 7 dots | Tests dashboard | V1 |
| **Report** | 4×2 | Last score, accuracy ring, delta, rank | Test analysis | V1.1 |
| **Report** | 2×2 | Accuracy ring + delta | Test analysis | V1.1 |
| **Countdown** | 2×2 | Exam name, days left, today's target | Exam page | V1.1 |
| **Stats** | 4×4 | Streak + three stat tiles + AI line | Tests dashboard | V2, only if data supports it |

**Launch decision:** 2×2 and 4×2 Streak only. The report widget is the second act.

### 8.3 Content hierarchy

| Layer | Content | Why |
|---|---|---|
| Hero | `3/5 tests this week` | Exam-specific goal; matches the Tests tab |
| Subline | `🔥 Day 6` | Habit loop; the emotional hook |
| Pills | 7 study-day states | Momentum without a chart |
| Nudge | One AI micro-coach line | Specific, diagnostic, personal |
| Action | One CTA | Removes decision fatigue |
| Context | Exam countdown (optional) | Real urgency |
| Monetisation | Pass strip (expired only) | Value framing, capped |

### 8.4 Layouts

**4×2 (primary)**

```text
┌──────────────────────────────────────────┐
│  THIS WEEK                  🔥 Day 6     │
│  ◯ 3/5 tests                streak alive │
│                                          │
│  M   T   W   T   F   S   S               │
│  ✓   ✓   ✓   ✓   ○   ○   ○               │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ "Algebra 42% — 10 Qs"  Start  (→)  │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

**2×2 (glance)**

```text
┌───────────────────┐
│ THIS WEEK         │
│ 3/5               │
│ tests             │
│ 🔥 Day 6          │
│ ● ● ● ● ○ ○ ○     │
└───────────────────┘
```

**Hierarchy rule:** if a test is in progress, the widget switches to `Resume Q34/100 · 12 min left` and suppresses the streak. Highest intent wins.

### 8.5 State machine

| State | Trigger | Copy | CTA |
|---|---|---|---|
| `NEVER_STARTED` | 0 tests, no streak | “Your first mock is day 1.” | Start 10-min test |
| `ACTIVE_TODAY` | Studied today | “Day 6. Streak secured.” | Practice 10 Qs |
| `AT_RISK` | No study today, after 6 PM, streak > 0 | “Streak resets at midnight.” | Save streak · 5 Qs |
| `BADGE_UNLOCKED` | Current badge earned | “Top 100 consistency unlocked.” | Share / attempt next |
| `MISSED` | Yesterday missed | “Streak reset. One test restarts it.” | Start again |
| `EXAM_WEEK` | Exam ≤ 7 days | “SSC CGL Tier 1 in 3 days.” | Full mock |
| `LAPSED` | 7+ days inactive | “Break's over. One sectional restarts it.” | Easy test |
| `IN_PROGRESS` | Attempt started, not submitted | “Resume Q34/100 · 12 min left.” | Resume test |
| `STALE` | Data older than 6h | Last known data + “Updated 3h ago” | Open app |
| `LOGGED_OUT` | No session | “Sign in to see your streak.” | Login |
| `PASS_EXPIRED` | No active Pass, eligible for renewal | “Pass ended. Renew at ₹499.” | Renew Pass |

Eleven states total; the widget renders one at a time.

**Time rules:** morning = today's target; afternoon = progress; evening = at-risk only if not done; night = recap, no red state. Derive the state at render time so midnight rollover works even if WorkManager is delayed.

---

## 9. Daily streak service

### 9.1 Why this is needed

The existing Toppers Streak is **weekly test attempts**. It cannot produce a truthful “Day 6” for all users. The only live daily streak today is `UserSuperStats.currentStreak`, which is Super-only. The old `StudentStreaks` model is unused.

### 9.2 Definition

A user earns a **study day** when any of the following happens:

| Counts as a study day | Does not count |
|---|---|
| Test submitted | Opening the app |
| Quiz attempted | Tapping a push or widget |
| ≥10 practice questions answered | Browsing the store |
| ≥1 notes chapter read with dwell time | Watching a marketing video |
| ≥50% of a live class attended | Passive screen time |

### 9.3 Rules

- Server-authoritative; IST midnight cutoff for Indian users.
- `last_active_date == yesterday` → increment.
- `last_active_date == today` → unchanged.
- Older than yesterday → reset to 1 on the next qualifying action.
- Preserve `longest_streak`.
- Allow a **48-hour late-event grace** for offline events; late events can repair a streak.
- No streak freeze in V1. Later, a Pass perk (2 per month), not an anxiety purchase.
- The client can show an optimistic “today counted” state but must reconcile with the server.

### 9.4 API addition

```json
"daily_streak": {
  "days": 6,
  "state": "ACTIVE_TODAY | AT_RISK | MISSED | NEVER_STARTED",
  "last_active_date": "2026-10-26",
  "longest": 21
}
```

### 9.5 Rollout and fallback

- Build the service in parallel with the widget.
- The widget layout always reserves the daily slot.
- If `daily_streak` is `null`, fall back to `Next mock: Sunday` or hide the slot.
- Enable the subline server-side per cohort; no app release needed.
- Data quality gate: 7 days of backfill validation before enabling at 100%.

---

## 10. AI micro-coach

### 10.1 Positioning

Do not label it “AI” in the widget. Call it **“Aaj ka focus”** or **“Today's focus.”** The output must feel personal and specific, not generative.

### 10.2 Inputs

- Streak state and days.
- Last test score, accuracy, percentile, delta.
- Weakest topic and accuracy.
- Exam name and days left.
- Study actions completed today.
- Pass state (for the eligible strip).
- App language and time of day.

### 10.3 Output

One line, maximum 64 characters, one of three intents: **nudge**, **diagnose**, or **celebrate**.

| Situation | Line |
|---|---|
| New user | “First mock = first data point. 10 min?” |
| Low score | “142/200. 8 marks below last. Algebra is the leak.” |
| High score | “168/200 — your best yet. Next target: 175.” |
| At risk | “5 min bhi chalega. Streak bach jayega.” |
| Weak area | “Algebra 42%. 10 questions, 4 minutes.” |
| Pass expired | “Pass ended. Your streak and reattempts go with it.” |

### 10.4 Guardrails

- No guaranteed rank or selection claims.
- No “you will fail”, shaming, or fear-based copy.
- No unverified cutoff or exam-date claims.
- No medical or mental-health claims.
- Max 64 characters; localise into the 7 supported app languages.
- Server-generated and cached for 24 hours; template fallback if generation fails.
- Every message carries an `ai_message_id` for attribution and kill-switching.
- Human review of the first 200 messages per locale.

### 10.5 Generation

Batch-generate once per user per day (early morning), not on every widget update. Use deterministic templates for the first release; add model-generated variants only after the template baseline is measured. This keeps latency, cost, and tone predictable.

---

## 11. Install strategy

### 11.1 The real bottleneck

Most users never add a widget. The install moment is the product; the widget is the easy part.

### 11.2 Placements

| Priority | Placement | Trigger | Copy |
|---|---|---|---|
| 1 | Test Analysis | First test submitted (peak pride) | “Keep this streak on your home screen.” |
| 2 | Badge unlock | Toppers Streak badge earned | “Your badge, one tap from your home screen.” |
| 3 | Tests dashboard | Overflow on the streak card | “Add the Testbook widget.” |
| 4 | Settings | “Home screen widget” row | “See your streak without opening the app.” |
| 5 | Pass page | Expired user, eligible | “Your Pass status, at a glance.” |

### 11.3 Prompt design

- Live preview of the actual widget, not a static illustration.
- Two actions only: **Add widget** / **Not now**.
- After “Not now”: suppress for 14 days, maximum 3 lifetime prompts.
- Use `AppWidgetManager.requestPinAppWidget()` on Android 8+.
- If pinning is unsupported, show a 3-step illustrated guide (Philips Hue / Duolingo pattern).
- Encourage the user to place it on the first home-screen page; do not promise placement.

### 11.4 App shortcuts first

There is no `shortcuts.xml` today. Ship these in Week 1:

- **Static:** “Attempt today's test”, “Weak areas”, “Pass”.
- **Dynamic:** “Resume test · Q34/100” when an attempt is in progress.

This delivers most of the “one click from outside the app” value with zero install friction, and gives early signal on which entry point users choose.

---

## 12. Daily Brief and Live Update

### 12.1 Why

The widget is silent by platform design. Sound and haptics belong in a notification the user opts into.

### 12.2 Daily Brief

- **Channel:** “Study reminders”, user-visible.
- **Default time:** 7:30 PM local.
- **Trigger:** no study action today and streak > 0.
- **Copy:** “🔥 Day 6 is on the line. 5 min enough?” / “Aaj 5 min? Streak bach jayega.”
- **Deep link:** next test or daily quiz.
- **Caps:** 1/day, 5/week; no 10 PM–7 AM.
- **Pass line:** maximum 1/week, expired users only, live price only.
- **Suppression:** cancel if the user studies before the scheduled time.

### 12.3 Android 16 Live Update

- 9 PM–midnight “streak at risk” promoted ongoing notification.
- `Notification.ProgressStyle` with progress to midnight.
- Request `canPostPromotedNotifications()`; fall back to a normal notification.
- Tap → save streak.
- This is the closest legal equivalent to a lock-screen widget, and the right place for the haptic.

### 12.4 What we will not do

- No audio from the widget.
- No vibration on widget data updates.
- No custom sound that ignores silent mode.
- No Pass audio on every notification.

---

## 13. Design

### 13.1 References

| Reference | What to take |
|---|---|
| [Duolingo streak widget](https://mobbin.com/screens/11243abc-d521-46f0-ba2b-871bd71551d9) | Two sizes, streak + character, install tutorial |
| [pushr](https://mobbin.com/screens/bd1913f9-cb73-4126-9c41-fb92dfe61b97) | Clean “this week” pill row |
| [Strava](https://mobbin.com/screens/1c996718-ab94-4247-85b3-80885bab44c9) | Weekly streak + goal ring |
| [Mimo](https://mobbin.com/screens/f5333bf0-bc83-4ccc-aa63-615816678920) | Learning streak + mascot |
| [Alma](https://mobbin.com/screens/fe23c4a3-b043-432c-aa9f-9bb4db519889) | “Streak secured” confirmation |
| [Ladder](https://mobbin.com/screens/9d8a6a03-dffd-4f6a-b05b-565a4543c265) | “You've unlocked the widget” framing |
| [Liven](https://mobbin.com/screens/0dea0bc7-d875-469c-aae1-aa0216855133) | “Keep your streak on track” + Add widget |
| [Speak](https://mobbin.com/screens/17284763-b897-42fc-8570-5191e5edaabb) | Progress-from-home-screen prompt |
| [Deepstash](https://mobbin.com/screens/a9dee944-e751-4b82-ab90-470dc9fb24d0) | Streak + Read CTA |

### 13.2 Visual specification

- 24–28dp corner radius; full-bleed gradient; no chrome, no carousel.
- One dominant number; one 7-day pill row; one CTA.
- The CTA is a full-width white action bar: AI line on the left, a short action label, and a blue circular arrow. It must read as a button, not a chip.
- Flame/character with four expressions: dim, lit, bright, out.
- Micro Testbook mark in the top-right only.
- Light, dark, and Material You variants.
- Typography: bold display number, 11–13sp labels; no font below 10sp.
- Contrast: WCAG AA for text on gradients.
- Accessibility: TalkBack labels for every state, 48dp tap targets, no colour-only meaning.

### 13.3 State colours

| State | Gradient | Accent |
|---|---|---|
| Active | Blue `#2563EB → #3B82F6` | White |
| At risk | Maroon `#7F1D1D → #DC2626` | Amber `#FBBF24` |
| Badge | Amber `#B45309 → #F59E0B` | White |
| Missed | Slate `#334155 → #475569` | Soft white |
| Exam week | Indigo `#3730A3 → #4F46E5` | White |
| Resume | Teal `#0F766E → #14B8A6` | White |
| Pass expired | Pink `#9D174D → #E8325A` | White |

---

## 14. Functional requirements

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| FR-1 | Ship a 4×2 Streak widget | P0 | Renders on Android 8+; updates from cache immediately |
| FR-2 | Ship a 2×2 Streak widget | P0 | Same data, compact layout, no truncation at 1.3× font scale |
| FR-3 | Show weekly Toppers Streak as the hero | P0 | `3/5 tests this week` matches the Tests tab |
| FR-4 | Show daily streak as the subline | P0 | `🔥 Day 6`; hides gracefully if the API is null |
| FR-5 | Render 7-day pills | P0 | States: attempted, today, missed, upcoming |
| FR-6 | Show one AI line | P1 | ≤64 chars, localised, server-driven, fallback template |
| FR-7 | One-tap CTA | P0 | Opens the next test, resume, weak area, or save-streak action |
| FR-8 | Resume state overrides streak | P0 | In-progress test shows question number and time left |
| FR-9 | State machine incl. at-risk | P0 | Flips at local midnight without an app release |
| FR-10 | Install bottom sheet | P0 | Live preview; Add / Not now; 14-day suppression |
| FR-11 | Pin API + fallback guide | P0 | Supports Android 8+; graceful on unsupported launchers |
| FR-12 | App shortcuts | P0 | Static 3 + dynamic resume; deep links verified |
| FR-13 | Daily Brief notification | P1 | Opt-in, 1/day, 5/week, suppressed after study |
| FR-14 | Android 16 Live Update | P1 | Promoted ongoing 9 PM–midnight; graceful fallback |
| FR-15 | Privacy toggle | P1 | Hides score/accuracy; persisted per widget |
| FR-16 | Offline/stale state | P0 | Last known data + age label; never blank |
| FR-17 | Analytics | P0 | Every event in Section 15 fires with widget metadata |
| FR-18 | Pass strip | P2 | Expired only, live price, max 1/week, no fake timer |

---

## 15. Analytics

### 15.1 Events

| Event | When | Key properties |
|---|---|---|
| `widget_prompt_shown` | Install sheet appears | placement, trigger, widget_type |
| `widget_prompt_action` | Add / later / dismiss | action, placement |
| `widget_pin_requested` | Pin API called | supported, launcher |
| `widget_pin_result` | System callback | success |
| `widget_added` | `onEnabled` | size, first_time |
| `widget_removed` | `onDeleted` | lifetime_days |
| `widget_resized` | `onAppWidgetOptionsChanged` | from, to |
| `widget_updated` | Every refresh | source, state, data_age_sec, duration_ms, success |
| `widget_tapped` | Any tap | target, state, size, ai_message_id |
| `widget_stale_rendered` | Data > 6h old | age |
| `widget_config_saved` | Config change | metric, privacy |
| `widget_daily_brief_sent` | Notification sent | state, streak_at_risk |
| `widget_daily_brief_opened` | Notification tap | state |
| `widget_live_update_posted` | Live Update posted | state |
| `widget_live_update_tapped` | Live Update tap | state |

### 15.2 Metrics

| Metric | Definition | Initial target |
|---|---|---|
| Prompt → pin | `pin_result(success) / prompt_shown` | 10–15% |
| Widget D7 retention | Still pinned 7 days after add | ≥70% |
| Weekly active widget rate | ≥1 tap or update / pinned, per week | ≥40% |
| Tap → test start | Test starts / widget taps | ≥15% |
| Test starts / 1k pinned / week | Normalised | Baseline + 20% |
| D7 retention lift | Prompted vs holdout | +1.5–2.5 pp |
| Notification opt-out | Opt-outs / brief sent | ≤2% |
| Widget removal within 7 days | Removed / added | ≤25% |

### 15.3 What is measurable — and what is not

- **Installed:** yes, via `onEnabled` / `onDeleted` plus a heartbeat.
- **Active:** proxy via last successful update or tap.
- **Data freshness:** yes, via `widget_updated.data_age_sec`.
- **Impressions/views:** **no.** The launcher does not report visibility. Never promise widget views.
- **Incrementality:** only with a randomised prompt holdout. Installer-vs-non-installer comparisons are selection-biased.

### 15.4 Attribution

Every widget tap opens a deep link with:

```text
utm_source=home_widget
utm_medium=widget
utm_campaign=streak_v1
widget_size=4x2
widget_state=at_risk
widget_instance_id=<hashed appWidgetId>
ai_message_id=<message id>
```

Use a hashed `appWidgetId` so a re-add is distinguishable from a new user.

### 15.5 Experiment

- **Design:** 90/10 prompt-randomised holdout.
- **Unit:** eligible user (Android 8+, app version, not already pinned).
- **Primary:** D7 retention; secondary: test starts, widget pin rate.
- **Duration:** 4 weeks or until power.
- **Kill criteria:** prompt → pin <6% after two copy iterations, or no retention lift at significance, or removal within 7 days >40%.

---

## 16. Non-functional requirements

| Area | Requirement |
|---|---|
| Performance | Widget renders from cache in <100ms; refresh <2s on a 3G connection |
| Battery | Max 4 scheduled refreshes/day; event-driven updates only for meaningful events |
| Data | Refresh on app open if >15 min stale; stale label after 6h |
| Offline | Last known data; never blank; no blocking spinner |
| Privacy | No phone/email in widget; optional first name; score hidden on request |
| Security | Signed deep links for sensitive targets; no PII in logs |
| Localisation | 7 app languages; no hardcoded English in the widget |
| Accessibility | TalkBack labels; 48dp targets; 1.3× font scale; colour-independent states |
| OEM | Test Pixel, Samsung One UI, Xiaomi HyperOS, Oppo ColorOS, Vivo Funtouch |
| Resilience | One API failure must not blank the whole widget; per-block fallbacks |
| Theme | Light, dark, Material You; no pure-white flash in dark mode |

---

## 17. Rollout

| Phase | Scope | Exit criteria |
|---|---|---|
| 0 — Spike | Glance, pin API, FCM refresh, OEM matrix, snapshot contract | Technical sign-off |
| 1 — Foundations | App shortcuts, 2×2/4×2 widget, install sheet, analytics | Internal dogfood; no P0 bugs |
| 2 — Intelligence | Daily streak, AI line, report widget, Daily Brief | Data quality validated; copy reviewed |
| 3 — Experiment | 5% → 25% prompt holdout | Pin rate and retention read |
| 4 — Scale | 50% → 100%, Pass strip, Live Update | Guardrails stable |

### Team

1 Android engineer, 1 backend engineer, 1 product designer, 1 PM, QA support.

### Timeline

8–10 weeks. If the daily-streak service slips, ship the weekly hero only and enable the daily subline server-side later.

---

## 18. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Low install rate | High | High | Prompt at peak moments; app shortcuts as fallback |
| OEM kills background updates | High | Medium | FCM + on-open refresh + stale label; OEM test matrix |
| Data mismatch with app | Medium | High | Single snapshot endpoint; same source as Tests tab |
| Selection bias in retention | High | High | Prompt-randomised holdout |
| AI tone/quality | Medium | Medium | Templates first; human review; kill switch |
| Price mismatch | Medium | High | Live price only; legal review |
| Notification fatigue | Medium | High | Caps, suppression, opt-in, no Pass spam |
| Privacy on shared devices | Medium | Medium | Hide score toggle; no PII |
| Widget removed quickly | Medium | Medium | Avoid ads; keep one CTA; test states |

---

## 19. Open decisions

1. **Daily streak definition:** do notes read and live-class attendance count, or is the streak tests + quizzes only? This determines the event pipeline and the words “study day” vs “test day”.
2. **Freeze policy:** none in V1. Is a 2/month Pass perk acceptable later?
3. **Privacy default:** should score/accuracy be visible by default, or opt-in?
4. **Pass strip:** V1 or V1.1?
5. **Countdown widget:** which exam date is authoritative when a user has multiple exams?

---

## Appendix A — Snapshot contract

```json
{
  "streak": {
    "days": 6,
    "state": "AT_RISK",
    "week": [
      { "day": "M", "state": "ATTEMPTED" },
      { "day": "T", "state": "ATTEMPTED" },
      { "day": "W", "state": "TODAY" },
      { "day": "T", "state": "UPCOMING" }
    ],
    "badge": { "name": "Top 100", "threshold": 5, "icon": "..." }
  },
  "stats": {
    "tests_attempted": 42,
    "accuracy": 71,
    "last_score": 142,
    "delta": 12,
    "percentile": 88.4
  },
  "next_action": {
    "type": "test",
    "id": "...",
    "title": "SSC CGL Mock 12",
    "duration_min": 10
  },
  "in_progress": {
    "test_id": "...",
    "question_index": 34,
    "total": 100
  },
  "exam": { "name": "SSC CGL", "days_left": 38 },
  "ai_message": {
    "id": "m_123",
    "text": "Algebra 42%. 10 questions, 4 minutes.",
    "locale": "en",
    "expires_at": "2026-10-27T00:00:00+05:30"
  },
  "pass": { "status": "EXPIRED", "price": 499, "strike": 949 },
  "updated_at": "2026-10-26T19:00:00+05:30"
}
```

---

## Appendix B — Deep links

| Target | Link |
|---|---|
| Home | `testbook://tbapp/home` |
| Tests | `testbook://tbapp/my_tests` |
| Test | `testbook://tbapp/test/{testId}` |
| Analysis | `testbook://tbapp/analysis/{...}` |
| Weak areas | `testbook://tbapp/weak_areas` (verify) |
| Practice | `testbook://tbapp/practice` |
| Daily quiz | `testbook://tbapp/daily_quiz` |
| Pass | `testbook://tbapp/pass` |
| Exam page | `testbook://tbapp/examPage` |

> Engineering must verify the exact formats in `AppDeepLinkRouter` before implementation. Add missing routes behind the same router.

---

## Appendix C — Screen-spec additions

Add a new lane to `TBAppScreens`:

**0. OS Entry Points**

- `WIDGET_PICKER_PREVIEW`
- `WIDGET_INSTALL_SHEET`
- `WIDGET_CONFIG_SCREEN`
- `WIDGET_DAILY_BRIEF_SETTINGS`
- `WIDGET_STATES`

New global attributes: `widget_type`, `widget_size`, `widget_state`, `widget_instance_id`, `ai_message_id`.

New events: the `widget_*` namespace in Section 15.

A widget is not a `screen_view`. Do not force it into the existing screen CSV schema.

---

## Appendix D — Code references

| File | Why it matters |
|---|---|
| `repo-module/.../TestSeriesService.kt:240` | `getTestSubmissionsStreak()` |
| `models-module/.../ToppersStreakHelper.kt` | API → widget model |
| `legacy/.../ToppersStreakWidget.kt` | Existing in-app card |
| `models-module/.../tests/miniAnalysis/MiniAnalysis.kt` | Per-test accuracy |
| `models-module/.../tests/StudentStats.kt` | Per-series attempts |
| `notifications-module/.../TbFCMService.kt` | Silent refresh entry point |
| `deeplink-module/.../AppDeepLinkRouter.java` | Deep-link routing |
| `catalog.gradle` | `minSdk 23`, `targetSdk 36`, version 9.11.3 |
| `app/src/main/AndroidManifest.xml` | `POST_NOTIFICATIONS` already declared |

---

*This PRD is the source of truth for the widget. The visual state gallery is in [`docs/index.html`](docs/index.html).*
