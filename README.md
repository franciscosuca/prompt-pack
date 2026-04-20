# prompt-pack

A curated collection of reusable GitHub Copilot agents and skills for VS Code.

**Agents**
- **Playwright Test Sync** — Bootstraps Playwright and keeps end-to-end tests aligned with recent features, bug fixes, and UI changes.

**Skills**
- **Release Check** — Runs a single pre-release validation flow: install, lint, test, build, and a semantic-release dry run.

**Utilities**
- A GitHub Actions workflow (`build-and-release.yml`) and a `release-check.mjs` script to automate CI and release validation.

Drop any `.agent.md` or `SKILL.md` file into your own project to extend Copilot with project-specific workflows.