# /render-animation

Render any browser-based canvas/SVG/HTML animation to GIF and MP4 using headless Chromium + in-page encoding.

## Usage

```
/render-animation [path-to-html] [duration-seconds] [fps]
```

Defaults: duration=4s, fps=20

## What this does

1. Opens the target HTML file in headless Chromium (Playwright)
2. Encodes a GIF using the in-page pure-JS GIF encoder
3. Records an MP4 using the browser's native MediaRecorder (H.264 via `video/mp4`)
4. Saves both to the scratchpad

## Requirements in the target HTML

The page must expose these globals for GIF rendering:
- `GIFEncoder` class (paste the encoder block below)
- `W`, `H` — canvas dimensions
- `ctx` — the 2D canvas context
- `draw(t)` — function that renders a frame at time `t` (seconds)
- `spinAngle`, `lastT`, `stutterUntil` — or whatever state vars `draw()` uses (reset before encoding)

For MP4, the page just needs a running `requestAnimationFrame` loop and a canvas with id `c`.

## Script template

```js
// render.cjs — run with: node render.cjs
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { writeFileSync } = require('fs');
const { join } = require('path');

const HTML = 'file:///absolute/path/to/animation.html';
const OUT  = '/tmp/output';
const FPS  = 20;
const DUR  = 4; // seconds

(async () => {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 390 } });
  await page.goto(HTML);
  await page.waitForTimeout(600);

  // GIF — drives draw() manually so every frame is clean
  const gifBytes = await page.evaluate(({ fps, dur }) => {
    const frames = fps * dur, delay = Math.round(1000 / fps);
    const enc = new GIFEncoder(W, H);
    // RESET YOUR STATE VARS HERE, e.g.:
    // myAngle = 0; lastT = 0;
    for (let i = 0; i < frames; i++) {
      draw(i / fps);
      enc.addFrame(ctx.getImageData(0, 0, W, H), delay);
    }
    return Array.from(enc.encode());
  }, { fps: FPS, dur: DUR });
  writeFileSync(join(OUT, 'output.gif'), Buffer.from(gifBytes));
  console.log(`GIF: ${(gifBytes.length/1024).toFixed(0)}KB`);

  // MP4 — uses browser's native H.264 MediaRecorder
  const videoBytes = await page.evaluate(({ dur }) => {
    return new Promise(resolve => {
      const mime = ['video/mp4;codecs=avc1.42E01E', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm']
        .find(t => MediaRecorder.isTypeSupported(t));
      const stream = cv.captureStream(30);
      const chunks = [];
      const mr = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 3_000_000 });
      mr.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      mr.onstop = async () => {
        const buf = await new Blob(chunks, { type: mime }).arrayBuffer();
        resolve({ bytes: Array.from(new Uint8Array(buf)), mime });
      };
      mr.start(100);
      setTimeout(() => mr.stop(), dur * 1000);
    });
  }, { dur: DUR });
  const ext = videoBytes.mime.includes('mp4') ? 'mp4' : 'webm';
  writeFileSync(join(OUT, `output.${ext}`), Buffer.from(videoBytes.bytes));
  console.log(`Video: ${(videoBytes.bytes.length/1024).toFixed(0)}KB`);

  await browser.close();
})();
```

## Inline GIF encoder (paste into your HTML `<script>`)

```js
(function(g){
const GIFEncoder=function(w,h){this.w=w;this.h=h;this.frames=[];};
GIFEncoder.prototype.addFrame=function(d,t){this.frames.push({d,t});};
GIFEncoder.prototype.encode=function(){
  const o=[];
  o.push(71,73,70,56,57,97);p16(o,this.w);p16(o,this.h);o.push(0,0,0);
  o.push(0x21,0xFF,0x0B);
  for(const c of [78,69,84,83,67,65,80,69,50,46,48])o.push(c);
  o.push(3,1,0,0,0);
  for(const f of this.frames){
    const{pixels:px,palette:pal}=quant(f.d,this.w,this.h);
    const cb=pb(pal.length);
    o.push(0x21,0xF9,4,0);p16(o,Math.round(f.t/10));o.push(0,0);
    o.push(0x2C);p16(o,0);p16(o,0);p16(o,this.w);p16(o,this.h);
    o.push(0x80|(cb-1));
    for(const[r,g,b]of pal)o.push(r,g,b);
    for(let i=pal.length;i<(1<<cb);i++)o.push(0,0,0);
    const lzw=enc(px,cb);o.push(cb);
    for(let i=0;i<lzw.length;){const n=Math.min(255,lzw.length-i);o.push(n);for(let j=0;j<n;j++)o.push(lzw[i++]);}
    o.push(0);
  }
  o.push(0x3B);return new Uint8Array(o);
};
function p16(a,v){a.push(v&0xFF,(v>>8)&0xFF);}
function pb(n){let b=2;while((1<<b)<n)b++;return b;}
function quant(id,w,h){
  const d=id.data,m=new Map(),pal=[],idx=new Uint8Array(w*h);
  for(let i=0;i<w*h;i++){
    const r=d[i*4],gv=d[i*4+1],b=d[i*4+2];
    const qr=(r>>3)<<3,qg=(gv>>3)<<3,qb=(b>>3)<<3,k=(qr<<16)|(qg<<8)|qb;
    if(!m.has(k)){
      if(pal.length>=255){let best=0,bd=1e9;for(let p=0;p<pal.length;p++){const dr=pal[p][0]-r,dg=pal[p][1]-gv,db=pal[p][2]-b,dd=dr*dr+dg*dg+db*db;if(dd<bd){bd=dd;best=p;}}idx[i]=best;continue;}
      m.set(k,pal.length);pal.push([qr,qg,qb]);
    }
    idx[i]=m.get(k);
  }
  return{pixels:idx,palette:pal};
}
function enc(px,mb){
  const cl=1<<mb,ei=cl+1;let cs=mb+1;
  const t=new Map(),init=()=>{t.clear();for(let i=0;i<cl;i++)t.set(String.fromCharCode(i),i);t.set('C',cl);t.set('E',ei);};
  init();let nc=ei+1,buf=0,bits=0;
  const out=[],emt=v=>{buf|=v<<bits;bits+=cs;while(bits>=8){out.push(buf&0xFF);buf>>=8;bits-=8;}};
  emt(cl);let s=String.fromCharCode(px[0]);
  for(let i=1;i<px.length;i++){
    const ch=String.fromCharCode(px[i]),sc=s+ch;
    if(t.has(sc)){s=sc;}
    else{emt(t.get(s));if(nc<=4095){t.set(sc,nc++);if(nc>(1<<cs)&&cs<12)cs++;}else{emt(cl);init();nc=ei+1;cs=mb+1;}s=ch;}
  }
  emt(t.get(s));emt(ei);if(bits>0)out.push(buf&0xFF);return out;
}
g.GIFEncoder=GIFEncoder;
})(window);
```

## Notes

- Playwright Chromium path: `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`
- Playwright module: `/opt/node22/lib/node_modules/playwright`
- Bundled ffmpeg (VP8/WebM only): `/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux`
- For H.264 MP4: use in-page `MediaRecorder` — Chromium supports `video/mp4` natively
- GIF palette is 5-bit quantized (255 colors max) — works well for dark backgrounds + bright accents
- GIF state variables must be reset ONCE before the frame loop, then let `draw(t)` accumulate naturally
