# Self Control Fight Academy

Aurum Arena website implementation in SvelteKit 3, Svelte 5 and TypeScript. Turkish is the default language; English has its own `/en` routes. One shared codebase produces four separately branded Vercel projects.

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

## Deploy to Vercel

Push this project to your Git provider, then import the **same repository four times** into Vercel. If this folder is inside a larger repository, set Root Directory to `self-control-web`. Use the SvelteKit framework preset, Node 24, install command `npm ci`, and build command `npm run build`. Leave the output-directory override unset: `@sveltejs/adapter-vercel` creates the Build Output API directory automatically.

| Vercel project | `PUBLIC_SITE_ID` | Custom domain |
| --- | --- | --- |
| self-control-academy | academy | selfcontrolfightacademy.com |
| self-control-muaythai | muaythai | muaythai.selfcontrolfightacademy.com |
| self-control-kickbox | kickbox | kickbox.selfcontrolfightacademy.com |
| self-control-mma | mma | mma.selfcontrolfightacademy.com |

For every production project set `PUBLIC_ENABLE_PREVIEWS=false` and initially `PUBLIC_INDEXABLE=false`. Add each listed domain in that project's domain settings and apply the DNS records **shown by Vercel**. There is no need for a wildcard domain or runtime hostname routing. A `www` alias can redirect to the academy apex domain.

No production domain is connected by this repository. Vercel account setup, billing and DNS have not been changed.

The four production builds can be generated locally with `npm run build:all`. Complete Vercel output directories are copied to `builds/{identity}/output`. They are verification artifacts; normal Git-based Vercel deployments should build from source with the environment settings above.

### Contact configuration

Copy `.env.example` to `.env` locally or set equivalent **public build-time** environment variables in Vercel. Redeploy after changing them.

- `PUBLIC_CONTACT_EMAIL`: actual public academy email.
- `PUBLIC_WHATSAPP`: country code and number, digits only; no plus sign required.
- `PUBLIC_INSTAGRAM`: username only, without a URL or `@`.
- `PUBLIC_ADDRESS`: verified public address.

Without these values, the site displays intentional placeholders. The site has no enquiry form. Once real contact destinations are configured, visitors can use direct email, WhatsApp and Instagram links. There is no contact database, paid API, newsletter service or booking backend in this version.

## One-page structure and navigation

Each identity has one complete homepage per language: `/` (Turkish) and `/en` (English), plus a dedicated head trainer profile at `/bas-antrenor` and `/en/head-trainer`. On the homepage, the header and mobile bottom bar scroll to sections. On the trainer profile, they return to the corresponding homepage section. Language switching preserves the current homepage section or stays on the translated head trainer profile. Discipline section numbers remain sequential after the approach section is omitted.

- `#top`: identity-specific hero and first action.
- `#training`: discipline selection on the academy, technical focus on discipline sites.
- `#academy`: philosophy and expandable values, only on the main academy site. Discipline pages omit this section and its navigation links.
- `#space`: gym photography with a native gallery dialog, touch swipe, arrows and keyboard controls.
- `#trainers`: head trainer feature linking to a separate profile page, plus team cards with profile dialogs.
- `#schedule`: interactive sample weekly timetable with discipline and day filters; monthly, 6-month and annual sample membership plans (`#membership`).
- FAQ disclosures and `#start`: direct contact details, with no enquiry form.
- Privacy and PWA installation open in native dialogs without leaving the page.

Legacy routes such as `/antrenmanlar`, `/akademi`, `/program`, `/basla` and English equivalents redirect to their new sections. `/gizlilik` and `/en/privacy` open the privacy dialog through `#privacy`. Each production build prerenders four HTML pages: two homepages and two head trainer profiles.

## Design system

- Academy: carbon `#080808`, white `#FFFFFF`; monochrome imagery.
- Muay Thai: jade alloy `#B7D19C`, shadow `#263D2D`.
- Kick Box: blue steel `#AAC6E6`, shadow `#253B55`.
- MMA: red copper `#E0A097`, shadow `#4B2729`.
- Display typography: locally hosted Barlow Condensed ExtraBold, with solid Turkish headings.
- UI typography: locally hosted Poppins Medium.
- Supplied original emblem and wordmark paths retained in SVG. Team headers use only the SELF CONTROL line plus a colour-coded, title-case discipline descriptor. The academy retains its full signature.
- White, minimal academy hero with a framed signature; full-image dark discipline heroes with one metal accent. Progressive scroll reveals, section-aware navigation, reading progress, desktop-only restrained tilt, image zoom and native gallery/profile dialogs. Content remains visible without JavaScript, and reduced-motion preferences disable decorative movement.
- Phone-first heroes with the action in the initial viewport, mobile bottom navigation, safe-area spacing, 44px+ primary controls, portrait trainer cards with native horizontal scrolling on phones, touch gallery navigation and a seven-day timetable selector.

`src/lib/site.ts` contains base localized copy, routing and identity tokens. `src/lib/editorial.ts` contains the one-page editorial copy. `src/lib/demo.ts` contains explicitly labelled sample sessions, bilingual coaching copy and portrait mapping; pricing lives in `src/lib/data/memberships.json`; `TrainingSchedule.svelte` renders the timetable and plans. `src/lib/effects.ts` contains progressive motion/touch enhancements. `src/lib/config.ts` reads explicitly public build settings. Components are under `src/lib/components`; page composition is in `src/lib/components/OnePage.svelte`; shared styles are in `src/app.css`.

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

Tests verify all four build identities, four localized documents per production output, head trainer routing and six-image bento galleries, all required section anchors and dialogs, local navigation targets, manifests/icons, noindex defaults and offline cache/fallback behavior. Browser review covers Turkish and English layouts at phone, tablet and desktop widths, plus language switching, menu section navigation, gym gallery, trainer dialogs, contact layouts, timetable selection, FAQ and installation instructions. Real-device installation and touch gestures should be checked after deployment.

The dependency lockfile is included. Patched glob/minimatch versions are pinned through overrides for the Vercel build dependency chain. The current dependency audit still reports low-severity issues in the upstream build-time dependency tree; no high or critical issues were reported. Do not use `npm audit fix --force` blindly: npm currently suggests incompatible framework downgrades.

## Before the public business launch

Replace stock photography with licensed academy photos when available. Add verified address, contact channels, coach biographies, training groups, schedule, prices and participation rules. Review the business's legal identity and KVKK/privacy text alongside actual data collection. Then set `PUBLIC_INDEXABLE=true` and redeploy. Canonicals, Turkish/English alternate links, social images and sitemap are generated for the configured domain. Confirm the final domains and real devices before announcing the site.

## Photography

Temporary Pexels images are self-hosted as responsive WebP files. They illustrate the discipline and do not portray academy premises, members or coaches. Credits are also visible in the footer.

- Gleb Krasnoborov — https://www.pexels.com/photo/two-men-practicing-martial-arts-2628210/
- Juliia Abramova — https://www.pexels.com/photo/woman-doing-muay-thai-training-12121709/
- Daniel Lee — https://www.pexels.com/photo/female-fighter-training-with-kickboxing-techniques-34990409/
- Duren Williams — https://www.pexels.com/photo/two-men-wrestling-11391987/

The grappling photograph illustrates the ground component of MMA. No UFC, ONE, supplier or federation affiliation is implied.

New gym and coaching references (also credited in the footer):

- RDNE Stock project — https://www.pexels.com/photo/empty-boxing-gym-8611244/
- Ron Lach — https://www.pexels.com/photo/empty-boxing-ring-8744796/
- Mikhail Nilov — https://www.pexels.com/photo/man-training-a-woman-in-boxing-6740346/

Trainer cards use separate stock portraits and role-based sample profiles. Stock subjects are not identified as actual academy staff; names, qualifications and achievements have not been invented. Replace `trainer-*`, `coach`, `gym`, `ring` and discipline image assets with actual material when available.


## Sample timetable and pricing

The current design intentionally includes demo business content requested for review. All schedule and pricing screens carry a visible sample notice in both languages. The timetable has 18 sessions across Monday–Saturday, a Sunday rest state, discipline filters on the academy, and only the relevant discipline on each team site. Day changes update the class count and list without navigating.

| Package | Monthly | 6 months, upfront | 12 months, upfront |
| --- | ---: | ---: | ---: |
| All disciplines | ₺4,500 | ₺22,500 | ₺39,600 |
| Muay Thai | ₺3,000 | ₺15,300 | ₺27,000 |
| Kick Box | ₺5,000 | ₺18,000 | — |
| MMA | ₺3,500 | ₺18,000 | ₺31,200 |

The longer plans display their full upfront price, monthly equivalent and rounded saving against monthly payments. These are sample prices, not researched market rates or a real sales offer. Kick Box uses the supplied 1/3/6-month reference prices (₺5,000 / ₺12,000 / ₺18,000), with no annual plan in that reference. CTAs scroll to contact; they do not take payments or reserve classes. All-access memberships cover all three disciplines, single-discipline memberships cover the selected branch. Private lessons and equipment are excluded from the sample plans.

Additional self-hosted stock portraits:

- RDNE Stock project — https://www.pexels.com/photo/a-man-with-clenched-fists-8611936/
- Gustavo Fring — https://www.pexels.com/photo/portrait-of-boxer-during-training-6699099/
- Annushka Ahuja — https://www.pexels.com/photo/portrait-of-boxer-on-ring-7991903/
- Amirr Zolfaghari — https://www.pexels.com/photo/black-and-white-boxer-in-training-pose-30323312/


## Dedicated head trainer profile

The head portrait, role title and “View profile” link all open `/bas-antrenor` (Turkish) or `/en/head-trainer` (English), within the current identity and preview prefix. The main academy and discipline homepages remain one-page layouts. The profile has a dedicated portrait hero, biography, coaching principles and six-photo responsive bento grid. Gallery photographs open in a native lightbox with previous/next controls, keyboard arrows and touch swipe. The portrait, training and gym images are explicitly illustrative stock; the gallery does not claim all subjects are the same person. The biography is sample editorial copy, with no invented name, qualification or record.

`src/lib/head-trainer.ts` contains bilingual profile copy and the six-image gallery mapping. `HeadTrainer.svelte` contains the profile design. Sitemap, language alternates, canonical URLs and offline precaching include both profile languages.


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

The membership section switches between group classes and private lessons. Participants and package selection update the per-person package total, per-lesson equivalent and validity without navigation. Changing participant count selects the 8-lesson option when available. The contact CTA scrolls to existing contact information; no payment or reservation is submitted. Both languages use the same numeric catalogue.
