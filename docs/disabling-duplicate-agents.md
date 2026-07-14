# Disabling Agents to Avoid Duplicates in the Agent Picker

This repository defines the same agent roster twice, once per tool surface:

- **GitHub Co pilot / VS Code**: `.github/agents/*.agent.md`
- **Claude Code**: `.claude/agents/*.md`

If you work in an editor where both surfaces are active at once (for example, VS Code with both GitHub Copilot Chat and the Claude Code extension enabled), the same logical agent (e.g. `test-oracle`, `blind-implementer`, `orchestrator-wizard`) can show up twice in the agent/@-mention picker — one entry per surface. Each surface has its own manual switch to hide or block an agent without deleting its file.

## GitHub Copilot / VS Code agents (`.github/agents/*.agent.md`)

Control visibility and delegation per agent via frontmatter flags:

| Flag | Default | Effect |
|---|---|---|
| `user-invocable: false` | `true` | Hides the agent from the manual agent picker. It can still be invoked as a subagent by another agent. |
| `disable-model-invocation: true` | `false` | Prevents other agents from invoking this one as a subagent. |

To fully disable an agent (hidden from the picker **and** unreachable via delegation), set both:

```yaml
---
name: "playwright"
user-invocable: false
disable-model-invocation: true
---
```

If you want to remove an agent from Copilot entirely (not just hide it), rename the file so it no longer matches `*.agent.md` (e.g. `playwright.agent.md.disabled`) or move it out of `.github/agents/`.

## Claude Code agents (`.claude/agents/*.md`)

Claude Code has no per-file "hidden" frontmatter flag. Instead, block specific subagents at the settings level using `permissions.deny` with the `Agent(<name>)` syntax, where `<name>` matches the subagent's `name` frontmatter field:

```json
// .claude/settings.json or .claude/settings.local.json
{
  "permissions": {
    "deny": ["Agent(playwright)", "Agent(vitest)"]
  }
}
```

This blocks Claude from delegating to (or explicitly invoking) those named subagents, whether requested automatically, via natural language, or via `@`-mention. It does not remove the file from disk or from the `@`-mention typeahead list — it only blocks the agent from actually running.

To fully remove a Claude Code agent from discovery, move or rename the file so it's no longer under a scanned `.claude/agents/` directory (there is no supported "disabled" frontmatter field for this).

## Which one to disable

Pick whichever surface you are **not** actively using in that editor/session:

- **Primarily using GitHub Copilot Chat?** Add the Claude-side names to `permissions.deny` in `.claude/settings.json` (or `.claude/settings.local.json` for a personal-only override) so Claude Code stops surfacing/running them, while leaving `.github/agents/*.agent.md` untouched.
- **Primarily using Claude Code?** Set `user-invocable: false` on the corresponding `.github/agents/*.agent.md` files instead, so they drop out of the Copilot agent picker while the `.claude/agents/*.md` proxies keep working.

Either way, keep both file sets in version control — disabling only changes runtime visibility/invocation, not the underlying definitions, so the mirrored roster stays intact for teammates using the other tool.
