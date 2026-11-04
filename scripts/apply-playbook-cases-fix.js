// scripts/apply-playbook-cases-fix.js
const fs = require('fs');
const path = require('path');

const genPath = path.resolve(__dirname, 'generate-web-index.js');
let gen = fs.readFileSync(genPath, 'utf8');

const startMarker = '{/* Tab: Legal Playbook */}';
const endMarker = '{/* Tab: Truth vs Myth */}';

const startIdx = gen.indexOf(startMarker);
const endIdx = gen.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

// Notice the double backslashes so generate-web-index.js gets \${...}
const replacement = `{/* Tab: Legal Playbook */}
            {activeTab === 'playbook' && (
              <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  {(t.playbook.sections || []).map((sec, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-4 mb-4">
                          <img 
                            src={getImage('playbook_' + sec.id, sec.image)} 
                            alt={sec.title} 
                            className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-sm"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          <div>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                              {sec.badge || sec.citation}
                            </span>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                              {sec.title}
                            </h3>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                          {sec.desc || sec.summary}
                        </p>

                        <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 mb-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                          {(sec.takeaways || sec.points || []).map((pt, pIdx) => (
                            <li key={pIdx} className="flex items-start space-x-2">
                              <span className="text-emerald-600 font-bold shrink-0">✓</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                        {Array.isArray(sec.takeaways) && sec.takeaways[0] ? sec.takeaways[0] : (sec.takeaway || sec.desc || '')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Verified Cases & Updates */}
            {activeTab === 'cases' && (
              <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  {(t.cases.list || []).map((c, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        <div className="md:col-span-4">
                          <img 
                            src={getImage('case_' + idx, c.image)} 
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
                          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{c.date || c.sections}</span>
                          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                            {c.title}
                          </h3>
                          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {c.desc || c.facts}
                          </p>

                          {c.focus && (
                            <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                                {lang === 'si' ? 'නීතිමය මැදිහත්වීම සහ නෛතික අවධානය:' : lang === 'ta' ? 'சட்ட உத்தி மற்றும் முக்கிய கவனம்:' : 'Legal Strategy & Precedent Focus:'}
                              </span>
                              <p className="text-emerald-700 dark:text-emerald-400 font-semibold leading-relaxed">
                                {c.focus}
                              </p>
                            </div>
                          )}

                          {c.action && !c.focus && (
                            <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                                {lang === 'si' ? 'නීතිමය මැදිහත්වීම:' : lang === 'ta' ? 'සட்ட நடவடிக்கை:' : 'AWC Legal Intervention:'}
                              </span>
                              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {c.action}
                              </p>
                            </div>
                          )}

                          {c.timeline && Array.isArray(c.timeline) && c.timeline.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold">
                              {c.timeline.map((step, sIdx) => (
                                <span key={sIdx} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                  {step}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            `;

gen = gen.substring(0, startIdx) + replacement + gen.substring(endIdx);
fs.writeFileSync(genPath, gen, 'utf8');
console.log('✓ Successfully replaced Playbook and Cases blocks in scripts/generate-web-index.js');

// Regenerate web/index.html
require('./generate-web-index.js');
console.log('✓ Regenerated web/index.html');
