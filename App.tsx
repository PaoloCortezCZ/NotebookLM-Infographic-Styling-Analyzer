
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { AnalysisState, VisualStyleDefinition, SavedStyle, UserSession } from './types';
import { analyzeImageStyle } from './services/geminiService';
import { initializeUserSheet, appendStyleToSheet } from './services/googleService';
import { saveStyleLocal, getAllStylesLocal, deleteStyleLocal } from './services/dbService';
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

const compressImage = (base64Str: string, maxWidth = 1000, maxHeight = 1000): Promise<string> => {
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
      resolve(canvas.toDataURL('image/jpeg', 0.6));
    };
    img.onerror = () => resolve(base64Str);
  });
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'gallery' | 'tutorial' | 'history' | 'admin'>('home');
  const [isDbReady, setIsDbReady] = useState(false);
  
  const [session, setSession] = useState<UserSession>(() => {
    try {
      const saved = localStorage.getItem('style_architect_user');
      return saved ? JSON.parse(saved) : { username: '', email: '', isLoggedIn: false, hasKey: false, isAdmin: false };
    } catch (e) {
      return { username: '', email: '', isLoggedIn: false, hasKey: false, isAdmin: false };
    }
  });
  
  const [archive, setArchive] = useState<SavedStyle[]>([]);

  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null,
    imagePreview: null,
  });

  const userLibrary = useMemo(() => archive.filter(item => item.userEmail === session.email), [archive, session.email]);
  const publicLibrary = useMemo(() => archive.filter(item => item.isPublic), [archive]);

  // Load Archive from IndexedDB on startup
  useEffect(() => {
    const loadArchive = async () => {
      try {
        const styles = await getAllStylesLocal();
        setArchive(styles.sort((a, b) => b.timestamp - a.timestamp));
        setIsDbReady(true);
      } catch (e) {
        console.error("Failed to load IndexedDB archive", e);
        setIsDbReady(true); // Proceed anyway, just in-memory
      }
    };
    loadArchive();
  }, []);

  // Sync user info only to localStorage
  useEffect(() => {
    localStorage.setItem('style_architect_user', JSON.stringify(session));
  }, [session]);

  // Google Sheet Initialization
  useEffect(() => {
    if (session.isLoggedIn && session.googleAccessToken && !session.spreadsheetId) {
      const initCloud = async () => {
        try {
          const id = await initializeUserSheet(session.googleAccessToken!);
          setSession(prev => ({ ...prev, spreadsheetId: id }));
        } catch (e) {
          console.error("Cloud init failed", e);
        }
      };
      initCloud();
    }
  }, [session.isLoggedIn, session.googleAccessToken, session.spreadsheetId]);

  const handleImageUpload = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      let base64 = e.target?.result as string;
      base64 = await compressImage(base64);
      setState(prev => ({ ...prev, isLoading: true, error: null, imagePreview: base64, result: null }));
      setCurrentView('home');
      try {
        const result = await analyzeImageStyle(base64);
        setState(prev => ({ ...prev, isLoading: false, result }));
      } catch (err) {
        setState(prev => ({ ...prev, isLoading: false, error: err instanceof Error ? err.message : 'Analysis failed' }));
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const saveToHistory = async (sharePublicly: boolean = false) => {
    if (state.result && state.imagePreview) {
      const newSaved: SavedStyle = {
        ...state.result,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        originalImage: state.imagePreview,
        userEmail: session.email,
        userName: session.username,
        isPublic: sharePublicly
      };

      // 1. Update UI state
      setArchive(prev => [newSaved, ...prev]);

      // 2. Persist to IndexedDB (Support large files)
      try {
        await saveStyleLocal(newSaved);
      } catch (e) {
        console.error("IndexedDB save failed", e);
      }

      // 3. Sync to Google Sheets
      if (session.googleAccessToken && session.spreadsheetId) {
        setSession(prev => ({ ...prev, isSyncing: true }));
        try {
          await appendStyleToSheet(session.googleAccessToken, session.spreadsheetId, newSaved);
        } catch (e) {
          console.error("Cloud sync failed", e);
        } finally {
          setSession(prev => ({ ...prev, isSyncing: false }));
        }
      }
    }
  };

  const handleImportStyles = async (imported: SavedStyle[]) => {
    const existingIds = new Set(archive.map(p => p.id));
    const newUnique = imported.filter(i => !existingIds.has(i.id));
    
    setArchive(prev => [...newUnique, ...prev]);
    
    // Asynchronously save imports to IndexedDB to keep UI responsive
    for (const style of newUnique) {
      try {
        await saveStyleLocal(style);
      } catch (e) {
        console.error("Failed to persist imported style", e);
      }
    }
  };

  const deleteFromHistory = async (id: string) => {
    setArchive(prev => prev.filter(item => item.id !== id));
    try {
      await deleteStyleLocal(id);
    } catch (e) {
      console.error("Failed to delete from IndexedDB", e);
    }
    if ((state.result as SavedStyle)?.id === id) reset();
  };

  const selectStyleFromGallery = useCallback((style: VisualStyleDefinition | SavedStyle) => {
    setState({ 
      isLoading: false, 
      error: null, 
      result: style, 
      imagePreview: (style as any).originalImage || (style as any).previewImage || null 
    });
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const reset = () => {
    setState({ isLoading: false, error: null, result: null, imagePreview: null });
    setCurrentView('home');
  };

  const handleAuthComplete = (name: string, email: string, avatar: string, token: string) => {
    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
    setSession({ username: name, email, avatar, isLoggedIn: true, hasKey: isAdmin, isAdmin, googleAccessToken: token });
  };

  const handleKeyConnected = () => setSession(prev => ({ ...prev, hasKey: true }));
  const handleLogout = () => {
    setSession({ username: '', email: '', isLoggedIn: false, hasKey: false, isAdmin: false });
    localStorage.removeItem('style_architect_sheet_id');
    setCurrentView('home');
  };

  if (!session.isLoggedIn || !session.hasKey) {
    return <Registration onComplete={handleAuthComplete} onKeyConnected={handleKeyConnected} session={session} />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      <Header 
        activeView={currentView}
        username={session.username}
        avatar={session.avatar}
        isAdmin={session.isAdmin}
        isSyncing={session.isSyncing}
        hasCloud={!!session.spreadsheetId}
        onViewHome={() => setCurrentView('home')} 
        onViewInspiration={() => setCurrentView('gallery')} 
        onViewTutorial={() => setCurrentView('tutorial')}
        onViewHistory={() => setCurrentView('history')}
        onViewAdmin={() => setCurrentView('admin')}
        onLogout={handleLogout}
      />
      
      {!isDbReady && (
        <div className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] py-1 text-center sticky top-16 z-40">
          Initializing Architectural Local Vault...
        </div>
      )}

      <main className="flex-grow flex flex-col">
        {currentView === 'gallery' ? (
          <Gallery onSelectStyle={selectStyleFromGallery} communityStyles={publicLibrary} onImportStyles={handleImportStyles} />
        ) : currentView === 'tutorial' ? (
          <Tutorial onBack={() => setCurrentView('home')} />
        ) : currentView === 'history' ? (
          <History items={userLibrary} onSelect={selectStyleFromGallery} onDelete={deleteFromHistory} />
        ) : currentView === 'admin' && session.isAdmin ? (
          <AdminDashboard globalHistory={archive} onSelectStyle={selectStyleFromGallery} />
        ) : (
          <>
            {!state.imagePreview ? (
              <div className="flex-grow flex flex-col">
                <div className="flex flex-col items-center justify-center px-4 pt-20 pb-12 text-center space-y-12">
                  <div className="max-w-3xl space-y-6">
                    <h2 className="text-6xl sm:text-8xl font-serif-bold tracking-tighter text-slate-900 leading-[0.9]">Architect visual DNA.</h2>
                    <p className="text-slate-500 text-xl sm:text-2xl font-medium max-w-xl mx-auto leading-relaxed">
                      Sync to <span className="text-emerald-500 font-black">Google Sheets</span> & store large libraries in <span className="text-indigo-500 font-black">IndexedDB</span>.
                    </p>
                  </div>
                  <ImageUploader onUpload={handleImageUpload} />
                </div>
                <HomeDashboard communityStyles={publicLibrary} session={session} onSelectStyle={selectStyleFromGallery} onViewAllGallery={() => setCurrentView('gallery')} onViewAllCommunity={() => setCurrentView('gallery')} />
              </div>
            ) : (
              <div className="w-full flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
                <div className="w-full lg:w-1/2 p-6 sm:p-12 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] border-r border-slate-50 bg-[#fafafa]">
                  <div className="h-full flex flex-col">
                    <div className="mb-6 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reference Source</span>
                      <button onClick={reset} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Discard</button>
                    </div>
                    <img src={state.imagePreview} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl bg-white m-auto" alt="Source" />
                  </div>
                </div>
                <div className="w-full lg:w-1/2 bg-white">
                  <StyleReport isLoading={state.isLoading} error={state.error} data={state.result} referenceImage={state.imagePreview} onReset={reset} onSave={() => saveToHistory(false)} onShare={(s) => saveToHistory(s)} isSaved={userLibrary.some(h => h.originalImage === state.imagePreview)} isPublic={publicLibrary.some(p => p.originalImage === state.imagePreview && p.userEmail === session.email)} />
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
