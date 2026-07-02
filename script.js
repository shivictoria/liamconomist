const articles = window.LIAM_ARTICLES || [];
const stories = articles.map((article) => [article.category.toLowerCase(), article.title, article.id]);

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const toast = $(".toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function openDialog(dialog) {
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
    document.body.classList.add("modal-open");
  }
}

function closeDialog(dialog) {
  dialog.close();
  document.body.classList.remove("modal-open");
}

function articleUrl(id) {
  return `article.html?id=${encodeURIComponent(id)}`;
}

function populateHomepage() {
  const featured = articles.find((article) => article.featured) || articles[0];
  if (!featured) return;

  $("[data-featured-title]").textContent = featured.title;
  $("[data-featured-summary]").textContent = featured.summary;
  $("[data-featured-author]").textContent = featured.author;
  $("[data-featured-meta]").textContent = `${featured.readTime} · ${featured.location}`;
  $("[data-featured-title]").href = articleUrl(featured.id);

  if (featured.image) {
    const image = $("[data-featured-image]");
    image.src = featured.image;
    image.alt = featured.imageAlt || "Editorial artwork for the featured Liamconomist story";
    $("[data-featured-caption]").textContent = featured.imageCaption || "Image: Liamconomist";
  }

}

populateHomepage();

const menuButton = $(".menu-button");
const nav = $("#site-nav");
menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  nav.classList.toggle("open", !isOpen);
});

$$('.nav-scroll a').forEach((link) => link.addEventListener("click", () => {
  menuButton.setAttribute("aria-expanded", "false");
  nav.classList.remove("open");
}));

const subscribeModal = $("#subscribe-modal");
$("[data-open-subscribe]").addEventListener("click", () => openDialog(subscribeModal));
$(".modal__close", subscribeModal).addEventListener("click", () => closeDialog(subscribeModal));
$("[data-fake-subscribe]").addEventListener("click", () => {
  closeDialog(subscribeModal);
  showToast("Welcome aboard. Your card has not been charged.");
});

const searchModal = $("#search-modal");
const searchInput = $("#search-input");
const searchResults = $("#search-results");
$("[data-open-search]").addEventListener("click", () => {
  openDialog(searchModal);
  setTimeout(() => searchInput.focus(), 50);
});
$(".modal__close", searchModal).addEventListener("click", () => closeDialog(searchModal));

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    searchResults.innerHTML = "<p>Popular searches: housing, coffee, vibes, creatine</p>";
    return;
  }
  const matches = stories.filter(([tag, title]) => `${tag} ${title}`.toLowerCase().includes(query));
  searchResults.innerHTML = matches.length
    ? matches.map(([tag, title, id]) => `<a class="search-result" href="${articleUrl(id)}"><strong>${title}</strong><span>${tag} · reporting on Liam</span></a>`).join("")
    : `<p>No results for “${query.replace(/[<>]/g, "")}”. This may be the market’s fault.</p>`;
});

$$('.save-button').forEach((button) => button.addEventListener("click", () => {
  const saved = button.classList.toggle("saved");
  button.textContent = saved ? "✓" : "＋";
  showToast(saved ? "Saved for a more intellectually ambitious day." : "Removed from your reading list.");
}));

$("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  showToast("You’re on the list. The list is currently a JavaScript variable.");
});

$$('dialog').forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog(dialog);
  });
  dialog.addEventListener("close", () => document.body.classList.remove("modal-open"));
});

const date = new Intl.DateTimeFormat("en-AU", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(new Date());
$("#edition-date").textContent = date;
$("#year").textContent = new Date().getFullYear();
