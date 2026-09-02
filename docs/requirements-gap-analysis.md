# AIUEO requirements inventory and gap analysis

Audit date: 2 September 2026  
Feature branch: `codex/aiueo-requirements-domainesia`  
Source folder: `AIUEO WEBSITE REQUIREMENTS` under the MGL AIUEO event-template workspace.

## Interpretation rule

The documents repeatedly distinguish **specification** from **permission to build**. The controlling rule is the newest explicit phase gate:

- Phase 0 may run now: public company profile, indicative packages, structured consultation handoff, internal single-user costing, and operational no-code/SOP artifacts.
- Client portal, custom RBAC/ops, invoicing/payment, Vendor portal, and TL PWA are **not implementation gaps** until their written business/legal triggers are evidenced.
- Unknown business facts—PT/PKP, corporate bank account, insurance, vendor prices, rights, testimonials, and legal approval—must never be fabricated in code.

## Markdown inventory

| File | SHA-256 | Scope |
|---|---|---|
| `7A-Kontrak-Klien-SME.md` | `f87d7a8f2937ef892aeb5c1f13a236f87f55a4e6dd5e14786056cdd83245df3c` | Standard client contract draft |
| `7B-Kontrak-Klien-Enterprise.md` | `6ccecbdfd806384112f7d8b433c38eca254b2725407171b523582f9864c54105` | Enterprise contract defense map |
| `7C-PO-Vendor.md` | `e30c7a90a783a9075553d733e5c600ec4c8015efe92ec5de0ce4ce5ff17a3d9d` | Vendor PO and cash rules |
| `7D-Change-Order.md` | `1fe2a44ca3c30b669e0864ac23d13d474d16e9062a75f713507518676a251142` | Change Order form and enforcement |
| `7E-Waiver-dan-Safety-Attestation.md` | `67508eedd6ee0f1dcbd4794974ec7e3cc81c1b72d1751ea5ed438a379ff93d12` | Participant waiver and vendor safety |
| `8A-Event-Execution-Runbook.md` | `1ef213de1659331eccefd0e74453abfc2ff46ae5add7a264905efcccea6fcab0` | Event execution runbook |
| `8B-Program-Orang-Kedua.md` | `a36e03c2237e3f9df8557bbaec326e07c9aaaa4688231cde47ccdc8baa1f3fbd` | Second-person/TL development |
| `8C-Key-Man-Asset-Access-Register.md` | `fa8ebfa607df59b5352b903fe7df43fd38be5df84abcbd4b2958a397734baf56` | Key-person access register |
| `AIUEO-Tech-Master-Plan-2Y.md` | `0ba0a3b9efbd11dc023102b1732f9a15c467d8f98c98a1120387168dd894fc52` | Durable architecture and phase gates |
| `PRD-AIUEO-Admin-v2.md` | `e071bc4fd98ef4402f5d8772bb947be871e3a7009f0b0f53516764e7b8107b2d` | Latest Admin/ops phasing |
| `PRD-AIUEO-Admin.md` | `400228c706d4deeeb1a530326a4de756d859f16b7fca845bfe360cf6ccca22f7` | Admin/ops foundation |
| `PRD-AIUEO-MVP-Client-v2.md` | `dd48e8489242309ce7d1a658a4f2765d3d05181099be679b8527b5e8fc99c9c9` | Internal-first client journey |
| `PRD-AIUEO-Quote-Costing.md` | `9d391fc125ff6809d088b1858cc4f94b7effc7038daae79f5d502bda9d69b844` | Costing rules and roadmap |
| `PRD-AIUEO-TL-PWA.md` | `b71923ee3cbfbd110efea6aa27819bdab57144de3a2ee4cf459ecb25387de3ac` | Gated field PWA |
| `PRD-AIUEO-Vendor.md` | `9d728131adc0afbaa31e3eb7cb61343cdf9e428b9492c861bb78cabba32b2fd2` | Internal vendor record and gates |
| `PRD-AIUEO-Website.md` | `7cacf79aa4952e6ffa8b15930774f44034c2428f718fbf88711cdafe599c45d5` | Public Website Phase 0 |
| `PRD-aiueo-quote-calculator.md` | `4f73dd9f2925b01f1c57be3e1327fd18d8b712e02cfe8ac59057b5175025fddd` | Latest single-user calculator contract |

Non-Markdown implementation artifacts inspected: `aiueo-quote-calculator.jsx`, `aiueo-quote-calculator (1).jsx`, and `aiueo-deck-generator.jsx`. The second calculator is the latest fully-loaded/overhead variant and is the basis of the typed implementation.

## Requirement checklist

| Requirement | Source | Status | Evidence / blocker |
|---|---|---|---|
| No fake partner/client logos or invented proof | Website §5.1, launch roadmap | Complete | Public Next.js surface contains no partner-logo claim; gallery uses project media only. |
| Public Home, About, Services, Gallery, Contact | Website §5.1 | Complete | `app/[locale]/[[...slug]]/page.tsx`, public components. |
| ID/EN crawlable routes and metadata | Website/brief | Complete | Locale routes, canonical/hreflang, sitemap, tests. |
| Three indicative packages: Garut, Cikereteg, Pangalengan | Website §5.1; Client §5 | Complete | `lib/site-content.ts`, `components/public/public-page.tsx`, `/id|en/packages`. Prices are explicitly indicative, never fixed. |
| Structured brief fields: PIC name/role, company, source, pax, destination, date | Website §5.2; Admin v2 I.1 | Complete | `components/public/contact-form.tsx`. |
| Continue to WhatsApp with structured message and campaign attribution | Website §5.2 | Complete | Client-side brief builder; no website lead persistence. |
| Lead capture into HubSpot | Website §5.3; Admin v2 I.1 | External input required | Not connected: no approved HubSpot account/property mapping, legal basis, retention, or lead owner. User also requested no additional hosting technology. |
| Do not store portal PII/payment before legal gates | Website §11 | Complete | Contact Server Action removed; migration disables public lead inserts; privacy page documents behavior. |
| Official booking link only when confirmed | Website §5.3; Admin v2 I.2 | Config-gated | `NEXT_PUBLIC_CALENDAR_APPOINTMENT_URL`; hidden when absent. |
| Privacy and website terms before storage/analytics | Website brief/launch | Complete for current non-persistent flow | `/id|en/privacy`, `/id|en/terms`; no analytics added. Legal review is still recommended before production. |
| CMS content, bilingual fields, draft/publish, preview | Existing Admin CMS requirement | Complete | Existing Admin content editor and protected preview retained. |
| Viewer read-only and Super Admin demo | User mandate | Complete | Signed HTTP-only demo session; mutations remain disabled/no-op in demo. |
| Supabase server-side auth/RBAC/RLS | User mandate; Admin III | Complete for CMS | Role table (not user metadata), RLS, server authorization, private helpers, schema tests. |
| Disable public registration | Admin/Auth | Complete | No signup UI; setup docs require disabling signups. |
| Internal single-user fully-loaded calculator | Calculator PRD v1 | Complete | `lib/costing.ts`, `components/admin/costing-calculator.tsx`, `/admin/costing`. |
| Per-pax/per-event/per-unit classification | Quote F1 | Complete | Editable typed cost rows. |
| Paying and complimentary pax | Quote F2 | Complete | Comp pax included in costs, excluded from revenue; unit tests. |
| Margin/markup equivalence | Quote F3 | Complete | Both modes and equivalents displayed/tested. |
| Contingency, ad-hoc buffer, overhead, optional tax display | Calculator v1 | Complete | Multiplicative source-of-truth stack. Tax rate defaults to 0 and must be verified. |
| Price, cost, profit, margin, break-even | Quote F5 | Complete | Sticky result panel and unit tests. |
| Margin floor and break-even blocking warning | Quote F6 | Complete | Red guardrail below 20% or break-even; 20–25% caution. |
| −20% pax fragility | Quote F7 | Complete | Calculated and displayed. |
| Vendor stale-price warning | Quote F10 | Complete | Missing or >90-day lock date is flagged. |
| Print/PDF output | Client C5 / Quote F11 | Complete (browser print) | “Cetak / simpan PDF”; no cloud storage. |
| Monthly overhead reality check | Calculator v1 | Complete | Absolute overhead ÷ event calculation and tests. |
| Cloud quote save/templates/CRM integration | Calculator Non-Goals/Future | Gated | Latest calculator PRD explicitly keeps this single-user and local until volume triggers. |
| Admin ops platform / client portal | Admin v2 II–III; Website Phase 2 | Gated | Requires legal shell + sustained ≥1 event/month + repeat-buy. Deliberately not built. |
| Vendor portal/scoring engine | Vendor roadmap; Website Phase 3 | Gated | Requires third-party vendor volume and ≥8–10 events/month. |
| TL offline-first PWA | TL §0b | Gated | Requires repeat-buy and a real-event shadow run. Interim checklist/WA is an operating process, not this website. |
| Payment gateway, tax invoice, enterprise branch | Master Plan Phase 1 | Blocked by business/legal | Requires active PT, PKP, and corporate bank account. |
| Liability hard gate and real insurance | Admin IV.1; TL R1 | Blocked by external fact | Software cannot create cover. Real policy evidence is required before event execution features go live. |
| Contracts, PO, waiver, safety attestation | 7A–7E | External legal/operations | Drafts exist in source folder; each explicitly requires lawyer/tax/broker/vendor validation before use. Not published as final legal documents. |
| Runbook, second-person program, access register | 8A–8C | External operations | Must be executed with real people, access, event evidence, and business accounts. Cannot be truthfully marked complete by code. |
| Self-host without Vercel lock-in | User hosting direction | Complete in repository | Next.js standalone output, `npm run package:domainesia`, isolated `dist/domainesia-root`, cPanel instructions. |
| Live subdomain `aiueo.mglwebkits.com` | User hosting direction | Ready, awaiting action-time approval | cPanel access and Node.js App support were verified; no Node app exists yet. Creating the public subdomain/app and uploading the package require the user's final approval. |

## Security decisions

- Public brief data stays in the browser until the visitor chooses to open/send WhatsApp.
- Historical `contact_leads` remains admin-readable, but anonymous and authenticated inserts are revoked.
- Supabase publishable values may be browser-visible; secret/admin keys remain server-only.
- Security headers are emitted by Next.js. Admin routes remain uncached/user-specific.
- The Domainesia package contains no `.env`, Git metadata, source requirement documents, or demo secret.

## Verification evidence

The final verification commands and browser artifacts are recorded in `docs/verification-report.md` after the full test pass.
