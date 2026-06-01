"""Render the double-sided soft-body blue glass slab as an animated GIF."""
import numpy as np
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation, PillowWriter
from matplotlib.colors import LinearSegmentedColormap

GRID, FRAMES, DECAY, AMP, THICK, LAG = 64, 60, 0.22, 1.0, 0.35, 0.55
lin = np.linspace(-5, 5, GRID)
X, Y = np.meshgrid(lin, lin)
R = np.sqrt(X**2 + Y**2)

def wave(t, lag=0.0):
    p = t - lag
    w  = np.sin(2*np.pi*R - p*2.0) * np.exp(-DECAY*R)
    w += np.sin(4*np.pi*R - p*3.5 + 1.2) * np.exp(-0.40*R) * 0.30
    w += np.sin(8*np.pi*R - p*5.0 + 2.4) * np.exp(-0.70*R) * 0.08
    return w

blue = LinearSegmentedColormap.from_list(
    "blue", ["#02040f", "#021a44", "#0a4da0", "#1f8be6", "#5fd0ff", "#bff0ff"])

fig = plt.figure(figsize=(8, 8), facecolor="#02030a")
ax = fig.add_subplot(111, projection="3d")

def draw(frame):
    ax.clear(); ax.set_axis_off()
    t = (frame/FRAMES)*2*np.pi
    top = wave(t)*AMP + THICK*0.5
    bot = wave(t, lag=LAG)*AMP - THICK*0.5
    # bottom (darker), then top (glassy) for layered look
    ax.plot_surface(X, Y, bot, color="#031634", alpha=0.55,
                    rcount=GRID, ccount=GRID, linewidth=0, antialiased=True)
    ax.plot_surface(X, Y, top, cmap=blue, vmin=-1.2, vmax=1.2, alpha=0.92,
                    rcount=GRID, ccount=GRID, linewidth=0, antialiased=True, shade=True)
    ax.set_zlim(-2.0, 2.0); ax.set_box_aspect((1,1,0.5))
    ax.view_init(elev=34, azim=frame*6)
    return []

print("Rendering soft-body slab preview …")
anim = FuncAnimation(fig, draw, frames=FRAMES, blit=False)
anim.save("softbody_slab_preview.gif", writer=PillowWriter(fps=24), dpi=70)
print("✓ softbody_slab_preview.gif")
draw(14)
fig.savefig("softbody_slab_hero.png", dpi=120, facecolor="#02030a", bbox_inches="tight")
print("✓ softbody_slab_hero.png")
