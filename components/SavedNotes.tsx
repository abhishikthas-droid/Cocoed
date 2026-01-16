import React from 'react';
import { SavedNote } from '../types';
import { Book, FileText, Trash2, ExternalLink, Inbox } from 'lucide-react';

interface SavedNotesProps {
  notes: SavedNote[];
  onDelete: (id: string) => void;
  onView: (note: SavedNote) => void;
}

const SavedNotes: React.FC<SavedNotesProps> = ({ notes, onDelete, onView }) => {
  if (notes.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center border-white/20 dark:border-white/5">
        <div className="text-gray-300 dark:text-gray-600 mb-6 flex justify-center">
          <Inbox className="w-20 h-20" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">No Saved Notes</h3>
        <p className="text-gray-500 dark:text-gray-400">Your generated study notes will appear here once saved.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4 ml-1">
        <div className="p-2 bg-primary/20 rounded-lg text-primary">
          <Inbox className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold dark:text-white">Saved notes</h3>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {notes.map((note) => {
          const previewText = note.sections && note.sections.length > 0
            ? note.sections[0].content.substring(0, 100) + "..."
            : "No preview available.";

          return (
            <div
              key={note.id}
              className="glass-card rounded-2xl p-6 flex flex-col group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-white/20 dark:border-white/5"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white line-clamp-1" title={note.topic}>
                      {note.topic}
                    </h4>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-indigo-500/80">
                      Study Summary
                    </p>
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                  {previewText}
                </p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-white/5">
                <button
                  onClick={() => onView(note)}
                  className="flex items-center gap-2 text-primary font-bold text-sm hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Notes
                </button>
                <button
                  onClick={() => onDelete(note.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedNotes;