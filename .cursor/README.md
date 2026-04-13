# .cursor/ — RFE Monorepo

## What this is

Cursor config for the **RFE** (Rohm Feifer Entertainment) monorepo — a pnpm workspace with
Turborepo, housing the Next.js + Payload CMS website and shared internal packages.

## Repo identity

- **Domain:** Cinema / film & TV production studio website
- **Architecture:** pnpm monorepo + Turborepo
- **App:** `apps/rfe-v0/` — Next.js 16, React 19, Payload CMS, Tailwind v4
- **Packages:** `@rfe/ui`, `@rfe/design-tokens`, `@rfe/tsconfig`, `@rfe/eslint-config`
- **Database:** Postgres (Docker)
- **Storage:** S3-compatible (MinIO locally, S3/R2 in production)
- **Deployment:** Docker / VPS / self-host
- **i18n:** en-US from day one, architecture ready for additional locales

## Development workflow

1. **Spec-first** — write a spec in `specs/` before implementing non-trivial changes
2. **Progressive migration** — migrate content to Payload one page/feature at a time
3. **Seed-first** — every CMS migration step includes runnable seeds
4. **Branch-safe** — never push to `main`/`master`; always feature branches
5. **Docker-first** — local dev uses Docker Compose for Postgres + MinIO
6. **Build-gated** — `pnpm build` must succeed before a step is considered done

## Directory layout

```
.cursor/
├── README.md           ← this file
├── rules/              ← always-on project rules
├── agents/             ← specialized agent personas
├── commands/           ← slash commands
└── skills/             ← step-by-step skill guides
```

## Key rules

| Rule file | Purpose |
|-----------|---------|
| `00-project-context` | What this repo is, stack, conventions |
| `05-monorepo-conventions` | Package naming, dependency direction, catalog |
| `06-spec-driven-dev` | Spec-first workflow for non-trivial changes |
| `10-architecture-boundaries` | Frontend / Payload / shared boundaries |
| `20-progressive-migration` | How to migrate safely |
| `25-branch-safety` | Never push to main |
| `30-seed-first` | Seeds are mandatory |
| `35-i18n-policy` | Localization from day one |
| `40-media-storage` | Media strategy (S3, locale-aware assets) |
| `45-docker-first` | Docker-first local development |
| `50-design-system-in-cms` | Branding config in Payload |
| `55-clean-while-migrating` | Improve adjacent code safely |
| `60-testing-verification` | Build/lint/type-check gates |
| `70-definition-of-done` | What "done" means for a migration step |
