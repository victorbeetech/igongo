# Theme (step 1 of the build checklist)

**Status:** proposal, waiting for approval. The colours are sampled straight from the hotel's logo files, and the fonts match the logo. Version 0.4.

The values live in one file, [`packages/design-tokens/tokens.json`](../../packages/design-tokens/tokens.json), which both the Flutter app and the web read. No screen sets its own colour or font size, so the whole app stays uniform with the logo.

[Back to the build checklist](../BUILD-CHECKLIST.md) · [Brand guide](../../packages/brand/README.md)

## Colours

| Token | Light | Dark | From the logo | Used for |
| --- | --- | --- | --- | --- |
| Primary (Igongo red) | `#B8292F` | `#B8292F` | The spiral and the IGONGO name | App bar, main buttons, active tabs, badges, the logo |
| Primary text | `#B8292F` | `#F6F1EC` | | Links and highlighted words. In dark mode these are cream with a red underline or icon, so the red itself never changes |
| Primary dark | `#8F292A` | `#8F292A` | The horizontal logo's name | Pressed buttons, status bar |
| Primary container | `#F7E1DF` | `#5A1616` | | Selected chips, highlighted cards |
| Secondary (charcoal) | `#222323` | `#F6F1EC` | The subtitle | Second buttons, icons |
| Brand ink | `#000000` | `#F6F1EC` | The horns and cup | Logo use only |
| Background (cream) | `#F6F1EC` | `#1A1210` | The reversed logo | Screen background |
| Surface | `#FFFFFF` | `#241A17` | | Cards, sheets, dialogs |
| Text | `#1C1C1C` | `#F6F1EC` | | Main text |
| Muted text | `#665C56` | `#B3A69F` | | Hints, captions, timestamps |
| Border | `#E2D9D1` | `#3D302B` | | Dividers and card edges (decorative) |
| Outline | `#857A73` | `#857670` | | Field outlines, switch tracks and other edges you must see (3:1) |
| Success | `#256B43` | `#6CC08F` | | Paid, approved, on duty |
| Warning | `#855600` | `#E0B25A` | | Late, pending, low |
| Error | `#B3261E` | `#FF8A80` | | Failed, refused, overdue |
| On error | `#FFFFFF` | `#1A1210` | | Text on danger buttons |
| Info | `#2F6690` | `#8DB9DE` | | Tips, and the client view banner |

**Contrast checks (WCAG 2.2 AA):** every pair the app and web draw, in both modes, is checked by [`tools/contrast-check`](../../tools/contrast-check/check_contrast.py) (4.5:1 for text, 3:1 for icons, outlines, focus rings and chart marks). All pass: see the [contrast report](contrast-report.md). Igongo red on the dark background is only 3:1, so in dark mode red is used for filled shapes (buttons, bars, badges, the logo), and small red marks (links, icons, focus rings, chart bars) use **Primary text**, which is cream there. A failing pair is fixed in `tokens.json`, never in a screen.

Because the brand is red, errors are never shown by colour alone. They always carry an icon and a message.

## Fonts

The two fonts of the logo, so the app and the logo match:

- **Cinzel** (the IGONGO name) for brand moments only: the splash, welcome and hero titles, and big dashboard numbers. It is all capitals, so it is never used for normal text.
- **Lato** (the subtitle) for everything else: titles, body, buttons and labels. It stays clear at small sizes, and its tabular figures keep money and times lined up.
- Both are free (SIL Open Font License), kept in [`packages/brand/fonts`](../../packages/brand/fonts), and bundled in the app so they work offline.

## Text sizes

Small by default, as you asked, but sized for each part of the screen and adjustable for people with different eyesight.

| Style | Size | Font | Used for |
| --- | --- | --- | --- |
| Display | 26 | Cinzel | Welcome titles, big dashboard numbers |
| Headline | 20 | Lato Bold | Screen titles |
| Title | 16 | Lato Semibold | Card titles, section headers |
| Subtitle | 14 | Lato Semibold | List item names |
| Body | 13 | Lato | Normal text |
| Label | 12 | Lato Medium | Buttons, chips, tabs, form labels |
| Caption | 11 | Lato | Timestamps and hints. Nothing is ever smaller than 11. |

**Text size setting.** Each person picks Compact, Standard, Comfortable, Large or Extra large in Settings (0.92× to 1.5×). The phone's own text size is respected too, and every screen is tested at 1.5× so nothing gets cut off.

**Defaults by device.** The super admin sets the default per role and per device. Phones start at Standard, tablets at Comfortable, and the kitchen display and gate kiosk at Large, so they can be read from a distance.

## Shape, spacing and motion

- Corners: 6 for small items, 10 for buttons and cards, 16 for sheets.
- Spacing steps: 2, 4, 8, 12, 16, 24, 32.
- Every tap target is at least 44 by 44, and 48 by 48 where possible.
- Animations are short (120 to 320 ms) and switch off when the phone's reduce motion setting is on.
- Loading uses the brand's spinning spiral, and the app start uses the mark that builds itself. See [the animations](../../packages/brand/README.md#animations).

## Light and dark mode

Both are included. The app follows the phone's setting, and each person can switch it in Settings (light, dark or follow the phone).

**The theme switch never changes the brand colours.** Igongo red `#B8292F`, deep red `#8F292A` and the logo's spiral are exactly the same in light and dark mode. Only the background, surfaces, text, borders and status colours change. Dark mode uses the reversed logo, with cream horns and cup, and a red spiral as always.

If the super admin changes the brand colours in the [Languages & Wording](../modules/12-languages-wording.md) brand kit settings, the new colours are used in both modes in the same way.

## To approve

1. The palette: Igongo red, charcoal and cream, taken from the logo.
2. The fonts: Cinzel for brand moments, Lato for everything else.
3. Small sizes with the text size setting.

Once approved, the tokens are locked as version 1.0 and every later step uses them.
