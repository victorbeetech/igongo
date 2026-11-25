# S07. Custom Fields

[All screens](README.md) · [Module spec](../../modules/07-custom-fields.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s07-01"></a>S07-01 | Record types | Web | `/custom-fields/record-types` | Every record type that can take custom fields | Role home, [S01-01 Console home](01-super-admin.md#s01-01) | S07-02 Field list |
| <a id="s07-02"></a>S07-02 | Field list | Web | `/custom-fields/field-list` | Custom fields on one record type | S07-01 Record types | S07-03 Field editor |
| <a id="s07-03"></a>S07-03 | Field editor | Web | `/custom-fields/field-editor/:id` | Type, rules, help text, conditions and permissions | S07-02 Field list | D07-01 Retire field |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d07-01"></a>D07-01 | Retire field | Warn that old data is kept but hidden | S07-03 Field editor |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
