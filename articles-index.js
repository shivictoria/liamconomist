const indexArticles = [...(window.LIAM_ARTICLES || [])].sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);

const list = document.querySelector("#article-index-list");
const count = document.querySelector("#article-count");
const filter = document.querySelector("#article-filter");

function articleUrl(id) {
  return `article.html?id=${encodeURIComponent(id)}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(`${value}T12:00:00`));
}

function renderArticles(query = "") {
  const term = query.trim().toLowerCase();
  const matches = indexArticles.filter((article) =>
    [article.title, article.summary, article.category, article.location, article.author]
      .join(" ")
      .toLowerCase()
      .includes(term)
  );

  count.textContent = `${matches.length} ${matches.length === 1 ? "article" : "articles"}`;
  list.innerHTML = matches.length
    ? matches.map((article) => `
      <li class="article-index-item">
        <div><p class="kicker">${article.category}</p><time datetime="${article.date}">${formatDate(article.date)}</time></div>
        <div><h2><a href="${articleUrl(article.id)}">${article.title}</a></h2><p>${article.summary}</p></div>
        <span class="article-index-item__meta">${article.readTime}</span>
      </li>`).join("")
    : '<li class="article-index-empty">No dispatches match that search. Liam may not have done it yet.</li>';
}

filter.addEventListener("input", () => renderArticles(filter.value));
renderArticles();
