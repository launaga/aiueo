# AIUEO product architecture decision (legacy static reference)

> Arsitektur aktif setelah migrasi ada di [cms-architecture.md](cms-architecture.md). Dokumen ini dipertahankan sebagai catatan keputusan versi statis sebelumnya.

## Decision now

Keep the approved static V2 front end for the current launch phase. Add shared configuration, content behavior, SEO metadata, and conversion logic without a framework rewrite. Deploy it as static assets behind a CDN once routes and production metadata are finalized.

This is the smallest architecture that supports today’s validated job: discovery and structured lead handoff. The existing multi-page HTML is fast to ship and easy to host; a backend is not justified merely to imitate account screens.

## Recommended staged migration

### Stage 0 — marketing and lead capture

- Static site/CDN.
- One structured content source for services, itinerary, navigation, and localization.
- CRM as lead source of truth (HubSpot per existing PRD, pending operational confirmation).
- Small serverless lead endpoint only when approved: strict schema validation, idempotency key, rate limiting, bot protection, CRM secret server-side, minimal logs, and explicit success/fallback states.
- Google Appointment Schedule and WhatsApp as external conversion surfaces.

### Stage 1 — content operations

Adopt a small static-site generator or framework only when manual page drift becomes costly. Generate semantic HTML at build time, retain current CSS and composition, and use locale files for `/id/` and `/en/`. A headless CMS is justified only when a named content owner and publishing workflow exist.

### Stage 2 — authenticated product (gated)

Build a separate application surface such as `app.aiu-eo.com`, preferably a modular monolith with managed PostgreSQL, object storage, and managed auth (Supabase/Auth0 or the then-current approved provider). Marketing and portal deployments remain separate while sharing brand tokens and selected content models.

Core roles: `customer`, `sales_ops`, `finance`, `tour_leader`, `content_editor`, `admin`, `superadmin`. Customer access is scoped to their organization/events; internal permissions are explicit. MFA is mandatory for privileged and finance roles. All authorization is server-side and audited.

Core entities: Organization, UserMembership, Lead, Deal, Event, Place, ItineraryDay, ItineraryItem, Service, MediaAsset, Booking, Document, PaymentMilestone, Availability, ContentEntry, SeoFields, StatusTransition, and AuditLog. Preserve `terms_profile` (`standard|enterprise`), multi-event tenancy, price-lock dates, liability coverage gate, and explicit status transitions from the existing PRDs.

Account flow: invitation or verified signup policy; email verification; managed password reset; session rotation/revocation; device/session view; profile and privacy controls; booking/event history; export/deletion request workflow. Do not expose an account CTA until the backend and support process are live.

Admin modules: services, events/trips, itineraries, media rights/status, leads/bookings, localized content, SEO, availability, and audit-friendly status management. Destructive or financial actions require tighter permission and durable logs.

## Analytics

Start with privacy-respecting, event-level measurement: CTA viewed/clicked, form validation failure, WhatsApp handoff, calendar click, service viewed, language changed, and campaign parameters. Never send form field values or personal data to analytics. Define consent requirements before enabling non-essential tracking.

## Consequential tradeoffs

- Runtime metadata/localization is acceptable for this prototype phase but not the final SEO architecture; build-time HTML is the target.
- External scheduling/CRM reduces custom-code risk but creates vendor dependency; configuration and export ownership must remain with AIUEO.
- A separate future portal avoids coupling sensitive data and authentication to the marketing site, at the cost of two deployments later. That cost is justified only after the PRD gates are met.
