# Frontend TODO

Ordered build list. Items at the top have no blocked dependencies — start there. Items lower in the list depend on backend work that is not yet complete (see `docs/FRONTEND_GAPS.md`).

The backend is at `http://localhost:3000`. Full API reference is in `docs/API_CONTRACTS.md`. Integration guide is in `docs/FRONTEND_HANDOFF.md`. Per-screen state breakdown is in `docs/UI_STATES.md`.

---

## Phase 1 — Core Auth and Browse (backend fully ready)

### 1.1 Project setup
- [ ] Create frontend project (e.g. Next.js 14 with App Router, or Vite + React)
- [ ] Configure base API client with `Authorization` header injection and 401 refresh interceptor
- [ ] Set up route guards: `PublicRoute` (redirect if logged in) and `ProtectedRoute` (redirect if not)
- [ ] Store `accessToken` in memory, `refreshToken` in `localStorage` or cookie

### 1.2 Register page (`/register`)
- Calls: `POST /auth/register`
- On success: redirect to `/verify-email`
- Handle: `400` (field errors), `409` (duplicate)

### 1.3 Verify email page (`/verify-email`)
- Reads `?token=` from URL on mount and calls `POST /auth/verify-email`
- Shows resend button → `POST /auth/resend-verification`
- On success: redirect to `/login`
- Dev note: token is in server logs (see `docs/FRONTEND_GAPS.md`)

### 1.4 Login page (`/login`)
- Calls: `POST /auth/login`
- On success: store tokens, redirect to home
- Handle: `401` / `403` (unverified email)

### 1.5 Forgot password page (`/forgot-password`)
- Calls: `POST /auth/forgot-password`
- Always shows "check your inbox" regardless of response

### 1.6 Reset password page (`/reset-password`)
- Reads `?token=` from URL
- Calls: `POST /auth/reset-password`
- On success: redirect to `/login`

### 1.7 Home / Browse streams (`/`)
- Calls: `GET /streams`, `GET /categories` (for filter bar)
- Stream card: thumbnail, title, streamer username, viewer count, category badge
- Category filter: updates `?categoryId=` and refetches

### 1.8 Category browse (`/categories`)
- Calls: `GET /categories`
- Click → category detail page → `GET /categories/:id` + `GET /streams?categoryId=:id`

---

## Phase 2 — Viewing and Social (backend fully ready)

### 2.1 Stream watch page (`/streams/:id`)
- Calls: `GET /streams/:id`
- HLS player at `stream.hlsUrl` (use `hls.js` or Video.js)
- Socket.IO chat sidebar (namespace `/chat`, room `stream:{id}`)
- Handle all Socket.IO events: `newMessage`, `messageDeleted`, `viewerCount`, `userJoined`
- Unauthenticated users see player + "Log in to chat" CTA

### 2.2 Public profile page (`/users/:username`)
- Calls: `GET /users/:username`
- Shows: avatar, bio, follower count, streamer badge
- Follow / unfollow button for authenticated users: `POST /follows` / `DELETE /follows/:streamerId`
- Subscribe button if the user is a streamer (Phase 4)

### 2.3 My profile / settings (`/settings`)
- Calls: `GET /users/me`, `PATCH /users/me`
- Show "Become a Streamer" button if `isStreamer === false` → `POST /users/me/become-streamer`

### 2.4 VOD browse (`/vods`)
- Calls: `GET /vods`
- Grid of VOD cards (thumbnail, title, duration)

### 2.5 VOD watch (`/vods/:id`)
- Calls: `GET /vods/:id`
- HLS player at `vod.videoUrl`

### 2.6 Notifications (persistent, all pages)
- Establish SSE connection after login: `GET /notifications/sse`
- `stream_went_live` event → toast + bell badge
- Disconnect SSE on logout

---

## Phase 3 — Streamer Tools (backend fully ready)

### 3.1 Streamer dashboard (`/dashboard`)
- Calls: `GET /streamer/me`, `GET /streamer/me/donations`, `GET /streamer/me/subscribers`
- Tab: Overview (stream key — hidden by default), channel settings form
- Tab: Donations received (paginated table)
- Tab: Subscribers (list)
- Settings form → `PATCH /streamer/me/settings`
- Delete chat message → `DELETE /streamer/me/chat/message/:id`

### 3.2 Stream management (`/dashboard/streams`)
- Calls: `GET /streams` (own streams only)
- Create stream → `POST /streams`
- Edit stream → `PATCH /streams/:id`
- Delete stream → `DELETE /streams/:id`
- Display stream key: `GET /streams/my/key`

---

## Phase 4 — Monetization (partially blocked — see FRONTEND_GAPS.md)

### 4.1 Subscribe flow
- `POST /subscriptions` → show subscription confirmation + expiry date
- `GET /subscriptions` → show subscribed badge on streamer profile
- **Note:** No payment step exists yet. Build as free action for now.

### 4.2 Donate flow
- Donation modal on stream watch page
- `POST /donations` → redirect user to `checkoutUrl`
- **Note:** `checkoutUrl` is a mock in development. Test via manual webhook simulation.

---

## Phase 5 — Admin (backend partially ready)

### 5.1 Admin panel (`/admin`)
- Calls: `GET /admin/users`
- Promote: `POST /admin/users/:id/promote`
- Demote: `POST /admin/users/:id/demote`
- Route guard: redirect non-admin users to home
- **Note:** Moderation routes (ban, stream removal) do not exist yet. Leave placeholders.

---

## Dependency Summary

| Screen | Backend status |
|--------|---------------|
| Register / Login / Auth flows | Ready |
| Browse streams | Ready |
| Category browse | Ready |
| Stream watch + chat | Ready |
| Public profile + follow | Ready |
| My profile / settings | Ready |
| VOD browse + watch | Ready |
| Notifications (SSE) | Ready |
| Streamer dashboard | Ready |
| Stream management | Ready |
| Subscribe | Partial — no payment |
| Donate | Partial — mock checkout |
| Admin — user management | Ready |
| Admin — moderation | Not yet implemented |
| Chat reactions | Not yet implemented |
