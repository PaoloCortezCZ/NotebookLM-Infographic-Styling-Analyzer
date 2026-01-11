
import React, { useState } from 'react';
import { UserSession } from '../types';

interface RegistrationProps {
  onComplete: (username: string, email: string, avatar: string) => void;
  onKeyConnected: () => void;
  session: UserSession;
}

const ADMIN_EMAILS = ['kotyza@gmail.com', 'pavel.kotyza@camstreamer.com'];

const Registration: React.FC<RegistrationProps> = ({ onComplete, onKeyConnected, session }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isConnectingKey, setIsConnectingKey] = useState(false);
  const [view, setView] = useState<'landing' | 'login' | 'signup' | 'connect-key'>('landing');
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleLogin = (email: string, name: string) => {
    setIsAuthenticating(true);
    setTimeout(() => {
      onComplete(name, email, `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(' ', '')}`);
      setIsAuthenticating(false);
      const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
      if (isAdmin) {
        // Admins go straight in
      } else {
        setView('connect-key');
      }
    }, 800);
  };

  const handleConnectKey = async () => {
    setIsConnectingKey(true);
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      onKeyConnected();
    } else {
      onKeyConnected();
    }
    setIsConnectingKey(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
      </div>

      <div className="max-w-2xl w-full relative z-10 text-center space-y-8">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 011-1V4z" />
            </svg>
          </div>
          <h1 className="text-6xl font-serif-bold text-slate-900">StyleArchitect<span className="text-rose-500">.</span></h1>
          <p className="text-slate-500 font-medium">Professional Visual DNA Extraction Studio.</p>
        </div>

        {view === 'landing' && (
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Welcome to the Architect</h2>
            <p className="text-sm text-slate-400 mb-8">Each user needs to create a local account to save extractions to their library.</p>
            <div className="grid gap-3">
              <button onClick={() => setView('login')} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">Sign In</button>
              <button onClick={() => setView('signup')} className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all">Create Local Account</button>
            </div>
          </div>
        )}

        {(view === 'login' || view === 'signup') && (
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl text-left space-y-6 animate-in slide-in-from-bottom-2">
            <h2 className="text-2xl font-bold text-slate-900">{view === 'signup' ? 'Create Account' : 'Welcome Back'}</h2>
            <div className="space-y-4">
              {view === 'signup' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Full Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200" placeholder="e.g. John Doe" />
                </div>
              )}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Email Address</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200" placeholder="your@email.com" />
              </div>
              <button onClick={() => handleLogin(formData.email || 'guest@user.com', formData.name || 'Guest User')} disabled={isAuthenticating} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 flex items-center justify-center gap-2">
                {isAuthenticating && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                {view === 'signup' ? 'Create & Sign In' : 'Sign In'}
              </button>
              <button onClick={() => setView('landing')} className="w-full text-center text-slate-400 text-xs hover:text-slate-600">Back</button>
            </div>
          </div>
        )}

        {view === 'connect-key' && (
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl space-y-6 animate-in zoom-in-95">
             <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
             </div>
             <h2 className="text-2xl font-bold text-slate-900">Connect Gemini API</h2>
             <p className="text-sm text-slate-400">To use the analysis engine, you must connect your Gemini API key from Google AI Studio.</p>
             <button onClick={handleConnectKey} disabled={isConnectingKey} className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2">
                {isConnectingKey && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                Link Gemini API Key
             </button>
             <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Required for standard accounts</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Registration;
