# Project context

- Purpose: Korean public website for 두리손잡고 사회적협동조합 and 두리손잡고 직업재활시설.
- Stack: static HTML, CSS, JavaScript; GitHub Pages. No build or required environment variables.
- Current structure: `coop.html` presents the cooperative's documented day and after-school activity services; `index.html` and the other content pages serve the vocational rehabilitation center. `assets/site.js` injects shared navigation, footer, gate, and UI behavior.
- Design: Material 3 color roles and shared component styling, with green for the cooperative and ocean blue for the center. Existing Korean line wrapping and accessibility rules remain in `rules/`.
- Branding: official supplied CI vectors in `assets/logos/` replace the temporary wordmark in the shared header/footer, entry gate and favicon. The cooperative uses its named lockup; the center uses the common logo with a separate center label. Source colors and proportions are preserved.
- Release status (2026-10-15): official CI deployed in commit `cc51bf8`, Pages run `38594866972` succeeded. Local link, functional (83/83) and accessibility (23/23) checks passed; live cooperative/center desktop/mobile, login header and entry gate verified with no overflow or browser errors. Published JS/CSS/SVG bytes match the release. See `rules/HANDOFF.md`.
- Known limits: the legacy notice board, login, and other forms use browser-local behavior. One-time donations route to telephone inquiry while verified payment details are pending; recurring donations show a service-preparation notice.
- Next: confirm the cooperative's official payment details or payment URL, then implement an actual one-time donation route if supplied. Preserve the two-site gate and verify both branches after changes.

## Feedback implementation (2026-10-19, local only)
- Cooperative now has dedicated history, notices, community board, gallery, calendar, donations and volunteer pages (`coop-*.html`), with no internship links. Service umbrella: 발달장애인지원사업; fax: 031-853-3360.
- History is transcribed from the user-supplied official legacy history URL (`?page_id=148682`); facility events are explicitly identified as historical, not current address claims.
- Facility display name is 직업재활시설. Copy paper appears in product descriptions, homepage, market card, menu and inquiry choices.
- Storage: existing facility `duri.posts.v1` preserved; cooperative notices `duri.coop.posts.v1`, community board `duri.coop.board.v1`. Client-only demo authentication is unchanged; no production security claim. New volunteer form explicitly discloses no transmission and routes real applications to the cooperative phone.
- No public events/photos/posts supplied; empty states remain. Calendar supports month navigation; adding public event management requires an agreed data source/backend. No new production dependency, DB, service or external data submission.
- Commit/push/deployment require user approval. Existing untracked workspace preserved.

- Verified local results: 22-page links, full functional 87/87, accessibility 23/23; screenshots and focused regressions in `work/gpt-feedback-20261019/`. No live release performed.

## Final copy and shared history (2026-10-19, local only)
- Facility and cooperative history pages now share the same 2018–2026 timeline from the user-provided official legacy page; each retains its own site identity and navigation.
- Reviewed all 22 public pages; rewrote promotional headlines, service/product explanations, giving/volunteering calls to action and search descriptions around participant/customer value. Historical names, contact details and operational conditions remain factual.
- Removed malformed particles, duplicated introduction and unsupported current recruitment/quality wording.
- All four example forms disclose non-transmission before entry, offer the correct branch phone, retain entered values and show an honest confirmation. No server/DB/payment added. No real applications submitted.
- `node tools/verify-copy.mjs` checks timeline equality, truthful form confirmations, phone separation, no POST, input retention and 22 pages across 1440/360/320px. Evidence: `work/gpt-copy-final-20261019/`.

- Final copy verification: functional suite 87/87; focused copy/history/form/22-page responsive checks passed. Accessibility full run 22/23, then the sole gallery-copy failure was corrected and both gallery branches passed the original condition in a targeted rerun. No unresolved finding in that checked scope; no full accessibility rerun after that isolated text correction. No commit or deployment.

## Shopping materials and Wanted Sans (2026-10-20, local only)
- `market.html`: 7 supplied products with matching photos, brochure specifications and inquiry options: jumbo rolls 300m/2-ply and 500m/1-ply (16 rolls), premium/standard hand towels (100 sheets × 50 packs), facial tissue (250 sheets × 24 boxes), Sunsu A4 80g/85g copy paper. Prices are omitted per user; price-bearing brochure is not published.
- Product images are decoded from the supplied ZIP to fixed filenames and re-encoded as WebP in `assets/products/` (about 164KB total); source files are preserved in Downloads. `products.html` and shared market navigation link to corresponding product anchors.
- All 22 pages use Wanted Sans Variable via the exact requested v1.0.1 jsDelivr CSS import in `assets/styles.css`. Form controls inherit the font. No Pretendard references remain in the public site source; remaining source comments/documentation naming is 직업재활시설.
- Security scope: public product text and raster assets only; no ZIP paths executed, production dependencies, credential changes, DB or personal data transmission added. Existing browser-local form limitations remain. CDN availability is still required for the selected font; system fallback remains available.
- Verification: `node tools/verify-market.mjs` passes actual font loading/inheritance and 1440/360/320px on all 22 pages, 7 product images/specifications/options and browser errors 0. `node tools/check-links.mjs` passes. Screenshots and standard accessibility/function checks: `work/gpt-market-20261020/`.
- Release: no commit/push/deploy; preserve all pre-existing changes. Resume at `rules/HANDOFF.md`, run `node tools/verify-market.mjs` if source changes, and obtain release approval under parent AGENTS before committing.

- Final standard suites (2026-10-20): functional 87/87 and accessibility 23/23 passed. `headless.log`, `a11y.log`, `verify-market.log` in `work/gpt-market-20261020/`. No public release.

## Production release (2026-10-20)
- User authorized commit/push/deployment. All 2026-10-19 local cooperative/history/copy work plus 2026-10-20 catalog/Wanted Sans updates deployed in `38272fb`; Pages run `39399247860` succeeded.
- Published 37 HTML/CSS/JS/WebP/SVG files match release bytes. Live browser checks passed actual Wanted Sans load/inheritance on all 22 pages at 1440/360/320px, 7 product photos/specifications/options, no prices/legacy names/overflow/page errors. Evidence: `work/gpt-release-20261020/`.
- Earlier local-only/release-pending entries above are historical and superseded by this production record. Only unrelated untracked `duri-website/Duri.code-workspace` remains preserved. Follow-up record commit changes documentation only.
- Next: read `rules/HANDOFF.md`; use `node tools/verify-market.mjs` for later product/font edits. Online form transmission/payment/backend and VoiceOver real-use remain outside this release.
