# Adrenal Vein Sampling Interpretation Tool

A single-page tool for computing and interpreting adrenal vein sampling (AVS)
indices in primary aldosteronism: the selectivity index, lateralization index,
and contralateral suppression index, with a step-wise interpretation and an
auto-generated clinical note.

Built with [Vite](https://vitejs.dev/) and React. No backend, no data storage —
everything runs in the browser.

## Local development

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default http://localhost:5173).

## Production build

```bash
npm run build      # outputs to /dist
npm run preview    # serve the built output locally
```

## Deploying on Vercel

1. Push this repository to GitHub.
2. In Vercel, **Add New → Project** and import the repo.
3. Vercel auto-detects Vite. Leave the defaults:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy, then attach your subdomain (e.g. `avs.htntools.com`) under
   **Project → Settings → Domains**.

## Project structure

All files sit at the repository root (no `src/` folder):

```
.
├── index.html          # Vite entry HTML (references ./main.jsx)
├── main.jsx            # React entry point
├── App.jsx             # the tool (self-contained component)
├── package.json
├── vite.config.js
└── .gitignore
```

## Notes

- All indices are ratios, so results are unit-independent; the unit dropdowns
  only label the inputs.
- For education and clinical decision support only. Confirm every calculation
  against your own laboratory values before acting. Thresholds vary between
  centres.
