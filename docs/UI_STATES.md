# UI States

This document describes every screen in the application: what data it needs, which API calls it makes, and the states it must handle (loading, empty, error, auth-gated).

---

## 1. Home / Browse Streams

**Route:** `/`
**Auth required:** No (public)

### Data needed
- Live stream list: `GET /streams?page=1&limit=20`
- Category list for filter bar: `GET /categories?limit=50`

### States
| State | Description |
|-------|-------------|
| Loading | Skeleton cards while streams load |
| Loaded | Grid of stream cards (thumbnail, title, streamer, viewer count, category) |
| Empty | "No streams live right now" message |
| Filtered | Same grid, filtered by `?categoryId=` |
| Error | Failed to fetch — show retry option |

### Notes
- Viewer counts are live: after joining a Socket.IO room the client receives `viewerCount` events. On the browse page, viewer counts come from the stream record (not real-time).
- Category filter updates the `?categoryId` query param and refetches.

---

## 2. Register

**Route:** `/register`
**Auth required:** No (redirect to home if already logged in)

### API calls
- `POST /auth/register`

### States
| State | Description |
|-------|-------------|
| Idle | Empty form |
| Submitting | Disabled form + spinner |
| Success | Redirect to `/verify-email` with a prompt to check inbox |
| Error 400 | Show field-level validation messages from `message[]` |
| Error 409 | "Email or username already in use" |

### Fields
`username`, `email`, `password`

---

## 3. Login

**Route:** `/login`
**Auth required:** No (redirect to home if already logged in)

### API calls
- `POST /auth/login`

### States
| State | Description |
|-------|-------------|
| Idle | Empty form |
| Submitting | Disabled form + spinner |
| Success | Store tokens, redirect to previous page or home |
| Error 401/403 | "Invalid credentials" or "Email not verified" with link to resend |

### Fields
`email`, `password`

---

## 4. Verify Email

**Route:** `/verify-email`
**Auth required:** No

### API calls
- `POST /auth/verify-email` — called automatically if `?token=` is in the URL
- `POST /auth/resend-verification`

### States
| State | Description |
|-------|-------------|
| Waiting | "Check your inbox" prompt + resend button |
| Verifying | Spinner while `POST /auth/verify-email` runs |
| Success | "Email verified!" + redirect to login |
| Error 403 | "Token invalid or expired" + resend button |
| Resend submitting | Disabled resend button + spinner |
| Resend success | "Verification email sent" confirmation |
| Error 400 (resend) | "Email already verified" — redirect to login |

---

## 5. Forgot Password

**Route:** `/forgot-password`
**Auth required:** No

### API calls
- `POST /auth/forgot-password`

### States
| State | Description |
|-------|-------------|
| Idle | Email input |
| Submitting | Spinner |
| Success | "Check your inbox for a reset link" (regardless of whether email exists) |

---

## 6. Reset Password

**Route:** `/reset-password` (with `?token=` query param from email link)
**Auth required:** No

### API calls
- `POST /auth/reset-password`

### States
| State | Description |
|-------|-------------|
| Idle | New password input |
| Submitting | Spinner |
| Success | "Password reset — redirecting to login" |
| Error 403 | "Link expired or already used" + link to forgot-password |

### Fields
`newPassword` (token is read from URL, not shown to user)

---

## 7. Stream Watch Page

**Route:** `/streams/:id`
**Auth required:** No for viewing. JWT required for chat.

### Data needed
- Stream detail: `GET /streams/:id`
- Chat: Socket.IO `/chat` namespace (join `stream:{id}`)

### States
| State | Description |
|-------|-------------|
| Loading | Skeleton player + chat placeholder |
| Live | HLS player at `stream.hlsUrl` + live chat sidebar |
| Offline | "Stream is offline" message with link to VODs |
| Not found | 404 page |
| Chat loading | Spinner while Socket.IO connects |
| Chat connected | Message history from `joinedStream.messages` + live input |
| Chat unauthenticated | "Log in to chat" CTA instead of input |
| Chat error | `chat:error` event — show inline error toast |

### Real-time events to handle
| Event | UI action |
|-------|-----------|
| `newMessage` | Append to message list |
| `messageDeleted` | Hide/strike-through the message |
| `viewerCount` | Update viewer count badge |
| `userJoined` | Optional: show join notification |

---

## 8. Public Profile

**Route:** `/users/:username`
**Auth required:** No

### Data needed
- `GET /users/:username`

### States
| State | Description |
|-------|-------------|
| Loading | Skeleton |
| Loaded | Avatar, bio, follower/following counts, streamer badge if applicable |
| Not found | "User not found" |

### Actions (when logged in)
- Follow / unfollow: `POST /follows` / `DELETE /follows/:streamerId`
- Subscribe: `POST /subscriptions` (if streamer)

---

## 9. My Profile / Settings

**Route:** `/settings` or `/profile`
**Auth required:** Yes — redirect to `/login` if not authenticated

### Data needed
- `GET /users/me`

### Actions
- `PATCH /users/me` — update display name, bio, avatar URL

### States
| State | Description |
|-------|-------------|
| Loading | Skeleton form |
| Loaded | Pre-filled form |
| Saving | Disabled form + spinner |
| Save success | Success toast |
| Save error | Inline error message |
| Become streamer | Show "Become a Streamer" button if `user.isStreamer === false` → calls `POST /users/me/become-streamer` |

---

## 10. Streamer Dashboard

**Route:** `/dashboard`
**Auth required:** Yes + `user.isStreamer === true`

### Data needed
- Streamer profile: `GET /streamer/me`
- Donations received: `GET /streamer/me/donations?page=1&limit=20`
- Subscribers: `GET /streamer/me/subscribers`

### Actions
- Update settings: `PATCH /streamer/me/settings`
- Delete a chat message: `DELETE /streamer/me/chat/message/:id`
- Get stream key: `GET /streams/my/key`

### States
| State | Description |
|-------|-------------|
| Loading | Skeleton tabs |
| Overview tab | Stream key (hidden by default, reveal on click), channel settings form |
| Donations tab | Paginated table of received donations |
| Subscribers tab | List of active subscribers |
| Settings saving | Spinner while PATCH runs |
| Non-streamer | Redirect to become-streamer flow |

---

## 11. My Stream Management

**Route:** `/dashboard/streams` or within the dashboard
**Auth required:** Yes + `isStreamer`

### Data needed
- `GET /streams?streamerId=...` (use current user's streams — filter client-side or by streamer ID)

### Actions
- Create: `POST /streams`
- Update title/category: `PATCH /streams/:id`
- Delete: `DELETE /streams/:id`

### States
| State | Description |
|-------|-------------|
| Loading | Skeleton list |
| Empty | "No streams yet — go live!" |
| Stream list | Cards with title, status (live/offline), viewer count |
| Create modal | Form for title, category, RTMP/HLS URL |
| Edit modal | Pre-filled update form |
| Delete confirm | Confirmation dialog before DELETE |

---

## 12. Category Browse

**Route:** `/categories`
**Auth required:** No

### Data needed
- `GET /categories?page=1&limit=20`

### Actions
- Click category → `GET /categories/:id` → show streams in that category (`GET /streams?categoryId=:id`)

### States
| State | Description |
|-------|-------------|
| Loading | Skeleton grid |
| Loaded | Category tiles with thumbnail |
| Category detail | Header + live streams grid |
| Empty | "No live streams in this category" |

---

## 13. VOD Browse

**Route:** `/vods`
**Auth required:** No

### Data needed
- `GET /vods`

### States
| State | Description |
|-------|-------------|
| Loading | Skeleton cards |
| Loaded | VOD grid (thumbnail, title, duration) |
| Empty | "No recordings available yet" |

---

## 14. VOD Watch

**Route:** `/vods/:id`
**Auth required:** No

### Data needed
- `GET /vods/:id`

### States
| State | Description |
|-------|-------------|
| Loading | Skeleton player |
| Loaded | Video player at `vod.videoUrl` (HLS) |
| Not found | 404 message |

---

## 15. Notifications

**Route:** Persistent across all pages (header bell icon / notification tray)
**Auth required:** Yes (SSE connection)

### Data source
- `GET /notifications/sse` — persistent SSE connection established after login

### States
| State | Description |
|-------|-------------|
| No notifications | Empty tray |
| New notification | Badge on bell icon, toast on page |
| `stream_went_live` event | "Streamer X is now live!" toast + tray entry with link to stream |
| SSE disconnected | Silent reconnect (EventSource auto-reconnects) |

---

## 16. Donate

**Route:** `/streams/:id` (inline modal or dedicated `/donate/:streamId`)
**Auth required:** No

### API calls
- `POST /donations` → get `checkoutUrl` → redirect

### States
| State | Description |
|-------|-------------|
| Form | Amount input, currency, optional message |
| Submitting | Spinner |
| Redirect | Open `checkoutUrl` (new tab or redirect) |
| Return (success) | Payment provider redirects back — show "Thank you" |
| Return (failed) | Show "Payment failed, try again" |

> **Note:** The checkout redirect is a mock in development. See `docs/FRONTEND_GAPS.md`.

---

## 17. Subscribe

**Route:** `/users/:username` or profile modal
**Auth required:** Yes

### API calls
- `POST /subscriptions` → subscribe
- `GET /subscriptions` → check if already subscribed

### States
| State | Description |
|-------|-------------|
| Not subscribed | "Subscribe" button |
| Subscribing | Spinner |
| Subscribed | "Subscribed" badge + expiry date |

> **Note:** No payment step exists yet. Subscription is free/direct. See `docs/FRONTEND_GAPS.md`.

---

## 18. Admin Panel

**Route:** `/admin`
**Auth required:** Yes + `isAdmin === true` in JWT — redirect non-admin to home

### Data needed
- `GET /admin/users`

### Actions
- `POST /admin/users/:id/promote`
- `POST /admin/users/:id/demote`

### States
| State | Description |
|-------|-------------|
| Loading | Skeleton table |
| Loaded | User table with promote/demote buttons |
| Promoting/demoting | Disabled row + spinner |
| Non-admin access | 403 / redirect |
