// scripts/apply-media-and-mobile-fixes.js
const fs = require('fs');
const path = require('path');

console.log('=== Step 1: Update Media Manager for Know the Law slots ===');

const mediaGenPath = path.resolve(__dirname, 'generate-media-manager.js');
let mediaGenCode = fs.readFileSync(mediaGenPath, 'utf8');

// Replace the statutes block in DEFAULT_SLOTS
const oldStatutesBlockRegex = /\/\/ (?:Statutes|Know the Law)[\s\S]*?\/\/ Playbook/;
const newStatutesBlock = `// Know the Law (Statutory Cards)
      {
        key: 'statute_1907_ORD',
        category: 'Know the Law',
        title: 'Prevention of Cruelty to Animals Ordinance No. 13 of 1907 (Cap. 573)',
        desc: 'Card image for 1907 Ordinance under Know the Law.',
        defaultUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
        ratio: '16:9'
      },
      {
        key: 'statute_PENAL_CODE_411',
        category: 'Know the Law',
        title: 'Penal Code Ordinance No. 2 of 1883 — Sections 411 & 412',
        desc: 'Card image for Penal Code under Know the Law.',
        defaultUrl: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=800&q=80',
        ratio: '16:9'
      },
      {
        key: 'statute_AW_BILL_2026',
        category: 'Know the Law',
        title: 'Animal Welfare Bill (Draft Bill 48/2026)',
        desc: 'Card image for the modern Animal Welfare Bill under Know the Law.',
        defaultUrl: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=80',
        ratio: '16:9'
      },
      {
        key: 'statute_ANIMALS_ACT_1958',
        category: 'Know the Law',
        title: 'Animals Act No. 29 of 1958 & August 6, 2026 Amendment',
        desc: 'Card image for Animals Act & cattle transport under Know the Law.',
        defaultUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
        ratio: '16:9'
      },
      {
        key: 'statute_BUTCHERS_ORD_1893',
        category: 'Know the Law',
        title: 'The Butchers Ordinance No. 9 of 1893 & Public Slaughter Regulations',
        desc: 'Card image for The Butchers Ordinance under Know the Law.',
        defaultUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80',
        ratio: '16:9'
      },
      {
        key: 'statute_FFPO_1937',
        category: 'Know the Law',
        title: 'Fauna and Flora Protection Ordinance (FFPO No. 2 of 1937 & Act No. 7 of 2022)',
        desc: 'Card image for Captive wildlife & elephant protection under Know the Law.',
        defaultUrl: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=800&q=80',
        ratio: '16:9'
      },
      // Playbook`;

if (oldStatutesBlockRegex.test(mediaGenCode)) {
  mediaGenCode = mediaGenCode.replace(oldStatutesBlockRegex, newStatutesBlock);
  console.log('✓ Updated statutes block in scripts/generate-media-manager.js');
}

// Update categories array
mediaGenCode = mediaGenCode.replace(
  "const categories = ['All', 'Branding & Hero', 'Statutes', 'Playbook', 'Cases', 'Campaigns'];",
  "const categories = ['All', 'Branding & Hero', 'Know the Law', 'Playbook', 'Cases', 'Campaigns'];"
);

// Also ensure generate-media-manager writes to BOTH web/media-manager.html and root media-manager.html
const oldWriteSyncRegex = /fs\.writeFileSync\(path\.resolve\(__dirname, '\.\.', 'web', 'media-manager\.html'\), mediaManagerHtml, 'utf8'\);[\s\S]*?console\.log\([^)]+\);/;
const newWriteSync = `fs.writeFileSync(path.resolve(__dirname, '..', 'web', 'media-manager.html'), mediaManagerHtml, 'utf8');
fs.writeFileSync(path.resolve(__dirname, '..', 'media-manager.html'), mediaManagerHtml, 'utf8');
console.log('✓ Successfully generated web/media-manager.html and root media-manager.html (' + Buffer.byteLength(mediaManagerHtml, 'utf8') + ' bytes)!');`;

if (oldWriteSyncRegex.test(mediaGenCode)) {
  mediaGenCode = mediaGenCode.replace(oldWriteSyncRegex, newWriteSync);
}

fs.writeFileSync(mediaGenPath, mediaGenCode, 'utf8');
console.log('✓ Wrote updated scripts/generate-media-manager.js');

// Regenerate media-manager HTML
delete require.cache[require.resolve('./generate-media-manager.js')];
require('./generate-media-manager.js');

console.log('=== Step 2: Update scripts/generate-web-index.js for Mobile Optimization ===');

const webGenPath = path.resolve(__dirname, 'generate-web-index.js');
let webGenCode = fs.readFileSync(webGenPath, 'utf8');

// 2a: Add Global CSS overflow protection using regex
const oldStyleBlockRegex = /<style>[\s\S]*?body\s*\{[\s\S]*?\}\s*<\/style>/;
const newStyleBlock = `<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Noto+Sans+Sinhala:wght@400;500;600;700;800&family=Noto+Sans+Tamil:wght@400;500;600;700;800&display=swap');
    
    *, *::before, *::after {
      box-sizing: border-box;
    }

    html, body {
      font-family: 'Plus Jakarta Sans', 'Noto Sans Sinhala', 'Noto Sans Tamil', sans-serif;
      overflow-x: hidden !important;
      max-width: 100vw !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      -webkit-overflow-scrolling: touch;
    }
    
    #root {
      overflow-x: hidden !important;
      max-width: 100% !important;
      width: 100% !important;
    }

    .scroll-smooth { scroll-behavior: smooth; }

    /* Custom thin scrollbar */
    .scrollbar-none::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-none {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  </style>`;

if (oldStyleBlockRegex.test(webGenCode)) {
  webGenCode = webGenCode.replace(oldStyleBlockRegex, newStyleBlock);
  console.log('✓ Added strict global mobile overflow-x protection to styles');
} else {
  console.warn('⚠️ Could not match oldStyleBlockRegex');
}

// 2b: Update getImage function for backward-compatibility aliases
const oldGetImageRegex = /const getImage = \(slotKey, defaultUrl\) => \{[\s\S]*?return defaultUrl;\s*\};/;
const newGetImage = `const getImage = (slotKey, defaultUrl) => {
        if (customImages[slotKey]) return customImages[slotKey];
        if (slotKey === 'statute_PENAL_CODE_411' && customImages['statute_PENAL_CODE']) return customImages['statute_PENAL_CODE'];
        if (slotKey === 'statute_ANIMALS_ACT_1958' && customImages['statute_ANIMALS_ACT']) return customImages['statute_ANIMALS_ACT'];
        if (slotKey === 'statute_FFPO_1937' && customImages['statute_FFPO']) return customImages['statute_FFPO'];
        if (slotKey === 'statute_AW_BILL_2026' && customImages['statute_NEW_BILL']) return customImages['statute_NEW_BILL'];
        return defaultUrl;
      };`;

if (oldGetImageRegex.test(webGenCode)) {
  webGenCode = webGenCode.replace(oldGetImageRegex, newGetImage);
  console.log('✓ Updated getImage with legacy statute key fallbacks');
}

// 2c: Update Tier 2 navigation container and buttons to include min-w-0 and smaller touch-friendly paddings on mobile
const oldTier2Regex = /{\/\* Tier 2: Dedicated Navigation Tab Bar - Balanced 2-Line Architecture \*\/}[\s\S]*?<\/header>/;
const newTier2 = `{/* Tier 2: Dedicated Navigation Tab Bar - Balanced 2-Line Architecture */}
            <div className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md py-2 w-full overflow-hidden">
              <div className="max-w-5xl mx-auto px-2 sm:px-6 space-y-1 sm:space-y-1.5">
                
                {/* Line 1: Home, Know the Law, Legal Playbook, Cases & Updates */}
                <nav className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2">
                  <button 
                    onClick={() => setActiveTab('home')} 
                    className={'flex items-center justify-center space-x-1 sm:space-x-1.5 px-2 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition text-center min-w-0 ' + (activeTab === 'home' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60')}
                  >
                    <i data-lucide="home" className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"></i>
                    <span className="truncate">{t.nav.home}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('knowLaw')} 
                    className={'flex items-center justify-center space-x-1 sm:space-x-1.5 px-2 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition text-center min-w-0 ' + (activeTab === 'knowLaw' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60')}
                  >
                    <i data-lucide="scale" className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"></i>
                    <span className="truncate">{t.nav.knowLaw}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('playbook')} 
                    className={'flex items-center justify-center space-x-1 sm:space-x-1.5 px-2 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition text-center min-w-0 ' + (activeTab === 'playbook' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60')}
                  >
                    <i data-lucide="book-open" className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"></i>
                    <span className="truncate">{t.nav.playbook}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('cases')} 
                    className={'flex items-center justify-center space-x-1 sm:space-x-1.5 px-2 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition text-center min-w-0 ' + (activeTab === 'cases' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60')}
                  >
                    <i data-lucide="folder-check" className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"></i>
                    <span className="truncate">{t.nav.cases}</span>
                  </button>
                </nav>

                {/* Line 2: Truth vs Myth, Our Work & Policy, About & Team, Contact & Police */}
                <nav className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2">
                  <button 
                    onClick={() => setActiveTab('truthMyth')} 
                    className={'flex items-center justify-center space-x-1 sm:space-x-1.5 px-2 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition text-center min-w-0 ' + (activeTab === 'truthMyth' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60')}
                  >
                    <i data-lucide="help-circle" className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"></i>
                    <span className="truncate">{t.nav.truthMyth}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('ourWork')} 
                    className={'flex items-center justify-center space-x-1 sm:space-x-1.5 px-2 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition text-center min-w-0 ' + (activeTab === 'ourWork' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60')}
                  >
                    <i data-lucide="activity" className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"></i>
                    <span className="truncate">{t.nav.ourWork}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('about')} 
                    className={'flex items-center justify-center space-x-1 sm:space-x-1.5 px-2 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition text-center min-w-0 ' + (activeTab === 'about' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60')}
                  >
                    <i data-lucide="users" className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"></i>
                    <span className="truncate">{t.nav.about}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('contact')} 
                    className={'flex items-center justify-center space-x-1 sm:space-x-1.5 px-2 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition text-center min-w-0 ' + (activeTab === 'contact' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60')}
                  >
                    <i data-lucide="map-pin" className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"></i>
                    <span className="truncate">{t.nav.contact}</span>
                  </button>
                </nav>

              </div>
            </div>
          </header>`;

if (oldTier2Regex.test(webGenCode)) {
  webGenCode = webGenCode.replace(oldTier2Regex, newTier2);
  console.log('✓ Successfully enhanced Tier 2 navigation with min-w-0 and tight mobile padding');
} else {
  console.warn('⚠️ Could not match oldTier2Regex');
}

fs.writeFileSync(webGenPath, webGenCode, 'utf8');
console.log('✓ Wrote updated scripts/generate-web-index.js');

// Regenerate web/index.html
delete require.cache[require.resolve('./generate-web-index.js')];
require('./generate-web-index.js');

// Copy web/index.html to root index.html
fs.copyFileSync(
  path.resolve(__dirname, '..', 'web', 'index.html'),
  path.resolve(__dirname, '..', 'index.html')
);
console.log('✓ Copied web/index.html -> root index.html');
