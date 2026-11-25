# Brand assets (step 2 of the build checklist)

**Status:** waiting for the official logo file.

The website's logo is at `igongo.co.ug/wp-content/uploads/2023/06/logo.png`, but the website server returned an error when the image was requested, so it could not be viewed yet. The best source is the **original logo file from the hotel** (SVG, AI, EPS or PDF, or failing that a large PNG), with any brand guide they have. All assets below are then built from it, so the app matches the hotel's own brand exactly instead of a lookalike.

[Back to the build checklist](../BUILD-CHECKLIST.md)

## Asset list

Every asset is made from one master logo and the [theme](theme.md) colours, and kept in `packages/brand/`.

### Logo versions
- Full logo (emblem plus name), in colour, all white, and all dark.
- Emblem only (for small spaces), in the same three versions.
- Wordmark only.
- Clear space and minimum size rules.

### App icons
- Android adaptive launcher icon (foreground, background and monochrome layer for themed icons) at all densities.
- iOS app icon set, including the 1024 px App Store icon, with dark and tinted versions.
- Notification icon (white emblem, Android).
- Play Store feature graphic and store screenshots frame.

### Launch and loading
- Splash screen for Android 12+ and iOS, light and dark.
- Branded loader: the emblem with a gentle pulse, used for every loading state.
- Pull-to-refresh and skeleton loading styles in theme colours.

### Web
- Favicon (ICO, 16, 32 and 48 px), SVG favicon, Apple touch icon, and web manifest icons (192 and 512 px, maskable).
- Social sharing image (Open Graph).

### Print and hardware
- Staff ID card front and back (NFC and QR), per card type.
- Wristband print design, with number and QR code.
- Receipt header for 58 mm and 80 mm printers, and invoice letterhead (A4).
- QR stickers for tables, assets, rooms, exhibits and patrol points.

### In-app art
- Empty states, error and offline screens, success screens and illustrations in the brand style.
- Map pin for the rider and the hotel.
- Email and SMS/WhatsApp header images.

## Consistency rules

- Only the files in `packages/brand/` are used. No screen loads its own copy of the logo.
- Only the approved colours from the tokens file.
- The emblem is never stretched, recoloured outside the approved versions, or placed on a busy photo without a backing.
