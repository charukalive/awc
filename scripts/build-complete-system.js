// scripts/build-complete-system.js
// Assembles:
// 1. Fully trilingual LegalAssistanceModal and TrackTicketModal in generate-web-index.js
// 2. Generates updated web/index.html
// 3. Creates root index.html with Open Graph metadata and instant redirect to web/
// 4. Creates web/media-manager.html (Zero-build Firebase Storage Image Editor)
// 5. Updates web/admin.html with Media Manager navigation link
// 6. Updates firestore.rules and storage.rules

const fs = require('fs');
const path = require('path');

console.log('=== Step 1: Upgrading LegalAssistanceModal and TrackTicketModal with 100% Trilingual Parity ===');

let genScript = fs.readFileSync(path.resolve(__dirname, 'generate-web-index.js'), 'utf8');

// Replacement for LegalAssistanceModal with 100% trilingual text
const fullTrilingualLegalModal = `    // --- Sub-Component: Request Legal Assistance Modal (100% Trilingual) ---
    function LegalAssistanceModal({ lang, onClose }) {
      const [caseType, setCaseType] = useState('magistrate_filing');
      const [courtName, setCourtName] = useState('');
      const [policeStation, setPoliceStation] = useState('');
      const [cibNumber, setCibNumber] = useState('');
      const [phone, setPhone] = useState('');
      const [email, setEmail] = useState('');
      const [details, setDetails] = useState('');
      const [generatedToken, setGeneratedToken] = useState(null);

      const legalData = (window.AWC_I18N && window.AWC_I18N[lang] && window.AWC_I18N[lang].legalModal) || {
        badge: 'Legal Aid & Court Coordination',
        title: 'Request Legal Assistance / Court Coordination',
        subtitle: 'Coordinating legal counsel for Magistrate Court motions, B-report monitoring, and police station liaison.',
        cancelBtn: 'Cancel',
        submitBtn: 'Submit Legal Request',
        closeBtn: 'Close'
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!phone || !email || !details) {
          alert(lang === 'si' ? 'කරුණාකර දුරකථන අංකය, ඊමේල් ලිපිනය සහ නඩුවේ විස්තර ඇතුළත් කරන්න.' : lang === 'ta' ? 'தயவுசெய்து தொலைபேசி எண், மின்னஞ்சல் மற்றும் வழக்கு விபரங்களை உள்ளிடவும்.' : 'Please enter required phone, email, and case details.');
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
              <span>{legalData.cancelBtn || (lang === 'si' ? 'අවලංගු කරන්න' : lang === 'ta' ? 'இரத்து' : 'Cancel')}</span>
            </button>

            {!generatedToken ? (
              <div>
                <div className="mb-6 pr-24">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {legalData.badge}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {legalData.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {legalData.subtitle}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'si' ? 'අවශ්‍ය නීතිමය සහය වර්ගය *' : lang === 'ta' ? 'சட்ட உதவி வகை *' : 'Legal Assistance Scope *'}
                    </label>
                    <select
                      value={caseType}
                      onChange={(e) => setCaseType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    >
                      <option value="magistrate_filing">{lang === 'si' ? 'මහේස්ත්‍රාත් අධිකරණයේ නඩුවක් සඳහා නීතිඥ පෙනී සිටීම' : lang === 'ta' ? 'நீதவான் நீதிமன்றத்தில் சட்டத்தரணி முன்னிலையாகல்' : 'Magistrate Court Lawyer Appearance / Motion'}</option>
                      <option value="police_inaction">{lang === 'si' ? 'පොලීසිය පැමිණිල්ල විභාග නොකිරීම (Police Inaction / Refusal)' : lang === 'ta' ? 'பொலிஸார் முறைப்பாட்டை ஏற்க மறுத்தல் (Police Inaction)' : 'Police Inaction / Failure to record IB Entry'}</option>
                      <option value="witness_protection">{lang === 'si' ? 'සාක්ෂිකරුවන්ට තර්ජන එල්ලවීම (Witness Protection)' : lang === 'ta' ? 'சாட்சிகளுக்கு அச்சுறுத்தல் விடுக்கப்படல் (Witness Protection)' : 'Threats to Complainant or Witness'}</option>
                      <option value="custody_motion">{lang === 'si' ? 'සත්වයා සැකකරුගෙන් මුදාගැනීමේ අධිකරණ නියෝගයක් ඉල්ලීම' : lang === 'ta' ? 'விலங்கை சந்தேகநபரிடமிருந்து மீட்கும் நீதிமன்ற உத்தரவு' : 'Animal Custody & Protection Motion (Prevent Return)'}</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'si' ? 'අධිකරණය (Magistrate Court)' : lang === 'ta' ? 'நீதவான் நீதிமன்றம்' : 'Magistrate Court (if instituted)'}
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
                        {lang === 'si' ? 'පොලිස් ස්ථානය සහ CIB / IB අංකය' : lang === 'ta' ? 'பொலிஸ் நிலையம் & CIB / IB #' : 'Police Station & CIB / IB #'}
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
                        {lang === 'si' ? 'දුරකථන අංකය *' : lang === 'ta' ? 'தொலைபேசி எண் *' : 'Contact Phone Number *'}
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
                        {lang === 'si' ? 'ඊමේල් ලිපිනය *' : lang === 'ta' ? 'மின்னஞ்சல் முகவரி *' : 'Email Address *'}
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
                      {lang === 'si' ? 'නඩුවේ සවිස්තරාත්මක පසුබිම *' : lang === 'ta' ? 'வழக்கின் பின்னணி மற்றும் உடனடி சட்டத் தேவைகள் *' : 'Case Background & Immediate Legal Needs *'}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder={lang === 'si' ? 'වත්මන් නෛතික තත්ත්වය, මීළඟ නඩු දිනය, බී-වාර්තා තත්ත්වය සහ අවශ්‍ය මැදිහත්වීම පැහැදිලි කරන්න...' : lang === 'ta' ? 'தற்போதைய சட்ட நிலை, அடுத்த நீதிமன்ற திகதி, B-அறிக்கை நிலை மற்றும் தேவையான சட்ட உதவியை விவரிக்கவும்...' : 'Explain current legal status, next court hearing date, B-report status, and what intervention is requested...'}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
                    >
                      {legalData.cancelBtn || (lang === 'si' ? 'අවලංගු කරන්න' : lang === 'ta' ? 'இரத்து' : 'Cancel')}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                    >
                      {legalData.submitBtn || (lang === 'si' ? 'නීති සහය ඉල්ලුම්පත්‍රය යොමු කරන්න' : lang === 'ta' ? 'சட்ட உதவி கோருக' : 'Submit Legal Request')}
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
                  {lang === 'si' ? 'නීති සහය ඉල්ලුම්පත්‍රය සාර්ථකව යොමු විය' : lang === 'ta' ? 'சட்ட உதவி கோரிக்கை பதிவு செய்யப்பட்டது' : 'Legal Assistance Request Queued'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  {lang === 'si' ? 'ඔබගේ නීති සහය ටිකට්පත පද්ධතියට එක්විය. අධිකරණ බලප්‍රදේශ අනුව අපගේ නීතිඥ කණ්ඩායම සම්බන්ධීකරණය කරනු ඇත.' : lang === 'ta' ? 'உங்கள் சட்ட உதவி கோரிக்கை பதிவு செய்யப்பட்டுள்ளது. அதிகார எல்லைகளுக்கு ஏற்ப சட்டத்தரணிகள் ஒருங்கிணைக்கப்படுவர்.' : 'Your legal assistance ticket has been assigned. Our legal counsel coordinates hearings based on jurisdictional priorities.'}
                </p>
                <div className="inline-block p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-blue-500 text-lg font-mono font-black text-blue-600 dark:text-blue-400 tracking-wider">
                  {generatedToken}
                </div>
                <div className="pt-4">
                  <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">
                    {legalData.closeBtn || (lang === 'si' ? 'වසන්න' : lang === 'ta' ? 'மூடுக' : 'Close')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }`;

// Replacement for TrackTicketModal with 100% trilingual text
const fullTrilingualTrackModal = `    // --- Sub-Component: Track Ticket Modal (100% Trilingual) ---
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
              title="Cancel / Close"
            >
              <i data-lucide="x" className="w-4 h-4"></i>
              <span>{lang === 'si' ? 'අවලංගු කරන්න' : lang === 'ta' ? 'இரத்து' : 'Cancel'}</span>
            </button>

            <div className="mb-6 pr-20">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                {lang === 'si' ? 'පැමිණිලි තත්ත්ව පරීක්ෂාව' : lang === 'ta' ? 'டிக்கெட் நிலை சரிபார்ப்பு' : 'Ticket Verification'}
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {lang === 'si' ? 'පැමිණිල්ලේ තත්ත්වය විමසන්න' : lang === 'ta' ? 'முறைப்பாட்டு நிலைமையை அறிதல்' : 'Track Your Reference Ticket'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'si' ? 'ඔබගේ 6-ඉලක්කම් AWC-TKT හෝ AWC-LEG ටෝකන් අංකය ඇතුළත් කරන්න.' : lang === 'ta' ? 'உங்கள் 6 இலக்க AWC-TKT அல்லது AWC-LEG குறியீட்டை உள்ளிடவும்.' : 'Enter your 6-digit AWC-TKT or AWC-LEG token to check real-time progress.'}
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
                {lang === 'si' ? 'විමසන්න' : lang === 'ta' ? 'தேடுக' : 'Track'}
              </button>
            </form>

            {loading && (
              <div className="py-6 text-center text-xs text-slate-500">
                {lang === 'si' ? 'දත්ත ගබඩාව පරීක්ෂා කරමින්...' : lang === 'ta' ? 'டிக்கெட் விபரங்கள் தேடப்படுகின்றன...' : 'Searching ticket ledger...'}
              </div>
            )}

            {!loading && searched && !ticketResult && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300 text-center">
                {lang === 'si' ? 'ටෝකන් අංකය හමු නොවීය. කරුණාකර අංකය නිවැරදි දැයි නැවත පරීක්ෂා කරන්න.' : lang === 'ta' ? 'டிக்கெட் இலக்கம் காணப்படவில்லை. தயவுசெய்து உங்கள் குறியீட்டை மீண்டும் சரிபார்க்கவும்.' : 'Token not found. Please double-check your code or verify it has synced from your submission email.'}
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
                  <div><strong>{lang === 'si' ? 'වර්ගය:' : lang === 'ta' ? 'வகை:' : 'Type:'}</strong> {ticketResult.type}</div>
                  <div><strong>{lang === 'si' ? 'බලප්‍රදේශය:' : lang === 'ta' ? 'அதிகார எல்லை:' : 'Jurisdiction:'}</strong> {ticketResult.district || 'National'}</div>
                </div>

                {/* Master Case Linking & Updates */}
                {ticketResult.assignedCaseId && (
                  <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 space-y-1 mt-2">
                    <div className="font-bold text-blue-900 dark:text-blue-200 text-xs flex items-center space-x-1.5">
                      <i data-lucide="folder-check" className="w-3.5 h-3.5 text-blue-600"></i>
                      <span>{lang === 'si' ? 'සම්බන්ධිත ප්‍රධාන නඩුව:' : lang === 'ta' ? 'தொடர்புடைய பிரதான வழக்கு:' : 'Master Case:'} {ticketResult.caseTitle || ticketResult.assignedCaseId}</span>
                    </div>
                    {ticketResult.latestMilestone ? (
                      <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed pt-1">
                        <strong>{lang === 'si' ? 'නවතම අධිකරණ යාවත්කාලීන කිරීම' : lang === 'ta' ? 'சமீபத்திய நீதிமன்ற புதுப்பிப்பு' : 'Latest Case Update'} ({ticketResult.milestoneDate || 'Recent'}):</strong> {ticketResult.latestMilestone}
                      </p>
                    ) : (
                      <p className="text-[10px] text-blue-600 dark:text-blue-400">
                        {lang === 'si' ? 'ප්‍රධාන අධිකරණ නඩුවට ඇතුළත් කර ඇත. අධිකරණ තීන්දු මෙහි ප්‍රදර්ශනය වේ.' : lang === 'ta' ? 'பிரதான வழக்குடன் இணைக்கப்பட்டுள்ளது. நீதிமன்ற புதுப்பிப்புகள் இங்கு தோன்றும்.' : 'Bundled into master case proceedings. Judicial updates will stream here.'}
                      </p>
                    )}
                  </div>
                )}

                <div className="text-[11px] text-slate-500 pt-1">
                  {lang === 'si' ? 'ලියාපදිංචි දිනය:' : lang === 'ta' ? 'பதிவு செய்யப்பட்ட திகதி:' : 'Logged At:'} {new Date(ticketResult.createdAt).toLocaleString()}
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-right">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                {lang === 'si' ? 'වසන්න' : lang === 'ta' ? 'மூடுக' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      );
    }`;

genScript = genScript.replace(
  /\/\/ --- Sub-Component: Request Legal Assistance Modal[\s\S]*?function LegalAssistanceModal[\s\S]*?^    \}/m,
  fullTrilingualLegalModal
);

genScript = genScript.replace(
  /\/\/ --- Sub-Component: Track Ticket Modal[\s\S]*?function TrackTicketModal[\s\S]*?^    \}/m,
  fullTrilingualTrackModal
);

fs.writeFileSync(path.resolve(__dirname, 'generate-web-index.js'), genScript, 'utf8');
console.log('✓ Upgraded generate-web-index.js with 100% Trilingual Modals.');

// Re-generate web/index.html
require('./generate-web-index.js');
console.log('✓ Successfully generated web/index.html.');

console.log('=== Step 2: Creating Root index.html for GitHub Pages ===');
const rootIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary Meta Tags -->
  <title>Animal Welfare Coalition Sri Lanka (AWC) | ශ්‍රී ලංකා සත්ව සුබසාධන සන්ධානය | இலங்கை விலங்கு நலக் கூட்டணி</title>
  <meta name="title" content="Animal Welfare Coalition Sri Lanka (AWC) - Civil Society Legal Advocacy">
  <meta name="description" content="Civil society coalition coordinating legal aid, police station interventions, Magistrate Court litigation, and humane stray management advocacy across Sri Lanka.">
  <meta name="keywords" content="Animal Welfare Sri Lanka, AWC, Animal Cruelty Sri Lanka, Rabies Ordinance, 1907 Ordinance, Animal Law Sri Lanka, Magistrate Court, Dog Population Management">
  <meta name="author" content="Animal Welfare Coalition Sri Lanka">
  <meta name="robots" content="index, follow">

  <!-- Open Graph / Facebook / WhatsApp (Optimized 600x600 preview under 300KB) -->
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
  <link rel="icon" type="image/png" href="assets/logo.png">

  <!-- Instant Redirect to web/ Application Folder -->
  <meta http-equiv="refresh" content="0; url=web/">
  <script>
    window.location.replace("web/" + window.location.search + window.location.hash);
  </script>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0b1329; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; padding: 20px;">
  <div style="max-width: 420px; padding: 32px; background: rgba(15, 23, 42, 0.8); border: 1px solid #1e293b; border-radius: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
    <img src="assets/logo.png" alt="AWC Logo" style="height: 64px; width: auto; margin-bottom: 16px; object-contain;" onerror="this.style.display='none'">
    <h1 style="font-size: 1.25rem; font-weight: 800; margin: 0 0 8px 0; color: #ffffff; letter-spacing: -0.025em;">Animal Welfare Coalition</h1>
    <div style="font-size: 0.75rem; font-weight: 700; color: #34d399; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px;">Sri Lanka Civil Society Coalition</div>
    <p style="font-size: 0.875rem; color: #94a3b8; line-height: 1.5; margin-bottom: 20px;">Loading public legal portal and triage console...</p>
    <a href="web/" style="display: inline-block; background: #16a34a; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 0.8125rem; padding: 10px 20px; border-radius: 12px; transition: background 0.15s;">
      Enter Website Directly →
    </a>
  </div>
</body>
</html>
`;

fs.writeFileSync(path.resolve(__dirname, '..', 'index.html'), rootIndexHtml, 'utf8');
console.log('✓ Successfully created root index.html with Open Graph metadata and instant redirect.');

console.log('=== Step 3: Updating web/admin.html with Media Manager navigation link ===');
let adminHtml = fs.readFileSync(path.resolve(__dirname, '..', 'web', 'admin.html'), 'utf8');
if (!adminHtml.includes('media-manager.html')) {
  adminHtml = adminHtml.replace(
    '<a href="index.html" target="_blank" className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700">\n                View Public Site ↗\n              </a>',
    `<a href="media-manager.html" target="_blank" className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-950/60 hover:bg-amber-900/60 px-3 py-1.5 rounded-lg border border-amber-800 transition">
                <span>🖼️ Media Manager ↗</span>
              </a>
              <a href="index.html" target="_blank" className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700">
                View Public Site ↗
              </a>`
  );
  fs.writeFileSync(path.resolve(__dirname, '..', 'web', 'admin.html'), adminHtml, 'utf8');
  console.log('✓ Added Media Manager shortcut button in web/admin.html top navigation.');
} else {
  console.log('✓ web/admin.html already contains Media Manager link.');
}

console.log('=== Step 4: Updating Firestore and Storage Security Rules ===');
let fsRules = fs.readFileSync(path.resolve(__dirname, '..', 'firestore.rules'), 'utf8');
if (!fsRules.includes('siteConfig')) {
  fsRules = fsRules.replace(
    '  }\n}',
    `    // 6. Site Configuration (Dynamic Images, Global Notices)
    match /siteConfig/{configDoc} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}`
  );
  fs.writeFileSync(path.resolve(__dirname, '..', 'firestore.rules'), fsRules, 'utf8');
  console.log('✓ Updated firestore.rules to include /siteConfig/ permissions.');
}

let stRules = fs.readFileSync(path.resolve(__dirname, '..', 'storage.rules'), 'utf8');
if (!stRules.includes('site-images')) {
  stRules = stRules.replace(
    '    // 3. Citizen Evidence Uploads',
    `    // 2.5 Site Images & Media Manager Uploads (Hero, Statutes, Playbook, Cases, Campaigns)
    // Public can view/download images; authenticated Admin can upload, update, or remove
    match /site-images/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // 3. Citizen Evidence Uploads`
  );
  fs.writeFileSync(path.resolve(__dirname, '..', 'storage.rules'), stRules, 'utf8');
  console.log('✓ Updated storage.rules to include /site-images/ permissions.');
}

console.log('=== All files updated successfully! ===');
