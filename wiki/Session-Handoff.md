# Session Handoff

> This file is overwritten at the end of each session with the latest handoff note.
> The next agent reads this before doing anything else.
> Format: fill in the template below, delete the template instructions, commit.

---

## Current Handoff — 2026-06-01

**Session type:** Knowledge management / documentation  
**Agent:** Claude (claude-sonnet-4-6)  
**Branch:** `claude/github-wiki-knowledge-template-1cci0`  
**PR:** To be created with this session's work

### What Was Accomplished This Session

Built the complete knowledge management system for Joey's interactive lab repo:

1. **`CLAUDE.md`** (root) — Rewrote with comprehensive agent context:
   - Full versions table (v1, v2, v3)
   - Critical rules (never commit to main, branch naming, push ritual)
   - Folder conventions with explicit v3 root-pollution warning
   - Tech stack preferences
   - File naming conventions
   - Aesthetic reference with exact CSS values
   - Agent behavior rules (from v2's operating experience)

2. **`wiki/Home.md`** — Wiki index hub with:
   - Quick start for new agents
   - Full document index table
   - Repo structure diagram
   - Active branches table
   - How to update the wiki

3. **`wiki/Versions.md`** — Complete catalogue of all 3 versions:
   - Per-version: branch, PR, folder, key files, tech stack, how to run, how to deploy, extension ideas
   - v3 folder cleanup plan (currently messy at root)
   - Template for documenting v4+

4. **`wiki/GitHub-Best-Practices.md`** — Workflow guide:
   - Branch strategy and hierarchy
   - Commit message conventions with type system
   - PR workflow (draft-first, self-review checklist)
   - Issue tracking and labels
   - Semantic versioning for releases
   - Ephemeral container protection protocol
   - Common mistakes table

5. **`wiki/Agent-Template.md`** — Agent operating manual:
   - Session start checklist (step-by-step)
   - During-session rules (commit frequency, folder rules)
   - New version vs. extend decision framework
   - Session end checklist (non-negotiable steps)
   - Documentation requirements
   - Common agent failure modes to avoid
   - New project scaffolding template

6. **`wiki/Stack-Map.md`** — Technology reference:
   - Quick decision matrix
   - Web layer: React, Framer Motion, R3F, Three.js, Vite
   - 3D pipeline: Blender, GLB/GLTF, Alembic, MaterialX, param_server pattern
   - Runtime/Deploy: Electron, Netlify, Vercel, GitHub Pages, GitHub Actions
   - UE5 integration: Remote Control, glTFRuntime, Nanite, Niagara
   - Design tools: Framer, Figma, Spline
   - Dependency matrix by version

7. **`.github/PULL_REQUEST_TEMPLATE.md`** — Updated PR template:
   - Summary, version context, tech stack, preview instructions
   - Test checklist, wiki updated checkbox, session link

8. **`.github/ISSUE_TEMPLATE/session-brief.md`** — New issue template:
   - Full session brief format for briefing new Claude sessions

### What's In Progress

Nothing actively in progress — this session completed the full documentation system.

### What's Next (Suggested)

- **Open a PR** for v3 (`claude/neural-wave-animation-2Mc4t`) — it currently has no PR
- **Reorganize v3** files from repo root into a `neural-wave/` project folder
- **Build v4** — possible directions:
  - A React experience that loads the v3 neural wave GLBs (bridge v2 + v3)
  - A UE5 scene that uses the wave assets with Niagara particle overlays
  - A new web experience with a completely different concept
- **Tag releases** — create `v1.0.0-spatial-code-lab`, `v2.0.0-react-2d-3d`, `v3.0.0-neural-wave` tags

### Key Files Changed This Session

| File | Action | Notes |
|------|--------|-------|
| `CLAUDE.md` | Updated | Complete rewrite with full agent context |
| `wiki/Home.md` | Created | Wiki index hub |
| `wiki/Versions.md` | Created | Full version catalogue |
| `wiki/GitHub-Best-Practices.md` | Created | GitHub workflow guide |
| `wiki/Agent-Template.md` | Created | Agent operating manual |
| `wiki/Stack-Map.md` | Created | Technology reference |
| `wiki/Session-Handoff.md` | Created | This file |
| `.github/PULL_REQUEST_TEMPLATE.md` | Updated | New comprehensive template |
| `.github/ISSUE_TEMPLATE/session-brief.md` | Created | Session brief template |

### Branch / PR

- **Branch:** `claude/github-wiki-knowledge-template-1cci0`
- **PR:** To be created — see commit history on this branch

### Blockers / Notes for Next Agent

- None. The knowledge system is complete and functional.
- The wiki was built from the contextual description of v1/v2/v3; no sessions were run to verify the specific "how to run" commands. Spot-check them against actual branch contents if needed.
- The existing CLAUDE.md on this branch was already a good starting point (previous agent wrote it). This session's version supersedes it with more comprehensive coverage.

---

## Handoff Template (for future sessions)

Copy this template, fill in each section, delete the template instructions:

```markdown
## Current Handoff — YYYY-MM-DD

**Session type:** [new build / feature extension / bug fix / documentation]
**Agent:** Claude (model version)
**Branch:** `claude/your-branch-name-XXXX`
**PR:** [#N](link) or "Not yet created"

### What Was Accomplished This Session
[Bullet list of what was built/changed, with file paths]

### What's In Progress
[Anything started but not finished — be specific about current state]

### What's Next
[Bullet list of recommended next steps, in priority order]

### Key Files Changed This Session
| File | Action | Notes |
|------|--------|-------|
| `path/to/file.jsx` | Created/Updated/Deleted | Brief note |

### Branch / PR
- **Branch:** `claude/...`
- **PR:** [#N](link)

### Blockers / Notes for Next Agent
[Any known issues, dependencies, environment requirements, or context that the next agent needs]
```
