
import React, { useState } from 'react';

interface HeaderProps {
  activeView: string;
  username: string;
  avatar?: string;
  isAdmin: boolean;
  isSyncing?: boolean;
  hasCloud?: boolean;
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
  avatar,
  isAdmin,
  isSyncing,
  hasCloud,
  onViewHome, 
  onViewInspiration, 
  onViewTutorial, 
  onViewHistory,
  onViewAdmin,
  onLogout 
}) => {
  const getLinkClass = (view: string) => {
    return `relative py-2 px-1 cursor-pointer transition-colors ${
      activeView === view ? 'text-rose-500 font-bold' : 'hover:text-rose-500'
    }`;
  };

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={onViewHome}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isAdmin ? 'bg-rose-500' : 'bg-slate-900 group-hover:bg-rose-500'}`}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 011-1V4z" /></svg>
          </div>
          <h1 className="text-lg font-serif-bold tracking-tight text-slate-900">StyleArchitect</h1>
        </div>

        <div className="hidden lg:flex items-center space-x-10 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
          <span className={getLinkClass('gallery')} onClick={onViewInspiration}>Inspiration</span>
          <span className={getLinkClass('tutorial')} onClick={onViewTutorial}>NotebookLM Guide</span>
          <span className={getLinkClass('history')} onClick={onViewHistory}>My Library</span>
          {isAdmin && <span className={getLinkClass('admin')} onClick={onViewAdmin}>Admin</span>}

          <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
            {hasCloud && (
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                <span className={`w-1.5 h-1.5 bg-emerald-500 rounded-full ${isSyncing ? 'animate-ping' : ''}`}></span>
                <span className="text-[8px] text-emerald-600 font-black tracking-widest">G-VAULT ACTIVE</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-900">{username.toUpperCase()}</span>
                <span className="text-[8px] font-bold text-sky-500">G-SYNCED</span>
              </div>
              {avatar ? <img src={avatar} alt={username} className="w-8 h-8 rounded-full border border-slate-100" /> : <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">{username[0]}</div>}
            </div>
            <button onClick={onLogout} className="px-5 py-2 bg-slate-50 text-slate-600 border border-slate-100 rounded-full hover:bg-rose-50 hover:text-rose-600 transition-all text-[9px] font-bold">Sign Out</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
