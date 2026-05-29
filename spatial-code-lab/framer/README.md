# Spatial Code Lab — Framer Code Components

## Live URL

The full site is deployed and live at:

**`https://raw.githack.com/jdot274/create-react-app/gh-pages/index.html`**

Use this URL inside Framer's **Embed** element or as the `src` prop of `EmbedFrame`.

---

## How to add to Framer

1. Open your Framer project
2. Go to **Assets** → **Code** → **+** (New Code File)
3. Paste the contents of any `.tsx` file below
4. Drag the component onto your canvas

---

## Components

| File | Description |
|------|-------------|
| `SpatialCodeLab.tsx` | **Full site** — all sections in one component |
| `HeroSection.tsx` | Hero with animated orb, badge, CTAs |
| `SplineGallery.tsx` | 6-card Spline scene gallery |
| `CodePenLab.tsx` | 4-card CodePen grid with CSS demos + iframe slots |
| `DesignSystem.tsx` | Color palette, type scale, spacing, elevation |
| `ReactPlayground.tsx` | Toggles, tabs, modal, dashboard |
| `GlassCard.tsx` | Reusable glassmorphism card |
| `EmbedFrame.tsx` | Lazy-loading iframe for Spline/CodePen/Figma |
| `DockNav.tsx` | Floating bottom navigation dock |

---

## EmbedFrame — Adding real content

`EmbedFrame.tsx` accepts any embed URL:

```tsx
// Spline 3D scene
<EmbedFrame
  src="https://my.spline.design/your-scene-id/"
  embedType="spline"
  height={400}
/>

// CodePen
<EmbedFrame
  src="https://codepen.io/username/embed/pen-id/?default-tab=result&theme-id=dark"
  embedType="codepen"
  height={320}
/>

// Figma prototype
<EmbedFrame
  src="https://www.figma.com/embed?embed_host=share&url=YOUR_FIGMA_URL"
  embedType="figma"
  height={500}
/>

// Full Spatial Code Lab site (live deployment)
<EmbedFrame
  src="https://raw.githack.com/jdot274/create-react-app/gh-pages/index.html"
  embedType="custom"
  height={800}
/>
```

---

## Custom HTML/CSS/JS in Framer

In Framer, use **Custom Code** (Site Settings → Custom Code) to inject:

```html
<!-- Spline viewer web component -->
<script type="module" src="https://unpkg.com/@splinetool/viewer@1.0.82/build/spline-viewer.js"></script>
```

Then in any Code Component:

```tsx
// Render a Spline viewer directly
export default function SplineEmbed() {
  return (
    <div style={{ width: "100%", height: 400 }}>
      {/* @ts-ignore */}
      <spline-viewer url="https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode" />
    </div>
  )
}
```

---

## Design tokens (copy into Framer Variables)

| Token | Value |
|-------|-------|
| `--bg-base` | `#070710` |
| `--blue-500` | `#3b82f6` |
| `--blue-400` | `#60a5fa` |
| `--indigo-500` | `#6366f1` |
| `--cyan-400` | `#22d3ee` |
| `--purple-400` | `#c084fc` |
| `--text` | `#f8fafc` |
| `--text-muted` | `rgba(248,250,252,0.55)` |
| `--border` | `rgba(255,255,255,0.08)` |
| `--glass` | `rgba(255,255,255,0.04)` |
| `--blur` | `blur(20px)` |
