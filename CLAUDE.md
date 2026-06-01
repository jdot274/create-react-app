# CLAUDE.md — Agent Context & Operating Manual

> **READ THIS FIRST.** Every Claude Code session in this repo must read this file before doing anything else. It is the authoritative briefing document for all AI agents working here.

---

## What This Repo Is

This is **Joey's AAA interactive experience lab** — a personal R&D repository for building high-quality, visually ambitious interactive experiences. Think: spatial interfaces, real-time 3D, glassmorphism UI, neural simulations, Blender-to-web pipelines, and Electron desktop apps.

**Owner:** Joey (jdw274@cornell.edu)  
**Aesthetic:** Dark glassmorphism · spatial animations · AAA visual quality · neon accents on black · cinematic feel  
**Goal:** Each branch/version is a self-contained experiment or deliverable. The repo is a living portfolio of interactive techniques.

---

## Existing Versions — Quick Reference

| Version | Branch | PR | What It Is | Stack | Status |
|---------|--------|----|------------|-------|--------|
| v1 | `claude/spatial-code-lab-2WtXw` | [PR #1](../../pull/1) | Spatial Code Lab — glassmorphism showcase with Spline 3D, CodePen lab, React Playground, Figma integration, dock nav | Vanilla HTML/CSS/JS + React + Framer Code Components (.tsx) + Spline | Shipped |
| v2 | `claude/react-2d-3d-interactive-site-XcFbo` | [PR #2](../../pull/2) | React 2D+3D Interactive Site — full React app with Framer Motion, React Three Fiber, Electron desktop wrapper | React + Framer Motion + R3F + Three.js + Vite + Electron | Shipped |
| v3 | `claude/neural-wave-animation-2Mc4t` | (no PR yet) | Neural Wave Animation — Blender Python pipeline generating GLB/Alembic assets, HTML viewers, UE5 integration tools | Blender Python + GLB/GLTF + Alembic + MaterialX/OpenPBR + param_server.py | Shipped |

For full details on each version, see [`wiki/Versions.md`](wiki/Versions.md).

---

## CRITICAL RULES — Read Before Writing Any Code

### 1. NEVER commit directly to `main`
`main` is sacred. It is never touched directly. Every piece of work lives on a feature branch. There are no exceptions.

### 2. Always create a new branch first
```bash
# Before doing ANYTHING, check what branches exist:
git branch -a
git fetch --all

# Create your branch:
git checkout -b claude/<short-description>-<4char-id>
# Example: claude/particle-hero-9xKm
```

### 3. Branch naming convention
```
claude/<short-kebab-description>-<4-char-alphanumeric-id>
```
- Keep description short (2–4 words max)
- 4-char ID is random alphanumeric (mix of letters and numbers)
- Examples: `claude/spatial-code-lab-2WtXw`, `claude/neural-wave-animation-2Mc4t`

### 4. Always push and open a draft PR
Even if incomplete. A draft PR is your safety net against container expiry.
```bash
git push -u origin claude/your-branch-name
gh pr create --draft --title "..." --body "..."
```

### 5. Commit early, commit often
Claude Code sessions run in ephemeral containers. If you don't push, your work is gone when the session ends. Commit after every meaningful chunk of work — not just at the end.

---

## Folder Structure Conventions

Each project lives in its **own top-level folder**. Never dump files at the repo root.

```
create-react-app/
├── CLAUDE.md                          ← this file (root level is fine for agent files)
├── wiki/                              ← all documentation lives here
│   ├── Home.md
│   ├── Versions.md
│   ├── GitHub-Best-Practices.md
│   ├── Agent-Template.md
│   ├── Stack-Map.md
│   └── Session-Handoff.md
├── spatial-code-lab/                  ← v1 project folder
├── <react-2d-3d-interactive-site>/    ← v2 project folder
├── <your-new-project>/                ← v4, v5, etc — each gets its own folder
└── .github/
    ├── PULL_REQUEST_TEMPLATE.md
    ├── ISSUE_TEMPLATE/
    │   ├── session-brief.md
    │   ├── bug_report.md
    │   └── proposal.md
    └── workflows/
```

> **Lesson from v3 (Neural Wave):** The neural wave animation put GLB files, Python scripts, HTML viewers, and PNGs directly at the repo root. This is messy and makes the repo hard to navigate. All future projects **must** use a dedicated top-level folder.

### What goes where

| File type | Location |
|-----------|----------|
| Project source code | `<project-name>/src/` |
| 3D assets (GLB, ABC, textures) | `<project-name>/assets/` |
| Build config (vite.config.js, etc.) | `<project-name>/` (project root) |
| Deploy config (netlify.toml, vercel.json) | `<project-name>/` |
| Documentation for the repo | `wiki/` |
| Per-project agent notes | `<project-name>/CLAUDE.md` |
| CI/CD workflows | `.github/workflows/` |
| Global agent context | `CLAUDE.md` (this file, repo root) |

---

## Tech Stack Preferences

### Interactive Web
- **React** — component framework of choice
- **Framer Motion** — all 2D animations and transitions
- **React Three Fiber (R3F)** — 3D scenes embedded in React
- **Three.js** — underlying 3D engine (use via R3F, not raw Three.js unless necessary)
- **Vite** — build system (fast, modern; use this, not Create React App)
- **TypeScript** — preferred for Framer Code Components; JavaScript fine for everything else

### 3D Asset Pipeline
- **Blender** — 3D modeling and animation, controlled via Python scripts
- **GLB/GLTF** — primary 3D asset format for web delivery
- **Alembic (.abc)** — vertex animation / simulation bake format
- **MaterialX / OpenPBR** — material definition format
- **param_server.py pattern** — live HTTP parameter control during Blender sessions

### Deploy Targets
- **Netlify** — preferred web deploy (netlify.toml)
- **Vercel** — web deploy alternative (vercel.json)
- **Electron** — desktop wrapper (electron/main.cjs)
- **GitHub Pages** — static deploy option

### UE5 Integration
- **Remote Control API** — live parameter push from Python (ue5_remote_apply.py pattern)
- **glTFRuntime plugin** — load GLB assets at runtime in UE5
- **Nanite** — for high-poly mesh import
- **Niagara** — particle/VFX systems

### Design Tools
- **Framer** — for Framer Code Components (.tsx) and design prototypes
- **Figma** — design handoff and component specs
- **Spline** — 3D web embeds (used in v1)

---

## File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| React components | PascalCase.jsx / .tsx | `HeroScene.jsx`, `ComponentStage.tsx` |
| Utility hooks | camelCase.js | `useScrollProgress.js` |
| Utility modules | camelCase.js | `animationUtils.js` |
| Config files | lowercase with dots | `vite.config.js`, `netlify.toml` |
| Blender Python scripts | snake_case.py | `neural_wave_blender.py` |
| 3D assets | snake_case + descriptor | `neural_wave_animated.glb` |
| HTML viewers | snake_case.html | `neural_wave_viewer.html` |
| Wiki docs | Title-Case-Hyphenated.md | `Stack-Map.md` |
| Session handoff notes | Session-Handoff.md (one file, overwrite) | — |

---

## How to NOT Overwrite Existing Versions

Before starting any new build session, run these checks:

```bash
# 1. See all branches (including remote ones)
git fetch --all
git branch -a

# 2. Read the versions catalogue
cat wiki/Versions.md

# 3. Read last session's handoff
cat wiki/Session-Handoff.md

# 4. Decision:
#    - Extending an existing version? → checkout that version's branch
#    - Building something new?        → create a fresh branch
```

**Golden rule:** When in doubt, create a new branch. You can always merge or cherry-pick later. You cannot recover lost work from an overwritten branch.

---

## How to Add to This Wiki

1. Create your new file at `wiki/Your-Topic.md`
2. Open `wiki/Home.md` and add a link + one-line description to the appropriate section
3. If you built a new version, add a row to the table in `wiki/Versions.md`
4. Commit with: `docs: add wiki/Your-Topic.md — brief description`

---

## Aesthetic Reference

When building anything visual for this repo, the design language is:

**Colors**
- Background: near-black (`#0a0a0f`, `#050508`)
- Primary accent: electric blue / cyan (`#00d4ff`, `#0088ff`)
- Secondary accent: purple / indigo (`#6366f1`, `#8b5cf6`, `#a855f7`)
- Text: white primary, `rgba(255,255,255,0.7)` secondary, `rgba(255,255,255,0.4)` tertiary

**Glassmorphism panels**
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 16px;
```

**Glow effects**
```css
box-shadow: 0 0 20px rgba(0, 212, 255, 0.3), 0 0 60px rgba(0, 136, 255, 0.1);
```

**Motion principles**
- Smooth, intentional, spring-based physics
- Nothing abrupt — ease everything in and out
- Parallax and scroll-driven animations where appropriate
- 60fps minimum; optimize aggressively

**Quality bar:** AAA. If it looks like a tutorial project, keep working.

---

## Quick Commands Reference

```bash
# Start a new session — always run these first
git fetch --all
git branch -a                          # see all branches
cat CLAUDE.md                          # re-read this file
cat wiki/Versions.md                   # see all versions
cat wiki/Session-Handoff.md            # see last session's handoff notes

# Create a new branch
git checkout -b claude/<description>-<4charId>
git push -u origin claude/<description>-<4charId>

# During a session — commit often!
git add <specific files>               # never `git add -A` blindly
git commit -m "feat: describe what you built"
git push

# End a session — do all of this
git push -u origin <your-branch>
gh pr create --draft --title "feat: ..." --body "..."
# Update wiki/Session-Handoff.md with what you did, then push again
```

---

*Last updated: 2026-06-01 | Maintained by Claude Code agents on behalf of Joey (jdw274@cornell.edu)*
