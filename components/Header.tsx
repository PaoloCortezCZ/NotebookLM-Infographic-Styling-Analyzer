
import React from 'react';

interface HeaderProps {
  activeView: string;
  username: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
  isSyncing?: boolean;
  hasCloud?: boolean;
  spreadsheetId?: string;
  onViewHome: () => void;
  onViewInspiration: () => void;
  onViewTutorial: () => void;
  onViewHistory: () => void;
  onViewAdmin: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  activeView, 
  username, 
  email,
  avatar,
  isAdmin,
  isSyncing,
  hasCloud,
  spreadsheetId,
  onViewHome, 
  onViewInspiration, 
  onViewTutorial, 
  onViewHistory,
  onViewAdmin,
  onLogout 
}) => {
  const getLinkClass = (view: string) => {
    return `relative py-2 px-1 cursor-pointer transition-all duration-300 ${
      activeView === view ? 'text-rose-500 font-bold' : 'hover:text-rose-500'
    }`;
  };

  const openVault = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (spreadsheetId && !spreadsheetId.startsWith('demo')) {
      window.open(`https://docs.google.com/spreadsheets/d/${spreadsheetId}`, '_blank');
    } else {
      alert("Google Vault is in simulation mode. Enter a real Google Cloud Client ID at login for live sync.");
    }
  };

  // Check if this account is one of the free-pass developer accounts
  const isDeveloperAccount = ['kotyza@gmail.com', 'pavel.kotyza@camstreamer.com'].includes(email.toLowerCase());

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={onViewHome}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ${isAdmin ? 'bg-rose-500 shadow-rose-200' : 'bg-slate-900 group-hover:bg-rose-500 shadow-lg group-hover:shadow-rose-100'}`}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 011-1V4z" /></svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-serif-bold tracking-tight text-slate-900 leading-none">StyleArchitect</h1>
            {isDeveloperAccount && (
              <span className="text-[7px] font-black text-rose-500 uppercase tracking-widest mt-1">Developer Pass Active</span>
            )}
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-10 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
          <span className={getLinkClass('gallery')} onClick={onViewInspiration}>Inspiration</span>
          <span className={getLinkClass('tutorial')} onClick={onViewTutorial}>NotebookLM Guide</span>
          <span className={getLinkClass('history')} onClick={onViewHistory}>My Library</span>
          {isAdmin && <span className={getLinkClass('admin')} onClick={onViewAdmin}>Admin</span>}

          <div className="flex items-center gap-6 pl-6 border-l border-slate-100">
            {hasCloud && (
              <button 
                onClick={openVault}
                className="group flex items-center gap-2.5 bg-emerald-50/50 px-4 py-2.5 rounded-full border border-emerald-100 hover:bg-emerald-100 transition-all duration-300"
              >
                <span className={`w-2 h-2 bg-emerald-500 rounded-full ${isSyncing ? 'animate-ping' : ''}`}></span>
                <span className="text-[10px] text-emerald-600 font-black tracking-widest uppercase">G-Vault Active</span>
                <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </button>
            )}
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[11px] font-black text-slate-900 tracking-[0.05em] leading-none mb-1.5">{username.toUpperCase()}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{email.toLowerCase()}</span>
              </div>
              <div className="relative">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center overflow-hidden shadow-sm ${isDeveloperAccount ? 'border-rose-400' : 'border-emerald-50'}`}>
                  {avatar ? (
                    <img src={avatar} alt={username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-sm tracking-tighter">G</span>
                  )}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full shadow-sm ${isDeveloperAccount ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
              </div>
            </div>
            
            <button 
              onClick={onLogout} 
              className="px-6 py-2.5 bg-slate-50 text-slate-500 border border-slate-100 rounded-full hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all text-[10px] font-black uppercase tracking-widest"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
