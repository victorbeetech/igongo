# 3. App Layout & Navigation

**Group:** Core platform · **Module key:** `app-builder` · [All modules](README.md)

## Summary

Builds every screen of the single Igongo app at runtime from the person's roles. A new role gets a working app the moment it is saved, with no app store update.

## Features

### Menus and home screens
- Drag-and-drop editor for each role's bottom menu, side menu and home screen.
- Home tiles: shortcuts, counters (such as "3 orders waiting"), charts, lists and quick actions.
- Tile visibility rules, such as "show the late arrivals tile only before 10 AM".
- Different layouts for phone, tablet, kiosk and web.

### Client view switch
- Every staff role has a "Switch to client view" button that shows the app exactly as a guest sees it.
- A clear coloured banner shows while in client view, with one tap to return.
- Orders and bookings made in client view are marked as staff test or staff personal, as the super admin chooses.

### One entry point
- The same app and the same login screen for staff, riders, managers and clients.
- After login the app reads the person's roles and builds their interface.
- Guests who have not logged in see the public client screens (menu, rooms, events, museum).

### Look and feel
- Theme colours, fonts, light and dark mode, and splash screen for each app surface.
- Screen templates (list, detail, form, board, map, calendar) that any module can use.
- Offline cache of the layout so the app opens with no network.

## Super admin options
- Edit any role's menus, tiles and screen order.
- Which roles can use client view, and how client-view orders are treated.
- Default layout for new roles.
- Which public screens a guest sees before logging in.
- Publish a layout now or schedule it.


## Depends on

- [Roles & Permissions](02-roles-permissions.md)
- [Languages, Wording & Branding](12-languages-wording.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `layout.published`
- `layout.rolled_back`
- `clientview.entered`
- `clientview.exited`

## If this module is switched off or fails

Cannot be switched off. If it fails, the app uses the last layout cached on the device.
