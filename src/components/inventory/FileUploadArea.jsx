import React from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText } from 'lucide-react';

const FileUploadArea = ({ onDrop, files }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/10 dark:bg-primary/20' : 'border-gray-300 dark:border-gray-600 hover:border-primary/70 dark:hover:border-primary/50'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center text-center">
        <UploadCloud className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
        {files.length === 0 ? (
          <>
            <p className="font-semibold text-gray-700 dark:text-gray-300">Drag & drop a CSV file here, or click to select</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Max file size: 5MB. Only .csv files are accepted.</p>
          </>
        ) : (
          <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
            <FileText className="w-6 h-6 text-primary" />
            <span>{files[0].name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadArea;