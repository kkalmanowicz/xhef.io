import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const UploadResultsDisplay = ({ results }) => {
  if (!results) return null;

  return (
    <div className="mt-4 p-4 border rounded-md max-h-60 overflow-y-auto bg-gray-50 dark:bg-gray-800/50 custom-scrollbar">
      <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Upload Results:</h4>
      {results.successCount > 0 && (
        <div className="flex items-center text-green-600 dark:text-green-400 mb-2">
          <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span>{results.successCount} items uploaded successfully.</span>
        </div>
      )}
      {results.errors.length > 0 && (
        <div>
          <p className="text-red-600 dark:text-red-400 mb-1 font-medium flex items-center">
             <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
            {results.errors.length} error(s) occurred:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm pl-2">
            {results.errors.map((err, index) => (
              <li key={index} className="text-red-500 dark:text-red-400/90">
                Row {err.row}{err.item ? ` (Item: "${String(err.item).substring(0,30)}${String(err.item).length > 30 ? '...' : ''}")` : ''}: {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}
       {results.successCount === 0 && results.errors.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400">No items were processed. The file might be empty or not match the expected format.</p>
      )}
    </div>
  );
};

export default UploadResultsDisplay;