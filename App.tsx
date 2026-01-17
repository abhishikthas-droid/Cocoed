import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputCard from './components/InputCard';
import ResultView from './components/ResultView';
import SavedNotes from './components/SavedNotes';
import GlowOrb from './components/GlowOrb';
import { generateStudyNotes } from './services/geminiService';
import { StudyNote, SavedNote, AppView } from './types';
import { Sparkles, History, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [view, setView] = useState<AppView>(AppView.GENERATOR);
  const [currentNote, setCurrentNote] = useState<StudyNote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [showOrb, setShowOrb] = useState(true);
  const mainContentRef = React.useRef<HTMLDivElement>(null);
  const heroContentRef = React.useRef<HTMLDivElement>(null);

  // Custom slow scroll function
  const slowScrollTo = (element: HTMLElement, duration: number) => {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - 120; // Specific offset to match screenshot
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    const ease = (t: number, b: number, c: number, d: number) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    requestAnimationFrame(animation);
  };

  // Load saved notes from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOrb(false);
    }, 2000);

    const scrollTimer = setTimeout(() => {
      if (heroContentRef.current) {
        slowScrollTo(heroContentRef.current, 1500); // Slightly faster but still smooth
      }
    }, 2800);

    const saved = localStorage.getItem('cocoed_saved_notes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedNotes(parsed);
      } catch (e) {
        console.error("Failed to parse saved notes", e);
      }
    }
  }, []);

  // Handler for note generation
  const handleGenerate = async (query: string, files?: string[]) => {
    setIsLoading(true);
    setError(null);
    setCurrentNote(null);
    try {
      const note = await generateStudyNotes(query, files);
      setCurrentNote(note);
    } catch (err: any) {
      console.error("Generation failed:", err);
      const errorMessage = err.message || "An unexpected error occurred.";
      setError(`Failed to generate notes: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for saving notes
  const handleSave = () => {
    if (!currentNote) return;

    const timestamp = Date.now();
    const newSavedNote: SavedNote = {
      ...currentNote,
      id: Math.random().toString(36).substring(2, 11),
      timestamp: timestamp
    };

    console.log("Saving note:", newSavedNote);
    const updatedNotes = [newSavedNote, ...savedNotes];
    setSavedNotes(updatedNotes);
    localStorage.setItem('cocoed_saved_notes', JSON.stringify(updatedNotes));

    // Update currentNote to include the ID and timestamp so isSaved check passes
    setCurrentNote(newSavedNote);
  };

  // Check if current note is already saved
  const isCurrentNoteSaved = React.useMemo(() => {
    if (!currentNote) return false;
    // If it has an ID, it was either loaded from saved or just saved
    if ((currentNote as SavedNote).id) return true;

    return savedNotes.some(n =>
      n.topic.toLowerCase() === currentNote.topic.toLowerCase() &&
      n.sections.length === currentNote.sections.length &&
      n.sections[0]?.content.substring(0, 50) === currentNote.sections[0]?.content.substring(0, 50)
    );
  }, [currentNote, savedNotes]);

  // Handle deleting a saved note
  const handleDelete = (id: string) => {
    const updatedNotes = savedNotes.filter(n => n.id !== id);
    setSavedNotes(updatedNotes);
    localStorage.setItem('cocoed_saved_notes', JSON.stringify(updatedNotes));
  };

  // Handle viewing a saved note
  const handleViewSaved = (note: SavedNote) => {
    setCurrentNote(note);
    setView(AppView.GENERATOR);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <Header currentView={view} onChangeView={setView} />

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
      </div>

      <main className="flex-1 relative z-10 pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {view === AppView.GENERATOR && (
            <div className="space-y-12">
              {/* Hero Section */}
              <div className="text-center pt-8 md:pt-12">
                <div className={`orb-wrapper ${!showOrb ? 'collapsed animate-fade-out' : ''}`}>
                  <GlowOrb />
                </div>
                <div ref={heroContentRef} className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
                    AI-powered study notes
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                    For Kerala students <span className="text-primary opacity-80">(Class 8-12 • SCERT & CBSE)</span>
                  </p>
                </div>
              </div>

              {/* Generator UI */}
              <div ref={mainContentRef} className="max-w-2xl mx-auto space-y-8">
                <InputCard onGenerate={handleGenerate} isLoading={isLoading} />

                {error && (
                  <div className="glass flex items-center gap-3 border-red-500/30 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl text-sm animate-in fade-in slide-in-from-top-4 duration-300">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="font-medium">{error}</p>
                  </div>
                )}

                {currentNote && (
                  <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <ResultView
                      note={currentNote}
                      onSave={handleSave}
                      isSaved={isCurrentNoteSaved}
                    />
                  </div>
                )}

                {!currentNote && !isLoading && !error && (
                  <div className="flex flex-col items-center gap-4 text-slate-400 dark:text-slate-500 pt-8 opacity-60">
                    <Sparkles className="w-8 h-8" />
                    <p className="text-sm font-medium text-center max-w-sm">
                      Try searching for topics like "Photosynthesis", "Trigonometry Basics", or "Indian Constitution".
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {view === AppView.SAVED && (
            <div className="pt-8">
              <SavedNotes
                notes={savedNotes}
                onDelete={handleDelete}
                onView={handleViewSaved}
              />
            </div>
          )}
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-white/5 py-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 dark:text-slate-500 text-sm font-medium">
          <p>&copy; {new Date().getFullYear()} Cocoed. Helping Kerala students learn smarter.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-primary transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Terms</span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] uppercase tracking-widest font-bold">Helping students</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;