#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const articleFile = path.join(root, "content", "articles.js");
const canonicalCategories = ["Current Affairs", "Decisions", "Liam opinion", "Charts & vibes"];
const categoryAliases = new Map([
  ["life updates", "Current Affairs"],
  ["life update", "Current Affairs"],
  ["personal affairs", "Current Affairs"],
  ["events", "Current Affairs"],
  ["daily briefing", "Current Affairs"],
  ["weekend affairs", "Current Affairs"],
  ["decisions", "Decisions"],
  ["decision", "Decisions"],
  ["domestic policy", "Decisions"],
  ["liam opinion", "Liam opinion"],
  ["opinion", "Liam opinion"],
  ["culture", "Liam opinion"],
  ["charts & vibes", "Charts & vibes"],
  ["charts and vibes", "Charts & vibes"],
  ["charts", "Charts & vibes"],
  ["data", "Charts & vibes"]
]);

function loadArticles() {
  const source = fs.readFileSync(articleFile, "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox, { filename: articleFile });
  if (!Array.isArray(sandbox.window.LIAM_ARTICLES)) {
    throw new Error("content/articles.js must assign an array to window.LIAM_ARTICLES");
  }
  return sandbox.window.LIAM_ARTICLES;
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function resolveCategory(value) {
  return categoryAliases.get(normalize(value));
}

function articleLabel(article, index) {
  return `${article && article.id ? article.id : "unnamed"} (#${index + 1})`;
}

function findArticles(articles, query) {
  const needle = normalize(query);
  const exactIds = articles.map((article, index) => ({ article, index }))
    .filter(({ article }) => normalize(article.id) === needle);
  if (exactIds.length) return exactIds;

  const exactTitles = articles.map((article, index) => ({ article, index }))
    .filter(({ article }) => normalize(article.title) === needle);
  if (exactTitles.length) return exactTitles;

  return articles.map((article, index) => ({ article, index }))
    .filter(({ article }) => normalize(article.title).includes(needle));
}

function validateArticles(articles, selectedId) {
  const issues = [];
  const add = (severity, message) => issues.push({ severity, message });
  const selected = selectedId
    ? articles.map((article, index) => ({ article, index })).filter(({ article }) => article.id === selectedId)
    : articles.map((article, index) => ({ article, index }));

  if (selectedId && !selected.length) {
    add("error", `No article has the exact id “${selectedId}”.`);
  }

  for (const { article, index } of selected) {
    const label = articleLabel(article, index);
    if (!article || typeof article !== "object" || Array.isArray(article)) {
      add("error", `${label}: article must be an object.`);
      continue;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.id || "")) {
      add("error", `${label}: id must use lowercase letters, numbers and single hyphens.`);
    }

    for (const field of ["title", "summary", "author", "location", "readTime", "pullQuote"]) {
      if (typeof article[field] !== "string" || !article[field].trim()) {
        add("error", `${label}: ${field} is required.`);
      }
    }

    if (typeof article.featured !== "boolean") {
      add("error", `${label}: featured must be true or false.`);
    }

    const category = resolveCategory(article.category);
    if (!category) {
      add("error", `${label}: category “${article.category || ""}” is not mapped to a section.`);
    } else if (!canonicalCategories.includes(article.category)) {
      add("warning", `${label}: legacy category “${article.category}”; new stories should use “${category}”.`);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(article.date || "") || Number.isNaN(Date.parse(`${article.date}T12:00:00`))) {
      add("error", `${label}: date must be a real date in YYYY-MM-DD format.`);
    }

    if (!/^\d+ min read$/.test(article.readTime || "")) {
      add("warning", `${label}: readTime should look like “3 min read”.`);
    }

    if (!Array.isArray(article.body) || !article.body.some((paragraph) => typeof paragraph === "string" && paragraph.trim())) {
      add("error", `${label}: body must contain at least one non-empty paragraph.`);
    } else {
      const words = article.body.join(" ").trim().split(/\s+/).filter(Boolean).length;
      if (words < 150 || words > 250) {
        add("warning", `${label}: body is ${words} words; the quick-brief default is 150–250.`);
      }
    }

    if (typeof article.image !== "string") {
      add("error", `${label}: image must be a string, even when empty.`);
    } else if (article.image) {
      const assetRoot = path.join(root, "assets");
      const imagePath = path.resolve(root, article.image);
      if (!imagePath.startsWith(`${assetRoot}${path.sep}`)) {
        add("error", `${label}: image must point inside assets/.`);
      } else if (!fs.existsSync(imagePath)) {
        add("error", `${label}: image file does not exist: ${article.image}.`);
      }
      if (!article.imageAlt || !article.imageAlt.trim()) add("error", `${label}: imageAlt is required when image is set.`);
      if (!article.imageCaption || !article.imageCaption.trim()) add("error", `${label}: imageCaption is required when image is set.`);
    }

    if (article.video !== undefined && typeof article.video !== "string") {
      add("error", `${label}: video must be a string, even when empty.`);
    } else if (article.video) {
      const assetRoot = path.join(root, "assets");
      const videoPath = path.resolve(root, article.video);
      if (!videoPath.startsWith(`${assetRoot}${path.sep}`)) {
        add("error", `${label}: video must point inside assets/.`);
      } else if (!fs.existsSync(videoPath)) {
        add("error", `${label}: video file does not exist: ${article.video}.`);
      }
      if (path.extname(article.video).toLowerCase() !== ".mp4") {
        add("warning", `${label}: MP4 is recommended for browser-compatible video.`);
      }
      if (!article.videoPoster || typeof article.videoPoster !== "string") {
        add("error", `${label}: videoPoster is required when video is set.`);
      } else {
        const posterPath = path.resolve(root, article.videoPoster);
        if (!posterPath.startsWith(`${assetRoot}${path.sep}`) || !fs.existsSync(posterPath)) {
          add("error", `${label}: videoPoster file does not exist inside assets/: ${article.videoPoster}.`);
        }
      }
      if (!article.videoAlt || !article.videoAlt.trim()) add("error", `${label}: videoAlt is required when video is set.`);
      if (!article.videoCaption || !article.videoCaption.trim()) add("error", `${label}: videoCaption is required when video is set.`);
    }
  }

  const byId = new Map();
  const byTitle = new Map();
  articles.forEach((article, index) => {
    const id = article && article.id;
    const title = normalize(article && article.title);
    if (id) byId.set(id, [...(byId.get(id) || []), index]);
    if (title) byTitle.set(title, [...(byTitle.get(title) || []), index]);
  });

  for (const [id, indexes] of byId) {
    if (indexes.length > 1) add("error", `Duplicate id “${id}” appears at entries ${indexes.map((index) => index + 1).join(", ")}.`);
  }
  for (const [title, indexes] of byTitle) {
    if (indexes.length > 1) add("warning", `Duplicate headline “${articles[indexes[0]].title}” appears at entries ${indexes.map((index) => index + 1).join(", ")}.`);
  }

  const featured = articles.map((article, index) => ({ article, index })).filter(({ article }) => article.featured === true);
  if (featured.length !== 1) {
    add("error", `Exactly one article must be featured; found ${featured.length}${featured.length ? ` (${featured.map(({ article }) => article.id).join(", ")})` : ""}.`);
  }

  return { issues, checked: selected.length };
}

function printMatches(matches) {
  if (!matches.length) {
    console.error("No matching article found.");
    process.exitCode = 1;
    return;
  }
  if (matches.length > 1) console.log(`Found ${matches.length} possible matches:`);
  for (const { article, index } of matches) {
    console.log(`${index + 1}. ${article.id} — ${article.title}`);
    console.log(`   ${article.category} · ${article.date} · ${article.location}`);
  }
  if (matches.length > 1) process.exitCode = 2;
}

function printValidation(result) {
  const errors = result.issues.filter((issue) => issue.severity === "error");
  const warnings = result.issues.filter((issue) => issue.severity === "warning");
  for (const issue of errors) console.error(`ERROR: ${issue.message}`);
  for (const issue of warnings) console.warn(`WARN:  ${issue.message}`);
  console.log(`\nChecked ${result.checked} article${result.checked === 1 ? "" : "s"}: ${errors.length} error(s), ${warnings.length} warning(s).`);
  if (errors.length) process.exitCode = 1;
}

function usage() {
  console.log("Usage:");
  console.log('  node scripts/article-workflow.js find "<id or headline>"');
  console.log("  node scripts/article-workflow.js validate [exact-id]");
}

try {
  const articles = loadArticles();
  const [command = "validate", ...args] = process.argv.slice(2);
  if (command === "find") {
    const query = args.join(" ").trim();
    if (!query) usage();
    else printMatches(findArticles(articles, query));
  } else if (command === "validate") {
    printValidation(validateArticles(articles, args[0]));
  } else {
    usage();
    process.exitCode = 1;
  }
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  process.exitCode = 1;
}
