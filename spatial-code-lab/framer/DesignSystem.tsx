/**
 * Design System — Framer Code Component
 *
 * Paste in Framer → Assets → Code → New Code File
 *
 * Features:
 * - Color palette with live swatches
 * - Typography scale
 * - Spacing & border radius tokens
 * - Elevation / shadow cards
 * - All values editable via Framer's property panel
 */
import { addPropertyControls, ControlType } from "framer"

const T = {
  bg: "#070710", glass: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  blue4: "#60a5fa", blue5: "#3b82f6", ind4: "#818cf8", ind5: "#6366f1",
  cyan4: "#22d3ee", purp4: "#c084fc",
  text: "#f8fafc", textM: "rgba(248,250,252,0.55)", textD: "rgba(248,250,252,0.28)",
}

interface ColorRow { name: string; hex: string; glow?: string }
interface Props {
  headline?: string
  label?: string
  description?: string
  showColors?: boolean
  showTypography?: boolean
  showSpacing?: boolean
  showElevation?: boolean
  style?: React.CSSProperties
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      borderRadius: 20, padding: 24,
      background: T.glass,
      border: `1px solid ${T.border}`,
      backdropFilter: "blur(20px)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",
      position: "relative", overflow: "hidden",
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      {/* Top reflection */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)",
      }} />
      <div style={{
        fontSize: 10, fontWeight: 600, letterSpacing: "0.10em",
        color: T.textD, textTransform: "uppercase", marginBottom: 18,
      }}>{title}</div>
      {children}
    </div>
  )
}

const PALETTE: ColorRow[] = [
  { name: "Blue 500",    hex: "#3b82f6", glow: "rgba(59,130,246,0.5)" },
  { name: "Blue 400",    hex: "#60a5fa", glow: "rgba(96,165,250,0.5)" },
  { name: "Indigo 500",  hex: "#6366f1", glow: "rgba(99,102,241,0.5)" },
  { name: "Indigo 400",  hex: "#818cf8", glow: "rgba(129,140,248,0.4)" },
  { name: "Cyan 400",    hex: "#22d3ee", glow: "rgba(34,211,238,0.5)" },
  { name: "Purple 400",  hex: "#c084fc", glow: "rgba(192,132,252,0.4)" },
  { name: "Text",        hex: "#f8fafc" },
  { name: "Text Muted",  hex: "rgba(248,250,252,0.55)" },
  { name: "Background",  hex: "#070710" },
  { name: "Surface",     hex: "#0d0d1a" },
]

const TYPE_SCALE = [
  { sample: "Aa", size: "72px", weight: 800, label: "Display · 72 · 800" },
  { sample: "Heading",   size: "32px", weight: 700, label: "Heading · 32 · 700" },
  { sample: "Body Large", size: "18px", weight: 500, label: "Body Large · 18 · 500" },
  { sample: "Body text goes here",  size: "14px", weight: 400, label: "Body · 14 · 400" },
  { sample: "LABEL TEXT", size: "11px", weight: 600, label: "Label · 11 · 600 · 0.1em" },
]

const SPACING = [4, 8, 12, 16, 24, 32, 48, 64]
const RADII   = [4, 8, 12, 16, 24, 32]

const ELEVATIONS = [
  { label: "E0 — Flat",    shadow: "none",                                                    border: "rgba(255,255,255,0.06)" },
  { label: "E1 — Low",     shadow: "0 2px 8px rgba(0,0,0,0.25)",                              border: "rgba(255,255,255,0.08)" },
  { label: "E2 — Medium",  shadow: "0 8px 24px rgba(0,0,0,0.35)",                             border: "rgba(255,255,255,0.10)" },
  { label: "E3 — High",    shadow: "0 20px 60px rgba(0,0,0,0.45), 0 0 30px rgba(59,130,246,0.08)", border: "rgba(255,255,255,0.12)" },
]

export default function DesignSystem({
  headline = "Design System",
  label = "● Design System",
  description = "Color palette, typography scale, spacing, and elevation tokens",
  showColors = true,
  showTypography = true,
  showSpacing = true,
  showElevation = true,
  style,
}: Props) {
  return (
    <div style={{
      width: "100%", padding: "96px 0",
      fontFamily: "'Inter', -apple-system, sans-serif",
      background: "transparent",
      boxSizing: "border-box", ...style,
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: T.blue4, marginBottom: 12 }}>
          {label}
        </p>
        <h2 style={{
          fontSize: "clamp(2rem,5vw,3.25rem)", fontWeight: 800,
          letterSpacing: "-0.03em", color: T.text, margin: "0 0 16px",
        }}>{headline}</h2>
        <p style={{ fontSize: 16, color: T.textM, maxWidth: 480, margin: "0 auto" }}>{description}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Color Palette ── */}
        {showColors && (
          <SectionCard title="Color Palette">
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 10,
            }}>
              {PALETTE.map(row => (
                <div key={row.hex} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px", borderRadius: 10,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                    background: row.hex,
                    boxShadow: row.glow ? `0 0 12px ${row.glow}` : undefined,
                    border: "1px solid rgba(255,255,255,0.1)",
                  }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.name}</div>
                    <div style={{ fontSize: 10, color: T.textD, fontFamily: "monospace" }}>{row.hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ── Typography ── */}
        {showTypography && (
          <SectionCard title="Type Scale">
            {TYPE_SCALE.map((t, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "baseline", gap: 16,
                paddingBottom: 14, marginBottom: i < TYPE_SCALE.length - 1 ? 14 : 0,
                borderBottom: i < TYPE_SCALE.length - 1 ? `1px solid ${T.border}` : undefined,
              }}>
                <span style={{
                  fontSize: t.size, fontWeight: t.weight, color: T.text,
                  lineHeight: 1.1, letterSpacing: t.weight === 600 ? "0.1em" : "-0.02em",
                  flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>{t.sample}</span>
                <span style={{
                  flexShrink: 0, fontSize: 10, color: T.textD,
                  whiteSpace: "nowrap",
                }}>{t.label}</span>
              </div>
            ))}
          </SectionCard>
        )}

        {/* ── Spacing + Radii ── */}
        {showSpacing && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <SectionCard title="Spacing Scale">
              <div style={{
                display: "flex", alignItems: "flex-end", gap: 8,
                height: 80, padding: "0 4px",
              }}>
                {SPACING.map(s => (
                  <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
                    <div style={{
                      width: "100%", height: s * 0.9,
                      background: `linear-gradient(to top, rgba(59,130,246,0.5), rgba(99,102,241,0.8))`,
                      borderRadius: "3px 3px 0 0",
                      maxHeight: 72,
                    }} />
                    <span style={{ fontSize: 8, color: T.textD }}>{s}</span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Border Radius">
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
                marginTop: 8,
              }}>
                {RADII.map(r => (
                  <div key={r} style={{
                    width: "100%", aspectRatio: "1",
                    background: "rgba(59,130,246,0.15)",
                    border: "1px solid rgba(59,130,246,0.3)",
                    borderRadius: r,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 9, color: T.blue4, fontWeight: 600 }}>{r}px</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {/* ── Elevation ── */}
        {showElevation && (
          <SectionCard title="Elevation Levels">
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12,
            }}>
              {ELEVATIONS.map((e, i) => (
                <div key={i} style={{
                  padding: "16px 18px", borderRadius: 12,
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${e.border}`,
                  boxShadow: e.shadow,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.blue4, marginBottom: 6 }}>{e.label}</div>
                  <div style={{ fontSize: 10, color: T.textD, fontFamily: "monospace", wordBreak: "break-all", lineHeight: 1.5 }}>
                    {e.shadow === "none" ? "box-shadow: none" : e.shadow}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

      </div>
    </div>
  )
}

addPropertyControls(DesignSystem, {
  headline:       { type: ControlType.String,  title: "Headline",    defaultValue: "Design System" },
  label:          { type: ControlType.String,  title: "Label",       defaultValue: "● Design System" },
  description:    { type: ControlType.String,  title: "Description", defaultValue: "Color palette, typography scale, spacing, and elevation tokens", displayTextArea: true },
  showColors:     { type: ControlType.Boolean, title: "Colors",      defaultValue: true },
  showTypography: { type: ControlType.Boolean, title: "Typography",  defaultValue: true },
  showSpacing:    { type: ControlType.Boolean, title: "Spacing",     defaultValue: true },
  showElevation:  { type: ControlType.Boolean, title: "Elevation",   defaultValue: true },
})
