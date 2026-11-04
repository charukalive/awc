// scripts/enrich-triage-i18n.js
// Adds full trilingual triage translations to web/i18n-data.js

const fs = require('fs');
const path = require('path');

const data = require('../web/i18n-data.js');

data.en.triage = {
  badge: "First-Response Safety Protocol",
  title: "Emergency Animal Triage & Safety Protocol",
  cancelBtn: "Cancel",
  closeBtn: "Close",
  rule1Title: "1. Active Physical Violence or Assault in Progress",
  rule1Desc: "Do NOT engage in violent physical confrontation with perpetrators. Film from a secure distance, note vehicle registration plates, and immediately contact your local Police Station OIC.",
  rule2Title: "2. Suspected Poisoning (වස දීම)",
  rule2Desc: "Rush the animal immediately to the nearest Veterinary Surgeon. Do NOT induce vomiting if the animal is convulsing or unconscious. Preserve any suspected bait containers, food remains, or vomit in clean sealed bags as forensic court exhibits.",
  rule3Title: "3. Road Traffic Accident / Fractured Limb",
  rule3Desc: "Gently immobilize the animal using a clean towel or flat board to prevent spinal shock. Muzzle gently if fearful, and transport directly to a private or government veterinary clinic."
};

data.si.triage = {
  badge: "හදිසි අවස්ථා සහ ප්‍රථමාධාර මාර්ගෝපදේශය",
  title: "හදිසි සත්ව ආපදා සහ ආරක්‍ෂිත පියවර",
  cancelBtn: "අවලංගු කරන්න",
  closeBtn: "වසන්න",
  rule1Title: "1. සතෙකුට පහරදීමක් හෝ ප්‍රචණ්ඩත්වයක් සිදුවෙමින් පවතින විට",
  rule1Desc: "කිසිවිටෙකත් ප්‍රචණ්ඩකාරී ලෙස පුද්ගලයන් සමඟ ගැටුමකට නොයන්න. ආරක්ෂිත දුරක සිට පැහැදිලි වීඩියෝ ලබාගන්න, සැකකරුවන්ගේ සහ වාහනවල අංක ලියාගන්න, වහාම ප්‍රදේශයේ පොලිස් ස්ථානාධිපතිට (OIC) දන්වන්න.",
  rule2Title: "2. වස දීමක් සැකකරන අවස්ථාවක (Suspected Poisoning)",
  rule2Desc: "ප්‍රමාද නොවී සත්වයා ළඟම සිටින පශු වෛද්‍යවරයෙකු වෙත රැගෙන යන්න. සතා සිහිසුන්ව හෝ ගැහෙමින් සිටී නම් බලෙන් වමනය කරවීමට උත්සාහ නොකරන්න. සැකකටයුතු වස දැමූ ආහාර කැබලි හෝ වමනය කළ ද්‍රව්‍ය පිරිසිදු පොලිතින් බෑගයක මුද්‍රා තබා නඩු භාණ්ඩ ලෙස සුරක්ෂිත කරන්න.",
  rule3Title: "3. රිය අනතුරක් හෝ අස්ථි බිඳීමක් සිදුවූ විට",
  rule3Desc: "කොඳු ඇට පෙළට හානිවීම වැළැක්වීමට සත්වයා පිරිසිදු තුවායක් හෝ ලෑල්ලක් මත මෘදුව තබා චලනය අවම කරන්න. බියෙන් සපාකෑම වැළැක්වීමට මුඛය මෘදුව බඳින්න. වහාම පශු වෛද්‍ය ප්‍රතිකාර සඳහා යොමු කරන්න."
};

data.ta.triage = {
  badge: "அவசர முதலுதவி பாதுகாப்பு நெறிமுறை",
  title: "அவசர விலங்கு மீட்பு மற்றும் பாதுகாப்பு வழிகாட்டல்",
  cancelBtn: "இரத்து செய்க",
  closeBtn: "மூடுக",
  rule1Title: "1. தாக்குதல் அல்லது வன்முறை இடம்பெறும் போது",
  rule1Desc: "குற்றவாளிகளுடன் நேரடி மோதலில் ஈடுபட வேண்டாம். பாதுகாப்பான தூரத்திலிருந்து வீடியோ பதிவு செய்யவும், வாகன இலக்கங்களை குறித்துக்கொள்ளவும், உடனடியாக உள்ளூர் பொலிஸ் நிலைய பொறுப்பதிகாரிக்கு (OIC) அறிவிக்கவும்.",
  rule2Title: "2. விஷம் வைக்கப்பட்டதாக சந்தேகிக்கப்படும் போது",
  rule2Desc: "உடனடியாக அருகிலுள்ள கால்நடை மருத்துவரிடம் விலங்கை கொண்டு செல்லவும். மயக்க நிலையில் அல்லது வலிப்பு ஏற்படும் போது வாந்தியெடுக்க வைக்க முயற்சிக்காதீர்கள். விஷம் கலந்த உணவு அல்லது வாந்தி எடுத்தவற்றை சீல் செய்து நீதிமன்ற சான்றுப்பொருளாகப் பாதுகாக்கவும்.",
  rule3Title: "3. வாகன விபத்து / எலும்பு முறிவு",
  rule3Desc: "முதுகெலும்பு அதிர்ச்சியைத் தடுக்க சுத்தமான துண்டு அல்லது பலகையைப் பயன்படுத்தி விலங்கை அசைக்காமல் வைக்கவும். உடனடியாக கால்நடை மருத்துவமனைக்கு கொண்டு செல்லவும்."
};

// Also verify legal modal translations
data.en.legalModal = {
  badge: "Legal Aid & Court Coordination",
  title: "Request Legal Assistance / Court Coordination",
  subtitle: "Coordinating legal counsel for Magistrate Court motions, B-report monitoring, and police station liaison.",
  cancelBtn: "Cancel",
  submitBtn: "Submit Legal Request",
  closeBtn: "Close"
};

data.si.legalModal = {
  badge: "නීති ආධාර සහ අධිකරණ සම්බන්ධීකරණය",
  title: "නීති සහය සහ අධිකරණ මැදිහත්වීම් ඉල්ලුම්පත්‍රය",
  subtitle: "මහේස්ත්‍රාත් අධිකරණයේ පෙනී සිටීම, පොලිස් බී-වාර්තා අධීක්ෂණය සහ නීතිඥ සහය ලබාදීම.",
  cancelBtn: "අවලංගු කරන්න",
  submitBtn: "නීති සහය ඉල්ලුම් කරන්න",
  closeBtn: "වසන්න"
};

data.ta.legalModal = {
  badge: "சட்ட உதவி மற்றும் நீதிமன்ற ஒருங்கிணைப்பு",
  title: "சட்ட உதவி மற்றும் நீதிமன்ற நடவடிக்கை கோரிக்கை",
  subtitle: "நீதவான் நீதிமன்ற நடவடிக்கைகள், B-அறிக்கை கண்காணிப்பு மற்றும் சட்டத்தரணிகளை ஒருங்கிணைத்தல்.",
  cancelBtn: "இரத்து செய்க",
  submitBtn: "சட்ட உதவி கோருக",
  closeBtn: "மூடுக"
};

const outputPath = path.resolve(__dirname, '..', 'web', 'i18n-data.js');
const output = `// web/i18n-data.js
// Exhaustive Trilingual Legal & Procedural Knowledge Base for Animal Welfare Coalition (AWC) Sri Lanka
// Generated automatically. Supports complete parity in English (en), Sinhala (si), and Tamil (ta).

const awcData = ${JSON.stringify(data, null, 2)};

if (typeof window !== 'undefined') {
  window.AWC_I18N = awcData;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = awcData;
}
`;

fs.writeFileSync(outputPath, output, 'utf8');
console.log('Successfully enriched web/i18n-data.js with triage and legalModal! Size: ' + Buffer.byteLength(output, 'utf8') + ' bytes.');
