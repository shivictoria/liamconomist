# Liamconomist article workflow

This is the review-first workflow for drafting or completing one article at a time with Codex.

## 1. Send the source material

Send loose notes, a partial draft, an article `id`, or an existing headline. Include any facts that must remain exact. Optional details include:

- what happened and why it matters;
- Liam's exact words, if any;
- date and location;
- preferred category or byline;
- visual ideas;
- whether the story should replace the current featured story.

When an `id` is supplied, it takes priority. Otherwise Codex matches an exact headline. Ambiguous matches must be resolved before any file is changed.

## 2. Review the draft

Codex returns a review packet without changing the site:

- completed metadata;
- a polished 150–250-word quick brief;
- an editorial pull quote that does not invent speech by Liam;
- an original editorial-illustration concept, prompt, alt text and caption;
- a short note distinguishing supplied facts from generated satirical framing.

Existing prose is polished while its facts and jokes are preserved. New instructions override conflicting text already in the article object.

## 3. Approve and publish

After explicit approval, Codex:

1. generates the illustration and saves it as `assets/<article-id>.png`;
2. updates the matching object or inserts one new object at the top of `content/articles.js`;
3. ensures only the requested story is featured when `featured: true`;
4. validates the article and reports any unrelated pre-existing issues;
5. confirms its article, category, index and briefing routes.

No image is generated and no article file is changed before approval.

## Categories

New stories use exactly one of:

- `Life updates`
- `Decisions`
- `Liam opinion`
- `Charts & vibes`

Legacy category names remain readable by the website, but the validator recommends the canonical name.

## Find and validate articles

The helper is read-only and has no dependencies:

```bash
node scripts/article-workflow.js find "morning-routine"
node scripts/article-workflow.js find "morning strategy"
node scripts/article-workflow.js validate morning-routine
node scripts/article-workflow.js validate
```

The focused validation still reports repository-wide conflicts, ensuring duplicate IDs and multiple featured stories are never hidden.
