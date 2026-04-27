# GitHub Copilot Code Review Instructions

## Review Philosophy

- Only comment when you have HIGH CONFIDENCE (>80%) that an issue exists
- Be concise: one sentence per comment when possible
- Focus on actionable feedback, not observations
- When reviewing text, only comment on clarity issues if the text is genuinely confusing or could lead to errors. "Could be clearer" is not the same as "is confusing" - stay silent unless HIGH confidence it will cause problems

## Priority Areas (Review These)

### Security & Safety

- Unsafe code blocks without justification
- Command injection risks (shell commands, subprocess, user input)
- Path traversal vulnerabilities
- Credential exposure or hardcoded secrets (check `.env`)
- Missing input validation on external data (FastAPI Pydantic models)
- Improper error handling that could leak sensitive info

### Correctness Issues

- Logic errors that could cause crashes or incorrect behavior
- Race conditions in async code (`asyncio`)
- Resource leaks (unclosed event hub clients, open files)
- Boundary conditions (especially when processing event streams)
- Incorrect exception handling (catching broad `Exception` without re-raising or logging)
- Optional types that don't need to be optional (use Pydantic for validation)
- Improper use of `async` and `await` (e.g., blocking operations in async routes)
- Unnecessary comments that just restate what the code already shows (remove them)

### Architecture & Patterns

- Code that violates FastAPI patterns (dependency injection, router usage)
- Missing structured error handling (FastAPI handlers or `HTTPException`)
- Improper use of global state (use dependency injection where possible)

## Project-Specific Context

- This is a **Python** project using **FastAPI**
- Async runtime: **asyncio**
- Configuration: Managed via `src/config.py` and `.env` files
- Observability: **OpenTelemetry** is used for logging and tracing
- Deployment: Containerized via **Docker** (see `Dockerfile` and `pipelines/`)

## CI Pipeline Context

**Important**: You review PRs immediately, before CI completes.

### What Our CI Checks (`pipelines/[FILE_NAME].yml`)

- **Docker Build**: Validates that the application can be containerized.
- **Dependency Check**: Relies on `requirements.txt` for consistent environment setup.

## Skip These (Low Value)

Do not comment on:

- **Style/formatting** - Focus on logic and safety first
- **Minor naming suggestions** - unless truly confusing
- **Suggestions to add comments** - for self-documenting code
- **Refactoring suggestions** - unless there's a clear bug or maintainability issue
- **Multiple issues in one comment** - choose the single most critical issue
- **Logging suggestions** - unless for critical errors or security events

## Response Format

When you identify an issue:

1. **State the problem** (1 sentence)
2. **Why it matters** (1 sentence, only if not obvious)
3. **Suggested fix** (code snippet or specific action)

Example:

```python
# This could block the event loop. Consider using an async file handler.
async with aiofiles.open("file.txt") as f:
    ...
```

## When to Stay Silent

If you're uncertain whether something is an issue, don't comment. False positives create noise and reduce trust in the review process.
