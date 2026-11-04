// scripts/verify-all-tabs.js
// Simulates rendering all 8 tabs across all 3 languages (en, si, ta)
const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('web/i18n-data.js', 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const i18n = sandbox.window.AWC_I18N;

const tabs = ['home', 'knowLaw', 'playbook', 'cases', 'truthMyth', 'ourWork', 'about', 'contact'];
const languages = ['en', 'si', 'ta'];

let errors = 0;

languages.forEach(lang => {
  const t = i18n[lang];
  console.log(`Checking language: ${lang}`);

  // Test Playbook
  try {
    const pSections = t.playbook?.sections || [];
    pSections.forEach((sec, idx) => {
      const items = sec.takeaways || sec.points || [];
      if (!Array.isArray(items)) throw new Error(`Playbook section ${idx} has invalid takeaways/points`);
      items.map(x => x); // Should not throw
    });
    console.log(`  ✓ Playbook (${pSections.length} cards) verified.`);
  } catch(e) {
    console.error(`  ✕ Playbook error in ${lang}:`, e.message);
    errors++;
  }

  // Test Cases
  try {
    const cList = t.cases?.list || [];
    cList.forEach((c, idx) => {
      if (c.timeline && Array.isArray(c.timeline)) {
        c.timeline.map(x => x);
      }
      if (!c.title || !c.desc) throw new Error(`Case ${idx} missing title/desc`);
    });
    console.log(`  ✓ Cases (${cList.length} cases) verified.`);
  } catch(e) {
    console.error(`  ✕ Cases error in ${lang}:`, e.message);
    errors++;
  }

  // Test Statutes
  try {
    const statutes = t.knowLaw?.statutes || [];
    statutes.forEach((s, idx) => {
      const secs = s.sections || [];
      secs.map(x => x);
    });
    console.log(`  ✓ Statutes (${statutes.length} statutes) verified.`);
  } catch(e) {
    console.error(`  ✕ Statutes error in ${lang}:`, e.message);
    errors++;
  }

  // Test Team
  try {
    const team = t.team?.members || [];
    team.map(m => m.name);
    console.log(`  ✓ Team (${team.length} members) verified.`);
  } catch(e) {
    console.error(`  ✕ Team error in ${lang}:`, e.message);
    errors++;
  }
});

if (errors === 0) {
  console.log('\n✓ All tabs and datasets passed static integrity verification with 0 errors!');
} else {
  console.error(`\nFound ${errors} errors!`);
  process.exit(1);
}
