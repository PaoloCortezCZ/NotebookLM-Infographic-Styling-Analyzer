
import React, { useState, useMemo } from 'react';
import { SavedStyle } from '../types';
import { exportStylesToPDF } from '../services/pdfService';

interface HistoryProps {
  items: SavedStyle[];
  onSelect: (item: SavedStyle) => void;
  onDelete: (id: string) => void;
  onToggleShare?: (id: string, currentStatus: boolean) => void;
}

const History: React.FC<HistoryProps> = ({ items, onSelect, onDelete, onToggleShare }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    items.forEach(s => s.tags?.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!selectedTag) return items;
    return items.filter(s => s.tags?.includes(selectedTag));
  }, [items, selectedTag]);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-40 text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        </div>
        <h2 className="text-4xl font-serif-bold text-slate-900 mb-4">Your library is empty.</h2>
        <p className="text-slate-400 max-w-sm mx-auto">Analyze images and save them to build your personal visual architectural library.</p>
      </div>
    );
  }

  const handleExport = async () => {
    setIsExporting(true);
    await exportStylesToPDF(filteredItems, `My_Library_${new Date().toISOString().split('T')[0]}`);
    setIsExporting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <div>
          <span className="text-[11px] font-bold text-rose-500 uppercase tracking-[0.3em] mb-4 block">Personal Archives</span>
          <h2 className="text-5xl sm:text-7xl font-serif-bold text-slate-900 tracking-tight leading-none mb-6">
            My Library.
          </h2>
          <p className="text-slate-500 text-lg max-w-xl font-medium">
            Your saved visual DNA extractions and architectural style definitions.
          </p>
        </div>
        
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all shadow-xl"
        >
          {isExporting ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div> : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          {isExporting ? 'Exporting...' : 'Download Library PDF'}
        </button>
      </div>

      {/* Categories Bar */}
      <div className="flex flex-wrap gap-2 mb-12">
        <button 
          onClick={() => setSelectedTag(null)}
          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${!selectedTag ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'}`}
        >
          All My Styles
        </button>
        {allTags.map(tag => (
          <button 
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${selectedTag === tag ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-400 border-slate-100'}`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredItems.map((style) => (
          <div 
            key={style.id}
            className="group cursor-pointer flex flex-col"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 shadow-xl shadow-slate-200 group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500 mb-6">
              <img 
                src={style.originalImage} 
                alt={style.styleName} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                onClick={() => onSelect(style)}
              />
              <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {onToggleShare && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggleShare(style.id, style.isPublic || false); }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${style.isPublic ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-white text-slate-400 hover:text-indigo-600'}`}
                    title={style.isPublic ? "Shared Publicly" : "Private Style"}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  </button>
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(style.id); }}
                  className="w-10 h-10 bg-white/90 backdrop-blur text-rose-500 rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                  title="Delete from Library"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex flex-col justify-end p-8">
                <span className="text-[9px] font-bold text-white/50 uppercase tracking-[0.3em] mb-2">Saved {new Date(style.timestamp).toLocaleDateString()}</span>
                <span className="text-white font-serif-bold text-2xl">{style.styleName}</span>
              </div>
            </div>
            
            <div className="px-2" onClick={() => onSelect(style)}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{style.styleId}</span>
                <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded">
                   <span className="text-[9px] font-bold text-slate-400">INDEX:</span>
                   <span className="text-xs font-black text-slate-900">{style.totalScore}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-rose-500 transition-colors mb-2">
                {style.styleName}
              </h3>
              <div className="flex flex-wrap gap-1">
                {style.tags?.map((tag, i) => (
                  <span key={i} className="text-[8px] font-bold text-slate-400 uppercase bg-slate-50 px-1.5 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
