# Backend Handoff Report

This document summarizes what is already implemented in the backend, what is still missing, and what the next contributor should work on.

## Current Backend State

The backend is a NestJS application using TypeORM and PostgreSQL, with Redis Pub/Sub for cross-module events, Socket.IO for live chat, and SSE for per-user notifications.

The following major backend areas are already present:

- Authentication with JWT and local login strategy
- User profile APIs and streamer onboarding
- Stream lifecycle management
- Chat gateway over Socket.IO
- Redis-based realtime event propagation
- Donations APIs and webhook-style status updates
- Followers / subscriptions data model
- Seed script and database migrations

## What Is Already Done

### Auth

- `POST /auth/register` validates basic fields and checks duplicate email / username.
- `POST /auth/login` issues JWT access tokens.
- JWT strategy and guards are in place.
- SSE authentication was adjusted to work with JWT-based access.

### Users

- User records are persisted through TypeORM.
- Profile reading and updating are implemented.
- `becomeStreamer()` creates streamer records and updates the user flag.

### Streams

- Streams can be created, updated, queried, and removed.
- Live viewer counts are tracked with Redis.
- Going live publishes Redis events:
  - `chat.system.message`
  - `stream.went.live`
- Ending a stream publishes `vod.process`.

### Chat

- Socket.IO namespace `/chat` exists.
- Users can join / leave a stream room.
- Messages are broadcast to the current room.
- System messages from Redis are broadcast into chat rooms.

### Notifications

- SSE endpoint exists at `GET /notifications/sse`.
- Connected followers are notified when `stream.went.live` is published.

### Donations

- Donations are stored in the database.
- A provider payment id is generated and saved.
- Webhook-style status updates are supported.

### Seed / Data

- Seed script creates demo users, streams, VODs, donations, and chat data.
- Migrations are present for the schema changes that were added.

## What Is Missing Or Still Incomplete

These are the main backend gaps that still need implementation.

### 1. Categories are still placeholders

`src/categories/categories.service.ts` returns placeholder objects instead of real database-backed data.

Missing work:

- connect categories to TypeORM repository logic
- return real category rows from the database
- implement create / update / delete persistence
- make the frontend consume the real category data

### 2. Auth recovery flows are not wired to persistence

The following methods in `src/auth/auth.service.ts` still return stub messages:

- email verification
- resend verification email
- forgot password
- reset password

Missing work:

- persist verification tokens
- persist password reset tokens
- add expiration and token validation
- integrate a real email provider
- mark emails as verified in the database

### 3. Subscriptions are monthly now

Subscription tiers were removed completely. The backend now treats subscriptions as a monthly cycle and renews them by extending `expires_at` one month at a time.

Missing work:

- make sure any old tier-based frontend calls are removed
- define whether renewal should be automatic or triggered by a payment webhook
- connect the monthly renewal to a real billing provider if payments are required

### 4. Donations payment integration is still simulated

The donation flow currently uses a fake checkout URL and a generated provider payment id.

Missing work:

- integrate a real payment provider
- verify webhook signatures
- map provider events to donation statuses
- add retry / reconciliation logic for failed payments

### 5. Some Redis events have no consumer yet

These events are emitted but do not have a backend subscriber/worker in the repo:

- `vod.process`
- `streamer.settings.updated`
- `chat.message.deleted`

Missing work:

- create a worker or processor for `vod.process`
- decide how `streamer.settings.updated` should be consumed
- decide how `chat.message.deleted` should update clients or search indexes

### 6. Categories and admin moderation are thin

The admin module currently only lists users and toggles admin status.

Missing work:

- moderation actions for streams, chat, and reports
- user banning / unbanning workflows
- category management backed by real data

### 7. Testing coverage is still light

There is no strong test suite covering the current backend behaviors.

Missing work:

- unit tests for auth, users, streams, donations, and notifications
- integration tests for Redis events
- e2e tests for login, stream start, and SSE delivery

## Important Backend Notes

- Redis is used as the realtime event bus between modules.
- Socket.IO is used for room-based chat under `/chat`.
- SSE is used for per-user notifications.
- The backend already supports the core live stream flow, but several supporting systems are still stubbed or partially simulated.

## Recommended Next Tasks

If the next contributor wants to finish the backend properly, the best order is:

1. Replace placeholder categories with real TypeORM-backed CRUD.
2. Finish auth recovery flows with persistent tokens and email provider integration.
3. Decide whether subscription tiers stay or get removed completely, then align the API.
4. Implement a real worker for `vod.process`.
5. Replace simulated donation checkout with a real provider integration.
6. Add tests for the flows above.

## Files Worth Reading First

- `src/auth/auth.service.ts`
- `src/categories/categories.service.ts`
- `src/streams/streams.service.ts`
- `src/notifications/notifications.service.ts`
- `src/subscriptions/subscriptions.service.ts`
- `src/donations/donations.service.ts`
- `src/chat/chat.gateway.ts`
- `src/scripts/seed.ts`
