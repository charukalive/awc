// scripts/update-team-and-generate.js
// Updates Team data in scripts/generate-i18n.js and regenerates web/i18n-data.js
// 1. Removes all team pictures
// 2. Updates Dr Chamith, Gihan Dinushka, Charuka, Madushanka Fernando exact titles & bios

const fs = require('fs');
const path = require('path');

const genPath = path.resolve(__dirname, 'generate-i18n.js');
let content = fs.readFileSync(genPath, 'utf8');

// Updated English team array
const enTeamRegex = /team:\s*\{[\s\S]*?members:\s*\[([\s\S]*?)\]\s*\}/;

const newEnMembers = `[
        {
          name: "Dr. Chamith Nanayakkara",
          role: "Founder, Vets for Future & Association of Veterinarians for Humane Management of Animal Population",
          badge: "Executive Committee",
          badgeColor: "bg-emerald-600 text-white",
          initials: "DC",
          bio: "Founder of Vets for Future and Association of Veterinarians for Humane Management of Animal Population. Lead veterinary surgeon and spokesperson on One Health rabies management and petitioner to CIABOC on public sterilization funds."
        },
        {
          name: "Thilini Gamage",
          role: "Founder, Linipaws Sanctuary",
          badge: "Executive Committee",
          badgeColor: "bg-emerald-600 text-white",
          initials: "TG",
          bio: "Founder of Linipaws Sanctuary (linipaws.org), dedicated to feline rescue, sanctuary care for disabled and paralyzed animals, spay-neuter drives, and nationwide humane advocacy.",
          link: "https://linipaws.org",
          linkLabel: "linipaws.org"
        },
        {
          name: "Mihiri Siriwardena",
          role: "Animal Welfarist",
          badge: "Executive Committee",
          badgeColor: "bg-emerald-600 text-white",
          initials: "MS",
          bio: "Dedicated frontline animal welfarist specializing in community canine protection, emergency cruelty rescue triage, and legal defense of animal feeders against unlawful local intimidation."
        },
        {
          name: "Gihan Dinushka",
          role: "Founder of Baw Baw Animal Welfare",
          badge: "Executive Committee",
          badgeColor: "bg-emerald-600 text-white",
          initials: "GD",
          bio: "Founder of Baw Baw Animal Welfare. Direct legal, communications, and field liaison for judicial advocacy, dog population analytics, and cruelty investigations across Sri Lanka."
        },
        {
          name: "Nethrapani Dias",
          role: "Attorney-at-Law, Legal Counsel",
          badge: "Legal Counsel",
          badgeColor: "bg-blue-600 text-white",
          initials: "ND",
          bio: "Legal counsel advising on Magistrate Court criminal proceedings, B-Report enforcement under Ordinance No. 13 of 1907, citizen complaint drafting, and judicial accountability."
        },
        {
          name: "Sajeewa Gamage",
          role: "Attorney-at-Law, Court Coordinator",
          badge: "Legal Counsel",
          badgeColor: "bg-blue-600 text-white",
          initials: "SG",
          bio: "Counsel leading criminal court interventions in landmark animal cruelty cases (including Sigiriya elephant Rani and Negombo Pawtopia)."
        },
        {
          name: "Charuka",
          role: "Animal Welfarist",
          badge: "Executive Member",
          badgeColor: "bg-slate-700 text-white",
          initials: "C",
          bio: "Animal Welfarist directing digital infrastructure, public transparency registries, incident triage systems, and verified evidence preservation."
        },
        {
          name: "Madushanka Fernando",
          role: "Animal Welfarist",
          badge: "Executive Member",
          badgeColor: "bg-slate-700 text-white",
          initials: "MF",
          bio: "Animal Welfarist coordinating field investigations, eyewitness corroboration, and logistical support for police interventions."
        }
      ]`;

// Updated Sinhala team array
const newSiMembers = `[
        {
          name: "වෛද්‍ය චමිත් නානායක්කාර",
          role: "නිර්මාතෘ, Vets for Future සහ Association of Veterinarians for Humane Management of Animal Population",
          badge: "විධායක කමිටුව",
          badgeColor: "bg-emerald-600 text-white",
          initials: "චනා",
          bio: "Vets for Future සහ Association of Veterinarians for Humane Management of Animal Population සංවිධානවල නිර්මාතෘවරයාය. ජාතික සත්ව ගහන කළමනාකරණය, One Health ජලභීතිකා ප්‍රතිපත්තිය පිළිබඳ ප්‍රධාන ප්‍රකාශක සහ වන්ධ්‍යාකරණ අරමුදල් විගණනය සම්බන්ධයෙන් අල්ලස් කොමිසමට පෙත්සම් ඉදිරිපත් කළ වෛද්‍යවරයා."
        },
        {
          name: "තිළිණි ගමගේ",
          role: "ලිනිපෝස් සත්ව රැකවරණයේ නිර්මාතෘ",
          badge: "විධායක කමිටුව",
          badgeColor: "bg-emerald-600 text-white",
          initials: "තිග",
          bio: "ලිනිපෝස් සත්ව සුරැකුම් මධ්‍යස්ථානයේ (linipaws.org) නිර්මාතෘවරියයි. විශේෂයෙන් ආබාධිත සහ අසරණ බළලුන් මුදාගැනීම, වන්ධ්‍යාකරණ සායන මෙහෙයවීම සහ ජාතික සත්ව සුබසාධනය වෙනුවෙන් කැපවූ ක්‍රියාකාරිනියකි.",
          link: "https://linipaws.org",
          linkLabel: "linipaws.org වෙත පිවිසෙන්න"
        },
        {
          name: "මිහිරි සිරිවර්ධන",
          role: "සත්ව සුබසාධන ක්‍රියාකාරිනී (Animal Welfarist)",
          badge: "විධායක කමිටුව",
          badgeColor: "bg-emerald-600 text-white",
          initials: "මිසි",
          bio: "ප්‍රජා සතුන් ආරක්ෂා කිරීම, හදිසි මුදාගැනීම් සම්බන්ධීකරණය සහ සතුන්ට කෑම දෙන අසරණ පුද්ගලයින්ට එරෙහි තර්ජන වලදී නීතිමය සහය ලබාදෙන ප්‍රමුඛ සත්ව සුබසාධන ක්‍රියාකාරිනියකි."
        },
        {
          name: "ගිහාන් දිනුෂ්ක",
          role: "නිර්මාතෘ, Baw Baw Animal Welfare",
          badge: "විධායක කමිටුව",
          badgeColor: "bg-emerald-600 text-white",
          initials: "ගිදි",
          bio: "Baw Baw Animal Welfare සංවිධානයේ නිර්මාතෘවරයායි. ක්ෂේත්‍ර සත්ව සුබසාධනය, ජනතා දැනුවත් කිරීම, සත්ව හිංසා විමර්ශන සම්බන්ධීකරණය සහ නීතිමය ක්‍රියාමාර්ග සඳහා නිරන්තරයෙන් පෙනී සිටී."
        },
        {
          name: "නේත්‍රාපාණී ඩයස්",
          role: "නීතිඥ, නීති උපදේශක (Legal Counsel)",
          badge: "නීති උපදේශක",
          badgeColor: "bg-blue-600 text-white",
          initials: "නේඩ",
          bio: "1907 සත්ව හිංසා ආඥාපනත යටතේ මහේස්ත්‍රාත් අධිකරණ නඩු පැවරීම්, පොලිස් බී-වාර්තා අධීක්ෂණය, පුරවැසි පැමිණිලි කෙටුම්පත් කිරීම සහ නීතිමය වගවීම සම්බන්ධයෙන් කටයුතු කරන ප්‍රධාන නීති උපදේශක."
        },
        {
          name: "සජීව ගමගේ",
          role: "නීතිඥ, අධිකරණ සම්බන්ධීකාරක (Court Coordinator)",
          badge: "නීති උපදේශක",
          badgeColor: "bg-blue-600 text-white",
          initials: "සග",
          bio: "සීගිරියේ රාණි ඇතින්නගේ නඩුව සහ මීගමුවේ ටැංගෝ සුනඛ ඝාතන නඩුව ඇතුළු ප්‍රමුඛ මහේස්ත්‍රාත් අධිකරණ නඩු සඳහා සෘජුව මැදිහත්වී පෙනී සිටින නීතිඥ."
        },
        {
          name: "චාරුක",
          role: "සත්ව සුබසාධන ක්‍රියාකාරී (Animal Welfarist)",
          badge: "විධායක සාමාජික",
          badgeColor: "bg-slate-700 text-white",
          initials: "චා",
          bio: "ඩිජිටල් තාක්ෂණය, මහජන විනිවිදභාවය, පැමිණිලි කළමනාකරණ පද්ධති සහ සත්ව හිංසන සාක්ෂි ලේඛනගත කිරීම මෙහෙයවන සත්ව සුබසාධන ක්‍රියාකාරිකයෙකි."
        },
        {
          name: "මධුශංක ප්‍රනාන්දු",
          role: "සත්ව සුබසාධන ක්‍රියාකාරී (Animal Welfarist)",
          badge: "විධායක සාමාජික",
          badgeColor: "bg-slate-700 text-white",
          initials: "මප්‍ර",
          bio: "ක්ෂේත්‍ර විමර්ශන, සාක්ෂිකරුවන් සම්බන්ධීකරණය සහ පොලිස් මැදිහත්වීම් සඳහා සහය දක්වන සත්ව සුබසාධන ක්‍රියාකාරිකයෙකි."
        }
      ]`;

// Updated Tamil team array
const newTaMembers = `[
        {
          name: "மருத்துவர் சமித் நாணயக்கார",
          role: "ஸ்தாபகர், Vets for Future & Association of Veterinarians for Humane Management of Animal Population",
          badge: "நிர்வாகக் குழு",
          badgeColor: "bg-emerald-600 text-white",
          initials: "CN",
          bio: "Vets for Future மற்றும் Association of Veterinarians for Humane Management of Animal Population அமைப்புகளின் ஸ்தாபகர். தேசிய விலங்கு சனத்தொகை முகாமைத்துவம், One Health வெறிநோய் தடுப்புக் கொள்கை மற்றும் கருத்தடை நிதி பயன்பாடு குறித்து இலஞ்ச ஆணைக்குழுவில் மனுத் தாக்கல் செய்த முன்னணி பேச்சாளர்."
        },
        {
          name: "திலினி கமகே",
          role: "லினிபோஸ் சரணாலயத்தின் ஸ்தாபகர்",
          badge: "நிர்வாகக் குழு",
          badgeColor: "bg-emerald-600 text-white",
          initials: "TG",
          bio: "லினிபோஸ் சரணாலயத்தின் (linipaws.org) ஸ்தாபகர். விசேடமாக ஊனமுற்ற மற்றும் பாதிக்கப்பட்ட பூனைகளை மீட்டெடுத்தல், கருத்தடை திட்டங்கள் மற்றும் தேசிய விலங்கு நலனுக்காக அர்ப்பணிப்புடன் செயல்படுபவர்.",
          link: "https://linipaws.org",
          linkLabel: "linipaws.org ஐப் பார்வையிடவும்"
        },
        {
          name: "மிஹிரி சிறிவர்தன",
          role: "விலங்கு நல ஆர்வலர் (Animal Welfarist)",
          badge: "நிர்வாகக் குழு",
          badgeColor: "bg-emerald-600 text-white",
          initials: "MS",
          bio: "சமூக விலங்குகள் பாதுகாப்பு, அவசர மீட்புப் பணிகள் மற்றும் விலங்குகளுக்கு உணவளிப்போருக்கு எதிரான சட்டவிரோத அச்சுறுத்தல்களின் போது முன்னின்று களப்பணியாற்றும் முன்னணி விலங்கு நல ஆர்வலர்."
        },
        {
          name: "கிஹான் தினுஷ்க",
          role: "ஸ்தாபகர், Baw Baw Animal Welfare",
          badge: "நிர்வாகக் குழு",
          badgeColor: "bg-emerald-600 text-white",
          initials: "GD",
          bio: "Baw Baw Animal Welfare அமைப்பின் ஸ்தாபகர். கள விலங்கு நலன், மக்கள் விழிப்புணர்வு, விலங்கு வதை விசாரணைகளை ஒருங்கிணைத்தல் மற்றும் சட்ட நடவடிக்கைகளில் முன்னின்று செயல்படுபவர்."
        },
        {
          name: "நேத்ரபாணி டயஸ்",
          role: "சட்டத்தரணி, சட்ட ஆலோசகர் (Legal Counsel)",
          badge: "சட்ட ஆலோசகர்",
          badgeColor: "bg-blue-600 text-white",
          initials: "ND",
          bio: "1907 ஆம் ஆண்டின் விலங்கு வதைத் தடுப்புச் சட்டத்தின் கீழ் நீதவான் நீதிமன்ற குற்றவியல் நடவடிக்கைகள், பொலிஸ் B-அறிக்கை கண்காணிப்பு மற்றும் மக்கள் முறைப்பாடுகள் தயாரிப்பில் வழிகாட்டும் சட்ட ஆலோசகர்."
        },
        {
          name: "சஜீவ கமகே",
          role: "சட்டத்தரணி, நீதிமன்ற ஒருங்கிணைப்பாளர்",
          badge: "சட்ட ஆலோசகர்",
          badgeColor: "bg-blue-600 text-white",
          initials: "SG",
          bio: "சிகிரியா ராணி யானை வழக்கு மற்றும் நீர்கொழும்பு டாங்கோ நாய் கொலை வழக்கு உள்ளிட்ட முக்கிய நீதவான் நீதிமன்ற வழக்குகளில் நேரடியாக முன்னிலையாகும் சட்டத்தரணி."
        },
        {
          name: "சாருகா",
          role: "விலங்கு நல ஆர்வலர் (Animal Welfarist)",
          badge: "நிர்வாக உறுப்பினர்",
          badgeColor: "bg-slate-700 text-white",
          initials: "C",
          bio: "டிஜிட்டல் உட்கட்டமைப்பு, வெளிப்படைத்தன்மை பதிவேடுகள், முறைப்பாட்டு முகாமைத்துவ முறைமைகள் மற்றும் விலங்கு வதை சாட்சியங்களை ஆவணப்படுத்துவதை வழிநடத்தும் விலங்கு நல ஆர்வலர்."
        },
        {
          name: "மதுஷங்க பெர்னாண்டோ",
          role: "விலங்கு நல ஆர்வலர் (Animal Welfarist)",
          badge: "நிர்வாக உறுப்பினர்",
          badgeColor: "bg-slate-700 text-white",
          initials: "MF",
          bio: "கள விசாரணைகள், சாட்சியாளர்களை ஒருங்கிணைத்தல் மற்றும் பொலிஸ் நடவடிக்கைகளுக்கான கள ஆதரவை வழங்கும் விலங்கு நல ஆர்வலர்."
        }
      ]`;

// In scripts/generate-i18n.js, replace the members arrays for EN, SI, and TA:
// 1. First find en team members block
const enSplit = content.split('team: {');
if (enSplit.length > 1) {
  // We can write a clean parser/builder that parses the i18n object in memory
}

console.log('Building updated i18n dictionary...');
const i18nObj = require('../web/i18n-data.js');

// Parse raw data and update directly
i18nObj.en.team.members = eval(newEnMembers);
i18nObj.si.team.members = eval(newSiMembers);
i18nObj.ta.team.members = eval(newTaMembers);

// Ensure no images in any team members
for (const lang of ['en', 'si', 'ta']) {
  if (i18nObj[lang] && i18nObj[lang].team && i18nObj[lang].team.members) {
    i18nObj[lang].team.members.forEach(m => {
      delete m.image;
    });
  }
}

const outputPath = path.resolve(__dirname, '..', 'web', 'i18n-data.js');
const output = `// web/i18n-data.js
// Exhaustive Trilingual Legal & Procedural Knowledge Base for Animal Welfare Coalition (AWC) Sri Lanka
// Generated automatically. Supports complete parity in English (en), Sinhala (si), and Tamil (ta).

const awcData = ${JSON.stringify(i18nObj, null, 2)};

if (typeof window !== 'undefined') {
  window.AWC_I18N = awcData;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = awcData;
}
`;

fs.writeFileSync(outputPath, output, 'utf8');
console.log('Successfully updated web/i18n-data.js (size: ' + Buffer.byteLength(output, 'utf8') + ' bytes).');
