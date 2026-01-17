import React from 'react';
import { StudyNote, SectionType } from '../types';
import { Printer, Save, Check, AlertTriangle, Lightbulb, Bookmark, FileText, ChevronRight } from 'lucide-react';

interface ResultViewProps {
  note: StudyNote;
  onSave: () => void;
  isSaved: boolean;
}

const ResultView: React.FC<ResultViewProps> = ({ note, onSave, isSaved }) => {

  const handlePrint = () => {
    window.print();
  };

  const getSectionStyles = (type: SectionType) => {
    switch (type) {
      case 'warning':
        return {
          container: 'bg-red-500/5 dark:bg-red-500/10 p-6 rounded-2xl border border-red-500/20',
          title: 'text-red-700 dark:text-red-400 font-bold mb-3 flex items-center gap-3',
          icon: <AlertTriangle className="w-5 h-5" />,
          text: 'text-gray-800 dark:text-gray-300'
        };
      case 'example':
        return {
          container: 'bg-blue-500/5 dark:bg-blue-500/10 p-6 rounded-2xl border border-blue-500/20',
          title: 'text-blue-800 dark:text-blue-400 font-bold mb-3 flex items-center gap-3',
          icon: <Lightbulb className="w-5 h-5" />,
          text: 'text-gray-700 dark:text-gray-300 italic'
        };
      case 'highlight':
        return {
          container: 'bg-purple-500/5 dark:bg-purple-500/10 p-6 rounded-2xl border border-purple-500/20',
          title: 'text-purple-800 dark:text-purple-400 font-bold mb-3 flex items-center gap-3',
          icon: <Bookmark className="w-5 h-5" />,
          text: 'text-gray-800 dark:text-gray-200'
        };
      default:
        return {
          container: 'py-4',
          title: 'text-primary dark:text-blue-400 font-bold mb-3 flex items-center gap-3',
          icon: <ChevronRight className="w-5 h-5" />,
          text: 'text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line'
        };
    }
  };

  return (
    <div className={`glass-card rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 print:shadow-none print:border-none transition-all duration-500 ${isSaved
        ? 'border-green-500/50 dark:border-green-500/30 ring-1 ring-green-500/20 scale-[1.01] shadow-xl shadow-green-500/5'
        : 'border-white/20 dark:border-white/5'
      }`}>
      <div className="p-6 md:p-8 flex justify-between items-center border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold dark:text-white">Generated Notes</h2>
            <p className="text-primary text-sm font-medium">{note.topic}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 no-print">
          <button
            onClick={handlePrint}
            className="p-3 glass rounded-xl text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-all shadow-sm"
            title="Print Notes"
          >
            <Printer className="w-5 h-5" />
          </button>

          <button
            onClick={onSave}
            disabled={isSaved}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all transform active:scale-95 ${isSaved
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default shadow-sm border border-green-200/50'
              : 'bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/20 hover:shadow-primary/40'
              }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 animate-in zoom-in duration-300" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Note</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-6 md:p-10 space-y-8 print:px-0">
        {note.sections.map((section, index) => {
          const styles = getSectionStyles(section.type);

          return (
            <section key={index} className={styles.container}>
              <h3 className={styles.title}>
                {styles.icon}
                {section.title}
              </h3>
              <div className={`${styles.text} text-sm md:text-base`}>
                {section.content}
              </div>
            </section>
          );
        })}

        {/* Footer for print only */}
        <div className="hidden print:block mt-12 text-center text-xs text-slate-400 border-t pt-6">
          Study smarter with Cocoed AI • {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ResultView;