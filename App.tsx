import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputCard from './components/InputCard';
import ResultView from './components/ResultView';
import SavedNotes from './components/SavedNotes';
import { generateStudyNotes } from './services/geminiService';
import { StudyNote, SavedNote, AppView } from './types';

const App: React.FC = () => {
  // State
  const [view, setView] = useState<AppView>(AppView.GENERATOR);
  const [currentNote, setCurrentNote] = useState<StudyNote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);

  // Load saved notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cocoed_saved_notes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Basic check to see if data matches new structure (has sections)
        // If it's old data, it might not render correctly, but we'll load it to avoid data loss
        // Ideally we would migrate data here.
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
      // Display the actual error message if available, otherwise a generic one
      const errorMessage = err.message || "An unexpected error occurred.";
      setError(`Failed to generate notes: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for saving notes
  const handleSave = () => {
    if (!currentNote) return;
    
    const newSavedNote: SavedNote = {
      ...currentNote,
      id: Date.now().toString(),
      timestamp: Date.now()
    };

    const updatedNotes = [newSavedNote, ...savedNotes];
    setSavedNotes(updatedNotes);
    localStorage.setItem('cocoed_saved_notes', JSON.stringify(updatedNotes));
  };

  // Check if current note is already saved
  const isCurrentNoteSaved = React.useMemo(() => {
    if (!currentNote) return false;
    return savedNotes.some(n => n.topic === currentNote.topic && n.timestamp === (currentNote as SavedNote).timestamp);
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
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header currentView={view} onChangeView={setView} />

      {/* Hero Section Background */}
      <div className="bg-[#3B82F6] h-64 md:h-80 w-full flex-shrink-0 pt-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            AI-powered study notes
          </h1>
          <p className="text-blue-100 text-sm md:text-base">
            For Kerala students (Class 8-12 • SCERT & CBSE)
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 -mt-20 md:-mt-24 pb-12 z-0">
        
        {view === AppView.GENERATOR && (
          <div className="space-y-6">
            <InputCard onGenerate={handleGenerate} isLoading={isLoading} />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            {currentNote && (
              <ResultView 
                note={currentNote} 
                onSave={handleSave} 
                isSaved={isCurrentNoteSaved} 
              />
            )}
            
            {!currentNote && !isLoading && !error && (
              <div className="text-center mt-12 text-gray-400">
                <p>Try searching for topics like "Photosynthesis", "Trigonometry Basics", or "Indian Constitution".</p>
              </div>
            )}
          </div>
        )}

        {view === AppView.SAVED && (
          <div className="space-y-6">
             {/* Spacer to push content down from the overlapping header style */}
             <div className="h-4"></div> 
             <SavedNotes 
               notes={savedNotes} 
               onDelete={handleDelete}
               onView={handleViewSaved}
             />
          </div>
        )}

      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Cocoed. Helping students learn smarter.</p>
      </footer>
    </div>
  );
};

export default App;