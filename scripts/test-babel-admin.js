// scripts/test-babel-admin.js
// Preflight Static Verification Script for Zero-Build HTML files

const fs = require('fs');
const path = require('path');

const filesToValidate = ['web/index.html', 'web/admin.html', 'web/editor.html'];
let hasErrors = false;

console.log('--- AWC Preflight HTML/JSX Syntax Validator ---');

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
    
    // Check balanced braces and parenthesis as basic sanity check
    let openBrace = (js.match(/\{/g) || []).length;
    let closeBrace = (js.match(/\}/g) || []).length;
    let openParen = (js.match(/\(/g) || []).length;
    let closeParen = (js.match(/\)/g) || []).length;

    if (openBrace !== closeBrace || openParen !== closeParen) {
      console.error(`[FAIL] ${relPath} (Script #${idx + 1}) Unbalanced tokens: { ${openBrace} vs ${closeBrace} }, ( ${openParen} vs ${closeParen} )`);
      hasErrors = true;
    } else {
      console.log(`[PASS] ${relPath} (Script #${idx + 1}) - Balanced syntax check passed (${openBrace} blocks).`);
    }
  });
});

if (hasErrors) {
  console.error('\nPreflight check failed with errors.');
  process.exit(1);
} else {
  console.log('\nAll web files passed preflight validation successfully!');
  process.exit(0);
}
