// scripts/diagnose-mobile.js
const fs = require('fs');

const content = fs.readFileSync('web/index.html', 'utf8');

console.log('=== Checking body & html overflow rules ===');
const styleMatch = content.match(/<style[\s\S]*?<\/style>/i);
console.log('Styles:', styleMatch ? styleMatch[0] : 'None');

console.log('=== Checking viewport meta tag ===');
const metaViewport = content.match(/<meta[^>]*viewport[^>]*>/i);
console.log('Viewport:', metaViewport ? metaViewport[0] : 'None');

console.log('=== Checking fixed / wide elements ===');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (
    line.includes('w-[') ||
    line.includes('min-w-[') ||
    line.includes('min-w-') ||
    line.includes('nowrap') ||
    line.includes('overflow-x') ||
    line.includes('whitespace-nowrap')
  ) {
    if (line.includes('flex') || line.includes('grid') || line.includes('div') || line.includes('header') || line.includes('nav')) {
      console.log(`L${idx+1}: ${line.trim().slice(0, 120)}`);
    }
  }
});
