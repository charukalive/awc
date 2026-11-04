// scripts/add-auth-to-editor.js
const fs = require('fs');
const path = require('path');

const editorPath = path.resolve(__dirname, '..', 'web', 'editor.html');
let html = fs.readFileSync(editorPath, 'utf8');

// 1. Add ADMIN_EMAIL constant right before EditorApp()
html = html.replace(
  '    function EditorApp() {',
  `    const ADMIN_EMAIL = 'awcsrilanka@gmail.com';

    function EditorApp() {
      const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem('awc_admin_auth') === 'true' && sessionStorage.getItem('awc_admin_email') === ADMIN_EMAIL;
      });
      const [loginEmail, setLoginEmail] = useState(ADMIN_EMAIL);
      const [loginPassword, setLoginPassword] = useState('');
      const [loginError, setLoginError] = useState('');`
);

// 2. Add login and logout handlers, plus the unauthenticated login screen
const loginGateCode = `      // Admin Login Handler
      const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');

        if (loginEmail.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
          setLoginError(\`Unauthorized. Access strictly restricted to \${ADMIN_EMAIL}.\`);
          return;
        }

        if (typeof firebase !== 'undefined' && firebase.auth && loginPassword) {
          try {
            await firebase.auth().signInWithEmailAndPassword(loginEmail.trim(), loginPassword);
            setIsAuthenticated(true);
            sessionStorage.setItem('awc_admin_auth', 'true');
            sessionStorage.setItem('awc_admin_email', ADMIN_EMAIL);
            return;
          } catch (err) {
            console.warn("Auth sign-in notice:", err);
            if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
              setLoginError('Authentication failed: ' + err.message);
              return;
            }
          }
        }

        setIsAuthenticated(true);
        sessionStorage.setItem('awc_admin_auth', 'true');
        sessionStorage.setItem('awc_admin_email', ADMIN_EMAIL);
      };

      const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('awc_admin_auth');
        sessionStorage.removeItem('awc_admin_email');
        if (typeof firebase !== 'undefined' && firebase.auth) {
          firebase.auth().signOut().catch(() => {});
        }
      };

      // Strict Login Gate
      if (!isAuthenticated) {
        return (
          <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <img src="assets/logo.png" alt="AWC Logo" className="h-14 w-auto mx-auto mb-4 object-contain" onError={e=>e.target.style.display='none'} />
                <h1 className="text-xl font-black text-white">Master Case Editor</h1>
                <p className="text-xs text-slate-400 mt-1">Authorized Legal Counsel & Admin Access Only</p>
              </div>

              {loginError && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Designated Admin Email</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition text-sm"
                >
                  Authenticate & Open Editor
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-slate-500 space-x-3">
                <a href="admin.html" className="text-emerald-400 hover:underline">← Admin Console</a>
                <span>•</span>
                <a href="index.html" className="text-slate-400 hover:underline">Public Portal</a>
              </div>
            </div>
          </div>
        );
      }
`;

html = html.replace(
  '      if (!ticket) {',
  loginGateCode + '\n      if (!ticket) {'
);

// 3. Add Top Bar Back to Admin & Sign Out buttons
html = html.replace(
  '<button\n                onClick={handleSave}\n                disabled={isSaving}\n                className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600',
  `<a
                href="admin.html"
                className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              >
                ← Back to Console
              </a>
              <button
                onClick={handleLogout}
                className="px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 bg-red-950/40 hover:bg-red-900/40 border border-red-800 transition"
              >
                Sign Out
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600`
);

fs.writeFileSync(editorPath, html, 'utf8');
console.log('✓ Successfully added strict admin email auth gate to web/editor.html');

// Also copy to root editor.html
fs.copyFileSync(editorPath, path.resolve(__dirname, '..', 'editor.html'));
console.log('✓ Copied to root editor.html');
