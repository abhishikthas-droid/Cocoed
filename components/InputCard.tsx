import React, { useState, useRef } from 'react';

interface InputCardProps {
  onGenerate: (query: string, filesData?: string[]) => void;
  isLoading: boolean;
}

const InputCard: React.FC<InputCardProps> = ({ onGenerate, isLoading }) => {
  const [query, setQuery] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<{name: string, data: string}[]>([]);
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
        return new Promise<{name: string, data: string}>((resolve) => {
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
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full">
      <h2 className="text-sm md:text-base font-medium text-gray-500 mb-1">
        Enter topic or upload notes
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={attachedFiles.length > 0 ? "Add instructions for the files (optional)..." : "e.g., Explain Ohm's Law for class 10"}
            disabled={isLoading}
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:bg-gray-50 disabled:text-gray-500 pr-12"
          />
        </div>

        {/* File Previews */}
        {attachedFiles.length > 0 && (
          <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
            {attachedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 overflow-hidden">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-blue-800 truncate">{file.name}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => removeFile(index)}
                  className="text-blue-400 hover:text-blue-600 focus:outline-none p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
             <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={triggerFileInput}
                    disabled={isLoading}
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors focus:outline-none group"
                    title="Upload files"
                >
                    <div className="p-2 rounded-full bg-gray-100 group-hover:bg-blue-50 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </div>
                    <span className="text-sm font-medium">Attach</span>
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                />
             </div>
             <p className="text-xs text-gray-400 mt-1 ml-1">Only supported English texts or notes only</p>
          </div>

          <button
            type="submit"
            disabled={isLoading || (!query.trim() && attachedFiles.length === 0)}
            className={`px-6 py-2.5 rounded-lg text-white font-medium text-sm transition-all ${
              isLoading || (!query.trim() && attachedFiles.length === 0)
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
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