# .claude

Claude Code configuration for this repository.

## Commands

Invoke with `/project:<command-name>` in Claude Code (CLI or VS Code).

| Command | Purpose |
|---------|---------|
| `release-check` | Run local quality gates (lint, test, build) before publishing |

## Hooks

Hooks run automatically on Claude Code lifecycle events.

| Event | Script | Behavior |
|-------|--------|----------|
| `Stop` | `hooks/release-check.sh` | Blocks completion (exit 2) if lint/test/build fail; Claude must fix before finishing |

### How it works

- **Exit 0** → checks pass, Claude completes normally
- **Exit 2** → checks fail, Claude is forced to continue and fix issues
- **Loop guard** → if already re-triggered (`stop_hook_active`), exits cleanly to avoid infinite loops

### Requirements

- Project must have `lint`, `test`, or `build` scripts in `package.json` (missing scripts are skipped)

## Usage

```bash
# Manual command invocation in Claude Code
/project:release-check

# Hook fires automatically — no action needed
```
