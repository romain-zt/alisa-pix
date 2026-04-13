# Command: /prompt

Generate a well-scoped prompt for a migration task that can be used in a new Cursor chat or agent.

## Inputs
- **Task description** (e.g., "migrate works collection to Payload")

## Steps

1. **Gather context**
   - Read the relevant source files
   - Identify the data types, current data, and rendering components
   - Note dependencies (what must exist first)

2. **Generate a self-contained prompt**
   The output prompt must include:
   - What to build (collection/global/block/seed/frontend update)
   - Where the current data lives (exact file paths)
   - What TypeScript types define the data shape
   - What component renders it
   - What images are involved (paths)
   - Branch to work on
   - Definition of done checklist

3. **Include constraints**
   - Search existing content before writing schema
   - Seed is mandatory
   - Use Payload Local API
   - Localize content fields
   - Locale-aware assets where relevant
   - Never push to main
   - Must pass `pnpm build`

## Output format

A complete, copy-pasteable prompt wrapped in a code block, ready to use in a new chat.

```markdown
## Task: [Title]

### Context
[Current data location, types, component]

### Deliverables
1. Payload [collection/global] at [path]
2. Seed script at [path]
3. Frontend update in [component]
4. Cleanup of [old data file]

### Constraints
- [list of constraints]

### Definition of Done
- [ ] Schema
- [ ] Seed (idempotent)
- [ ] Admin visible
- [ ] Frontend renders
- [ ] Build passes
- [ ] Feature branch
```
