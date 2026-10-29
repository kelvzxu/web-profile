# Kelvin Kohsasih — Academic & Technology Portfolio

Responsive React portfolio built with Vite.

## Run locally

```bash
npm install
npm run dev
```

Open the local address shown in the terminal, usually `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```

Vite writes the production-ready website to `dist/`.

## Update content

- Edit the page sections and sample content in `src/App.jsx`.
- Adjust colors, spacing, and mobile layouts in `src/App.css`.
- Update the Google Scholar author ID in `.github/workflows/update-scholar.yml` if you connect a different profile.
- Publications and the citation, h-index, and i10-index metrics are stored in `src/data/scholar.json`.

## Weekly Google Scholar refresh

The GitHub Actions workflow refreshes the Scholar JSON every Monday at 02:00 UTC and can also be started manually from the **Actions** tab. It updates the publication list, metrics, and yearly citation graph. The graph appears after the first successful SerpApi refresh.

1. Push this project to a GitHub repository.
2. In the repository, open **Settings → Secrets and variables → Actions** and add a repository secret named `SERPAPI_KEY` with your SerpApi private key.
3. Make sure GitHub Actions is enabled for the repository. The first refresh can be started from **Actions → Update Google Scholar data → Run workflow**.
4. Connect the GitHub repository to Netlify. Each changed JSON file is committed by the workflow, which triggers Netlify to rebuild the portfolio.

The API key is read only by the GitHub Actions job. Do not put it in React source files, commit it, or share it publicly. The updater keeps the existing JSON if SerpApi returns an error.
