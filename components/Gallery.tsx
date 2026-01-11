
import React, { useState, useMemo, useRef } from 'react';
import { VisualStyleDefinition, SavedStyle } from '../types';
import { exportStylesToPDF } from '../services/pdfService';

interface GalleryProps {
  onSelectStyle: (style: VisualStyleDefinition | SavedStyle) => void;
  communityStyles?: SavedStyle[];
  onImportStyles?: (styles: SavedStyle[]) => void;
}

const Gallery: React.FC<GalleryProps> = ({ onSelectStyle, communityStyles = [], onImportStyles }) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    communityStyles.forEach(s => s.tags?.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [communityStyles]);

  const filteredCommunity = useMemo(() => {
    if (!selectedTag) return communityStyles;
    return communityStyles.filter(s => s.tags?.includes(selectedTag));
  }, [communityStyles, selectedTag]);

  const handleExportPDF = async () => {
    setIsExporting(true);
    await exportStylesToPDF(filteredCommunity, "Architect_DNA_Library");
    setIsExporting(false);
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(filteredCommunity, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `StyleDNA_Archive_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const imported = JSON.parse(content);
        const stylesToImport = Array.isArray(imported) ? imported : [imported];
        
        if (onImportStyles) {
          onImportStyles(stylesToImport);
          setImportStatus('success');
          setTimeout(() => setImportStatus('idle'), 3000);
        }
      } catch (err) {
        console.error("Failed to parse DNA file", err);
        setImportStatus('error');
        setTimeout(() => setImportStatus('idle'), 3000);
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-16 text-center">
        <span className="text-[11px] font-bold text-rose-500 uppercase tracking-[0.3em] mb-4 block">Personal & Community Archives</span>
        <h2 className="text-5xl sm:text-7xl font-serif-bold text-slate-900 tracking-tight leading-none mb-10">
          Infographic DNA.
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <button 
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${!selectedTag ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
            >
              All Categories
            </button>
            {allTags.map(tag => (
              <button 
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${selectedTag === tag ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".json" 
              onChange={handleFileChange} 
            />
            
            <button 
              onClick={handleImportClick}
              className={`flex items-center gap-2 px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border shadow-lg ${
                importStatus === 'success' ? 'bg-emerald-500 text-white border-emerald-500' :
                importStatus === 'error' ? 'bg-rose-500 text-white border-rose-500' :
                'bg-white text-slate-900 border-slate-200 hover:border-slate-400'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              {importStatus === 'success' ? 'Styles Imported!' : importStatus === 'error' ? 'Invalid DNA' : 'Import DNA File'}
            </button>

            <button 
              onClick={handleExportJSON}
              disabled={filteredCommunity.length === 0}
              className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export DNA Bundle
            </button>

            <button 
              onClick={handleExportPDF}
              disabled={isExporting || filteredCommunity.length === 0}
              className="whitespace-nowrap flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div> : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
              Export Library PDF
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-24">
        <section>
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-grow bg-slate-100"></div>
            <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.4em]">Personal & Shared Library</h3>
            <div className="h-px flex-grow bg-slate-100"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCommunity.length > 0 ? (
              filteredCommunity.map((style) => (
                <StyleGridItem key={style.id} style={style} onSelect={() => onSelectStyle(style)} isCommunity />
              ))
            ) : (
              <div className="col-span-full py-40 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
                <p className="text-slate-300 font-medium italic">Your style library is empty. Import a DNA file or analyze a new image to begin.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const StyleGridItem = ({ style, onSelect, isCommunity = false }: { style: any, onSelect: () => void, isCommunity?: boolean }) => (
  <div 
    className="group cursor-pointer flex flex-col"
    onClick={onSelect}
  >
    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 shadow-xl shadow-slate-200 group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500 mb-6">
      <img 
        src={style.originalImage || style.previewImage} 
        alt={style.styleName} 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
        {isCommunity && style.userName && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-[8px] font-bold text-white uppercase">{style.userName?.[0]}</div>
            <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest">{style.userName}</span>
          </div>
        )}
        <span className="text-white font-serif-bold text-2xl leading-tight group-hover:text-rose-400 transition-colors">{style.styleName}</span>
      </div>
      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg">
         <span className="text-[8px] font-black text-white">{style.totalScore} INDEX</span>
      </div>
    </div>
    
    <div className="px-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{style.styleId}</span>
        <div className="flex flex-wrap gap-1">
          {style.tags?.slice(0, 2).map((tag: string, i: number) => (
            <span key={i} className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">#{tag.replace(/\s+/g, '')}</span>
          ))}
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-rose-500 transition-colors mb-2">
        {style.styleName}
      </h3>
    </div>
  </div>
);

export default Gallery;
