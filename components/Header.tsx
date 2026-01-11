
import React, { useState } from 'react';

interface HeaderProps {
  activeView: string;
  username: string;
  avatar?: string;
  isAdmin: boolean;
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
  onViewHome, 
  onViewInspiration, 
  onViewTutorial, 
  onViewHistory,
  onViewAdmin,
  onLogout 
}) => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const getLinkClass = (view: string) => {
    return `relative py-2 px-1 cursor-pointer transition-colors ${
      activeView === view ? 'text-rose-500 font-bold' : 'hover:text-rose-500'
    }`;
  };

  const tips = {
    gallery: "Discover 20+ architectural presets to jumpstart your project.",
    tutorial: "Learn the methodology of translating DNA into NotebookLM prompts.",
    history: "Access your previously analyzed and saved visual systems.",
    admin: "Super Admin: Manage users and view global generation history.",
  };

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={onViewHome}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isAdmin ? 'bg-rose-500' : 'bg-slate-900 group-hover:bg-rose-500'}`}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 011-1V4z" />
            </svg>
          </div>
          <h1 className="text-lg font-serif-bold tracking-tight text-slate-900">
            StyleArchitect
          </h1>
        </div>

        <div className="hidden lg:flex items-center space-x-12 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
          <div 
            className="relative"
            onMouseEnter={() => setHoveredLink('gallery')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <span className={getLinkClass('gallery')} onClick={onViewInspiration}>Inspiration</span>
            {hoveredLink === 'gallery' && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-slate-900 text-white text-[9px] p-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-1 z-50 normal-case tracking-normal">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                {tips.gallery}
              </div>
            )}
            {activeView === 'gallery' && <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-rose-500"></div>}
          </div>

          <div 
            className="relative"
            onMouseEnter={() => setHoveredLink('tutorial')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <span className={getLinkClass('tutorial')} onClick={onViewTutorial}>NotebookLM Guide</span>
            {hoveredLink === 'tutorial' && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-slate-900 text-white text-[9px] p-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-1 z-50 normal-case tracking-normal">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                {tips.tutorial}
              </div>
            )}
            {activeView === 'tutorial' && <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-rose-500"></div>}
          </div>

          <div 
            className="relative"
            onMouseEnter={() => setHoveredLink('history')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <span className={getLinkClass('history')} onClick={onViewHistory}>My Library</span>
            {hoveredLink === 'history' && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-slate-900 text-white text-[9px] p-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-1 z-50 normal-case tracking-normal">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                {tips.history}
              </div>
            )}
            {activeView === 'history' && <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-rose-500"></div>}
          </div>

          {isAdmin && (
            <div 
              className="relative"
              onMouseEnter={() => setHoveredLink('admin')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <span className={getLinkClass('admin')} onClick={onViewAdmin}>Admin</span>
              {hoveredLink === 'admin' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-rose-500 text-white text-[9px] p-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-1 z-50 normal-case tracking-normal">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-rose-500 rotate-45"></div>
                  {tips.admin}
                </div>
              )}
              {activeView === 'admin' && <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-rose-500"></div>}
            </div>
          )}

          <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className={`text-[9px] font-black ${isAdmin ? 'text-rose-500' : 'text-slate-900'}`}>{username.toUpperCase()}</span>
                <span className="text-[8px] font-bold text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  API ACTIVE
                </span>
              </div>
              {avatar ? (
                <img src={avatar} alt={username} className="w-8 h-8 rounded-full border border-slate-100" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                  {username[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <button 
              onClick={onLogout}
              className="px-5 py-2.5 bg-slate-50 text-slate-600 border border-slate-100 rounded-full hover:bg-rose-50 hover:text-rose-600 transition-all text-[10px] font-bold"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
