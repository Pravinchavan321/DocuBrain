import React, { useState, useRef } from 'react';
import { useDocuments } from '../../context/DocumentContext';

const UploadBox = () => {
  const { upload, ingest, uploading, ingesting, setError, error } = useDocuments();
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndSetFile = (selectedFile) => {
    const allowedTypes = ['.pdf', '.txt', '.doc', '.docx', '.md'];
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    
    if (!allowedTypes.includes(ext)) {
      setError('Unsupported file type. Please upload PDF, TXT, DOCX, or MD.');
      return;
    }
    
    if (selectedFile.size > 20 * 1024 * 1024) {
      setError('File is too large. Maximum allowed size is 20MB.');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (uploading || ingesting) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (uploading || ingesting) return;
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || uploading || ingesting) return;
    const currentFile = file;
    setFile(null);
    try {
      const newDoc = await upload(currentFile);
      if (newDoc && newDoc._id) {
        await ingest(newDoc._id);
      }
    } catch (err) {
      // Error handled by context
    }
  };

  const isProcessing = uploading || ingesting;

  return (
    <section className="knowledge-panel">
      <div className="knowledge-panel-inner">
        <div className="knowledge-section-title-row">
          <div>
            <h2>Upload Document</h2>
            <p>Add PDFs, notes, and knowledge files to improve DocuBrain answers.</p>
          </div>
        </div>

        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`knowledge-upload-zone ${isDragging ? "drag-active" : ""} ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-400"></div>
              <p className="text-sm font-bold text-cyan-400 uppercase tracking-widest">
                {uploading ? 'Uploading to Server...' : 'Vectorizing Content...'}
              </p>
            </div>
          ) : (
            <div>
              <div className="knowledge-upload-icon text-2xl">☁</div>
              <h3 className="knowledge-upload-title">Drag and drop your file here</h3>
              <p className="knowledge-upload-subtitle">
                DocuBrain will parse, chunk, embed, and sync your document into the vector store for RAG-powered answers.
              </p>

              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="knowledge-browse-btn"
              >
                Browse Files
              </button>

              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileSelect}
                accept=".pdf,.txt,.doc,.docx,.md" 
                disabled={isProcessing}
              />

              <div className="knowledge-file-types">
                Supports PDF, TXT, DOCX, and Markdown (Max 20MB)
              </div>
            </div>
          )}
        </div>

        {file && !isProcessing && (
          <div className="mt-4 flex items-center justify-between p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">📄</div>
              <span className="text-sm text-[var(--text-primary)] font-bold truncate">{file.name}</span>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setFile(null)}
                className="text-[var(--text-secondary)] hover:text-red-400 p-1 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpload}
                className="px-4 py-1.5 bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-indigo-400 shadow-lg shadow-indigo-500/20 transition-all"
              >
                Start Sync
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center animate-in shake-1">
             ⚠️ {error}
          </div>
        )}
      </div>
    </section>
  );
};

export default UploadBox;
