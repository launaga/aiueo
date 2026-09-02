# AIUEO bilingual website brief

## Purpose

Turn a visitor with a vague reason to gather into a useful first conversation. The site should make AIUEO feel warm, calm, specific, and field-capable while collecting only the context needed to route that conversation.

## Primary audiences

- HR, People, GA, internal communications, brand, and business leaders planning a company moment.
- A committee member researching options before the decision-maker is ready.
- A past or referred contact looking for proof, service fit, and a direct route back to the team.

## Core jobs

1. Understand what AIUEO actually handles.
2. Decide whether the approach fits the event’s purpose and people.
3. See credible field evidence without inflated claims.
4. Share a short brief and continue through WhatsApp or a confirmed consultation calendar.

## Page architecture

- **Home:** positioning, approach, service overview, field evidence, primary conversion.
- **About:** beliefs, way of working, team capabilities. Add named people only with approved biographies and headshots.
- **Services:** overview plus eight service-detail pages. Keep these because their search intent and buyer questions differ; use one content model to avoid drift.
- **Outing & Outbound:** service detail plus reusable itinerary example; this becomes the pattern for trips and multi-place programs.
- **Gallery / Work:** visual proof. Rename to “Work” once verified case studies are available.
- **Insights:** consolidate News into this when real articles exist. Until then, do not imply a publishing cadence.
- **Events:** keep only for confirmed public programs. An honest empty state is preferable to placeholder dates.
- **Contact / Consultation:** the dominant conversion page, with WhatsApp first and Google Appointment Schedule when configured.
- **Privacy / Terms:** required before server-side lead storage or analytics requiring consent.

## Navigation

Primary: Home, About, Services, Work, Insights, Contact. Events should sit under Insights/Resources unless AIUEO runs public programs consistently. One yellow consultation CTA should remain the strongest action.

## Conversion paths

- **WhatsApp:** short form builds a structured message containing name/role, company, event type, pax, date, destination, notes, and campaign attribution. The browser opens WhatsApp; the static page stores nothing.
- **Calendar:** link directly to AIUEO’s official Google Appointment Schedule. Hide the option until the URL and calendar ownership are confirmed. The scheduler becomes the confirmation surface and should send timezone-aware reminders.
- **Fallback:** direct WhatsApp link and verified phone remain visible even if scripts or CRM submission fail.

## Language system

Phase 1 uses one source markup plus `data-id` translations for priority conversion content and a remembered ID/EN preference. The production migration should generate `/id/` and `/en/` pages from one structured content source so each language has crawlable copy, stable URLs, `hreflang`, and localized metadata without duplicated hand-edited templates.

## Media plan

- **Home hero image:** best candidate for a short brand showreel because it is the first proof point. Keep it click-to-play with controls and no audio autoplay; preserve the current image/ticket composition as the poster state.
- **Outing & Outbound proof image:** best candidate for a service recap with captions explaining route, pacing, safety preparation, and reflection. A reusable video-ready container is implemented here now; it stays an image until a licensed video URL is configured.
- **Gallery lead tile:** candidate for a recap only after the gallery has a real project record and media permissions. Do not turn every tile into motion.
- Every activated video needs an approved poster, MP4/WebM source, WebVTT captions, useful accessible label, rights owner, and duration. Use controls, `playsinline`, save-data-aware preload, reduced-motion-friendly behavior, and image fallback. Add `VideoObject` schema only for a real visible video.

## Voice

Warm, direct, specific, and calm. Describe what happens in the brief, preparation, event day, and follow-up. Avoid “world-class,” “unforgettable,” “system,” “blueprint,” invented scale, and outcome claims that cannot be substantiated.

## Required business inputs

- Official Google Appointment Schedule URL and owner.
- Approved email address, legal entity name, privacy contact, and business address (if published).
- CRM choice, property mapping, lawful basis/consent copy, retention period, and lead owner.
- Approved case studies, testimonials, client permissions, dates, metrics, and image/video rights.
- Final social sharing image and production route/domain decision.
