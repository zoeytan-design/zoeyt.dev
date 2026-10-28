# zoeyt.dev

Personal portfolio of Zoey Tan — design, interaction, and creative development.

> Status: **work in progress.** The site currently shows a temporary, neutral layout
> with empty Work / About / Contact sections. The final visual direction is not decided yet.

## Tech stack

- [React](https://react.dev/) + [Vite](https://vite.dev/) + TypeScript
- Plain CSS with CSS custom properties (design tokens) for type, color and spacing
- Static output, intended for free static hosting on Cloudflare
- Planned later: GSAP for animation, possibly Three.js for 3D

## Requirements

- Node.js `^20.19.0 || >=22.12.0` (see `.nvmrc`; Node 22 recommended)
- npm

## Getting started

```bash
npm install        # install dependencies
npm run dev        # start the dev server at http://localhost:5173
```

## Scripts

| Command             | What it does                                             |
| ------------------- | -------------------------------------------------------- |
| `npm run dev`       | Start the Vite dev server with hot reload                |
| `npm run typecheck` | Run the TypeScript compiler (no output files)            |
| `npm run build`     | Type-check, then build the production site into `dist/`  |
| `npm run preview`   | Serve the `dist/` build locally at http://localhost:4173 |

## Project structure

```
.
├── index.html              # HTML entry (title, meta, favicon)
├── public/                 # Static files copied as-is (favicon.svg)
├── src/
│   ├── main.tsx            # React entry; imports global styles
│   ├── App.tsx             # Page layout: nav, hero, sections, footer
│   ├── components/         # Layout components (no hard-coded copy)
│   │   ├── Nav.tsx
│   │   ├── Hero.tsx
│   │   ├── Section.tsx     # Section wrapper with empty state
│   │   ├── WorkList.tsx
│   │   └── ContactList.tsx
│   ├── content/            # ← All editable content lives here
│   │   ├── site.ts         # Name, domain, status line, section titles
│   │   ├── work.ts         # Projects (currently empty)
│   │   ├── about.ts        # About paragraphs (currently empty)
│   │   ├── contact.ts      # Contact links (currently empty)
│   │   └── index.ts
│   ├── types/content.ts    # Types for the content above
│   └── styles/
│       ├── tokens.css      # Design tokens (fonts, colors, spacing)
│       └── global.css      # Base and layout styles using the tokens
├── vite.config.ts
├── tsconfig*.json
└── CLAUDE.md               # Project rules for AI-assisted work
```

## Editing content

Content is kept separate from layout code:

- **Add a project:** add an object to the array in `src/content/work.ts`
  (fields are typed in `src/types/content.ts`).
- **About text:** add paragraphs to `src/content/about.ts`.
- **Contact links:** add `{ label, href }` items to `src/content/contact.ts`.

A section shows "Coming soon." until its content array has items.

## Changing the look

Change values in `src/styles/tokens.css` (fonts, colors, spacing, layout width).
Styles in `global.css` only reference these variables.

## Deployment (Cloudflare)

The site builds to static files, so it can run on Cloudflare's free static hosting
without a backend. When connecting the repository in the Cloudflare dashboard, use:

- Build command: `npm run build`
- Build output directory: `dist`
- Node version: 22 (from `.nvmrc`, or set `NODE_VERSION=22`)

Deployment and the custom domain `zoeyt.dev` are not configured yet.
