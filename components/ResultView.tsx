import React from 'react';
import { StudyNote, SectionType } from '../types';

interface ResultViewProps {
  note: StudyNote;
  onSave: () => void;
  isSaved: boolean;
}

const ResultView: React.FC<ResultViewProps> = ({ note, onSave, isSaved }) => {
  
  const handlePrint = () => {
    window.print();
  };

  const getSectionStyles = (type: SectionType, index: number) => {
    switch (type) {
      case 'warning':
        return {
          container: 'bg-red-50/50 p-5 rounded-xl border border-red-100 print:border-red-300 print:bg-white',
          title: 'text-red-700 font-bold mb-2 flex items-center gap-2',
          badge: 'bg-red-100 text-red-600 print:border print:border-red-200',
          text: 'text-gray-800'
        };
      case 'example':
        return {
          container: 'bg-blue-50/50 p-5 rounded-xl border border-blue-50 print:border-blue-200 print:bg-white',
          title: 'text-blue-800 font-bold mb-2 flex items-center gap-2',
          badge: 'bg-blue-100 text-blue-600 print:border print:border-blue-200',
          text: 'text-gray-700 italic'
        };
      case 'highlight':
        return {
          container: 'bg-purple-50 p-5 rounded-xl border border-purple-100 print:border-purple-200 print:bg-white',
          title: 'text-purple-800 font-bold mb-2 flex items-center gap-2',
          badge: 'bg-purple-100 text-purple-600 print:border print:border-purple-200',
          text: 'text-gray-800'
        };
      case 'normal':
      default:
        return {
          container: 'py-2',
          title: 'text-blue-900 font-bold mb-2 flex items-center gap-2',
          badge: 'bg-blue-100 text-blue-600 print:border print:border-blue-200',
          text: 'text-gray-700 leading-relaxed whitespace-pre-line'
        };
    }
  };

  const renderIcon = (type: SectionType) => {
    if (type === 'warning') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-fade-in-up print:shadow-none print:border-none">
      <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center print:bg-white print:border-b-2 print:border-gray-800 print:px-0">
        <div className="overflow-hidden mr-4">
          <h2 className="text-blue-900 font-bold text-lg truncate print:text-black print:text-2xl">Generated Notes</h2>
          <p className="text-blue-600 text-sm truncate print:text-gray-600">{note.topic}</p>
        </div>
        
        <div className="flex items-center gap-2 no-print">
          <button
            onClick={handlePrint}
            className="text-gray-500 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors"
            title="Print Notes"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>
          
          <button
            onClick={onSave}
            disabled={isSaved}
            className={`text-sm px-4 py-2 rounded-lg font-medium transition-all shrink-0 ${
              isSaved 
                ? 'bg-green-100 text-green-700 cursor-default' 
                : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 hover:shadow-sm'
            }`}
          >
            {isSaved ? 'Saved ✓' : 'Save Note'}
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6 print:px-0">
        {note.sections.map((section, index) => {
          const styles = getSectionStyles(section.type, index);
          
          return (
            <section key={index} className={styles.container}>
              <h3 className={styles.title}>
                <span className={`${styles.badge} text-xs px-2 py-0.5 rounded-full font-mono min-w-[1.5rem] text-center`}>
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                {renderIcon(section.type)}
                {section.title}
              </h3>
              <div className={`${styles.text} pl-1`}>
                {section.content}
              </div>
              
              {/* Add separator if it's a normal section and not the last one */}
              {section.type === 'normal' && index < note.sections.length - 1 && (
                <hr className="border-gray-100 mt-6 print:border-gray-300" />
              )}
            </section>
          );
        })}
        
        {/* Footer for print only */}
        <div className="hidden print:block mt-8 text-center text-xs text-gray-400 border-t pt-4">
          Generated by Cocoed AI Study Platform
        </div>
      </div>
    </div>
  );
};

export default ResultView;