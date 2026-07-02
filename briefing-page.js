const allArticles = [...(window.LIAM_ARTICLES || [])].sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);

const groupedByDate = allArticles.reduce((groups, article) => {
  if (!groups.has(article.date)) groups.set(article.date, []);
  groups.get(article.date).push(article);
  return groups;
}, new Map());

const dates = [...groupedByDate.keys()];
const params = new URLSearchParams(window.location.search);
const requestedDate = params.get("date");
let currentIndex = requestedDate && dates.includes(requestedDate) ? dates.indexOf(requestedDate) : 0;

const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
})[character]);

function formatDate(value) {
  const date = new Date(`${value}T12:00:00`);
  const day = date.getDate();
  const mod100 = day % 100;
  const suffix = mod100 >= 11 && mod100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" }[day % 10] || "th");
  const month = new Intl.DateTimeFormat("en-AU", { month: "long" }).format(date);
  return `${month} ${day}${suffix} ${date.getFullYear()}`;
}

function articleUrl(id) {
  return `article.html?id=${encodeURIComponent(id)}`;
}

function makeDigestTitle(articles) {
  if (!articles.length) return "Liam in brief";
  if (articles.length === 1) return `Liam in brief: ${articles[0].title}`;
  const first = articles[0].title.replace(/[.!?]+$/, "");
  const second = articles[1].title.replace(/[.!?]+$/, "");
  return `Liam in brief: ${first}; ${second}${articles.length > 2 ? "; and more" : ""}`;
}

function renderBriefing() {
  const date = dates[currentIndex];
  const articles = groupedByDate.get(date) || [];
  const dateLabel = date ? formatDate(date) : "No edition yet";

  document.querySelector("#briefing-date").textContent = dateLabel;
  document.querySelector("#briefing-position").textContent = dates.length ? `${currentIndex + 1} of ${dates.length}` : "0 of 0";
  document.querySelector("#briefing-title").textContent = makeDigestTitle(articles);
  document.querySelector("#briefing-meta").textContent = date ? `${dateLabel} · Updated whenever Liam does something` : "";
  document.querySelector("#newer-briefing").disabled = currentIndex <= 0;
  document.querySelector("#older-briefing").disabled = currentIndex >= dates.length - 1;

  const list = document.querySelector("#briefing-list");
  list.innerHTML = articles.length
    ? articles.map((article) => {
      const summary = article.summary || "The newsroom is monitoring this developing Liam story and awaits further particulars.";
      return `<li class="briefing-item">
        <p><strong><a href="${articleUrl(article.id)}">${escapeHtml(article.title)}.</a></strong> ${escapeHtml(summary)}</p>
        <div class="briefing-item__meta"><span>${escapeHtml(article.category)}</span><span>·</span><span>${escapeHtml(article.location)}</span><span>·</span><span>${escapeHtml(article.readTime)}</span></div>
      </li>`;
    }).join("")
    : '<li class="briefing-empty"><div><h2>No briefing has been filed</h2><p>Add a dated article and the newsroom will assemble it automatically.</p></div></li>';

  if (date) {
    const url = new URL(window.location.href);
    url.searchParams.set("date", date);
    window.history.replaceState({}, "", url);
    document.title = `${dateLabel} — Liam’s briefing`;
  }
}

document.querySelector("#newer-briefing").addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex -= 1;
    renderBriefing();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

document.querySelector("#older-briefing").addEventListener("click", () => {
  if (currentIndex < dates.length - 1) {
    currentIndex += 1;
    renderBriefing();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector("#site-nav");
menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  nav.classList.toggle("open", !isOpen);
});

renderBriefing();
