
import React, { useState, useMemo } from 'react';
import { SavedStyle } from '../types';

interface AdminDashboardProps {
  globalHistory: SavedStyle[];
  onSelectStyle: (style: SavedStyle) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ globalHistory, onSelectStyle }) => {
  const [activeTab, setActiveTab] = useState<'generations' | 'users'>('generations');

  const users = useMemo(() => {
    const userMap = new Map<string, { name: string, email: string, count: number, lastSeen: number }>();
    globalHistory.forEach(h => {
      if (h.userEmail) {
        const existing = userMap.get(h.userEmail);
        userMap.set(h.userEmail, {
          email: h.userEmail,
          name: h.userName || 'Unknown User',
          count: (existing?.count || 0) + 1,
          lastSeen: Math.max(existing?.lastSeen || 0, h.timestamp)
        });
      }
    });
    return Array.from(userMap.values()).sort((a, b) => b.lastSeen - a.lastSeen);
  }, [globalHistory]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-16 flex justify-between items-end">
        <div>
          <span className="text-[11px] font-bold text-rose-500 uppercase tracking-[0.3em] mb-4 block">Architectural Oversight</span>
          <h2 className="text-5xl sm:text-7xl font-serif-bold text-slate-900 tracking-tight leading-none">
            Admin Panel.
          </h2>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('generations')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'generations' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            All Generations
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            User Directory
          </button>
        </div>
      </div>

      {activeTab === 'generations' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {globalHistory.length === 0 ? (
            <div className="col-span-full py-40 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
              <p className="text-slate-400 font-medium italic">No global generations recorded yet.</p>
            </div>
          ) : (
            globalHistory.map((style) => (
              <div 
                key={style.id}
                className="group cursor-pointer flex flex-col"
                onClick={() => onSelectStyle(style)}
              >
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 shadow-xl shadow-slate-200 group-hover:shadow-2xl transition-all duration-500 mb-6">
                  <img 
                    src={style.originalImage} 
                    alt={style.styleName} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">{style.userName?.[0]}</div>
                       <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{style.userName}</span>
                    </div>
                    <span className="text-white font-serif-bold text-2xl leading-none">{style.styleName}</span>
                  </div>
                </div>
                
                <div className="px-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">{new Date(style.timestamp).toLocaleString()}</span>
                    <span className="text-[9px] font-black text-slate-300 uppercase">{style.userEmail}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-rose-500 transition-colors">
                    {style.styleName}
                  </h3>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-100">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Architect Name</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identifier (Email)</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Extractions</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map(u => (
                <tr key={u.email} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">{u.name[0]}</div>
                      <span className="text-sm font-black text-slate-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-sm font-medium text-slate-400">{u.email}</span>
                  </td>
                  <td className="px-10 py-8">
                    <span className="inline-flex px-3 py-1 bg-rose-50 text-rose-500 rounded-full text-[10px] font-black">{u.count}</span>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{new Date(u.lastSeen).toLocaleDateString()}</span>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-10 py-20 text-center text-slate-300 italic">No users registered yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
