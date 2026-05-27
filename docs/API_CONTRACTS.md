# API Contracts

All endpoints are relative to the base URL. Default port in development: `http://localhost:3000`.

Interactive docs (Swagger UI): `http://localhost:3000/api`

---

## Authentication

JWT-based. Protected endpoints require:

```
Authorization: Bearer <accessToken>
```

Admin-only endpoints additionally require the `isAdmin` flag set in the JWT payload.

**Token lifetimes**
- `accessToken`: 1 hour
- `refreshToken`: rotated on every `/auth/refresh` call

**Error envelope**
```json
{ "statusCode": 401, "message": "Unauthorized", "error": "Unauthorized" }
```

---

## Auth — `/auth`

### POST /auth/register
No auth required.

Request:
```json
{ "username": "johndoe", "email": "johndoe@example.com", "password": "StrongPassword123!" }
```

Responses:
- `201` — registered, email verification pending
- `400` — validation error
- `409` — email or username already taken

---

### POST /auth/login
No auth required.

Request:
```json
{ "email": "johndoe@example.com", "password": "StrongPassword123!" }
```

Response `200`:
```json
{ "accessToken": "...", "refreshToken": "..." }
```

- `401` — invalid credentials
- `403` — email not verified

---

### POST /auth/verify-email
No auth required.

Request:
```json
{ "token": "<token-from-email-link>" }
```

Response `200`:
```json
{ "message": "Email successfully verified" }
```

- `403` — invalid or expired token

---

### POST /auth/resend-verification
No auth required.

Request:
```json
{ "email": "johndoe@example.com" }
```

Response `200`: always returns success message regardless of whether the email exists (security).

- `400` — email already verified

---

### POST /auth/forgot-password
No auth required.

Request:
```json
{ "email": "johndoe@example.com" }
```

Response `200`: always returns success message regardless of whether the email exists (security).

---

### POST /auth/reset-password
No auth required.

Request:
```json
{ "token": "<token-from-email-link>", "newPassword": "NewPassword456!" }
```

Response `200`:
```json
{ "message": "Password successfully reset" }
```

- `403` — invalid or expired token

---

### POST /auth/refresh
No auth required.

Request:
```json
{ "refreshToken": "..." }
```

Response `200`:
```json
{ "accessToken": "..." }
```

- `401` — invalid or expired refresh token

---

### POST /auth/logout
No auth required (stateless — client discards tokens).

Response `200`:
```json
{ "message": "User logged out successfully" }
```

---

## Users — `/users`

### GET /users/me
**Auth: JWT required**

Returns the authenticated user's full record including streamer status and follower/following counts.

---

### PATCH /users/me
**Auth: JWT required**

Request (all fields optional):
```json
{ "displayName": "John", "bio": "Streamer", "avatarUrl": "https://..." }
```

Response `200`: updated user object.

---

### POST /users/me/become-streamer
**Auth: JWT required**

No request body. Creates a streamer record for the authenticated user and sets `isStreamer = true`.

Response `201`: streamer object.

---

### GET /users/:username
Public. Returns a user's public profile including follower/following counts and streamer status.

---

### GET /users/:username/stats
Public. Same as `/users/:username` — returns profile with aggregated counts.

---

## Streams — `/streams`

### GET /streams
Public. Returns live streams with optional filtering.

Query params:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `categoryId` | string (uuid) | — | Filter by category |
| `page` | number | `1` | Page number |
| `limit` | number | `20` | Results per page |

---

### GET /streams/:id
Public. Returns a single stream by UUID.

- `404` — stream not found

---

### POST /streams
**Auth: JWT required**

Request:
```json
{
  "streamerId": "uuid",
  "categoryId": "uuid (optional)",
  "title": "Alice Live",
  "rtmpUrl": "rtmp://example/live/alice",
  "hlsUrl": "https://cdn.example.com/hls/alice.m3u8",
  "isLive": true,
  "startedAt": "2026-05-27T12:00:00.000Z"
}
```

Response `201`: created stream object.

---

### PATCH /streams/:id
**Auth: JWT required** (must be the stream owner)

Request body: same fields as POST, all optional.

Response `200`: updated stream object.

---

### DELETE /streams/:id
**Auth: JWT required**

Response `200`: deleted stream object.

---

### GET /streams/my/key
**Auth: JWT required**

Returns the authenticated streamer's RTMP stream key.

Response `200`:
```json
{ "streamKey": "..." }
```

---

### POST /streams/verify-key/:key
**Internal — media server use only.** Verifies an RTMP stream key on ingest start. Not called from the frontend.

---

### POST /streams/ended/:key
**Internal — media server use only.** Triggered when the media server detects a stream end. Publishes `vod.process`. Not called from the frontend.

---

## Categories — `/categories`

### GET /categories
Public. Returns paginated categories.

Query params:
| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Name/slug search |
| `page` | number | Page number (default `1`) |
| `limit` | number | Per page (default `20`) |

Response `200`:
```json
{
  "data": [{ "id": "uuid", "name": "Gaming", "slug": "gaming", "thumbnailUrl": "...", "parentId": null }],
  "total": 42,
  "page": 1,
  "limit": 20
}
```

---

### GET /categories/:id
Public. Returns a single category including its parent and children.

- `404` — category not found

---

### POST /categories
**Auth: JWT + Admin required**

Request:
```json
{ "name": "Gaming", "slug": "gaming", "parentId": "uuid (optional)", "thumbnailUrl": "https://..." }
```

Response `201`: created category.

---

### PATCH /categories/:id
**Auth: JWT + Admin required**

Request body: same fields as POST, all optional.

---

### DELETE /categories/:id
**Auth: JWT + Admin required**

---

## VODs — `/vods`

### GET /vods
Public. Returns all public VODs.

---

### GET /vods/:id
Public. Returns a single VOD by UUID.

- `404` — VOD not found

---

### POST /vods
**Auth: JWT required**

VODs are typically created automatically by `VodProcessWorker` when a stream ends. This endpoint can be used for manual creation.

Request:
```json
{
  "streamId": "uuid",
  "title": "My VOD",
  "videoUrl": "https://cdn.example.com/vod.m3u8",
  "thumbnailUrl": "https://...",
  "durationSeconds": 3600,
  "isPublic": true
}
```

---

### PATCH /vods/:id
**Auth: JWT required**

---

### DELETE /vods/:id
**Auth: JWT required**

---

## Follows — `/follows`

All endpoints require JWT.

### POST /follows
Request:
```json
{ "streamerId": "uuid" }
```

Response `201`: follow record.

---

### DELETE /follows/:streamerId
Unfollows. Response `200`.

---

### GET /follows/streamer/:streamerId
Returns all followers of a streamer.

---

### GET /follows/me
Returns all streamers the authenticated user follows.

---

## Subscriptions — `/subscriptions`

### POST /subscriptions
**Auth: JWT required**

Subscribes to a streamer. Expires after 30 days.

Request:
```json
{ "streamerId": "uuid" }
```

Response `201`: subscription record.

> **Note**: No payment step is implemented yet. This creates the subscription record directly.

---

### GET /subscriptions
**Auth: JWT required**

Returns the authenticated user's active subscriptions.

---

## Donations — `/donations`

### POST /donations
No auth required.

Request:
```json
{
  "streamId": "uuid",
  "userId": "uuid",
  "amountCents": 500,
  "currency": "USD",
  "message": "Great stream! (optional)"
}
```

Response `201`:
```json
{ "checkoutUrl": "https://...", "donation": { ... } }
```

> **Note**: `checkoutUrl` is a mock URL in development. A real payment provider is not yet wired.

---

### POST /donations/webhook
No auth. Webhook from payment provider. Must include `x-pay-signature` header for signature verification.

Request:
```json
{
  "providerPaymentId": "...",
  "event": "payment.succeeded | payment.failed | payment.refunded"
}
```

Response `200`: `{ "ok": true, "result": { ... } }`

- `401` — invalid signature

---

### GET /donations
Returns all donations. (Internal — no guard in current implementation.)

---

### GET /donations/:id
Returns a single donation by UUID.

---

### PATCH /donations/:id
Updates a donation record.

---

### DELETE /donations/:id
Deletes a donation record.

---

## Notifications — `/notifications`

### GET /notifications/sse
**Auth: JWT required**

Opens a Server-Sent Events connection. The server pushes events to this stream as they occur.

Response: `Content-Type: text/event-stream`, persistent connection.

**Connect example:**
```js
const es = new EventSource('/notifications/sse', {
  headers: { Authorization: `Bearer ${accessToken}` }
});
es.addEventListener('stream_went_live', (e) => {
  const data = JSON.parse(e.data);
  // { streamId, streamerId, startedAt }
});
```

**Events pushed:**

| Event name | Payload |
|------------|---------|
| `stream_went_live` | `{ streamId, streamerId, startedAt }` |

**Heartbeat:** The server writes `: heartbeat` every 25 seconds. Clients should ignore SSE comment lines.

---

## Streamer Panel — `/streamer`

All endpoints require JWT. The authenticated user must be a streamer.

### GET /streamer/me
Returns the authenticated user's streamer record (stream key, settings, etc.).

---

### GET /streamer/me/donations
Query: `?page=1&limit=20`

Returns donations received by the authenticated streamer, paginated.

---

### GET /streamer/me/subscribers
Returns all active subscribers of the authenticated streamer.

---

### PATCH /streamer/me/settings
Request (all optional):
```json
{ "displayName": "Alice", "bio": "Gamer", "panelHtml": "<b>Hi</b>", "chatSlowMode": 5 }
```

Response `200`: updated streamer record.

---

### DELETE /streamer/me/chat/message/:id
Soft-deletes a chat message. Publishes `chat.message.deleted` on Redis, which causes `ChatGateway` to emit `messageDeleted` to the stream room. Connected clients should hide the message immediately.

---

## Admin — `/admin`

**Auth: JWT + `isAdmin` flag required** on all routes.

### GET /admin/users
Returns all users.

---

### POST /admin/users/:id/promote
Sets `isAdmin = true` for user `:id`.

---

### POST /admin/users/:id/demote
Sets `isAdmin = false` for user `:id`.

---

## WebSocket — `/chat` namespace

**Transport:** Socket.IO

**Auth:** Pass JWT at handshake. Connections without a valid token are rejected immediately.

```js
const socket = io('/chat', {
  auth: { token: accessToken }
});
```

Rooms are named `stream:{streamId}`.

### Client → Server events

| Event | Payload | Description |
|-------|---------|-------------|
| `joinStream` | `{ streamId: string }` | Join a stream room. Server replies with `joinedStream`. |
| `leaveStream` | `{ streamId: string }` | Leave a stream room. |
| `sendMessage` | `{ streamId: string, content: string }` | Send a chat message. Broadcast to all room members. |

### Server → Client events

| Event | Payload | Description |
|-------|---------|-------------|
| `joinedStream` | `{ streamId, messages: ChatMessage[] }` | Confirmation + recent message history |
| `newMessage` | `{ message: ChatMessage, user: { id, username } }` | New message broadcast to room |
| `messageDeleted` | `{ messageId: string }` | Message was soft-deleted — hide it in the UI |
| `userJoined` | `{ streamId, userId, username }` | Another user joined the room |
| `userLeft` | `{ streamId, userId, username }` | Another user left the room |
| `viewerCount` | `{ streamId, count: number }` | Updated live viewer count |
| `chat:error` | `{ message: string }` | Error response to the emitting client only |

### ChatMessage shape
```json
{
  "id": "uuid",
  "streamId": "uuid",
  "userId": "uuid | null",
  "content": "Hello!",
  "isDeleted": false,
  "createdAt": "2026-05-27T12:00:00.000Z"
}
```

System messages (e.g. "Streamer is live") have `userId: null` and `user.username: "System"`.
