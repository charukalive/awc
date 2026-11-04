// scripts/generate-web-index.js
// Builds the production web/index.html with:
// 1. Team cards without personal pictures (clean monogram badge design)
// 2. Clear Cancel buttons on all modals
// 3. TrackTicket modal showing linked Master Case updates
// 4. Full trilingual parity across all tabs

const fs = require('fs');
const path = require('path');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Animal Welfare Coalition Sri Lanka (AWC) | ශ්‍රී ලංකා සත්ව සුබසාධන සන්ධානය | இலங்கை விலங்கு நலக் கூட்டணி</title>
  <link rel="icon" type="image/png" href="assets/logo.png">
  
  <!-- Tailwind CSS CDN with Dark Mode Support -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#f0fdf4',
              100: '#dcfce7',
              500: '#22c55e',
              600: '#16a34a',
              700: '#15803d',
              800: '#166534',
              900: '#14532d',
              dark: '#0f291e'
            },
            accent: {
              500: '#f97316',
              600: '#ea580c',
              700: '#c2410c'
            }
          }
        }
      }
    }
  </script>

  <!-- React 18 & Babel CDN -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <!-- Firebase SDKs (Compat CDN) -->
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>

  <!-- Exhaustive Trilingual Data Source -->
  <script src="i18n-data.js"></script>

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Noto+Sans+Sinhala:wght@400;500;600;700;800&family=Noto+Sans+Tamil:wght@400;500;600;700;800&display=swap');
    
    body {
      font-family: 'Plus Jakarta Sans', 'Noto Sans Sinhala', 'Noto Sans Tamil', sans-serif;
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
  </style>
</head>
<body class="bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
  <div id="root"></div>

  <!-- Main Application Script -->
  <script type="text/babel">
    const { useState, useEffect, useMemo } = React;

    // --- Firebase Configuration ---
    const firebaseConfig = {
      apiKey: "AIzaSyCqubiF5BLjNnol5HkcOdTcq156co4s27o",
      authDomain: "vfflk-a543e.firebaseapp.com",
      projectId: "vfflk-a543e",
      storageBucket: "vfflk-a543e.firebasestorage.app",
      messagingSenderId: "61010073715",
      appId: "1:61010073715:web:423ca808e5a56e0f3a3206"
    };

    let db = null;
    try {
      if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
        db = firebase.firestore();
      }
    } catch (e) {
      console.warn("Firebase initialization notice:", e);
    }

    // --- Master App Component ---
    function App() {
      const [lang, setLang] = useState(() => localStorage.getItem('awc_lang') || 'en');
      const [darkMode, setDarkMode] = useState(() => localStorage.getItem('awc_theme') === 'dark');
      const [activeTab, setActiveTab] = useState('home');

      // Modals
      const [showReportModal, setShowReportModal] = useState(false);
      const [showLegalModal, setShowLegalModal] = useState(false);
      const [showTrackModal, setShowTrackModal] = useState(false);
      const [showTriageModal, setShowTriageModal] = useState(false);
      const [showSampleDraftModal, setShowSampleDraftModal] = useState(false);
      const [showSlvcModal, setShowSlvcModal] = useState(false);

      // Handle Theme Persistence
      useEffect(() => {
        if (darkMode) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('awc_theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('awc_theme', 'light');
        }
      }, [darkMode]);

      // Handle Lang Persistence
      useEffect(() => {
        localStorage.setItem('awc_lang', lang);
      }, [lang]);

      // Initialize Lucide Icons on Render
      useEffect(() => {
        if (window.lucide) {
          window.lucide.createIcons();
        }
      });

      // Translation Dictionary
      const t = useMemo(() => {
        const dict = window.AWC_I18N || {};
        return dict[lang] || dict['en'] || {};
      }, [lang]);

      if (!t.nav) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <h2 className="text-xl font-bold">Loading Animal Welfare Coalition Sri Lanka...</h2>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen flex flex-col">
          {/* Top Operational Notice */}
          <div className="bg-slate-900 text-slate-300 text-[11px] sm:text-xs py-1.5 px-4 border-b border-slate-800">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
              <div className="flex items-center space-x-2 text-center sm:text-left">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                <span>{t.hero.statuteAlert}</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-400 shrink-0">
                <span className="font-semibold text-emerald-400">awcsrilanka@gmail.com</span>
                <span>•</span>
                <a href="https://fb.com/awcsrilanka" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">fb.com/awcsrilanka</a>
              </div>
            </div>
          </div>

          {/* Sticky 2-Tier Navigation Header (Guarantees zero wrapping & clean layout on all screens) */}
          <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Tier 1: Brand & Top Utilities */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
              
              {/* Brand Logo & Name */}
              <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => setActiveTab('home')}>
                <img src="assets/logo.png" alt="AWC Logo" className="h-10 sm:h-12 w-auto object-contain shrink-0" onError={(e)=>{e.target.style.display='none'}} />
                <div className="shrink-0">
                  <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight whitespace-nowrap">
                    {t.brandName}
                  </div>
                  <div className="flex items-center space-x-2">
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
              <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
                
                {/* Prominent Sri Lanka Police Index Link */}
                <a 
                  href="https://police.lk/telephone-index/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:hover:bg-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition shadow-sm whitespace-nowrap"
                  title="Direct Link to Sri Lanka Police Telephone Index & OIC Contacts"
                >
                  <i data-lucide="phone" className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"></i>
                  <span className="hidden sm:inline">{lang === 'si' ? 'පොලිස් දුරකථන නාමාවලිය' : lang === 'ta' ? 'பொலிஸ் தொலைபேசி' : 'Police Directory (OIC)'}</span>
                  <span className="sm:hidden">Police</span>
                </a>

                {/* Track Ticket Button */}
                <button 
                  onClick={() => setShowTrackModal(true)}
                  className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition whitespace-nowrap shrink-0"
                >
                  <i data-lucide="search" className="w-3.5 h-3.5"></i>
                  <span className="hidden sm:inline">{t.nav.track}</span>
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

                {/* Language Switcher */}
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700 text-xs font-bold shrink-0">
                  <button onClick={() => setLang('en')} className={\`px-2 py-1 rounded-lg transition \${lang === 'en' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}\`}>EN</button>
                  <button onClick={() => setLang('si')} className={\`px-2 py-1 rounded-lg transition \${lang === 'si' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}\`}>සිං</button>
                  <button onClick={() => setLang('ta')} className={\`px-2 py-1 rounded-lg transition \${lang === 'ta' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}\`}>த</button>
                </div>

                {/* Quick Action Button in Header */}
                <button
                  onClick={() => setShowReportModal(true)}
                  className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-xs uppercase tracking-wider px-3 sm:px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition whitespace-nowrap shrink-0"
                >
                  <i data-lucide="alert-triangle" className="w-3.5 h-3.5 text-amber-200"></i>
                  <span>{lang === 'si' ? 'පැමිණිලි කරන්න' : lang === 'ta' ? 'முறைப்பாடு' : 'Report'}</span>
                </button>

              </div>
            </div>

            {/* Tier 2: Dedicated Navigation Tab Bar */}
            <div className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center space-x-1.5 py-2 overflow-x-auto scrollbar-none text-xs sm:text-sm font-semibold whitespace-nowrap">
                  <button onClick={() => setActiveTab('home')} className={\`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition shrink-0 \${activeTab === 'home' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800'}\`}>
                    <i data-lucide="home" className="w-4 h-4"></i>
                    <span>{t.nav.home}</span>
                  </button>
                  <button onClick={() => setActiveTab('knowLaw')} className={\`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition shrink-0 \${activeTab === 'knowLaw' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800'}\`}>
                    <i data-lucide="scale" className="w-4 h-4"></i>
                    <span>{t.nav.knowLaw}</span>
                  </button>
                  <button onClick={() => setActiveTab('playbook')} className={\`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition shrink-0 \${activeTab === 'playbook' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800'}\`}>
                    <i data-lucide="book-open" className="w-4 h-4"></i>
                    <span>{t.nav.playbook}</span>
                  </button>
                  <button onClick={() => setActiveTab('cases')} className={\`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition shrink-0 \${activeTab === 'cases' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800'}\`}>
                    <i data-lucide="folder-check" className="w-4 h-4"></i>
                    <span>{t.nav.cases}</span>
                  </button>
                  <button onClick={() => setActiveTab('truthMyth')} className={\`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition shrink-0 \${activeTab === 'truthMyth' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800'}\`}>
                    <i data-lucide="help-circle" className="w-4 h-4"></i>
                    <span>{t.nav.truthMyth}</span>
                  </button>
                  <button onClick={() => setActiveTab('ourWork')} className={\`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition shrink-0 \${activeTab === 'ourWork' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800'}\`}>
                    <i data-lucide="activity" className="w-4 h-4"></i>
                    <span>{t.nav.ourWork}</span>
                  </button>
                  <button onClick={() => setActiveTab('about')} className={\`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition shrink-0 \${activeTab === 'about' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800'}\`}>
                    <i data-lucide="users" className="w-4 h-4"></i>
                    <span>{t.nav.about}</span>
                  </button>
                  <button onClick={() => setActiveTab('contact')} className={\`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition shrink-0 \${activeTab === 'contact' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800'}\`}>
                    <i data-lucide="map-pin" className="w-4 h-4"></i>
                    <span>{t.nav.contact}</span>
                  </button>
                </nav>
              </div>
            </div>
          </header>

          {/* Body Content Area based on Active Tab */}
          <main className="flex-1">
            {activeTab === 'home' && (
              <div>
                {/* Hero Section */}
                <section className="relative overflow-hidden py-12 lg:py-16 bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 dark:from-slate-900/90 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                      
                      {/* Left: Headline & Action Buttons */}
                      <div className="lg:col-span-7 text-center lg:text-left">
                        <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 mb-6 shadow-sm">
                          <i data-lucide="shield-alert" className="w-3.5 h-3.5"></i>
                          <span>{t.hero.tag}</span>
                        </span>

                        <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                          {t.hero.title}
                        </h1>

                        <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                          {t.hero.subtitle}
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
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
                        </div>
                      </div>

                      {/* Right: High-Impact Photography Card & Statistics */}
                      <div className="lg:col-span-5">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                          <img 
                            src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1000&q=80" 
                            alt="Sri Lanka Community Animal Rescue" 
                            className="w-full h-64 sm:h-72 object-cover"
                          />
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                Judicial Mandate & Civil Defense
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                Live Case Pipeline
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                              {t.motto}
                            </h3>
                            <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-semibold">
                              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                <div className="text-emerald-600 dark:text-emerald-400 font-bold">Ordinance No. 13 of 1907</div>
                                <div className="text-slate-500 text-[11px] mt-0.5">Section 12 Warrantless Arrest</div>
                              </div>
                              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                                <div className="text-emerald-600 dark:text-emerald-400 font-bold">Penal Code 411/412</div>
                                <div className="text-slate-500 text-[11px] mt-0.5">Up to 5 Yrs Rigorous Jail</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </section>

                {/* Remit Section */}
                <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mb-8">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Transparency & Civic Remit</span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                        {t.remit.title}
                      </h2>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        {t.remit.subtitle}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-6 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 shadow-sm">
                        <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold text-lg mb-4">
                          <i data-lucide="check-circle-2" className="w-5 h-5 text-emerald-600"></i>
                          <span>{t.remit.doesTitle}</span>
                        </div>
                        <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          {t.remit.doesList.map((item, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-emerald-600 font-bold shrink-0">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-6 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 shadow-sm">
                        <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-300 font-bold text-lg mb-4">
                          <i data-lucide="alert-octagon" className="w-5 h-5 text-amber-600"></i>
                          <span>{t.remit.cannotTitle}</span>
                        </div>
                        <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          {t.remit.cannotList.map((item, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-amber-600 font-bold shrink-0">✕</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 flex items-start space-x-3 text-xs text-blue-900 dark:text-blue-200">
                      <i data-lucide="info" className="w-5 h-5 text-blue-600 shrink-0 mt-0.5"></i>
                      <span>{t.remit.notice}</span>
                    </div>
                  </div>
                </section>

                {/* 4-Step Citizen Action Guide */}
                <section className="py-12 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mb-10 text-center sm:text-left">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Step-by-Step Action</span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                        {t.actionGuide.title}
                      </h2>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        {t.actionGuide.subtitle}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center font-black mb-4">1</div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">{t.actionGuide.step1}</h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{t.actionGuide.step1Desc}</p>
                        </div>
                        <div className="text-[11px] font-bold text-orange-600 dark:text-orange-400 p-2.5 rounded-lg bg-orange-50 dark:bg-orange-950/30">
                          {t.actionGuide.step1Rule}
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-black mb-4">2</div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">{t.actionGuide.step2}</h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{t.actionGuide.step2Desc}</p>
                        </div>
                        <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                          {t.actionGuide.step2Rule}
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-black mb-4">3</div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">{t.actionGuide.step3}</h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{t.actionGuide.step3Desc}</p>
                        </div>
                        <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                          {t.actionGuide.step3Rule}
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-black mb-4">4</div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">{t.actionGuide.step4}</h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{t.actionGuide.step4Desc}</p>
                        </div>
                        <button
                          onClick={() => setShowLegalModal(true)}
                          className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition text-center shadow-sm"
                        >
                          {t.actionGuide.step4Action}
                        </button>
                      </div>
                    </div>

                    {/* Quick Callout Cards */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div 
                        onClick={() => setShowSampleDraftModal(true)}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-500 transition flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shrink-0">
                            <i data-lucide="file-check-2" className="w-5 h-5"></i>
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-sm">{t.sampleComplaint.title}</div>
                            <div className="text-slate-500 mt-0.5">{t.sampleComplaint.subtitle}</div>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-600 ml-2 shrink-0">Open →</span>
                      </div>

                      <div 
                        onClick={() => setShowSlvcModal(true)}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-amber-500 transition flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center shrink-0">
                            <i data-lucide="alert-circle" className="w-5 h-5"></i>
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-sm">{t.slvcProtocol.title}</div>
                            <div className="text-slate-500 mt-0.5">{t.slvcProtocol.badge}</div>
                          </div>
                        </div>
                        <span className="font-bold text-amber-600 ml-2 shrink-0">Protocol →</span>
                      </div>
                    </div>

                  </div>
                </section>
              </div>
            )}

            {/* Tab: Know the Law */}
            {activeTab === 'knowLaw' && (
              <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mb-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Statutory Knowledge Base</span>
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {t.knowLaw.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {t.knowLaw.subtitle}
                  </p>
                </div>

                <div className="space-y-8">
                  {t.knowLaw.statutes.map((statute, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        <div className="lg:col-span-3">
                          <img 
                            src={statute.image} 
                            alt={statute.title} 
                            className="w-full h-44 rounded-2xl object-cover shadow-sm"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          <div className="mt-3">
                            <span className={\`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md block text-center \${statute.badgeColor}\`}>
                              {statute.badge}
                            </span>
                            <div className="text-xs font-bold text-red-600 dark:text-red-400 text-center mt-2">
                              {statute.limitation}
                            </div>
                          </div>
                        </div>

                        <div className="lg:col-span-9">
                          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                            {statute.title}
                          </h3>
                          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {statute.summary}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-5">
                            {statute.sections.map((sec, sIdx) => (
                              <div key={sIdx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                                <div className="font-bold text-slate-900 dark:text-white mb-1.5">{sec.num}</div>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-2.5">{sec.desc}</p>
                                <div className="font-extrabold text-emerald-700 dark:text-emerald-400">{sec.penalty}</div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-950 dark:text-emerald-200">
                            <strong>{lang === 'si' ? 'නෛතික උපායමාර්ගය:' : lang === 'ta' ? 'சட்ட உத்தி:' : 'Strategic Practice:'}</strong> {statute.criticalNote}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Legal Playbook */}
            {activeTab === 'playbook' && (
              <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mb-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Citizen Court Handbook</span>
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {t.playbook.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {t.playbook.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {t.playbook.sections.map((sec, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-4 mb-4">
                          <img 
                            src={sec.image} 
                            alt={sec.title} 
                            className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-sm"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          <div>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                              {sec.citation}
                            </span>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                              {sec.title}
                            </h3>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                          {sec.summary}
                        </p>

                        <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 mb-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                          {sec.points.map((pt, pIdx) => (
                            <li key={pIdx} className="flex items-start space-x-2">
                              <span className="text-emerald-600 font-bold shrink-0">✓</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                        {sec.takeaway}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Verified Cases & Updates */}
            {activeTab === 'cases' && (
              <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mb-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Verified Precedents</span>
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {t.cases.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {t.cases.subtitle}
                  </p>
                </div>

                <div className="space-y-8">
                  {t.cases.list.map((c, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        <div className="md:col-span-4">
                          <img 
                            src={c.image} 
                            alt={c.title} 
                            className="w-full h-48 sm:h-56 rounded-2xl object-cover shadow-sm"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          <div className="mt-3 flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-500">{c.location}</span>
                            <span className="font-extrabold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              {c.status}
                            </span>
                          </div>
                        </div>

                        <div className="md:col-span-8">
                          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{c.sections}</span>
                          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                            {c.title}
                          </h3>
                          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {c.facts}
                          </p>

                          <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                            <span className="font-bold text-slate-900 dark:text-white block mb-1">
                              {lang === 'si' ? 'නීතිමය මැදිහත්වීම සහ පියවර:' : lang === 'ta' ? 'எடுக்கப்பட்ட சட்ட நடவடிக்கை:' : 'AWC Legal Intervention:'}
                            </span>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                              {c.action}
                            </p>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold">
                            {c.timeline.map((step, sIdx) => (
                              <span key={sIdx} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                {step}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Truth vs Myth */}
            {activeTab === 'truthMyth' && (
              <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mb-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Public Education</span>
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {t.truthMyth.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {t.truthMyth.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {t.truthMyth.items.map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs mb-4">
                          <span className="font-extrabold uppercase tracking-wider text-rose-600 block mb-1">
                            ✕ {lang === 'si' ? 'මිථ්‍යාව (Misconception)' : lang === 'ta' ? 'தவறான கருத்து' : 'Myth'}
                          </span>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">
                            "{item.myth}"
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs mb-4">
                          <span className="font-extrabold uppercase tracking-wider text-emerald-600 block mb-1">
                            ✓ {lang === 'si' ? 'නෛතික සත්‍යය (Legal Reality)' : lang === 'ta' ? 'சட்ட உண்மை' : 'Legal Reality'}
                          </span>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {item.truth}
                          </p>
                        </div>
                      </div>

                      <div className="text-[11px] font-mono font-bold text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                        {item.citation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Our Work & Policy */}
            {activeTab === 'ourWork' && (
              <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mb-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Scientific Reform</span>
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {t.ourWork.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {t.ourWork.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {t.ourWork.stats.map((st, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                      <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{st.value}</span>
                      <div className="font-bold text-sm text-slate-900 dark:text-white mt-1">{st.label}</div>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">{st.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {t.ourWork.campaigns.map((camp, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <div>
                        <img 
                          src={camp.image} 
                          alt={camp.title} 
                          className="w-full h-48 object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div className="p-6">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {camp.badge}
                          </span>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                            {camp.title}
                          </h3>
                          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {camp.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: About Us & Leadership Team (Clean Monogram Badge Design - No Pictures as requested!) */}
            {activeTab === 'about' && (
              <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mb-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Executive Committee & Governance</span>
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {t.team.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {t.team.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {t.team.members.map((member, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-emerald-500/50 transition">
                      <div>
                        {/* Distinguished Monogram Avatar Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className={\`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shadow-sm \${
                            idx % 4 === 0 ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white' :
                            idx % 4 === 1 ? 'bg-gradient-to-br from-blue-500 to-indigo-700 text-white' :
                            idx % 4 === 2 ? 'bg-gradient-to-br from-purple-500 to-violet-700 text-white' :
                            'bg-gradient-to-br from-amber-500 to-orange-700 text-white'
                          }\`}>
                            {member.initials || member.name.substring(0, 2)}
                          </div>
                          <span className={\`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-md \${member.badgeColor}\`}>
                            {member.badge}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                          {member.name}
                        </h3>
                        <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 leading-tight">
                          {member.role}
                        </div>
                        <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {member.bio}
                        </p>
                      </div>
                      
                      {/* External Link if Available (e.g. Linipaws.org) */}
                      {member.link && (
                        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                          <a 
                            href={member.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                          >
                            <span>{member.linkLabel || member.link}</span>
                            <i data-lucide="external-link" className="w-3.5 h-3.5"></i>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Contact & Police Directory */}
            {activeTab === 'contact' && (
              <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mb-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Civic Contact & Official Channels</span>
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {t.contact.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {t.contact.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-blue-200 dark:border-blue-900/50 shadow-md flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center shrink-0">
                          <i data-lucide="phone-call" className="w-6 h-6"></i>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            Law Enforcement Contacts
                          </span>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                            {t.contact.policeTitle}
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        {t.contact.policeDesc}
                      </p>

                      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 mb-6">
                        {t.contact.policeNotice}
                      </div>
                    </div>

                    <a
                      href="https://police.lk/telephone-index/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3.5 rounded-2xl shadow-md transition"
                    >
                      <i data-lucide="external-link" className="w-4 h-4"></i>
                      <span>{t.contact.policeBtn}</span>
                    </a>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shrink-0">
                          <i data-lucide="mail" className="w-6 h-6"></i>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Coalition Inquiries
                          </span>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                            {t.contact.awcTitle}
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        {t.contact.awcDesc}
                      </p>

                      <div className="space-y-3 text-xs mb-6">
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 font-semibold flex items-center justify-between">
                          <span className="text-slate-500">Official Email:</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t.contact.awcEmail}</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 font-semibold flex items-center justify-between">
                          <span className="text-slate-500">Facebook Page:</span>
                          <a href="https://fb.com/awcsrilanka" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline">fb.com/awcsrilanka</a>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
                        {t.contact.strictWarning}
                      </div>
                    </div>

                    <button
                      onClick={() => setShowTrackModal(true)}
                      className="mt-6 w-full inline-flex items-center justify-center space-x-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-sm py-3.5 rounded-2xl shadow-sm transition"
                    >
                      <i data-lucide="search" className="w-4 h-4"></i>
                      <span>{t.nav.track}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <img src="assets/logo.png" alt="AWC Logo" className="h-8 w-auto object-contain" onError={(e)=>{e.target.style.display='none'}} />
                    <span className="text-base font-black text-white">{t.brandName}</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    {t.footer.desc}
                  </p>
                </div>

                <div>
                  <div className="text-white font-bold text-sm mb-3">Official Communication</div>
                  <ul className="space-y-2">
                    <li>{t.footer.officialEmail}</li>
                    <li><a href="https://fb.com/awcsrilanka" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">{t.footer.facebook}</a></li>
                    <li><a href="https://police.lk/telephone-index/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Sri Lanka Police Directory (police.lk)</a></li>
                  </ul>
                </div>

                <div>
                  <div className="text-white font-bold text-sm mb-3">Civil Governance Remit</div>
                  <p className="text-slate-400 leading-relaxed">
                    {t.footer.noHotline}
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-800 text-center text-slate-500">
                {t.footer.copyright}
              </div>
            </div>
          </footer>

          {/* Modals with Clear, Prominent Cancel Buttons */}
          {showReportModal && (
            <ReportComplaintModal
              lang={lang}
              onClose={() => setShowReportModal(false)}
              onShowSample={() => setShowSampleDraftModal(true)}
            />
          )}

          {showLegalModal && (
            <LegalAssistanceModal
              lang={lang}
              onClose={() => setShowLegalModal(false)}
            />
          )}

          {showTrackModal && (
            <TrackTicketModal
              lang={lang}
              onClose={() => setShowTrackModal(false)}
            />
          )}

          {showTriageModal && (
            <EmergencyTriageModal
              lang={lang}
              onClose={() => setShowTriageModal(false)}
            />
          )}

          {showSampleDraftModal && (
            <SampleComplaintDraftModal
              lang={lang}
              onClose={() => setShowSampleDraftModal(false)}
            />
          )}

          {showSlvcModal && (
            <SlvcModal
              lang={lang}
              onClose={() => setShowSlvcModal(false)}
            />
          )}

        </div>
      );
    }

    // --- Sub-Component: Report Complaint Modal ---
    function ReportComplaintModal({ lang, onClose, onShowSample }) {
      const [category, setCategory] = useState('physical_abuse');
      const [name, setName] = useState('');
      const [phone, setPhone] = useState('');
      const [email, setEmail] = useState('');
      const [district, setDistrict] = useState('Colombo');
      const [location, setLocation] = useState('');
      const [details, setDetails] = useState('');
      const [incidentDate, setIncidentDate] = useState('');
      const [consentSocial, setConsentSocial] = useState(false);
      const [generatedToken, setGeneratedToken] = useState(null);

      const isMedNegligence = category === 'medical_negligence';

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!phone || !email || !details) {
          alert(lang === 'si' ? 'කරුණාකර දුරකථන අංකය, ඊමේල් ලිපිනය සහ විස්තර ඇතුළත් කරන්න.' : lang === 'ta' ? 'தயவுசெய்து தொலைபேசி எண், மின்னஞ்சல் மற்றும் விபரங்களை உள்ளிடவும்.' : 'Please provide mandatory Phone Number, Email, and details.');
          return;
        }
        const token = 'AWC-TKT-' + Math.floor(100000 + Math.random() * 900000);
        
        const newTicket = {
          token,
          type: 'COMPLAINT',
          category,
          name,
          phone,
          email,
          district,
          location,
          details,
          incidentDate,
          consentSocial,
          createdAt: new Date().toISOString(),
          status: 'RECEIVED',
          notes: []
        };
        const existing = JSON.parse(localStorage.getItem('awc_tickets') || '[]');
        existing.unshift(newTicket);
        localStorage.setItem('awc_tickets', JSON.stringify(existing));

        if (db) {
          try {
            db.collection('complaints').doc(token).set(newTicket).catch(e => console.warn("Firestore write:", e));
            db.collection('ticketStatus').doc(token).set({
              token,
              type: 'COMPLAINT',
              category,
              district,
              location,
              status: 'RECEIVED',
              createdAt: new Date().toISOString()
            }).catch(e => console.warn("Firestore status write:", e));
          } catch (err) {
            console.warn("Firestore error:", err);
          }
        }

        setGeneratedToken(token);
      };

      return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative my-8">
            
            {/* Top-Right Clear Cancel Button */}
            <button 
              type="button"
              onClick={onClose} 
              className="absolute top-5 right-5 inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition border border-slate-300 dark:border-slate-700 shadow-sm"
              title="Close / Cancel"
            >
              <i data-lucide="x" className="w-4 h-4"></i>
              <span>{lang === 'si' ? 'අවලංගු කරන්න (Cancel)' : lang === 'ta' ? 'இரத்து (Cancel)' : 'Cancel'}</span>
            </button>

            {!generatedToken ? (
              <div>
                <div className="mb-6 pr-24">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                    Cruelty & Abuse Intake
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {lang === 'si' ? 'සත්ව හිංසනයක් පැමිණිලි කරන්න' : lang === 'ta' ? 'விலங்கு வதை முறைப்பாடு' : 'Report Animal Cruelty / Complaint'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {lang === 'si' ? 'සියලු පැමිණිලි රහස්‍යභාවයෙන් යුතුව සමාලෝචනය කර නීතිමය ක්‍රියාමාර්ග සඳහා යොමු කෙරේ.' : lang === 'ta' ? 'அனைத்து முறைப்பாடுகளும் இரகசியமாக பரிசீலிக்கப்பட்டு சட்ட நடவடிக்கைக்கு உட்படுத்தப்படும்.' : 'All submissions enter a confidential queue for review and legal follow-up.'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {/* Category Dropdown */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                      {lang === 'si' ? 'පැමිණිල්ලේ වර්ගය තෝරන්න *' : lang === 'ta' ? 'முறைப்பாட்டின் வகையைத் தேர்ந்தெடுக்கவும் *' : 'Select Concern Category *'}
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="physical_abuse">{lang === 'si' ? 'ශාරීරික හිංසනය / පහරදීම (Physical Abuse / Beating)' : lang === 'ta' ? 'உடல் ரீதியான தாக்குதல் / துன்புறுத்தல்' : 'Physical Abuse / Violent Assault'}</option>
                      <option value="starvation">{lang === 'si' ? 'කුසගින්නේ තැබීම / අතහැර දැමීම (Starvation / Abandonment)' : lang === 'ta' ? 'பட்டினி போடுதல் / கைவிடுதல்' : 'Starvation / Severe Neglect / Abandonment'}</option>
                      <option value="illegal_transport">{lang === 'si' ? 'නීතිවිරෝධී සත්ව ප්‍රවාහනය (Illegal Cattle / Livestock Transport)' : lang === 'ta' ? 'சட்டவிரோத விலங்கு போக்குவரத்து' : 'Illegal Animal Transport / Cattle Smuggling'}</option>
                      <option value="illegal_slaughter">{lang === 'si' ? 'නීතිවිරෝධී ඝාතනය / ගැබිනි එළදෙනුන් ඝාතනය (Illegal Slaughter)' : lang === 'ta' ? 'சட்டவிரோத வதை / சினை மாடுகளை வதைத்தல்' : 'Illegal Slaughter / Pregnant Cow Slaughter'}</option>
                      <option value="captive_wildlife">{lang === 'si' ? 'වනජීවී / අලි ඇතුන් හිංසනය (Captive Wildlife / Elephant Abuse)' : lang === 'ta' ? 'வனவிலங்கு / யானை வதை' : 'Captive Wildlife / Elephant Abuse (FFPO)'}</option>
                      <option value="boarding_facility">{lang === 'si' ? 'සුරතල් සතුන් රඳවාගැනීමේ ස්ථාන / බෝකිරීමේ ස්ථාන (Pet Boarding / Breeding)' : lang === 'ta' ? 'செல்லப்பிராணி தங்குமிட அலட்சியம்' : 'Pet Boarding Kennel / Breeder Neglect'}</option>
                      <option value="medical_negligence">{lang === 'si' ? '⚠️ පශු වෛද්‍ය නොසැලකිලිමත්කම (Veterinary Medical Negligence)' : lang === 'ta' ? '⚠️ கால்நடை மருத்துவ கவனக்குறைவு (SLVC Protocol)' : '⚠️ Veterinary Medical Negligence (SLVC Protocol)'}</option>
                      <option value="other">{lang === 'si' ? 'වෙනත් සත්ව අසාධාරණයක් (Other Animal Injustice)' : lang === 'ta' ? 'ஏனைய விலங்கு அநீதி' : 'Other Animal Welfare Injustice'}</option>
                    </select>
                  </div>

                  {/* SPECIAL CONDITIONAL BANNER: Medical Negligence */}
                  {isMedNegligence && (
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-2">
                      <div className="font-bold flex items-center space-x-1.5 text-sm">
                        <i data-lucide="alert-triangle" className="w-4 h-4 text-amber-600"></i>
                        <span>{lang === 'si' ? 'පශු වෛද්‍ය නොසැලකිලිමත්කම පිළිබඳ විශේෂ උපදෙස්' : lang === 'ta' ? 'கால்நடை மருத்துவ கவனக்குறைவு வழிகாட்டல்' : 'Veterinary Medical Negligence Protocol (Out of Direct Scope)'}</span>
                      </div>
                      <p className="leading-relaxed">
                        {lang === 'si' ? (
                          <>
                            පශු වෛද්‍ය ප්‍රතිකාර නොසැලකිලිමත්කම හෝ වෘත්තීය විෂමාචාරයන් විභාග කිරීමේ නෛතික බලතල හිමිවන්නේ <strong>ශ්‍රී ලංකා පශු වෛද්‍ය මණ්ඩලය (SLVC)</strong> වෙතය.
                            <br />
                            <strong>1.</strong> වහාම ලිඛිත පැමිණිල්ල සහ වෛද්‍ය වාර්තා SLVC ලේඛකාධිකාරී වෙත යොමු කරන්න: <strong className="underline">registrarslvetcouncil@gmail.com</strong>
                            <br />
                            <strong>2.</strong> ළඟම පොලිස් ස්ථානයේ පැමිණිල්ලක් සටහන් කරන්න.
                            <br />
                            <strong>3.</strong> SLVC හෝ පොලීසියෙන් නිසි ප්‍රතිචාරයක් නොලැබෙන්නේ නම්, අදාළ තොරතුරු AWC වෙත යොමු කරන්න.
                          </>
                        ) : lang === 'ta' ? (
                          <>
                            கால்நடை மருத்துவ கவனக்குறைவு விவகாரங்கள் <strong>இலங்கை கால்நடை வைத்திய பேரவையின் (SLVC)</strong> அதிகார வரம்பிற்குட்பட்டவை.
                            <br />
                            <strong>1.</strong> உத்தியோகபூர்வ முறைப்பாட்டை SLVC பதிவாளருக்கு மின்னஞ்சல் செய்யவும்: <strong className="underline">registrarslvetcouncil@gmail.com</strong>
                            <br />
                            <strong>2.</strong> உங்கள் உள்ளூர் பொலிஸ் நிலையத்தில் முறைப்பாடு பதிவு செய்யவும்.
                            <br />
                            <strong>3.</strong> உரிய நடவடிக்கை எடுக்கப்படாவிடின், ஆதாரங்களுடன் AWC இற்கு தகவல்களை அனுப்பவும்.
                          </>
                        ) : (
                          <>
                            Veterinary clinical malpractice falls strictly under the statutory jurisdiction of the <strong>Sri Lanka Veterinary Council (SLVC)</strong>.
                            <br />
                            <strong>1.</strong> Send formal complaint & treatment slips directly to the SLVC Registrar: <strong className="underline">registrarslvetcouncil@gmail.com</strong>
                            <br />
                            <strong>2.</strong> Lodge a formal Information Book entry at your local police station.
                            <br />
                            <strong>3.</strong> If no official response or inquiry is conducted, forward your details to AWC for guidance.
                          </>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Contact Fields (Mandatory Phone & Email) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'si' ? 'ඔබගේ දුරකථන අංකය (Phone Number) *' : lang === 'ta' ? 'தொலைபேசி எண் *' : 'Contact Phone Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="07X XXX XXXX"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'si' ? 'ඔබගේ ඊමේල් ලිපිනය (Email Address) *' : lang === 'ta' ? 'மின்னஞ்சல் முகவரி *' : 'Email Address *'}
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'si' ? 'ඔබගේ නම (නම හෙළිකිරීමට අකමැති නම් හිස්ව තබන්න)' : lang === 'ta' ? 'உங்கள் பெயர் (விருப்பப்பட்டால்)' : 'Full Name (Leave blank if you wish to remain anonymous)'}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Optional / Anonymous"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* District & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'si' ? 'දිස්ත්‍රික්කය (District)' : lang === 'ta' ? 'மாவட்டம்' : 'District'}
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        {['Ampara','Anuradhapura','Badulla','Batticaloa','Colombo','Galle','Gampaha','Hambantota','Jaffna','Kalutara','Kandy','Kegalle','Kilinochchi','Kurunegala','Mannar','Matale','Matara','Monaragala','Mullaitivu','Nuwara Eliya','Polonnaruwa','Puttalam','Ratnapura','Trincomalee','Vavuniya'].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'si' ? 'නගරය / ස්ථානය (Town / Landmarks)' : lang === 'ta' ? 'இடம் / அடையாளம்' : 'Exact Town / Street / Landmark'}
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Maharagama, Pansala Road"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Narrative */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'si' ? 'සිදුවීමේ සම්පූර්ණ විස්තරය *' : lang === 'ta' ? 'சம்பவ விபரம் *' : 'Detailed Incident Description *'}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder={lang === 'si' ? 'කරුණාකර සිදුවූ දිනය, වේලාව, සත්වයාගේ තත්ත්වය, සැකකරුගේ තොරතුරු සහ දුටු සාක්ෂිකරුවන් පිළිබඳ විස්තර සඳහන් කරන්න...' : 'Describe what happened, exact date/time, weapon used, animal condition, and any suspect details...'}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Attachment Note */}
                  <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-[11px] text-blue-900 dark:text-blue-200 flex items-start space-x-2">
                    <i data-lucide="info" className="w-4 h-4 text-blue-600 shrink-0 mt-0.5"></i>
                    <div>
                      <strong>{lang === 'si' ? 'ඡායාරූප සහ වීඩියෝ සාක්ෂි:' : lang === 'ta' ? 'புகைப்படங்கள் & வீடியோக்கள்:' : 'Evidence Preservation:'}</strong>
                      <div className="mt-0.5">
                        {lang === 'si' ? 'පැමිණිල්ල යොමුකළ පසු ලැබෙන ටෝකන් අංකය (Token) සඳහන් කර ඡායාරූප හා වීඩියෝ awcsrilanka@gmail.com වෙත ඊමේල් කරන්න.' : 'Email clear photos/videos to awcsrilanka@gmail.com quoting your token reference.'}
                      </div>
                    </div>
                  </div>

                  {/* Consent */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <label className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentSocial}
                        onChange={(e) => setConsentSocial(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{lang === 'si' ? 'සමාජ දැනුවත්භාවය සඳහා පුද්ගලික තොරතුරු රහිතව ප්‍රසිද්ධ කිරීමට අවසර දෙමි.' : 'Consent to publish anonymized case awareness updates.'}</span>
                    </label>
                  </div>

                  {/* Submit & Cancel Buttons Footer */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={onShowSample}
                      className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                    >
                      {lang === 'si' ? 'ආදර්ශ ආකෘතිය බලන්න →' : lang === 'ta' ? 'மாதிரி படிவம் →' : 'View Sample Draft →'}
                    </button>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition shadow-sm"
                      >
                        {lang === 'si' ? 'අවලංගු කරන්න' : lang === 'ta' ? 'இரத்து செய்க' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition"
                      >
                        {lang === 'si' ? 'පැමිණිල්ල ඉදිරිපත් කරන්න' : lang === 'ta' ? 'முறைப்பாடு செய்க' : 'Submit Cruelty Report'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {lang === 'si' ? 'පැමිණිල්ල සාර්ථකව ලියාපදිංචි විය' : 'Complaint Successfully Registered'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  {lang === 'si' ? 'ඔබගේ රහස්‍ය ටෝකන් අංකය පහත දැක්වේ. සාක්ෂි ඊමේල් කිරීමේදී සහ ප්‍රගතිය විමසීමේදී මෙය භාවිතා කරන්න.' : 'Your confidential reference token is generated below. Quote this token when sending photos to awcsrilanka@gmail.com and for tracking.'}
                </p>
                <div className="inline-block p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-emerald-500 text-lg font-mono font-black text-emerald-600 dark:text-emerald-400 tracking-wider">
                  {generatedToken}
                </div>
                <div className="pt-4">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                  >
                    Close / අවසන් කරන්න
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // --- Sub-Component: Request Legal Assistance Modal ---
    function LegalAssistanceModal({ lang, onClose }) {
      const [caseType, setCaseType] = useState('magistrate_filing');
      const [courtName, setCourtName] = useState('');
      const [policeStation, setPoliceStation] = useState('');
      const [cibNumber, setCibNumber] = useState('');
      const [phone, setPhone] = useState('');
      const [email, setEmail] = useState('');
      const [details, setDetails] = useState('');
      const [generatedToken, setGeneratedToken] = useState(null);

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!phone || !email || !details) {
          alert('Please enter required phone, email, and case details.');
          return;
        }
        const token = 'AWC-LEG-' + Math.floor(100000 + Math.random() * 900000);
        const reqData = {
          token,
          type: 'LEGAL_REQUEST',
          caseType,
          courtName,
          policeStation,
          cibNumber,
          phone,
          email,
          details,
          status: 'PENDING_REVIEW',
          createdAt: new Date().toISOString()
        };

        const existing = JSON.parse(localStorage.getItem('awc_tickets') || '[]');
        existing.unshift(reqData);
        localStorage.setItem('awc_tickets', JSON.stringify(existing));

        if (db) {
          try {
            db.collection('legalRequests').doc(token).set(reqData).catch(e=>console.warn(e));
            db.collection('ticketStatus').doc(token).set({
              token,
              type: 'LEGAL_REQUEST',
              courtName,
              status: 'PENDING_REVIEW',
              createdAt: new Date().toISOString()
            }).catch(e=>console.warn(e));
          } catch(err) {
            console.warn(err);
          }
        }
        setGeneratedToken(token);
      };

      return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative my-8">
            
            {/* Top-Right Clear Cancel Button */}
            <button 
              type="button"
              onClick={onClose} 
              className="absolute top-5 right-5 inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition border border-slate-300 dark:border-slate-700 shadow-sm"
              title="Close / Cancel"
            >
              <i data-lucide="x" className="w-4 h-4"></i>
              <span>{lang === 'si' ? 'ඉවත් වන්න (Cancel)' : 'Cancel'}</span>
            </button>

            {!generatedToken ? (
              <div>
                <div className="mb-6 pr-24">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Legal Aid & Court Coordination
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {lang === 'si' ? 'නීති සහය ඉල්ලුම් කිරීම' : lang === 'ta' ? 'சட்ட உதவி கோரிக்கை' : 'Request Legal Assistance / Court Coordination'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {lang === 'si' ? 'මහේස්ත්‍රාත් අධිකරණයේ පෙනී සිටීම, පොලිස් ලිපි භාරදීම සහ නීතිඥ සම්බන්ධීකරණය.' : 'Coordinating legal counsel for Magistrate Court motions, B-report monitoring, and police station liaison.'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'si' ? 'අවශ්‍ය නීතිමය සහය වර්ගය *' : 'Legal Assistance Scope *'}
                    </label>
                    <select
                      value={caseType}
                      onChange={(e) => setCaseType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    >
                      <option value="magistrate_filing">{lang === 'si' ? 'මහේස්ත්‍රාත් අධිකරණයේ නඩුවක් සඳහා නීතිඥ පෙනී සිටීම' : 'Magistrate Court Lawyer Appearance / Motion'}</option>
                      <option value="police_inaction">{lang === 'si' ? 'පොලීසිය පැමිණිල්ල විභාග නොකිරීම (Police Inaction / Refusal)' : 'Police Inaction / Failure to record IB Entry'}</option>
                      <option value="witness_protection">{lang === 'si' ? 'සාක්ෂිකරුවන්ට තර්ජන එල්ලවීම (Witness Protection)' : 'Threats to Complainant or Witness'}</option>
                      <option value="custody_motion">{lang === 'si' ? 'සත්වයා සැකකරුගෙන් මුදාගැනීමේ අධිකරණ නියෝගයක් ඉල්ලීම' : 'Animal Custody & Protection Motion (Prevent Return)'}</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'si' ? 'අධිකරණය (Magistrate Court)' : 'Magistrate Court (if instituted)'}
                      </label>
                      <input
                        type="text"
                        value={courtName}
                        onChange={(e) => setCourtName(e.target.value)}
                        placeholder="e.g. Negombo, Kandy, Colombo Fort"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'si' ? 'පොලිස් ස්ථානය සහ CIB අංකය' : 'Police Station & CIB / IB #'}
                      </label>
                      <input
                        type="text"
                        value={cibNumber}
                        onChange={(e) => setCibNumber(e.target.value)}
                        placeholder="e.g. Sigiriya Police - CIB 142/26"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'si' ? 'දුරකථන අංකය *' : 'Contact Phone Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="07X XXX XXXX"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'si' ? 'ඊමේල් ලිපිනය *' : 'Email Address *'}
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'si' ? 'නඩුවේ සවිස්තරාත්මක පසුබිම *' : 'Case Background & Immediate Legal Needs *'}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Explain current legal status, next court hearing date, B-report status, and what intervention is requested..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
                    >
                      {lang === 'si' ? 'අවලංගු කරන්න' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                    >
                      {lang === 'si' ? 'නීති සහය ඉල්ලුම්පත්‍රය යොමු කරන්න' : 'Submit Legal Request'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Legal Assistance Request Queued
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Your legal assistance ticket has been assigned. Our legal counsel coordinates hearings based on jurisdictional priorities.
                </p>
                <div className="inline-block p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-blue-500 text-lg font-mono font-black text-blue-600 dark:text-blue-400 tracking-wider">
                  {generatedToken}
                </div>
                <div className="pt-4">
                  <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">
                    Close / අවසන් කරන්න
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // --- Sub-Component: Track Ticket Modal ---
    function TrackTicketModal({ lang, onClose }) {
      const [searchToken, setSearchToken] = useState('');
      const [ticketResult, setTicketResult] = useState(null);
      const [loading, setLoading] = useState(false);
      const [searched, setSearched] = useState(false);

      const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchToken.trim()) return;
        setLoading(true);
        setSearched(true);

        const token = searchToken.trim().toUpperCase();

        if (db) {
          try {
            const doc = await db.collection('ticketStatus').doc(token).get();
            if (doc.exists) {
              setTicketResult(doc.data());
              setLoading(false);
              return;
            }
          } catch (err) {
            console.warn("Firestore lookup error:", err);
          }
        }

        const local = JSON.parse(localStorage.getItem('awc_tickets') || '[]');
        const found = local.find(t => t.token === token);
        if (found) {
          setTicketResult({
            token: found.token,
            type: found.type,
            status: found.status,
            district: found.district || found.courtName || 'Sri Lanka',
            category: found.category || found.caseType,
            assignedCaseId: found.assignedCaseId,
            caseTitle: found.caseTitle,
            latestMilestone: found.latestMilestone,
            milestoneDate: found.milestoneDate,
            createdAt: found.createdAt
          });
        } else {
          setTicketResult(null);
        }
        setLoading(false);
      };

      return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative my-8">
            <button 
              type="button"
              onClick={onClose} 
              className="absolute top-5 right-5 inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition border border-slate-300 dark:border-slate-700"
            >
              <i data-lucide="x" className="w-4 h-4"></i>
              <span>Cancel</span>
            </button>

            <div className="mb-6 pr-20">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                Ticket Verification
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {lang === 'si' ? 'පැමිණිල්ලේ තත්ත්වය විමසන්න' : lang === 'ta' ? 'முறைப்பாட்டு நிலைமையை அறிதல்' : 'Track Your Reference Ticket'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'si' ? 'ඔබගේ AWC-TKT හෝ AWC-LEG ටෝකන් අංකය ඇතුළත් කරන්න.' : 'Enter your 6-digit AWC-TKT or AWC-LEG token to check real-time progress.'}
              </p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
              <input
                type="text"
                required
                value={searchToken}
                onChange={(e) => setSearchToken(e.target.value)}
                placeholder="AWC-TKT-XXXXXX"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono uppercase"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition"
              >
                Track
              </button>
            </form>

            {loading && (
              <div className="py-6 text-center text-xs text-slate-500">
                Searching ticket ledger...
              </div>
            )}

            {!loading && searched && !ticketResult && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300 text-center">
                Token not found. Please double-check your code or verify it has synced from your submission email.
              </div>
            )}

            {!loading && ticketResult && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-mono font-bold text-slate-500">{ticketResult.token}</span>
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {ticketResult.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                  <div><strong>Type:</strong> {ticketResult.type}</div>
                  <div><strong>Jurisdiction:</strong> {ticketResult.district || 'National'}</div>
                </div>

                {/* Master Case Linking & Updates */}
                {ticketResult.assignedCaseId && (
                  <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 space-y-1 mt-2">
                    <div className="font-bold text-blue-900 dark:text-blue-200 text-xs flex items-center space-x-1.5">
                      <i data-lucide="folder-check" className="w-3.5 h-3.5 text-blue-600"></i>
                      <span>Master Case: {ticketResult.caseTitle || ticketResult.assignedCaseId}</span>
                    </div>
                    {ticketResult.latestMilestone ? (
                      <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed pt-1">
                        <strong>Latest Case Update ({ticketResult.milestoneDate || 'Recent'}):</strong> {ticketResult.latestMilestone}
                      </p>
                    ) : (
                      <p className="text-[10px] text-blue-600 dark:text-blue-400">
                        Bundled into master case proceedings. Judicial updates will stream here.
                      </p>
                    )}
                  </div>
                )}

                <div className="text-[11px] text-slate-500 pt-1">
                  Logged At: {new Date(ticketResult.createdAt).toLocaleString()}
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-right">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }

    // --- Sub-Component: Emergency Triage Modal ---
    function EmergencyTriageModal({ lang, onClose }) {
      return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative my-8">
            <button 
              type="button"
              onClick={onClose} 
              className="absolute top-5 right-5 inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700"
            >
              <i data-lucide="x" className="w-4 h-4"></i>
              <span>Cancel</span>
            </button>

            <div className="mb-6 pr-20">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                First-Response Safety Protocol
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {lang === 'si' ? 'හදිසි අවස්ථා සහ ප්‍රථමාධාර මාර්ගෝපදේශය' : 'Emergency Triage & Safety Protocol'}
              </h3>
            </div>

            <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40">
                <div className="font-bold text-red-900 dark:text-red-300 text-sm mb-1">1. Active Physical Violence or Assault in Progress</div>
                <p>Do NOT engage in violent physical confrontation with perpetrators. Film from a secure distance, note vehicle registration plates, and immediately contact your local Police Station OIC.</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
                <div className="font-bold text-amber-900 dark:text-amber-300 text-sm mb-1">2. Suspected Poisoning (වස දීම)</div>
                <p>Rush the animal immediately to the nearest Veterinary Surgeon. Do NOT induce vomiting if the animal is convulsing or unconscious. Preserve any suspected bait containers, food remains, or vomit in clean sealed bags as forensic court exhibits.</p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40">
                <div className="font-bold text-blue-900 dark:text-blue-300 text-sm mb-1">3. Road Traffic Accident / Fractured Limb</div>
                <p>Gently immobilize the animal using a clean towel or flat board to prevent spinal shock. Muzzle gently if fearful, and transport directly to a private or government veterinary clinic.</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-right">
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }

    // --- Sub-Component: Sample Complaint Draft Modal (Trilingual) ---
    function SampleComplaintDraftModal({ lang, onClose }) {
      const [sampleLang, setSampleLang] = useState(lang || 'si');
      const [copied, setCopied] = useState(false);

      const copyToClipboard = () => {
        const text = document.getElementById('sample-complaint-text').innerText;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      };

      return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative my-8">
            <button 
              type="button"
              onClick={onClose} 
              className="absolute top-5 right-5 inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700"
            >
              <i data-lucide="x" className="w-4 h-4"></i>
              <span>Cancel</span>
            </button>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 pr-24">
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Drafting Guide
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {sampleLang === 'si' ? 'පැමිණිල්ලක් සැකසිය යුතු ආදර්ශ ආකෘතිය' : sampleLang === 'ta' ? 'மாதிரி முறைப்பாடு படிவம்' : 'Sample Formal Complaint Format'}
                </h3>
              </div>

              {/* Language Switcher for Sample */}
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs font-bold">
                <button onClick={() => setSampleLang('si')} className={\`px-2 py-1 rounded \${sampleLang === 'si' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow' : ''}\`}>සිංහල</button>
                <button onClick={() => setSampleLang('en')} className={\`px-2 py-1 rounded \${sampleLang === 'en' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow' : ''}\`}>English</button>
                <button onClick={() => setSampleLang('ta')} className={\`px-2 py-1 rounded \${sampleLang === 'ta' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow' : ''}\`}>தமிழ்</button>
              </div>
            </div>

            {/* Template Display */}
            <div id="sample-complaint-text" className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-line leading-relaxed max-h-[55vh] overflow-y-auto">
              {sampleLang === 'si' && \`දිනය: 2026 අගෝස්තු 20

ස්ථානාධිපතිතුමා, පොලිස් ස්ථානය / සත්ව සුබසාධන සන්ධානය (AWC)

ගරු මහත්මයා/මහත්මිය,

පැමිණිල්ල: වීදි සුනඛයෙකුට අමානුෂික ලෙස පහර දීම සම්බන්ධවයි.

මහරගම, පන්සල පාර, අංක 15 ලිපිනයේ පදිංචි කේ. ඒ. නිමල් වන මා විසින් මෙම පැමිණිල්ල ඉදිරිපත් කරමි.

සිදුවීමේ විස්තරය:
2026 අගෝස්තු 20 වන දින උදෑසන 10.00 ට පමණ මහරගම, පන්සල පාරේදී මාගේ අසල්වැසි නිවසක පදිංචි පුද්ගලයෙකු විසින් පාරේ ගමන් කරමින් සිටි අසරණ වීදි සුනඛයෙකුට කිසිදු හේතුවක් නොමැතිව යකඩ පොල්ලකින් අමානුෂික ලෙස පහර දෙන ලදී. ඉන් සතාගේ පසුපස පාදයකට දැඩි ලෙස තුවාල සිදුවී ඇති අතර, සතා මේ වන විටත් නැගිටගත නොහැකිව එම ස්ථානයේම අසරණව සිටී.

සැකකරු පිළිබඳ තොරතුරු:
නම: සුනිල් ප්‍රනාන්දු (අල්ලපු ගෙදර පුද්ගලයා)
ලිපිනය: අංක 17, පන්සල පාර, මහරගම.

සාක්ෂි:
මෙම පහරදීම සිදුවන අවස්ථාවේදී මාගේ ජංගම දුරකථනයෙන් පටිගත කරගත් වීඩියෝවක් සහ තුවාල වූ සතාගේ ඡායාරූප කිහිපයක් මෙම ටෝකන් අංකය සඳහන් කරමින් awcsrilanka@gmail.com වෙත යොමු කරමි. මීට අමතරව තවත් අසල්වැසියන් දෙදෙනෙකුද මෙම සිදුවීම දුටු බව වැඩිදුරටත් දන්වා සිටිමි.

කරුණාකර මේ සම්බන්ධයෙන් සොයාබලා 1907 අංක 13 දරන සත්ව හිංසා ආඥාපනත යටතේ අදාළ නීතිමය පියවර ගැනීමට සහය වන ලෙස කාරුණිකව ඉල්ලා සිටිමි.

මෙයට විශ්වාසී,
(අත්සන)
නම: කේ. ඒ. නිමල්
දුරකථන අංකය: 07X XXX XXXX
ලිපිනය: අංක 15, පන්සල පාර, මහරගම.\`}

              {sampleLang === 'en' && \`Date: August 20, 2026

To: Officer-in-Charge, Police Station / Animal Welfare Coalition (AWC)

Dear Sir / Madam,

Complaint: Inhumane and Cruel Assault on a Community Street Dog.

I, K. A. Nimal, residing at No. 15, Pansala Road, Maharagama, hereby lodge this formal complaint.

Incident Description:
On August 20, 2026, at approximately 10:00 AM along Pansala Road, Maharagama, a resident from a neighbouring house brutally struck a helpless community street dog walking on the road with an iron rod without any provocation. As a direct result of this assault, the animal suffered severe traumatic injury to its hind leg and is currently unable to stand, lying helpless at the scene.

Suspect Information:
Name: Sunil Fernando
Address: No. 17, Pansala Road, Maharagama.

Evidence:
I recorded clear video footage of this assault on my mobile telephone and captured photographs of the injured animal, which I am forwarding to awcsrilanka@gmail.com quoting my ticket reference. In addition, two neighbouring residents witnessed this assault and are prepared to provide statements.

I kindly request that you initiate immediate statutory investigations under Section 2 and Section 12 of the Prevention of Cruelty to Animals Ordinance No. 13 of 1907 and Penal Code Section 411.

Yours faithfully,
(Signature)
Name: K. A. Nimal
Telephone: 07X XXX XXXX
Address: No. 15, Pansala Road, Maharagama.\`}

              {sampleLang === 'ta' && \`திகதி: 20 ஆகஸ்ட் 2026

நிலையப் பொறுப்பதிகாரி, பொலிஸ் நிலையம் / விலங்கு நலக் கூட்டணி (AWC)

மதிப்பிற்குரிய ஐயா/அம்மா,

முறைப்பாடு: வீதி நாய் ஒன்றின் மீதான கொடூரத் தாக்குதல் தொடர்பானது.

மகரகம, பன்சல வீதி, இலக்கம் 15 இல் வசிக்கும் கே. ஏ. நிமால் ஆகிய நான் இம்முறைப்பாட்டை சமர்ப்பிக்கின்றேன்.

சம்பவ விபரம்:
2026 ஆகஸ்ட் 20 ஆம் திகதி காலை 10:00 மணியளவில் மகரகம பன்சல வீதியில், வீதியில் சென்ற அப்பாவி வீதி நாய் ஒன்றை அயல் வீட்டு நபர் ஒருவர் எவ்வித தூண்டுதலுமின்றி இரும்புக் கம்பியால் கொடூரமாகத் தாக்கினார். இதனால் அந்த விலங்கின் பின்னங்காலில் பலத்த காயம் ஏற்பட்டு, அதனால் எழும்ப முடியாமல் அதே இடத்தில் தவித்துக் கொண்டிருக்கிறது.

சந்தேகநபர் விபரம்:
பெயர்: சுனில் பெர்னாண்டோ
முகவரி: இல. 17, பன்சல வீதி, மகரகம.

சாட்சியங்கள்:
இத்தாக்குதல் இடம்பெற்ற போது எனது கையடக்கத் தொலைபேசியில் பதிவு செய்த வீடியோ மற்றும் காயமடைந்த விலங்கின் புகைப்படங்களை awcsrilanka@gmail.com இற்கு அனுப்பி வைக்கின்றேன். மேலும் இரு அயலவர்கள் இச்சம்பவத்தை நேரில் கண்ட சாட்சியாளர்களாக உள்ளனர்.

தயவுசெய்து 1907 ஆம் ஆண்டின் 13 ஆம் இலக்க விலங்கு வதைத் தடுப்புச் கட்டளைச் சட்டத்தின் கீழ் உரிய சட்ட நடவடிக்கை எடுக்குமாறு கேட்டுக்கொள்கிறேன்.

இங்ஙனம்,
(கையொப்பம்)
பெயர்: கே. ஏ. நிமால்
தொலைபேசி எண்: 07X XXX XXXX
முகவரி: இல. 15, பன்சல வீதி, மகரகம.\`}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {lang === 'si' ? 'මෙම ආකෘතිය පිටපත් කර ඔබගේ තොරතුරු සමඟ පොලීසියට භාරදෙන්න.' : 'Copy and adapt this text for your local police station.'}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
                >
                  {copied ? '✓ Copied' : 'Copy Text'}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // --- Sub-Component: SLVC Advisory Modal ---
    function SlvcModal({ lang, onClose }) {
      return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative my-8">
            <button 
              type="button"
              onClick={onClose} 
              className="absolute top-5 right-5 inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700"
            >
              <i data-lucide="x" className="w-4 h-4"></i>
              <span>Cancel</span>
            </button>

            <div className="mb-6 pr-20">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Statutory Regulatory Advisory
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {lang === 'si' ? 'පශු වෛද්‍ය නොසැලකිලිමත්කම පිළිබඳ නෛතික ක්‍රියාපටිපාටිය' : 'Veterinary Medical Negligence Protocol (SLVC)'}
              </h3>
            </div>

            <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                Veterinary clinical malpractice, surgical negligence, and professional misconduct fall under the exclusive statutory authority of the <strong>Sri Lanka Veterinary Council (SLVC)</strong> established under the Veterinary Surgeons and Practitioners Act.
              </p>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-2">
                <div className="font-bold text-amber-900 dark:text-amber-300 text-sm">
                  Required Action Steps for Pet Owners:
                </div>
                <ul className="list-disc list-inside space-y-1.5">
                  <li><strong>Step 1:</strong> Prepare a formal written complaint with clinical timeline, veterinary diagnosis cards, receipts, and drug prescriptions.</li>
                  <li><strong>Step 2:</strong> Email the complete documentation directly to the SLVC Registrar: <span className="font-bold underline text-amber-900 dark:text-amber-200">registrarslvetcouncil@gmail.com</span></li>
                  <li><strong>Step 3:</strong> Record an Information Book (IB) entry at your local police station regarding property damage or fatal neglect.</li>
                  <li><strong>Step 4:</strong> If authorities or the clinic refuse an inquiry, forward your case documents to AWC for civil society guidance.</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-right">
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Mount React App
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>
`;

const outputPath = path.resolve(__dirname, '..', 'web', 'index.html');
fs.writeFileSync(outputPath, htmlContent, 'utf8');
console.log('Successfully wrote updated web/index.html (' + Buffer.byteLength(htmlContent, 'utf8') + ' bytes)');
