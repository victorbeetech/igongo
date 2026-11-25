# 49. Notice Board

**Group:** Communication · **Module key:** `notice-board` · [All modules](README.md)

## Summary

Company posts and announcements for all staff or chosen groups. The super admin decides, for the whole board or a single post, who can post, comment, like or only read.

## Features

### Posts
- Text, photos, videos, files, links and polls.
- Audience: everyone, a department, a role, a location or named people.
- Pinned posts, scheduled posts and expiry dates.
- Urgent posts that need acknowledgement ("I have read this").
- Read receipts, with a list of who has not read.

### Interaction
- Likes and reactions, comments and replies, and mentions.
- Per post settings: comments on or off, likes only, or read only.

### Moderation
- Approval queue for posts from people who need approval.
- Report a post or comment, hide, and remove.
- Word filters.

### Channels
- Separate boards, such as "Management news", "Kitchen", "Staff of the month".

## Super admin options
- Which roles can post, comment, like, or only read, per board.
- Whether posts need approval before they show.
- Default post settings (for example, everyone can post but no one can comment, only likes).
- Whether staff can create their own boards.


## Depends on

- [Files & Media](11-files-media.md)
- [Notifications Engine](10-notifications.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `post.published`
- `post.liked`
- `post.commented`
- `post.acknowledged`
- `post.reported`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
