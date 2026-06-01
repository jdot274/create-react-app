# Agent Template — Operating Guide for AI Agents

> You are a Claude Code session working in Joey's AAA interactive experience lab. This document tells you exactly how to operate. Follow it precisely.

---

## Session Start Checklist

Run through this every time a new session begins. Do not skip steps.

### Step 1: Orient (before writing a single line of code)

```bash
# Read the primary briefing document
cat CLAUDE.md

# See all existing branches
git fetch --all
git branch -a

# Read the version catalogue
cat wiki/Versions.md

# Read the last session's handoff
cat wiki/Session-Handoff.md

# Read the full wiki index
cat wiki/Home.md
```

### Step 2: Understand the Task
- What specifically has Joey asked for?
- Does this extend an existing version, or is it a new version?
- If extending: which branch should you check out?
- If new: what folder name and branch name should you use?
- Are there any blockers called out in the handoff notes?

### Step 3: Set Up Your Branch
```bash
# For a NEW project:
git checkout -b claude/<description>-<4charId>

# For EXTENDING an existing version:
git checkout claude/<existing-branch-name>
git pull origin claude/<existing-branch-name>
```

### Step 4: Create the Folder (if new project)
```bash
mkdir <project-name>
cd <project-name>
# scaffold your project here
```

**Never put project files at the repo root.** Every project gets its own top-level folder.

### Step 5: Push and Create Draft PR Immediately
```bash
# Push your branch as soon as you have a first commit
git push -u origin claude/<your-branch>

# Create a draft PR
gh pr create --draft \
  --title "feat: <brief description of what you're building>" \
  --body "Work in progress. Session started $(date)."
```

You now have a safety net. The container can die; your branch is preserved.

---

## During the Session

### Commit Frequency Rule
**Commit every 15–30 minutes minimum.** More often is better. Never go longer than 30 minutes without a commit and push when doing active coding.

```bash
git add <specific files — not -A blindly>
git commit -m "feat: describe what this chunk of work accomplishes"
git push
```

Use `wip:` prefix for mid-session saves:
```bash
git commit -m "wip: hero section layout done, starting animations"
git push
```

### Folder Rules — Where Does Everything Go?

| What | Where | Example |
|------|-------|---------|
| React source code | `<project>/src/` | `site/src/App.jsx` |
| 3D assets | `<project>/assets/` | `neural-wave/assets/neural_wave.glb` |
| Python pipeline scripts | `<project>/scripts/` | `neural-wave/scripts/build_asset.py` |
| HTML viewers/prototypes | `<project>/viewers/` or `<project>/` | `neural-wave/viewers/viewer.html` |
| Tests | `<project>/tests/` or `<project>/src/__tests__/` | — |
| Build config | `<project>/` | `site/vite.config.js` |
| Deploy config | `<project>/` | `site/netlify.toml` |
| Per-project docs | `<project>/CLAUDE.md` | — |
| Repo-wide docs | `wiki/` | `wiki/Versions.md` |
| Agent context | `CLAUDE.md` at root | — |

### New Version vs. Extending Existing — Decision Framework

**Create a new version (new branch + new folder) when:**
- The concept is substantially different from existing versions
- You're starting from a blank slate rather than iterating
- The new project uses a different tech stack
- It's a different type of experience (3D pipeline vs. web UI vs. tool)
- Joey explicitly said "build a new version"

**Extend an existing version (checkout existing branch) when:**
- Adding a feature clearly within the project's scope
- Fixing bugs or polishing existing work
- Adding more content to an existing section
- Improving performance or build configuration
- Joey said "add X to the existing Y"

**If ambiguous:** Ask Joey before starting. A 30-second clarification is better than building the wrong thing for 2 hours.

---

## Session End Checklist

Complete this before the session ends — every time, without exception.

### Step 1: Final Commit
```bash
# Check what's changed
git status
git diff --stat

# Stage only the files you intended to change
git add <specific files>

# Final commit with a complete description
git commit -m "feat: <describe everything built this session>

- Added <component X> with <capability>
- Built <feature Y> using <tech>
- Created <files> at <paths>
- Tested: <how you verified it works>"

git push
```

### Step 2: Verify the PR
```bash
# Check your PR exists and is up to date
gh pr view

# If the description needs updating
gh pr edit --body "$(cat .github/PULL_REQUEST_TEMPLATE.md)"
```

### Step 3: Update wiki/Versions.md
If you built something significant, add or update the relevant section in `wiki/Versions.md`:
- Add a row to the summary table if it's a new version
- Update the "Key Files" section with files you created
- Update the "What to Build Next" section with what's remaining

### Step 4: Write the Session Handoff
Fill in `wiki/Session-Handoff.md` with what happened this session. This is critical — the next agent (or you in a future session) will read this before doing anything.

```bash
# Edit the handoff file
# See wiki/Session-Handoff.md for the template

git add wiki/Session-Handoff.md wiki/Versions.md
git commit -m "docs: update session handoff and versions after build session"
git push
```

### Step 5: Final Verification
```bash
# Confirm everything is pushed
git status
# Should say: "nothing to commit, working tree clean"

git log --oneline -5
# Should show your commits

gh pr view
# Should show your PR with current description
```

If `git status` shows anything uncommitted — commit it. Do not leave the session with unsaved work.

---

## How to Document What You Built

### In Commit Messages
Use clear, specific language. Future agents will read git log to understand the history.

Good:
```
feat: add HeroScene.jsx with animated R3F particle grid

- 2000 point particle system using BufferGeometry
- Spring-based mouse repulsion via useSpring
- Bloom post-processing via @react-three/postprocessing
- Loads in under 100ms via LOD switching
```

Bad:
```
added stuff
```

### In the PR Description
The PR body should serve as the definitive record of what was built:
- Summary of the experience/feature
- Tech decisions and why
- How to run it
- Known issues or limitations
- What would be built next

### In wiki/Versions.md
The version entry is a persistent catalogue entry. It should be comprehensive enough that any future agent can get up to speed from it alone, without needing to read the code.

### Per-Project CLAUDE.md
If you built a complex project, create a `<project>/CLAUDE.md` with:
- Specific instructions for working on this project
- Any gotchas or non-obvious setup steps
- Key architecture decisions
- Commands to run, test, and deploy

---

## Common Agent Failure Modes — Don't Do These

### 1. Starting without reading context
Reading CLAUDE.md and checking git branch -a takes 30 seconds. Skipping it and building on the wrong branch / in the wrong folder takes hours to clean up.

### 2. Not committing mid-session
If you spend 2 hours building and the container dies without a push, all that work is gone. There is no recovery. Push every 30 minutes, minimum.

### 3. Putting files at repo root
The neural wave branch made this mistake. 40+ files (GLBs, PNGs, HTML files, Python scripts) dumped at root makes the repo look like a mess. Use project folders.

### 4. Creating vague branch names
A branch named `claude/test-XZ4m` tells future agents nothing. `claude/neural-wave-viewer-react-XZ4m` tells them exactly what it is.

### 5. Overwriting existing versions
Always check `git branch -a` before creating a new branch. A branch that looks like it doesn't exist might exist under a slightly different name.

### 6. Explaining instead of doing
Joey's repo has Desktop Commander and GitHub MCP tools. If there's a tool that can accomplish the task, use it. Don't write instructions for Joey to run commands. Run the commands.

### 7. Not opening a PR
Every branch gets a PR. Draft PRs are free and protect your work. There's never a reason not to open one.

### 8. Not updating the wiki
The wiki is only useful if it stays current. After every session that builds something meaningful, update `wiki/Versions.md` and `wiki/Session-Handoff.md`.

---

## Useful Reference Commands

```bash
# What branches exist
git branch -a

# What's on the current branch vs main
git log --oneline main..HEAD

# What files changed
git diff --stat

# What files are staged
git diff --cached --stat

# Create a PR from current branch
gh pr create --draft --title "feat: ..." --body "..."

# List all open PRs
gh pr list

# View a specific PR
gh pr view <number>

# Check CI status
gh run list

# Get a file from another branch
git checkout <branch> -- path/to/file
```

---

## Template for New Project Scaffolding

When starting a new web experience (v4+), use this as a starting scaffold:

```bash
# 1. Create and push branch
git checkout -b claude/<name>-<id>
git push -u origin claude/<name>-<id>
gh pr create --draft --title "init: <name> — scaffolding"

# 2. Create folder structure
mkdir -p <project>/src/components
mkdir -p <project>/public
mkdir -p <project>/assets

# 3. Initialize with Vite + React
cd <project>
npm create vite@latest . -- --template react
npm install
npm install framer-motion
npm install three @react-three/fiber @react-three/drei

# 4. First real commit
git add <project>/
git commit -m "init: scaffold <project> with Vite + React + R3F + Framer Motion"
git push

# 5. Set up netlify.toml
cat > netlify.toml << 'EOF'
[build]
  base = "<project>"
  command = "npm run build"
  publish = "dist"
EOF
git add netlify.toml
git commit -m "chore: add netlify deploy config"
git push
```
