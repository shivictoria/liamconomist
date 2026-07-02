/*
  COPY THIS OBJECT into content/articles.js, directly after the opening [
  Then fill in every field. Remove this comment before pasting.
*/
const ARTICLE_TEMPLATE = {
  id: "short-unique-story-name",
  featured: false,
  // Use: "Life updates", "Decisions", "Liam opinion" or "Charts & vibes"
  category: "Life updates",
  title: "Write the dramatic headline here",
  summary: "One or two sentences explaining what Liam did and why it is newsworthy.",
  author: "Your name or a funny desk name",
  date: "2026-07-02",
  location: "Where it happened",
  readTime: "3 min read",
  image: "assets/your-photo.jpg",
  imageAlt: "Describe the photo for someone who cannot see it",
  imageCaption: "Photo: your name",
  // Optional video fields. Keep image set to the poster so cards have a thumbnail.
  video: "",
  videoPoster: "",
  videoAlt: "",
  videoCaption: "",
  // Use an editorial line unless Liam actually said the words being quoted.
  pullQuote: "The funniest or most dramatic sentence from the story.",
  body: [
    "Your opening paragraph. Treat the small event with enormous seriousness.",
    "Your second paragraph. Add the supplied details, backstory or an exact quote from Liam.",
    "Your third paragraph. Explain what this means for the relationship, the weekend or the snack cupboard. Aim for 150–250 words across the full body."
  ]
};
