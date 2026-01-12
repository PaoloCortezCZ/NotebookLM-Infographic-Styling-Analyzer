
import React, { useState, useEffect } from 'react';
import { UserSession } from '../types';

interface RegistrationProps {
  onComplete: (username: string, email: string, avatar: string, token: string) => void;
  onKeyConnected: () => void;
  session: UserSession;
}

const DEFAULT_CLIENT_ID = '455135771650-gfvj7vbikg449rdel5camn8fqi6mgf96.apps.googleusercontent.com';
const FREE_PASS_EMAILS = ['kotyza@gmail.com', 'pavel.kotyza@camstreamer.com'];

const Registration: React.FC<RegistrationProps> = ({ onComplete, onKeyConnected, session }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isConnectingKey, setIsConnectingKey] = useState(false);
  const [view, setView] = useState<'setup' | 'connect-key' | 'bypass'>('setup');
  const [error, setError] = useState<string | null>(null);
  const [bypassEmail, setBypassEmail] = useState('');
  
  const [clientId, setClientId] = useState(() => localStorage.getItem('sa_google_client_id') || DEFAULT_CLIENT_ID);

  useEffect(() => {
    if (session.isLoggedIn && !session.hasKey) {
      setView('connect-key');
    }
  }, [session.isLoggedIn, session.hasKey]);

  const handleGoogleSuccess = async (token: string) => {
    setIsAuthenticating(true);
    setError(null);
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Could not retrieve profile.");
      const user = await res.json();
      onComplete(user.name, user.email, user.picture, token);
      setView('connect-key');
    } catch (e) {
      setError("Auth successful but profile fetch failed.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const triggerGoogleLogin = () => {
    localStorage.setItem('sa_google_client_id', clientId.trim());
    setError(null);
    
    // @ts-ignore
    if (typeof google !== 'undefined' && google.accounts?.oauth2) {
      try {
        // @ts-ignore
        const client = google.accounts.oauth2.initTokenClient({
          client_id: clientId.trim(), 
          scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          callback: (res: any) => {
            if (res.error) {
              if (res.error === 'access_denied') {
                setError("ACCESS DENIED: Add your email to 'Test Users' in Google Cloud Console.");
              } else if (res.error === 'invalid_client' || res.error === 'invalid_request') {
                setError("OAUTH ERROR: This environment prevents Google Login. Use 'Developer Pass' below.");
              } else {
                setError(`Google Error: ${res.error_description || res.error}`);
              }
              return;
            }
            handleGoogleSuccess(res.access_token);
          }
        });
        client.requestAccessToken();
      } catch (err) {
        setError("Identity system blocked. Use Developer Pass below.");
      }
    } else {
      setError("Google SDK not ready.");
    }
  };

  const handleBypassAccess = () => {
    const email = bypassEmail.trim().toLowerCase();
    if (FREE_PASS_EMAILS.includes(email)) {
      onComplete(email.split('@')[0], email, '', 'local_bypass_token');
    } else {
      setError("This email is not authorized for Developer Pass.");
    }
  };

  const handleConnectKey = async () => {
    setIsConnectingKey(true);
    try {
      if ((window as any).aistudio?.openSelectKey) {
        await (window as any).aistudio.openSelectKey();
        onKeyConnected();
      } else {
        onKeyConnected();
      }
    } catch (err) {
      setError("Key selection failed.");
    } finally {
      setIsConnectingKey(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="p-12 text-center">
          <div className="w-20 h-20 bg-[#0F172A] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 011-1V4z" />
            </svg>
          </div>
          
          {view === 'setup' ? (
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-serif-bold text-slate-900 mb-4 tracking-tighter">StyleArchitect.</h1>
                <p className="text-slate-500 text-sm">Workspace Authentication</p>
              </div>

              <div className="space-y-4">
                <input 
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-mono text-slate-600 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  placeholder="GCP Client ID"
                />

                {error && (
                  <div className="p-5 bg-rose-50 text-rose-600 rounded-2xl text-[11px] font-bold border border-rose-100 text-left leading-relaxed animate-in fade-in slide-in-from-top-2">
                    {error}
                  </div>
                )}

                <button 
                  onClick={triggerGoogleLogin} 
                  disabled={isAuthenticating}
                  className="w-full py-5 bg-[#0F172A] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95"
                >
                  {isAuthenticating ? 'Connecting...' : 'Connect Workspace'}
                </button>
                
                <div className="pt-6">
                  <button 
                    onClick={() => setView('bypass')}
                    className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline"
                  >
                    Bypass Login (Developer Pass Only)
                  </button>
                </div>
              </div>
            </div>
          ) : view === 'bypass' ? (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div>
                <h1 className="text-4xl font-serif-bold text-slate-900 mb-4 tracking-tighter">Developer Pass.</h1>
                <p className="text-slate-500 text-sm">Enter your authorized email to skip OAuth.</p>
              </div>

              <div className="space-y-4">
                <input 
                  type="email"
                  value={bypassEmail}
                  onChange={(e) => setBypassEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  placeholder="name@email.com"
                />

                {error && (
                  <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-[11px] font-bold border border-rose-100">
                    {error}
                  </div>
                )}

                <button 
                  onClick={handleBypassAccess}
                  className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl active:scale-95"
                >
                  Access Development Environment
                </button>
                
                <button 
                  onClick={() => { setView('setup'); setError(null); }}
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                >
                  Back to standard login
                </button>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed px-4">
                Note: In bypass mode, G-Vault sync is disabled. Style data is stored only in your local browser DNA bank.
              </p>
            </div>
          ) : (
            <div className="space-y-8 animate-in zoom-in-95 duration-500">
               <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
               </div>
               <div>
                 <h2 className="text-3xl font-serif-bold text-slate-900 mb-2">Workspace Linked</h2>
                 <p className="text-slate-500 text-sm">
                   Authenticated as <strong>{session.email}</strong>.<br/>Connect <strong>your</strong> Gemini Key for billing.
                 </p>
               </div>
               <button 
                 onClick={handleConnectKey} 
                 disabled={isConnectingKey} 
                 className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95"
               >
                  {isConnectingKey ? 'Connecting AI...' : 'Link My Gemini API Key'}
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Registration;
