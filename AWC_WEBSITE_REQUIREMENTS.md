# Animal Welfare Coalition (AWC) - Website & Admin Requirements Specification

---

### 1. General & Brand Information
* **Official Organization Email:** `awcsrilanka@gmail.com`
* **Admin Account:** `awcsrilanka@gmail.com` (Firestore / Firebase Authentication)
* **Official Social Channel:** `fb.com/awcsrilanka` (Integrated feed / social link)
* **Phone / Hotline Policy:** **NO mobile number or phone hotline** displayed (strict ticket & email based support only)
* **Strict Anti-Fundraising & Phone Ban:** **DO NOT** mention donations, fundraising, or any phone/WhatsApp numbers (including `072 918 9002`). The platform is strictly for advocacy, incident complaints, legal assistance, public education, and case tracking.
* **Visual Theme:** Full **Light and Dark mode** support
* **Languages (Trilingual):**
  1. English
  2. Sinhala (සිංහල)
  3. Tamil (தமிழ்)
* **Team Section:** Dedicated team structure (placeholders ready for final bio/profile info)
* **About Us:** Authoritative narrative synthesized from coalition documentation

---

### 2. Public Intake Systems (Ticket & Token Architecture)

#### A. Complaints Intake (Cruelty & Incidents)
* **Mandatory Contact Fields:**
  * Contact Number
  * Email Address
  * Incident details (what, when, where/landmarks, animal species/condition)
* **Attachment Handling:**
  * To preserve bandwidth and prevent unmoderated file uploads, users are instructed to email photographic/video evidence to `awcsrilanka@gmail.com` quoting their reference token.
* **Auto-Generated Token Number:**
  * Instant unique token upon submission (e.g., `AWC-TKT-XXXXXX`).
* **Complaint Tracking:**
  * Public tracking search box where reporters enter their token to see status updates without exposing sensitive witness data.

#### B. Request Legal Assistance Intake
* Dedicated separate tab/portal for legal consultation, court coordination, witness protection accompaniment, and attorney referral.
* Generates a unique legal request ticket token.

---

### 3. Admin Panel Architecture (`admin.html` + `editor.html`)
* **Zero-Build CDN Stack:** React 18, Tailwind CSS, Babel Standalone.
* **Security Gate:** Bound to `awcsrilanka@gmail.com` via Firebase Auth and Firestore admin claim verification.
* **Triage Dashboard (`admin.html`):**
  * Real-time Firestore sync (`onSnapshot`).
  * Instant ticket stream of incoming Complaints and Legal Assistance requests.
  * Filters: Status, Urgency, District.
* **Case Creation & Bundling:**
  * Admin ability to create umbrella **"Cases"** (e.g., *Rani Elephant Inquiry*, *Tango Boarding Case*, *Kalawana Hearing*).
  * Ability to link/assign individual complaint tickets to a master Case.
  * Ability to publish verified progress milestones and updates (which feed public case timelines and token tracking).

---

### 4. Knowledge Base & Educational Pages
1. **"Know the Law" / Current Statutes:**
   * Prevention of Cruelty to Animals Ordinance No. 13 of 1907 (Sec 2, 3, 4, 5, 7, 8, 12, 13).
   * Animals Act No. 29 of 1958 & Gazette No. 1629/17 (Transport permits, ear tags, cattle vouchers).
   * Animals (Amendment) Act No. 19 of 2026 (Pigs, Goats, Sheep).
   * Butchers Ordinance No. 9 of 1893 (Ban on pregnant/milking cow slaughter, Rs. 50,000 fine & 3 yrs jail).
   * Dangerous Animals (Amendment) Act No. 40 of 2022 (Fines up to Rs. 250,000).
   * Fauna and Flora Protection Ordinance No. 2 of 1937 & Tamed Elephant Regulations.
   * 2026 Animal Welfare Bill (Duty of care, NAWA, Rs. 500,000 fine).
2. **"Truth vs Myth" Page:**
   * Debunking misconceptions (e.g., perahera bans, rabies handling, right to harm trespassing animals, police powers to arrest without warrant).
3. **"Our Involvement" Page:**
   * AWC's historical role, policy correspondence with WHO/Ministry of Health, legal representation, police station letter delivery.
4. **"What to Do When You Witness Animal Cruelty" (4-Step Action Guide):**
   * **Step 1: Take & Grab Evidence** (Safe photos, video, vehicle plates, witness contacts).
   * **Step 2: File a Police Complaint** (Cognizable offence under Sec 12, arrest without warrant, get CIB entry #).
   * **Step 3: Share on Social Media Responsibly** (Raise community awareness).
   * **Step 4: Approach an Animal Welfare Organization (AWC)** (Submit token ticket for legal follow-up).
