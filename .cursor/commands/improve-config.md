# Command: /improve-config

Improve the `.cursor/` configuration files based on lessons learned during migration.

## When to use

- After completing a migration step and noticing missing guidance
- When a rule is too strict or too loose
- When a new pattern emerges that should be documented
- When adding a new agent, command, or skill

## Steps

1. **Identify the gap**
   - What situation did you encounter that the current config doesn't cover?
   - Which rule/agent/skill should be updated?

2. **Propose the change**
   - Show the current text
   - Show the proposed update
   - Explain why

3. **Apply the change**
   - Edit the relevant `.cursor/` file
   - Keep the change focused — don't rewrite the entire file

4. **Update README.md if needed**
   - If adding a new file, add it to the table in `.cursor/README.md`

## What to improve

- **Rules** — add missing constraints, clarify ambiguous guidance
- **Agents** — add domain knowledge gained from migration experience
- **Commands** — add new commands or refine existing steps
- **Skills** — add new step-by-step guides for patterns that recur
- **README** — keep the file inventory current

## Rules
- Keep files concise and practical
- Don't add speculative guidance — only add what has proven useful
- Reference specific repo files and paths (not generic advice)
- Update the README table when adding/removing files
