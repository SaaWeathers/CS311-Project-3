# Game Explorer

A React app built with Vite that explores free-to-play games from the
[FreeToGame API](https://www.freetogame.com/api-doc).

## Features

- Loads the game catalog when the app opens and displays at least 20 games.
- Filters the catalog by any genre in the loaded game data using the filter button.
- Shows more games 20 at a time.
- Searches the API catalog by game name and shows matching results or a not-found
  message.
- Uses Bootstrap for responsive layout and custom CSS for the game cards and
  page styling.

## Run locally

Open the project folder in VS Code, then open **Terminal > New Terminal** and run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production build, run
`npm run build`.

## Deploy to GitHub Pages

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds and deploys
the app whenever code is pushed to `main`. In the repository settings, open
**Pages** and set **Build and deployment > Source** to **GitHub Actions**. The
deployed site will be available at
`https://saweathers.github.io/CS311-Project-3/`.

React, Vite, and Bootstrap are recorded in `package.json` and
`package-lock.json`; `node_modules` is ignored by Git and can be restored with
`npm install`.
