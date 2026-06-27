# /canvas-animation-template

Scaffold a self-contained HTML canvas animation with built-in GIF + MP4 export buttons and the pure-JS GIF encoder. Use this as the starting point for any new animation.

## Usage

```
/canvas-animation-template [name] [width] [height]
```

Creates `[name].html` in the current directory.

## Template

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Animation</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        background: #111;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        gap: 16px;
        font-family: system-ui;
      }
      canvas {
        display: block;
        border-radius: 12px;
      }
      .btns {
        display: flex;
        gap: 10px;
      }
      button {
        background: #222;
        color: #fff;
        border: 1px solid #333;
        padding: 9px 18px;
        border-radius: 6px;
        font-size: 13px;
        cursor: pointer;
      }
      button:disabled {
        opacity: 0.4;
        cursor: default;
      }
    </style>
  </head>
  <body>
    <canvas id="c" width="390" height="390"></canvas>
    <div class="btns">
      <button id="gif-btn">Save .gif</button>
      <button id="mp4-btn">Save .mp4</button>
    </div>

    <script>
      // ── GIF encoder (pure JS, no deps) ──────────────────────────────────────────
      (function (g) {
        const GIFEncoder = function (w, h) {
          this.w = w;
          this.h = h;
          this.frames = [];
        };
        GIFEncoder.prototype.addFrame = function (d, t) {
          this.frames.push({ d, t });
        };
        GIFEncoder.prototype.encode = function () {
          const o = [];
          o.push(71, 73, 70, 56, 57, 97);
          p16(o, this.w);
          p16(o, this.h);
          o.push(0, 0, 0);
          o.push(0x21, 0xff, 0x0b);
          for (const c of [78, 69, 84, 83, 67, 65, 80, 69, 50, 46, 48])
            o.push(c);
          o.push(3, 1, 0, 0, 0);
          for (const f of this.frames) {
            const { pixels: px, palette: pal } = quant(f.d, this.w, this.h);
            const cb = pb(pal.length);
            o.push(0x21, 0xf9, 4, 0);
            p16(o, Math.round(f.t / 10));
            o.push(0, 0);
            o.push(0x2c);
            p16(o, 0);
            p16(o, 0);
            p16(o, this.w);
            p16(o, this.h);
            o.push(0x80 | (cb - 1));
            for (const [r, g, b] of pal) o.push(r, g, b);
            for (let i = pal.length; i < 1 << cb; i++) o.push(0, 0, 0);
            const lzw = enc(px, cb);
            o.push(cb);
            for (let i = 0; i < lzw.length; ) {
              const n = Math.min(255, lzw.length - i);
              o.push(n);
              for (let j = 0; j < n; j++) o.push(lzw[i++]);
            }
            o.push(0);
          }
          o.push(0x3b);
          return new Uint8Array(o);
        };
        function p16(a, v) {
          a.push(v & 0xff, (v >> 8) & 0xff);
        }
        function pb(n) {
          let b = 2;
          while (1 << b < n) b++;
          return b;
        }
        function quant(id, w, h) {
          const d = id.data,
            m = new Map(),
            pal = [],
            idx = new Uint8Array(w * h);
          for (let i = 0; i < w * h; i++) {
            const r = d[i * 4],
              gv = d[i * 4 + 1],
              b = d[i * 4 + 2];
            const k = ((r >> 3) << 19) | ((gv >> 3) << 8) | ((b >> 3) << 3);
            // simplified: quantize to 5-bit per channel
            const qr = (r >> 3) << 3,
              qg = (gv >> 3) << 3,
              qb = (b >> 3) << 3,
              key = (qr << 16) | (qg << 8) | qb;
            if (!m.has(key)) {
              if (pal.length >= 255) {
                let best = 0,
                  bd = 1e9;
                for (let p = 0; p < pal.length; p++) {
                  const dr = pal[p][0] - r,
                    dg = pal[p][1] - gv,
                    db = pal[p][2] - b,
                    dd = dr * dr + dg * dg + db * db;
                  if (dd < bd) {
                    bd = dd;
                    best = p;
                  }
                }
                idx[i] = best;
                continue;
              }
              m.set(key, pal.length);
              pal.push([qr, qg, qb]);
            }
            idx[i] = m.get(key);
          }
          return { pixels: idx, palette: pal };
        }
        function enc(px, mb) {
          const cl = 1 << mb,
            ei = cl + 1;
          let cs = mb + 1;
          const t = new Map(),
            init = () => {
              t.clear();
              for (let i = 0; i < cl; i++) t.set(String.fromCharCode(i), i);
              t.set('C', cl);
              t.set('E', ei);
            };
          init();
          let nc = ei + 1,
            buf = 0,
            bits = 0;
          const out = [],
            emt = v => {
              buf |= v << bits;
              bits += cs;
              while (bits >= 8) {
                out.push(buf & 0xff);
                buf >>= 8;
                bits -= 8;
              }
            };
          emt(cl);
          let s = String.fromCharCode(px[0]);
          for (let i = 1; i < px.length; i++) {
            const ch = String.fromCharCode(px[i]),
              sc = s + ch;
            if (t.has(sc)) {
              s = sc;
            } else {
              emt(t.get(s));
              if (nc <= 4095) {
                t.set(sc, nc++);
                if (nc > 1 << cs && cs < 12) cs++;
              } else {
                emt(cl);
                init();
                nc = ei + 1;
                cs = mb + 1;
              }
              s = ch;
            }
          }
          emt(t.get(s));
          emt(ei);
          if (bits > 0) out.push(buf & 0xff);
          return out;
        }
        g.GIFEncoder = GIFEncoder;
      })(window);

      // ── Canvas + state ───────────────────────────────────────────────────────────
      const cv = document.getElementById('c');
      const ctx = cv.getContext('2d');
      const W = cv.width;
      const H = cv.height;

      // ── YOUR DRAW FUNCTION ───────────────────────────────────────────────────────
      // t = elapsed seconds. Must be deterministic (same t → same frame).
      // Expose any state vars as globals so the headless renderer can reset them.
      let myAngle = 0,
        lastT = 0;

      function draw(t) {
        const dt = Math.min(t - lastT, 0.1);
        lastT = t;

        // example: spinning arc
        myAngle += dt * 3;
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(W / 2, H / 2, 60, myAngle, myAngle + Math.PI * 1.5);
        ctx.stroke();
      }

      // ── Animation loop ───────────────────────────────────────────────────────────
      let t0 = null;
      function loop(now) {
        if (!t0) t0 = now;
        draw((now - t0) / 1000);
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);

      // ── GIF export ───────────────────────────────────────────────────────────────
      document.getElementById('gif-btn').onclick = async function () {
        const btn = this;
        btn.disabled = true;
        const FPS = 20,
          DUR = 4,
          FRAMES = FPS * DUR,
          delay = Math.round(1000 / FPS);
        const enc = new GIFEncoder(W, H);
        myAngle = 0;
        lastT = 0; // reset state
        for (let i = 0; i < FRAMES; i++) {
          btn.textContent = `GIF ${Math.round((i / FRAMES) * 100)}%`;
          draw(i / FPS);
          enc.addFrame(ctx.getImageData(0, 0, W, H), delay);
          await new Promise(r => setTimeout(r, 0));
        }
        btn.textContent = 'Building…';
        await new Promise(r => setTimeout(r, 0));
        dl(new Blob([enc.encode()], { type: 'image/gif' }), 'output.gif');
        btn.disabled = false;
        btn.textContent = 'Save .gif';
        t0 = null;
        myAngle = 0;
        lastT = 0;
      };

      // ── MP4 export ───────────────────────────────────────────────────────────────
      document.getElementById('mp4-btn').onclick = function () {
        const btn = this;
        btn.disabled = true;
        btn.textContent = 'Recording…';
        const mime = [
          'video/mp4;codecs=avc1.42E01E',
          'video/mp4',
          'video/webm;codecs=vp9',
          'video/webm',
        ].find(t => MediaRecorder.isTypeSupported(t));
        t0 = null;
        myAngle = 0;
        lastT = 0; // restart clean
        const stream = cv.captureStream(30),
          chunks = [];
        const mr = new MediaRecorder(stream, {
          mimeType: mime,
          videoBitsPerSecond: 3_000_000,
        });
        mr.ondataavailable = e => {
          if (e.data.size > 0) chunks.push(e.data);
        };
        mr.onstop = () => {
          const ext = mime.includes('mp4') ? 'mp4' : 'webm';
          dl(new Blob(chunks, { type: mime }), `output.${ext}`);
          btn.disabled = false;
          btn.textContent = 'Save .mp4';
        };
        mr.start(100);
        setTimeout(() => mr.stop(), 4000);
      };

      function dl(blob, name) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        a.click();
      }
    </script>
  </body>
</html>
```

## Adapting for different animation types

**CSS/SVG animation** → remove `draw()`, use `/screenshot-to-gif` instead

**Three.js 3D scene** → replace `draw(t)` body with:

```js
camera.position.x = Math.sin(t) * 5;
renderer.render(scene, camera);
// canvas = renderer.domElement (change cv reference)
```

**Particle system** → expose particle array as global, reset positions in GIF export loop

**Video → GIF** → draw `<video>` element to canvas each frame:

```js
function draw(t) {
  ctx.drawImage(videoEl, 0, 0, W, H);
}
```
