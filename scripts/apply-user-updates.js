// scripts/apply-user-updates.js
const fs = require('fs');
const path = require('path');

console.log('=== Step 1: Updating i18n-data.js (Sinhala Name & 400+ Involvements) ===');

function updateI18nFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Change සත්ව සුබසාධන සන්ධානය -> සත්ව සුබසාධන සංසදය everywhere
  content = content.replaceAll('සත්ව සුබසාධන සන්ධානය', 'සත්ව සුබසාධන සංසදය');

  // 2. Remove Crematorium in ourWork and replace with 400+ Legal Involvements within last 365 days
  content = content.replace(
    'In May 2026, AWC formally submitted a policy proposal to municipal and urban councils advocating the establishment of dedicated municipal companion animal crematoriums. Providing hygienic, affordable cremation services prevents deceased pets from being dumped in waterways, preserves public sanitation, and fosters dignified community compassion.',
    'Over the past 365 days, AWC legal counsel and field coordinators actively intervened in over 400 verified animal cruelty incidents across Sri Lanka—directing police station Information Book (IB) entries, Magistrate Court B-reports, animal rescue custody orders, and criminal prosecutions under the 1907 Ordinance and Penal Code.'
  );
  content = content.replace(
    '"title": "Municipal Canine Crematorium Initiative"',
    '"title": "400+ Animal Cruelty Legal Involvements within Last 365 Days"'
  );
  content = content.replace(
    '"badge": "Urban Environmental Sanitation"',
    '"badge": "Frontline Legal Enforcement"'
  );
  content = content.replace(
    'proposed municipal canine crematoriums in urban centers to provide dignified end-of-life care for companion and street animals.',
    'champions systematic sterilization, mass rabies vaccination, and strict veterinary standards for population management.'
  );

  // Sinhala
  content = content.replace(
    '"title": "නාගරික සුනඛ ආදාහනාගාර පිහිටුවීමේ යෝජනාව"',
    '"title": "පසුගිය දින 365 තුළ සත්ව හිංසා සිදුවීම් 400+ කට අධික නෛතික මැදිහත්වීම්"'
  );
  content = content.replace(
    '2026 මැයි මාසයේදී AWC විසින් මහනගර සභා වෙත නිල ප්‍රතිපත්ති ලේඛනයක් භාරදෙමින් මියයන සුරතල් සහ වීදි සතුන් සඳහා මානුෂීය සහ සනීපාරක්ෂක සුනඛ ආදාහනාගාර පිහිටුවීමට යෝජනා කරන ලදී. එමඟින් සිරුරු ජලාශවලට දැමීම වැළකී පරිසරය සුරැකේ.',
    'පසුගිය දින 365 තුළ දිවයින පුරා සත්ව හිංසා සහ කෲරත්ව සිදුවීම් 400 කට අධික සංඛ්‍යාවක් සඳහා AWC නීතිඥ කණ්ඩායම සහ ක්ෂේත්‍ර සම්බන්ධීකාරකවරුන් සෘජුව මැදිහත් විය. පොලිස් ස්ථානවල පැමිණිලි සටහන් කිරීම, මහේස්ත්‍රාත් අධිකරණවල බී-වාර්තා අධීක්ෂණය, සතුන් සැකකරුවන්ගෙන් මුදාගැනීමේ නියෝග සහ 1907 ආඥාපනත හා දණ්ඩ නීති සංග්‍රහය යටතේ නඩු පැවරීම් ඒ අතර වේ.'
  );
  content = content.replace(
    'සහ සුනඛ ආදාහනාගාර පිහිටුවීම වෙනුවෙන් පෙනී සිටීම.',
    'සහ විද්‍යාත්මක CNVR (එන්නත් හා වන්ධ්‍යාකරණ) වැඩසටහන් ක්‍රියාත්මක කිරීම වෙනුවෙන් AWC පෙනී සිටියි.'
  );

  // Tamil
  content = content.replace(
    '"title": "நகர்ப்புற செல்லப்பிராணிகளுக்கான மின் தகன மையங்கள் திட்டம்"',
    '"title": "கடந்த 365 நாட்களில் 400+ விலங்கு வதை சட்ட தலையீடுகள்"'
  );
  content = content.replace(
    'மற்றும் செல்லப்பிராணி தகன மையங்கள் அமைப்பதை வலியுறுத்துகிறது.',
    'மற்றும் முறையான CNVR (கருத்தடை மற்றும் தடுப்பூசி) திட்டங்களை நடைமுறைப்படுத்துவதை AWC வலியுறுத்துகிறது.'
  );

  fs.writeFileSync(filePath, content, 'utf8');
}

updateI18nFile(path.resolve(__dirname, '..', 'web', 'i18n-data.js'));
updateI18nFile(path.resolve(__dirname, '..', 'i18n-data.js'));
console.log('✓ Successfully updated web/i18n-data.js and i18n-data.js');

console.log('=== Step 2: Updating generate-web-index.js (Attachments, Links, Sinhala Name, Floating Facebook) ===');

let gen = fs.readFileSync(path.resolve(__dirname, 'generate-web-index.js'), 'utf8');

// Replace Sinhala coalition name everywhere
gen = gen.replaceAll('සත්ව සුබසාධන සන්ධානය', 'සත්ව සුබසාධන සංසදය');

// Add Floating Facebook Button right before the closing modals
const floatingFbButton = `
          {/* Floating Facebook Community Button with Pulsing Live Indicator */}
          <a 
            href="https://fb.com/awcsrilanka" 
            target="_blank" 
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-40 flex items-center space-x-2.5 bg-[#1877F2] hover:bg-[#0c63d4] text-white px-4 py-2.5 sm:py-3 rounded-full shadow-2xl shadow-blue-600/40 hover:shadow-blue-600/60 transition-all duration-200 transform hover:scale-105 border border-blue-400/30 group"
            title="Follow AWC on Facebook for Recent Updates"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <div className="text-left font-bold text-xs pr-1 leading-tight">
              <div className="text-[10px] uppercase font-extrabold tracking-wider text-blue-200">
                {lang === 'si' ? 'නවතම යාවත්කාලීන' : lang === 'ta' ? 'சமீபத்திய தகவல்' : 'Recent Updates'}
              </div>
              <div className="text-xs font-black">fb.com/awcsrilanka ↗</div>
            </div>
          </a>
`;

if (!gen.includes('fb.com/awcsrilanka ↗')) {
  gen = gen.replace(
    '{/* Modals with Clear, Prominent Cancel Buttons */}',
    floatingFbButton + '\n          {/* Modals with Clear, Prominent Cancel Buttons */}'
  );
}

// Find ReportComplaintModal definition
const reportModalMarkerStart = 'function ReportComplaintModal({ lang, onClose, onShowSample }) {';
const reportModalMarkerEnd = '// --- Sub-Component: Request Legal Assistance Modal';

const rStart = gen.indexOf(reportModalMarkerStart);
const rEnd = gen.indexOf(reportModalMarkerEnd);

if (rStart === -1 || rEnd === -1) {
  console.error('ReportComplaintModal markers not found!');
  process.exit(1);
}

const updatedReportComplaintModal = `function ReportComplaintModal({ lang, onClose, onShowSample }) {
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

      // Attachments & Evidence Links state
      const [evidenceLink, setEvidenceLink] = useState('');
      const [evidenceFiles, setEvidenceFiles] = useState([]);
      const [isUploading, setIsUploading] = useState(false);

      const isMedNegligence = category === 'medical_negligence';

      const handleFilesSelected = (e) => {
        const files = Array.from(e.target.files);
        const valid = files.filter(f => f.size <= 10 * 1024 * 1024);
        if (valid.length < files.length) {
          alert(lang === 'si' ? 'සමහර ගොනු 10MB සීමාව ඉක්මවා ඇති බැවින් ඉවත් කරන ලදී.' : lang === 'ta' ? 'சில கோப்புகள் 10MB இற்கு மேல் உள்ளதால் நீக்கப்பட்டன.' : 'Some files exceed the 10MB limit and were removed.');
        }
        setEvidenceFiles(valid);
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!phone || !email || !details) {
          alert(lang === 'si' ? 'කරුණාකර දුරකථන අංකය, ඊමේල් ලිපිනය සහ විස්තර ඇතුළත් කරන්න.' : lang === 'ta' ? 'தயவுசெய்து தொலைபேசி எண், மின்னஞ்சல் மற்றும் விபரங்களை உள்ளிடவும்.' : 'Please provide mandatory Phone Number, Email, and details.');
          return;
        }
        const token = 'AWC-TKT-' + Math.floor(100000 + Math.random() * 900000);
        
        // Upload direct files to Firebase Storage if available
        let uploadedAttachments = [];
        if (evidenceFiles.length > 0 && typeof firebase !== 'undefined' && firebase.storage) {
          setIsUploading(true);
          const storage = firebase.storage();
          for (let i = 0; i < evidenceFiles.length; i++) {
            const file = evidenceFiles[i];
            const ext = file.name.split('.').pop() || 'jpg';
            const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            const storagePath = 'evidence/' + token + '/' + Date.now() + '_' + cleanName;
            try {
              const snap = await storage.ref(storagePath).put(file, { contentType: file.type });
              const downloadUrl = await snap.ref.getDownloadURL();
              uploadedAttachments.push({
                name: file.name,
                url: downloadUrl,
                size: file.size
              });
            } catch (err) {
              console.warn("Attachment upload warning:", err);
            }
          }
          setIsUploading(false);
        }

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
          evidenceLink: evidenceLink.trim(),
          attachments: uploadedAttachments,
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
              hasEvidenceLink: Boolean(evidenceLink.trim()),
              attachmentCount: uploadedAttachments.length,
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
              <span>{lang === 'si' ? 'අවලංගු කරන්න' : lang === 'ta' ? 'இரத்து' : 'Cancel'}</span>
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

                  {/* ACTIVE FEATURE: Attachments & Cloud Links */}
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center justify-between">
                      <span className="flex items-center space-x-1.5">
                        <i data-lucide="paperclip" className="w-4 h-4 text-emerald-600"></i>
                        <span>{lang === 'si' ? 'සාක්ෂි ලේඛන සහ ඡායාරූප (Attachments & Links)' : lang === 'ta' ? 'சான்றாதாரங்கள் மற்றும் இணைப்புகள்' : 'Evidence Attachments & Cloud Links (Optional)'}</span>
                      </span>
                      <span className="text-[10px] font-normal text-slate-500">Max 10MB</span>
                    </div>

                    {/* Direct Upload (Photos/PDF) */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        {lang === 'si' ? 'ඡායාරූප / පශු වෛද්‍ය වාර්තා / ලේඛන (Direct Upload):' : lang === 'ta' ? 'புகைப்படங்கள் / மருத்துவ ஆவணங்கள் (நேரடி பதிவேற்றம்):' : 'Upload Photos / Veterinary Reports / Diagnosis Slips (PNG, JPG, PDF):'}
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*,application/pdf"
                        onChange={handleFilesSelected}
                        className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 dark:file:bg-emerald-950 file:text-emerald-800 dark:file:text-emerald-300 hover:file:bg-emerald-200 cursor-pointer"
                      />
                      {evidenceFiles.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                          <span>✓ {evidenceFiles.length} {lang === 'si' ? 'ගොනු තෝරාගෙන ඇත' : lang === 'ta' ? 'கோப்புகள் தேர்ந்தெடுக்கப்பட்டன' : 'file(s) selected'}:</span>
                          <span className="text-slate-500">({evidenceFiles.map(f => f.name).join(', ')})</span>
                        </div>
                      )}
                    </div>

                    {/* Cloud Link (Google Drive, YouTube, OneDrive, iCloud) */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        {lang === 'si' ? 'වීඩියෝ දර්ශන සහිත Google Drive / YouTube / Cloud සබැඳිය (Video Link):' : lang === 'ta' ? 'வீடியோ ஆதாரம் அடங்கிய Google Drive / YouTube / Cloud இணைப்பு:' : 'Video Footage / Cloud Folder Link (Google Drive, YouTube, OneDrive, iCloud):'}
                      </label>
                      <input
                        type="url"
                        value={evidenceLink}
                        onChange={(e) => setEvidenceLink(e.target.value)}
                        placeholder="https://drive.google.com/... or https://youtube.com/..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {lang === 'si' ? 'විශාල වීඩියෝ දර්ශන තිබේ නම්, Google Drive හෝ YouTube සබැඳිය මෙහි දක්වන්න.' : lang === 'ta' ? 'பெரிய வீடியோக்கள் இருப்பின் Google Drive அல்லது YouTube இணைப்பை இங்கு உள்ளிடவும்.' : 'For large high-resolution video footage, pasting a Google Drive link or YouTube unlisted video link is highly recommended.'}
                      </p>
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
                      <span>
                        {lang === 'si' ? 'අවශ්‍ය නම් මෙම සිදුවීම සාක්ෂි සහිතව මාධ්‍යයට හෝ සමාජ මාධ්‍ය වෙත මුදාහැරීමට මාගේ එකඟතාවය පළ කරමි.' : 'I grant consent to publish verified aspects of this complaint to social/civic media to protect the animal.'}
                      </span>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center gap-3">
                    <button
                      type="button"
                      onClick={onShowSample}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <i data-lucide="file-text" className="w-4 h-4"></i>
                      <span>{lang === 'si' ? 'ආදර්ශ පැමිණිලි ආකෘතිය බලන්න ↗' : lang === 'ta' ? 'மாதிரி முறைப்பாடு படிவம் ↗' : 'View Sample Complaint Draft ↗'}</span>
                    </button>

                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
                      >
                        {lang === 'si' ? 'අවලංගු කරන්න' : lang === 'ta' ? 'இரத்து' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        disabled={isUploading}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5"
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
                </form>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {lang === 'si' ? 'පැමිණිල්ල සාර්ථකව ලියාපදිංචි විය' : lang === 'ta' ? 'முறைப்பாடு வெற்றிகரமாக பதிவானது' : 'Complaint Successfully Logged'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  {lang === 'si' ? 'ඔබගේ පැමිණිල්ල රහස්‍ය පෝලිමට ඇතුළත් විය. ඉදිරි පරීක්ෂණ සහ නීතිමය ක්‍රියාමාර්ග සඳහා පහත ටෝකන් අංකය සුරක්ෂිතව තබාගන්න.' : 'Your incident report has been securely queued. Use the tracking token below to monitor police actions and legal docket progress.'}
                </p>
                <div className="inline-block p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-emerald-500 text-lg font-mono font-black text-emerald-600 dark:text-emerald-400 tracking-wider">
                  {generatedToken}
                </div>
                <div className="pt-4 flex justify-center space-x-2">
                  <button 
                    onClick={onClose} 
                    className="px-6 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs"
                  >
                    {lang === 'si' ? 'වසන්න' : lang === 'ta' ? 'மூடுக' : 'Close'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    `;

gen = gen.substring(0, rStart) + updatedReportComplaintModal + gen.substring(rEnd);

fs.writeFileSync(path.resolve(__dirname, 'generate-web-index.js'), gen, 'utf8');
console.log('✓ Successfully updated ReportComplaintModal in generate-web-index.js');

// Regenerate web/index.html
require('./generate-web-index.js');
console.log('✓ Regenerated web/index.html');

console.log('=== Step 3: Copying updated files to root ===');
fs.copyFileSync(path.resolve(__dirname, '..', 'web', 'index.html'), path.resolve(__dirname, '..', 'index.html'));
fs.copyFileSync(path.resolve(__dirname, '..', 'web', 'i18n-data.js'), path.resolve(__dirname, '..', 'i18n-data.js'));

console.log('=== Step 4: Verification with Babel Validator ===');
require('./test-babel-admin.js');
