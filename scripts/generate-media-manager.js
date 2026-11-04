// scripts/generate-media-manager.js
// Builds web/media-manager.html: A dedicated, interactive image manager web view
// Allows admins to upload new images to Firebase Storage or replace them with URLs.

const fs = require('fs');
const path = require('path');

const mediaManagerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AWC Media & Asset Manager | Firebase Cloud Storage</title>
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
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-storage-compat.js"></script>

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    code, pre { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen">
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect, useMemo } = React;

    const ADMIN_EMAIL = 'awcsrilanka@gmail.com';

    // Firebase Configuration
    const firebaseConfig = {
      apiKey: "AIzaSyCqubiF5BLjNnol5HkcOdTcq156co4s27o",
      authDomain: "vfflk-a543e.firebaseapp.com",
      projectId: "vfflk-a543e",
      storageBucket: "vfflk-a543e.firebasestorage.app",
      messagingSenderId: "61010073715",
      appId: "1:61010073715:web:423ca808e5a56e0f3a3206"
    };

    let app = null, auth = null, db = null, storage = null;
    try {
      if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
          app = firebase.initializeApp(firebaseConfig);
        } else {
          app = firebase.app();
        }
        auth = firebase.auth();
        db = firebase.firestore();
        storage = firebase.storage();
      }
    } catch (e) {
      console.warn("Firebase Init Notice:", e);
    }

    // Default Slot Registry with Bundled Assets & Context
    const DEFAULT_SLOTS = [
      {
        key: 'hero_image',
        category: 'Branding & Hero',
        title: 'Hero Section Featured Image',
        desc: 'Main banner card on the homepage desktop & mobile views.',
        defaultUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1000&q=80',
        ratio: '16:9'
      },
      {
        key: 'site_logo',
        category: 'Branding & Hero',
        title: 'Official AWC Logo',
        desc: 'Header navbar and footer brand logo.',
        defaultUrl: 'assets/logo.png',
        ratio: '1:1'
      },
      {
        key: 'og_preview',
        category: 'Branding & Hero',
        title: 'Social Share & WhatsApp Preview (og-preview.png)',
        desc: 'Shown when sharing the site link on WhatsApp, Facebook, Twitter (must be < 300KB).',
        defaultUrl: 'assets/og-preview.png',
        ratio: '1:1'
      },
      // Statutes
      {
        key: 'statute_1907_ORD',
        category: 'Statutes',
        title: 'Prevention of Cruelty to Animals Ordinance No. 13 of 1907',
        desc: 'Card image for 1907 Ordinance under Know the Law.',
        defaultUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
        ratio: '16:9'
      },
      {
        key: 'statute_PENAL_CODE',
        category: 'Statutes',
        title: 'Penal Code Sections 411 & 412 (Criminal Mischief)',
        desc: 'Card image for Penal Code under Know the Law.',
        defaultUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
        ratio: '16:9'
      },
      {
        key: 'statute_DOG_REG',
        category: 'Statutes',
        title: 'Rabies Ordinance & Dog Registration Ordinance',
        desc: 'Card image for Rabies and Dog Registration laws.',
        defaultUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
        ratio: '16:9'
      },
      {
        key: 'statute_ANIMALS_ACT',
        category: 'Statutes',
        title: 'Animals Act No. 29 of 1958 (Cattle Slaughter & Transport)',
        desc: 'Card image for Animals Act & cattle transport.',
        defaultUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
        ratio: '16:9'
      },
      {
        key: 'statute_FFPO',
        category: 'Statutes',
        title: 'Fauna and Flora Protection Ordinance (FFPO)',
        desc: 'Card image for Captive wildlife & elephant protection.',
        defaultUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80',
        ratio: '16:9'
      },
      {
        key: 'statute_NEW_BILL',
        category: 'Statutes',
        title: 'Animal Welfare Bill (Landmark Legislative Reform)',
        desc: 'Card image for the modern Animal Welfare Bill.',
        defaultUrl: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=80',
        ratio: '16:9'
      },
      // Playbook
      {
        key: 'playbook_B_REPORT',
        category: 'Playbook',
        title: "Playbook: What is a 'B-Report' (B-වාර්තාව)?",
        desc: 'Card image explaining B-report filing at Magistrate Court.',
        defaultUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
        ratio: '16:9'
      },
      {
        key: 'playbook_WITNESS',
        category: 'Playbook',
        title: 'Playbook: Why Witness Statements Win Cases',
        desc: 'Card image for witness statement guidelines.',
        defaultUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
        ratio: '16:9'
      },
      {
        key: 'playbook_EVIDENCE_MEDIA',
        category: 'Playbook',
        title: 'Playbook: Video/Audio Evidence (3 CDs & Affidavit)',
        desc: 'Card image for digital evidence submission.',
        defaultUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        ratio: '16:9'
      },
      {
        key: 'playbook_RTI_GUIDE',
        category: 'Playbook',
        title: 'Playbook: Right to Information (RTI) Citizen Guide',
        desc: 'Card image for RTI requests to Police and DAPH.',
        defaultUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
        ratio: '16:9'
      },
      {
        key: 'playbook_COURT_DOCS',
        category: 'Playbook',
        title: 'Playbook: Notice, Summons, Warrant & Court Exhibits',
        desc: 'Card image for judicial process terminology.',
        defaultUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
        ratio: '16:9'
      },
      {
        key: 'playbook_PROCEDURE_TIMELINE',
        category: 'Playbook',
        title: 'Playbook: Magistrate Court Step-by-Step Procedure',
        desc: 'Card image for court timeline from incident to trial.',
        defaultUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
        ratio: '16:9'
      },
      // Cases
      {
        key: 'case_0',
        category: 'Cases',
        title: 'Case 1: Rani the Safari Elephant Assault',
        desc: 'Sigiriya safari cruelty case card image.',
        defaultUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=600&q=80',
        ratio: '16:9'
      },
      {
        key: 'case_1',
        category: 'Cases',
        title: 'Case 2: Tango at Pawtopia Pet Boarding',
        desc: 'Katana commercial kennel cruelty case image.',
        defaultUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80',
        ratio: '16:9'
      },
      {
        key: 'case_2',
        category: 'Cases',
        title: 'Case 3: Thalathuoya Viral Cat Torture',
        desc: 'Kandy cat cruelty prosecution image.',
        defaultUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
        ratio: '16:9'
      },
      {
        key: 'case_3',
        category: 'Cases',
        title: 'Case 4: Malabe Community Dog Feeder Defense',
        desc: 'Malabe community feeder defense image.',
        defaultUrl: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=600&q=80',
        ratio: '16:9'
      },
      {
        key: 'case_4',
        category: 'Cases',
        title: 'Case 5: Dambulla Illicit Cattle Transport Seizure',
        desc: 'Dambulla cattle transport interception image.',
        defaultUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=600&q=80',
        ratio: '16:9'
      },
      // Campaigns
      {
        key: 'camp_0',
        category: 'Campaigns',
        title: 'Campaign 1: One Health Rabies Transfer to DAPH',
        desc: 'Policy campaign card for transferring rabies to veterinary jurisdiction.',
        defaultUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',
        ratio: '16:9'
      },
      {
        key: 'camp_1',
        category: 'Campaigns',
        title: 'Campaign 2: Compulsory Digital Microchipping & National Database',
        desc: 'Policy campaign card for ISO microchipping.',
        defaultUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
        ratio: '16:9'
      },
      {
        key: 'camp_2',
        category: 'Campaigns',
        title: 'Campaign 3: Humane Population Management (CNVR) & Welfare Standards',
        desc: 'Policy campaign card for humane stray population management.',
        defaultUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
        ratio: '16:9'
      },
      {
        key: 'camp_3',
        category: 'Campaigns',
        title: 'Campaign 4: Modern Animal Welfare Bill Enactment Campaign',
        desc: 'Advocacy campaign card for penal deterrence reform.',
        defaultUrl: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=80',
        ratio: '16:9'
      }
    ];

    function MediaManagerApp() {
      const [customImages, setCustomImages] = useState(() => {
        try {
          return JSON.parse(localStorage.getItem('awc_custom_images') || '{}');
        } catch(e) { return {}; }
      });

      const [selectedCategory, setSelectedCategory] = useState('All');
      const [toastMsg, setToastMsg] = useState(null);
      const [uploadingSlot, setUploadingSlot] = useState(null);
      const [uploadProgress, setUploadProgress] = useState(0);
      const [showJsonModal, setShowJsonModal] = useState(false);
      const [jsonText, setJsonText] = useState('');
      const [isAdminAuthed, setIsAdminAuthed] = useState(() => {
        return sessionStorage.getItem('awc_admin_auth') === 'true';
      });

      const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3500);
      };

      // Realtime Firestore Listener
      useEffect(() => {
        if (db) {
          const unsub = db.collection('siteConfig').doc('images').onSnapshot((doc) => {
            if (doc.exists) {
              const data = doc.data();
              setCustomImages(data);
              localStorage.setItem('awc_custom_images', JSON.stringify(data));
            }
          }, (err) => console.warn("Firestore sync notice:", err));
          return () => unsub();
        }
      }, []);

      useEffect(() => {
        if (window.lucide) window.lucide.createIcons();
      });

      // Filtered Slots
      const categories = ['All', 'Branding & Hero', 'Statutes', 'Playbook', 'Cases', 'Campaigns'];
      const filteredSlots = useMemo(() => {
        if (selectedCategory === 'All') return DEFAULT_SLOTS;
        return DEFAULT_SLOTS.filter(s => s.category === selectedCategory);
      }, [selectedCategory]);

      // Handle Direct URL Update
      const handleSaveUrl = async (slotKey, url) => {
        if (!url || !url.trim()) return;
        const cleanUrl = url.trim();
        const updated = { ...customImages, [slotKey]: cleanUrl };
        setCustomImages(updated);
        localStorage.setItem('awc_custom_images', JSON.stringify(updated));

        if (db) {
          try {
            await db.collection('siteConfig').doc('images').set({
              [slotKey]: cleanUrl,
              updatedAt: new Date().toISOString()
            }, { merge: true });
          } catch(e) {
            console.warn("Firestore write error:", e);
          }
        }
        showToast(\`Saved URL override for \${slotKey}!\`);
      };

      // Handle Revert to Factory Default
      const handleRevert = async (slotKey) => {
        if (!confirm(\`Are you sure you want to revert "\${slotKey}" to its factory default image?\`)) return;
        const updated = { ...customImages };
        delete updated[slotKey];
        setCustomImages(updated);
        localStorage.setItem('awc_custom_images', JSON.stringify(updated));

        if (db) {
          try {
            await db.collection('siteConfig').doc('images').update({
              [slotKey]: firebase.firestore.FieldValue.delete()
            });
          } catch(e) {
            console.warn("Firestore delete field error:", e);
          }
        }
        showToast(\`Reverted \${slotKey} to factory default.\`);
      };

      // Handle File Upload to Firebase Storage
      const handleFileUpload = (slotKey, file) => {
        if (!file) return;

        // Check if Storage is available
        if (!storage) {
          alert('Firebase Cloud Storage is not initialized. Please verify network or config.');
          return;
        }

        const ext = file.name.split('.').pop() || 'png';
        const cleanSlot = slotKey.replace(/[^a-zA-Z0-9_-]/g, '_');
        const storagePath = \`site-images/\${cleanSlot}_\${Date.now()}.\${ext}\`;
        const storageRef = storage.ref(storagePath);

        setUploadingSlot(slotKey);
        setUploadProgress(0);

        const uploadTask = storageRef.put(file, {
          contentType: file.type || 'image/png'
        });

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setUploadProgress(progress);
          },
          (error) => {
            console.error("Storage Upload Error:", error);
            alert(\`Upload failed: \${error.message}. (Ensure storage.rules allow writing to /site-images/ or sign in as admin).\`);
            setUploadingSlot(null);
          },
          async () => {
            try {
              const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
              const updated = { ...customImages, [slotKey]: downloadURL };
              setCustomImages(updated);
              localStorage.setItem('awc_custom_images', JSON.stringify(updated));

              if (db) {
                await db.collection('siteConfig').doc('images').set({
                  [slotKey]: downloadURL,
                  updatedAt: new Date().toISOString()
                }, { merge: true });
              }

              setUploadingSlot(null);
              showToast(\`Image uploaded successfully to Firebase Storage!\`);
            } catch (err) {
              console.error("URL retrieval error:", err);
              setUploadingSlot(null);
            }
          }
        );
      };

      // Export / Import JSON
      const openJsonModal = () => {
        setJsonText(JSON.stringify(customImages, null, 2));
        setShowJsonModal(true);
      };

      const handleImportJson = async () => {
        try {
          const parsed = JSON.parse(jsonText);
          setCustomImages(parsed);
          localStorage.setItem('awc_custom_images', JSON.stringify(parsed));
          if (db) {
            await db.collection('siteConfig').doc('images').set(parsed, { merge: true });
          }
          setShowJsonModal(false);
          showToast('Configuration successfully restored!');
        } catch(e) {
          alert('Invalid JSON: ' + e.message);
        }
      };

      return (
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <img src="assets/logo.png" alt="AWC Logo" className="h-10 w-auto object-contain" onError={e=>e.target.style.display='none'} />
                <div>
                  <h1 className="text-lg font-black text-white flex items-center space-x-2">
                    <span>AWC Live Media & Image Manager</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Storage Active
                    </span>
                  </h1>
                  <p className="text-xs text-slate-400">
                    Bucket: <code className="text-emerald-400 font-mono">vfflk-a543e.firebasestorage.app</code>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                {toastMsg && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1.5 rounded-xl animate-pulse">
                    ✓ {toastMsg}
                  </span>
                )}
                <button
                  onClick={openJsonModal}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  title="View or export raw JSON config"
                >
                  Backup / JSON
                </button>
                <a
                  href="admin.html"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                >
                  ← Admin Console
                </a>
                <a
                  href="index.html"
                  target="_blank"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                >
                  View Public Portal ↗
                </a>
              </div>
            </div>
          </header>

          {/* Subheader / Filter Bar */}
          <div className="bg-slate-900/60 border-b border-slate-800 py-3">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Category Tabs */}
              <div className="flex items-center space-x-1.5 overflow-x-auto">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={\`px-3 py-1.5 rounded-xl font-bold transition shrink-0 \${selectedCategory === cat ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'}\`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Status Indicator */}
              <div className="text-slate-400 font-mono text-[11px] flex items-center space-x-3">
                <span>Slots: <strong>{filteredSlots.length}</strong></span>
                <span>•</span>
                <span>Custom Active: <strong className="text-emerald-400">{Object.keys(customImages).length}</strong></span>
              </div>
            </div>
          </div>

          {/* Main Slots Grid */}
          <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSlots.map(slot => (
                <SlotCard
                  key={slot.key}
                  slot={slot}
                  currentUrl={customImages[slot.key] || slot.defaultUrl}
                  isCustom={Boolean(customImages[slot.key])}
                  isUploading={uploadingSlot === slot.key}
                  uploadProgress={uploadProgress}
                  onSaveUrl={handleSaveUrl}
                  onRevert={handleRevert}
                  onFileUpload={handleFileUpload}
                />
              ))}
            </div>
          </main>

          {/* JSON Backup / Restore Modal */}
          {showJsonModal && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 rounded-3xl max-w-xl w-full p-6 border border-slate-800 shadow-2xl space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <h3 className="font-bold text-base text-white">Media Configuration JSON</h3>
                  <button onClick={() => setShowJsonModal(false)} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
                </div>
                <p className="text-xs text-slate-400">
                  You can copy this JSON to back up all image overrides, or paste a saved JSON and click Import to restore.
                </p>
                <textarea
                  rows={10}
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 outline-none focus:border-emerald-600"
                />
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={() => setShowJsonModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImportJson}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    Import & Save Config
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
            Animal Welfare Coalition Sri Lanka • Cloud Storage Powered by Firebase • awcsrilanka@gmail.com
          </footer>
        </div>
      );
    }

    // Individual Slot Card Component
    function SlotCard({ slot, currentUrl, isCustom, isUploading, uploadProgress, onSaveUrl, onRevert, onFileUpload }) {
      const [urlInput, setUrlInput] = useState(isCustom ? currentUrl : '');
      const [localPreview, setLocalPreview] = useState(null);
      const [selectedFile, setSelectedFile] = useState(null);

      // Handle local file selection preview
      const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setSelectedFile(file);
          const reader = new FileReader();
          reader.onload = (event) => setLocalPreview(event.target.result);
          reader.readAsDataURL(file);
        }
      };

      const handleConfirmUpload = () => {
        if (!selectedFile) return;
        onFileUpload(slot.key, selectedFile);
        setSelectedFile(null);
        setLocalPreview(null);
      };

      return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between">
          <div>
            {/* Top Info Bar */}
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {slot.category}
                </span>
                <h3 className="font-bold text-sm text-white mt-1.5">{slot.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{slot.desc}</p>
                <div className="text-[10px] font-mono text-slate-500 mt-1">Slot Key: {slot.key}</div>
              </div>
              <div className="shrink-0">
                {isCustom ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                    Custom Override Active
                  </span>
                ) : (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    Default Asset
                  </span>
                )}
              </div>
            </div>

            {/* Image Preview Box */}
            <div className="relative bg-slate-950 p-3 flex items-center justify-center border-b border-slate-800 min-h-[160px]">
              <img
                src={localPreview || currentUrl}
                alt={slot.title}
                className="max-h-48 w-auto object-contain rounded-xl shadow-md border border-slate-800/80"
                onError={(e) => {
                  e.target.src = 'assets/logo.png';
                }}
              />
              {localPreview && (
                <div className="absolute top-4 left-4 bg-amber-500 text-black text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                  Local File Preview (Not Uploaded Yet)
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-4 space-y-4 text-xs">
              {/* Option A: File Upload to Firebase Storage */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="font-bold text-slate-300 flex items-center justify-between">
                  <span>Option A: Upload Image File</span>
                  <span className="text-[10px] font-normal text-slate-500">PNG, JPG, WebP</span>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-slate-800 file:text-emerald-400 hover:file:bg-slate-700 cursor-pointer"
                />

                {selectedFile && !isUploading && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400 truncate max-w-[200px]">
                      {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={handleConfirmUpload}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition"
                    >
                      Upload to Firebase Storage ↑
                    </button>
                  </div>
                )}

                {isUploading && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] text-emerald-400 font-bold">
                      <span>Uploading to Firebase Cloud Storage...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-1.5 transition-all duration-150" style={{ width: \`\${uploadProgress}%\` }}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Option B: Direct URL */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="font-bold text-slate-300">Option B: Paste Direct Image URL</div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://... image URL"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs outline-none focus:border-emerald-600 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => onSaveUrl(slot.key, urlInput)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs shrink-0"
                  >
                    Apply URL
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Revert Button if Custom */}
          {isCustom && (
            <div className="p-4 pt-0 text-right">
              <button
                type="button"
                onClick={() => onRevert(slot.key)}
                className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold underline"
              >
                Revert to Factory Default Image
              </button>
            </div>
          )}
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<MediaManagerApp />);
  </script>
</body>
</html>
`;

fs.writeFileSync(path.resolve(__dirname, '..', 'web', 'media-manager.html'), mediaManagerHtml, 'utf8');
console.log('✓ Successfully generated web/media-manager.html (' + Buffer.byteLength(mediaManagerHtml, 'utf8') + ' bytes)!');
