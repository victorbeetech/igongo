# Igongo brand kit

Every logo, icon, splash screen, animation and print design used by the Igongo app, the web portal and the website. All of it is built from **one master vector** of the hotel's mark and the logo's two fonts, so every asset matches.

![Brand overview](preview/brand-overview.png)

[Theme](../../docs/design/theme.md) · [Design tokens](../design-tokens/tokens.json) · [Build checklist](../../docs/BUILD-CHECKLIST.md)

## Rules

1. **Use only these files.** No app, page or print job keeps its own copy of the logo. Link to or copy from here.
2. **Never redraw, stretch, rotate, recolour or add effects** to the logo. Use one of the five colourways below.
3. **Clear space:** keep empty space around the logo of at least the height of the cup. The files already include it.
4. **Minimum sizes:** stacked logo 120 px (25 mm) wide, horizontal logo 160 px (35 mm) wide, mark 24 px (6 mm) tall. Below that, use the mark or the spiral alone.
5. **Backgrounds:** the colour logo on white or cream, the reversed logo on dark or on photos (with a dark overlay), the white logo on Igongo red.
6. **Fonts:** Cinzel only for the IGONGO name and brand titles. Lato for all other text.

## Colours

Sampled from the hotel's original logo files.

| Name | Hex | Where it is used |
| --- | --- | --- |
| Igongo red | `#B8292F` | The spiral, the IGONGO name, main buttons |
| Deep red | `#8F292A` | Pressed states and dark accents |
| Ink | `#000000` | The horns and the cup |
| Charcoal | `#222323` | Subtitle and secondary text |
| Cream | `#F6F1EC` | The reversed logo and the app background |
| Night | `#1A1210` | Dark mode background |

## Colourways

| Colourway | Spiral | Horns and cup | Name | When to use it |
| --- | --- | --- | --- | --- |
| `color` | Red | Black | Red | Full colour, on white or cream backgrounds |
| `reversed` | Red | Cream | Red | On dark backgrounds and photos |
| `black` | Black | Black | Black | One-colour print, receipts, stamps |
| `white` | White | White | White | On Igongo red or any strong colour |
| `red` | Red | Red | Red | One-colour print in red, merchandise, embossing |

## What is in this folder

```
packages/brand/
├── README.md                 This guide
├── source/igongo-mark.svg    The master vector of the mark (spiral, horns and cup as named parts)
├── originals/                The hotel's original logo files, renamed, kept for reference
├── fonts/                    Cinzel and Lato, with their licences
├── logo/                     Every logo layout in every colourway
│   ├── stacked/              Mark above the name and subtitle (main logo)
│   ├── horizontal/           Mark, divider, then name and subtitle (headers, letterheads)
│   ├── mark/                 The emblem alone (app icons, small spaces)
│   ├── spiral/               The spiral alone (spinners, patterns, tiny sizes)
│   ├── wordmark/             Name and subtitle without the mark
│   └── name/                 IGONGO alone
├── app-icon/
│   ├── igongo-app-icon.svg   Master icon, light and dark
│   ├── android/res/          Drop-in Android resources: launcher (legacy, round, adaptive
│   │                         with themed monochrome), notification icon, background colour
│   ├── ios/AppIcon.appiconset/   Drop-in iOS icon set: light, dark and tinted (iOS 18)
│   ├── ios/legacy/           Every older iOS size
│   └── play-store/           512 px Play Store icon
├── splash/                   Android 12+ splash icons, centre logos at 1x/2x/3x, colours, previews
├── web/                      Favicons (.ico, .svg with dark mode, PNG), Apple touch icon,
│                             PWA icons, web manifest, share image, and head-tags.html
├── store/                    Play Store feature graphic
├── animation/                Logo animations (see below)
├── print/                    Staff card, wristband, QR sticker, receipt headers, letterhead,
│                             email header, with previews
├── pattern/                  Repeating spiral pattern for backgrounds and packaging
├── preview/                  The overview image above
└── scripts/                  The scripts that build everything
```

### File names

All files are named `igongo-<layout>-<colourway>`, with the pixel width added to PNGs, for example:

- `logo/stacked/igongo-stacked-color.svg`
- `logo/horizontal/png/igongo-horizontal-reversed-1024w.png`

Every logo comes as SVG plus PNG at 256, 512, 1024 and 2048 px wide.

## Animations

Each animation is defined once (in `scripts/motion.py`) and exported in every format, so they move the same way everywhere.

| Animation | Length | What it does | Use it for |
| --- | --- | --- | --- |
| `intro-mark` | 2.2 s, once | The spiral unwinds and grows, the horns slide in, the cup rises | Splash screen and app start |
| `intro-stacked` | 3.0 s, once | The same, then the name and subtitle rise into place | Website intro, first launch |
| `loader-spiral` | 1.2 s, loops | The spiral turns | The standard loading spinner |
| `loader-mark` | 1.2 s, loops | The whole mark, with the spiral turning | Full-screen loading |
| `pulse` | 1.6 s, loops | The mark breathes gently | Waiting, pull to refresh, payment in progress |

Each one comes in light and dark versions as:

- **Lottie JSON** (`.json`) for the Flutter app, with the `lottie` package. Not made for `intro-stacked`, which contains text, so use its GIF or video.
- **Animated SVG** (`.svg`) for the web. It plays in every modern browser with no script.
- **GIF** (`.gif`) for email, WhatsApp and anywhere else.
- **MP4** (`.mp4`) for social media and presentations.

## Using the assets in the Flutter app

```yaml
# pubspec.yaml
flutter_launcher_icons:
  android: true
  ios: true
  image_path: "../../packages/brand/app-icon/ios/AppIcon.appiconset/AppIcon-1024.png"
  adaptive_icon_background: "#F6F1EC"
  adaptive_icon_foreground: "../../packages/brand/app-icon/android/res/mipmap-xxxhdpi/ic_launcher_foreground.png"
  adaptive_icon_monochrome: "../../packages/brand/app-icon/android/res/mipmap-xxxhdpi/ic_launcher_monochrome.png"

flutter_native_splash:
  color: "#F6F1EC"
  color_dark: "#1A1210"
  image: "../../packages/brand/splash/splash-logo-light@3x.png"
  image_dark: "../../packages/brand/splash/splash-logo-dark@3x.png"
  android_12:
    color: "#F6F1EC"
    color_dark: "#1A1210"
    image: "../../packages/brand/splash/android12-splash-icon-light.png"
    image_dark: "../../packages/brand/splash/android12-splash-icon-dark.png"
```

The ready-made Android resources in `app-icon/android/res/` can also be copied straight into `android/app/src/main/res/`, and `app-icon/ios/AppIcon.appiconset/` into `ios/Runner/Assets.xcassets/`.

## Using the assets on the web

Copy the files in `web/` to the site root and paste `web/head-tags.html` into the page `<head>`. The SVG favicon switches to cream horns and cup when the visitor's browser is in dark mode.

## Print templates

The print SVGs are templates. Fields in `{{double braces}}`, such as `{{full_name}}`, `{{staff_no}}`, `{{band_no}}` and `{{qr}}`, are filled in by the [NFC & QR Staff Cards](../../docs/modules/16-staff-cards.md) and [Event Wristbands](../../docs/modules/17-wristbands.md) modules when printing.

| Template | Size |
| --- | --- |
| Staff card, front and back | CR80, 85.6 × 54 mm |
| Event wristband | 250 × 25 mm |
| QR sticker | 50 × 65 mm |
| Receipt header | 58 mm (384 px) and 80 mm (576 px) thermal printers, black only |
| Letterhead | A4 |
| Email header | 600 × 150 (1200 × 300 file) |

## Rebuilding

Every folder except `source/`, `originals/`, `fonts/` and `scripts/` is generated. Never edit those files by hand. Change the master, the fonts or the scripts, then rebuild:

```bash
pip install -r packages/brand/scripts/requirements.txt   # ffmpeg is also needed
python packages/brand/scripts/build_brand.py
```

| Script | What it does |
| --- | --- |
| `scripts/trace_mark.py` | One-time: traces the hotel's original mark into `source/igongo-mark.svg` |
| `scripts/brand_kit.py` | Shared pieces: colours, colourways, the master mark, text outlines and file writing |
| `scripts/lockups.py` | The logo layouts: stacked, horizontal, mark, spiral, wordmark and name |
| `scripts/motion.py` | The animations, with their GIF, SVG and Lottie exports |
| `scripts/build_brand.py` | Builds every asset |

## Fonts and licences

Cinzel (by Natanael Gama) and Lato (by Łukasz Dziedzic) are used under the SIL Open Font License 1.1. The licences are in `fonts/`. Text in every logo file is converted to outlines, so the fonts don't need to be installed to view the logos.
