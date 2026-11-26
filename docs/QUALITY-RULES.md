# Quality rules

These rules bind every change and every thread, by a person or an AI
assistant, as firmly as [the code standards](architecture/code-standards.md).
A CI step that enforces the checkable ones is planned for the access and
security phase in the [build checklist](BUILD-CHECKLIST.md).

1. **Never weaken security to make something pass.** Do not turn off or loosen security, CORS, sign-in or permission checks.
2. **Never bend a test to make it pass.** Do not edit, skip or delete a test for that reason. Fix the code instead, and report any test that still fails.
3. **Never add a package without checking it.** Confirm it exists and is the real one: the right name, the right publisher, a pinned version.
4. **No fake or made-up data on real screens.** Sample content appears only in preview mode, and it is clearly labelled.
5. **Never ignore or swallow an error.** Handle it, show it to the person, and log it.
6. **No TODO or stub in sign-in, auth, payments or permissions.** That code is finished or it does not ship.
7. **Never log secrets.** No passwords, tokens, keys or card data in logs.
8. **Least privilege by default.** Nobody is an admin by default. Every admin action is checked on the server.
9. **Never change the live database destructively without a backup.** Do not wipe it, reset it or run a destructive migration without a backup and the user's approval.
10. **Never say done without evidence.** Show the passing checks, and list what was tried but not finished.
