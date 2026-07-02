const CATEGORY_CONFIG = {
  "life-updates": {
    title: "Life updates",
    description: "Up-to-date news and analysis tracking the everyday events, personal affairs and unexpected developments shaping Liam’s life.",
    aliases: ["life updates", "life update", "personal affairs", "events", "daily briefing", "weekend affairs"]
  },
  decisions: {
    title: "Decisions",
    description: "Close coverage of Liam’s choices, reversals and strongly worded positions - from dinner policy to weekend strategy.",
    aliases: ["decisions", "decision", "domestic policy","editorial"]
  },
  opinion: {
    title: "Liam opinion",
    description: "Arguments, cultural judgments and considered views from Liamconomist’s least impartial correspondents.",
    aliases: ["liam opinion", "opinion", "culture"]
  },
  "charts-vibes": {
    title: "Charts & vibes",
    description: "Data-led reporting, suspicious indicators and the quantitative forces affecting Liam’s weekly outlook.",
    aliases: ["charts & vibes", "charts and vibes", "charts", "data","analysis"]
  },
};

const params = new URLSearchParams(window.location.search);
const requestedSlug = params.get("category") || "life-updates";
const slug = CATEGORY_CONFIG[requestedSlug] ? requestedSlug : "life-updates";
const config = CATEGORY_CONFIG[slug];
const normalize = (value = "") => value.trim().toLowerCase();
const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
})[character]);
const formatDate = (value) => new Intl.DateTimeFormat("en-AU", {
  day: "numeric", month: "long", year: "numeric"
}).format(new Date(`${value}T12:00:00`));
const articleUrl = (id) => `article.html?id=${encodeURIComponent(id)}`;

const articles = [...(window.LIAM_ARTICLES || [])]
  .filter((article) => config.aliases.includes(normalize(article.category)))
  .sort((a, b) => new Date(b.date) - new Date(a.date));

document.title = `${config.title} — Liamconomist`;
document.querySelector('meta[name="description"]').content = config.description;
document.querySelector("#topic-title").textContent = config.title;
document.querySelector("#breadcrumb-topic").textContent = config.title;
document.querySelector("#topic-description").textContent = config.description;
document.querySelector("#topic-count").textContent = `${articles.length} ${articles.length === 1 ? "story" : "stories"}`;
document.querySelector(`[data-topic-link="${slug}"]`)?.classList.add("active");

function visualMarkup(article, className = "topic-visual") {
  const image = article.image
    ? `<img src="${escapeHtml(article.image)}" alt="${escapeHtml(article.imageAlt)}" />`
    : "";
  return `<div class="${className}"><span class="topic-visual__mark" aria-hidden="true">L</span>${image}</div>`;
}

function attachImageFallbacks() {
  document.querySelectorAll(".topic-visual img, .topic-latest__visual img").forEach((image) => {
    image.addEventListener("error", () => image.remove());
  });
}

const lead = document.querySelector("#topic-lead");
const latest = document.querySelector("#topic-latest-list");

if (!articles.length) {
  lead.innerHTML = `<div class="topic-empty"><h2>No dispatches yet</h2><p>Add an article with the category “${escapeHtml(config.title)}” and it will appear here automatically.</p><a class="text-link" href="articles.html">Browse every article →</a></div>`;
  lead.style.display = "block";
  latest.innerHTML = "";
} else {
  const featured = articles[0];
  const sideStories = articles.slice(1, 4);
  lead.innerHTML = `
    <article class="topic-lead__main">
      ${visualMarkup(featured)}
      <div class="topic-lead__copy">
        <p class="kicker">${escapeHtml(featured.category)}</p>
        <h2><a href="${articleUrl(featured.id)}">${escapeHtml(featured.title)}</a></h2>
        <p>${escapeHtml(featured.summary)}</p>
        <p class="topic-story-meta">${formatDate(featured.date)} · ${escapeHtml(featured.readTime)}</p>
      </div>
    </article>
    <aside class="topic-side">
      <p class="topic-side__label">More in ${escapeHtml(config.title)}</p>
      ${sideStories.length ? sideStories.map((article) => `
        <article><h3><a href="${articleUrl(article.id)}">${escapeHtml(article.title)}</a></h3><p>${formatDate(article.date)} · ${escapeHtml(article.readTime)}</p></article>
      `).join("") : `<article><p>More rigorous coverage is being commissioned.</p></article>`}
    </aside>`;

  latest.innerHTML = articles.slice(1).length
    ? articles.slice(1).map((article) => `
      <article>
        <time datetime="${escapeHtml(article.date)}">${formatDate(article.date)}</time>
        <div class="topic-latest__copy"><p class="kicker">${escapeHtml(article.category)}</p><h3><a href="${articleUrl(article.id)}">${escapeHtml(article.title)}</a></h3><p>${escapeHtml(article.summary)}</p><p class="topic-story-meta">${escapeHtml(article.author)} · ${escapeHtml(article.readTime)}</p></div>
        ${visualMarkup(article, "topic-latest__visual")}
      </article>`).join("")
    : `<div class="topic-empty"><p>This is currently the only dispatch in ${escapeHtml(config.title)}.</p></div>`;
  attachImageFallbacks();
}

const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector("#site-nav");
menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  nav.classList.toggle("open", !isOpen);
});
