# Streaming Platform Backend

NestJS backend for a streaming platform with TypeORM, PostgreSQL, auth, admin, streams, vods, donations, chat, and categories.

## Features

- NestJS API with modular architecture
- TypeORM entities and migrations
- JWT authentication with local login strategy
- Swagger API docs at `/api`
- Seed script for demo data
- Prettier and ESLint setup

## ERD

![Schema ERD](assets/schema_erd_revised_v2.svg)

## Requirements

- Node.js 18+
- npm
- Neon PostgreSQL database

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with your Neon database and auth values:

```env
DATABASE_URL=your-neon-connection-string
JWT_SECRET=your-secret-key
PORT=3000
```

3. Run the build or start command you want:

```bash
npm run build
```

4. Start the app:

```bash
npm run start:dev
```

## Scripts

- `npm run build` - compile the project
- `npm run start` - run the compiled app
- `npm run start:dev` - run in watch mode
- `npm run lint` - lint and fix source files
- `npm run format` - format source files with Prettier
- `npm run format:check` - check Prettier formatting
- `npm run migration:create` - create a new TypeORM migration
- `npm run migration:generate` - generate a TypeORM migration from entity changes
- `npm run migration:run` - run pending migrations

## Swagger

After starting the server, open:

```text
http://localhost:3000/api
```

## Docker

Build and run the API against Neon:

```bash
docker compose up --build
```

The app will be available at `http://localhost:3000` and will use the `DATABASE_URL` from your `.env` file.

You can override the runtime with environment variables such as `DATABASE_URL`, `JWT_SECRET`, and `PORT`.

## Project Structure

- `src/auth` - authentication controllers, services, strategies, and DTOs
- `src/users` - user entities, DTOs, and services
- `src/categories` - category management
- `src/streams` - stream management
- `src/vods` - VOD management
- `src/chat` - chat message management
- `src/donations` - donation management
- `src/admin` - admin utilities
- `src/migrations` - TypeORM migrations
- `src/scripts` - sync and seed scripts

## Realtime Architecture

This backend uses a hybrid realtime architecture:

- Redis Pub/Sub: cross-module system events (channels: `chat.system.message`, `stream.went.live`).
- WebSocket (Socket.IO): room-based chat under namespace `/chat`, rooms named `stream:{streamId}`.
- Server-Sent Events (SSE): per-user notifications at `GET /notifications/sse` (authenticated via JWT).

Key notes:

- Modules are decoupled using Redis pub/sub to avoid circular NestJS DI.
- Follower notifications are stored in the `follows` table and SSE pushes are filtered to followers only.

## Notifications & Events

See `docs/NOTIFICATIONS.md` for event payload schemas and examples for subscribing via SSE and connecting to WebSocket chat.

## Architecture Diagram

See `docs/ARCHITECTURE.md` for a brief diagram and explanation of the realtime flow.



