
import React, { useState, useMemo } from 'react';
import { VisualStyleDefinition, SavedStyle, UserSession } from '../types';

interface HomeDashboardProps {
  communityStyles: SavedStyle[];
  session: UserSession;
  onSelectStyle: (style: VisualStyleDefinition | SavedStyle) => void;
  onViewAllGallery: () => void;
  onViewAllCommunity: () => void;
}

const HomeDashboard: React.FC<HomeDashboardProps> = ({ 
  communityStyles, 
  session, 
  onSelectStyle,
  onViewAllGallery,
  onViewAllCommunity
}) => {
  const [communityFilter, setCommunityFilter] = useState<'latest' | 'popular' | 'yours'>('latest');

  const filteredCommunity = useMemo(() => {
    let list = [...communityStyles];
    if (communityFilter === 'popular') {
      list.sort((a, b) => b.totalScore - a.totalScore);
    } else if (communityFilter === 'yours') {
      list = list.filter(s => s.userEmail === session.email);
    } else {
      list.sort((a, b) => b.timestamp - a.timestamp);
    }
    return list.slice(0, 8); // Show more community items since presets are gone
  }, [communityStyles, communityFilter, session.email]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 space-y-24 py-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Community Section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">Live Community DNA Feed</span>
            </div>
            <h3 className="text-4xl font-serif-bold text-slate-900 tracking-tight">Recent Submissions</h3>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'latest', label: 'Latest' },
                { id: 'popular', label: 'Top Rated' },
                { id: 'yours', label: 'Your Shares' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setCommunityFilter(f.id as any)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    communityFilter === f.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button 
              onClick={onViewAllCommunity}
              className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-[0.2em] flex items-center gap-2 group"
            >
              Explore Full Library
              <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredCommunity.length > 0 ? (
            filteredCommunity.map((style) => (
              <StyleCard key={style.id} style={style} onSelect={() => onSelectStyle(style)} isCommunity />
            ))
          ) : (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/50">
              <p className="text-slate-400 font-medium italic">No DNA extractions shared yet. Be the first to analyze an image!</p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section for new users */}
      <section className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100">
        <div className="max-w-3xl">
          <h3 className="text-3xl font-serif-bold text-slate-900 mb-6">Build Your Style Repository.</h3>
          <p className="text-slate-500 text-lg leading-relaxed mb-8">
            This tool is designed for the visual architect. Drop any infographic, poster, or UI design above to extract its core DNA—colors, typography, and mood—and use it as a structural blueprint in NotebookLM or Gemini.
          </p>
          <div className="flex gap-4">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Extract</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Save</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-rose-500"></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Export</span>
             </div>
          </div>
        </div>
      </section>

    </div>
  );
};

// Explicitly typed as React.FC to fix the 'key' prop TypeScript error
const StyleCard: React.FC<{ style: any; onSelect: () => void; isCommunity?: boolean }> = ({ style, onSelect, isCommunity = false }) => (
  <div 
    className="group cursor-pointer"
    onClick={onSelect}
  >
    <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-100 shadow-xl shadow-slate-200 group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500 mb-5">
      <img 
        src={style.originalImage || style.previewImage} 
        alt={style.styleName} 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent opacity-60 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
        {isCommunity && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-[8px] font-bold text-white uppercase">{style.userName?.[0]}</div>
            <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest">{style.userName}</span>
          </div>
        )}
        <h4 className="text-white font-serif-bold text-lg leading-tight group-hover:text-rose-400 transition-colors">{style.styleName}</h4>
      </div>
      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg">
         <span className="text-[8px] font-black text-white">{style.totalScore} INDEX</span>
      </div>
    </div>
    <div className="px-2">
      <div className="flex flex-wrap gap-1">
        {style.tags?.slice(0, 2).map((t: string, i: number) => (
          <span key={i} className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">#{t.replace(/\s+/g, '')}</span>
        ))}
      </div>
    </div>
  </div>
);

export default HomeDashboard;
