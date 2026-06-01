import numpy as np
import trimesh
from scipy.spatial import Delaunay

# --- CONFIG ---
NUM_PIXELS   = 80
DECAY_FACTOR = 0.25

# Build 2D grid
x = np.linspace(-5, 5, NUM_PIXELS)
y = np.linspace(-5, 5, NUM_PIXELS)
X, Y = np.meshgrid(x, y)
points_2d = np.vstack([X.ravel(), Y.ravel()]).T

# Delaunay triangulation (mirrors the Python script)
tri = Delaunay(points_2d)
faces = tri.simplices

# Pick a visually rich phase (quarter-wave, ~frame 15/60)
phase = (15 / 60) * 2 * np.pi
R = np.sqrt(X**2 + Y**2)
Z = np.sin(2 * np.pi * R - phase) * np.exp(-DECAY_FACTOR * R)

# Scale Z up for a more dramatic look in a game engine
Z *= 2.0

# 3D vertices — scale XY to cm-friendly units for UE (1 unit = 1 cm in UE)
# 10-unit grid → 200 cm wide, good hero-prop scale
vertices = np.vstack([X.ravel() * 20, Y.ravel() * 20, Z.ravel() * 20]).T

# Build trimesh mesh
mesh = trimesh.Trimesh(vertices=vertices, faces=faces, process=False)
mesh.fix_normals()

# Vertex colours: cyan-to-purple based on Z height
z_norm = (Z.ravel() - Z.min()) / (Z.max() - Z.min() + 1e-9)
r = (z_norm * 100).astype(np.uint8)
g = (z_norm * 240 + (1 - z_norm) * 30).astype(np.uint8)
b = np.full_like(r, 255)
a = np.full_like(r, 255)
vertex_colors = np.stack([r, g, b, a], axis=1)
mesh.visual = trimesh.visual.ColorVisuals(mesh=mesh, vertex_colors=vertex_colors)

# Export as GLB (binary GLTF — native UE5 import)
out_path = "neural_wave.glb"
mesh.export(out_path)
print(f"Exported: {out_path}  ({mesh.vertices.shape[0]} verts, {mesh.faces.shape[0]} tris)")
print("Import into UE5: drag-drop the .glb into the Content Browser.")
