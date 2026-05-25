import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect } from "react"

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@keyframes scl-modalIn { from{opacity:0;transform:scale(0.9) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
@keyframes scl-backdropIn { from{opacity:0} to{opacity:1} }
@keyframes scl-barGrow { from{height:0} to{height:var(--bar-h)} }
`
function injectCSS(id: string, css: string) {
  if (typeof document === "undefined" || document.getElementById(id)) return
  const s = document.createElement("style"); s.id = id; s.textContent = css
  document.head.appendChild(s)
}

function GCard({ children, title, style }: { children: React.ReactNode; title: string; style?: React.CSSProperties }) {
  return (
    <div style={{
      borderRadius: 20, overflow: "hidden",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      ...style,
    }}>
      <div style={{
        padding: "16px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(248,250,252,0.4)", textTransform: "uppercase" }}>{title}</span>
        <span style={{ fontSize: 10, color: "rgba(248,250,252,0.2)" }}>React · useState</span>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  )
}

function Toggle({ label, initialOn = false }: { label: string; initialOn?: boolean }) {
  const [on, setOn] = useState(initialOn)
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 16px", borderRadius: 12,
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.05)",
      marginBottom: 8, cursor: "pointer",
    }} onClick={() => setOn(v => !v)}>
      <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(248,250,252,0.65)" }}>{label}</span>
      <div style={{
        width: 44, height: 24, borderRadius: 9999, position: "relative", cursor: "pointer",
        background: on ? "linear-gradient(135deg, #3b82f6, #6366f1)" : "rgba(255,255,255,0.1)",
        boxShadow: on ? "0 0 16px rgba(59,130,246,0.35)" : "none",
        transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", top: 2, borderRadius: "50%",
          width: 20, height: 20, background: "white",
          left: on ? 22 : 2,
          transition: "left 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
        }} />
      </div>
    </div>
  )
}

function Tabs() {
  const tabs = ["Overview", "Analytics", "Settings"]
  const [active, setActive] = useState(0)
  const content = [
    "Welcome to the Spatial Code Lab. This interactive canvas combines Spline 3D scenes, CodePen demos, Figma prototypes, and React components.",
    "Page views: 42,840 · Unique visitors: 12,400 · Avg. session: 3m 24s · Bounce rate: 28% · Conversion: 2.8%",
    "Configure embed sources, animation settings, theme tokens, and component behavior from this settings panel.",
  ]
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{
        display: "flex", gap: 2, padding: 4, borderRadius: 12,
        background: "rgba(255,255,255,0.04)",
      }}>
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setActive(i)} style={{
            flex: 1, padding: "8px 16px", borderRadius: 10,
            border: "none", cursor: "pointer", fontFamily: "inherit",
            fontSize: 13, fontWeight: 500,
            background: active === i ? "rgba(59,130,246,0.2)" : "transparent",
            color: active === i ? "#60a5fa" : "rgba(248,250,252,0.4)",
            boxShadow: active === i ? "0 0 16px rgba(59,130,246,0.1)" : "none",
            transition: "all 0.2s",
          }}>{t}</button>
        ))}
      </div>
      <div style={{
        padding: 16, borderRadius: 12,
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        fontSize: 13, color: "rgba(248,250,252,0.6)", lineHeight: 1.7,
      }}>{content[active]}</div>
    </div>
  )
}

function ModalDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <button onClick={() => setOpen(true)} style={{
          padding: "12px 28px", borderRadius: 9999, border: "none",
          background: "linear-gradient(135deg, #3b82f6, #6366f1)",
          color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer",
          boxShadow: "0 4px 20px rgba(59,130,246,0.35)", fontFamily: "inherit",
          transition: "transform 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
        >Open Modal Dialog</button>
        <p style={{ fontSize: 12, color: "rgba(248,250,252,0.25)", textAlign: "center" }}>
          Glassmorphism modal with backdrop blur
        </p>
      </div>
      {open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "scl-backdropIn 0.2s ease forwards",
        }} onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}>
          <div style={{
            width: 420, background: "rgba(13,13,26,0.95)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 28, padding: 32, position: "relative",
            boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(59,130,246,0.1)",
            animation: "scl-modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards",
            fontFamily: "'Inter', sans-serif",
          }}>
            <button onClick={() => setOpen(false)} style={{
              position: "absolute", top: 16, right: 16,
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(248,250,252,0.5)", cursor: "pointer",
              fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "inherit",
            }}>×</button>
            <div style={{
              width: 40, height: 40, borderRadius: 12, marginBottom: 20,
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20,
            }}>◉</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f8fafc", margin: "0 0 10px" }}>Spatial Code Lab</h3>
            <p style={{ fontSize: 14, color: "rgba(248,250,252,0.55)", lineHeight: 1.7, margin: "0 0 28px" }}>
              This modal is a React component with glassmorphism styling, backdrop blur, and spring animation. Add any HTML, CSS, JS, or React content here.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setOpen(false)} style={{
                padding: "10px 20px", borderRadius: 12,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(248,250,252,0.6)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}>Cancel</button>
              <button onClick={() => setOpen(false)} style={{
                padding: "10px 20px", borderRadius: 12,
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                border: "none", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 4px 16px rgba(59,130,246,0.4)",
              }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function Dashboard() {
  const metrics = [
    { label: "Revenue",  value: "$48.2k", change: "+12.4%", up: true,  color: "#34d399" },
    { label: "Users",    value: "12.4k",  change: "+8.2%",  up: true,  color: "#34d399" },
    { label: "Orders",   value: "3.2k",   change: "-2.1%",  up: false, color: "#f87171" },
    { label: "Conv.",    value: "2.8%",   change: "+0.4%",  up: true,  color: "#34d399" },
  ]
  const bars = [42, 68, 55, 80, 62, 90, 74]
  const days = ["M", "T", "W", "T", "F", "S", "S"]
  const [hovBar, setHovBar] = useState<number | null>(null)

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {metrics.map(m => (
          <div key={m.label} style={{
            padding: "14px 16px", borderRadius: 14,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <p style={{ fontSize: 11, color: "rgba(248,250,252,0.35)", margin: "0 0 4px" }}>{m.label}</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: "#f8fafc", margin: "0 0 4px", letterSpacing: "-0.02em" }}>{m.value}</p>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 9999,
              background: m.up ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)",
              color: m.color,
            }}>{m.change}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90 }}>
        {bars.map((h, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div
              onMouseEnter={() => setHovBar(i)}
              onMouseLeave={() => setHovBar(null)}
              style={{
                width: "100%", borderRadius: "4px 4px 0 0",
                height: `${h}%`,
                background: hovBar === i
                  ? "linear-gradient(to top, #3b82f6, #22d3ee)"
                  : "linear-gradient(to top, rgba(59,130,246,0.5), rgba(99,102,241,0.8))",
                boxShadow: hovBar === i ? "0 0 16px rgba(59,130,246,0.4)" : "none",
                transition: "all 0.2s",
                cursor: "pointer",
              }} />
            <span style={{ fontSize: 9, color: "rgba(248,250,252,0.25)" }}>{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface Props {
  style?: React.CSSProperties
  showToggles?: boolean
  showTabs?: boolean
  showModal?: boolean
  showDashboard?: boolean
}

export default function ReactPlayground({
  style,
  showToggles = true,
  showTabs = true,
  showModal = true,
  showDashboard = true,
}: Props) {
  useEffect(() => { injectCSS("scl-playground-css", CSS) }, [])

  return (
    <div style={{
      width: "100%", background: "#070710", padding: "96px 80px",
      boxSizing: "border-box", fontFamily: "'Inter', -apple-system, sans-serif",
      ...style,
    }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "#60a5fa", marginBottom: 12, textTransform: "uppercase" }}>● REACT PLAYGROUND</p>
        <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#f8fafc", margin: "0 0 16px" }}>Interactive Components</h2>
        <p style={{ fontSize: 16, color: "rgba(248,250,252,0.5)", maxWidth: 480, margin: "0 auto" }}>Live React demos — toggle, tab, modal, and dashboard widgets</p>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
        gap: 24, maxWidth: 1200, margin: "0 auto",
      }}>
        {showToggles && (
          <GCard title="Toggle Switches">
            {[
              { label: "Dark Mode",      on: true  },
              { label: "Notifications",  on: false },
              { label: "Auto Save",      on: true  },
              { label: "Live Preview",   on: false },
            ].map(t => <Toggle key={t.label} label={t.label} initialOn={t.on} />)}
          </GCard>
        )}

        {showTabs && (
          <GCard title="Tab Navigation">
            <Tabs />
          </GCard>
        )}

        {showModal && (
          <GCard title="Modal Dialog">
            <ModalDemo />
          </GCard>
        )}

        {showDashboard && (
          <GCard title="Dashboard Widget">
            <Dashboard />
          </GCard>
        )}
      </div>
    </div>
  )
}

addPropertyControls(ReactPlayground, {
  showToggles:   { type: ControlType.Boolean, title: "Show Toggles",   defaultValue: true },
  showTabs:      { type: ControlType.Boolean, title: "Show Tabs",      defaultValue: true },
  showModal:     { type: ControlType.Boolean, title: "Show Modal",     defaultValue: true },
  showDashboard: { type: ControlType.Boolean, title: "Show Dashboard", defaultValue: true },
})
