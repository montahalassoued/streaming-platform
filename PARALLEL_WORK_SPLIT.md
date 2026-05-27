# Parallel Work Split for 3 People

This plan divides the missing work into three isolated lanes so each person can work in parallel with minimal merge conflict risk.

## Rules

- Do not edit files outside your assigned lane.
- Do not touch shared bootstrap files unless they are explicitly assigned to you.
- Keep any new types, DTOs, entities, and helpers inside the same feature folder as the code that uses them.
- If a change needs a shared registration file, the owner listed below handles that integration only once.

## Handoff-Aligned Notes

- Subscription tiers are no longer part of the current backend direction. Keep subscriptions tier-free unless the team explicitly reintroduces tiers later.
- Donations are still simulated, so the monetization lane should focus on a real payment provider abstraction and webhook reconciliation.
- The backend already emits `vod.process`, `streamer.settings.updated`, and `chat.message.deleted`, but consumers for those events are not fully implemented yet.
- Categories are still placeholder-backed and should be treated as a real implementation gap, not a cosmetic one.
- There is no frontend code in this workspace right now, so the frontend lane should either create the frontend app or produce the API contract and UX handoff for the separate frontend repo.

## Person 1: Auth, Identity, and Security

Owns the login and account lifecycle gap work. This lane should finish the missing verification and password recovery flow and tighten the auth surface.

Files to create:

- [src/auth/entities/email-verification-token.entity.ts](src/auth/entities/email-verification-token.entity.ts)
- [src/auth/entities/password-reset-token.entity.ts](src/auth/entities/password-reset-token.entity.ts)
- [src/auth/services/auth-email.service.ts](src/auth/services/auth-email.service.ts)
- [src/auth/dto/request-password-reset.dto.ts](src/auth/dto/request-password-reset.dto.ts)
- [src/auth/dto/confirm-password-reset.dto.ts](src/auth/dto/confirm-password-reset.dto.ts)

Files to edit:

- [src/auth/auth.service.ts](src/auth/auth.service.ts)
- [src/auth/auth.controller.ts](src/auth/auth.controller.ts)
- [src/auth/auth.module.ts](src/auth/auth.module.ts)
- [src/auth/strategies/jwt.strategy.ts](src/auth/strategies/jwt.strategy.ts)
- [src/users/entities/user.entity.ts](src/users/entities/user.entity.ts)
- [src/app.module.ts](src/app.module.ts)
- [src/data-source.ts](src/data-source.ts)
- [src/main.ts](src/main.ts)

What needs to be fixed:

- Replace the stubbed email verification path with a persisted token flow.
- Replace the stubbed forgot-password and reset-password paths with a real token lifecycle.
- Add refresh token support or a clear token renewal strategy.
- Make the JWT/session handling consistent with the rest of the auth flow.
- Register the new auth entities with TypeORM and the app bootstrap.
- Decide the email delivery integration point, even if the first version is a mock provider wrapper.
- Fix the Docker runtime command if the bootstrap changes require it.

Why this lane is isolated:

- All changes stay inside auth, users, and bootstrap wiring.
- No other person should touch these files while this lane is active.

## Person 2: Donations, Subscriptions, and Creator Monetization

Owns the money flow and creator support logic. This lane should turn the simulated payment path into a real, traceable workflow.

Files to create:

- [src/donations/dto/donation-webhook.dto.ts](src/donations/dto/donation-webhook.dto.ts)
- [src/donations/providers/payment-provider.interface.ts](src/donations/providers/payment-provider.interface.ts)
- [src/donations/providers/mock-payment-provider.ts](src/donations/providers/mock-payment-provider.ts)
- [src/donations/providers/payment-provider.module.ts](src/donations/providers/payment-provider.module.ts)

Files to edit:

- [src/donations/donations.service.ts](src/donations/donations.service.ts)
- [src/donations/donations.controller.ts](src/donations/donations.controller.ts)
- [src/donations/entities/donation.entity.ts](src/donations/entities/donation.entity.ts)
- [src/subscriptions/subscriptions.service.ts](src/subscriptions/subscriptions.service.ts)
- [src/subscriptions/subscriptions.controller.ts](src/subscriptions/subscriptions.controller.ts)
- [src/subscriptions/subscriptions.module.ts](src/subscriptions/subscriptions.module.ts)
- [src/subscriptions/dto/create-subscription.dto.ts](src/subscriptions/dto/create-subscription.dto.ts)
- [src/admin/admin.controller.ts](src/admin/admin.controller.ts)
- [src/admin/admin.module.ts](src/admin/admin.module.ts)
- [src/admin/admin.service.ts](src/admin/admin.service.ts)

What needs to be fixed:

- Replace the fake payment URL with a real provider abstraction.
- Make the donation webhook validate and reconcile payment status reliably.
- Stop relying on generated placeholder provider ids as the only payment tracking mechanism.
- Keep subscriptions aligned with the tier-free product direction.
- Add proper authorization to admin routes so they are not public.
- Keep donation and subscription behavior aligned with the actual monetization model.

Why this lane is isolated:

- This work stays inside donations, subscriptions, and admin monetization wiring.
- No other person should edit these files while this lane is active.

## Person 3: Categories, Chat, Notifications, Streams, VODs, and Data Cleanup

Owns the product surface that users interact with after login. This lane should replace placeholders and harden the realtime/content flows.

Files to create:

- [src/categories/dto/list-categories-query.dto.ts](src/categories/dto/list-categories-query.dto.ts)
- [src/chat/dto/moderate-message.dto.ts](src/chat/dto/moderate-message.dto.ts)
- [src/chat/entities/chat-message-reaction.entity.ts](src/chat/entities/chat-message-reaction.entity.ts)
- [src/notifications/dto/notification-event.dto.ts](src/notifications/dto/notification-event.dto.ts)
- [src/migrations/20260527-fix-streaming-schema.ts](src/migrations/20260527-fix-streaming-schema.ts)
- [src/workers/vod-process.worker.ts](src/workers/vod-process.worker.ts)

Files to edit:

- [src/categories/categories.service.ts](src/categories/categories.service.ts)
- [src/categories/categories.controller.ts](src/categories/categories.controller.ts)
- [src/categories/entities/category.entity.ts](src/categories/entities/category.entity.ts)
- [src/chat/chat.service.ts](src/chat/chat.service.ts)
- [src/chat/chat.controller.ts](src/chat/chat.controller.ts)
- [src/chat/chat.gateway.ts](src/chat/chat.gateway.ts)
- [src/chat/entities/chat-message.entity.ts](src/chat/entities/chat-message.entity.ts)
- [src/notifications/notifications.service.ts](src/notifications/notifications.service.ts)
- [src/notifications/notifications.controller.ts](src/notifications/notifications.controller.ts)
- [src/streams/streams.service.ts](src/streams/streams.service.ts)
- [src/streams/streams.controller.ts](src/streams/streams.controller.ts)
- [src/vods/vods.service.ts](src/vods/vods.service.ts)
- [src/vods/vods.controller.ts](src/vods/vods.controller.ts)
- [src/vods/entities/vod.entity.ts](src/vods/entities/vod.entity.ts)
- [src/chat/entities/chat-message.entity.ts](src/chat/entities/chat-message.entity.ts)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/NOTIFICATIONS.md](docs/NOTIFICATIONS.md)

What needs to be fixed:

- Replace the placeholder category service with real CRUD and listing behavior.
- Add the missing entity relations or explicit rationale for chat messages, VODs, and categories.
- Harden chat message creation and moderation so ownership and validation are enforced.
- Improve notification delivery semantics and make the SSE story match the deployment reality.
- Add a real schema migration for any missing tables or columns instead of relying on ad hoc sync behavior.
- Make the docs match the implemented realtime behavior.
- Add a real consumer for `vod.process` so stream ending has an actual downstream effect.
- Decide how `streamer.settings.updated` and `chat.message.deleted` should be consumed, then wire the consumer or document the intentional no-op.

Why this lane is isolated:

- This lane stays inside discovery, chat, notifications, streams, VODs, migrations, and docs.
- No other person should edit these files while this lane is active.

## Merge Discipline

- Person 1 should merge last for bootstrap and TypeORM registration changes if possible.
- Person 2 should keep all monetization and admin changes inside their lane and avoid root wiring unless absolutely required.
- Person 3 should avoid touching auth, monetization, or bootstrap files.
- If a shared file becomes unavoidable, stop and coordinate before editing it.

## Suggested Order If You Want Fewer Conflicts

1. Start Person 1 on auth token persistence and identity wiring.
2. In parallel, Person 2 should remove any subscription-tier assumptions and focus on payment abstraction plus admin guards.
3. Person 3 should land the categories CRUD, then add the `vod.process` consumer and the realtime cleanup.
4. If a file must be shared, let the owning lane finish first and keep the shared edit as a short follow-up commit.

## Person 4: Frontend, UX, and API Contract Readiness

Owns the frontend-facing work that keeps the API easy to consume while the backend lanes move forward. Since this workspace does not currently contain frontend source files, this lane should either create the frontend app in the separate frontend repo or produce the contract and UX scaffolding that frontend needs.

Files to create:

- [docs/FRONTEND_HANDOFF.md](docs/FRONTEND_HANDOFF.md)
- [docs/API_CONTRACTS.md](docs/API_CONTRACTS.md)
- [docs/FRONTEND_GAPS.md](docs/FRONTEND_GAPS.md)
- [docs/UI_STATES.md](docs/UI_STATES.md)
- [docs/FRONTEND_TODO.md](docs/FRONTEND_TODO.md)

Files to edit:

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/NOTIFICATIONS.md](docs/NOTIFICATIONS.md)
- [readme.md](readme.md)
- [src/auth/auth.controller.ts](src/auth/auth.controller.ts)
- [src/users/users.controller.ts](src/users/users.controller.ts)
- [src/streams/streams.controller.ts](src/streams/streams.controller.ts)
- [src/chat/chat.docs.controller.ts](src/chat/chat.docs.controller.ts)
- [src/notifications/notifications.controller.ts](src/notifications/notifications.controller.ts)
- [src/donations/donations.controller.ts](src/donations/donations.controller.ts)
- [src/categories/categories.controller.ts](src/categories/categories.controller.ts)
- [src/vods/vods.controller.ts](src/vods/vods.controller.ts)

What needs to be fixed:

- Define the frontend routes, pages, and core user flows that match the backend API.
- Identify the screens blocked by missing backend work and document their dependencies.
- Create a frontend handoff doc with endpoint names, payloads, auth expectations, and realtime event contracts.
- Document UI states for login, stream viewing, chat, notifications, donations, profile, and streamer setup.
- If the frontend repo exists separately, start the app scaffold and wire the API client there.

Why this lane is isolated:

- This lane focuses on the frontend contract and UX surface, so it should not touch core backend implementation.
- If frontend code lives in a separate repo, this lane can proceed there without colliding with backend feature work.

Merge guidance for Person 4:

- Prefer additive docs and frontend scaffolding over backend refactors.
- If a frontend screen reveals an API gap, record it in the handoff instead of changing backend code unless the owning lane agrees.
- Treat this lane as the consumer-facing planning pass after the backend feature lanes land.
