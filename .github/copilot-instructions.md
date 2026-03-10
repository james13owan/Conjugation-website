<!-- Guidance for AI coding assistants working on this repo -->
# Copilot / AI contributor instructions (concise)

Purpose
- Quick orientation for AI contributors so changes are safe, idiomatic, and focused on this small Vite + React single-page app.

Big picture
- This is a Vite-powered React SPA (JSX, not TypeScript). The app entry is `src/main.jsx` and the main UI is in `src/App.jsx`.
- Key feature components live in `src/` (examples: `VoicePractice.jsx`, `Home.jsx`, `levelselection.jsx`, `difficulty.jsx`).
- `src/verbs.json` is the local domain data source for verbs — treat it as canonical example data when adding features or tests.
- Static assets are under `public/` and `src/assets/` — prefer adding new images to `public/` for quick dev previews.

Dev / build / debug (how developers run the project)
- This uses Vite. Run the scripts defined in `package.json` (common commands you'll see):
  - `npm install` (or `pnpm install` / `yarn`) to install deps
  - `npm run dev` to start Vite dev server (fast HMR)
  - `npm run build` to create production build
  - `npm run preview` to locally preview the production build
- When editing UI, open the browser devtools and use the terminal where `dev` is running to view HMR logs.

Project conventions & patterns to follow
- File types: .jsx for components, .css files for styling (no CSS modules or styled-components in this repo).
- Components: functional React components (named exports default) — match existing style in `src/*.jsx`.
- Data: static JSON (e.g., `src/verbs.json`) is imported directly by components. When adding domain data, follow the existing file structure and schema.
- Small, focused components: keep UI changes local to the component file and adjacent CSS files.

Integration points / pitfalls
- There is no separate backend in this repo — all data is local (JSON) or static assets. Avoid introducing server-side assumptions.
- Vite config is minimal (`vite.config.js`) — adding new alias paths should be done there and validated with the dev server.
- Watch imports: because Vite resolves imports relative to `src/` and `public/`, prefer explicit relative imports to avoid cross-platform issues.

Examples & pointers (from the codebase)
- Mount point: `src/main.jsx` mounts `<App />` into the DOM.
- Routing / top-level UI: `src/App.jsx` controls which practice or selection screens render.
- Feature example: `src/VoicePractice.jsx` imports `src/verbs.json` and implements the practice UI; use it as a template when adding exercises.

Safety & change guidance
- Keep changes minimal and well-scoped. For UI tweaks, prefer changing the specific component and its CSS file.
- If you change the data schema in `src/verbs.json`, update all components that import it in the same PR.

If unsure
- If a script name, dependency, or exact data shape is required and not obvious, check `package.json`, `src/verbs.json`, and `src/*` before changing anything.

Ask for feedback
- After making a non-trivial change (new feature or data schema), request a short review listing the files you changed and the runtime verification you performed (dev server, quick manual run-through).

— end —