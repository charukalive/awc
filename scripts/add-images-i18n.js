// scripts/add-images-i18n.js
// Injects rich thematic imagery into statutes, playbook, and campaigns in scripts/generate-i18n.js

const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'generate-i18n.js');
let code = fs.readFileSync(filePath, 'utf8');

const statuteImages = [
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=800&q=80'
];

const playbookImages = [
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80'
];

const campaignImages = [
  'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=800&q=80'
];

console.log('Adding image assignments to scripts/generate-i18n.js...');

// We can load the file's object by requiring or evaluating the object, augmenting it, and regenerating!
const raw = require('../web/i18n-data.js');
for (const lang of ['en', 'si', 'ta']) {
  if (raw[lang]) {
    // Add images to statutes
    if (raw[lang].knowLaw && raw[lang].knowLaw.statutes) {
      raw[lang].knowLaw.statutes.forEach((st, idx) => {
        st.image = statuteImages[idx % statuteImages.length];
      });
    }
    // Add images to playbook sections
    if (raw[lang].playbook && raw[lang].playbook.sections) {
      raw[lang].playbook.sections.forEach((sec, idx) => {
        sec.image = playbookImages[idx % playbookImages.length];
      });
    }
    // Add images to campaigns
    if (raw[lang].ourWork && raw[lang].ourWork.campaigns) {
      raw[lang].ourWork.campaigns.forEach((camp, idx) => {
        camp.image = campaignImages[idx % campaignImages.length];
      });
    }
  }
}

const outputPath = path.resolve(__dirname, '..', 'web', 'i18n-data.js');
const output = `// web/i18n-data.js
// Exhaustive Trilingual Legal & Procedural Knowledge Base for Animal Welfare Coalition (AWC) Sri Lanka
// Generated automatically. Supports complete parity in English (en), Sinhala (si), and Tamil (ta).

const awcData = ${JSON.stringify(raw, null, 2)};

if (typeof window !== 'undefined') {
  window.AWC_I18N = awcData;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = awcData;
}
`;

fs.writeFileSync(outputPath, output, 'utf8');
console.log('Successfully enriched web/i18n-data.js with photography! Size: ' + Buffer.byteLength(output, 'utf8') + ' bytes.');
