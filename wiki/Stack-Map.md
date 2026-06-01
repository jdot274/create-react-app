# Stack Map — Technology Reference

> Full map of every technology used across Joey's interactive lab, with when-to-use guidance and decision matrix.

---

## Quick Decision Matrix

| Goal | Use This |
|------|---------|
| Interactive web experience with animations | React + Framer Motion + Vite |
| 3D in the browser, React-based | React Three Fiber (R3F) + drei |
| 3D in the browser, standalone | Three.js (vanilla) |
| Procedural 3D asset generation | Blender Python scripts |
| Realtime 3D scene for UE5/film | Blender → export → UE5 |
| High-fidelity real-time render | UE5 with Nanite + Lumen |
| Desktop app wrapper | Electron |
| Web deploy, fast | Netlify |
| Web deploy, edge + serverless | Vercel |
| Interactive prototype / design | Framer (design tool) or Spline |
| Parameter tuning during pipeline run | param_server.py pattern |
| Animated asset export | GLB for web, Alembic for DCC/UE5 |
| Material definitions for pipeline interchange | MaterialX / OpenPBR |

---

## Web Layer

### React
**Used in:** v1 (via CDN), v2 (full Vite app), v3 (viewers)  
**Version preference:** React 18+  
**Notes:**
- v1 uses React via CDN script tag — fine for demos and standalone files
- v2 uses a proper Vite + React project in `site/`
- Always use functional components with hooks, not class components
- Prefer JSX (`.jsx`) over `.js` for component files

**Typical setup:**
```bash
npm create vite@latest my-project -- --template react
cd my-project && npm install
```

### Framer Motion
**Used in:** v2  
**Purpose:** 2D animation system for React — page transitions, reveals, gestures, spring physics  
**Key APIs:**
- `motion.div` — animatable HTML elements
- `AnimatePresence` — exit animations
- `useAnimation()` — programmatic animation control
- `useScroll()` + `useTransform()` — scroll-driven animation
- `useSpring()` — spring physics

**When to use:** Any 2D animation in a React app. Prefer over CSS transitions for anything interactive.

```bash
npm install framer-motion
```

### React Three Fiber (R3F)
**Used in:** v2 (`HeroScene.jsx`, `Scene3DPlayground.jsx`)  
**Purpose:** Declarative Three.js in React — write 3D scenes as JSX components  
**Key packages:**
- `@react-three/fiber` — core R3F
- `@react-three/drei` — helper components (OrbitControls, Environment, useGLTF, etc.)
- `@react-three/postprocessing` — post-processing effects (bloom, chromatic aberration)

**When to use:** Any 3D content embedded in a React application. Bridges R3F with Framer Motion for combined 2D/3D experiences.

```bash
npm install three @react-three/fiber @react-three/drei
npm install @react-three/postprocessing  # for effects
```

**Gotchas:**
- Needs `<Canvas>` wrapper from R3F
- Use `useFrame()` for animation loop (not `requestAnimationFrame` directly)
- Three.js objects are accessed via `ref.current` — they're real Three.js objects
- Use `Suspense` for async asset loading

### Three.js (vanilla)
**Used in:** v3 HTML viewers (`neural_wave.html`, `neural_wave_glass.html`, `neural_wave_viewer.html`)  
**Purpose:** 3D rendering without React framework overhead  
**When to use:** Standalone HTML viewers, quick prototypes, cases where React is overkill

```html
<script type="importmap">
  {"imports": {"three": "https://cdn.skypack.dev/three"}}
</script>
```

Or for self-contained files (v3 pattern), inline the minified Three.js bundle.

### Vite
**Used in:** v2 (`site/vite.config.js`)  
**Purpose:** Build system — dev server, HMR, production bundling  
**Why not Create React App (CRA):** CRA is slow, unmaintained, uses Webpack. Vite is dramatically faster.

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',  // important for Electron compatibility
})
```

**Key scripts:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 3D Asset Pipeline

### Blender
**Used in:** v3  
**Purpose:** Procedural 3D geometry generation, simulation baking, material setup, export  
**Access method:** Python scripts via Blender's bpy API

**Key script patterns from v3:**
```python
import bpy
import bmesh
import numpy as np

# Clear scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Create mesh programmatically
mesh = bpy.data.meshes.new("WaveMesh")
obj = bpy.data.objects.new("Wave", mesh)
bpy.context.collection.objects.link(obj)

# Export to GLB
bpy.ops.export_scene.gltf(
    filepath="/output/asset.glb",
    export_format='GLB',
    export_animations=True
)
```

**Running scripts headless:**
```bash
blender --background --python build_neural_wave_asset.py
```

**Blender version note:** Scripts should target Blender 3.x or 4.x. Check `bpy.app.version` at start of script.

### GLB/GLTF Format
**Used in:** v3 output, v2 as input (planned)  
**When to use:** Whenever you need 3D assets on the web or in UE5  
**Tools:**
- Export from Blender: `Export > glTF 2.0`
- Optimize: `npx gltf-pipeline -i input.glb -o output.glb --draco.compressMeshes`
- View: Three.js, R3F, `<model-viewer>` web component, Babylon.js sandbox
- Inspect: [gltf.report](https://gltf.report/) or glTF Validator

**File size targets:**
- Hero assets (always visible): < 1MB compressed
- Background/lazy-loaded: < 5MB
- Full simulation bakes (Alembic path): no hard limit, stream them

### Alembic (.abc)
**Used in:** v3 (`neural_wave_animated.abc` — 5.4MB)  
**Purpose:** Vertex animation cache — stores exact vertex positions per frame. Used for complex simulations (fluid, cloth, physics) that can't be represented with skeletal animation.  
**When to use:** When you've done a physics simulation in Blender and need to replay it exactly in UE5 or another DCC tool. Not for web delivery (use GLB with baked keyframes for web).

**Export from Blender:**
```python
bpy.ops.wm.alembic_export(
    filepath="/output/animation.abc",
    start=1, end=250,
    xsamples=1,
    flatten=True
)
```

**Import to UE5:** Use Alembic Importer (built-in). Select "Geometry Cache" for vertex animation.

### MaterialX / OpenPBR
**Used in:** v3 (`neural_wave_material.mtlx`, `voxel_wave_openpbr.mtlx`)  
**Purpose:** Portable material definition format — describes PBR materials in a way that works across Blender, UE5, Houdini, etc.  
**When to use:** When materials need to transfer fidelity across multiple DCC tools and renderers.

**Key node types:**
- `standard_surface` — the industry-standard PBR shader
- `open_pbr_surface` — the newer OpenPBR specification  
- `image` — texture map node
- `multiply`, `add`, `mix` — math operations

```xml
<materialx version="1.38">
  <standard_surface name="neural_wave_mat" type="surfaceshader">
    <input name="base_color" type="color3" value="0.02, 0.1, 0.4"/>
    <input name="metalness" type="float" value="0.9"/>
    <input name="roughness" type="float" value="0.1"/>
    <input name="emission_color" type="color3" value="0.0, 0.3, 1.0"/>
    <input name="emission" type="float" value="0.5"/>
  </standard_surface>
</materialx>
```

### param_server.py Pattern
**Used in:** v3 (`param_server.py`)  
**Purpose:** Live HTTP parameter control — run a Python server that accepts JSON param updates and applies them to Blender or UE5 in real time, without restarting.

**How it works:**
1. `param_server.py` starts an HTTP server (default port 8765)
2. Blender script polls `http://localhost:8765/params`
3. `control_panel.html` sends updates via `POST /params`
4. Blender picks up changes and rebuilds geometry / updates materials

**Replicate this pattern** when you want live tweaking during development. The schema lives in `wave_params_schema.json`.

```python
# Minimal param server
from http.server import HTTPServer, BaseHTTPRequestHandler
import json

params = {"amplitude": 1.0, "frequency": 2.0}

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(params).encode())
    
    def do_POST(self):
        length = int(self.headers['Content-Length'])
        body = self.rfile.read(length)
        params.update(json.loads(body))
        self.send_response(200)
        self.end_headers()

HTTPServer(('localhost', 8765), Handler).serve_forever()
```

---

## Runtime & Deploy

### Electron
**Used in:** v2 (`site/electron/main.cjs`)  
**Purpose:** Desktop app wrapper for the web experience  
**When to use:** When Joey wants a native desktop app that can be installed, has file system access, or needs to bypass browser security restrictions

**Key files:**
```
site/
├── electron/
│   └── main.cjs        ← Electron main process
├── vite.config.js      ← base: './' for file:// protocol
└── package.json        ← electron, electron-builder deps
```

**Build installers:**
```bash
# Cross-platform via GitHub Actions
# .github/workflows/build-electron.yml

# Local build (macOS .dmg)
npm run electron:build -- --mac

# Local build (Windows .exe)
npm run electron:build -- --win
```

### Netlify
**Used in:** v1, v2  
**Purpose:** Primary web deploy  
**Config:** `netlify.toml` in project folder

```toml
[build]
  base = "site"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Auto-deploy:** Push to branch → Netlify builds and deploys. Branch deployments get preview URLs.

### Vercel
**Used in:** v1  
**Purpose:** Alternative web deploy, better for edge functions  
**Config:** `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### GitHub Pages
**Purpose:** Free static hosting via `gh-pages` branch  
**When to use:** For HTML viewers and prototypes that don't need a build step

```bash
# Deploy to gh-pages
npx gh-pages -d spatial-code-lab
```

### GitHub Actions
**Used in:** v2 (`.github/workflows/build-electron.yml`)  
**Purpose:** CI/CD for building Windows and macOS Electron installers  
**When to use:** Whenever a desktop app is part of a version

---

## UE5 Integration

### Remote Control API
**Used in:** v3 (`ue5_remote_apply.py`)  
**Purpose:** Push parameter updates to UE5 from external scripts — change material parameters, object transforms, simulation settings without needing to interact with the UE5 editor UI.

**Setup in UE5:**
1. Plugins → enable "Remote Control API"
2. Project Settings → Plugins → Remote Control → set port (default 30010)
3. Expose properties via Remote Control Presets

**Python usage:**
```python
import requests

# Update a material parameter
requests.put('http://localhost:30010/remote/object/property', json={
    "objectPath": "/Game/Materials/WaveMat.WaveMat_C",
    "propertyName": "EmissiveIntensity",
    "propertyValue": {"ObjectType": "double", "value": 2.5}
})
```

### glTFRuntime Plugin
**Purpose:** Load GLB/GLTF assets at runtime in UE5, without cooking them into the project  
**When to use:** When you're generating GLB files dynamically (from Blender pipeline) and want UE5 to load them without re-importing through the Editor each time

**Install:** Fab.com — search "glTFRuntime"

**Blueprint usage:**
1. `glTFRuntime Loader` Actor
2. Set `URL` to local file path or HTTP URL
3. Call `Load glTF Asset From URL` function
4. Use the `Asset` output for mesh component

### Nanite
**Purpose:** UE5's virtual geometry system — handles arbitrarily complex meshes efficiently  
**When to use:** When importing high-poly GLB assets from Blender (millions of triangles)  
**How:** Enable Nanite on the Static Mesh asset in UE5 content browser → right-click → "Enable Nanite"

**Note:** Nanite works on Static Meshes only (not skeletal). For animated Alembic data, Nanite doesn't apply — use Geometry Cache.

### Niagara
**Purpose:** UE5's particle/VFX system  
**When to use:** Building particle effects that complement the wave assets (spray, energy fields, ambient particles)  
**Key integration:** Can sample the wave heightmap texture as a position source for particles

---

## Design Tools

### Framer (design + code)
**Used in:** v1 (`spatial-code-lab/framer/`)  
**Two modes:**
1. **Design tool** — like Figma, for visual design
2. **Code Components** — `.tsx` files that run live in the Framer canvas

**Code Component format:**
```tsx
import { addPropertyControls, ControlType } from "framer"

export default function MyComponent({ color, text }) {
    return (
        <div style={{ background: color, color: "white" }}>
            {text}
        </div>
    )
}

MyComponent.defaultProps = { color: "#0088ff", text: "Hello" }

addPropertyControls(MyComponent, {
    color: { type: ControlType.Color, defaultValue: "#0088ff" },
    text: { type: ControlType.String, defaultValue: "Hello" },
})
```

### Figma
**Purpose:** Design specs, component library, handoff to code  
**When to use:** When designing a new UI before building it; for creating detailed mockups to share

**Figma MCP:** Available as an MCP tool — can read Figma designs and generate code from them.

### Spline
**Used in:** v1 (3D gallery)  
**Purpose:** 3D web embeds with interactive physics  
**How:** Create scene in Spline, export as `<spline-viewer>` embed or export via Three.js

```html
<script type="module" src="https://unpkg.com/@splinetool/viewer@0.9.506/build/spline-viewer.js"></script>
<spline-viewer url="https://prod.spline.design/<scene-id>/scene.splinecode"></spline-viewer>
```

---

## Dependency Matrix by Version

| Package | v1 | v2 | v3 | Notes |
|---------|----|----|-----|-------|
| React | CDN | npm | — | |
| Framer Motion | — | npm | — | |
| React Three Fiber | — | npm | — | |
| Three.js | — | npm | inline CDN | v3 uses inline in HTML viewers |
| Vite | — | npm | — | |
| Electron | — | npm | — | |
| Blender bpy | — | — | system | Run via blender --background |
| three-stdlib | — | npm | — | |
| @react-three/drei | — | npm | — | |

---

## Recommended Package Versions (as of June 2026)

```json
{
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "framer-motion": "^11.0.0",
  "three": "^0.165.0",
  "@react-three/fiber": "^8.17.0",
  "@react-three/drei": "^9.108.0",
  "@react-three/postprocessing": "^2.16.0",
  "vite": "^5.3.0",
  "@vitejs/plugin-react": "^4.3.0",
  "electron": "^31.0.0",
  "electron-builder": "^24.13.0"
}
```
