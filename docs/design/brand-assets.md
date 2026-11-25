# Brand assets (step 2 of the build checklist)

**Status:** done, waiting for approval.

The brand kit is in [`packages/brand`](../../packages/brand/README.md). It was built from the hotel's original logo files:

1. The original mark was traced into a clean master vector, with the spiral, the two horns and the cup as separate parts.
2. The logo's colours were sampled exactly: Igongo red `#B8292F`, black, charcoal `#222323` and cream `#F6F1EC`.
3. The logo's fonts were matched: Cinzel for the IGONGO name and Lato for the subtitle. Both are free, and the text is converted to outlines.
4. Every asset was generated from that one master, so they all match.

[Back to the build checklist](../BUILD-CHECKLIST.md)

## What was made

| Group | Files |
| --- | --- |
| Logos | 6 layouts (stacked, horizontal, mark, spiral, wordmark, name) × 5 colourways (colour, reversed, black, white, red), each as SVG and as PNG at 256, 512, 1024 and 2048 px |
| App icons | Android launcher (legacy, round, adaptive with themed monochrome) at every density, notification icon, iOS icon set (light, dark, tinted) and every legacy size, Play Store icon |
| Splash | Android 12+ splash icons, centre logos at 1x, 2x and 3x, light and dark, with previews |
| Web | favicon.ico, SVG favicon with dark mode, PNG favicons, Apple touch icon, PWA and maskable icons, web manifest, social share image, head tags |
| Store | Play Store feature graphic |
| Animations | Splash intro, stacked and horizontal logo intros (letters rise one by one), spiral spinner, mark loader and pulse, as Lottie, animated SVG, GIF and MP4, light and dark |
| ID cards | 10 templates (6 portrait, 4 landscape), front and back, with live fields, print-ready CR80 PDFs, a template manifest and card types (NTAG213 now, NTAG 424 DNA later) |
| Print | Wristbands (guest, VIP, crew), QR sticker, business card, name badge, A4 letterhead, thermal receipt headers (58 and 80 mm), email header and signature, watermark |
| Social | Profile pictures, covers for Facebook, X, LinkedIn, YouTube and Google Business, post and story templates |
| Patterns | Repeating spiral pattern on cream, red and dark |

## Consistency rules

- Only the files in `packages/brand/` are used. No screen loads its own copy of the logo.
- Only the approved colours from the [design tokens](../../packages/design-tokens/tokens.json).
- The full rules are in the [brand guide](../../packages/brand/README.md#rules).

## To approve

1. The redrawn logos in all colourways ([overview](../../packages/brand/preview/brand-overview.png)).
2. The app icon and splash screen.
3. The animations.
4. The ID card templates ([library](../../packages/brand/cards/preview/card-library.png)).
5. The print, stationery and social media designs.
