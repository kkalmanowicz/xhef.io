import React from "react";
import { motion } from "framer-motion";
import { Trash2, PackagePlus as PackageIcon, ChefHat as ChefHatIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

function WasteListItem({ item, onDelete }) {
  const itemIcon = item.item_type === 'inventory' ? PackageIcon : ChefHatIcon;
  const itemName = item.item_type === 'inventory' 
    ? item.inventory_items?.name 
    : item.prep_items?.name;
  
  const itemUnit = item.item_type === 'inventory'
    ? item.inventory_items?.unit
    : item.prep_items?.yield_unit;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border-l-4 border-red-500"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-grow">
          <div className="flex items-center gap-2">
            <itemIcon className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
              {itemName || "Unknown Item"}
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Quantity: <span className="font-medium">{item.quantity}</span> {item.unit || itemUnit || ""}
          </p>
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            Cost: ${item.cost ? item.cost.toFixed(2) : '0.00'}
          </p>
          {item.reason && (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              Reason: {item.reason}
            </p>
          )}
          <p className="text-xs text-gray-400 dark:text-gray-500 pt-1">
            Wasted on: {new Date(item.created_at).toLocaleString()}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700 dark:hover:text-red-300">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

export default WasteListItem;