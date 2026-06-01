"""
build_softbody_slab.py
======================
Builds a DOUBLE-SIDED, SOFT-BODY, LAYERED BLUE GLASS SLAB as an animated GLB,
plus the textures that drive it:

  softbody_slab.glb        — closed rectangular volume (top + bottom + sealed
                             edges) so it is genuinely double-sided / watertight.
                             Top and bottom surfaces deform with a phase-shifted
                             wave → soft-body "jiggle". 60-frame morph anim.
                             Deep-blue glass PBR (transmission/volume/ior/
                             specular/iridescence/clearcoat), height-map normal
                             texture, emissive LED layer.
  wave_heightmap.png       — 16-bit-ish greyscale height field (displacement map)
  wave_normalmap.png       — tangent-space normal map derived from the height
  wave_flipbook.png        — 8×8 flipbook sprite-sheet of the animated wave
                             (use as a flowing/video texture layer)
  wave_video.gif           — animated preview of the wave texture

Run:  python3 build_softbody_slab.py
"""

import io, math, os, pathlib
import numpy as np
from PIL import Image
import pygltflib
from pygltflib import (
    GLTF2, Scene, Node, Mesh, Primitive, Accessor, BufferView, Buffer,
    Material, Texture, Image as GLTFImage, Sampler, Asset,
    Animation, AnimationChannel, AnimationSampler, AnimationChannelTarget,
)

# ── CONFIG ───────────────────────────────────────────────────────────────────
GRID      = 64           # 64×64 surface grid
FRAMES    = 60
DECAY     = 0.22
SPAN      = 200.0        # cm wide
AMP       = 26.0         # wave amplitude (cm)
THICK     = 16.0         # slab thickness (cm)
SOFT_LAG  = 0.55         # bottom-surface phase lag (soft-body jiggle)
FPS       = 24.0
TEX       = 512          # texture resolution
FLIP      = 8            # flipbook grid (8×8 = 64 cells)

print("═"*60); print("  Double-Sided Soft-Body Blue Glass Slab"); print("═"*60)

lin = np.linspace(-5, 5, GRID)
X, Y = np.meshgrid(lin, lin)
R = np.sqrt(X**2 + Y**2)

def wave(t, lag=0.0):
    p = t - lag
    w  = np.sin(2*np.pi*R - p*2.0) * np.exp(-DECAY*R)
    w += np.sin(4*np.pi*R - p*3.5 + 1.2) * np.exp(-0.40*R) * 0.30
    w += np.sin(8*np.pi*R - p*5.0 + 2.4) * np.exp(-0.70*R) * 0.08
    return w

# ── TEXTURES ──────────────────────────────────────────────────────────────────
print("Generating height / normal / flipbook / video textures …")
def heightfield(t):
    w = wave(t)
    return (w - w.min()) / (np.ptp(w) + 1e-9)   # 0..1

# Height map (t=0)
hf = heightfield(0.0)
hf_img = (hf * 255).astype(np.uint8)
Image.fromarray(np.array(Image.fromarray(hf_img).resize((TEX,TEX))), "L").save("wave_heightmap.png")

# Normal map from height (Sobel)
def to_normal(h, strength=3.0):
    gy, gx = np.gradient(h.astype(np.float32))
    nz = np.ones_like(h)
    n = np.stack([-gx*strength, -gy*strength, nz], -1)
    n /= np.linalg.norm(n, axis=-1, keepdims=True)+1e-9
    return ((n*0.5+0.5)*255).astype(np.uint8)
nm = to_normal(np.array(Image.fromarray(hf_img).resize((TEX,TEX)),dtype=np.float32)/255)
Image.fromarray(nm, "RGB").save("wave_normalmap.png")

# Flipbook (FLIP×FLIP cells of the animated wave, blue-tinted)
cell = TEX // FLIP
sheet = np.zeros((TEX, TEX, 3), dtype=np.uint8)
for idx in range(FLIP*FLIP):
    t = (idx / (FLIP*FLIP)) * 2*np.pi
    h = heightfield(t)
    small = np.array(Image.fromarray((h*255).astype(np.uint8)).resize((cell,cell)),dtype=np.float32)/255
    cy, cx = (idx//FLIP)*cell, (idx%FLIP)*cell
    sheet[cy:cy+cell, cx:cx+cell, 0] = (small*40).astype(np.uint8)
    sheet[cy:cy+cell, cx:cx+cell, 1] = (small*160+20).astype(np.uint8)
    sheet[cy:cy+cell, cx:cx+cell, 2] = (small*255+0).astype(np.uint8)
Image.fromarray(sheet, "RGB").save("wave_flipbook.png")

# Animated GIF "video" of the wave texture
gif_frames = []
for f in range(FRAMES):
    t = (f/FRAMES)*2*np.pi
    h = heightfield(t)
    rgb = np.zeros((256,256,3),dtype=np.uint8)
    hs = np.array(Image.fromarray((h*255).astype(np.uint8)).resize((256,256)),dtype=np.float32)/255
    rgb[...,0]=(hs*40).astype(np.uint8); rgb[...,1]=(hs*170+20).astype(np.uint8); rgb[...,2]=(hs*255).astype(np.uint8)
    gif_frames.append(Image.fromarray(rgb))
gif_frames[0].save("wave_video.gif", save_all=True, append_images=gif_frames[1:],
                   duration=int(1000/FPS), loop=0)
print("  ✓ heightmap, normalmap, flipbook, video.gif")

# Embed normal + flipbook into the GLB
def png_bytes(path):
    return open(path,"rb").read()
nm_bytes = png_bytes("wave_normalmap.png")
fb_bytes = png_bytes("wave_flipbook.png")

# ── BUILD SLAB GEOMETRY ───────────────────────────────────────────────────────
# Vertices: top surface (GRID×GRID) then bottom surface (GRID×GRID).
# Faces: top (up), bottom (down), 4 edge walls → closed watertight volume.
print("Building double-sided slab geometry …")
cx = (X.ravel()/5.0)*(SPAN*0.5)
cy = (Y.ravel()/5.0)*(SPAN*0.5)
NV = GRID*GRID

def surfaces(t):
    top_z = wave(t)*AMP + THICK*0.5
    bot_z = wave(t, lag=SOFT_LAG)*AMP - THICK*0.5
    return top_z.ravel().astype(np.float32), bot_z.ravel().astype(np.float32)

top0, bot0 = surfaces(0.0)
base = np.zeros((NV*2,3),dtype=np.float32)
base[:NV,0]=cx; base[:NV,1]=cy; base[:NV,2]=top0
base[NV:,0]=cx; base[NV:,1]=cy; base[NV:,2]=bot0

def grid_tris(off, flip=False):
    out=[]
    for j in range(GRID-1):
        for i in range(GRID-1):
            a=off+j*GRID+i; b=a+1; c=off+(j+1)*GRID+i; d=c+1
            if flip: out += [[a,c,b],[b,c,d]]
            else:    out += [[a,b,c],[b,d,c]]
    return out

tris  = grid_tris(0, flip=False)         # top, facing up
tris += grid_tris(NV, flip=True)         # bottom, facing down
# edge walls (stitch top ring to bottom ring)
def ring_indices():
    idx=[]
    for i in range(GRID): idx.append(i)                       # front
    for j in range(1,GRID): idx.append(j*GRID+GRID-1)         # right
    for i in range(GRID-2,-1,-1): idx.append((GRID-1)*GRID+i) # back
    for j in range(GRID-2,0,-1): idx.append(j*GRID)           # left
    return idx
ring = ring_indices()
for k in range(len(ring)):
    a=ring[k]; b=ring[(k+1)%len(ring)]
    ta,tb=a,b; ba,bb=a+NV,b+NV
    tris += [[ta,bb,tb],[ta,ba,bb]]
tris = np.array(tris,dtype=np.uint32)
NT = len(tris)
print(f"  {NV*2} verts · {NT} tris (watertight)")

# Normals (recomputed simply: top up, bottom down, walls outward-ish)
nrm = np.zeros((NV*2,3),dtype=np.float32)
nrm[:NV]=[0,0,1]; nrm[NV:]=[0,0,-1]

# UVs (planar) for both surfaces
U=((X.ravel()-X.min())/(np.ptp(X))).astype(np.float32)
V=((Y.ravel()-Y.min())/(np.ptp(Y))).astype(np.float32)
uv=np.zeros((NV*2,2),dtype=np.float32); uv[:NV,0]=U; uv[:NV,1]=V; uv[NV:,0]=U; uv[NV:,1]=V

# Vertex colours: deep blue, brighter at crests (layered look)
col=np.zeros((NV*2,4),dtype=np.float32)
hn=(top0-top0.min())/(np.ptp(top0)+1e-9)
for s,zoff in ((0,hn),(NV,1-hn)):
    col[s:s+NV,0]=0.0+0.12*zoff
    col[s:s+NV,1]=0.18*zoff+0.05
    col[s:s+NV,2]=0.55+0.45*zoff
    col[s:s+NV,3]=1.0

# ── MORPH FRAMES ──────────────────────────────────────────────────────────────
print(f"Baking {FRAMES} soft-body morph frames …")
deltas=[]
for f in range(1,FRAMES):
    t=(f/FRAMES)*2*np.pi
    tz,bz=surfaces(t)
    d=np.zeros((NV*2,3),dtype=np.float32)
    d[:NV,2]=tz-top0; d[NV:,2]=bz-bot0
    deltas.append(d)
    if f%10==0: print(f"  frame {f:03d}")

# ── PACK GLB ──────────────────────────────────────────────────────────────────
print("Packing GLB …")
indices=tris.ravel().astype(np.uint32)
bufs=[];
def add(d):
    o=sum(len(b) for b in bufs); bufs.append(d); return o,len(d)
o_p,l_p=add(base.tobytes()); o_n,l_n=add(nrm.tobytes()); o_u,l_u=add(uv.tobytes())
o_c,l_c=add(col.tobytes()); o_i,l_i=add(indices.tobytes())
m_offs=[add(d.tobytes()) for d in deltas]
o_nm,l_nm=add(nm_bytes);
if l_nm%4: bufs.append(bytes(4-l_nm%4))
o_fb,l_fb=add(fb_bytes)
if l_fb%4: bufs.append(bytes(4-l_fb%4))
times=(np.arange(FRAMES,dtype=np.float32)/FPS); o_t,l_t=add(times.tobytes())
nM=len(deltas); W=np.zeros((FRAMES,nM),dtype=np.float32)
for f in range(1,FRAMES): W[f,f-1]=1.0
o_w,l_w=add(W.ravel().tobytes())
blob=b"".join(bufs)

g=GLTF2(); g.asset=Asset(version="2.0",generator="SoftBodyGlassSlab/1.0")
g.extensionsUsed=["KHR_materials_transmission","KHR_materials_volume",
  "KHR_materials_ior","KHR_materials_specular","KHR_materials_iridescence",
  "KHR_materials_clearcoat","KHR_materials_emissive_strength"]
g.buffers.append(Buffer(byteLength=len(blob))); g.set_binary_blob(blob)
AB,EA=34962,34963
def bv(o,l,t=None):
    x=BufferView(buffer=0,byteOffset=o,byteLength=l)
    if t:x.target=t
    g.bufferViews.append(x); return len(g.bufferViews)-1
b_p=bv(o_p,l_p,AB);b_n=bv(o_n,l_n,AB);b_u=bv(o_u,l_u,AB);b_c=bv(o_c,l_c,AB);b_i=bv(o_i,l_i,EA)
bm=[bv(o,l,AB) for o,l in m_offs]; b_nm=bv(o_nm,l_nm); b_fb=bv(o_fb,l_fb)
b_t=bv(o_t,l_t); b_w=bv(o_w,l_w)
F,U=5126,5125
def ac(b,c,ty,n,**k):
    g.accessors.append(Accessor(bufferView=b,componentType=c,type=ty,count=n,**k)); return len(g.accessors)-1
a_p=ac(b_p,F,"VEC3",NV*2,min=base.min(0).tolist(),max=base.max(0).tolist())
a_n=ac(b_n,F,"VEC3",NV*2);a_u=ac(b_u,F,"VEC2",NV*2);a_c=ac(b_c,F,"VEC4",NV*2)
a_i=ac(b_i,U,"SCALAR",len(indices),min=[0],max=[NV*2-1])
am=[ac(b,F,"VEC3",NV*2) for b in bm]
a_t=ac(b_t,F,"SCALAR",FRAMES,min=[0.0],max=[float(times.max())])
a_w=ac(b_w,F,"SCALAR",FRAMES*nM)
g.samplers.append(Sampler(magFilter=9729,minFilter=9987,wrapS=10497,wrapT=10497))
g.images.append(GLTFImage(bufferView=b_nm,mimeType="image/png"))   # 0 normal
g.images.append(GLTFImage(bufferView=b_fb,mimeType="image/png"))   # 1 flipbook
g.textures.append(Texture(source=0,sampler=0))
g.textures.append(Texture(source=1,sampler=0))
g.materials.append(Material(
    name="SoftBodyBlueGlass", doubleSided=True, alphaMode="BLEND",
    pbrMetallicRoughness={"baseColorFactor":[0.0,0.12,0.45,0.42],
        "metallicFactor":0.0,"roughnessFactor":0.05},
    normalTexture={"index":0,"scale":1.0},
    emissiveTexture={"index":1}, emissiveFactor=[0.05,0.4,1.0],
    extensions={
        "KHR_materials_transmission":{"transmissionFactor":0.88},
        "KHR_materials_volume":{"thicknessFactor":THICK,
            "attenuationColor":[0.0,0.18,0.55],"attenuationDistance":60.0},
        "KHR_materials_ior":{"ior":1.5},
        "KHR_materials_specular":{"specularFactor":1.0,"specularColorFactor":[0.35,0.62,1.0]},
        "KHR_materials_iridescence":{"iridescenceFactor":0.5,"iridescenceIor":1.3,
            "iridescenceThicknessMinimum":120.0,"iridescenceThicknessMaximum":700.0},
        "KHR_materials_clearcoat":{"clearcoatFactor":0.7,"clearcoatRoughnessFactor":0.02},
        "KHR_materials_emissive_strength":{"emissiveStrength":2.2}}))
prim=Primitive(attributes=pygltflib.Attributes(POSITION=a_p,NORMAL=a_n,TEXCOORD_0=a_u,COLOR_0=a_c),
    indices=a_i,material=0,targets=[{"POSITION":a} for a in am])
g.meshes.append(Mesh(name="SoftBodySlab",primitives=[prim],weights=[0.0]*nM,
    extras={"type":"softbody_blue_glass_slab","thickness_cm":THICK,"fps":FPS,
            "double_sided":True,"soft_lag":SOFT_LAG}))
g.nodes.append(Node(mesh=0,name="SlabNode")); g.scenes.append(Scene(name="Scene",nodes=[0])); g.scene=0
g.animations.append(Animation(name="SoftBodyWave",
    channels=[AnimationChannel(sampler=0,target=AnimationChannelTarget(node=0,path="weights"))],
    samplers=[AnimationSampler(input=a_t,output=a_w,interpolation="LINEAR")]))
out="softbody_slab.glb"; g.save_binary(out)
kb=pathlib.Path(out).stat().st_size//1024
print(f"\n✓  {out}  ({kb} KB) · {NV*2} verts · {NT} tris · {FRAMES} frames · double-sided")
print("   Textures: wave_heightmap.png  wave_normalmap.png  wave_flipbook.png  wave_video.gif")
print("\nBlender import:  File ▸ Import ▸ glTF 2.0 ▸ softbody_slab.glb")
print("  → press Spacebar to play the soft-body wave animation")
