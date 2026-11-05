# Furqan Ali — Portfolio (medieval forest theme)

Plain **HTML + CSS + Tailwind**, with **GSAP**, **Lenis** (smooth scroll) and **Three.js** (3D forest and sword).
No build step. Every library is included in `assets/vendor/`, so it also works offline.

## Run it
- Double-click `index.html` — it works straight from the folder.
- Or serve it: `python3 -m http.server 8000` inside this folder, then open http://localhost:8000

## Pages
| File | Page |
|---|---|
| `index.html` | Home — 3D sword hero, tech-stack ring, featured projects |
| `about.html` | About — story, skills, education, timeline, interests |
| `projects.html` | Projects & Experience — filterable quests, detail pop-ups, experience, “vault” |

## Folder map
```
assets/
  css/styles.css     theme colours, 3D effects, components
  js/data.js         ALL your content (projects, skills, timeline…)  ← edit this
  js/forest.js       Three.js scene (forest, fireflies, campfire, sword)
  js/main.js         shared animations (nav, gates, reveals, tilt, ring…)
  js/projects.js     projects page (filters + modal)
  img/               optimized screenshots (.webp)
  vendor/            tailwind, gsap, ScrollTrigger, lenis, three
  fonts/             Cinzel, Cormorant Garamond, Inter (self-hosted)
```

## Common edits
- **Add a project:** copy one object in `assets/js/data.js → projects`, give it a new `id`, `num`, and put screenshots in `assets/img/` (list them in `gallery`). It appears on the Projects page automatically. Add `featured: true` to make it a main quest.
- **Real GitHub repo link per project:** set `repo: 'https://github.com/Furqan54/...'` on the project (otherwise it links to your GitHub profile).
- **Live demo link:** you can add a `live` field and a button in `projects.js` (`fill()`).
- **Colours:** change the `:root` variables at the top of `assets/css/styles.css`.
- **Skills / timeline / experience / interests:** all in `data.js`.
- **Future sections** (blog, contact, certifications): the “Vault” section on the Projects page is a placeholder; new pages only need the same header/footer scripts (copy `about.html` as a template and add the page to `nav` in `data.js`).

## Deploy (Vercel / Netlify / GitHub Pages)
Upload this folder as-is. There is nothing to build. On Vercel: “Add New → Project → import repo (or drag & drop the folder)”, framework preset **Other**, no build command, output directory `.`.

## Notes
- Animation respects “reduce motion” system settings.
- If a device cannot run WebGL, the site falls back to a static forest-coloured background.
- Performance: the 3D scene lowers its pixel ratio automatically on slow GPUs.
