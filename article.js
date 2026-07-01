const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const article = (window.LIAM_ARTICLES || []).find((item) => item.id === id);
const root = document.querySelector("#article-content");

function safeDate(value) {
  return new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "long", year: "numeric" })
    .format(new Date(`${value}T12:00:00`));
}

if (!article) {
  root.innerHTML = `
    <section class="article-not-found article-shell">
      <div><p class="eyebrow">Developing story</p><h1>Article not found</h1><p class="standfirst">This scoop may still be stuck in the group chat.</p><p><a class="button button--dark" href="index.html">Return to the front page</a></p></div>
    </section>`;
} else {
  document.title = `${article.title} — Liamconomist`;
  document.querySelector('meta[name="description"]').content = article.summary;
  const image = article.image ? `
    <figure class="article-hero">
      <img src="${article.image}" alt="${article.imageAlt || ""}" />
      <figcaption>${article.imageCaption || "Image: Liamconomist"}</figcaption>
    </figure>` : "";
  const paragraphs = article.body.map((paragraph, index) => {
    const quote = index === 1 && article.pullQuote ? `<blockquote class="pull-quote">“${article.pullQuote}”</blockquote>` : "";
    return `<p>${paragraph}</p>${quote}`;
  }).join("");

  root.innerHTML = `
    <article>
      <header class="article-header article-shell">
        <p class="eyebrow">${article.category}</p>
        <h1>${article.title}</h1>
        <p class="article-deck">${article.summary}</p>
        <div class="article-meta"><span class="author-mark" aria-hidden="true">L</span><p>By <strong>${article.author}</strong><br>${safeDate(article.date)} · ${article.readTime} · ${article.location}</p></div>
      </header>
      ${image}
      <div class="article-body article-shell">${paragraphs}</div>
    </article>`;
}
