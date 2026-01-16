import React from 'react';
import { SavedNote } from '../types';

interface SavedNotesProps {
  notes: SavedNote[];
  onDelete: (id: string) => void;
  onView: (note: SavedNote) => void;
}

const SavedNotes: React.FC<SavedNotesProps> = ({ notes, onDelete, onView }) => {
  if (notes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <div className="text-gray-300 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Saved Notes</h3>
        <p className="text-gray-500">Your saved study notes will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => {
        // Safe access to first section content for preview
        const previewText = note.sections && note.sections.length > 0 
          ? note.sections[0].content 
          : "No preview available.";

        return (
          <div key={note.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-5 flex flex-col">
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 mb-2 line-clamp-1" title={note.topic}>{note.topic}</h4>
              <p className="text-gray-500 text-sm mb-4 line-clamp-3">{previewText}</p>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
              <button
                onClick={() => onView(note)}
                className="text-blue-600 text-sm font-medium hover:text-blue-800"
              >
                View Note
              </button>
              <button
                onClick={() => onDelete(note.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Delete"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SavedNotes;