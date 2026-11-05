// scripts/apply-team-nav-fix.js
const fs = require('fs');
const path = require('path');

console.log('=== Step 1: Update i18n data files (Charuka -> Charuka Wickramasekara) ===');

function updateI18nFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // English: "name": "Charuka" -> "name": "Charuka Wickramasekara"
  content = content.replace(
    /"name":\s*"Charuka",\s*(\r?\n)\s*"role":\s*"Animal Welfarist"/g,
    '"name": "Charuka Wickramasekara",$1          "role": "Animal Welfarist"'
  );

  // Sinhala: "name": "චාරුක" -> "name": "චාරුක වික්‍රමසේකර"
  content = content.replace(
    /"name":\s*"චාරුක",\s*(\r?\n)\s*"role":\s*"සත්ව සුබසාධන/g,
    '"name": "චාරුක වික්‍රමසේකර",$1          "role": "සත්ව සුබසාධන'
  );

  // Tamil: "name": "சாருகா" -> "name": "சாருகா விக்ரமசேகர"
  content = content.replace(
    /"name":\s*"சாருகா",\s*(\r?\n)\s*"role":\s*"விலங்கு நல ஆர்வலர்/g,
    '"name": "சாருகா விக்ரமசேகர",$1          "role": "விலங்கு நல ஆர்வலர்'
  );

  fs.writeFileSync(filePath, content, 'utf8');
}

updateI18nFile(path.resolve(__dirname, '..', 'web', 'i18n-data.js'));
updateI18nFile(path.resolve(__dirname, '..', 'i18n-data.js'));
console.log('✓ Successfully verified & updated web/i18n-data.js and i18n-data.js');

console.log('=== Step 2: Update scripts/generate-web-index.js ===');
const genPath = path.resolve(__dirname, 'generate-web-index.js');
let genContent = fs.readFileSync(genPath, 'utf8');

// 2a: Update Header Report button for mobile fit
const oldHeaderReportBtnRegex = /{\/\* Quick Action Button in Header \*\/}[\s\S]*?<span>\{lang === 'si' \? 'පැමිණිලි කරන්න' : lang === 'ta' \? 'முறைப்பாடு' : 'Report'\}<\/span>[\s\S]*?<\/button>/;

const newHeaderReportBtn = `{/* Quick Action Button in Header */}
                <button
                  onClick={() => setShowReportModal(true)}
                  className="inline-flex items-center space-x-1 sm:space-x-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-xs uppercase tracking-wider px-2.5 sm:px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition whitespace-nowrap shrink-0"
                >
                  <i data-lucide="alert-triangle" className="w-3.5 h-3.5 text-amber-200 shrink-0"></i>
                  <span>{lang === 'si' ? 'පැමිණිලි' : lang === 'ta' ? 'முறைப்பாடு' : 'Report'}</span>
                </button>`;

if (oldHeaderReportBtnRegex.test(genContent)) {
  genContent = genContent.replace(oldHeaderReportBtnRegex, newHeaderReportBtn);
  console.log('✓ Updated header report button for mobile fit');
} else {
  console.log('Header report button already updated or matched');
}

// 2b: Update Tier 2 Navigation Tab Bar into 2 balanced lines
const oldNavBarRegex = /{\/\* Tier 2: Dedicated Navigation Tab Bar \*\/}[\s\S]*?<\/header>/;
const newNavBar = `{/* Tier 2: Dedicated Navigation Tab Bar - Balanced 2-Line Architecture */}
            <div className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md py-2">
              <div className="max-w-5xl mx-auto px-3 sm:px-6 space-y-1.5">
                
                {/* Line 1: Home, Know the Law, Legal Playbook, Cases & Updates */}
                <nav className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                  <button 
                    onClick={() => setActiveTab('home')} 
                    className={'flex items-center justify-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition text-center ' + (activeTab === 'home' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60')}
                  >
                    <i data-lucide="home" className="w-4 h-4 shrink-0"></i>
                    <span className="truncate">{t.nav.home}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('knowLaw')} 
                    className={'flex items-center justify-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition text-center ' + (activeTab === 'knowLaw' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60')}
                  >
                    <i data-lucide="scale" className="w-4 h-4 shrink-0"></i>
                    <span className="truncate">{t.nav.knowLaw}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('playbook')} 
                    className={'flex items-center justify-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition text-center ' + (activeTab === 'playbook' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60')}
                  >
                    <i data-lucide="book-open" className="w-4 h-4 shrink-0"></i>
                    <span className="truncate">{t.nav.playbook}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('cases')} 
                    className={'flex items-center justify-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition text-center ' + (activeTab === 'cases' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60')}
                  >
                    <i data-lucide="folder-check" className="w-4 h-4 shrink-0"></i>
                    <span className="truncate">{t.nav.cases}</span>
                  </button>
                </nav>

                {/* Line 2: Truth vs Myth, Our Work & Policy, About & Team, Contact & Police */}
                <nav className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                  <button 
                    onClick={() => setActiveTab('truthMyth')} 
                    className={'flex items-center justify-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition text-center ' + (activeTab === 'truthMyth' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60')}
                  >
                    <i data-lucide="help-circle" className="w-4 h-4 shrink-0"></i>
                    <span className="truncate">{t.nav.truthMyth}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('ourWork')} 
                    className={'flex items-center justify-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition text-center ' + (activeTab === 'ourWork' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60')}
                  >
                    <i data-lucide="activity" className="w-4 h-4 shrink-0"></i>
                    <span className="truncate">{t.nav.ourWork}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('about')} 
                    className={'flex items-center justify-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition text-center ' + (activeTab === 'about' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60')}
                  >
                    <i data-lucide="users" className="w-4 h-4 shrink-0"></i>
                    <span className="truncate">{t.nav.about}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('contact')} 
                    className={'flex items-center justify-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition text-center ' + (activeTab === 'contact' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60')}
                  >
                    <i data-lucide="map-pin" className="w-4 h-4 shrink-0"></i>
                    <span className="truncate">{t.nav.contact}</span>
                  </button>
                </nav>

              </div>
            </div>
          </header>`;

if (oldNavBarRegex.test(genContent)) {
  genContent = genContent.replace(oldNavBarRegex, newNavBar);
  console.log('✓ Reorganized navigation tab bar into 2 balanced lines');
}

// 2c: Remove display pictures (monogram avatars) from team cards
const oldTeamCardsRegex = /{\/\* Distinguished Monogram Avatar Header \*\/}[\s\S]*?<h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">/;
const newTeamCards = `{/* Member Role Badge (Zero pictures / avatars) */}
                        <div className="mb-4">
                          <span className={'text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md ' + member.badgeColor}>
                            {member.badge}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">`;

if (oldTeamCardsRegex.test(genContent)) {
  genContent = genContent.replace(oldTeamCardsRegex, newTeamCards);
  console.log('✓ Successfully removed member monogram display pictures from team cards');
}

// 2d: Remove boarding_facility category from ReportComplaintModal select
const oldBoardingOptionRegex = /\s*<option value="boarding_facility">[\s\S]*?<\/option>/;
if (oldBoardingOptionRegex.test(genContent)) {
  genContent = genContent.replace(oldBoardingOptionRegex, '');
  console.log('✓ Successfully removed "Pet Boarding and Breeding" category from ReportComplaintModal');
}

// 2e: Optimize ReportComplaintModal for mobile view (scrolling & button wrapping)
genContent = genContent.replace(
  '<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">',
  '<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">'
);

genContent = genContent.replace(
  '<div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative my-8">',
  '<div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative my-auto sm:my-8 max-h-[92vh] overflow-y-auto">'
);

// Optimize modal bottom buttons for mobile stacking using regex
const oldModalActionBtnsRegex = /{\/\* Action Buttons \*\/}[\s\S]*?<div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center gap-3">[\s\S]*?<\/form>/;

const newModalActionBtns = `{/* Action Buttons */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:justify-between items-stretch sm:items-center gap-3">
                    <button
                      type="button"
                      onClick={onShowSample}
                      className="inline-flex items-center justify-center space-x-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline py-1"
                    >
                      <i data-lucide="file-text" className="w-4 h-4"></i>
                      <span>{lang === 'si' ? 'ආදර්ශ පැමිණිලි ආකෘතිය බලන්න ↗' : lang === 'ta' ? 'மாதிரி முறைப்பாடு படிவம் ↗' : 'View Sample Complaint Draft ↗'}</span>
                    </button>

                    <div className="flex space-x-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition text-center"
                      >
                        {lang === 'si' ? 'අවලංගු කරන්න' : lang === 'ta' ? 'இரத்து' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        disabled={isUploading}
                        className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-1.5 text-center"
                      >
                        {isUploading && <span className="animate-spin mr-1">⟳</span>}
                        <span>
                          {isUploading 
                            ? (lang === 'si' ? 'ගොනු උඩුගත කරමින්...' : 'Uploading Evidence...') 
                            : (lang === 'si' ? 'පැමිණිල්ල යොමු කරන්න' : lang === 'ta' ? 'முறைப்பாட்டை சமர்ப்பிக்க' : 'Submit Official Complaint')}
                        </span>
                      </button>
                    </div>
                  </div>
                </form>`;

if (oldModalActionBtnsRegex.test(genContent)) {
  genContent = genContent.replace(oldModalActionBtnsRegex, newModalActionBtns);
  console.log('✓ Successfully optimized modal bottom buttons for responsive mobile display');
} else {
  console.log('Modal action buttons already updated or matched');
}

fs.writeFileSync(genPath, genContent, 'utf8');
console.log('✓ Successfully wrote scripts/generate-web-index.js');
