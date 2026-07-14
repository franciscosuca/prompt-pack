# prompt-pack

A curated starter pack for GitHub Copilot customization in VS Code, including reusable agents, focused skills, and MCP setup assets. It is designed to help teams standardize workflows quickly: copy the templates, adapt the prompts, and run with minimal setup.

## Agents

- [orchestrator-fastapi](.github/agents/orchestrator-fastapi.agent.md): reviews FastAPI code with emphasis on security, correctness, async behavior, and architecture.
- [playwright](.github/agents/playwright.agent.md): bootstraps and maintains Playwright E2E tests aligned with product changes.
- [react.agent](.github/agents/react.agent.md): supports React architecture decisions, state ownership, and scalable refactors.
- [vitest](.github/agents/vitest.agent.md): bootstraps and maintains Vitest unit/component tests aligned with product changes.
- [test-oracle](.github/agents/test-oracle.agent.md): writes requirement-driven tests and acceptance gates before implementation.
- [blind-implementer](.github/agents/blind-implementer.agent.md): implements from requirements without reading tests.
- [orchestrator-react](.github/agents/orchestrator-react.agent.md): orchestrates end-to-end React feature delivery via test-oracle and blind-implementer.
- [orchestrator-react-native](.github/agents/orchestrator-react-native.agent.md): converts a React web app into a React Native/Expo project.
- [orchestrator-ios](.github/agents/orchestrator-ios.agent.md): converts a React web app into a native iOS Swift/SwiftUI project.

## Skills

- [implementation-plan](.github/skills/implementation-plan/SKILL.md): generates short, easy-to-follow implementation plans in a strict format.
- [protocol-integration-planner](.github/skills/protocol-integration-planner/SKILL.md): creates integration plans and effort estimates for new protocols.
- [react-minor-changes](.github/skills/react-minor-changes/SKILL.md): applies low-risk React/TypeScript updates with concise reporting.
- [release-check](.github/skills/release-check/SKILL.md): runs a pre-release validation sequence (lint, tests/build, semantic-release pipeline).

## MCP

- [MCP Servers Config](.vscode/mcp.json): VS Code MCP server configuration template (currently includes `notion` and `stitch`, plus a token input).
- [VSCode MCP Setup](.vscode/readme.md): quick extension-based instructions to add `DevTools` and `GitHub` MCP in VS Code.

---

**NOTE**:
Drop any `.agent.md` or `SKILL.md` file into your own project to extend Copilot with project-specific workflows.
