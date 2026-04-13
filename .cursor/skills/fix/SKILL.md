---
name: fix
description: >-
  Quickly diagnose and fix bugs, errors, and unexpected behavior. Use when the
  user says "fix", "bug", "error", "broken", "not working", "crash", pastes an
  error message or stack trace, or asks why something fails.
---

# /fix — Quick Bug Fix

## Workflow

On trigger, execute these steps **in order**. Do not skip steps.

### 1. Capture the error

- If the user pasted an error/stack trace, parse it immediately.
- If not, ask: "What error or unexpected behavior are you seeing?"
- Extract: **error message**, **file path**, **line number**, **component/function name**.

### 2. Read the failing code

- Read the file(s) referenced in the error.
- Read surrounding context (imports, types, parent components if relevant).
- If the error mentions a dependency, check `package.json` for version.

### 3. Identify root cause

- Match the error against these common categories:

| Category | Signals | Typical fix |
|---|---|---|
| **Type error** | `Type '...' is not assignable`, `Property does not exist` | Fix type, add assertion, update interface |
| **Import error** | `Module not found`, `Cannot find module` | Fix path, install dep, check `@/` alias |
| **Runtime null** | `Cannot read properties of undefined`, `is not a function` | Add null check, fix data flow |
| **React error** | `Hydration mismatch`, `Invalid hook call`, `Too many re-renders` | Fix SSR/client boundary, fix hook rules |
| **Build error** | `Failed to compile`, webpack/turbopack errors | Fix syntax, resolve config |
| **Payload error** | `ValidationError`, collection/field errors | Fix schema, check field config |
| **CSS/Tailwind** | Missing class, wrong token, `@apply` failure | Fix class name, check CSS variable |
| **Env/config** | `Missing environment variable`, connection refused | Check `.env.local`, Docker services |

- State the root cause in **one sentence** before fixing.

### 4. Apply the fix

- Edit only the minimum code needed.
- Preserve existing style, indentation, and patterns.
- If the fix touches types, propagate changes to all affected files.
- If the fix requires a new dependency, install it via `pnpm add`.

### 5. Verify

- Run `ReadLints` on edited files.
- If lint errors were introduced, fix them immediately.
- If the error was a build error, run `pnpm build` to confirm it passes.
- If the error was a type error, run `pnpm tsc --noEmit` (or rely on build).

### 6. Report

Use this format:

```
Fix: [one-line description]
Cause: [root cause]
Files: [list of changed files]
```

## Rules

- **Minimal diffs** — don't refactor adjacent code unless it caused the bug.
- **Don't guess** — if the root cause is unclear after reading the code, ask the user for more context (reproduction steps, environment, recent changes).
- **Check both server and client** — Next.js errors can originate from either side.
- **Check Docker services** — if the error involves DB or S3, verify containers are running (`docker compose ps`).
- **Preserve tests** — if tests exist for the affected code, update them to match the fix.
