# How to add a Liam story

All stories live in [`content/articles.js`](content/articles.js). You do not need to edit the HTML.

1. Open [`content/ARTICLE_TEMPLATE.js`](content/ARTICLE_TEMPLATE.js).
2. Copy only the article object after `const ARTICLE_TEMPLATE =` (from `{` through `}`).
3. Paste it at the top of the `window.LIAM_ARTICLES = [` list in `content/articles.js`.
4. Replace the headline, summary, date, quote and body paragraphs.
5. Give it a unique `id`, using lowercase words separated by hyphens.
6. To feature it as the large front-page story, set its `featured` field to `true` and set every other article to `false`.

## Add a photo

Put the image inside the `assets` folder, then use its filename:

```js
image: "assets/liam-making-pasta.jpg",
imageAlt: "Liam making pasta at the kitchen bench",
imageCaption: "Photo: your name",
```

Use landscape images where possible. If you do not want an image, use `image: ""`.

## Preview the site

Run this command in the project folder:

```bash
python3 -m http.server 4173
```

Visit `http://localhost:4173`, and click any story to open its full article page.

## Put your update online

After the site is connected to GitHub Pages, every push to the `main` branch publishes the new article automatically. The deployment workflow is already included in `.github/workflows/deploy-pages.yml`.
