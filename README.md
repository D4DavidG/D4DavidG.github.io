# D4DavidG.github.io

Source for [d4davidg.github.io](https://d4davidg.github.io/) — my portfolio and resume site.

Hand-written HTML and CSS. No framework, no build step, no dependencies. What is in this
repository is exactly what the browser receives.

## Running it locally

There is nothing to install and nothing to compile. Serve the directory over HTTP so that
root-relative asset paths resolve:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly via `file://` mostly works, but the favicon and a few
root-relative paths will not resolve.

## Structure

```
index.html                      Home: positioning, selected work, writing, skills, background
work.html                       Every project, newest first
writing.html                    Technical documents and research work
resume.html                     HTML resume mirror; links the PDF and CV

project-knights-counsel.html    Case study — AI retrieval agent (NDA-scoped)
project-build-recipe.html       Case study — build-inference research
project-pocketprofessors.html   Case study — MERN collectible app
project-fitnessfunctions.html   Case study — PHP/MySQL enrollment system
project-contact-manager.html    Case study — contact manager
project-this-site.html          Colophon: how this site is built
fitnessfunctions.html           Redirect stub for the pre-rename URL

styles.css                      All styling, one file
main.js                         ~120 lines: year, colour mode, nav collapse, email dropdown
sitemap.xml  robots.txt         Discovery
downloads/                      Resume PDF, CV PDF, project archives
images/                         Logo, headshot, favicons, project screenshots
```

## Conventions

**Two independent theming axes.** Light/dark is a `data-mode` attribute on `<html>`, applied by
a small inline script in every `<head>` *before first paint* so the page never flashes. The accent
colour is a class on `<body>` — `theme-green`, `theme-aqua`, `theme-gold`, `theme-burgundy`,
`theme-sky`, `theme-lime`.

**Derived tokens live in the theme block, not `:root`.** A custom property that references another
resolves where it is *declared*. Writing `--accent-soft: var(--accent)` at `:root` would freeze it
to the root accent and silently ignore the per-page theme.

**Light mode needs its own ink.** Neon accents sit near 1.3:1 against white, so each theme declares
a separate `--accent-ink` for text and links that clears WCAG AA, while the bright value stays for
glows and borders.

**Accessibility is not optional here.** Skip link first in the tab order, `aria-labelledby` on every
section pointing at its real heading, visible `:focus-visible` outlines (never suppressed),
`prefers-reduced-motion` honored on scroll and the cursor glow, explicit `width`/`height` on images.

## Adding a project page

1. Copy `project-build-recipe.html` as the template — it follows the case-study structure:
   thesis → facts strip → problem → constraints → decisions → evidence → status.
2. Set `<title>`, `<meta name="description">`, `<link rel="canonical">`, and `<meta name="theme-color">`
   to match the accent you pick.
3. Set the accent class on `<body>`. If you need a new accent, add a `body.theme-*` block in
   `styles.css` alongside the existing ones, plus its `--accent-ink` override in the light-mode rule.
4. Add a card to `work.html`, and to `index.html` if it belongs in Selected Work.
5. Add the URL to `sitemap.xml`.

## Known gaps

- The nav bar is duplicated in every file. At around a dozen pages a static site generator starts
  to earn its keep; see the [colophon](https://d4davidg.github.io/project-this-site.html).
- No automated accessibility testing — the keyboard pass is manual.
- The logo flip is hover-only, so it does not fire on touch devices.

## Contact

- Email: davidegusmao@outlook.com
- LinkedIn: <https://www.linkedin.com/in/david-e-gusmao/>
- GitHub: <https://github.com/D4DavidG>
