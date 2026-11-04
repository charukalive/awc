// scripts/fix-and-deploy-all.js
const fs = require('fs');
const path = require('path');

console.log('=== Step 1: Updating Navigation Bar in generate-web-index.js (No cut-offs) ===');
let gen = fs.readFileSync(path.resolve(__dirname, 'generate-web-index.js'), 'utf8');

// Replace Tier 2 nav line so tabs flex-wrap on desktop/mobile and never get clipped
gen = gen.replace(
  '<nav className="flex items-center space-x-1.5 py-2 overflow-x-auto scrollbar-none text-xs sm:text-sm font-semibold whitespace-nowrap">',
  '<nav className="flex flex-wrap items-center justify-start sm:justify-center gap-1.5 sm:gap-2 py-2 text-xs sm:text-sm font-semibold">'
);

fs.writeFileSync(path.resolve(__dirname, 'generate-web-index.js'), gen, 'utf8');

// Regenerate web/index.html
require('./generate-web-index.js');
console.log('✓ Regenerated web/index.html with wrap-around navigation');

console.log('=== Step 2: Copying web/ files to root for direct GitHub Pages access ===');

// 1. Root index.html (the direct, full portal)
fs.copyFileSync(
  path.resolve(__dirname, '..', 'web', 'index.html'),
  path.resolve(__dirname, '..', 'index.html')
);
console.log('✓ Copied web/index.html -> root index.html');

// 2. Root i18n-data.js
fs.copyFileSync(
  path.resolve(__dirname, '..', 'web', 'i18n-data.js'),
  path.resolve(__dirname, '..', 'i18n-data.js')
);
console.log('✓ Copied web/i18n-data.js -> root i18n-data.js');

// 3. Root admin.html
fs.copyFileSync(
  path.resolve(__dirname, '..', 'web', 'admin.html'),
  path.resolve(__dirname, '..', 'admin.html')
);
console.log('✓ Copied web/admin.html -> root admin.html');

// 4. Root editor.html
fs.copyFileSync(
  path.resolve(__dirname, '..', 'web', 'editor.html'),
  path.resolve(__dirname, '..', 'editor.html')
);
console.log('✓ Copied web/editor.html -> root editor.html');

// 5. Root media-manager.html
fs.copyFileSync(
  path.resolve(__dirname, '..', 'web', 'media-manager.html'),
  path.resolve(__dirname, '..', 'media-manager.html')
);
console.log('✓ Copied web/media-manager.html -> root media-manager.html');

console.log('=== Step 3: Verifying all HTML files compile cleanly with Babel ===');
