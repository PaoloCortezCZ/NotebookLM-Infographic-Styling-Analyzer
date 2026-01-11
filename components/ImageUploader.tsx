
import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`relative w-full max-w-xl group transition-all duration-300 ${
        isDragging ? 'scale-105' : 'scale-100'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileInput}
        className="hidden" 
        accept="image/*"
      />
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center w-full h-80 px-6 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-50 shadow-indigo-100 shadow-2xl' 
            : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50 shadow-xl shadow-slate-200'
        }`}
      >
        <div className={`w-20 h-20 mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          isDragging ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-500'
        }`}>
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold text-slate-700 mb-2">Drop your image here</p>
          <p className="text-slate-500">or <span className="text-indigo-600 font-medium">click to browse</span> from your files</p>
        </div>
        <p className="mt-8 text-xs text-slate-400 uppercase tracking-widest font-semibold">Supports JPG, PNG, WEBP (Max 5MB)</p>
      </div>
    </div>
  );
};

export default ImageUploader;
