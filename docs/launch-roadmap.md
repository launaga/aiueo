# AIUEO V2 launch roadmap

This roadmap treats the current V2 composition as the approved visual baseline. The immediate product goal is qualified conversations, not a speculative portal.

## Launch-critical

- **Trustworthy content:** confirm every photo’s ownership/consent and location caption; publish no client logo, testimonial, rating, price, event date, office address, or availability claim without a source. The placeholder public event schedule and quote-like testimonials were removed in this phase.
- **Conversion plumbing:** add the official Google Calendar Appointment Schedule URL in `site-config.js`; connect the consultation form submission event to the chosen CRM (the current phase opens a structured WhatsApp brief and deliberately stores nothing); define response-time ownership and fallback handling.
- **Legal and privacy:** provide approved Privacy Notice, Terms, cookie/analytics disclosure, retention policy, and UU PDP contact/process before storing leads. Confirm the legal entity name, tax status, and permitted business address before exposing them.
- **SEO deployment:** verify the production domain and redirects; make canonical URLs match final routes; submit `sitemap.xml`; add Search Console/Bing verification; provide a licensed 1200×630 social image; replace runtime-generated metadata with build-time/static head markup during the deployment migration.
- **Accessibility:** complete keyboard and screen-reader QA on every page; verify focus order in open menus; add focus containment if modal UI returns; check contrast after final images/copy; test at 200% zoom and with reduced motion.
- **Performance:** convert large photography to responsive AVIF/WebP with width/height and `srcset`; self-host/subset fonts; set immutable caching and compression; record Core Web Vitals on production hosting.
- **Security/operations:** deploy over HTTPS with CSP, HSTS, Referrer-Policy, Permissions-Policy, and secure headers; keep form endpoints server-side with rate limiting, validation, spam protection, and log redaction when CRM capture is enabled.

## Next

- Replace the JavaScript language swap with route-based localized content (`/id/` and `/en/`) generated from one content source. Add `hreflang`, localized canonicals, and localized schema.
- Consolidate News into a small Insights section only when real articles exist. Keep Events as an honest empty state until a confirmed program has date, venue, capacity, registration status, and owner.
- Add an FAQ sourced from real sales questions, then add `FAQPage` schema only while the same answers are visible on the page.
- Connect HubSpot (or the confirmed CRM) using a serverless/server endpoint; map PIC name, role, company, source, pax, destination, date, and consent. Continue to WhatsApp after a successful capture.
- Supply an approved showreel/recap video, WebVTT captions, poster, duration, and rights metadata. Only then activate the video component and add `VideoObject` schema.
- Add real case studies with problem, constraints, format, and measured/approved outcomes. Do not infer results.
- Create package/destination landing pages only from services AIUEO has actually delivered and operational data that the team can maintain.

## Later, gated by evidence

- **Client account:** only after the PRD triggers are met: repeat demand, sustained volume, and legal/payment prerequisites. Use managed auth; never implement password storage in this static site.
- **Admin:** start with CRM/CMS/no-code operations. Build custom RBAC only when workflow volume justifies it. Superadmin and finance require MFA; authorization must be enforced server-side.
- **Customer portal:** event status, documents, itinerary, booking history, and payment tracking belong in a separate application surface, not this marketing-site bundle.
- **Vendor/TL tooling:** gated behind supplier depth, liability coverage, and event volume. Preserve offline/WhatsApp fallback for field operations.

## Phase completed in this implementation

- Central page-title/description/canonical/Open Graph/Twitter metadata and safe Organization/WebSite/WebPage/Service/Breadcrumb schema.
- `robots.txt` and `sitemap.xml`.
- Structured WhatsApp consultation with campaign attribution and no local PII storage.
- Config-gated Google Appointment Schedule path with an explicit business-input requirement.
- Reusable itinerary data/component with transport, meal, and activity markers.
- Video-ready responsive media component with controls when activated, poster, save-data-aware preload, and image fallback.
- Removed fake login UI, invented public dates, visual service numbering, and unsupported testimonial-style quotes.

