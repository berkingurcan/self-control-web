# Self Control Fight Academy

Aurum Arena website implementation in SvelteKit 3, Svelte 5 and TypeScript. Turkish is the default language; English has its own `/en` routes. One shared codebase produces four separately branded Cloudflare deployments.

## Run locally

Use Node 24 (see `.nvmrc`).

```sh
nvm use
npm ci
PUBLIC_ENABLE_PREVIEWS=true npm run dev
```

Open the URL printed by Vite. The default development port is 5173.

- Academy: `/`
- Muay Thai: `/preview/muaythai`
- Kick Box: `/preview/kickbox`
- MMA: `/preview/mma`
- English: append `/en` to the corresponding homepage.

Preview routes are enabled only with `PUBLIC_ENABLE_PREVIEWS=true`. Production projects must use `false`.

## Deploy to Cloudflare

The repository supports the dashboard's **Create an app → Git repository → `npx wrangler deploy`** flow. The checked-in `wrangler.jsonc` declares the Worker entrypoint, static assets binding, Node compatibility and build command. Wrangler uses this configuration directly; it does not need to auto-configure SvelteKit or insert `wrangler types --check` into the build script. `worker-configuration.d.ts` is included. Full setup in Turkish: [Cloudflare deployment](docs/CLOUDFLARE_WORKERS_TR.md).

Connect `berkingurcan/self-control-web`, use the `main` branch and leave the root directory empty. Keep **Deploy command** as `npx wrangler deploy`. Wrangler runs `npm run build` through the configuration's custom build step. The tested Node version is `24.12.0` (`.nvmrc`, or `NODE_VERSION`). Set the public build variables:

```env
PUBLIC_SITE_ID=academy
PUBLIC_ENABLE_PREVIEWS=false
PUBLIC_INDEXABLE=false
```

The default Worker name is `self-control-web`. If the dashboard's Worker name differs, use `npx wrangler deploy --name YOUR_WORKER_NAME` in its deploy command. For separate discipline deployments, reuse this repository, choose `PUBLIC_SITE_ID=muaythai`, `kickbox` or `mma`, and pass the corresponding Worker name. The `nodejs_compat` flag is already in the repository configuration.

The initial URL is under `workers.dev`. Add the existing canonical domains through each Worker's **Settings → Domains & Routes** when ready: `selfcontrolfightacademy.com`, `muaythai.selfcontrolfightacademy.com`, `kickbox.selfcontrolfightacademy.com`, and `mma.selfcontrolfightacademy.com`. Before these are attached, cross-site links still point to the canonical domains. A design-review deployment with `PUBLIC_ENABLE_PREVIEWS=true` keeps all identities reachable under `/preview/...` on one origin. Both `workers.dev` and `pages.dev` hostnames receive a `noindex` response header.

Set `SHEETS_SPREADSHEET_URL` as a Worker runtime secret to enable live schedule and pricing. Public build variables and runtime secrets have separate dashboard settings. The `/api/content` endpoint runs on the Worker. Static HTML, images, fonts and PWA files use the `ASSETS` binding. No deployed account resources or DNS records are changed by editing these files.

Validation and local preview:

```sh
npm run check
npm run build:all
npm test
npm run deploy:check
npm run preview:cloudflare
```

`deploy:check` performs the real Wrangler build and upload bundling with `--dry-run`; it does not publish. `preview:cloudflare` starts the local Worker. `npm run deploy` publishes using Wrangler when authorized. Generate binding types after configuration changes with `npm run cf:types`; the application build does not depend on a missing generated type file.

Each identity's build is copied to `builds/{identity}/cloudflare`, with its server modules preserved beside it. These ignored verification artifacts are not uploaded as source. The adapter's `.assetsignore` keeps `_worker.js` and deployment metadata out of public static assets. Static responses use the root `_headers` rules; dynamic responses use `src/hooks.server.ts`. The postbuild script finalizes the offline shell in `.svelte-kit/cloudflare`.

### Contact configuration

Contact details can be set in Cloudflare Workers → **self-control-web → Settings → Variables and Secrets** as runtime variables. The `/api/config` endpoint exposes only the four public contact fields below; the page and enquiry links refresh them on load, when returning to the tab, and every five minutes. A Sheets failure does not prevent contact details from loading. Publish the variable changes in Cloudflare; subsequent changes do not require rebuilding the frontend. `keep_vars` preserves dashboard variables during Wrangler deployments.

For local development, copy `.env.example` to `.env`. Build-time contact values remain a fallback if a runtime binding is absent. `PUBLIC_SITE_ID`, `PUBLIC_ENABLE_PREVIEWS` and `PUBLIC_INDEXABLE` still require build-time variables and a rebuild. A `workers.dev` URL belongs to a Worker: variables on a separate Pages project will not reach it.

- `PUBLIC_CONTACT_EMAIL`: actual public academy email.
- `PUBLIC_WHATSAPP`: country code and number, digits only; no plus sign required.
- `PUBLIC_INSTAGRAM`: username only, without a URL or `@`.
- `PUBLIC_ADDRESS`: verified public address.

The supplied business number +90 534 858 97 65 is the default WhatsApp and telephone destination. Unconfigured email, address and Instagram rows are omitted. The site has no enquiry form. Once real contact destinations are configured, visitors can use direct email, WhatsApp and Instagram links. There is no contact database, paid API, newsletter service or booking backend in this version.

## One-page structure and navigation

Each identity has one complete homepage per language: `/` (Turkish) and `/en` (English). The academy also has a dedicated head trainer profile at `/gokhandenizli` and `/en/gokhandenizli`; discipline sites have no trainer sections or profile pages. On the homepage, the header and mobile bottom bar scroll to sections. On the trainer profile, they return to the corresponding homepage section. Language switching preserves the current homepage section or stays on the translated head trainer profile. Discipline section numbers remain sequential after the approach and trainer sections are omitted.

- `#top`: identity-specific hero and first action.
- `#training`: discipline selection on the academy, technical focus on discipline sites.
- `#academy`: philosophy and expandable values, only on the main academy site. Discipline pages omit this section and its navigation links.
- `#space`: gym photography with a native gallery dialog, touch swipe, arrows and keyboard controls.
- `#trainers`: academy-only head trainer feature linking to a separate profile page. Other coach cards and profile dialogs are omitted across all identities.
- `#schedule`: interactive sample weekly timetable with discipline and day filters; monthly, 6-month and annual sample membership plans (`#membership`).
- `#start`: WhatsApp messaging and telephone links, plus email, address and Instagram when configured. No enquiry form or FAQ section.
- Privacy and PWA installation open in native dialogs without leaving the page.

Legacy routes such as `/antrenmanlar`, `/akademi`, `/program`, `/basla` and English equivalents redirect to their new sections. `/gizlilik` and `/en/privacy` open the privacy dialog through `#privacy`. The academy build prerenders four HTML pages: two homepages and two head trainer profiles. Each discipline build prerenders only its two localized homepages; trainer profile URLs return 404.

## Design system

- Academy: carbon `#080808`, white `#FFFFFF`; monochrome imagery.
- Muay Thai: jade alloy `#B7D19C`, shadow `#263D2D`.
- Kick Box: blue steel `#AAC6E6`, shadow `#253B55`.
- MMA: red copper `#E0A097`, shadow `#4B2729`.
- Display typography: locally hosted Barlow Condensed ExtraBold, with solid Turkish headings.
- UI typography: locally hosted Poppins Medium.
- Supplied original emblem and wordmark paths retained in SVG. Team headers use only the SELF CONTROL line plus a colour-coded, title-case discipline descriptor. The academy retains its full signature.
- White editorial academy hero with oversized overlapping type, monochrome photography, an emblem seal and a three-discipline photo selector; full-image dark discipline heroes with one metal accent. The academy hero uses brief entrance choreography, pointer-only photographic depth and matching localized discipline links. Native buttons support keyboard selection; decorative movement respects reduced-motion preferences. Progressive scroll reveals, section-aware navigation, reading progress, desktop-only restrained tilt, image zoom and native gallery dialogs. Editorial content remains visible without JavaScript; live schedules and prices require JavaScript.
- Phone-first heroes with the action in the initial viewport, mobile bottom navigation, safe-area spacing, 44px+ primary controls, touch gallery navigation and a seven-day timetable selector.

`src/lib/site.ts` contains base localized copy, routing and identity tokens. `src/lib/editorial.ts` contains the one-page editorial copy. `src/lib/demo.ts` contains explicitly labelled sample sessions, bilingual head coach copy and portrait mapping; pricing lives in `src/lib/data/memberships.json`; `TrainingSchedule.svelte` renders the timetable and plans. `src/lib/effects.ts` contains progressive motion/touch enhancements. `src/lib/config.ts` reads explicitly public build settings. Components are under `src/lib/components`; page composition is in `src/lib/components/OnePage.svelte`; shared styles are in `src/app.css`.

## PWA and offline behavior

Every production build generates an identity-specific manifest, app name, icon and maskable icon. It includes an Apple touch icon and home-screen shortcuts. A service worker precaches public localized pages, compiled JS/CSS, fonts and stock imagery. Navigations use network-first responses; cached public pages and a bilingual offline fallback are available when the network fails. Request bodies, query-string requests, external URLs and API endpoints are not cached. Offline pages display a connectivity notice and may be out of date.

Installation is available only in supported browsers over HTTPS (or localhost). Android/Chromium can show the native install prompt when eligible; iOS uses Safari → Share → Add to Home Screen. The design-review paths share the academy installation identity. Separately deployed discipline origins each get their own installation identity and browser storage. Native iOS/Android device installation still needs a real-device check after production deployment; browser layout checks do not substitute for that.

The service worker intentionally does not force-update an already open app. New versions activate when older controlled tabs close. Clear site data to reset a development installation.

## Verification

```sh
npm run check
npm run build:all
npm test
```

Tests verify all four build identities, four localized academy documents and two per discipline, academy-only head trainer routing and fifteen-photo profile galleries, all required section anchors and dialogs, local navigation targets, manifests/icons, noindex defaults and offline cache/fallback behavior. Browser review covers Turkish and English layouts at phone, tablet and desktop widths, plus language switching, menu section navigation, gym gallery, contact layouts, timetable selection and installation instructions. Real-device installation and touch gestures should be checked after deployment.

The dependency lockfile pins the Cloudflare adapter and Wrangler alongside the existing framework versions. Use Node 24 and `npm ci` for repeatable installs.

## Before the public business launch

Discipline introductions still use illustrative stock photography; replace these with licensed academy training photos when available. Add verified address, contact channels, coach biographies, training groups, schedule, prices and participation rules. Review the business's legal identity and KVKK/privacy text alongside actual data collection. Then set `PUBLIC_INDEXABLE=true` and redeploy. Canonicals, Turkish/English alternate links, social images and sitemap are generated for the configured domain. Confirm the final domains and real devices before announcing the site.

## Photography

The facilities gallery uses all five supplied originals from `../salon/`, exported as responsive 640px and 1280px WebP files under `static/images/salon/` (under 1 MB total). The photographs retain their original colour and aspect ratios; the lightbox shows each full frame. `Facilities.svelte` presents the main hall, upper-floor grappling area and lower-floor heavy bags/CrossFit area, plus the MMA cage and conditioning equipment, in Turkish and English.

Pexels photographs remain in discipline introductions. They illustrate training and do not portray academy members. Credits are visible in the footer.

- Gleb Krasnoborov — https://www.pexels.com/photo/two-men-practicing-martial-arts-2628210/
- Juliia Abramova — https://www.pexels.com/photo/woman-doing-muay-thai-training-12121709/
- Daniel Lee — https://www.pexels.com/photo/female-fighter-training-with-kickboxing-techniques-34990409/
- Duren Williams — https://www.pexels.com/photo/two-men-wrestling-11391987/

The grappling photograph illustrates the ground component of MMA. No UFC, ONE, supplier or federation affiliation is implied.

The academy head trainer feature presents Gökhan Denizli with original photos supplied in the sibling `gökhandenizli` folder and the workspace files `gokhan1.JPG` (profile hero) and `gokhan2.JPG` (academy introduction). The responsive WebP assets in `static/images/gokhan` have two widths (640 and 1280), with metadata removed. Discipline photographs remain illustrative; facilities photography is from the supplied academy archive.


## Sample timetable and pricing

The current design intentionally includes demo business content requested for review. All schedule and pricing screens carry a visible sample notice in both languages. The timetable has 18 sessions across Monday–Saturday, a Sunday rest state, discipline filters on the academy, and only the relevant discipline on each team site. Day changes update the class count and list without navigating.

| Package | Monthly | 6 months, upfront | 12 months, upfront |
| --- | ---: | ---: | ---: |
| All disciplines | ₺4,500 | ₺22,500 | ₺39,600 |
| Muay Thai | ₺3,000 | ₺15,300 | ₺27,000 |
| Kick Box | ₺5,000 | ₺18,000 | — |
| MMA | ₺3,500 | ₺18,000 | ₺31,200 |

The longer plans display their full upfront price, monthly equivalent and rounded saving against monthly payments. These are sample prices, not researched market rates or a real sales offer. Kick Box uses the supplied 1/3/6-month reference prices (₺5,000 / ₺12,000 / ₺18,000), with no annual plan in that reference. Package CTAs open a prepared enquiry containing the selected package; they do not take payments or reserve classes. All-access memberships cover all three disciplines, single-discipline memberships cover the selected branch. Private lessons and equipment are excluded from the sample plans.


## Dedicated head trainer profile

The head portrait, role title and “View profile” link all open `/gokhandenizli` (Turkish) or `/en/gokhandenizli` (English), on the academy, preserving its preview prefix. Discipline sites do not show trainers or expose head trainer profiles. The main academy and discipline homepages remain one-page layouts. The profile has a hero with an original portrait, biography and fifteen-photo responsive bento grid. Gallery photographs open in a native lightbox with previous/next controls, keyboard arrows and touch swipe. Profile photographs come from the supplied coach archive. The bilingual biography follows the supplied profile text and covers qualifications, training in the Netherlands and Thailand, professional camps, athlete development and the academy. Legacy `/bas-antrenor` and `/en/head-trainer` URLs redirect permanently to the corresponding new profile route.

`src/lib/head-trainer.ts` contains bilingual profile copy and the fifteen-image gallery mapping. `HeadTrainer.svelte` contains the profile design. Only the academy sitemap, language alternates, canonical URLs and offline precaching include both profile languages.


## Membership catalogue and private lessons

`src/lib/data/memberships.json` is the data source for membership pricing. Its shape is described by `MembershipCatalog` in `src/lib/memberships.ts`. Group packages are variable-length arrays per identity (`months`, `price`), so the UI supports 1/3/6 months as well as 1/6/12 months. The Kick Box group values come from the supplied screenshot; the other identities retain their previous demo group packages.

Private lesson options use `participants` (1–4), `sessionMinutes` (60), and a `packages` array containing `lessons`, `price`, and `validityMonths`. All prices are **per person for the whole package**, not the total price of the private group. A single-lesson package has null validity because the reference does not specify an expiry. The 8/16/24 lesson packages use 1/2/3-month validity from the reference. The same sample private catalogue is currently available on all four identities.

```json
{
  "participants": 2,
  "sessionMinutes": 60,
  "packages": [
    { "lessons": 8, "price": 14000, "validityMonths": 1 },
    { "lessons": 16, "price": 22000, "validityMonths": 2 },
    { "lessons": 24, "price": 28000, "validityMonths": 3 }
  ]
}
```

The membership section switches between group classes and private lessons. Participants and package selection update the per-person package total, per-lesson equivalent and validity without navigation. Changing participant count preserves the chosen lesson count when available, otherwise it selects 8 lessons. Package CTAs open an accessible enquiry preview; no payment or reservation is submitted. Both languages use the same numeric catalogue.


## Mobile experience and enquiries

The mobile dock links directly to training, timetable, memberships and contact. While the membership section is on screen, it becomes a compact selected-package summary with a navigation button and enquiry action. Only one fixed dock is shown; it respects the device safe area. The price, package cards and enquiry share per-page Svelte context, avoiding cross-request state on the server.

Group cards show the full per-person package price, monthly equivalent and a shared expandable benefits section. Private options use native radio controls. TR/EN links carry validated numeric package selections in query parameters. No personal information is stored. `selection.ts` validates these values against the catalogue and locks team pages to their own discipline.

The enquiry modal displays the exact selection and a prepared message. Set `PUBLIC_WHATSAPP` to an international number (country code included, 10–15 digits) and/or `PUBLIC_CONTACT_EMAIL` to enable the corresponding outbound links. Until then, visitors can copy the message; no fake contact destination is used. Opening WhatsApp only prepares a draft: the visitor sends it themselves. Sample catalogue status is included in the draft.

The timetable opens on the current day in the configured gym timezone, shows all classes for the selected day and discipline, and highlights the next sample weekly session. The next-class clock refreshes every minute. All timetable content remains illustrative. Calendar export is deferred until actual dated sessions and the gym timezone are confirmed.

Heroes offer timetable and pricing shortcuts. A bilingual first-session guide covers level, scheduling and equipment confirmation. Native modal navigation and enquiries support Escape, focus containment and focus return. New price animation respects reduced motion. Essential pricing details are at least 12px, with touch-sized label controls. Real trainer photography and verified credentials still require academy content.

## Google Sheets content source

Set the server-only `SHEETS_SPREADSHEET_URL` to the standard public-view Google Sheets URL. Four named tabs (`Ayarlar`, `Program`, `Grup Paketleri`, `Özel Dersler`) supply runtime content to `/api/content`. No API key is needed for a publicly viewable file. Without a configured URL, the bundled sample content remains available. Once configured, a failed fetch never silently reverts to demo prices.

The Turkish upload workbook is supplied separately. Full owner instructions, column rules, Cloudflare setup and cache limitations: [Google Sheets setup in Turkish](docs/GOOGLE_SHEETS_TR.md).

Private pricing can vary by scope through `privateLessonsBySite`. Legacy bundled JSON retains its shared private catalogue. The live importer supports inactive/empty catalogues, per-person pricing, optional English labels and the configured gym timezone. A native SvelteKit server function validates all four tabs together, limits responses, restricts upstream hosts and caches successful reads. Successful responses advertise a five-minute shared-cache lifetime; Cloudflare Worker responses are not assumed to enter a shared CDN cache automatically. The warm Worker instance reuses successful reads for five minutes; last-confirmed data can be shown with an explicit stale notice for up to one hour. The server's warm cache is not durable storage; a cold-start failure returns unavailable. Browser storage is optional and checked before use.

Prices, timetable, mobile summary and prepared enquiry all read the same page-local content context. Only the dynamic API reads the private configuration. Static home/profile pages remain prerendered, while timetable and price content loads after hydration and refreshes without redeployment. With a live `Yayında` status, sample schedule/price labels are replaced; trainer stock content remains marked as illustrative.

Source references: [Google spreadsheet query parameters](https://developers.google.com/chart/interactive/docs/spreadsheets), [CSV response protocol](https://developers.google.com/chart/interactive/docs/dev/implementing_data_source), [Cloudflare SvelteKit deployment](https://developers.cloudflare.com/workers/framework-guides/web-apps/sveltekit/), [SvelteKit environment variables](https://svelte.dev/docs/kit/environment-variables).

## Website copy

The discipline homepages share a split hero with a clear separation between typography and photography, their existing sage/blue/clay accents and direct links between branches. `DisciplineHero.svelte` and `DisciplineTraining.svelte` contain the responsive layouts; `src/lib/discipline-copy.ts` contains the branch-specific Turkish and English introductions and expandable training areas. Pointer depth is shared with the academy through `heroDepth` in `effects.ts` and respects reduced-motion preferences.

Turkish visitor copy uses a consistent, polite tone suited to the academy in Denizli. Headings describe training, classes and memberships directly. English copy is written naturally rather than translated word for word. `siteName(id, lang)` localizes discipline names, including Kick Boks / Kickboxing. The hero, discipline pages, coach profiles, schedule, memberships, enquiries, navigation, accessibility labels, metadata and offline messages follow the same wording. Sample schedules, prices, profiles and photography remain identified as illustrative. No contact details, qualifications or achievements have been invented.
