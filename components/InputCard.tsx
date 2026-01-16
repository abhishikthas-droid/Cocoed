import React, { useState, useRef } from 'react';
import { Paperclip, Send, Loader2, X } from 'lucide-react';

interface InputCardProps {
  onGenerate: (query: string, filesData?: string[]) => void;
  isLoading: boolean;
}

const InputCard: React.FC<InputCardProps> = ({ onGenerate, isLoading }) => {
  const [query, setQuery] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<{ name: string, data: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() || attachedFiles.length > 0) {
      onGenerate(query, attachedFiles.map(f => f.data));
      setQuery('');
      setAttachedFiles([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const filePromises = Array.from(files).map(file => {
        return new Promise<{ name: string, data: string }>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              name: file.name,
              data: reader.result as string
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(filePromises).then(newFiles => {
        setAttachedFiles(prev => [...prev, ...newFiles]);
      });
    }
    // Reset the input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 w-full border-white/20 dark:border-white/5 transition-all duration-300">
      <h2 className="text-sm md:text-base font-medium text-gray-500 dark:text-gray-400 mb-4 ml-1">
        Enter topic or upload notes
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={attachedFiles.length > 0 ? "Add instructions for the files..." : "e.g., Explain Ohm's Law for class 10"}
            disabled={isLoading}
            className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 pr-12 text-sm md:text-base"
          />
        </div>

        {/* File Previews */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {attachedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-2 bg-primary/10 dark:bg-primary/20 px-3 py-1.5 rounded-full border border-primary/20 dark:border-primary/30">
                <Paperclip className="w-3.5 h-3.5 text-primary dark:text-blue-400" />
                <span className="text-xs font-medium text-primary dark:text-blue-200 truncate max-w-[120px]">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-primary/60 hover:text-primary dark:text-blue-400/60 dark:hover:text-blue-200 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={triggerFileInput}
                disabled={isLoading}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors focus:outline-none group px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-xl border border-transparent hover:border-primary/20"
              >
                <Paperclip className="w-5 h-5" />
                <span className="text-sm font-semibold">Attach</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
            </div>
            <p className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 mt-3 ml-1">Only supported English text or notes only</p>
          </div>

          <button
            type="submit"
            disabled={isLoading || (!query.trim() && attachedFiles.length === 0)}
            className={`px-8 py-3 rounded-xl font-bold text-sm md:text-base transition-all transform active:scale-95 ${isLoading || (!query.trim() && attachedFiles.length === 0)
                ? 'bg-gray-200 dark:bg-white/10 text-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20 hover:shadow-primary/40'
              }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" />
                Working...
              </span>
            ) : (
              'Generate Notes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputCard;