# Development: Running and Migrations

Quick steps to run locally and manage DB migrations.

Prereqs

- Node.js 18+
- PostgreSQL (Neon) connection string in `DATABASE_URL`
- Redis server, set `REDIS_URL` if not using default localhost

Environment variables

Create a `.env` with at minimum:

```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-secret
PORT=3000
REDIS_URL=redis://localhost:6379
```

Install and run

```bash
npm install
# Run migrations (TypeORM uses ts files; preload ts-node when needed)
NODE_OPTIONS="-r ts-node/register" npm run migration:run
# Start development server
npm run start:dev
```

Notes

- If migrations fail due to TypeScript ESM resolution, use the `NODE_OPTIONS` wrapper shown above to preload `ts-node/register`.
- Migrations are located in `src/migrations`.
