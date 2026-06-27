# /screenshot-to-gif

Convert any webpage, video element, SVG, or 3D canvas (Three.js/Babylon.js) to GIF or MP4 by screenshotting it live in headless Chromium.

## Usage

```
/screenshot-to-gif [url-or-path] [duration] [fps] [width] [height]
```

Defaults: duration=4s, fps=20, width=390, height=390

## When to use this vs /render-animation

| Use `/render-animation`     | Use `/screenshot-to-gif`           |
| --------------------------- | ---------------------------------- |
| You control the HTML source | External URL or complex page       |
| Has a `draw(t)` function    | Pure CSS animation, video, SVG, 3D |
| Need perfect frame timing   | Live rendering is fine             |

## Script template

```js
// screenshot-to-gif.cjs
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { spawnSync, execSync } = require('child_process');
const { writeFileSync, mkdirSync, rmSync } = require('fs');
const { join } = require('path');

const TARGET = 'file:///path/to/page.html'; // or https://...
const OUT = '/tmp/output';
const FPS = 20;
const DUR = 4; // seconds
const W = 390;
const H = 390;
const FFMPEG = '/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux';

(async () => {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto(TARGET);
  await page.waitForTimeout(500); // let animations start

  // Collect JPEG frames
  const jpegs = [];
  const step = Math.round(1000 / FPS);
  console.log(`Capturing ${FPS * DUR} frames...`);
  for (let i = 0; i < FPS * DUR; i++) {
    jpegs.push(
      await page.screenshot({
        type: 'jpeg',
        quality: 90,
        clip: { x: 0, y: 0, width: W, height: H },
      })
    );
    if (i < FPS * DUR - 1) await page.waitForTimeout(step);
  }

  // MP4 via in-page MediaRecorder if page has a canvas
  // (skip if screenshotting a non-canvas page)

  // WebM from frames using bundled ffmpeg (VP8 only)
  console.log('Encoding WebM...');
  const r = spawnSync(
    FFMPEG,
    [
      '-y',
      '-f',
      'image2pipe',
      '-framerate',
      String(FPS),
      '-vcodec',
      'mjpeg',
      '-i',
      'pipe:0',
      '-c:v',
      'libvpx',
      '-b:v',
      '2M',
      '-deadline',
      'realtime',
      '-f',
      'webm',
      join(OUT, 'output.webm'),
    ],
    { input: Buffer.concat(jpegs), maxBuffer: 100 * 1024 * 1024 }
  );
  if (r.status === 0) console.log('WebM saved.');
  else console.error(r.stderr?.toString().slice(-300));

  await browser.close();
})();
```

## For SVG animations

Wrap the SVG in a minimal HTML page:

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        margin: 0;
      }
      svg {
        display: block;
      }
    </style>
  </head>
  <body>
    <!-- paste SVG here -->
  </body>
</html>
```

Then point the script at that HTML file.

## For 3D (Three.js / Babylon.js / WebGL)

Same approach — screenshot the canvas. For higher quality, use:

```js
// inside page.evaluate(), force a specific render frame:
renderer.render(scene, camera);
```

Then capture `renderer.domElement` instead of the whole page.

## For existing video files → GIF

If you have an `.mp4` or `.webm` already and just need a GIF:

```bash
# Using bundled ffmpeg (limited palette support):
/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux \
  -i input.mp4 \
  -vf "fps=15,scale=390:-1:flags=lanczos" \
  -f webm output.webm

# For GIF from video, use the in-browser approach:
# Load the video in a <video> element, draw frames to canvas, use GIFEncoder
```
