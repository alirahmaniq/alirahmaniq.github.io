# alirahmaniq.github.io

Personal academic website for Ali Rahmani — PhD student in Informatics, University of Iowa.
Static site (HTML / CSS / JS), no build step, deploys on GitHub Pages.

## Structure

```
index.html        The whole site (single-scroll page)
css/style.css     Styles, theme tokens, light + dark mode
js/main.js        Theme toggle, footer year, click-to-load YouTube embeds
assets/           portrait photo and any project/video images
.nojekyll         Tells GitHub Pages to serve files as-is (no Jekyll)
```

## Things to fill in

Search the code for these and replace:

- `assets/photo.jpg` — add your professional portrait here (square works best).
  Until it exists, the hero shows your initials automatically.
- `REPLACE_ME` in `index.html` — your Google Scholar profile ID (two places:
  hero links and footer). Remove the Scholar buttons if you do not have a profile yet.
- Featured videos — in the `#video` section of `index.html`, add
  `data-yt="YOUTUBE_ID"` to any `.vid` card to make it play the real video inline.
  See the comment block in that section. Without it, cards link to the channel.

## Deploy to GitHub Pages

This must live in a repo named exactly **`alirahmaniq.github.io`** to publish at
`https://alirahmaniq.github.io`.

```sh
# 1. Create an empty public repo named alirahmaniq.github.io on GitHub (no README).
# 2. From this folder:
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/alirahmaniq/alirahmaniq.github.io.git
git push -u origin main
```

Then, in the repo on GitHub: Settings → Pages → Source = `Deploy from a branch`,
Branch = `main` / `/ (root)`. The site goes live in a minute or two.

## Local preview

Any static server works, for example:

```sh
python -m http.server 8000
# then open http://localhost:8000
```
