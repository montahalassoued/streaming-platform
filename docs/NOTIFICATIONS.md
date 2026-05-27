# Notifications and Event Schemas

This document describes the realtime event channels and payloads used by the backend.

## Redis channels

- `chat.system.message`
  - System chat messages that appear in a stream room (e.g., "Streamer is live!").
  - Example payload:
    ```json
    {
      "streamId": "<uuid>",
      "content": "Streamer is live",
      "type": "system",
      "timestamp": "2026-05-27T12:00:00.000Z"
    }
    ```

- `stream.went.live`
  - Emitted when a streamer starts a stream. `NotificationsService` listens and notifies followers via SSE.
  - Example payload:
    ```json
    {
      "streamId": "<uuid>",
      "streamerId": "<uuid>",
      "startedAt": "2026-05-27T12:00:00.000Z"
    }
    ```

- `vod.process`
  - Emitted when a stream ends. Consumed by `VodProcessWorker`, which upserts a VOD record.
  - Example payload:
    ```json
    {
      "streamId": "<uuid>",
      "startedAt": "2026-05-27T12:00:00.000Z",
      "streamKey": "<key>"
    }
    ```

- `chat.message.deleted`
  - Emitted by `StreamerService` when a moderator soft-deletes a message. Consumed by `ChatGateway`, which broadcasts `messageDeleted` to the stream's Socket.IO room.
  - Example payload:
    ```json
    { "messageId": "<uuid>" }
    ```

- `streamer.settings.updated`
  - Emitted by `StreamerService` when channel settings change.
  - **Intentional no-op**: `NotificationsService` subscribes and logs receipt but takes no push action. The payload only contains `{ streamerId }` which cannot be directly mapped to a connected SSE client (those are keyed by `userId`). Implement the push when the frontend defines what UI update is expected.
  - Example payload:
    ```json
    { "streamerId": "<uuid>" }
    ```

## Server-Sent Events (SSE)

- Endpoint: `GET /notifications/sse` (requires JWT authentication).
- Connect with the `Authorization: Bearer <token>` header (cookies are not used).

  ```bash
  curl -H "Authorization: Bearer <jwt>" -N http://localhost:3000/notifications/sse
  ```

- **Heartbeat**: the server writes `: heartbeat\n\n` every 25 seconds to keep the connection alive through proxies and load balancers. Clients should ignore comment lines (lines starting with `:`).

- **SSE event format**:

  ```text
  event: stream_went_live
  data: {"streamId":"...","streamerId":"...","startedAt":"..."}

  ```

- **Scaling limitation**: SSE client registrations are stored in an in-memory `Map` per process instance. In a multi-replica deployment, a follower connected to replica A will not receive events published by replica B unless sticky sessions are configured (e.g., nginx `ip_hash`). This is a known limitation. Sticky sessions are the minimum viable fix; a shared push mechanism (e.g., Redis Streams + server-sent fanout) would eliminate the requirement.

## WebSocket (Socket.IO)

- Namespace: `/chat`
- **JWT authentication required at handshake**: pass the token via `socket.handshake.auth.token` or `Authorization: Bearer <token>` header. Connections without a valid token are disconnected immediately.
- Rooms: `stream:{streamId}`

### Client events (sent by the client)

| Event | Payload | Description |
|-------|---------|-------------|
| `joinStream` | `{ streamId }` | Join a stream room |
| `leaveStream` | `{ streamId }` | Leave a stream room |
| `sendMessage` | `{ streamId, content }` | Send a chat message |

### Server events (sent by the server)

| Event | Payload | Description |
|-------|---------|-------------|
| `joinedStream` | `{ streamId, messages }` | Confirmation + message history |
| `newMessage` | `{ message, user }` | New chat message broadcast |
| `messageDeleted` | `{ messageId }` | Message was moderated — clients should hide it |
| `userJoined` | `{ streamId, userId, username }` | Another user joined |
| `userLeft` | `{ streamId, userId, username }` | Another user left |
| `viewerCount` | `{ streamId, count }` | Updated viewer count |
| `chat:error` | `{ message }` | Error response to the emitting client |

## Security

- SSE is protected by `JwtAuthGuard`; only authenticated users can subscribe.
- WebSocket connections require a valid JWT at handshake; unauthenticated clients are disconnected.
- `NotificationsService` only pushes to followers who are registered and connected.
