import React from 'react';

const AddToOrderItemInfo = ({ item }) => {
  if (!item) return null;

  const isLowStock = item.current_stock < item.par_level;

  return (
    <div className="space-y-2 text-sm my-4 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-md border border-gray-200 dark:border-gray-600">
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-300 font-medium">Current Stock:</span>
        <span className={`font-semibold ${isLowStock ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-800 dark:text-gray-100'}`}>
          {item.current_stock ?? 'N/A'} {item.unit}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-300 font-medium">Par Level:</span>
        <span className="text-gray-800 dark:text-gray-100 font-semibold">
          {item.par_level ?? 'N/A'} {item.unit}
        </span>
      </div>
      {(item.default_price || item.last_price) && (
        <div className="flex justify-between pt-1 border-t border-gray-200 dark:border-gray-600 mt-2">
          <span className="text-gray-600 dark:text-gray-300 font-medium">Last/Default Price:</span>
          <span className="text-gray-800 dark:text-gray-100 font-semibold">
            ${(item.last_price || item.default_price || 0).toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
};

export default AddToOrderItemInfo;