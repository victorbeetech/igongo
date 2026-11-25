# 83. SEO & Online Presence

**Group:** Marketing and growth · **Module key:** `seo-online-presence` · [All modules](README.md)

## Summary

Everything that helps people find Igongo online and measures what works: search engines, Google Maps, app stores, social media, booking sites and tracking. Victor Bee Technologies runs marketing for the hotel, so every setup step is part of this system.

## Features

### Search engines (SEO)
- Editable page titles, descriptions, keywords and clean addresses for every website page, room, event, menu item, tour and shop product.
- Structured data so Google shows rich results: Hotel, Restaurant, Menu, Event, Museum (TouristAttraction), Product, Review ratings, FAQ and breadcrumbs.
- Automatic sitemap and robots file, updated when content changes.
- Canonical links, redirects manager and broken link report.
- Fast pages: image compression, modern formats, caching, and Core Web Vitals reports.
- Search Console and Bing Webmaster connected, with indexing and keyword reports.
- Pages in more than one language, with the right language tags.
- Local SEO: name, address and phone kept the same everywhere.

### Google Business Profile and maps
- Profile for the hotel, and separate ones for the museum, restaurant and spa if wanted.
- Photos, opening hours, booking and menu links kept in sync from the system.
- Reviews from Google shown in [Feedback, Complaints & Reviews](56-guest-feedback.md), with replies.
- Listings on Apple Maps, Bing Places and TripAdvisor.

### App stores (ASO)
- App name, subtitle, keywords, descriptions, screenshots and preview video for the Play Store and the App Store.
- Store listings in each language.
- Ratings prompt in the app after a good experience.
- Deep links and smart app banners, so a website visitor can open the same page in the app.

### Social media
- Open Graph and social cards for every shareable page.
- Share buttons on events, offers, menu items and tours.
- Links to and from Facebook, Instagram, TikTok, X, YouTube and LinkedIn.
- Social posting calendar for offers and events.

### Tracking and analytics
- Google Analytics 4 and Google Tag Manager, with consent banner.
- Meta Pixel, TikTok Pixel and Google Ads conversion tracking.
- Campaign links (UTM) on every marketing message.
- Bookings and orders tracked from first visit to payment, by channel.
- Monthly marketing report: traffic, sources, conversions and revenue by channel.

### Booking channels
- Links and content kept consistent on Booking.com, Expedia, Hotels.com and TripAdvisor.
- Direct booking offers to win guests from the booking sites.

### Content
- Blog and news with categories, authors and scheduling.
- Landing pages for campaigns, such as weddings, school trips or Christmas.
- Email newsletter sign-up, sent to [Marketing Campaigns](58-campaigns.md).

## Super admin options
- Titles, descriptions and structured data per page.
- Which tracking tools are switched on, and the consent wording.
- Redirects and sitemap rules.
- Who can edit SEO, store listings and social settings.


## Depends on

- [Public Website & Online Booking](75-public-website.md)
- [Languages, Wording & Branding](12-languages-wording.md)
- [Files & Media](11-files-media.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `seo.page_updated`
- `sitemap.rebuilt`
- `review.imported`
- `conversion.tracked`

## If this module is switched off or fails

The website and app keep working. Search data, tracking and listing sync pause.
