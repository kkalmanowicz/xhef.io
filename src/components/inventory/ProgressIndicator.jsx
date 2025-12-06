import React from 'react';

const ProgressIndicator = ({ progress }) => {
  if (progress === null || progress === undefined) return null;

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 my-2">
      <div 
        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressIndicator;