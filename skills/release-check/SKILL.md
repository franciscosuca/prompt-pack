---
name: release-check
description: Single release validation skill (lint, build, semantic-release dry-run).
argument-hint: "Run release checks before publishing"
user-invokable: true
---

# Release Check

Run one pre-release flow that replaces builder checks.

## Commands (repo root)
1. Install clean dependencies:
   `npm ci`
2. Type/lint check:
   `npm run lint`
3. Run tests if present:
   `npm test --if-present`
4. Build production bundle:
   `npm run build`
5. Run semantic-release dry run (local):
   `npm run release:check`

Optional: test a specific branch name explicitly:
`npm run release:check -- <branch-name>`

## Pass criteria
- All commands exit with code `0`.

## If it fails
- Report which command failed and include the error output.
- Do not release until checks pass.

## Output format
After running all checks, respond with a checklist using ✅ for pass and ❌ for fail. Keep the total response under 200 words.

**All passing example:**
✅ Install clean dependencies
✅ Type/lint check
✅ Tests
✅ Build production bundle
✅ Release dry-run → next version: `<version>`

**On failure, stop the list at the failed step and show only the relevant error:**
✅ Install clean dependencies
✅ Type/lint check
❌ Build production bundle
```
<error message here>
```
Do not release until all checks pass.
