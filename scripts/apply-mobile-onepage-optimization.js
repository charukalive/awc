// scripts/apply-mobile-onepage-optimization.js
const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'generate-web-index.js');
let code = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

console.log('=== Step 1: Upgrading App State with viewMode & showMobileMenu ===');

const oldAppState = `    function App() {
      const [lang, setLang] = useState(() => localStorage.getItem('awc_lang') || 'en');
      const [darkMode, setDarkMode] = useState(() => localStorage.getItem('awc_theme') === 'dark');
      const [activeTab, setActiveTab] = useState('home');`;

const newAppState = `    function App() {
      const [lang, setLang] = useState(() => localStorage.getItem('awc_lang') || 'en');
      const [darkMode, setDarkMode] = useState(() => localStorage.getItem('awc_theme') === 'dark');
      const [activeTab, setActiveTab] = useState('home');
      
      // One-Page vs Tabbed Mode (Optimized for Mobile Portrait & Desktop)
      const [viewMode, setViewMode] = useState(() => {
        const saved = localStorage.getItem('awc_view_mode');
        if (saved) return saved;
        return 'onepage'; // Default to continuous one-page flow
      });

      useEffect(() => {
        localStorage.setItem('awc_view_mode', viewMode);
      }, [viewMode]);

      // Mobile Navigation Drawer
      const [showMobileMenu, setShowMobileMenu] = useState(false);

      const navigateToSection = (tabKey) => {
        setActiveTab(tabKey);
        setShowMobileMenu(false);
        if (viewMode === 'onepage') {
          const el = document.getElementById('section-' + tabKey);
          if (el) {
            const yOffset = -85;
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      };`;

if (!code.includes(oldAppState)) {
  console.error("Could not find oldAppState target in generate-web-index.js");
  process.exit(1);
}
code = code.replace(oldAppState, newAppState);

console.log('=== Step 2: Upgrading Sticky Navigation Header for Mobile Portrait ===');

const oldHeaderStart = `          {/* Sticky 2-Tier Navigation Header (Guarantees zero wrapping & clean layout on all screens) */}
          <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">`;

const oldHeaderEnd = `          {/* Body Content Area based on Active Tab */}
          <main className="flex-1">`;

const oldHeaderIdx = code.indexOf(oldHeaderStart);
const oldHeaderEndIdx = code.indexOf(oldHeaderEnd);

if (oldHeaderIdx === -1 || oldHeaderEndIdx === -1) {
  console.error("Could not find header boundaries in generate-web-index.js");
  process.exit(1);
}

// NOTE: Using pure string concatenation for classNames to avoid any backtick/template literal escaping issues in generator!
const newHeaderAndDrawer = `          {/* Sticky 2-Tier Navigation Header (Mobile Portrait & Desktop Optimized) */}
          <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Tier 1: Brand & Top Utilities */}
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2">
              
              {/* Brand Logo & Name */}
              <div className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer shrink-0" onClick={() => navigateToSection('home')}>
                <img src={getImage('site_logo', 'assets/logo.png')} alt="AWC Logo" className="h-9 sm:h-12 w-auto object-contain shrink-0" onError={(e)=>{e.target.style.display='none'}} />
                <div className="shrink-0">
                  <div className="text-sm sm:text-lg font-black text-slate-900 dark:text-white leading-tight whitespace-nowrap">
                    {t.brandName}
                  </div>
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <span className="text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider whitespace-nowrap">
                      {t.brandSub}
                    </span>
                    <span className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded whitespace-nowrap">
                      Civil Society Coalition
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Controls: Police Directory Button, Track, Theme, Language, Report */}
              <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
                
                {/* Desktop-Only: Police Directory Button */}
                <a 
                  href="https://police.lk/telephone-index/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:hover:bg-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition shadow-sm whitespace-nowrap"
                  title="Direct Link to Sri Lanka Police Telephone Index & OIC Contacts"
                >
                  <i data-lucide="phone" className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"></i>
                  <span>{lang === 'si' ? 'පොලිස් දුරකථන නාමාවලිය' : lang === 'ta' ? 'பொலிஸ் தொலைபேசி' : 'Police Directory (OIC)'}</span>
                </a>

                {/* Desktop-Only: Track Ticket Button */}
                <button 
                  onClick={() => setShowTrackModal(true)}
                  className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition whitespace-nowrap shrink-0"
                >
                  <i data-lucide="search" className="w-3.5 h-3.5"></i>
                  <span>{t.nav.track}</span>
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
                  title="Toggle Light / Dark Mode"
                >
                  {darkMode ? (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>

                {/* Language Switcher - Finger Friendly */}
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700 text-xs font-bold shrink-0">
                  <button onClick={() => setLang('en')} className={'px-2 py-1 rounded-lg transition ' + (lang === 'en' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white')}>EN</button>
                  <button onClick={() => setLang('si')} className={'px-2 py-1 rounded-lg transition ' + (lang === 'si' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white')}>සිං</button>
                  <button onClick={() => setLang('ta')} className={'px-2 py-1 rounded-lg transition ' + (lang === 'ta' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white')}>த</button>
                </div>

                {/* Desktop-Only: Report Cruelty Button in Header */}
                <button
                  onClick={() => setShowReportModal(true)}
                  className="hidden md:inline-flex items-center space-x-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-xs uppercase tracking-wider px-3 sm:px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition whitespace-nowrap shrink-0"
                >
                  <i data-lucide="alert-triangle" className="w-3.5 h-3.5 text-amber-200"></i>
                  <span>{lang === 'si' ? 'පැමිණිලි කරන්න' : lang === 'ta' ? 'முறைப்பாடு' : 'Report'}</span>
                </button>

                {/* Mobile Menu Toggle Button (Prominent in Portrait View) */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition shrink-0"
                  aria-label="Toggle Navigation Menu"
                >
                  <i data-lucide={showMobileMenu ? "x" : "menu"} className="w-4 h-4"></i>
                  <span>{showMobileMenu ? (lang === 'si' ? 'වසන්න' : 'Close') : (lang === 'si' ? 'මෙනුව' : 'Menu')}</span>
                </button>

              </div>
            </div>

            {/* Tier 2: Swipeable Horizontal Tab Bar & View Mode Toggle */}
            <div className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md">
              <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-2">
                
                {/* Horizontal Navigation Pills (Scrollable on Mobile, Centered on Desktop) */}
                <nav className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto scrollbar-none py-1 text-xs sm:text-sm font-semibold flex-1">
                  <button onClick={() => navigateToSection('home')} className={'flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition shrink-0 ' + (activeTab === 'home' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-200/60 dark:hover:bg-slate-800')}>
                    <i data-lucide="home" className="w-3.5 h-3.5 sm:w-4 sm:h-4"></i>
                    <span>{t.nav.home}</span>
                  </button>
                  <button onClick={() => navigateToSection('knowLaw')} className={'flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition shrink-0 ' + (activeTab === 'knowLaw' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-200/60 dark:hover:bg-slate-800')}>
                    <i data-lucide="scale" className="w-3.5 h-3.5 sm:w-4 sm:h-4"></i>
                    <span>{t.nav.knowLaw}</span>
                  </button>
                  <button onClick={() => navigateToSection('playbook')} className={'flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition shrink-0 ' + (activeTab === 'playbook' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-200/60 dark:hover:bg-slate-800')}>
                    <i data-lucide="book-open" className="w-3.5 h-3.5 sm:w-4 sm:h-4"></i>
                    <span>{t.nav.playbook}</span>
                  </button>
                  <button onClick={() => navigateToSection('cases')} className={'flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition shrink-0 ' + (activeTab === 'cases' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-200/60 dark:hover:bg-slate-800')}>
                    <i data-lucide="folder-check" className="w-3.5 h-3.5 sm:w-4 sm:h-4"></i>
                    <span>{t.nav.cases}</span>
                  </button>
                  <button onClick={() => navigateToSection('truthMyth')} className={'flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition shrink-0 ' + (activeTab === 'truthMyth' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-200/60 dark:hover:bg-slate-800')}>
                    <i data-lucide="help-circle" className="w-3.5 h-3.5 sm:w-4 sm:h-4"></i>
                    <span>{t.nav.truthMyth}</span>
                  </button>
                  <button onClick={() => navigateToSection('ourWork')} className={'flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition shrink-0 ' + (activeTab === 'ourWork' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-200/60 dark:hover:bg-slate-800')}>
                    <i data-lucide="activity" className="w-3.5 h-3.5 sm:w-4 sm:h-4"></i>
                    <span>{t.nav.ourWork}</span>
                  </button>
                  <button onClick={() => navigateToSection('about')} className={'flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition shrink-0 ' + (activeTab === 'about' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-200/60 dark:hover:bg-slate-800')}>
                    <i data-lucide="users" className="w-3.5 h-3.5 sm:w-4 sm:h-4"></i>
                    <span>{t.nav.about}</span>
                  </button>
                  <button onClick={() => navigateToSection('contact')} className={'flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition shrink-0 ' + (activeTab === 'contact' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-200/60 dark:hover:bg-slate-800')}>
                    <i data-lucide="map-pin" className="w-3.5 h-3.5 sm:w-4 sm:h-4"></i>
                    <span>{t.nav.contact}</span>
                  </button>
                </nav>

                {/* View Mode Toggle Button: Continuous One-Page vs Single Tab */}
                <button
                  onClick={() => setViewMode(viewMode === 'onepage' ? 'tabs' : 'onepage')}
                  className="shrink-0 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-sm transition flex items-center space-x-1"
                  title="Switch between Continuous One-Page Scrolling and Individual Tabs"
                >
                  <i data-lucide={viewMode === 'onepage' ? "layers" : "file-text"} className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400"></i>
                  <span className="hidden sm:inline">
                    {viewMode === 'onepage' 
                      ? (lang === 'si' ? 'පිටු අනුව (Tabs)' : lang === 'ta' ? 'தனித்தனி பக்கங்கள்' : 'Switch to Tabs') 
                      : (lang === 'si' ? 'එක් පිටුවකින් (1-Page)' : lang === 'ta' ? 'ஒரே பக்கம்' : 'Switch to 1-Page')}
                  </span>
                  <span className="sm:hidden font-extrabold text-emerald-600 dark:text-emerald-400">
                    {viewMode === 'onepage' ? '1-Page' : 'Tabs'}
                  </span>
                </button>

              </div>
            </div>
          </header>

          {/* Mobile Full-Screen Navigation Drawer (Clean, Touch-Friendly) */}
          {showMobileMenu && (
            <div className="md:hidden fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex flex-col justify-end">
              <div className="bg-white dark:bg-slate-900 rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 border-t border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-bottom duration-200">
                
                <div>
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
                    <div className="flex items-center space-x-2">
                      <img src={getImage('site_logo', 'assets/logo.png')} alt="AWC Logo" className="h-7 w-auto object-contain" onError={(e)=>{e.target.style.display='none'}} />
                      <span className="font-black text-slate-900 dark:text-white text-base">AWC Section Directory</span>
                    </div>
                    <button 
                      onClick={() => setShowMobileMenu(false)}
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold"
                    >
                      <i data-lucide="x" className="w-5 h-5"></i>
                    </button>
                  </div>

                  {/* View Mode Switcher in Drawer */}
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between mb-4 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {lang === 'si' ? 'දර්ශන ආකාරය (View Mode):' : 'Display Layout:'}
                    </span>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => setViewMode('onepage')} 
                        className={'px-2.5 py-1 rounded-lg font-bold transition ' + (viewMode === 'onepage' ? 'bg-emerald-600 text-white shadow' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300')}
                      >
                        📜 1-Page
                      </button>
                      <button 
                        onClick={() => setViewMode('tabs')} 
                        className={'px-2.5 py-1 rounded-lg font-bold transition ' + (viewMode === 'tabs' ? 'bg-emerald-600 text-white shadow' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300')}
                      >
                        📑 Tabs
                      </button>
                    </div>
                  </div>

                  {/* Clear, Finger-Friendly Section Buttons */}
                  <div className="grid grid-cols-1 gap-2 text-xs font-bold">
                    <button onClick={() => navigateToSection('home')} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-left transition">
                      <div className="flex items-center space-x-3">
                        <i data-lucide="home" className="w-5 h-5 text-emerald-600 shrink-0"></i>
                        <div>
                          <div className="text-slate-900 dark:text-white font-extrabold">{t.nav.home}</div>
                          <div className="text-[10px] text-slate-500 font-normal">Emergency Actions & Transparency Remit</div>
                        </div>
                      </div>
                      <span className="text-slate-400">→</span>
                    </button>

                    <button onClick={() => navigateToSection('knowLaw')} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-left transition">
                      <div className="flex items-center space-x-3">
                        <i data-lucide="scale" className="w-5 h-5 text-blue-600 shrink-0"></i>
                        <div>
                          <div className="text-slate-900 dark:text-white font-extrabold">{t.nav.knowLaw}</div>
                          <div className="text-[10px] text-slate-500 font-normal">1907 Cruelty Ordinance & Penal Code 411/412</div>
                        </div>
                      </div>
                      <span className="text-slate-400">→</span>
                    </button>

                    <button onClick={() => navigateToSection('playbook')} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-left transition">
                      <div className="flex items-center space-x-3">
                        <i data-lucide="book-open" className="w-5 h-5 text-purple-600 shrink-0"></i>
                        <div>
                          <div className="text-slate-900 dark:text-white font-extrabold">{t.nav.playbook}</div>
                          <div className="text-[10px] text-slate-500 font-normal">Police Station & Magistrate Court Playbook</div>
                        </div>
                      </div>
                      <span className="text-slate-400">→</span>
                    </button>

                    <button onClick={() => navigateToSection('cases')} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-left transition">
                      <div className="flex items-center space-x-3">
                        <i data-lucide="folder-check" className="w-5 h-5 text-amber-600 shrink-0"></i>
                        <div>
                          <div className="text-slate-900 dark:text-white font-extrabold">{t.nav.cases}</div>
                          <div className="text-[10px] text-slate-500 font-normal">Public Court Cases & Litigation Dockets</div>
                        </div>
                      </div>
                      <span className="text-slate-400">→</span>
                    </button>

                    <button onClick={() => navigateToSection('truthMyth')} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-left transition">
                      <div className="flex items-center space-x-3">
                        <i data-lucide="help-circle" className="w-5 h-5 text-teal-600 shrink-0"></i>
                        <div>
                          <div className="text-slate-900 dark:text-white font-extrabold">{t.nav.truthMyth}</div>
                          <div className="text-[10px] text-slate-500 font-normal">Scientific Dog Management & Rabies Facts</div>
                        </div>
                      </div>
                      <span className="text-slate-400">→</span>
                    </button>

                    <button onClick={() => navigateToSection('ourWork')} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-left transition">
                      <div className="flex items-center space-x-3">
                        <i data-lucide="activity" className="w-5 h-5 text-rose-600 shrink-0"></i>
                        <div>
                          <div className="text-slate-900 dark:text-white font-extrabold">{t.nav.ourWork}</div>
                          <div className="text-[10px] text-slate-500 font-normal">400+ Legal Involvements & Humane Policy</div>
                        </div>
                      </div>
                      <span className="text-slate-400">→</span>
                    </button>

                    <button onClick={() => navigateToSection('about')} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-left transition">
                      <div className="flex items-center space-x-3">
                        <i data-lucide="users" className="w-5 h-5 text-indigo-600 shrink-0"></i>
                        <div>
                          <div className="text-slate-900 dark:text-white font-extrabold">{t.nav.about}</div>
                          <div className="text-[10px] text-slate-500 font-normal">Verified Leadership Team & Legal Counsel</div>
                        </div>
                      </div>
                      <span className="text-slate-400">→</span>
                    </button>

                    <button onClick={() => navigateToSection('contact')} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-left transition">
                      <div className="flex items-center space-x-3">
                        <i data-lucide="map-pin" className="w-5 h-5 text-emerald-600 shrink-0"></i>
                        <div>
                          <div className="text-slate-900 dark:text-white font-extrabold">{t.nav.contact}</div>
                          <div className="text-[10px] text-slate-500 font-normal">Sri Lanka Police OIC Directory & Inquiries</div>
                        </div>
                      </div>
                      <span className="text-slate-400">→</span>
                    </button>
                  </div>
                </div>

                {/* Drawer Footer Actions */}
                <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    onClick={() => { setShowMobileMenu(false); setShowReportModal(true); }}
                    className="py-3 px-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-center space-x-1.5 shadow"
                  >
                    <i data-lucide="alert-triangle" className="w-4 h-4 text-amber-200"></i>
                    <span>{lang === 'si' ? 'පැමිණිල්ල' : 'Report Cruelty'}</span>
                  </button>

                  <button
                    onClick={() => { setShowMobileMenu(false); setShowTrackModal(true); }}
                    className="py-3 px-3 rounded-xl bg-slate-800 text-white flex items-center justify-center space-x-1.5"
                  >
                    <i data-lucide="search" className="w-4 h-4"></i>
                    <span>{t.nav.track}</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Body Content Area (Continuous One-Page Flow or Tabbed Mode) */}
          <main className="flex-1 pb-24 md:pb-12">`;

code = code.substring(0, oldHeaderIdx) + newHeaderAndDrawer + code.substring(oldHeaderEndIdx + oldHeaderEnd.length);

console.log('=== Step 3: Upgrading Hero Action Buttons with Large Clear Touch Buttons ===');

const oldHeroButtons = `                        <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
                          <button
                            onClick={() => setShowReportModal(true)}
                            className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-sm uppercase tracking-wider px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-orange-500/20 transition-all duration-150 transform hover:-translate-y-0.5"
                          >
                            <i data-lucide="alert-triangle" className="w-4 h-4 text-amber-200"></i>
                            <span>{t.hero.reportBtn}</span>
                          </button>

                          <button
                            onClick={() => setShowLegalModal(true)}
                            className="inline-flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-md transition-all duration-150"
                          >
                            <i data-lucide="scale" className="w-4 h-4 text-emerald-300"></i>
                            <span>{t.hero.legalBtn}</span>
                          </button>

                          <button
                            onClick={() => setShowTriageModal(true)}
                            className="inline-flex items-center space-x-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm px-5 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 shadow-sm transition"
                          >
                            <i data-lucide="first-aid" className="w-4 h-4 text-red-500"></i>
                            <span>{t.hero.triageBtn}</span>
                          </button>

                          <button
                            onClick={() => setShowSampleDraftModal(true)}
                            className="inline-flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 font-bold text-sm px-5 py-3.5 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-sm transition"
                          >
                            <i data-lucide="file-text" className="w-4 h-4 text-blue-500"></i>
                            <span>{lang === 'si' ? 'ආදර්ශ පැමිණිලි ආකෘතිය' : lang === 'ta' ? 'மாதிரி முறைப்பாடு படிவம்' : 'Sample Complaint Draft'}</span>
                          </button>
                        </div>`;

const newHeroButtons = `                        {/* Finger-Friendly 2-Column Action Buttons (Optimized for Mobile Portrait) */}
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto lg:mx-0">
                          
                          {/* 1. Cruelty Report Button */}
                          <button
                            onClick={() => setShowReportModal(true)}
                            className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black shadow-lg hover:shadow-orange-500/25 transition-all duration-150 flex items-center space-x-3 text-left group"
                          >
                            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                              <i data-lucide="alert-triangle" className="w-6 h-6 text-white"></i>
                            </div>
                            <div className="overflow-hidden">
                              <div className="text-xs sm:text-sm font-black uppercase tracking-wider leading-tight">{t.hero.reportBtn}</div>
                              <div className="text-[11px] text-amber-100 font-medium truncate mt-0.5">
                                {lang === 'si' ? 'ක්ෂණික පැමිණිල්ල සහ සාක්ෂි' : lang === 'ta' ? 'முறைப்பாடு & ஆதாரங்கள்' : 'Upload Evidence & File Ticket'}
                              </div>
                            </div>
                          </button>

                          {/* 2. Legal Assistance Button */}
                          <button
                            onClick={() => setShowLegalModal(true)}
                            className="p-3.5 sm:p-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black shadow-md transition-all duration-150 flex items-center space-x-3 text-left group"
                          >
                            <div className="w-11 h-11 rounded-xl bg-emerald-800 flex items-center justify-center shrink-0">
                              <i data-lucide="scale" className="w-6 h-6 text-emerald-200"></i>
                            </div>
                            <div className="overflow-hidden">
                              <div className="text-xs sm:text-sm font-black uppercase tracking-wider leading-tight">{t.hero.legalBtn}</div>
                              <div className="text-[11px] text-emerald-200 font-medium truncate mt-0.5">
                                {lang === 'si' ? 'මහේස්ත්‍රාත් අධිකරණ සහාය' : lang === 'ta' ? 'நீதிமன்ற சட்ட உதவி' : 'Magistrate Court Docket Aid'}
                              </div>
                            </div>
                          </button>

                          {/* 3. Emergency Triage Button */}
                          <button
                            onClick={() => setShowTriageModal(true)}
                            className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold border-2 border-red-500/30 dark:border-red-500/40 shadow-sm transition flex items-center space-x-3 text-left group"
                          >
                            <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center shrink-0">
                              <i data-lucide="first-aid" className="w-6 h-6 text-red-600 dark:text-red-400"></i>
                            </div>
                            <div className="overflow-hidden">
                              <div className="text-xs sm:text-sm font-black leading-tight">{t.hero.triageBtn}</div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                                {lang === 'si' ? 'හදිසි ප්‍රතිකාර හා ප්‍රථමාධාර' : lang === 'ta' ? 'அவசர சிகிச்சை வழிகாட்டல்' : 'First Aid & Poisoning Protocol'}
                              </div>
                            </div>
                          </button>

                          {/* 4. Sample Police Draft Button */}
                          <button
                            onClick={() => setShowSampleDraftModal(true)}
                            className="p-3.5 sm:p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 text-blue-900 dark:text-blue-100 font-bold border border-blue-200 dark:border-blue-800 shadow-sm transition flex items-center space-x-3 text-left group"
                          >
                            <div className="w-11 h-11 rounded-xl bg-blue-200/60 dark:bg-blue-900 flex items-center justify-center shrink-0">
                              <i data-lucide="file-text" className="w-6 h-6 text-blue-700 dark:text-blue-300"></i>
                            </div>
                            <div className="overflow-hidden">
                              <div className="text-xs sm:text-sm font-black leading-tight">
                                {lang === 'si' ? 'ආදර්ශ පැමිණිලි ආකෘතිය' : lang === 'ta' ? 'மாதிரி முறைப்பாடு படிவம்' : 'Sample Complaint Draft'}
                              </div>
                              <div className="text-[11px] text-blue-700 dark:text-blue-300 font-medium truncate mt-0.5">
                                {lang === 'si' ? 'පොලීසියට ලිපියක් භාරදීමට' : lang === 'ta' ? 'பொலிஸ் நிலைய வடிவம்' : 'Ready Police Station Letter'}
                              </div>
                            </div>
                          </button>

                        </div>`;

if (!code.includes(oldHeroButtons)) {
  console.error("Could not find oldHeroButtons in generate-web-index.js");
  process.exit(1);
}
code = code.replace(oldHeroButtons, newHeroButtons);

console.log('=== Step 4: Making All 8 Sections Available in One-Page Continuous Mode ===');

// Replace tab condition headers cleanly without duplicating or omitting closing </div> tags!
const tabReplacements = [
  {
    target: "            {activeTab === 'home' && (\n              <div>",
    replacement: "            {(viewMode === 'onepage' || activeTab === 'home') && (\n              <div id=\"section-home\" className=\"scroll-mt-24 sm:scroll-mt-28\">"
  },
  {
    target: "            {/* Tab: Know the Law */}\n            {activeTab === 'knowLaw' && (\n              <div className=\"py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8\">",
    replacement: "            {/* Section: Know the Law */}\n            {(viewMode === 'onepage' || activeTab === 'knowLaw') && (\n              <div id=\"section-knowLaw\" className=\"scroll-mt-24 sm:scroll-mt-28 py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800\">"
  },
  {
    target: "            {/* Tab: Legal Playbook */}\n            {activeTab === 'playbook' && (\n              <div className=\"py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8\">",
    replacement: "            {/* Section: Legal Playbook */}\n            {(viewMode === 'onepage' || activeTab === 'playbook') && (\n              <div id=\"section-playbook\" className=\"scroll-mt-24 sm:scroll-mt-28 py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800\">"
  },
  {
    target: "            {/* Tab: Verified Cases & Updates */}\n            {activeTab === 'cases' && (\n              <div className=\"py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8\">",
    replacement: "            {/* Section: Verified Cases & Updates */}\n            {(viewMode === 'onepage' || activeTab === 'cases') && (\n              <div id=\"section-cases\" className=\"scroll-mt-24 sm:scroll-mt-28 py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800\">"
  },
  {
    target: "            {/* Tab: Truth vs Myth */}\n            {activeTab === 'truthMyth' && (\n              <div className=\"py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8\">",
    replacement: "            {/* Section: Truth vs Myth */}\n            {(viewMode === 'onepage' || activeTab === 'truthMyth') && (\n              <div id=\"section-truthMyth\" className=\"scroll-mt-24 sm:scroll-mt-28 py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800\">"
  },
  {
    target: "            {/* Tab: Our Work & Policy */}\n            {activeTab === 'ourWork' && (\n              <div className=\"py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8\">",
    replacement: "            {/* Section: Our Work & Policy */}\n            {(viewMode === 'onepage' || activeTab === 'ourWork') && (\n              <div id=\"section-ourWork\" className=\"scroll-mt-24 sm:scroll-mt-28 py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800\">"
  },
  {
    target: "            {/* Tab: About Us & Leadership Team (Clean Monogram Badge Design - No Pictures as requested!) */}\n            {activeTab === 'about' && (\n              <div className=\"py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8\">",
    replacement: "            {/* Section: About Us & Leadership Team */}\n            {(viewMode === 'onepage' || activeTab === 'about') && (\n              <div id=\"section-about\" className=\"scroll-mt-24 sm:scroll-mt-28 py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800\">"
  },
  {
    target: "            {/* Tab: Contact & Police Directory */}\n            {activeTab === 'contact' && (\n              <div className=\"py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8\">",
    replacement: "            {/* Section: Contact & Police Directory */}\n            {(viewMode === 'onepage' || activeTab === 'contact') && (\n              <div id=\"section-contact\" className=\"scroll-mt-24 sm:scroll-mt-28 py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800\">"
  }
];

tabReplacements.forEach(({ target, replacement }) => {
  if (!code.includes(target)) {
    console.error("Could not find tab target: " + target);
    process.exit(1);
  }
  code = code.replace(target, replacement);
});

console.log('=== Step 5: Adding Bottom Mobile Quick Action Bar & Adjusting Floating Facebook Button ===');

const oldFbButton = `{/* Floating Facebook Community Button with Pulsing Live Indicator */}
          <a 
            href="https://fb.com/awcsrilanka" 
            target="_blank" 
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-40 flex items-center space-x-2.5 bg-[#1877F2] hover:bg-[#0c63d4] text-white px-4 py-2.5 sm:py-3 rounded-full shadow-2xl shadow-blue-600/40 hover:shadow-blue-600/60 transition-all duration-200 transform hover:scale-105 border border-blue-400/30 group"
            title="Follow AWC on Facebook for Recent Updates"
          >`;

const newFbAndBottomBar = `{/* Mobile Bottom Sticky Quick Action Bar (Thumb-Optimized for Portrait View) */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl">
            <button
              onClick={() => setShowReportModal(true)}
              className="flex flex-col items-center justify-center text-orange-600 dark:text-orange-400 font-extrabold text-[10px] space-y-0.5 active:scale-95 transition"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-center shadow-md">
                <i data-lucide="alert-triangle" className="w-5 h-5 text-white"></i>
              </div>
              <span>{lang === 'si' ? 'පැමිණිලි' : lang === 'ta' ? 'முறைப்பாடு' : 'Report'}</span>
            </button>

            <button
              onClick={() => setShowLegalModal(true)}
              className="flex flex-col items-center justify-center text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] space-y-0.5 active:scale-95 transition"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <i data-lucide="scale" className="w-5 h-5 text-white"></i>
              </div>
              <span>{lang === 'si' ? 'නීති ආධාර' : lang === 'ta' ? 'சட்ட உதவி' : 'Legal Aid'}</span>
            </button>

            <button
              onClick={() => setShowTrackModal(true)}
              className="flex flex-col items-center justify-center text-slate-700 dark:text-slate-300 font-extrabold text-[10px] space-y-0.5 active:scale-95 transition"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center shadow-sm">
                <i data-lucide="search" className="w-5 h-5"></i>
              </div>
              <span>{t.nav.track}</span>
            </button>

            <a
              href="https://police.lk/telephone-index/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center text-blue-600 dark:text-blue-400 font-extrabold text-[10px] space-y-0.5 active:scale-95 transition"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center shadow-sm">
                <i data-lucide="phone" className="w-5 h-5"></i>
              </div>
              <span>{lang === 'si' ? 'පොලීසිය' : lang === 'ta' ? 'பொலிஸ்' : 'Police'}</span>
            </a>

            <button
              onClick={() => setShowMobileMenu(true)}
              className="flex flex-col items-center justify-center text-slate-600 dark:text-slate-400 font-extrabold text-[10px] space-y-0.5 active:scale-95 transition"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center shadow-sm">
                <i data-lucide="menu" className="w-5 h-5"></i>
              </div>
              <span>{lang === 'si' ? 'මෙනුව' : lang === 'ta' ? 'மெனு' : 'Menu'}</span>
            </button>
          </div>

          {/* Floating Facebook Community Button with Pulsing Live Indicator (Positioned above mobile bottom bar) */}
          <a 
            href="https://fb.com/awcsrilanka" 
            target="_blank" 
            rel="noopener noreferrer"
            className="fixed bottom-20 right-3.5 sm:bottom-6 sm:right-6 z-30 flex items-center space-x-2 bg-[#1877F2] hover:bg-[#0c63d4] text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-2xl shadow-blue-600/40 hover:shadow-blue-600/60 transition-all duration-200 transform hover:scale-105 border border-blue-400/30 group"
            title="Follow AWC on Facebook for Recent Updates"
          >`;

if (!code.includes(oldFbButton)) {
  console.error("Could not find oldFbButton in generate-web-index.js");
  process.exit(1);
}
code = code.replace(oldFbButton, newFbAndBottomBar);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully updated generate-web-index.js');
