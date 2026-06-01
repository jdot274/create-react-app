# Wiki Home — Joey's AAA Interactive Lab

> This is the knowledge hub for `jdot274/create-react-app` — Joey's creative development repo for AAA interactive experiences.
> Start here, then follow the links to whatever you need.

---

## Quick Start for New Agents

1. Read [`CLAUDE.md`](../CLAUDE.md) at the repo root — the primary agent briefing
2. Check [`wiki/Versions.md`](./Versions.md) to understand what's already been built
3. Check [`wiki/Session-Handoff.md`](./Session-Handoff.md) for the most recent handoff note (if one exists)
4. Check existing branches before creating anything: `git branch -a`

---

## Documents in This Wiki

| File | What It Covers |
|------|----------------|
| [**Versions.md**](./Versions.md) | Full catalogue of all 3 built versions — branch, PR, key files, how to run, what to build next |
| [**GitHub-Best-Practices.md**](./GitHub-Best-Practices.md) | Branch strategy, commit style, PR workflow, protecting work in ephemeral containers |
| [**Agent-Template.md**](./Agent-Template.md) | Operating guide for AI agents — session start/end checklists, folder rules, handoff protocol |
| [**Stack-Map.md**](./Stack-Map.md) | Full technology map across all versions with when-to-use decision matrix |
| [**Session-Handoff.md**](./Session-Handoff.md) | Fill-in template for ending a session and briefing the next agent |

---

## Repo at a Glance

```
jdot274/create-react-app
├── CLAUDE.md                    ← Agent briefing (READ THIS FIRST)
├── wiki/                        ← You are here
│   ├── Home.md
│   ├── Versions.md
│   ├── GitHub-Best-Practices.md
│   ├── Agent-Template.md
│   ├── Stack-Map.md
│   └── Session-Handoff.md
├── spatial-code-lab/            ← v1: Glassmorphism portfolio
├── site/                        ← v2: React 2D+3D site + Electron
└── [neural wave files at root]  ← v3: needs reorganization into neural-wave/
```

---

## Active Branches

| Branch | Purpose | PR |
|--------|---------|-----|
| `main` | Upstream create-react-app — NEVER COMMIT HERE | — |
| `claude/spatial-code-lab-2WtXw` | v1 Spatial Code Lab | [PR #1](https://github.com/jdot274/create-react-app/pull/1) |
| `claude/react-2d-3d-interactive-site-XcFbo` | v2 React 2D+3D Site | [PR #2](https://github.com/jdot274/create-react-app/pull/2) |
| `claude/neural-wave-animation-2Mc4t` | v3 Neural Wave Assets | No PR — needs one |
| `claude/github-wiki-knowledge-template-1cci0` | This knowledge system | In progress |

---

## How to Update This Wiki

When you build something new:
1. Add a new file to `wiki/` if it warrants its own document
2. Add a row to the table above with a one-line description
3. Update `wiki/Versions.md` if you built a new version
4. Fill out `wiki/Session-Handoff.md` before ending your session

When your session ends:
- Copy the Session-Handoff template, fill it in, and commit it as `wiki/handoff-YYYY-MM-DD.md`
- Push and update the PR

---

## Design Language Reference

**Palette:** Near-black (`#050510`) → Blues → Indigos → Cyans → Purple neons  
**Effects:** Glassmorphism (backdrop-blur + semi-transparent), glow borders, spatial depth  
**Motion:** Spring physics, scroll-triggered reveals, 3D parallax  
**Quality bar:** AAA game-engine aesthetics delivered in the browser
