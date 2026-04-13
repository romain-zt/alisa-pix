# Command: /review

Review the current state of the migration or a specific change.

## Steps

1. **Check git status**
   - What branch are we on? (must NOT be main/master)
   - What files have changed?
   - Are there uncommitted changes?

2. **Review changed files**
   - For each modified/new file, verify:
     - Schema correctness (field types, localization, relationships)
     - Seed completeness (all current data covered, idempotent)
     - Frontend data flow (Local API usage, correct prop mapping)
     - No hardcoded data left for migrated features
     - No accidental removal of still-needed code

3. **Check against Definition of Done**
   - [ ] Schema exists and is correct
   - [ ] Seed works and is idempotent
   - [ ] Admin shows content
   - [ ] Frontend renders from Payload
   - [ ] Mobile + desktop checked
   - [ ] Old data cleaned up (if safe)
   - [ ] Build passes
   - [ ] On feature branch

4. **Check for common issues**
   - Missing `localized: true` on content fields
   - Upload fields not pointing to media collection
   - Seeds that create duplicates on re-run
   - Hardcoded S3 URLs instead of Payload media URLs
   - Missing image size configurations
   - Broken locale switching
   - Removed code that other pages still need

5. **Provide feedback**
   - List issues found (blocking vs. non-blocking)
   - Suggest improvements
   - Confirm if ready to merge or needs changes

## Output format
```
## Review: [Feature/Branch]

### Status: READY / NEEDS CHANGES

### Issues
- 🔴 [Blocking issue]
- 🟡 [Suggestion]
- 🟢 [Looks good]

### Checklist
- [x/✗] Schema
- [x/✗] Seed
- [x/✗] Frontend
- [x/✗] Build
- [x/✗] Branch safety
```
