
import React from 'react';

interface TutorialProps {
  onBack: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onBack }) => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-20">
        <div className="inline-flex items-center gap-3 bg-rose-50 text-rose-500 px-4 py-2 rounded-full mb-6">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Official Guide</span>
        </div>
        <h2 className="text-6xl sm:text-7xl font-serif-bold text-slate-900 tracking-tight leading-none mb-8">
          DNA Integration.
        </h2>
        <p className="text-slate-500 text-2xl font-medium max-w-3xl leading-tight">
          Master the art of translating raw visual metadata into structured intelligence for <span className="text-slate-900">NotebookLM</span> and <span className="text-slate-900">Gemini</span> generation.
        </p>
      </div>

      <div className="grid gap-20">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="space-y-12">
            <section className="space-y-4">
              <h3 className="text-sm font-black text-rose-500 uppercase tracking-widest flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">01</span>
                The Architectural Source
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg font-medium">
                Find a style that resonates with your data's narrative. A technical blueprint fits engineering notes; a sumi-e wash suits philosophical inquiries.
              </p>
            </section>
            
            <section className="space-y-4">
              <h3 className="text-sm font-black text-rose-500 uppercase tracking-widest flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">02</span>
                Decoding Visual Semantics
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg font-medium">
                Our engine extracts the <span className="italic">Visual DNA</span>. This isn't just a list of colors; it's a semantic map of how the style communicates hierarchy, legibility, and mood.
              </p>
            </section>
          </div>

          <div className="bg-slate-50 rounded-[2rem] p-10 border border-slate-100 shadow-sm relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
               <svg className="w-24 h-24 text-slate-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Practical Example</h4>
            <div className="space-y-6">
               <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs font-mono text-slate-500 leading-relaxed">
                 <span className="text-rose-500 font-bold">PROMPT INPUT:</span><br/>
                 "Architect an infographic regarding 'Renewable Energy Grid Stability' using the extracted <span className="text-indigo-600 font-bold">STYLE #239 (Blueprint)</span>. Use cobalt background with sky-blue technical labels. Ensure hierarchy follows architectural drafting standards."
               </div>
               <p className="text-sm text-slate-500 font-medium">
                 By using specific style IDs and their corresponding DNA strings, you bypass vague AI interpretations and force precise aesthetic adherence.
               </p>
            </div>
          </div>
        </div>

        {/* Deep Dive Section */}
        <section className="border-t border-slate-100 pt-20">
          <h3 className="text-3xl font-serif-bold mb-10">Styling for NotebookLM</h3>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { 
                title: "Studio Summaries", 
                desc: "Paste the 'Tone' and 'Typography' DNA into the prompt box when generating summaries to get notes that read with specific authority." 
              },
              { 
                title: "Audio Overviews", 
                desc: "Use the 'Overall Tone' descriptors to tell NotebookLM's hosts how to sound (e.g., 'Objective and Modern')." 
              },
              { 
                title: "Source Citations", 
                desc: "Apply the 'Visual Identity' hex codes to your own presentation decks when exporting your research from the notebook." 
              }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-100/20 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-xs mb-6 group-hover:bg-rose-500 transition-colors">
                  0{i+1}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 p-12 rounded-[3rem] text-center">
          <h3 className="text-white text-3xl font-serif-bold mb-6">Ready to begin?</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={onBack}
              className="px-10 py-4 bg-rose-500 text-white rounded-full font-bold text-sm hover:bg-rose-600 transition-all shadow-2xl shadow-rose-500/20"
            >
              Start Analysis Engine
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Tutorial;
