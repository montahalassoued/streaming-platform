# Notifications and Event Schemas

This document describes the realtime event channels and payloads used by the backend.

Redis channels

- `chat.system.message`
  - Used for system chat messages that should appear in the chat room (e.g., "Streamer X is live!").
  - Example payload:
    ```json
    {
      "streamId": "<uuid>",
      "content": "Streamer is live",
      "type": "system",
      "timestamp": "2026-05-26T12:00:00.000Z"
    }
    ```

- `stream.went.live`
  - Emitted when a streamer starts a stream. NotificationsService listens and notifies followers via SSE.
  - Example payload:
    ```json
    {
      "streamId": "<uuid>",
      "streamerId": "<uuid>",
      "startedAt": "2026-05-26T12:00:00.000Z"
    }
    ```

Server-Sent Events (SSE)

- Endpoint: `GET /notifications/sse` (requires JWT authentication).
-- Connection: client opens an SSE connection and sends an authenticated request using the `Authorization: Bearer <token>` header (cookies are not used).
-- Example `curl` (Bearer token):

  ```bash
  curl -H "Authorization: Bearer <jwt>" -N http://localhost:3000/notifications/sse
  ```

- SSE message format (simple `data:` lines):

  ```text
  event: stream_went_live
  data: {"streamId":"...","streamerId":"...","startedAt":"..."}

  ```

WebSocket (Socket.IO)

- Namespace: `/chat`
- Rooms: `stream:{streamId}`
- When `chat.system.message` arrives, server emits `newMessage` to `stream:{streamId}` room.

Security

- SSE is protected by `JwtStrategy`; only authenticated users can subscribe. `NotificationsService` will only push to followers who are registered and connected.
