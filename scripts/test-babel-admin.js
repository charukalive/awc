// scripts/test-babel-admin.js
const fs = require('fs');
const path = require('path');
const Babel = require('@babel/standalone');

const filesToValidate = [
  'web/index.html',
  'web/admin.html',
  'web/editor.html',
  'web/media-manager.html',
  'index.html',
  'admin.html',
  'editor.html',
  'media-manager.html'
];

let hasErrors = false;

console.log('--- AWC Preflight HTML/JSX Babel Standalone Validator ---');

filesToValidate.forEach((relPath) => {
  const filePath = path.resolve(__dirname, '..', relPath);
  if (!fs.existsSync(filePath)) {
    console.error(`[FAIL] File missing: ${relPath}`);
    hasErrors = true;
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const scriptMatches = content.match(/<script type="text\/babel">([\s\S]*?)<\/script>/gi);

  if (!scriptMatches) {
    console.warn(`[WARN] No <script type="text/babel"> found in ${relPath}`);
    return;
  }

  scriptMatches.forEach((tag, idx) => {
    const js = tag.replace(/<script type="text\/babel">/i, '').replace(/<\/script>/i, '');
    
    try {
      Babel.transform(js, {
        presets: ['react'],
        filename: relPath
      });
      console.log(`[PASS] ${relPath} (Script #${idx + 1}) - Successfully compiled with Babel Standalone.`);
    } catch (err) {
      console.error(`[FAIL] ${relPath} (Script #${idx + 1}) Babel SyntaxError: ${err.message}`);
      hasErrors = true;
    }
  });
});

if (hasErrors) {
  console.error('\nPreflight check failed with errors.');
  process.exit(1);
} else {
  console.log('\nAll web & root files passed real Babel compilation successfully!');
  process.exit(0);
}
