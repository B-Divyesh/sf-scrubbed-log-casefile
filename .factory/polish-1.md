# Polish 1 — review finding closure

Date: 2026-08-28 UTC  
Base: `b78bdbc70472c94346f2913006de2e4786e1937d`

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Removed the untestable merchant-of-record, payment/refund, and refund-revocation promises from the paid card, Terms, README, and copy audit. The tested $19 pack promise remains. | `@claim:team-policy-pack`; `npm run test:e2e` (31/31); cold live home has no `.merchant` text at <https://scrubbed-log-casefile.sociobot.in>. |
| F-1-2 | The browser-local claim now fills a unique sentinel, clicks **Scrub this fragment**, records request URL and body, checks local/session storage, IndexedDB, and every Cache Storage response, then resets the demo. | `@claim:browser-local`; clean-clone claim pass; cold live demo flow recorded no sentinel in request, storage, IndexedDB, or caches at <https://scrubbed-log-casefile.sociobot.in/demo/>. |
| F-1-3 | Contained the evidence figure inside its grid column at every width, retained its concrete/moss stamp and hard shadow, and kept the caption visible on phone widths. | `hero evidence and caption stay within the 390px viewport`; `hero evidence and caption stay within the 1440px viewport`; `/tmp/casefile-live.zlmSAI/recheck-desktop.png`; `/tmp/casefile-live.zlmSAI/recheck-mobile.png`; cold live rectangle assertions passed. |
| F-1-4 | Added an explicit polite route announcer and route-focus module. Header navigation marks in-site moves; destination `<h1 tabindex="-1">` receives focus on forward navigation and back/forward restoration. | `normal routes keep navigation, announce the destination, and focus its h1 on forward and back`; cold live `/` → `/privacy/` → Back assertion passed at <https://scrubbed-log-casefile.sociobot.in>. |
| F-1-5 | Made the four-link header consistent on demo, legal, 404, and home routes. Replaced “THE CHAIN OF CUSTODY” / “From raw incident to sealed case” with “HOW IT WORKS” / “Scrub and package an incident log.” Mobile keeps all four 44px navigation targets. | `normal routes keep navigation…`; `keyboard, 200% text, touch targets, and accessibility pass at 390px`; live header text and mobile target assertions passed. |

## Additional acceptance work

- The first-screen action now uses `?demo=1`; it redirects to the existing
  isolated `/demo/` sandbox with the persistent banner, reset, and real-start
  control. The demo remains in memory only. Evidence:
  `the ?demo=1 entry point opens the isolated demo with its banner and reset control`.
- Added the `license-storage` public privacy claim and its fixture-backed
  regression. It verifies query cleanup, local token/verdict storage, and the
  sole Sociobot verification endpoint.
- Updated `.factory/catalog-description.txt` with a 66-character, verb-first
  description.

## Deployment evidence

- Repair commit: `893a2043f3b63428c1e1a9751209040e9697fc51`
- Deployment ID: `14c4f411-a83c-477f-9f2b-8135eb531d92`
- Cold live URL: <https://scrubbed-log-casefile.sociobot.in>
- `verify-url.sh` evidence: `/tmp/casefile-live.zlmSAI/verify.json`
- Live screenshots: `/tmp/casefile-live.zlmSAI/recheck-desktop.png` and
  `/tmp/casefile-live.zlmSAI/recheck-mobile.png`
