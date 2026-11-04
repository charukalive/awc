// scripts/build-optimized-site.js
// Master build and optimization script for AWC Sri Lanka portal
const fs = require('fs');
const path = require('path');

console.log('--- Step 1: Generating web/index.html with width, translation, and media overrides ---');

// Read the base generate-web-index.js
let content = fs.readFileSync(path.resolve(__dirname, 'generate-web-index.js'), 'utf8');

// 1. Add Open Graph, Facebook, WhatsApp, and Twitter meta tags to <head>
const ogMetaTags = `  <!-- Primary Meta Tags -->
  <title>Animal Welfare Coalition Sri Lanka (AWC) | ශ්‍රී ලංකා සත්ව සුබසාධන සන්ධානය | இலங்கை விலங்கு நலக் கூட்டணி</title>
  <meta name="title" content="Animal Welfare Coalition Sri Lanka (AWC) - Civil Society Legal Advocacy">
  <meta name="description" content="Civil society coalition coordinating legal aid, police station interventions, Magistrate Court litigation, and humane stray management advocacy across Sri Lanka.">
  <meta name="keywords" content="Animal Welfare Sri Lanka, AWC, Animal Cruelty Sri Lanka, Rabies Ordinance, 1907 Ordinance, Animal Law Sri Lanka, Magistrate Court, Dog Population Management">
  <meta name="author" content="Animal Welfare Coalition Sri Lanka">
  <meta name="robots" content="index, follow">

  <!-- Open Graph / Facebook / WhatsApp (Optimized for rich preview < 300KB) -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://charukalive.github.io/awc/">
  <meta property="og:title" content="Animal Welfare Coalition Sri Lanka (AWC)">
  <meta property="og:description" content="Civil society coalition coordinating legal aid, police station interventions, Magistrate Court litigation, and humane stray management advocacy across Sri Lanka.">
  <meta property="og:image" content="https://charukalive.github.io/awc/assets/og-preview.png">
  <meta property="og:image:secure_url" content="https://charukalive.github.io/awc/assets/og-preview.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="600">
  <meta property="og:image:height" content="600">
  <meta property="og:image:alt" content="Animal Welfare Coalition Sri Lanka Official Emblem">
  <meta property="og:locale" content="en_US">
  <meta property="og:locale:alternate" content="si_LK">
  <meta property="og:locale:alternate" content="ta_LK">
  <meta property="og:site_name" content="Animal Welfare Coalition Sri Lanka">

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:url" content="https://charukalive.github.io/awc/">
  <meta name="twitter:title" content="Animal Welfare Coalition Sri Lanka (AWC)">
  <meta name="twitter:description" content="Civil society coalition coordinating legal aid, police station interventions, and Magistrate Court litigation across Sri Lanka.">
  <meta name="twitter:image" content="https://charukalive.github.io/awc/assets/og-preview.png">
  <link rel="icon" type="image/png" href="assets/logo.png">`;

content = content.replace(
  /<title>Animal Welfare Coalition Sri Lanka[\s\S]*?<link rel="icon" type="image\/png" href="assets\/logo\.png">/,
  ogMetaTags
);

// 2. Replace all max-w-7xl with max-w-5xl for optimal desktop readability without over-stretching
content = content.replaceAll('max-w-7xl', 'max-w-5xl');

// 3. Add customImages state and listener in App()
const customImagesHook = `      // Dynamic Custom Images from Firestore / Media Manager
      const [customImages, setCustomImages] = useState(() => {
        try {
          return JSON.parse(localStorage.getItem('awc_custom_images') || '{}');
        } catch(e) { return {}; }
      });

      useEffect(() => {
        if (db) {
          const unsub = db.collection('siteConfig').doc('images').onSnapshot((doc) => {
            if (doc.exists) {
              const data = doc.data();
              setCustomImages(data);
              localStorage.setItem('awc_custom_images', JSON.stringify(data));
            }
          }, (err) => console.warn("Images sync notice:", err));
          return () => unsub();
        }
      }, []);

      const getImage = (slotKey, defaultUrl) => {
        return (customImages && customImages[slotKey]) ? customImages[slotKey] : defaultUrl;
      };`;

content = content.replace(
  "      // Modals\n      const [showReportModal, setShowReportModal] = useState(false);",
  customImagesHook + "\n\n      // Modals\n      const [showReportModal, setShowReportModal] = useState(false);"
);

// 4. Update image sources to use getImage
content = content.replace(
  '<img src="assets/logo.png" alt="AWC Logo" className="h-10 sm:h-12 w-auto object-contain shrink-0" onError={(e)=>{e.target.style.display=\'none\'}} />',
  '<img src={getImage(\'site_logo\', \'assets/logo.png\')} alt="AWC Logo" className="h-10 sm:h-12 w-auto object-contain shrink-0" onError={(e)=>{e.target.style.display=\'none\'}} />'
);

content = content.replace(
  'src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1000&q=80"',
  'src={getImage(\'hero_image\', \'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1000&q=80\')}'
);

content = content.replace(
  'src={statute.image}',
  'src={getImage(\'statute_\' + statute.id, statute.image)}'
);

content = content.replace(
  'src={sec.image}',
  'src={getImage(\'playbook_\' + sec.id, sec.image)}'
);

content = content.replace(
  'src={c.image}',
  'src={getImage(\'case_\' + idx, c.image)}'
);

content = content.replace(
  'src={camp.image}',
  'src={getImage(\'camp_\' + idx, camp.image)}'
);

content = content.replace(
  '<img src="assets/logo.png" alt="AWC Logo" className="h-8 w-auto object-contain" onError={(e)=>{e.target.style.display=\'none\'}} />',
  '<img src={getImage(\'site_logo\', \'assets/logo.png\')} alt="AWC Logo" className="h-8 w-auto object-contain" onError={(e)=>{e.target.style.display=\'none\'}} />'
);

// 5. Replace SlvcModal with fully trilingual dynamic implementation
const newSlvcModal = `    // --- Sub-Component: SLVC Advisory Modal (100% Trilingual) ---
    function SlvcModal({ lang, onClose }) {
      const slvc = (window.AWC_I18N && window.AWC_I18N[lang] && window.AWC_I18N[lang].slvcProtocol) || (window.AWC_I18N && window.AWC_I18N.en.slvcProtocol);
      return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative my-8">
            <button 
              type="button"
              onClick={onClose} 
              className="absolute top-5 right-5 inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 transition"
              title="Cancel / Close"
            >
              <i data-lucide="x" className="w-4 h-4"></i>
              <span>{lang === 'si' ? 'අවලංගු කරන්න' : lang === 'ta' ? 'இரத்து' : 'Cancel'}</span>
            </button>

            <div className="mb-6 pr-24">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                {slvc.badge}
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2 leading-tight">
                {slvc.title}
              </h3>
            </div>

            <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <p className="text-sm">
                {slvc.desc}
              </p>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-2.5">
                <div className="font-bold text-amber-900 dark:text-amber-300 text-sm">
                  {lang === 'si' ? 'අනුගමනය කළ යුතු අත්‍යවශ්‍ය පියවර:' : lang === 'ta' ? 'பின்பற்ற வேண்டிய கட்டாய படிகள்:' : 'Required Action Steps for Pet Owners:'}
                </div>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>{slvc.step1}</strong></li>
                  <li className="pl-4 font-bold text-amber-800 dark:text-amber-200">{slvc.email}</li>
                  <li><strong>{slvc.step2}</strong></li>
                  <li><strong>{slvc.step3}</strong></li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
              <button 
                type="button"
                onClick={onClose} 
                className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
              >
                {lang === 'si' ? 'වසන්න' : lang === 'ta' ? 'மூடுக' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      );
    }`;

content = content.replace(
  /\/\/ --- Sub-Component: SLVC Advisory Modal ---[\s\S]*?function SlvcModal[\s\S]*?^    \}/m,
  newSlvcModal
);

// 6. Replace EmergencyTriageModal with fully trilingual dynamic implementation
const newTriageModal = `    // --- Sub-Component: Emergency Triage Modal (100% Trilingual) ---
    function EmergencyTriageModal({ lang, onClose }) {
      const triage = (window.AWC_I18N && window.AWC_I18N[lang] && window.AWC_I18N[lang].triage) || (window.AWC_I18N && window.AWC_I18N.en.triage);
      return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative my-8">
            <button 
              type="button"
              onClick={onClose} 
              className="absolute top-5 right-5 inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 transition"
              title="Cancel / Close"
            >
              <i data-lucide="x" className="w-4 h-4"></i>
              <span>{triage.cancelBtn || (lang === 'si' ? 'අවලංගු කරන්න' : lang === 'ta' ? 'இரத்து' : 'Cancel')}</span>
            </button>

            <div className="mb-6 pr-24">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800">
                {triage.badge}
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2 leading-tight">
                {triage.title}
              </h3>
            </div>

            <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40">
                <div className="font-bold text-red-900 dark:text-red-300 text-sm mb-1">{triage.rule1Title}</div>
                <p>{triage.rule1Desc}</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
                <div className="font-bold text-amber-900 dark:text-amber-300 text-sm mb-1">{triage.rule2Title}</div>
                <p>{triage.rule2Desc}</p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40">
                <div className="font-bold text-blue-900 dark:text-blue-300 text-sm mb-1">{triage.rule3Title}</div>
                <p>{triage.rule3Desc}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
              <button 
                type="button"
                onClick={onClose} 
                className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
              >
                {triage.closeBtn || (lang === 'si' ? 'වසන්න' : lang === 'ta' ? 'மூடுக' : 'Close')}
              </button>
            </div>
          </div>
        </div>
      );
    }`;

content = content.replace(
  /\/\/ --- Sub-Component: Emergency Triage Modal ---[\s\S]*?function EmergencyTriageModal[\s\S]*?^    \}/m,
  newTriageModal
);

// 7. Write updated scripts/generate-web-index.js
fs.writeFileSync(path.resolve(__dirname, 'generate-web-index.js'), content, 'utf8');
console.log('Successfully updated scripts/generate-web-index.js!');

// Execute generate-web-index.js to generate web/index.html
require('./generate-web-index.js');
