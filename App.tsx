
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { AnalysisState, VisualStyleDefinition, SavedStyle, UserSession } from './types';
import { analyzeImageStyle } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import StyleReport from './components/StyleReport';
import Gallery from './components/Gallery';
import Tutorial from './components/Tutorial';
import History from './components/History';
import Registration from './components/Registration';
import AdminDashboard from './components/AdminDashboard';
import HomeDashboard from './components/HomeDashboard';

const ADMIN_EMAILS = ['kotyza@gmail.com', 'pavel.kotyza@camstreamer.com'];

// Helper to resize/compress image to save LocalStorage space
const compressImage = (base64Str: string, maxWidth = 1200, maxHeight = 1200): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.8)); // Convert to compressed JPEG
    };
    img.onerror = () => resolve(base64Str); // Fallback to original
  });
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'gallery' | 'tutorial' | 'history' | 'admin'>('home');
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // Session Persistence
  const [session, setSession] = useState<UserSession>(() => {
    try {
      const saved = localStorage.getItem('style_architect_user');
      return saved ? JSON.parse(saved) : { username: '', email: '', isLoggedIn: false, hasKey: false, isAdmin: false };
    } catch (e) {
      return { username: '', email: '', isLoggedIn: false, hasKey: false, isAdmin: false };
    }
  });
  
  // Centralized Archive for all saved styles (Local & Public)
  const [archive, setArchive] = useState<SavedStyle[]>(() => {
    try {
      const saved = localStorage.getItem('style_architect_archive');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load archive from storage", e);
      return [];
    }
  });

  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null,
    imagePreview: null,
  });

  // Derived State: My Library (Only items belonging to current user)
  const userLibrary = useMemo(() => {
    return archive.filter(item => item.userEmail === session.email);
  }, [archive, session.email]);

  // Derived State: Community DNA (All public items from all users)
  const publicLibrary = useMemo(() => {
    return archive.filter(item => item.isPublic);
  }, [archive]);

  // Sync Archive to LocalStorage with Error Handling
  useEffect(() => {
    try {
      localStorage.setItem('style_architect_archive', JSON.stringify(archive));
      setSaveError(null);
    } catch (e) {
      if (e instanceof Error && e.name === 'QuotaExceededError') {
        setSaveError("Library Storage Full! Please delete some old extractions to save new ones.");
      } else {
        console.error("Storage persistence error", e);
      }
    }
  }, [archive]);

  // Sync Session to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('style_architect_user', JSON.stringify(session));
    } catch (e) {}
  }, [session]);

  // API Key Status Check
  useEffect(() => {
    const checkKey = async () => {
      if (session.isAdmin) {
        setSession(prev => ({ ...prev, hasKey: true }));
        return;
      }

      if ((window as any).aistudio?.hasSelectedApiKey) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (hasKey && session.isLoggedIn) {
          setSession(prev => ({ ...prev, hasKey: true }));
        }
      }
    };
    checkKey();
  }, [session.isLoggedIn, session.isAdmin]);

  const handleImageUpload = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      let base64 = e.target?.result as string;
      
      // CRITICAL: Compress image before processing to avoid memory/storage issues
      base64 = await compressImage(base64);

      setState(prev => ({ ...prev, isLoading: true, error: null, imagePreview: base64, result: null }));
      setCurrentView('home');

      try {
        const result = await analyzeImageStyle(base64);
        setState(prev => ({ ...prev, isLoading: false, result }));
      } catch (err) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: err instanceof Error ? err.message : 'An unexpected error occurred' 
        }));
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const saveToHistory = (sharePublicly: boolean = false) => {
    if (state.result && state.imagePreview) {
      const existingItemIndex = archive.findIndex(item => item.originalImage === state.imagePreview && item.userEmail === session.email);

      if (existingItemIndex > -1) {
        setArchive(prev => prev.map((item, idx) => 
          idx === existingItemIndex ? { ...item, isPublic: sharePublicly } : item
        ));
      } else {
        const newSaved: SavedStyle = {
          ...state.result,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          originalImage: state.imagePreview,
          userEmail: session.email,
          userName: session.username,
          isPublic: sharePublicly
        };
        setArchive(prev => [newSaved, ...prev]);
      }
    }
  };

  const handleImportStyles = (imported: SavedStyle[]) => {
    setArchive(prev => {
      // Intelligently merge by checking IDs to prevent duplicates
      const existingIds = new Set(prev.map(p => p.id));
      const newUnique = imported.filter(i => !existingIds.has(i.id));
      
      return [...newUnique, ...prev];
    });
  };

  const deleteFromHistory = (id: string) => {
    setArchive(prev => prev.filter(item => item.id !== id));
    // If we're viewing the item we just deleted, reset state
    if ((state.result as SavedStyle)?.id === id) {
      reset();
    }
  };

  const selectStyleFromGallery = useCallback((style: VisualStyleDefinition | SavedStyle) => {
    setState({
      isLoading: false,
      error: null,
      result: style,
      imagePreview: (style as any).originalImage || (style as any).previewImage || null,
    });
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const reset = () => {
    setState({
      isLoading: false,
      error: null,
      result: null,
      imagePreview: null,
    });
    setCurrentView('home');
    setSaveError(null);
  };

  const handleAuthComplete = (name: string, email: string, avatar: string) => {
    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
    setSession({ 
      username: name, 
      email, 
      avatar, 
      isLoggedIn: true, 
      hasKey: isAdmin,
      isAdmin
    });
  };

  const handleKeyConnected = () => {
    setSession(prev => ({ ...prev, hasKey: true }));
  };

  const handleLogout = () => {
    setSession({ username: '', email: '', isLoggedIn: false, hasKey: false, isAdmin: false });
    setCurrentView('home');
  };

  const archiveIdForCurrent = useMemo(() => {
    if (!state.imagePreview) return null;
    const found = archive.find(item => item.originalImage === state.imagePreview && item.userEmail === session.email);
    return found ? found.id : null;
  }, [state.imagePreview, archive, session.email]);

  if (!session.isLoggedIn || !session.hasKey) {
    return (
      <Registration 
        onComplete={handleAuthComplete} 
        onKeyConnected={handleKeyConnected}
        session={session}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      {saveError && (
        <div className="bg-rose-500 text-white text-[11px] font-black text-center py-2 px-4 sticky top-0 z-[60] flex items-center justify-center gap-4 animate-in slide-in-from-top duration-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          {saveError.toUpperCase()}
          <button onClick={() => setSaveError(null)} className="bg-white/20 px-2 py-0.5 rounded hover:bg-white/30">DISMISS</button>
        </div>
      )}
      <Header 
        activeView={currentView}
        username={session.username}
        avatar={session.avatar}
        isAdmin={session.isAdmin}
        onViewHome={() => setCurrentView('home')} 
        onViewInspiration={() => setCurrentView('gallery')} 
        onViewTutorial={() => setCurrentView('tutorial')}
        onViewHistory={() => setCurrentView('history')}
        onViewAdmin={() => setCurrentView('admin')}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow flex flex-col">
        {currentView === 'gallery' ? (
          <Gallery 
            onSelectStyle={selectStyleFromGallery} 
            communityStyles={publicLibrary} 
            onImportStyles={handleImportStyles}
          />
        ) : currentView === 'tutorial' ? (
          <Tutorial onBack={() => setCurrentView('home')} />
        ) : currentView === 'history' ? (
          <History 
            items={userLibrary} 
            onSelect={selectStyleFromGallery} 
            onDelete={deleteFromHistory}
            onToggleShare={(id, current) => {
              setArchive(prev => prev.map(item => item.id === id ? { ...item, isPublic: !current } : item));
            }}
          />
        ) : currentView === 'admin' && session.isAdmin ? (
          <AdminDashboard 
            globalHistory={archive} 
            onSelectStyle={selectStyleFromGallery}
          />
        ) : (
          <>
            {!state.imagePreview ? (
              <div className="flex-grow flex flex-col">
                <div className="flex flex-col items-center justify-center px-4 pt-20 pb-12 text-center space-y-12">
                  <div className="max-w-3xl space-y-6">
                    <div className="inline-flex items-center gap-2 bg-slate-50 text-slate-500 px-4 py-2 rounded-full mb-4">
                       <span className={`w-2 h-2 rounded-full ${session.isAdmin ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`}></span>
                       <span className="text-[10px] font-bold uppercase tracking-widest">
                         {session.isAdmin ? 'Super Admin Mode' : 'Architectural Session Active'}: {session.username}
                       </span>
                    </div>
                    <h2 className="text-6xl sm:text-8xl font-serif-bold tracking-tighter text-slate-900 leading-[0.9]">
                      Architect visual DNA.
                    </h2>
                    <p className="text-slate-500 text-xl sm:text-2xl font-medium max-w-xl mx-auto leading-relaxed">
                      Extract professional style definitions for <span className="text-slate-900 font-bold">NotebookLM</span> and <span className="text-slate-900 font-bold">Gemini Pro</span>.
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center gap-6 w-full max-w-xl">
                    <ImageUploader onUpload={handleImageUpload} />
                  </div>
                </div>

                <HomeDashboard 
                  communityStyles={publicLibrary}
                  session={session}
                  onSelectStyle={selectStyleFromGallery}
                  onViewAllGallery={() => setCurrentView('gallery')}
                  onViewAllCommunity={() => setCurrentView('gallery')}
                />
              </div>
            ) : (
              <div className="w-full flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
                <div className="w-full lg:w-1/2 p-6 sm:p-12 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] border-r border-slate-50 bg-[#fafafa]">
                  <div className="h-full flex flex-col">
                    <div className="mb-6 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reference Source</span>
                      </div>
                      <button onClick={reset} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        Discard
                      </button>
                    </div>
                    <div className="flex-grow flex items-center justify-center overflow-hidden">
                      <img 
                        src={state.imagePreview} 
                        alt="Style Source" 
                        className="max-w-full max-h-full object-contain rounded-lg shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-1/2 bg-white">
                  <StyleReport 
                    isLoading={state.isLoading} 
                    error={state.error} 
                    data={state.result} 
                    referenceImage={state.imagePreview}
                    onReset={reset}
                    onSave={() => saveToHistory(false)}
                    onShare={(share) => saveToHistory(share)}
                    onDelete={() => archiveIdForCurrent && deleteFromHistory(archiveIdForCurrent)}
                    isSaved={userLibrary.some(h => h.originalImage === state.imagePreview)}
                    isPublic={publicLibrary.some(p => p.originalImage === state.imagePreview && p.userEmail === session.email)}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
