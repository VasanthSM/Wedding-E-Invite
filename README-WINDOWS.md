# Windows Local Setup

This project requires Node.js 22.13.0 or newer.

## Recommended

```powershell
node -v
npm -v
npm ci
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## If you are using nvm-windows

```powershell
nvm install 22.13.0
nvm use 22.13.0
node -v
npm ci
npm run dev
```

The package scripts in this copy are Windows/macOS/Linux compatible and no longer depend on Bash-only wrapper scripts for normal local development/building.
