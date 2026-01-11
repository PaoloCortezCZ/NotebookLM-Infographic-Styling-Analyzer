
import React from 'react';

interface TutorialProps {
  onBack: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onBack }) => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-20">
        <div className="inline-flex items-center gap-3 bg-rose-50 text-rose-500 px-4 py-2 rounded-full mb-6">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
           <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Architecture Manual v3.5</span>
        </div>
        <h2 className="text-6xl sm:text-7xl font-serif-bold text-slate-900 tracking-tight leading-none mb-8">
          DNA Structure.
        </h2>
        <p className="text-slate-500 text-2xl font-medium max-w-3xl leading-tight">
          Deconstructing the <span className="text-slate-900">Generation DNA Prompt</span> into architectural components with <span className="text-rose-500">Adaptive Color Detection</span>.
        </p>
      </div>

      <div className="space-y-32">
        {/* Core Methodology Section - Now focusing on Structure */}
        <section className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-10">
            <div>
              <h3 className="text-3xl font-serif-bold text-slate-900 mb-4">The DNA Framework</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                To replicate a visual system perfectly, StyleArchitect breaks down aesthetics into data clusters. The engine now uses <strong>Adaptive Complexity Detection</strong> to determine how many secondary colors are needed to preserve the functional logic of your image.
              </p>
            </div>

            <div className="space-y-8">
              <div className="group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 rounded bg-rose-500 text-white flex items-center justify-center text-[10px] font-black">1</div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Overall Design Settings</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pl-9">
                  The atmospheric foundation. Tone: "Energetic, heroic, authoritative, and engagingly nostalgic."
                </p>
              </div>

              <div className="group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 rounded bg-indigo-500 text-white flex items-center justify-center text-[10px] font-black">2</div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Adaptive Visual Identity</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pl-9">
                  Minimalist images get exactly 2 secondary colors to reduce noise. Complex architecture diagrams extract up to 5 colors to capture category-specific logic.
                </p>
              </div>

              <div className="group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 rounded bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">3</div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Image Style Clusters</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pl-9">
                  Structural logic: "Vintage newsprint aesthetic, halftone screens, flat color fills with graphic heavy shadows."
                </p>
              </div>

              <div className="group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 rounded bg-amber-500 text-white flex items-center justify-center text-[10px] font-black">4</div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Typography DNA</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pl-9">
                  Information Hierarchy: "Heavy condensed display fonts for authority; legible sans-serif comic lettering for data nodes."
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <svg className="w-40 h-40 text-rose-500" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.97 4.44c-.31.17-.69.17-1 0l-7.97-4.44c-.32-.17-.53-.5-.53-.88v-9c0-.38.21-.71.53-.88l7.97-4.44c.31-.17.69-.17 1 0l7.97 4.44c.32.17.53.5.53.88v9z"/></svg>
             </div>
             <div className="relative z-10">
               <div className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-6">High-Complexity Schema Example</div>
               
               <div className="space-y-6 font-mono text-[11px] leading-relaxed max-h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10">
                 <div className="space-y-4">
                    <div className="text-white/40 uppercase tracking-widest text-[9px] border-b border-white/5 pb-2">Overall Design Settings</div>
                    <p className="text-emerald-400">Tone: "Professional, technical, multi-layered, and structured."</p>

                    <div className="text-white/40 uppercase tracking-widest text-[9px] border-b border-white/5 pb-2 pt-2">Visual Identity (Vibrant Diagram)</div>
                    <div className="grid grid-cols-2 gap-2 text-sky-300">
                       <div>Background: "#F8FAFC"</div>
                       <div>Text: "#0F172A"</div>
                       <div>Accent: "#3B82F6"</div>
                       <div>Secondary: ["#F43F5E", "#10B981", "#F59E0B", "#8B5CF6", "#64748B"]</div>
                    </div>

                    <div className="text-white/40 uppercase tracking-widest text-[9px] border-b border-white/5 pb-2 pt-2">Image Style</div>
                    <div className="space-y-2 text-white/80">
                       <p><span className="text-rose-400">Features:</span> "Color-coded grouping containers, directional flow arrows, distinct icon sets for data sources."</p>
                       <p><span className="text-rose-400">Texture:</span> "Clean digital vector, subtle drop shadows, semi-transparent overlays."</p>
                       <p><span className="text-rose-400">Composition:</span> "Horizontal processing flow with tiered support systems and feedback loops."</p>
                       <p><span className="text-rose-400">Lighting:</span> "Uniform global illumination, zero perspective shadow."</p>
                    </div>

                    <div className="text-white/40 uppercase tracking-widest text-[9px] border-b border-white/5 pb-2 pt-2">Typography</div>
                    <div className="space-y-2 text-amber-300">
                       <p>Heading: "Bold Sans-Serif (Inter), All-Caps section headers."</p>
                       <p>Body Font: "Monospace or High-Legibility Sans for technical labels."</p>
                    </div>
                 </div>
               </div>
             </div>
          </div>
        </section>

        {/* Detailed DNA Strands Breakdown Section */}
        <section className="border-t border-slate-100 pt-20">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 block">Strand Analysis</span>
            <h3 className="text-4xl font-serif-bold text-slate-900">Deconstructing the Clusters</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Overall Settings</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-6">Determines the emotional weight. A "Technical" tone forces NotebookLM to be objective, using the exact architectural logic extracted.</p>
              <div className="p-3 bg-slate-50 rounded-xl">
                 <div className="text-[9px] font-black text-rose-500 uppercase mb-1">Impact</div>
                 <div className="text-[10px] text-slate-600 font-bold italic">Mood Regulation</div>
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Visual Identity</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-6">Captures the functional palette. For diagrams with 5+ categories, it preserves up to 5 significant secondary colors while filtering noise.</p>
              <div className="p-3 bg-slate-50 rounded-xl">
                 <div className="text-[9px] font-black text-indigo-500 uppercase mb-1">Impact</div>
                 <div className="text-[10px] text-slate-600 font-bold italic">Chromatic Logic</div>
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Image Style</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-6">The structural blueprint. Defines 'Composition' and 'Flow' for Gemini to replicate layout density and diagrammatic logic.</p>
              <div className="p-3 bg-slate-50 rounded-xl">
                 <div className="text-[9px] font-black text-emerald-500 uppercase mb-1">Impact</div>
                 <div className="text-[10px] text-slate-600 font-bold italic">Structural Accuracy</div>
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Typography</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-6">The authority map. Ensures that your NotebookLM synthesis looks like it belongs within the visual ecosystem of the source.</p>
              <div className="p-3 bg-slate-50 rounded-xl">
                 <div className="text-[9px] font-black text-amber-500 uppercase mb-1">Impact</div>
                 <div className="text-[10px] text-slate-600 font-bold italic">Readability Logic</div>
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="text-center py-10">
           <div className="inline-block p-1 bg-slate-100 rounded-full mb-8">
             <div className="flex">
               <div className="w-3 h-3 rounded-full bg-rose-500 m-1"></div>
               <div className="w-3 h-3 rounded-full bg-indigo-500 m-1"></div>
               <div className="w-3 h-3 rounded-full bg-emerald-500 m-1"></div>
               <div className="w-3 h-3 rounded-full bg-amber-500 m-1"></div>
             </div>
           </div>
           <h3 className="text-3xl font-serif-bold mb-4 text-slate-900">Ready to Extract?</h3>
           <p className="text-slate-500 mb-10 max-w-xl mx-auto">Upload any diagram or style reference. Our engine adaptively balances detail and noise reduction.</p>
           <button 
              onClick={onBack}
              className="px-12 py-5 bg-slate-900 text-white rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-rose-500 transition-all shadow-2xl hover:scale-105 active:scale-95"
            >
              Initialize Analysis Engine
            </button>
        </section>
      </div>
    </div>
  );
};

export default Tutorial;
