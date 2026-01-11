
import React, { useState } from 'react';
import { VisualStyleDefinition, SavedStyle } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface StyleReportProps {
  isLoading: boolean;
  error: string | null;
  data: VisualStyleDefinition | SavedStyle | null;
  referenceImage: string | null;
  onReset: () => void;
  onSave?: () => void;
  onShare?: (share: boolean) => void;
  onDelete?: () => void;
  isSaved?: boolean;
  isPublic?: boolean;
}

const StyleReport: React.FC<StyleReportProps> = ({ 
  isLoading, 
  error, 
  data, 
  referenceImage,
  onReset, 
  onSave, 
  onShare,
  onDelete,
  isSaved,
  isPublic 
}) => {
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-6">
        <div className="w-12 h-12 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Architecting DNA</h3>
          <p className="text-slate-400 text-sm">Decoding visual semantics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] px-8 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Analysis Failed</h3>
        <p className="text-slate-500 text-sm mb-6">{error}</p>
        <button onClick={onReset} className="px-6 py-2 bg-slate-900 text-white rounded-full text-sm font-bold">Try Again</button>
      </div>
    );
  }

  if (!data) return null;

  const chartData = [
    { subject: 'Legibility', A: data.scores.legibility, fullMark: 10 },
    { subject: 'Hierarchy', A: data.scores.hierarchy, fullMark: 10 },
    { subject: 'Composition', A: data.scores.composition, fullMark: 10 },
    { subject: 'Theme Fit', A: data.scores.themeFit, fullMark: 10 },
    { subject: 'Impact', A: data.scores.visualImpact, fullMark: 10 },
  ];

  const copyToClipboard = () => {
    const text = document.getElementById('generation-prompt-box')?.innerText || "";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDNA = () => {
    const dnaData = {
      ...data,
      originalImage: referenceImage || (data as any).originalImage
    };
    const dataStr = JSON.stringify(dnaData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DNA_${data.styleName.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const styleIdLabel = data.styleId.toUpperCase().includes('STYLE') ? data.styleId : `STYLE #${data.styleId}`;

  const extractHex = (colorStr: string) => {
    const hexMatch = colorStr.match(/#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3}/);
    return hexMatch ? hexMatch[0] : '#cccccc';
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-10 bg-white animate-in fade-in duration-700">
      <div className="mb-10">
        <div className="flex justify-between items-start mb-4">
          <div className="text-[11px] font-bold text-rose-500 uppercase tracking-[0.2em]">
            {styleIdLabel}
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            <button 
              onClick={handleDownloadDNA}
              className="flex items-center gap-2 px-3 py-1 bg-white text-indigo-600 border border-indigo-100 rounded-full text-[10px] font-bold hover:bg-indigo-50 transition-all"
              title="Download portable JSON file for sharing"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              PORTABLE DNA
            </button>
            
            {onSave && !isSaved && (
              <button 
                onClick={onSave}
                className="flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-full text-[10px] font-bold hover:bg-rose-100 transition-all"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                SAVE TO LIBRARY
              </button>
            )}

            {isSaved && onDelete && (
               <button 
                onClick={onDelete}
                className="flex items-center gap-2 px-3 py-1 bg-slate-50 text-slate-500 border border-slate-100 rounded-full text-[10px] font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                DELETE
              </button>
            )}

            {onShare && (
              <button 
                onClick={() => onShare(!isPublic)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                  isPublic 
                  ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {isPublic ? 'UNSHARE DNA' : 'SHARE DNA'}
              </button>
            )}
          </div>
        </div>
        
        <h2 className="text-5xl sm:text-7xl font-serif-bold text-[#1a1a1a] leading-none tracking-tight mb-4">
          {data.styleName}
        </h2>

        <div className="flex flex-wrap gap-2 mb-8">
           {data.tags?.map((tag, i) => (
             <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest border border-slate-200">
               {tag}
             </span>
           ))}
        </div>

        {/* Visual Swatches & Quick DNA Breakdown */}
        <div className="space-y-6 mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Background</div>
              <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg shadow-inner border border-slate-100" style={{ backgroundColor: extractHex(data.visualIdentity.backgroundColor) }}></div>
                  <div className="text-[10px] font-mono text-slate-600 truncate">{data.visualIdentity.backgroundColor.split(' ')[0]}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Text</div>
              <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg shadow-inner border border-slate-100" style={{ backgroundColor: extractHex(data.visualIdentity.textColor) }}></div>
                  <div className="text-[10px] font-mono text-slate-600 truncate">{data.visualIdentity.textColor.split(' ')[0]}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Accent</div>
              <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg shadow-inner border border-slate-100" style={{ backgroundColor: extractHex(data.visualIdentity.accentColor) }}></div>
                  <div className="text-[10px] font-mono text-slate-600 truncate">{data.visualIdentity.accentColor.split(' ')[0]}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Typography</div>
              <div className="text-[11px] font-bold text-slate-900 leading-tight truncate">{data.typography.heading}</div>
            </div>
          </div>

          {/* Secondary Colors Section */}
          {data.visualIdentity.secondaryColors && data.visualIdentity.secondaryColors.length > 0 && (
            <div className="pt-4 border-t border-slate-50">
               <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-3">Secondary & Highlight Palette</div>
               <div className="flex flex-wrap gap-3">
                 {data.visualIdentity.secondaryColors.map((color, idx) => (
                   <div key={idx} className="flex items-center gap-2 bg-slate-50 pr-2 rounded-lg border border-slate-100">
                      <div className="w-6 h-6 rounded-l-lg shadow-inner" style={{ backgroundColor: extractHex(color) }}></div>
                      <div className="text-[9px] font-mono text-slate-500">{color.split(' ')[0]}</div>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-12 py-10 border-t border-slate-100">
          <div className="flex-none">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 pl-1">Style Index:</div>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black text-[#1a1a1a] leading-none tracking-tighter">{data.totalScore}</span>
              <span className="text-2xl font-bold text-slate-300">/ 50</span>
            </div>
            <div className="h-1.5 w-40 bg-slate-100 rounded-full mt-4 overflow-hidden">
               <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${(data.totalScore/50)*100}%` }}></div>
            </div>
          </div>

          <div className="flex-grow h-44 w-full sm:w-auto">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }} />
                <Radar
                  name="Style"
                  dataKey="A"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="#ef4444"
                  fillOpacity={0.15}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-4 w-1 bg-rose-500"></div>
          <h3 className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.2em]">Generation DNA Prompt</h3>
          <div className="flex-grow h-px bg-slate-100"></div>
        </div>

        <div className="relative group">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button 
              onClick={copyToClipboard}
              className={`flex items-center gap-1 px-4 py-1.5 rounded-lg border border-white/10 transition-all uppercase tracking-widest text-[9px] font-bold ${copied ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}
            >
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
               {copied ? 'Copied' : 'Copy DNA'}
            </button>
          </div>

          <div id="generation-prompt-box" className="bg-[#1a1a1a] rounded-2xl p-8 sm:p-10 shadow-2xl overflow-x-auto">
            <pre className="mono text-[13px] sm:text-[14px] text-white leading-[2.2] whitespace-pre-wrap">
              <span className="text-slate-500 font-bold">Overall Design Settings:</span>{"\n"}
              {"  "}Tone: <span className="text-emerald-400">"{data.overallDesignSettings.tone}"</span>{"\n\n"}
              
              <span className="text-slate-500 font-bold">Visual Identity:</span>{"\n"}
              {"  "}Background Color: <span className="text-sky-300">"{data.visualIdentity.backgroundColor}"</span>{"\n"}
              {"  "}Text Color: <span className="text-sky-300">"{data.visualIdentity.textColor}"</span>{"\n"}
              {"  "}Accent Color: <span className="text-sky-300">"{data.visualIdentity.accentColor}"</span>{"\n"}
              {"  "}Secondary Colors: <span className="text-sky-300">[{data.visualIdentity.secondaryColors?.map(c => `"${c}"`).join(', ')}]</span>{"\n\n"}
              
              <span className="text-slate-500 font-bold">Image Style:</span>{"\n"}
              {"  "}Features: <span className="text-emerald-400">"{data.imageStyle.features}"</span>{"\n"}
              {"  "}Texture: <span className="text-emerald-400">"{data.imageStyle.texture}"</span>{"\n"}
              {"  "}Composition: <span className="text-emerald-400">"{data.imageStyle.composition}"</span>{"\n"}
              {"  "}Lighting: <span className="text-emerald-400">"{data.imageStyle.lighting}"</span>{"\n"}
              {data.imageStyle.details.map((d, i) => (
                <React.Fragment key={i}>
                  {"  "}{d.label}: <span className="text-emerald-400">"{d.value}"</span>{"\n"}
                </React.Fragment>
              ))}
              {"\n"}
              <span className="text-slate-500 font-bold">Typography:</span>{"\n"}
              {"  "}Heading: <span className="text-amber-300">"{data.typography.heading}"</span>{"\n"}
              {data.typography.details.map((d, i) => (
                <React.Fragment key={i}>
                  {"  "}{d.label}: <span className="text-amber-300">"{d.value}"</span>{"\n"}
                </React.Fragment>
              ))}
              {"\n"}
              <span className="text-slate-500 font-bold">Categories:</span>{"\n"}
              {"  "}Tags: <span className="text-sky-300">[{data.tags?.map(t => `"${t}"`).join(', ')}]</span>
            </pre>
          </div>
        </div>

        {/* Detailed Breakdown with Image Reference */}
        <div className="mt-12 pt-10 border-t border-slate-100 grid md:grid-cols-2 gap-10">
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Architectural Details</h4>
            <div className="space-y-6">
              <div className="group">
                 <div className="text-[9px] font-bold text-rose-500 uppercase tracking-widest mb-1">Texture</div>
                 <p className="text-xs text-slate-600 font-medium leading-relaxed">{data.imageStyle.texture}</p>
              </div>
              <div className="group">
                 <div className="text-[9px] font-bold text-rose-500 uppercase tracking-widest mb-1">Composition</div>
                 <p className="text-xs text-slate-600 font-medium leading-relaxed">{data.imageStyle.composition}</p>
              </div>
              <div className="group">
                 <div className="text-[9px] font-bold text-rose-500 uppercase tracking-widest mb-1">Lighting</div>
                 <p className="text-xs text-slate-600 font-medium leading-relaxed">{data.imageStyle.lighting}</p>
              </div>
              {data.imageStyle.details.map((detail, i) => (
                <div key={i} className="group">
                   <div className="text-[9px] font-bold text-rose-500 uppercase tracking-widest mb-1">{detail.label}</div>
                   <p className="text-xs text-slate-600 font-medium leading-relaxed">{detail.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Style Reference Sample</h4>
             <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
               <img 
                 src={referenceImage || (data as any).originalImage || data.previewImage} 
                 alt="Texture Reference" 
                 className="w-full h-full object-cover"
               />
             </div>
             <p className="text-[10px] text-slate-400 font-medium italic text-center">Reference sample used for architectural extraction</p>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-10 border-t border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="h-4 w-1 bg-slate-900"></div>
          <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em]">DNA Summary</h3>
        </div>
        <button onClick={onReset} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Analyze New Image</button>
      </div>
    </div>
  );
};

export default StyleReport;
