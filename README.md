# Animal Welfare Coalition (AWC – Sri Lanka) Web Platform
### ශ්‍රී ලංකා සත්ව සුභසාධන සන්ධානය | விலங்கு நலக் கூட்டணி இலங்கை

Official digital portal and incident case-management platform for the **Animal Welfare Coalition (AWC – Sri Lanka)** (`@AWCSriLanka` / `fb.com/awcsrilanka`).

---

## 1. Architecture & Philosophy
Built on the **Pawtectora Universal Zero-Build Admin Blueprint**:
- **Zero-Build Stack**: Runs entirely via browser CDNs (`React 18`, `Tailwind CSS CDN`, `Babel Standalone`, `Lucide Icons`). No broken Webpack bundles, no Node build dependencies, and zero deployment friction.
- **Anywhere-Hosting**: Ready for deployment on GitHub Pages, Cloudflare Pages, Firebase Hosting, AWS S3, or cPanel/Apache.
- **Dual Projections for Safety**: Private incident reports, witness identities, and internal lawyer notes are isolated in protected collections, while sanitized, lawyer-approved public case milestones feed the citizen portal.
- **Trilingual Parity**: Full instant switching between **English**, **Sinhala (සිංහල)**, and **Tamil (தமிழ்)** across all navigation, emergency triage, intake forms, and legal playbooks.
- **Theme**: Seamless Light and Dark mode toggle.
- **Strict Policy**: **No phone hotlines or mobile numbers**. Direct communication via ticket tokens and official email: `awcsrilanka@gmail.com`.

---

## 2. Project Directory Layout

```text
AWC/
├── web/
│   ├── index.html              # Public Website (Trilingual, Intake, Tracking, Knowledge Hub)
│   ├── admin.html              # Admin Triage Dashboard (KPIs, Queue table, Realtime sync, Case Bundler)
│   ├── editor.html             # Multi-Window Case Editor (5-Step Stepper, Legal Notes, Public Projection)
│   └── assets/
│       └── logo.png            # Official AWC Logo
├── knowledge-base/
│   ├── sri-lanka-animal-law-handbook.md              # Master animal law manual & statutes
│   ├── legal-faqs-and-citizen-guide.md               # Citizen Q&A, police reporting, 3-CD evidence rules
│   ├── sri-lankan-court-procedures-and-evidence-guide.md # Court procedure, B-Reports, Warrants, RTI
│   ├── legal-statutes-cheatsheet.json                # Structured JSON statute dataset
│   ├── legal-status-timelines-and-evolutionary-analysis.md # Evolutionary legal timeline 1907-2026
│   ├── daph-livestock-governance-and-legal-frameworks.md   # DAPH administrative & livestock report
│   └── awc-comprehensive-research-and-architecture-report.md # Comprehensive AWC research report
├── firestore.rules             # Firebase Security Rules (isAdmin() enforcement, create-only intake)
├── scripts/
│   └── test-babel-admin.js     # Preflight HTML/JSX syntax validator
├── AWC_WEBSITE_REQUIREMENTS.md # Formal system requirements specification
├── Admin_Module_Blueprint.md   # Architecture blueprint
└── README.md
```

---

## 3. How to Run Locally

Because this platform uses a **Zero-Build CDN architecture**, no compilation is needed!

### Option A: Open Directly in Browser
Simply double-click or open `web/index.html` in Google Chrome, Edge, Firefox, or Safari.

### Option B: Local Live Server (Recommended)
Using Python or Node http-server:
```bash
# Python 3
cd web
python -m http.server 8000
# Open http://localhost:8000
```
Or via npx:
```bash
npx serve web
```

---

## 4. Admin Access & Case Workflow

1. Navigate to `web/admin.html`.
2. Sign in with the administrator email: **`awcsrilanka@gmail.com`**.
3. **Incoming Ticket Queue:** View incoming Cruelty Complaints and Legal Aid Requests with urgency indicators and district filters.
4. **Master Case Bundler:** Click `+ Create Master Case` to group multiple individual complaints under an umbrella legal case (e.g. *Sigiriya Rani Elephant Case*, *Pawtopia Tango Case*).
5. **Standalone Editor:** Click `Open Editor ↗` on any ticket. It opens `editor.html?id=TOKEN` in a separate tab with:
   - **5-Step Lifecycle Stepper:** `Received` ➔ `Under Review` ➔ `Action Planned` ➔ `Escalated / Court` ➔ `Resolved`.
   - **Confidential Legal Notes:** Record Police CIB #, Court B-Report #, and assigned lawyer.
   - **Statute Tagger:** Tag sections (1907 Ordinance, Penal Code 411/412, Animals Act, Butchers Ord, FFPO).
   - **Public Projection Toggle:** One-click toggle to publish sanitized updates to the public case timeline and citizen token tracker.
   - **Cross-Window Sync:** Automatically broadcasts `RECORD_SAVED` via `postMessage` to update the parent admin table instantly.

---

## 5. Preflight Syntax Verification

Before committing or deploying, run the automated syntax validator:
```bash
node scripts/test-babel-admin.js
```

---

## 6. Official Coordinates
* **Official Email:** `awcsrilanka@gmail.com`
* **Official Facebook:** [fb.com/awcsrilanka](https://facebook.com/AWCSriLanka)
* **Police Station & OIC Lookup:** [police.lk/telephone-index/](https://police.lk/telephone-index/)
