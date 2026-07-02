# Liamconomist
Inspiring progress chaotically.

An original, independent newspaper covering events, decisions and policy shifts in the life of Liam Cunneen. 

To draft or complete an article with Codex, follow [`ARTICLE_WORKFLOW.md`](ARTICLE_WORKFLOW.md). For manual publishing, use [`HOW_TO_PUBLISH.md`](HOW_TO_PUBLISH.md). Stories are entered in one simple JavaScript file and automatically appear on the homepage, search, category pages, article index, briefing and full article page.

Validate articles without installing dependencies:

```bash
node scripts/article-workflow.js validate
```

## Run locally

No build step or dependencies are required:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Deploy for free

### GitHub Pages

1. Create a public GitHub repository and push these files.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions**.
4. Push to `main` (or run the included workflow from the Actions tab).

The site will be available at `https://<username>.github.io/<repository>/`.

### Cloudflare Pages

Connect the repository in Cloudflare Pages and use:

- Framework preset: `None`
- Build command: leave blank
- Build output directory: `.`

## Disclaimer

Liamconomist is an independent parody. It is not affiliated with, endorsed by, or connected to The Economist or The Economist Group.
