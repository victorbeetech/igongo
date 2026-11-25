# 12. Languages, Wording & Branding

**Group:** Core platform · **Module key:** `languages-wording` · [All modules](README.md)

## Summary

Controls every word, label and brand element in every app, so the super admin can rename "Leave" to "Time off" or add Runyankore without a developer.

## Features
- Edit any text in any screen, button, message or receipt.
- Languages: English first, with Runyankore, Luganda, Swahili or French addable.
- Each person picks their language; the super admin picks the default per role.
- Brand kit: logos, colours, fonts and photos for apps, receipts, cards and emails.
- Different brand looks for the hotel, the museum, the spa and events if wanted.
- Missing-translation report.

## Super admin options
- Edit wording and translations.
- Add or hide languages.
- Upload brand assets and pick where each is used.


## Depends on

- [Files & Media](11-files-media.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `wording.published`
- `brand.updated`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
