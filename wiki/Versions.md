# Versions — Complete Build Catalogue

> Every interactive experience built in this repo, with full context for picking up where we left off.

---

## Summary Table

| # | Name | Branch | PR | Folder | Stack | Status |
|---|------|--------|----|--------|-------|--------|
| v1 | Spatial Code Lab | `claude/spatial-code-lab-2WtXw` | [PR #1](https://github.com/jdot274/create-react-app/pull/1) | `spatial-code-lab/` | Vanilla HTML/CSS/JS + React + Framer (.tsx) + Spline | Shipped |
| v2 | React 2D+3D Interactive Site | `claude/react-2d-3d-interactive-site-XcFbo` | [PR #2](https://github.com/jdot274/create-react-app/pull/2) | `site/` | React + Framer Motion + R3F + Three.js + Vite + Electron | Shipped |
| v3 | Neural Wave Animation | `claude/neural-wave-animation-2Mc4t` | None yet | root (messy) | Blender Python + GLB/GLTF + Alembic + MaterialX/OpenPBR | Shipped — needs folder cleanup |

---

## v1 — Spatial Code Lab

**Branch:** `claude/spatial-code-lab-2WtXw`  
**PR:** [#1](https://github.com/jdot274/create-react-app/pull/1)  
**Folder:** `spatial-code-lab/`

### What It Is
A glassmorphism-themed interactive showcase site. Dark theme with blues, indigo, cyan, and purple accents. The experience is organized into full-screen sections scrolled through vertically, with a persistent floating dock navigation.

### Sections Built
1. **Hero** — animated text reveal, particle background, glassmorphism card
2. **Spline 3D Gallery** — embedded Spline 3D scenes in glassmorphism panels
3. **CodePen Lab** — live CodePen embeds with hover interactions
4. **React Playground** — interactive React component demos
5. **Figma Integration** — Figma embed with glassmorphism frame
6. **Dock Nav** — macOS-style floating dock with hover magnification

### Key Files
```
spatial-code-lab/
├── index.html              ← entry point
├── app.js                  ← main vanilla JS application (~39KB)
├── styles.css              ← complete design system (~47KB)
├── framer/                 ← Framer Code Components (.tsx)
└── webflow/                ← Webflow integration files
```

### Tech Stack
- **Vanilla HTML/CSS/JS** — no build step required, open index.html directly
- **React** — via CDN, for interactive component demos
- **Framer Code Components** — `.tsx` files in `framer/` subfolder, drag into Framer canvas
- **Spline** — 3D scenes embedded via `<spline-viewer>` web component
- **Netlify** — deploy via `netlify.toml` at repo root
- **Vercel** — deploy via `vercel.json` at repo root

### How to Run
```bash
git checkout claude/spatial-code-lab-2WtXw
# Option 1: Open directly
open spatial-code-lab/index.html

# Option 2: Serve locally
npx serve spatial-code-lab
# or
python -m http.server 8080 -d spatial-code-lab
```

### How to Deploy
```bash
# Netlify (auto-deploys on push to branch)
# netlify.toml points build to spatial-code-lab/

# Vercel
vercel --cwd spatial-code-lab
```

### What to Build Next / Extension Ideas
- Add more Spline scenes (currently using placeholder/demo scenes)
- Add a terminal/code editor section with Monaco Editor
- Add cursor-following glow effect
- Animate the dock appearance on scroll
- Add a music visualizer section using Web Audio API
- Add WebGL shader backgrounds via Three.js

---

## v2 — React 2D+3D Interactive Site

**Branch:** `claude/react-2d-3d-interactive-site-XcFbo`  
**PR:** [#2](https://github.com/jdot274/create-react-app/pull/2)  
**Folder:** `site/`

### What It Is
A full React application combining 2D Framer Motion animations with React Three Fiber 3D scenes. Built with Vite for fast development. Wrapped in Electron for distribution as a desktop app. Includes CI/CD pipelines for building Windows (.exe) and macOS (.dmg) installers.

### Components Built
```
site/src/
├── App.jsx                 ← root component, routing, layout (~14KB)
├── index.jsx               ← entry point
└── components/
    ├── HeroScene.jsx       ← Three.js/R3F 3D hero section
    ├── Motion2D.jsx        ← Framer Motion 2D animation showcase
    ├── Scene3DPlayground.jsx ← interactive R3F scene with controls
    ├── ComponentStage.jsx  ← component demonstration stage
    └── Navbar.jsx          ← navigation bar
```

### Key Files
```
site/
├── package.json            ← dependencies (React, R3F, Framer Motion, Electron)
├── vite.config.js          ← Vite build config
├── index.html              ← HTML entry
├── src/                    ← React source (see above)
├── electron/
│   └── main.cjs            ← Electron main process
└── public/                 ← static assets
```

### CI/CD
```
.github/workflows/
└── build-electron.yml      ← builds Windows .exe and macOS .dmg on push
```

### Tech Stack
- **React** + **JSX** — component framework
- **Framer Motion** — 2D animations, transitions, gestures
- **React Three Fiber** — 3D scenes via Three.js
- **Three.js** — underlying 3D engine
- **Vite** — build system and dev server
- **Electron** — desktop app wrapper
- **GitHub Actions** — CI/CD for Windows/macOS build artifacts
- **Netlify** — web deploy (netlify.toml)

### How to Run
```bash
git checkout claude/react-2d-3d-interactive-site-XcFbo
cd site

# Install dependencies
npm install

# Development server (web)
npm run dev
# → http://localhost:5173

# Electron desktop app
npm run electron:dev
# or
npx electron .

# Production build
npm run build
```

### How to Deploy
```bash
# Web (Netlify auto-deploy)
# Set build command: cd site && npm run build
# Set publish dir: site/dist

# Electron installers (via GitHub Actions)
# Push to branch → CI builds Windows/macOS artifacts
# Download from Actions run artifacts

# Manual Electron build
cd site && npm run electron:build
```

### What to Build Next / Extension Ideas
- Add a particle system in the hero using `@react-three/drei`'s `<Points>` component
- Add a post-processing pipeline: bloom, chromatic aberration via `@react-three/postprocessing`
- Integrate the neural wave GLB from v3 into the 3D scene
- Add a code editor panel using Monaco Editor (like v1's code lab concept, but in React)
- Improve the Electron tray icon and native OS integration
- Add auto-update mechanism to Electron app
- Export the site as a self-contained HTML file for offline use

---

## v3 — Neural Wave Animation

**Branch:** `claude/neural-wave-animation-2Mc4t`  
**PR:** None — needs to be created  
**Folder:** ROOT (messy — needs reorganization into `neural-wave/`)

### What It Is
A Blender-driven 3D wave simulation pipeline. Python scripts procedurally generate several types of wave geometry, bake them to GLB/Alembic, and export them with MaterialX materials. HTML viewers allow real-time preview in-browser. Live parameter control via a Python HTTP server. UE5 import pipeline included.

### Assets Generated
| Asset | Format | Description |
|-------|--------|-------------|
| `neural_wave.glb` | GLB | Static neural wave mesh (253KB) |
| `neural_wave_animated.glb` | GLB | Animated neural wave (5MB) |
| `neural_wave_animated.abc` | Alembic | Full animation cache (5.4MB) |
| `softbody_slab.glb` | GLB | Softbody physics bake (6.7MB) |
| `voxel_wave.glb` | GLB | Voxelized wave (9.4MB) |
| `neural_wave_material.mtlx` | MaterialX | PBR material for neural wave |
| `voxel_wave_openpbr.mtlx` | MaterialX/OpenPBR | Material for voxel wave |

### Python Scripts
| Script | Purpose |
|--------|---------|
| `neural_wave_blender.py` | Core Blender script: generates neural wave geometry via displacement modifiers |
| `build_neural_wave_asset.py` | Full pipeline: geometry → materials → export (31KB, most comprehensive) |
| `build_softbody_slab.py` | Builds the softbody physics simulation and bakes to GLB |
| `build_voxel_wave.py` | Generates voxelized wave structure |
| `bake_alembic.py` | Bakes vertex animation to Alembic format |
| `bake_alembic_direct.py` | Direct Alembic bake variant |
| `param_server.py` | HTTP server for live parameter control (9.9KB) |
| `ue5_remote_apply.py` | Applies parameters to UE5 via Remote Control API |
| `render_preview.py` | Renders preview PNGs from Blender |
| `wave_params_schema.json` | JSON schema defining all tunable parameters |

### HTML Viewers
| File | Description |
|------|-------------|
| `neural_wave.html` | Basic Three.js viewer for neural_wave.glb |
| `neural_wave_glass.html` | Glassmorphism-styled viewer (18KB) |
| `neural_wave_viewer.html` | Self-contained viewer with full controls (339KB — includes Three.js inline) |
| `control_panel.html` | Live parameter control panel UI, connects to param_server.py |

### Preview Assets
- `neural_wave_hero.png` — hero render (201KB)
- `softbody_slab_hero.png` — softbody hero render (192KB)
- `voxel_wave_hero.png` — voxel wave hero render (196KB)
- `neural_wave_preview.gif` — animation preview (2.7MB)
- `softbody_slab_preview.gif` — softbody animation (2.5MB)
- `voxel_wave_preview.gif` — voxel animation (3.2MB)
- `wave_flipbook.png` — animation flipbook (426KB)
- `wave_heightmap.png` — heightmap texture (75KB)
- `wave_normalmap.png` — normal map (143KB)

### How to Run the Pipeline
```bash
git checkout claude/neural-wave-animation-2Mc4t

# 1. Generate assets via Blender
blender --background --python build_neural_wave_asset.py
blender --background --python build_softbody_slab.py
blender --background --python build_voxel_wave.py

# 2. Start live parameter server
python param_server.py
# → http://localhost:8765
# → Open control_panel.html to tweak params live

# 3. Preview assets in browser
open neural_wave_viewer.html   # self-contained, no server needed
open neural_wave_glass.html    # glassmorphism viewer

# 4. Push to UE5 (requires UE5 running with Remote Control plugin)
python ue5_remote_apply.py
```

### How to Open the Viewers
The `neural_wave_viewer.html` is 339KB and entirely self-contained (Three.js bundled inline). Open directly in any browser — no server needed. `control_panel.html` requires `param_server.py` to be running.

### Folder Cleanup Required
All files are currently at repo root. The correct structure should be:
```
neural-wave/
├── scripts/
│   ├── neural_wave_blender.py
│   ├── build_neural_wave_asset.py
│   ├── build_softbody_slab.py
│   ├── build_voxel_wave.py
│   ├── bake_alembic.py
│   ├── param_server.py
│   └── ue5_remote_apply.py
├── assets/
│   ├── neural_wave.glb
│   ├── neural_wave_animated.glb
│   ├── neural_wave_animated.abc
│   ├── softbody_slab.glb
│   ├── voxel_wave.glb
│   ├── neural_wave_material.mtlx
│   └── voxel_wave_openpbr.mtlx
├── viewers/
│   ├── neural_wave.html
│   ├── neural_wave_glass.html
│   ├── neural_wave_viewer.html
│   └── control_panel.html
├── previews/
│   ├── neural_wave_hero.png
│   ├── softbody_slab_hero.png
│   ├── voxel_wave_hero.png
│   ├── *.gif
│   ├── wave_flipbook.png
│   ├── wave_heightmap.png
│   └── wave_normalmap.png
└── wave_params_schema.json
```

### What to Build Next / Extension Ideas
- Create a PR for this branch (it currently has none)
- Reorganize files into the `neural-wave/` folder structure above
- Build a React component that loads `neural_wave_animated.glb` via R3F — bridge v2 + v3
- Add audio-reactive parameters (Web Audio API → param_server.py)
- Create a Niagara particle system in UE5 that reads from the wave heightmap
- Build a flipbook shader for the wave texture in Three.js
- Create more wave variants: plasma wave, grid wave, ribbon wave
- Add HDRI environment and proper IBL lighting to the HTML viewers

---

## Adding a New Version (v4+)

When creating a new version, add a row to the summary table at the top and create a full section following this template:

```markdown
## v4 — [Name]

**Branch:** `claude/<description>-<id>`  
**PR:** [#N](link)  
**Folder:** `<project-folder>/`

### What It Is
[1-3 sentence description]

### Key Files
[file tree or table]

### Tech Stack
[bullet list]

### How to Run
[code block with commands]

### What to Build Next
[bullet list of ideas]
```
