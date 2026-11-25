# The Igongo web portal (Next.js)

The web portal for staff, managers and the super admin, and the public pages for guests. Every page comes from the approved screen inventory. This is the **clickable UI with sample data**; there is no back end yet.

## Run it

```bash
pnpm install          # from the repository root
pnpm web:dev          # http://localhost:3000
pnpm web:build        # builds all 639 pages ahead of time
pnpm web:lint         # ESLint with zero warnings, then the type check
pnpm --filter @igongo/web build:preview   # one static page (screens routed by #/path) to host anywhere
pnpm --filter @igongo/web test:e2e        # axe accessibility on every page, light and dark, plus screenshots
```

## Hosted preview (Cloudflare)

The clickable preview with sample data is live at **https://igongo.victorbee.com**. It opens on the role switcher, and every portal (staff, managers, super admin) is reached from there. It is the static preview build served as Cloudflare Workers static assets, set up in `wrangler.jsonc`:

- **SPA fallback.** Screens live after `#` (such as `/#/settings`), so a reload never 404s, and any unknown path returns the preview page.
- **No indexing.** `cloudflare/_headers` sends `X-Robots-Tag: noindex`, `robots.txt` disallows everything, and every page's meta tag says noindex (`NEXT_PUBLIC_NOINDEX=1`). SEO stays off until the hotel confirms.
- **HTTPS and DNS** come with the Worker's custom domain; Cloudflare makes the record and the certificate.

Deploy from your computer (once: `npx wrangler login` with the Cloudflare account):

```bash
pnpm --filter @igongo/web deploy:cloudflare   # builds, prepares out/ (scripts/prepare-cloudflare.mjs), then wrangler deploy
```

`test:e2e` needs the preview build in `out/`. Screenshots live in `e2e/screenshots/`; redraw them with `--update-snapshots` after an approved design change.

**Sidebar.** Every portal has a sidebar that is open by default. The fold button sits inside it, at the top, and folds it to an icon rail (remembered per browser). On phones it opens from the menu button as a drawer. Its search (Ctrl or Cmd+K) finds modules, every page and every pop-up, not only the menu entries.

**Design system.** `/design-system` shows the brand, colours, type, buttons, fields, chips, cards, dialogs, toasts and illustrations in light and dark. It also opens from the preview panel.

`predev` and `prebuild` copy the logos, fonts, card and icons from `packages/brand` into `public/brand` (not committed), so the brand kit stays the only source.

Use the **sliders icon** in the red bar for the preview panel (role, screen state, theme, text size). Dialogs open from the address, such as `/settings?dialog=sign-out-confirmation`.

## Folders

| Folder | What it holds |
| --- | --- |
| `src/app/` | The root layout (fonts, meta tags, consent, analytics), the one catch-all route, sitemap, robots and manifest |
| `src/modules/mNN-<slug>/` | One folder per module: its generated screens and sample data, plus any hand-made pages under `presentation/` |
| `src/shared/catalog/` | Types and lookups for screens, dialogs, modules and roles |
| `src/shared/ui/<component>/` | One folder per reusable component |
| `src/shared/screens/<kind>/` | The ten shared layouts, one per screen kind |
| `src/shared/layout/` | The portal frame (red bar, role menu), the sign-in frame and the public site frame |
| `src/shared/dialogs/` | The one dialog host for every inventory dialog |
| `src/shared/seo/`, `src/shared/analytics/` | Page meta tags, Hotel structured data, consent banner and Google Tag Manager |

## SEO and marketing

- Every page has its own title, description, canonical address and sharing tags. Public pages are indexed; portal pages say `noindex`.
- `/sitemap.xml` lists the public pages; `/robots.txt` points to it.
- The front page carries Hotel and TouristAttraction structured data.
- Google Tag Manager (GA4, Meta Pixel, TikTok Pixel, Google Ads) loads only after the visitor accepts cookies, and only when `NEXT_PUBLIC_GTM_ID` is set. Set `NEXT_PUBLIC_SITE_URL` per environment.
