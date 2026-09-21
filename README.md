# Akshay Chauhan — portfolio

Plain HTML / CSS / JS. No build step, no dependencies.

```
index.html   all content and markup
styles.css   all styling (colours + fonts live in :root at the top)
script.js    cursor, scroll reveals, hero lattice, tilt, form
```

## Edit locally (VS Code)

1. Open this folder in VS Code.
2. Install the **Live Server** extension → right-click `index.html` → *Open with Live Server*.
   (Or just double-click `index.html` — it works from the file system too.)

What to change first:
- **Text** — everything is in `index.html`, section by section (HERO, WORK, ABOUT, EXPERIENCE, CONTACT).
- **Colours** — `:root` at the top of `styles.css` (`--bg`, `--amber`, `--peri`, `--ink`…).
- **Fonts** — the Google Fonts `<link>` in `index.html` plus `--font-display` / `--font-body` / `--font-mono`.
- **Résumé** — drop `resume.pdf` in this folder; the Experience link already points at it.

## Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "portfolio"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then in the repo: **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.
Live at `https://<you>.github.io/<repo>/` in about a minute.

For a root-level user site, name the repo `<you>.github.io` instead.

`.nojekyll` is included so GitHub serves every file as-is.
