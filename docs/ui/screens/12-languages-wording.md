# S12. Languages, Wording & Branding

[All screens](README.md) · [Module spec](../../modules/12-languages-wording.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s12-01"></a>S12-01 | Wording editor | Web | `/languages-wording/wording-editor/:id` | Search and edit any text in the apps | Role home, [S01-01 Console home](01-super-admin.md#s01-01) | S12-02 Languages, S12-04 Brand kit |
| <a id="s12-02"></a>S12-02 | Languages | Web | `/languages-wording/languages` | Add, hide and set default languages | S12-01 Wording editor | S12-03 Translation editor |
| <a id="s12-03"></a>S12-03 | Translation editor | Web | `/languages-wording/translation-editor/:id` | Side by side translation with missing items | S12-02 Languages | Back only |
| <a id="s12-04"></a>S12-04 | Brand kit | Web | `/languages-wording/brand-kit` | Logos, colours and fonts used across the system | S12-01 Wording editor | Back only |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
