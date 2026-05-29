// Generates a simple SVG-based icon and saves as icon.png via canvas
// Run once: node electron/make-icon.cjs
const fs = require('fs');
const path = require('path');

// Inline a 512x512 SVG icon as base64-encoded PNG placeholder
// (electron-builder will use this; a real icon would be a proper PNG)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#g1)"/>
  <text x="256" y="340" font-family="Arial" font-size="280" font-weight="900"
        fill="white" text-anchor="middle">R</text>
</svg>`;

fs.writeFileSync(path.join(__dirname, 'icon.svg'), svg);
console.log(
  'icon.svg written — convert to icon.png with: npx svgexport electron/icon.svg electron/icon.png 512:512'
);
