import React from "react";

const OrderHistoryItem = ({ item }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
      <span className="text-sm text-gray-700 dark:text-gray-200">{item.inventory_items?.name || "Unknown Item"}</span>
      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        {item.quantity} {item.unit || item.inventory_items?.unit} @ ${parseFloat(item.price_per_unit || 0).toFixed(2)}/{item.unit || item.inventory_items?.unit}
        {item.total_price && (
            <span className="ml-2 font-medium text-gray-600 dark:text-gray-300">
                (Total: ${parseFloat(item.total_price).toFixed(2)})
            </span>
        )}
      </span>
    </div>
  );
};

export default OrderHistoryItem;