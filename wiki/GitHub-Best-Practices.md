# GitHub Best Practices — Workflow Guide

> The rules for how work flows through this repo. Read this before touching branches, commits, or PRs.

---

## Branch Strategy

### The Sacred Rule
`main` is never committed to directly. Period. This is a fork of the upstream `create-react-app` OSS project, and `main` tracks that upstream. All of Joey's work lives on feature branches.

### Branch Hierarchy
```
main (upstream OSS — never touch)
└── claude/<description>-<id>  ← all work lives here
    ├── claude/spatial-code-lab-2WtXw    (v1, complete)
    ├── claude/react-2d-3d-interactive-site-XcFbo  (v2, complete)
    ├── claude/neural-wave-animation-2Mc4t (v3, complete)
    └── claude/your-new-work-XXXX         (yours)
```

### Branch Naming Convention
```
claude/<short-kebab-description>-<4-char-alphanumeric-id>
```

Rules:
- Always prefixed with `claude/`
- Description: 2–4 words, kebab-case, action-oriented
- ID: 4 random alphanumeric characters (prevents name collisions)
- Total length: aim for under 50 characters

Good examples:
```
claude/particle-system-hero-7kQp
claude/ue5-wave-material-nM3x
claude/glassmorphism-navbar-rT9w
claude/blender-pipeline-v2-xZ4m
```

Bad examples:
```
main                           ← forbidden
test                           ← meaningless
claude/new-feature             ← no ID
claude/working-on-stuff-2024   ← too vague, date not useful
feature/my-cool-thing          ← wrong prefix
```

### When to Create a New Branch vs. Extend Existing

Create a **new branch** when:
- Starting a genuinely new project or experience
- The work is a major redesign, not an incremental update
- You're unsure if it will be compatible with the existing version

Extend an **existing branch** when:
- Adding a feature clearly within the scope of that version
- Fixing a bug in a shipped version
- Adding a component to an existing experience

When in doubt: new branch. Always recoverable.

---

## Commit Message Style

### Format
```
<type>: <imperative verb phrase, 50 chars or less>

[optional body: explain WHY, not HOW, wrap at 72 chars]

[optional footer: issue refs, breaking changes]
```

### Types
| Type | When to Use |
|------|-------------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `style` | CSS/visual changes, no logic change |
| `refactor` | Code restructure, no behavior change |
| `perf` | Performance improvement |
| `docs` | Documentation only |
| `chore` | Build system, config, deps |
| `init` | First commit on a new project/folder |
| `wip` | Work in progress (use for mid-session pushes) |

### Good Commit Messages
```
feat: add glassmorphism dock nav with hover magnification

fix: prevent R3F canvas from re-mounting on route change

perf: lazy-load Spline viewer to cut initial bundle by 40%

init: scaffold neural-wave/ folder with Blender pipeline

docs: add wiki/Stack-Map.md technology reference
```

### Bad Commit Messages
```
update stuff
fixed it
wip
asdf
changes
Claude's changes
```

### Mid-Session Safety Commits
When working in an ephemeral container, commit with `wip:` prefix to save progress:
```bash
git add <files you changed>
git commit -m "wip: hero section half done — particle system works, need glow"
git push
```
These can be squashed later when you do a clean final commit.

### Commit Frequency
**During a session:** Commit after every meaningful unit of work (every 15–30 minutes minimum). Containers can die at any time.  
**End of session:** Ensure everything is pushed before closing.  
**For PRs:** It's okay to have many small commits on a branch — this tells the story of how the work evolved.

---

## PR Workflow

### 1. Create a Draft PR First
As soon as you push your first commit, open a draft PR. This ensures the branch is tracked, visible, and safe.

```bash
git push -u origin claude/your-branch-name
gh pr create --draft \
  --title "feat: <brief description>" \
  --body "$(cat .github/PULL_REQUEST_TEMPLATE.md)"
```

### 2. Keep the PR Description Updated
As you work, update the PR body with:
- What's done so far
- What's still in progress
- How to preview/test

### 3. Self-Review Checklist Before Marking Ready
Before converting from draft to ready-for-review:

- [ ] All planned features are complete
- [ ] Code runs without errors
- [ ] Preview/deploy link works (or instructions are in PR body)
- [ ] `wiki/Versions.md` updated with this version's details
- [ ] `wiki/Session-Handoff.md` updated
- [ ] No debug code, console.log spam, or hardcoded credentials
- [ ] Files are in the correct folder (not at repo root)
- [ ] Branch name follows the `claude/<description>-<id>` convention

### 4. PR Description Template
See `.github/PULL_REQUEST_TEMPLATE.md` — this is auto-populated when you create a PR on GitHub.

### 5. Merge Strategy
- Squash and merge for clean history on simple feature branches
- Merge commit for branches with meaningful commit history worth preserving
- Never force-push to a branch that has an open PR

---

## Issue Tracking

### Creating a Session Brief Issue
Before starting a major new build session, create an issue using the session brief template:

```bash
gh issue create \
  --template session-brief.md \
  --title "Session: <what you're building>"
```

This creates a brief that:
- Defines what to build
- Gives the agent clear context
- Can be linked from the PR

### Issue Labels

| Label | When to Use |
|-------|-------------|
| `session-brief` | A brief for a new build session |
| `enhancement` | New feature or capability |
| `bug` | Something broken |
| `3d-pipeline` | Blender/UE5/3D work |
| `web-experience` | Front-end / interactive site work |
| `infrastructure` | Build system, CI/CD, deploy |
| `documentation` | Wiki, CLAUDE.md updates |

### Referencing Issues in Commits
```bash
git commit -m "feat: add softbody wave viewer — closes #5"
```

---

## Versioning and Tags

### Semantic Versioning for Releases
When a version is complete and stable:
```bash
git tag v1.0.0-spatial-code-lab
git tag v2.0.0-react-2d-3d
git tag v3.0.0-neural-wave
git push --tags
```

### Release Format
```
v<major>.<minor>.<patch>-<project-name>
```
- `major`: breaking change or new complete version
- `minor`: significant new feature
- `patch`: bug fix or polish

---

## Protecting Your Work — The Ephemeral Container Problem

Claude Code sessions run inside containers that can be killed at any time — when the session ends, when Claude idles too long, or due to infrastructure issues. **Any uncommitted work is permanently lost when the container dies.**

### The Rule: Push Before You Think You're Done
Then push again. And again.

### Session Start Ritual
```bash
git fetch --all
git branch -a
# Read the current state before touching anything
```

### Session End Ritual (non-negotiable)
```bash
# 1. Stage all your work
git status
git add <changed files>

# 2. Commit with descriptive message
git commit -m "feat: describe everything you built this session"

# 3. Push to remote
git push -u origin <your-branch>

# 4. Verify PR exists and has current description
gh pr view

# 5. Update wiki/Session-Handoff.md and push that too
git add wiki/Session-Handoff.md
git commit -m "docs: update session handoff"
git push
```

### If You Have Unsaved Work and the Container Is About to Die
```bash
# Emergency commit — save now, clean up later
git add -A
git commit -m "wip: emergency save — session ending"
git push
```

---

## GitHub Projects for Tracking Builds

Use GitHub Projects (Projects tab on the repo) to track build ideas across sessions:

**Board Columns:**
| Column | Meaning |
|--------|---------|
| `Backlog` | Ideas not yet started |
| `Session Brief Ready` | Has an issue with full brief, ready to assign to a session |
| `In Progress` | Currently being built (active branch/PR) |
| `Done` | Shipped and merged |

**Card format for backlog items:**
```
[v4] <Project Name>
- One-liner description
- Key tech: React, R3F, Framer Motion
- Estimated complexity: medium
- Blocked by: nothing / [other item]
```

---

## Common Mistakes to Avoid

| Mistake | Why It's a Problem | What to Do Instead |
|---------|-------------------|-------------------|
| Committing to `main` | Pollutes upstream OSS history | Always create a feature branch |
| Not pushing mid-session | Lose all work when container dies | Push every 15–30 min |
| Dumping files at repo root | Makes repo hard to navigate | Always use a project folder |
| Creating vague branches | Hard to track intent | Follow naming convention |
| Large binary files without Git LFS | Bloats repo size | Use Git LFS for GLB, MP4, large PNGs |
| Merging without updating wiki | Knowledge drift | Always update Versions.md |
| Overwriting an existing branch | Destroy previous work | Check `git branch -a` first |
