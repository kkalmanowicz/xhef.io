import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, DollarSign, Package } from "lucide-react";

const CurrentOrderItemCard = ({ item, onEdit, onDelete }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-200 dark:border-gray-700 flex flex-col h-full transition-all hover:shadow-xl"
    >
      <div className="flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1 truncate" title={item.inventory_items?.name}>
          {item.inventory_items?.name || "Unknown Item"}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {item.inventory_items?.categories?.name || "N/A"} • {item.inventory_items?.vendors?.name || "N/A"}
        </p>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300 flex items-center">
              <Package className="w-4 h-4 mr-2 text-gray-500" />
              Quantity:
            </span>
            <span className="font-medium text-gray-800 dark:text-gray-100">
              {item.quantity} {item.inventory_items?.unit || item.unit}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300 flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
              Price/Unit:
            </span>
            <span className="font-medium text-gray-800 dark:text-gray-100">
              ${(item.price_per_unit || 0).toFixed(2)}
            </span>
          </div>
          {item.total_price !== null && typeof item.total_price !== 'undefined' && (
            <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
              <span className="text-gray-600 dark:text-gray-300 font-semibold">Item Total:</span>
              <span className="font-bold text-lg text-primary dark:text-primary-foreground">
                ${parseFloat(item.total_price).toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto flex justify-end space-x-2 border-t border-gray-200 dark:border-gray-700 pt-4 -mx-5 px-5">
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="text-blue-500 hover:bg-blue-500/10 dark:hover:bg-blue-500/20"
          title="Edit Item"
        >
          <Edit2 className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20"
          title="Delete Item"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default CurrentOrderItemCard;