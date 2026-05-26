# Architecture Overview

This document summarizes the realtime and integration architecture for the streaming backend.

Components

- Redis Pub/Sub: used for decoupled eventing between modules. Channels in use:
  - `chat.system.message` — system-generated chat messages (broadcast to WebSocket rooms)
  - `stream.went.live` — emitted when a streamer goes live (used to notify followers via SSE)

- WebSocket (Socket.IO): handles interactive chat in the `/chat` namespace. Clients join rooms named `stream:{streamId}`.

- Server-Sent Events (SSE): used for one-way per-user notifications (followers). Endpoint: `GET /notifications/sse`.

Flow Example

1. Streamer opens a stream; `StreamsService` publishes `stream.went.live` on Redis.
2. `NotificationsService` subscribes to `stream.went.live`, queries followers from the `follows` table, and pushes SSE events to connected followers.
3. `StreamsService` also publishes a `chat.system.message` to create a system chat message; `ChatGateway` subscribes and broadcasts to the relevant WebSocket room.

Reasons for design

- Decouples modules to avoid circular dependency injection (common in NestJS).
- Redis pub/sub allows horizontal scaling and multiple backend instances to share events.
