"""
bake_alembic.py — run inside Blender headless:
  blender --background --python bake_alembic.py

Bakes the neural wave animation as a proper Alembic (.abc) cache
with 60 shape-keyed frames, computed vertex normals per frame,
UV coords, and vertex colours.  Compatible with:
  • Blender  → File > Import > Alembic
  • Houdini  → File SOP  (*.abc)
  • Unreal 5 → Interchange / Alembic Groom / Geometry Cache
  • Maya     → File > Import  (Alembic)
"""

import bpy, bmesh, os, math, sys
import numpy as np

# ── CONFIG ───────────────────────────────────────────────────────────────────
GRID          = 80
TOTAL_FRAMES  = 60
DECAY         = 0.25
SCALE_XY      = 1.0   # Blender units (scale up in UE5 as needed)
SCALE_Z       = 0.4
FPS           = 24
OUT_PATH      = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                             "neural_wave_animated.abc")

print(f"[NeuralWave] Baking {GRID}×{GRID} mesh × {TOTAL_FRAMES} frames → Alembic")

# ── WAVE FUNCTION ────────────────────────────────────────────────────────────
def wave_z(x, y, t):
    r = math.sqrt(x * x + y * y)
    z  = math.sin(2 * math.pi * r - t * 2.0) * math.exp(-DECAY * r)
    z += math.sin(4 * math.pi * r - t * 3.5 + 1.2) * math.exp(-0.4 * r) * 0.3
    z += math.sin(8 * math.pi * r - t * 5.0 + 2.4) * math.exp(-0.7 * r) * 0.08
    return z * SCALE_Z

# ── CLEAR SCENE ──────────────────────────────────────────────────────────────
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# ── BUILD BASE MESH (frame 0) ─────────────────────────────────────────────────
lin  = [(-5 + 10 * i / (GRID - 1)) * SCALE_XY for i in range(GRID)]
t0   = 0.0

verts_base = []
for j in range(GRID):
    for i in range(GRID):
        x, y = lin[i], lin[j]
        verts_base.append((x, y, wave_z(x, y, t0)))

faces = []
for j in range(GRID - 1):
    for i in range(GRID - 1):
        a = j * GRID + i
        b = j * GRID + i + 1
        c = (j + 1) * GRID + i
        d = (j + 1) * GRID + i + 1
        faces.append((a, b, d, c))   # quads for cleaner subdivision

# Create mesh data block
mesh_data = bpy.data.meshes.new("NeuralWaveMesh")
mesh_data.from_pydata(verts_base, [], faces)
mesh_data.update()

# UV unwrap (planar from XY)
uv_layer = mesh_data.uv_layers.new(name="UVMap")
bm = bmesh.new()
bm.from_mesh(mesh_data)
bm.faces.ensure_lookup_table()
uv = bm.loops.layers.uv["UVMap"]
for face in bm.faces:
    for loop in face.loops:
        co = loop.vert.co
        u = (co.x / SCALE_XY + 5) / 10
        v = (co.y / SCALE_XY + 5) / 10
        loop[uv].uv = (u, v)
bm.to_mesh(mesh_data)
bm.free()

# Vertex colours (height-based cyan-to-purple)
vc_layer = mesh_data.color_attributes.new(
    name="Col", type='FLOAT_COLOR', domain='POINT')
z_vals = [v[2] for v in verts_base]
z_min, z_max = min(z_vals), max(z_vals)
for vi, v in enumerate(verts_base):
    t = (v[2] - z_min) / (z_max - z_min + 1e-9)
    vc_layer.data[vi].color = (t * 0.4 + (1 - t) * 0.5,
                                t * 0.95 + (1 - t) * 0.1,
                                1.0, 1.0)

# Create object
obj = bpy.data.objects.new("NeuralWaveObject", mesh_data)
bpy.context.collection.objects.link(obj)
bpy.context.view_layer.objects.active = obj
obj.select_set(True)

# ── ADD SHAPE KEYS ────────────────────────────────────────────────────────────
print("[NeuralWave] Adding shape keys …")

# Basis key (frame 0)
obj.shape_key_add(name="Basis", from_mix=False)

for f in range(1, TOTAL_FRAMES):
    t = (f / TOTAL_FRAMES) * 2 * math.pi
    sk = obj.shape_key_add(name=f"frame_{f:03d}", from_mix=False)
    sk.value = 0.0
    for vi in range(GRID * GRID):
        i = vi % GRID
        j = vi // GRID
        x, y = lin[i], lin[j]
        sk.data[vi].co.z = wave_z(x, y, t)

    if f % 10 == 0:
        print(f"  shape key {f}/{TOTAL_FRAMES - 1}")

# ── ANIMATE SHAPE KEYS ────────────────────────────────────────────────────────
print("[NeuralWave] Keying animation …")

bpy.context.scene.frame_start = 0
bpy.context.scene.frame_end   = TOTAL_FRAMES - 1
bpy.context.scene.render.fps  = FPS

sk_block = obj.data.shape_keys
sk_keys  = sk_block.key_blocks

# Each frame: activate the matching shape key, all others = 0
for frame in range(TOTAL_FRAMES):
    bpy.context.scene.frame_set(frame)
    for ki, sk in enumerate(sk_keys):
        if ki == 0:
            continue  # skip Basis
        target_frame = ki  # sk index 1 → frame 1, etc.
        sk.value = 1.0 if target_frame == frame else 0.0
        sk.keyframe_insert(data_path="value", frame=frame)

# ── SMOOTH NORMALS ────────────────────────────────────────────────────────────
bpy.ops.object.shade_smooth()
mesh_data.use_auto_smooth = True

# ── MATERIAL (glass PBR for Blender preview) ─────────────────────────────────
mat = bpy.data.materials.new("NeuralWaveGlass")
mat.use_nodes       = True
mat.blend_method    = "BLEND"
mat.use_backface_culling = False
nodes = mat.node_tree.nodes
links = mat.node_tree.links
nodes.clear()

out   = nodes.new("ShaderNodeOutputMaterial"); out.location   = (600, 0)
glass = nodes.new("ShaderNodeBsdfGlass");       glass.location = (300, 0)
glass.inputs["IOR"].default_value       = 1.45
glass.inputs["Roughness"].default_value = 0.04
glass.inputs["Color"].default_value     = (0.02, 0.55, 0.95, 1.0)
links.new(glass.outputs["BSDF"], out.inputs["Surface"])
obj.data.materials.append(mat)

# ── EXPORT ALEMBIC ────────────────────────────────────────────────────────────
print(f"[NeuralWave] Exporting Alembic → {OUT_PATH}")

bpy.context.scene.frame_set(0)
bpy.ops.wm.alembic_export(
    filepath            = OUT_PATH,
    start               = 0,
    end                 = TOTAL_FRAMES - 1,
    xsamples            = 1,
    gsamples            = 1,
    sh_open             = 0.0,
    sh_close            = 1.0,
    selected            = True,
    visible_objects_only= False,
    flatten             = False,
    uvs                 = True,
    packuv              = True,
    normals             = True,
    vcolors             = True,
    orcos               = False,
    face_sets           = False,
    subdiv_schema       = False,
    apply_subdiv        = False,
    curves_as_mesh      = False,
    use_instancing      = True,
    global_scale        = 1.0,
    triangulate         = True,
    quad_method         = 'SHORTEST_DIAGONAL',
    ngon_method         = 'BEAUTY',
    export_hair         = False,
    export_particles    = False,
    export_custom_properties = True,
    as_background_job   = False,
    init_scene_frame_range = False,
)

size_mb = os.path.getsize(OUT_PATH) / 1024 / 1024
print(f"[NeuralWave] ✓  {OUT_PATH}  ({size_mb:.1f} MB)")
print("[NeuralWave] Done.")
