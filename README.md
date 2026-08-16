# ocaramelo.github.io

Personal page for Luís Marques - Python Developer.

Live at [ocaramelo.github.io](https://ocaramelo.github.io/).

Static site: plain HTML/CSS/JS, no build step. Served by GitHub Pages from `main`.

- `index.html` - page content
- `css/style.css` - design system (light/dark tokens, layout)
- `js/script.js` - theme toggle, hero canvas animation, easter eggs
- `assets/` - profile photo

Bump the `?v=` query string on `css/style.css` and `js/script.js` in `index.html` when
editing either, so browsers don't keep serving a stale cached copy.

Scaffolded via `xorgentic new` (a private tool of the author's, not a public dependency);
the Python project skeleton it generates by default was removed since this is a static
page.
