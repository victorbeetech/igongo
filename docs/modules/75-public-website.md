# 75. Public Website & Online Booking

**Group:** Guests and sales · **Module key:** `public-website` · [All modules](README.md)

## Summary

The public face of the system on the web: information, booking and ordering for people without the app.

## Features
- Pages for rooms, dining, museum, events, pool, spa and shop, managed by the super admin.
- Booking and ordering using the same modules as the app.
- Photo galleries and virtual tours.
- Blog and news.
- Contact and enquiry forms.
- Search engine friendly pages and fast loading on mobile networks.

## Super admin options
- Pages, menus and content.
- Which booking types are open on the web.


## Depends on

- [Files & Media](11-files-media.md)
- [Languages, Wording & Branding](12-languages-wording.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `website.enquiry`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
