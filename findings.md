# Findings & Decisions

## Requirements
- Install `planning-with-files` skill.
- Create `task_plan.md`, `findings.md`, and `progress.md` in the project root.
- Follow the provided templates.

## Research Findings
- The skill is located in `.agent/skills/planning-with-files`.
- Core templates are in the `references/` subdirectory of the skill.
- The workflow emphasizes "Context Window = RAM" vs "Filesystem = Disk".

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Workspace Skill | Keeping the skill within the repo ensures consistency across different sessions and potentially different users/agents. |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| Missing Artifact Metadata | Provided the required metadata in the subsequent tool call. |

## Resources
- Skill documentation: [SKILL.md](file:///c:/Users/rohan.yashraj.gupta/OneDrive%20-%20Accenture/Documents/Work/GitHub/next-apps/nextjs-blog/.agent/skills/planning-with-files/SKILL.md)
- GitHub Repo: https://github.com/OthmanAdi/planning-with-files.git

## Visual/Browser Findings
- N/A

---
*Update this file after every 2 view/browser/search operations*
*This prevents visual information from being lost*
