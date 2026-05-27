# Frontend Handoff

This document is the integration guide for any frontend that consumes this backend.

---

## Base URL

| Environment | Base URL |
|-------------|----------|
| Development | `http://localhost:3000` |
| Docker Compose | `http://localhost:3000` |

Swagger UI (interactive docs): `http://localhost:3000/api`

---

## Authentication

### Token storage
After a successful `POST /auth/login`, the server returns:
```json
{ "accessToken": "...", "refreshToken": "..." }
```

Store both tokens. Recommended: `accessToken` in memory (not localStorage), `refreshToken` in an `HttpOnly` cookie or secure storage.

### Sending requests
Every protected endpoint expects a Bearer token in the `Authorization` header:
```
Authorization: Bearer <accessToken>
```

### Token refresh
`accessToken` expires after **1 hour**. Before it expires (or on a `401` response), call:

```
POST /auth/refresh
{ "refreshToken": "..." }
→ { "accessToken": "..." }
```

A `401` from `/auth/refresh` means the refresh token is invalid — redirect to login.

### Logout
`POST /auth/logout` is stateless. On logout: call the endpoint, then discard both tokens from client storage.

---

## Error Format

All HTTP errors follow NestJS's standard envelope:
```json
{
  "statusCode": 400,
  "message": "Validation failed: ...",
  "error": "Bad Request"
}
```

`message` may be a string or an array of strings (for validation errors). Always check both forms.

Common status codes:
| Code | Meaning |
|------|---------|
| `400` | Validation error — check `message` array |
| `401` | Missing or expired token |
| `403` | Valid token but insufficient permission / unverified email |
| `404` | Resource not found |
| `409` | Conflict (duplicate email/username on register) |

---

## Realtime Connections

### 1. Server-Sent Events (SSE) — notifications

Used to receive push notifications (e.g. a followed streamer goes live).

**Endpoint:** `GET /notifications/sse`
**Auth:** JWT required

```js
const es = new EventSource(`${BASE_URL}/notifications/sse`, {
  headers: { Authorization: `Bearer ${accessToken}` }
});

es.addEventListener('stream_went_live', (e) => {
  const { streamId, streamerId, startedAt } = JSON.parse(e.data);
  // show toast / update UI
});

es.onerror = () => {
  // reconnect logic — EventSource auto-reconnects by default
};
```

**Notes:**
- The server sends `: heartbeat` comments every 25 seconds. These are not events — ignore them.
- SSE is per-user: only followers of the streamer who went live receive the event.
- In a multi-replica deployment, sticky sessions are required (see `docs/ARCHITECTURE.md`).

---

### 2. WebSocket (Socket.IO) — live chat

Used for live bidirectional chat on a stream watch page.

**Namespace:** `/chat`
**Auth:** JWT required at handshake

```js
import { io } from 'socket.io-client';

const socket = io(`${BASE_URL}/chat`, {
  auth: { token: accessToken }
});

// Join a stream room
socket.emit('joinStream', { streamId });

// Listen for messages
socket.on('newMessage', ({ message, user }) => { /* render */ });
socket.on('messageDeleted', ({ messageId }) => { /* hide message */ });
socket.on('viewerCount', ({ count }) => { /* update counter */ });
socket.on('userJoined', ({ username }) => { /* show join notification */ });
socket.on('userLeft', ({ username }) => { /* optional */ });

// Send a message
socket.emit('sendMessage', { streamId, content: 'Hello!' });

// Leave
socket.emit('leaveStream', { streamId });
socket.disconnect();
```

On `connect_error`: the token is invalid — redirect to login.

---

## CORS

CORS is enabled in the bootstrap for all origins (`*`). For production, restrict this to your frontend domain.

---

## Pagination

Paginated endpoints (`GET /streams`, `GET /categories`) accept:
- `?page=1` (1-indexed)
- `?limit=20`

Response shape:
```json
{ "data": [...], "total": 100, "page": 1, "limit": 20 }
```

---

## Media / Upload

The backend does not handle file uploads directly. `avatarUrl`, `thumbnailUrl`, `videoUrl`, and `hlsUrl` are plain string fields. Upload assets to a CDN or object store and pass the resulting URL to the API.

---

## Streamer Onboarding Flow

1. User registers → `POST /auth/register`
2. User verifies email → `POST /auth/verify-email` (token arrives in email)
3. User logs in → `POST /auth/login`
4. User upgrades to streamer → `POST /users/me/become-streamer`
5. Streamer retrieves RTMP key → `GET /streams/my/key`
6. Streamer configures media software (OBS etc.) with the RTMP URL and stream key
7. Media server calls `POST /streams/verify-key/:key` on ingest start (internal)
8. Media server calls `POST /streams/ended/:key` on ingest end (internal)

The frontend does not need to call the `verify-key` or `ended` endpoints — those are wired to the media server.

---

## Donation Flow

1. Client calls `POST /donations` with `{ streamId, userId, amountCents, currency, message? }`
2. Response includes `{ checkoutUrl, donation }`
3. Redirect user to `checkoutUrl` to complete payment
4. Payment provider posts to `POST /donations/webhook` with result
5. Donation status is updated (`pending` → `completed` / `failed`)

> **Dev note**: `checkoutUrl` is a mock in development. See `docs/FRONTEND_GAPS.md`.

---

## Admin Access

Admin endpoints (`/admin/*`) require a JWT where the payload contains `isAdmin: true`. Set admin status via `POST /admin/users/:id/promote`. There is no self-registration for admin — it must be set by an existing admin.
