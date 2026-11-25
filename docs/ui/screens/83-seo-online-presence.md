# S83. SEO & Online Presence

[All screens](README.md) · [Module spec](../../modules/83-seo-online-presence.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s83-01"></a>S83-01 | SEO home | Web | `/seo-online-presence/seo-home` | Search, maps, listings and tracking health | Role home | S83-02 Page SEO, S83-03 Redirects, S83-04 Listings, S83-05 Tracking, S83-06 Search reports |
| <a id="s83-02"></a>S83-02 | Page SEO | Web | `/seo-online-presence/page-seo` | Titles, descriptions, addresses and structured data per page | S83-01 SEO home | Back only |
| <a id="s83-03"></a>S83-03 | Redirects | Web | `/seo-online-presence/redirects` | Redirects and broken links | S83-01 SEO home | Back only |
| <a id="s83-04"></a>S83-04 | Listings | Web | `/seo-online-presence/listings` | Google Business, Apple Maps, Bing and TripAdvisor status | S83-01 SEO home | Back only |
| <a id="s83-05"></a>S83-05 | Tracking | Web | `/seo-online-presence/tracking` | Analytics, pixels and consent settings | S83-01 SEO home | Back only |
| <a id="s83-06"></a>S83-06 | Search reports | Web | `/seo-online-presence/search-reports` | Keywords, clicks and indexing | S83-01 SEO home | Back only |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
