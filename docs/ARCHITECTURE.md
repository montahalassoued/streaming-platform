# Architecture Overview

This document summarizes the realtime and integration architecture for the streaming backend.

## Components

- **Redis Pub/Sub**: used for decoupled eventing between modules. Channels in use:
  - `chat.system.message` — system-generated chat messages (broadcast to WebSocket rooms)
  - `stream.went.live` — emitted when a streamer goes live (used to notify followers via SSE)
  - `vod.process` — emitted when a stream ends; consumed by `VodProcessWorker`
  - `chat.message.deleted` — emitted when a moderator soft-deletes a message; consumed by `ChatGateway`
  - `streamer.settings.updated` — emitted when a streamer updates channel settings; **intentional no-op** (see below)

- **WebSocket (Socket.IO)**: handles interactive chat in the `/chat` namespace. Clients join rooms named `stream:{streamId}`. JWT authentication is required at handshake — unauthenticated connections are rejected immediately.

- **Server-Sent Events (SSE)**: used for one-way per-user notifications (followers). Endpoint: `GET /notifications/sse`. A 25-second heartbeat comment (`: heartbeat`) is written to each connection to prevent proxy/load-balancer idle timeouts.

- **VodProcessWorker**: subscribes to `vod.process` on module init. When a stream ends, it looks up the stream record, then upserts a VOD row: `videoUrl = stream.hlsUrl`, `isPublic = true`, `durationSeconds = endedAt − startedAt`. If a VOD for that stream already exists it is updated; otherwise a new row is created.

- **ChatMessageReactionEntity**: tracks per-user reactions (e.g., `like`, `heart`) on chat messages. Stored in the `chat_message_reactions` table. Reactions are not surfaced through the API yet but the schema is in place.

## Flow Examples

### Stream goes live
1. Streamer starts stream; `StreamsService` publishes `stream.went.live` and `chat.system.message` on Redis.
2. `NotificationsService` subscribes to `stream.went.live`, queries followers from `follows`, and pushes SSE events to connected followers.
3. `ChatGateway` subscribes to `chat.system.message` and broadcasts to the `stream:{streamId}` Socket.IO room.

### Stream ends
1. `StreamsService` publishes `vod.process` with `{ streamId, startedAt, streamKey }`.
2. `VodProcessWorker` receives the event and upserts a VOD record with `isPublic = true`.

### Message moderated
1. Streamer calls the streamer panel to delete a message; `StreamerService` sets `isDeleted = true` and publishes `chat.message.deleted` with `{ messageId }`.
2. `ChatGateway` receives the event, looks up the message to get `streamId`, and emits `messageDeleted: { messageId }` to the `stream:{streamId}` room.
3. Connected clients can hide the message immediately.

### streamer.settings.updated (no-op)
- `StreamerService` publishes `{ streamerId }` when channel settings change.
- `NotificationsService` subscribes and **logs receipt but takes no action**. The payload only carries `streamerId`; mapping that to a connected SSE client (keyed by `userId`) requires an additional DB lookup and a defined frontend contract. Implement the push once the frontend team specifies the expected UI reaction.

## Design rationale
- Redis pub/sub decouples modules and avoids circular dependency injection.
- SSE horizontal scaling limitation: the `clients` map in `NotificationsService` is per-instance. Multi-replica deployments require sticky sessions (e.g., nginx `ip_hash`) or a shared delivery mechanism (e.g., Redis streams). This is a known limitation; sticky sessions are the minimum viable fix.
