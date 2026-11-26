# Database backups and restore

How the Igongo database (Neon project `igongo`, production branch `production`) is backed up, and the restore that was tested.

## What protects the data

1. **Neon history (always on).** Neon keeps the change history of the branch, so the database can be put back to any moment inside the plan's history window (6 hours on the free plan, longer on paid plans).
2. **Snapshots (by hand, before every risky step).** A snapshot is a frozen copy of the whole database. One is taken before every deploy that runs migrations.
3. **Scheduled snapshots (needs a paid Neon plan).** Neon refused a daily schedule on the free plan ("backup schedule creation is not enabled for this project"). Once the plan is upgraded, turn on a daily snapshot kept for 14 days and a weekly one kept for 8 weeks.

## Restore test, 26 Nov 2026

1. Snapshot `before-access-security-deploy-2026-11-26` was taken of `production`.
2. It was restored into a **new, separate branch** `restore-test-2026-11-26`. Production was not touched (the restore was not finalised).
3. Checks on the restored branch with read-only SQL:
   - 229 tables, the same as production.
   - The sign-in table (`users_login.user`) read back correctly: 3 accounts in the snapshot. Production had 2 at check time, because one account was removed after the snapshot was taken. That is what a point-in-time copy should show.
4. Result: **restore works.** The test branch is left in place until the owner says it can be deleted (see [NEEDS-YOU](NEEDS-YOU.md)).

## How to restore for real

1. Neon console > project `igongo` > **Backup & restore** (or Branches > Snapshots).
2. Pick the snapshot or the moment in time, restore into a **new branch** first, and check it (counts of key tables, a test sign-in with the API pointed at it).
3. Only then finalise, which swaps the restored data into `production`. Neon keeps the old one as a backup branch.
4. Note the time, the reason and who approved it in the incident log.

Never finalise a restore or delete a branch without the owner's written go-ahead.
