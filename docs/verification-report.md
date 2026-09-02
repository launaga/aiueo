# Verification report

Branch: `codex/aiueo-requirements-domainesia`  
Date: 2 September 2026

## Automated checks

| Check | Result |
|---|---|
| `npm run typecheck` | Passed |
| `npm run lint` | Passed |
| `npm test` | 3 files, 12 tests passed |
| `ADMIN_DEMO_MODE=true ... npm run test:e2e` | 104 passed, 4 capture-only tests skipped |
| Broken-link crawl | Passed on every rendered public internal link |
| Responsive suites | Passed at 320 px, 375 px, 390 px, and desktop widths |
| `npm run package:domainesia` | Passed on Next.js 16.3.4 |

The final route manifest marks every protected Admin page as dynamic (`ƒ`). Public locale pages are also runtime-rendered so Supabase-backed content and locale metadata remain current.

## Visual evidence

The capture-only Playwright suite passed for:

- packages desktop: `test-results/visual/packages-desktop.png`
- packages mobile: `test-results/visual/packages-mobile.png`
- costing desktop: `test-results/visual/costing-desktop.png`
- costing mobile: `test-results/visual/costing-mobile.png`

All four screenshots were inspected for content clipping, horizontal overflow, hierarchy, and mobile stacking. No visual blocker was found.

## Standalone hosting smoke test

`dist/domainesia-root/server.js` was started on port 3100 and returned HTTP 200 for `/id`, `/id/packages`, `/en/privacy`, `/admin/login`, `/robots.txt`, and `/sitemap.xml`.

Production response headers included CSP, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and strict referrer policy. The production CSP excludes development-only `unsafe-eval`.

Packaging evidence:

- unpacked application root: 61 MB
- upload archive: `dist/aiueo-domainesia-root.zip`, 31 MB
- archive SHA-256: `d9c5989b8b28d4ee9c399562f1131affaf609af3e620b59533605b1628457730`
- startup file: `server.js`
- no `.env`, Git metadata, requirement-source folder, or demo session secret in the package

## Hosting readiness

Read-only cPanel inspection confirmed the Domainesia account already serves `mglwebkits.com`, uses `/home/haloglor/mglwebkits.com/demos/swift` for `swift.mglwebkits.com`, and exposes Setup Node.js App. The AIUEO target is therefore `/home/haloglor/mglwebkits.com/demos/aiueo` with `aiueo.mglwebkits.com`. No domain, file, or Node application was changed during the inspection.

## Deliberately not applied

- The Supabase migration was verified statically and by unit tests but was not applied to a remote project, preserving the user's production/main boundary.
- The live subdomain and Node app were not created without action-time approval.
