# CLAUDE.md — AI Assistant Guide for `hrazi/essentials`

This file provides guidance for AI assistants (Claude and others) working with this repository. It covers codebase structure, conventions, workflows, and key context needed to contribute effectively.

---

## Repository Overview

**`hrazi/essentials`** is a documentation and automation repository serving as the operational backbone for a product studio. It contains:

1. **Role-based AI agent definitions** — 37 Claude agent instruction files across 7 functional categories
2. **Developer templates** — Functional specification and AI model standards guides
3. **Azure DevOps automation** — A Node.js script that generates weekly engineering reports, triggered via GitHub Actions

There is no application server, database, or front-end build pipeline. The primary "product" is documentation and lightweight scripting.

---

## Directory Structure

```
essentials/
├── .claude/
│   └── agents/                  # Claude sub-agent role definitions (37 files)
│       ├── design/              # Brand, UX, UI, visual roles (5 agents)
│       ├── engineering/         # Backend, frontend, AI, DevOps, etc. (9 agents)
│       ├── marketing/           # Content, growth, social media roles (7 agents)
│       ├── product/             # Sprint, feedback, research roles (3 agents)
│       ├── project-management/  # Producer, shipper, experiment tracker (3 agents)
│       ├── studio-operations/   # Finance, infra, legal, support, analytics (5 agents)
│       └── testing/             # API, perf, analysis, tooling, workflow (5 agents)
├── .github/
│   └── workflows/
│       └── main.yml             # GitHub Actions: weekly report on every Monday 09:00 UTC
├── ado/
│   ├── package.json             # ES module config, Node >=20 required
│   └── scripts/
│       └── generate-weekly-report.mjs  # Azure DevOps report generator (365 lines)
├── ai-model-standards.md        # AI/ML standards guide (354 lines)
├── PM-Spec.md                   # Functional specification template (310 lines)
├── projects.md                  # Links to related repositories and tools
├── package.json                 # Root package (mirrors ado/package.json)
├── README.md                    # High-level overview
└── LICENSE                      # GPLv3
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js >= 20 (ES modules) |
| Dependencies | **None** — only Node.js built-ins (`node:fs`, `node:https`, `node:path`) |
| CI/CD | GitHub Actions (`.github/workflows/main.yml`) |
| External API | Azure DevOps REST API v7.0 |
| Agent framework | Claude sub-agents (`.claude/agents/`) |
| License | GPLv3 (code), MIT (package.json metadata) |

---

## Key Source File: `ado/scripts/generate-weekly-report.mjs`

### What It Does

- Authenticates to the Azure DevOps REST API using a Personal Access Token (`ADO_PAT`)
- Fetches work items from a saved WIQL query (`ADO_QUERY_ID`)
- Filters items by date range (defaults to the previous Monday–Sunday)
- Groups items by team based on `Area Path` patterns
- Computes engineering metrics: cycle time (avg/median/P75), story points, throughput, WIP age
- Renders a self-contained HTML report and writes it to disk
- Auto-commits the report to the repository via `git commit` + `git push`

### Configuration Constants (top of file)

```javascript
const ORG = 'Skype';                    // Azure DevOps organization
const PROJECT = 'SPOOL';                // Project name
const SAVED_QUERY_ID = '...';           // WIQL saved query ID
const TARGET_AREA_PATHS = [...];        // Which Area Paths to include
const TEAM_MAP = [...];                 // Maps area paths to team names + EMs
```

### Running Locally

```bash
# Generate report for the previous full week
ADO_PAT=<your_token> npm run gen:weekly

# Generate report for a custom date range
ADO_PAT=<your_token> npm run gen:weekly -- --start=2026-01-06 --end=2026-01-12
```

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ADO_PAT` | Yes | Azure DevOps Personal Access Token (read scope) |
| `ADO_ORG` | Optional | Overrides hardcoded `ORG` constant |
| `ADO_PROJECT` | Optional | Overrides hardcoded `PROJECT` constant |
| `ADO_QUERY_ID` | Optional | Overrides hardcoded `SAVED_QUERY_ID` constant |

---

## CI/CD Pipeline (`.github/workflows/main.yml`)

- **Trigger**: Every Monday at 09:00 UTC, or manual `workflow_dispatch`
- **Runtime**: `ubuntu-latest`, Node.js 20
- **Steps**: checkout → install → generate report → commit & push HTML to repo
- **Required secrets**: `ADO_PAT`, `ADO_ORG`, `ADO_PROJECT`, `ADO_QUERY_ID`

The pipeline commits generated reports directly to the repository. Report filenames follow this pattern:
```
developer_platform_weekly_report_YYYY-MM-DD_to_YYYY-MM-DD.html
```

---

## Claude Agent Definitions (`.claude/agents/`)

### Overview

Each file in `.claude/agents/` defines a **sub-agent role** — a specialized Claude persona activated for specific tasks. All 37 agents share the same three-section Markdown format:

```markdown
# [Role Name]

## Role
One-line description of the persona.

## Responsibilities
- Bullet list of core duties (5–8 items)

## Guidelines
- Bullet list of behavioral rules and best practices (5–8 items)
```

### Agent Categories

| Category | Count | Representative Agents |
|---|---|---|
| `design/` | 5 | Brand Guardian, UI Designer, UX Researcher, Visual Storyteller, Whimsy Injector |
| `engineering/` | 9 | Backend Architect, Frontend Developer, AI Engineer, DevOps Automator, Security Auditor, Data Engineer, Accessibility Engineer, Mobile App Builder, Rapid Prototyper |
| `marketing/` | 7 | Content Creator, Growth Hacker, Instagram Curator, TikTok Strategist, Twitter Engager, Reddit Community Builder, App Store Optimizer |
| `product/` | 3 | Sprint Prioritizer, Feedback Synthesizer, Trend Researcher |
| `project-management/` | 3 | Project Shipper, Experiment Tracker, Studio Producer |
| `studio-operations/` | 5 | Analytics Reporter, Finance Tracker, Infrastructure Maintainer, Legal Compliance Checker, Support Responder |
| `testing/` | 5 | API Tester, Performance Benchmarker, Test Results Analyzer, Tool Evaluator, Workflow Optimizer |

### Adding a New Agent

1. Choose the correct category directory under `.claude/agents/`
2. Create `<role-name>.md` using the three-section format above
3. Keep `## Role` to a single sentence
4. Keep `## Responsibilities` and `## Guidelines` to 5–8 bullets each
5. Use present-tense imperative verbs ("Ensure", "Review", "Generate")

---

## Code Conventions

### JavaScript (`generate-weekly-report.mjs`)

- **ES Modules only** — use `import`/`export`, never `require()`
- **Node built-ins with `node:` prefix** — e.g., `import fs from 'node:fs'`
- **No external dependencies** — avoid adding packages; use native APIs
- **camelCase** for variables and function names
- **UPPER_SNAKE_CASE** for module-level constants
- **Async/await** — no raw Promise chains
- **Functional data transformation** — prefer `map`/`filter`/`reduce` over imperative loops
- **Retry with exponential backoff** for external API calls that return 429

### Documentation Files (`.md`)

- Use ATX-style headings (`##`, `###`)
- Prefer tables for structured comparisons
- Use fenced code blocks with language identifiers
- Keep line lengths readable (no hard limit enforced)
- Agent files must strictly follow the three-section format (`# Role`, `## Role`, `## Responsibilities`, `## Guidelines`)

---

## Testing

There is **no automated test suite** in this repository. Validation is done by:

1. Running the report script locally with a valid `ADO_PAT` and verifying the generated HTML
2. Inspecting the CI/CD run output in GitHub Actions
3. Reviewing committed HTML report files in the repository

If adding tests in the future, use Node's built-in `node:test` module (available in Node 18+) to avoid external dependencies.

---

## Development Workflow

### Branching

- Branch names follow the pattern `claude/<description>-<session-id>` for AI-assisted work
- Feature branches should be created from `main`
- The default branch is `main` (remote); local `master` is an artifact of old tooling — do not use it

### Making Changes

```bash
# 1. Ensure you are on the correct feature branch
git checkout -b claude/<description>-<session-id>

# 2. Make changes, then stage specific files (not git add -A)
git add <file1> <file2>

# 3. Commit with a descriptive message
git commit -m "feat: add <description>"

# 4. Push to origin
git push -u origin claude/<description>-<session-id>
```

### Commit Message Style

Use conventional commits:

| Prefix | Use case |
|---|---|
| `feat:` | New agent, new script feature, new template section |
| `fix:` | Bug in script logic, broken link, incorrect metric |
| `docs:` | Documentation-only changes |
| `ci:` | Changes to `.github/workflows/` |
| `chore:` | Dependency updates, file renames, repo housekeeping |

---

## Key Documentation References

| File | Purpose |
|---|---|
| `PM-Spec.md` | 18-section template for writing functional specifications |
| `ai-model-standards.md` | Standards for data collection, model building, evaluation, and maintenance |
| `projects.md` | Links to related repositories and external tools |
| `.claude/agents/` | All sub-agent role definitions |

---

## What to Avoid

- **Do not add npm dependencies** to `ado/package.json` — the script is intentionally zero-dependency
- **Do not push to `main` directly** — always use a feature branch and PR
- **Do not commit secrets** — `ADO_PAT` and related tokens are secrets, never hardcode them
- **Do not alter the three-section agent format** without updating all 37 agent files for consistency
- **Do not create new top-level directories** without a clear structural reason — this repo favors a flat, scannable layout
- **Do not use `git add -A` or `git add .`** — stage specific files to avoid accidentally committing generated HTML reports or local env files
