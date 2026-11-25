# Theme (step 1 of the build checklist)

**Status:** proposal, waiting for approval. The colours follow Igongo's reddish brand. They will be matched exactly to the official logo once the logo file is received (see [Brand assets](brand-assets.md)).

The values live in one file, [`packages/design-tokens/tokens.json`](../../packages/design-tokens/tokens.json), which both the Flutter app and the web read. No screen sets its own colour or font size, so the whole app stays uniform.

[Back to the build checklist](../BUILD-CHECKLIST.md)

## Colours

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| Primary (Igongo red) | `#8E1B1B` | `#E8857A` | App bar, main buttons, active tabs, links |
| Primary dark | `#6B1212` | `#C4645A` | Pressed buttons, status bar |
| Primary container | `#F6DEDA` | `#5A1616` | Selected chips, highlighted cards |
| Secondary (terracotta) | `#B5532E` | `#E39A78` | Second buttons, tags, illustrations |
| Accent (gold) | `#C9A13B` | `#D9B65A` | VIP badges, loyalty tiers, stars, small highlights only |
| Background (cream) | `#FBF7F2` | `#1A1210` | Screen background |
| Surface | `#FFFFFF` | `#241A17` | Cards, sheets, dialogs |
| Text | `#2A1C17` | `#F3ECE7` | Main text |
| Muted text | `#6E5E57` | `#B3A69F` | Hints, captions, timestamps |
| Border | `#E7DCD4` | `#3D302B` | Dividers and outlines |
| Success | `#2E7D4F` | `#6CC08F` | Paid, approved, on duty |
| Warning | `#8A5A00` | `#E0B25A` | Late, pending, low |
| Error | `#D32F2F` | `#FF8A80` | Failed, refused, overdue |
| Info | `#2F6690` | `#8DB9DE` | Tips, and the client view banner |

**Contrast checks (WCAG):** white on Igongo red is 9.0:1, text on cream is 15.4:1, muted text on cream is 5.8:1, and terracotta, success, error and warning text on cream are all above 4.5:1. Gold is used only as a fill behind dark text (6.8:1), never as thin text on cream.

Because the brand is red, errors are never shown by colour alone. They always carry an icon and a message.

## Fonts

- **Headings:** Playfair Display, a classic serif that suits a cultural resort.
- **Everything else:** Inter, which is very clear at small sizes, with tabular figures for money and times.
- Both are free Google Fonts and are bundled in the app, so they work offline.

## Text sizes

You asked for small fonts, but sized for their part of the screen and adjustable for people with different eyesight. So:

| Style | Size | Used for |
| --- | --- | --- |
| Display | 26 | Big numbers on dashboards, welcome screen |
| Headline | 20 | Screen titles |
| Title | 16 | Card titles, section headers |
| Subtitle | 14 | List item names |
| Body | 13 | Normal text |
| Label | 12 | Buttons, chips, tabs, form labels |
| Caption | 11 | Timestamps and hints. Nothing is ever smaller than 11. |

**Text size setting.** Each person picks Compact, Standard, Comfortable, Large or Extra large in Settings (from 0.92× to 1.5×). The phone's own text size setting is respected too, and every screen is tested at 1.5× so nothing gets cut off.

**Defaults by device.** The super admin sets the default per role and per device. Phones start at Standard, tablets at Comfortable, and the kitchen display and gate kiosk at Large, so they can be read from a distance.

## Shape and spacing

- Corners: 6 for small items, 10 for buttons and cards, 16 for sheets.
- Spacing steps: 2, 4, 8, 12, 16, 24, 32.
- Every tap target is at least 44 by 44, and 48 by 48 where possible.
- Animations are short (120 to 320 ms) and switch off when the phone's reduce motion setting is on.

## Light and dark mode

Both are included. The app follows the phone's setting, and each person can override it.

## To approve

1. The red, terracotta, gold and cream palette above.
2. Playfair Display with Inter.
3. Small sizes with the text size setting.

Once approved, the tokens are locked as version 1.0 and every later step uses them.
