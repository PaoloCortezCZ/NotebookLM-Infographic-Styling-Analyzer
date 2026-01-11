
import React, { useState, useEffect } from 'react';
import { UserSession } from '../types';

interface RegistrationProps {
  onComplete: (username: string, email: string, avatar: string, token: string) => void;
  onKeyConnected: () => void;
  session: UserSession;
}

const Registration: React.FC<RegistrationProps> = ({ onComplete, onKeyConnected, session }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isConnectingKey, setIsConnectingKey] = useState(false);
  const [view, setView] = useState<'landing' | 'connect-key'>('landing');
  const [error, setError] = useState<string | null>(null);

  // Replace this with your actual Google Client ID from Google Cloud Console
  const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

  useEffect(() => {
    // Handle initial landing if already partially logged in
    if (session.isLoggedIn && !session.hasKey) {
      setView('connect-key');
    }
  }, [session.isLoggedIn, session.hasKey]);

  const handleGoogleSuccess = async (token: string) => {
    setIsAuthenticating(true);
    setError(null);
    try {
      // If it's a real token, fetch user info
      if (!token.startsWith('mock_')) {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch user profile");
        const user = await res.json();
        onComplete(user.name, user.email, user.picture, token);
      } else {
        // Handle mock token for demo purposes
        onComplete("Guest Architect", "guest@example.com", "", token);
      }
      setIsAuthenticating(false);
      setView('connect-key');
    } catch (e) {
      setIsAuthenticating(false);
      setError("Google authentication failed. Please check your connection or try again.");
      console.error("Auth error:", e);
    }
  };

  const triggerGoogleLogin = () => {
    setError(null);
    
    // Check if GSI is available and ID is configured
    // @ts-ignore
    if (typeof google !== 'undefined' && google.accounts?.oauth2 && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
      try {
        // @ts-ignore
        const client = google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID, 
          scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
          callback: (res: any) => {
            if (res.error) {
              setError(`Google Error: ${res.error_description || res.error}`);
              return;
            }
            handleGoogleSuccess(res.access_token);
          }
        });
        client.requestAccessToken();
      } catch (err) {
        console.error("Client initialization failed", err);
        setError("Failed to initialize Google Login client.");
      }
    } else {
      // If no real Google ID is set, or script failed, provide a simulation bypass
      console.warn("Google Client ID not configured. Using simulated login.");
      setIsAuthenticating(true);
      setTimeout(() => {
        handleGoogleSuccess("mock_token_" + Date.now());
      }, 800);
    }
  };

  const handleConnectKey = async () => {
    setIsConnectingKey(true);
    try {
      if ((window as any).aistudio?.openSelectKey) {
        await (window as any).aistudio.openSelectKey();
        onKeyConnected();
      } else {
        // If the custom dialog isn't available, we assume the environment
        // handles API_KEY via process.env.API_KEY automatically
        onKeyConnected();
      }
    } catch (err) {
      console.error("Key connection error:", err);
    } finally {
      setIsConnectingKey(false);
    }
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
            <h2 className="text-2xl font-bold text-slate-900">Sign in with Google</h2>
            <p className="text-sm text-slate-400 mb-8">Login with Gmail to sync your architectural library to Google Sheets.</p>
            
            {error && (
              <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold mb-4 border border-rose-100">
                {error}
              </div>
            )}

            <button 
              onClick={triggerGoogleLogin} 
              disabled={isAuthenticating}
              className="w-full py-4 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-4 relative overflow-hidden"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isAuthenticating ? 'Authorizing...' : 'Continue with Google'}
              {isAuthenticating && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
            </button>

            {GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com' && (
              <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-4">
                Note: Simulated login will be used as Client ID is not configured.
              </p>
            )}
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
             <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Required for style extraction</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Registration;
