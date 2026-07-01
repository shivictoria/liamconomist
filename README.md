# Liamconomist

An original, independent parody newspaper covering events, decisions and policy shifts in the life of Liam. It is inspired by the visual grammar of serious weekly journalism.

To publish a new article, follow [`HOW_TO_PUBLISH.md`](HOW_TO_PUBLISH.md). Stories are entered in one simple JavaScript file and automatically appear on the homepage, search, most-read list and full article page.

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
