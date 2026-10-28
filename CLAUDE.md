# CLAUDE.md — zoeyt.dev

Personal portfolio site for **Zoey Tan** at **zoeyt.dev**.
Focus: design, interaction, and front-end implementation.

## Stack

- React + Vite + TypeScript (strict). Static build only.
- Styling: plain CSS. All fonts, colors, spacing and layout sizes are CSS variables
  in `src/styles/tokens.css`. Do not hard-code these values in components or `global.css`.
- Planned later: **GSAP** for animation, possibly **Three.js** for 3D. Not installed yet —
  add only when a task asks for it.

## Hosting

- Target: **Cloudflare free static hosting**. Build command `npm run build`, output `dist/`.
- No backend, server functions, databases, or paid services.
- Do not change DNS or domain settings.

## Content rules

- All copy and data live in `src/content/` and are typed in `src/types/content.ts`.
  Layout components in `src/components/` must not contain hard-coded content.
- **Never invent** projects, work history, clients, testimonials, or contact details.
  Only add content Zoey has provided. Empty sections show their `emptyText`.

## Current state / scope

- Home page shows only "Zoey Tan" and "Portfolio in progress", plus placeholder
  Work / About / Contact sections.
- The layout is a temporary, neutral placeholder. The final visual style is undecided —
  don't introduce a strong visual direction, complex animation, or 3D unless asked.
- Respect `prefers-reduced-motion` for any future animation.

## Workflow

- Before finishing any change, run `npm run typecheck` and `npm run build`; both must pass.
- Work on a feature branch and open a pull request. Do not merge into `main` unless asked.
- Never commit secrets, API keys, `.env` files, `node_modules/`, or `dist/`.
