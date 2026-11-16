# BARMAN

BARMAN is a bar website and venue-management project. The repository contains a React/Vite client and an Express/Prisma server.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Project structure

- `client/` — React + Vite frontend
- `server/` — Express API
- `server/prisma/` — Prisma schema and database migrations

## Setup

### 1. Configure the server

Open a terminal in `server/` and install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env` and keep the database URL and port configured for your local setup. Do not commit `.env`.

Generate Prisma Client and apply the existing migration:

```bash
npx prisma generate
npx prisma migrate deploy
```

Start the API:

```bash
npm run dev
```

The API runs at `http://localhost:3000`. Health checks:

- `http://localhost:3000/api/health`
- `http://localhost:3000/api/health/database`

### 2. Start the frontend

Open a second terminal in `client/`:

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`). The Vite development server proxies `/api` requests to `http://localhost:3000`.

## Notes

- Keep `client/src/styles/theme.css`, `client/src/main.jsx`, and the existing shared components when replacing or moving page files.
- The current backend contains the Express app, Prisma setup, schema, migration, and health-check endpoints. The management pages currently use frontend state; reservation/menu/event persistence and staff authentication still need API routes and frontend integration.
- The public bar page and management interface are separate parts of the intended product. The current refactor preserves the existing dashboard routes and adds the public preview route.
- The local SQLite database file is intentionally not included in this archive. It is recreated from the checked-in Prisma migration.
