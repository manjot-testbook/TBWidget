/* ============================================================
   Testbook Widget — state gallery interactions
   ============================================================ */

const STATES = {
  never: {
    code: "NEVER_STARTED",
    title: "Never started",
    className: "state-never",
    eyebrow: "THIS WEEK",
    streak: "Day 0",
    number: "0",
    total: "5",
    label: "tests this week",
    shortLabel: "tests",
    days: ["today", "upcoming", "upcoming", "upcoming", "upcoming", "upcoming", "upcoming"],
    ai: "“First mock = first data point. 10 min?”",
    cta: "Start",
    trigger: "No test has been attempted yet.",
    copy: "“Your first mock is day 1.”",
    why: "A zero-state should be an invitation, not a scoreboard. The CTA is the smallest possible first step.",
    detailCta: "Start 10-min test →",
    link: "testbook://tbapp/test/{id}"
  },
  active: {
    code: "ACTIVE_TODAY",
    title: "Active, studied today",
    className: "state-active",
    eyebrow: "THIS WEEK",
    streak: "Day 6",
    number: "3",
    total: "5",
    label: "tests this week",
    shortLabel: "tests",
    days: ["done", "done", "done", "done", "done", "upcoming", "upcoming"],
    ai: "“Algebra 42% — 10 Qs”",
    cta: "Start",
    trigger: "A qualifying study action happened today.",
    copy: "“Day 6. Streak secured.”",
    why: "Confirmation, not another ask. The CTA moves to practice so the widget never nags after the goal is met.",
    detailCta: "Practice 10 Qs →",
    link: "testbook://tbapp/practice"
  },
  atRisk: {
    code: "AT_RISK",
    title: "Streak at risk",
    className: "state-atRisk",
    eyebrow: "THIS WEEK",
    streak: "Day 6",
    number: "3",
    total: "5",
    label: "tests this week",
    shortLabel: "tests",
    days: ["done", "done", "done", "done", "today", "upcoming", "upcoming"],
    ai: "“5 min bhi chalega. Streak bach jayega.”",
    cta: "Save streak",
    trigger: "No study action today, after 6 PM, and the streak is still alive.",
    copy: "“Streak resets at midnight.”",
    why: "A deadline the user already owns. The ask is deliberately tiny — 5 minutes, not a full mock.",
    detailCta: "Save streak · 5 Qs →",
    link: "testbook://tbapp/daily_quiz"
  },
  badge: {
    code: "BADGE_UNLOCKED",
    title: "Badge unlocked",
    className: "state-badge",
    eyebrow: "BADGE UNLOCKED",
    streak: "Day 6",
    number: "5",
    total: "5",
    label: "tests this week",
    shortLabel: "tests",
    days: ["done", "done", "done", "done", "done", "done", "upcoming"],
    ai: "“Top 100 consistency unlocked.”",
    cta: "Share",
    trigger: "The weekly Toppers Streak badge threshold was reached.",
    copy: "“Top 100 consistency unlocked.”",
    why: "A milestone is the one moment where a share CTA belongs. Celebration is the action.",
    detailCta: "Share badge →",
    link: "testbook://tbapp/my_tests"
  },
  missed: {
    code: "MISSED",
    title: "Streak reset",
    className: "state-missed",
    eyebrow: "THIS WEEK",
    streak: "Day 0",
    number: "1",
    total: "5",
    label: "tests this week",
    shortLabel: "tests",
    days: ["missed", "missed", "done", "today", "upcoming", "upcoming", "upcoming"],
    ai: "“Streak reset. One test restarts it.”",
    cta: "Start again",
    trigger: "Yesterday had no qualifying study action.",
    copy: "“Streak reset. One test restarts it.”",
    why: "No shame, no “you failed”. A restart is one action away, and the copy says exactly that.",
    detailCta: "Start a 10-min test →",
    link: "testbook://tbapp/test/{id}"
  },
  lapsed: {
    code: "LAPSED",
    title: "Lapsed, 7+ days",
    className: "state-lapsed",
    eyebrow: "THIS WEEK",
    streak: "Day 0",
    number: "0",
    total: "5",
    label: "tests this week",
    shortLabel: "tests",
    days: ["missed", "missed", "missed", "missed", "today", "upcoming", "upcoming"],
    ai: "“Break’s over. One sectional restarts it.”",
    cta: "Restart",
    trigger: "No qualifying study action for 7 or more days.",
    copy: "“Break’s over. One sectional restarts it.”",
    why: "Re-entry, not guilt. The CTA is a short sectional, not a full mock, so the first step is small.",
    detailCta: "Start a sectional →",
    link: "testbook://tbapp/practice"
  },
  exam: {
    code: "EXAM_WEEK",
    title: "Exam week",
    className: "state-exam",
    eyebrow: "EXAM WEEK",
    streak: "SSC CGL",
    number: "6",
    total: "",
    label: "days to exam",
    shortLabel: "to exam",
    days: ["done", "done", "missed", "done", "today", "upcoming", "upcoming"],
    ai: "“Tier 1 in 6 days. 1 full mock left.”",
    cta: "Full mock",
    hideFlame: true,
    trigger: "The enrolled exam is 7 days away or less.",
    copy: "“SSC CGL Tier 1 in 6 days.”",
    why: "Real urgency, not a manufactured timer. The exam date is authoritative and already in the app.",
    detailCta: "Start full mock →",
    link: "testbook://tbapp/examPage"
  },
  resume: {
    code: "IN_PROGRESS",
    title: "Attempt in progress",
    className: "state-resume",
    eyebrow: "IN PROGRESS",
    streak: "Q34/100",
    number: "34",
    total: "100",
    label: "questions done",
    shortLabel: "done",
    days: [],
    hideDays: true,
    hideFlame: true,
    ai: "“12 min left. Pick up where you left off.”",
    cta: "Resume",
    trigger: "A test attempt was started but not submitted.",
    copy: "“Resume Q34/100 · 12 min left.”",
    why: "Highest intent wins. Resume suppresses the streak entirely; finishing the attempt is the only useful action.",
    detailCta: "Resume test →",
    link: "testbook://tbapp/test/{id}"
  },
  stale: {
    code: "STALE",
    title: "Stale data",
    className: "state-stale",
    eyebrow: "LAST UPDATED 3H AGO",
    streak: "Day 6",
    number: "3",
    total: "5",
    label: "tests this week",
    shortLabel: "tests",
    days: ["done", "done", "done", "done", "today", "upcoming", "upcoming"],
    ai: "“Open Testbook to refresh.”",
    cta: "Open",
    trigger: "The cached snapshot is older than 6 hours.",
    copy: "“Updated 3h ago.”",
    why: "Never blank. The last known state is still useful, but the age is honest so the user does not trust a stale number.",
    detailCta: "Open Testbook →",
    link: "testbook://tbapp/home"
  },
  pass: {
    code: "PASS_EXPIRED",
    title: "Pass expired",
    className: "state-pass",
    eyebrow: "TESTBOOK PASS",
    streak: "Ends today",
    number: "₹499",
    total: "",
    label: "renew pass",
    shortLabel: "renew",
    days: ["done", "done", "done", "today", "upcoming", "upcoming", "upcoming"],
    hideFlame: true,
    ai: "“Your streak and reattempts go with it.”",
    cta: "Renew",
    trigger: "The user has no active Pass and is eligible for a renewal offer.",
    copy: "“Pass ended. Renew at ₹499.”",
    why: "Value framing, not fear. The price is live, the strip is capped at once a week, and the widget never invents a deadline.",
    detailCta: "Renew Pass →",
    link: "testbook://tbapp/pass"
  },
  loggedOut: {
    code: "LOGGED_OUT",
    title: "Logged out",
    className: "state-loggedout",
    eyebrow: "TESTBOOK",
    streak: "Sign in",
    number: "•••",
    total: "",
    label: "sign in to sync",
    shortLabel: "sign in",
    days: [],
    hideDays: true,
    hideFlame: true,
    ai: "“Sign in to see your streak.”",
    cta: "Sign in",
    trigger: "There is no active session on this device.",
    copy: "“Sign in to see your streak.”",
    why: "No stale personal data on a shared device. The only action is authentication.",
    detailCta: "Sign in →",
    link: "testbook://tbapp/home"
  },
  first: {
    code: "NEVER_STARTED",
    title: "First test",
    className: "state-active",
    eyebrow: "THIS WEEK",
    streak: "Day 1",
    number: "1",
    total: "5",
    label: "tests this week",
    shortLabel: "tests",
    days: ["done", "upcoming", "upcoming", "upcoming", "upcoming", "upcoming", "upcoming"],
    ai: "“First data point. Keep going.”",
    cta: "Start",
    hideFlame: false
  }
};

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const ALL_STATE_CLASSES = [
  "state-active",
  "state-atRisk",
  "state-badge",
  "state-missed",
  "state-exam",
  "state-resume",
  "state-stale",
  "state-pass"
];

function renderWidget(root, state) {
  if (!root) return;

  const isSmall = root.classList.contains("size-2x2");

  root.classList.remove(...ALL_STATE_CLASSES);
  root.classList.add(state.className);
  root.classList.toggle("wide-number", !state.total);

  root.querySelectorAll("[data-w-eyebrow]").forEach((el) => {
    el.textContent = state.eyebrow;
  });

  root.querySelectorAll("[data-w-streak]").forEach((el) => {
    el.textContent = state.streak;
  });

  const numberEl = root.querySelector("[data-w-number]");
  if (numberEl) numberEl.textContent = state.number;

  const totalEl = root.querySelector("[data-w-total]");
  const slashEl = root.querySelector(".tw-slash");

  if (state.total) {
    if (totalEl) {
      totalEl.style.display = "";
      totalEl.textContent = state.total;
    }
    if (slashEl) slashEl.style.display = "";
  } else {
    if (totalEl) totalEl.style.display = "none";
    if (slashEl) slashEl.style.display = "none";
  }

  const labelEl = root.querySelector("[data-w-label]");
  if (labelEl) {
    labelEl.textContent = isSmall ? (state.shortLabel || state.label) : state.label;
  }

  root.querySelectorAll(".tw-flame, .tw-streak-line .ic").forEach((el) => {
    el.style.display = state.hideFlame ? "none" : "";
  });

  const daysEl = root.querySelector("[data-w-days]");
  if (daysEl) {
    if (state.hideDays) {
      daysEl.style.display = "none";
    } else {
      daysEl.style.display = "";
      if (isSmall) {
        daysEl.className = "tw-dots";
        daysEl.innerHTML = state.days
          .map((day) => `<span class="tw-dot ${day}"></span>`)
          .join("");
      } else {
        daysEl.className = "tw-days";
        daysEl.innerHTML = state.days
          .map(
            (day, index) => `
            <span class="tw-day ${day}">
              <span class="dot">${day === "done" ? '<svg class="ic"><use href="#i-check"/></svg>' : ""}</span>
              ${DAY_LABELS[index] || ""}
            </span>`
          )
          .join("");
      }
    }
  }

  const aiEl = root.querySelector("[data-w-ai]");
  if (aiEl) aiEl.textContent = state.ai;

  const ctaEl = root.querySelector("[data-w-cta]");
  if (ctaEl) ctaEl.textContent = state.cta;
}

function renderDetail(state) {
  const set = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  };

  set("[data-state-code]", state.code);
  set("[data-state-title]", state.title);
  set("[data-state-trigger]", state.trigger);
  set("[data-state-copy]", state.copy);
  set("[data-state-why]", state.why);
  set("[data-state-cta]", state.detailCta);
  set("[data-state-link]", state.link);
}

function setState(key) {
  const state = STATES[key];
  if (!state) return;

  const widget = document.querySelector("[data-state-widget]");
  renderWidget(widget, state);
  renderDetail(state);

  document.querySelectorAll(".state-tab").forEach((tab) => {
    tab.setAttribute("aria-pressed", String(tab.dataset.state === key));
  });
}

function initWidgets() {
  document.querySelectorAll("[data-widget]").forEach((widget) => {
    if (widget.closest(".sheet-preview")) return;
    renderWidget(widget, STATES.active);
  });

  document.querySelectorAll(".sheet-preview [data-widget]").forEach((widget) => {
    renderWidget(widget, STATES.first);
  });
}

function initStateTabs() {
  document.querySelectorAll(".state-tab").forEach((tab) => {
    tab.addEventListener("click", () => setState(tab.dataset.state));
  });
  setState("active");
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );

  items.forEach((item) => observer.observe(item));
}

function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
  initWidgets();
  initStateTabs();
  initReveal();
  initHeader();
});
