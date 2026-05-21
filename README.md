# aonikenk-site

Main website & portfolio for [aonikenk.dev](https://aonikenk.dev).  
Built with **Astro** · **SCSS** · **Vanilla JS modules**.

---

## Stack

| Tool | Purpose |
|------|---------|
| [Astro](https://astro.build) | Static site framework, routing, components |
| [Sass/SCSS](https://sass-lang.com) | Styling with tokens, partials, nesting |
| Vanilla JS (ESM) | Cursor, i18n, splash, scroll reveal |
| `src/data/site.json` | All variable content (services, projects, contact) |

---

## Project structure

```
aonikenk-site/
├── public/                   # Static assets (images, favicon)
├── src/
│   ├── components/           # Reusable Astro components
│   │   ├── Isotipo.astro     # SVG logo mark
│   │   ├── LangSwitch.astro  # ES/EN toggle
│   │   ├── Nav.astro         # Site navigation (shared)
│   │   ├── Footer.astro      # Site footer (shared)
│   │   ├── Splash.astro      # Full-screen intro
│   │   ├── Hero.astro        # Hero section
│   │   ├── Services.astro    # Services section
│   │   ├── Projects.astro    # Projects grid
│   │   └── Contact.astro     # Contact section + form
│   ├── data/
│   │   └── site.json         # ← ALL variable content lives here
│   ├── layouts/
│   │   └── BaseLayout.astro  # HTML shell: <head>, Nav, Footer, scripts
│   ├── pages/
│   │   └── index.astro       # Home page
│   │   └── projects/
│   │       └── [slug].astro  # (future) individual project pages
│   ├── scripts/
│   │   ├── cursor.js         # Custom cursor with lag ring
│   │   ├── i18n.js           # Language switch ES/EN
│   │   ├── splash.js         # Splash → main transition + nav hide/show
│   │   └── reveal.js         # Scroll reveal (IntersectionObserver)
│   └── styles/
│       ├── main.scss         # Entry point — imports all partials
│       ├── _tokens.scss      # Brand colors, fonts, breakpoints
│       ├── _animations.scss  # @keyframes
│       ├── _global.scss      # Base styles, buttons, shared classes
│       └── _components.scss  # Services, Projects, Contact, cursor, lang switch
└── astro.config.mjs
```

---

## Content updates

**All variable content** (copy, projects, services, contact info, social links)
lives in **`src/data/site.json`**. No need to touch any component.

To add a project:
```json
// src/data/site.json → projects array
{
  "id": "my-new-project",
  "featured": false,
  "img": "/images/projects/my-new-project.jpg",
  "color": "p1",
  "es": { "type": "Software", "name": "Mi Proyecto", "desc": "Descripción..." },
  "en": { "type": "Software", "name": "My Project",  "desc": "Description..." },
  "url": "/projects/my-new-project"
}
```

In the future, `site.json` can be replaced by a CMS API call (Sanity, Contentful, Notion, etc.) with minimal refactoring — just swap the import for a `fetch()` in each component.

---

## Dev & build

```bash
# Install dependencies
npm install

# Start dev server (localhost:4321)
npm run dev

# Production build → dist/
npm run build

# Preview the build locally
npm run preview
```

---

## Deploy (Vercel)

1. Push to `aonikenk-dev/aonikenk-site` on GitHub
2. Vercel auto-detects Astro — no config needed
3. Every push to `main` triggers a new deploy

Custom domain: configured in Vercel → Settings → Domains → `aonikenk.dev`

---

## Future pages (routing)

```
src/pages/
├── index.astro               # /
├── projects/
│   └── [slug].astro          # /projects/project-name
└── blog/
    ├── index.astro           # /blog
    └── [slug].astro          # /blog/post-title
```

Astro handles file-based routing automatically. Just add files to `src/pages/`.

---

## Related repos

| Repo | Purpose |
|------|---------|
| `aonikenk-proposals` | Client proposals (private) |
| `aonikenk-brand`     | Brand system & identity assets |
| `aonikenk-ui`        | UI component library |
