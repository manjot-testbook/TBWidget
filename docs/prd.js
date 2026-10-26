/* Testbook Widget — PRD renderer */

const PRD_URL = "https://raw.githubusercontent.com/manjot-testbook/TBWidget/main/PRD.md";
const PRD_GITHUB = "https://github.com/manjot-testbook/TBWidget/blob/main/PRD.md";

const article = document.getElementById("prd");
const toc = document.getElementById("prd-toc");

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildToc() {
  if (!toc) return;

  const headings = article.querySelectorAll("h2, h3");
  const used = new Set();

  headings.forEach((heading, index) => {
    const base = slugify(heading.textContent) || `section-${index + 1}`;
    let id = base;
    let suffix = 2;

    while (used.has(id)) {
      id = `${base}-${suffix}`;
      suffix += 1;
    }

    used.add(id);
    heading.id = id;

    const link = document.createElement("a");
    link.href = `#${id}`;
    link.textContent = heading.textContent.trim();
    link.className = heading.tagName === "H3" ? "toc-h3" : "toc-h2";
    toc.appendChild(link);
  });

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        toc.querySelectorAll("a").forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-12% 0px -76% 0px", threshold: 0 }
  );

  headings.forEach((heading) => observer.observe(heading));
}

function showError(message) {
  article.innerHTML = `
    <div class="prd-error">
      <strong>Could not load the PRD.</strong>
      <p>${message}</p>
      <p><a href="${PRD_GITHUB}" target="_blank" rel="noopener">Open PRD.md on GitHub ↗</a></p>
    </div>`;
}

async function loadPrd() {
  if (!article) return;

  try {
    const response = await fetch(PRD_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`GitHub returned ${response.status}.`);

    const markdown = await response.text();
    if (!window.marked) throw new Error("The Markdown renderer did not load.");

    article.innerHTML = window.marked.parse(markdown, { gfm: true, breaks: false });

    // The page hero already carries the title; drop the duplicate H1.
    const duplicateTitle = article.querySelector("h1");
    if (duplicateTitle) duplicateTitle.remove();

    article.classList.add("is-loaded");
    buildToc();
  } catch (error) {
    showError(error.message || "Please try again.");
  }
}

document.addEventListener("DOMContentLoaded", loadPrd);
