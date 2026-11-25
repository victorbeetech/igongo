# 48. SOPs & Knowledge Base

**Group:** Operations · **Module key:** `knowledge-base` · [All modules](README.md)

## Summary

The hotel's standard operating procedures, policies, manuals and how-to guides, in one searchable place.

## Features
- Articles with text, photos and videos.
- Categories per department.
- Read and acknowledge: staff confirm they have read a policy, with a record kept.
- Versions, with who changed what.
- Quick help links from inside other modules.

## Super admin options
- Who can write and publish articles.
- Which articles each role must acknowledge.


## Depends on

- [Files & Media](11-files-media.md)

Every link above is through a published API or event. This module never reads another module's tables directly.

## Events it emits

- `article.published`
- `article.acknowledged`

## If this module is switched off or fails

Its menu items and home tiles disappear from every app. Other modules keep working and skip anything they would have sent to it.
