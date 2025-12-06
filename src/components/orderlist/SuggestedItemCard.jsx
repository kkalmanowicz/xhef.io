import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShoppingCart, CheckCircle } from "lucide-react";

const SuggestedItemCard = ({ item, onAddToOrder, isAlreadyInOrder }) => {
  const urgencyStyles = {
    3: { border: "border-red-500 dark:border-red-400", text: "text-red-500 dark:text-red-400", bg: "bg-red-500 dark:bg-red-400" }, // High
    2: { border: "border-yellow-500 dark:border-yellow-400", text: "text-yellow-500 dark:text-yellow-400", bg: "bg-yellow-500 dark:bg-yellow-400" }, // Medium
    1: { border: "border-blue-500 dark:border-blue-400", text: "text-blue-500 dark:text-blue-400", bg: "bg-blue-500 dark:bg-blue-400" }, // Low
  };
  const currentStyle = urgencyStyles[item.urgency] || urgencyStyles[1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border-l-4 ${currentStyle.border} transition-all hover:shadow-xl`}
    >
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{item.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {item.categories?.name || "N/A"} • {item.vendors?.name || "N/A"}
            </p>
          </div>
          <Button
            onClick={onAddToOrder}
            disabled={isAlreadyInOrder}
            size="sm"
            className={`whitespace-nowrap transition-colors ${
              isAlreadyInOrder 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }`}
          >
            {isAlreadyInOrder ? <CheckCircle className="w-4 h-4 mr-2" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
            {isAlreadyInOrder ? "Added" : "Add to Order"}
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <div className={`flex items-center ${currentStyle.text}`}>
              <AlertTriangle className="w-4 h-4 mr-1.5" />
              <span>Current: {item.current_stock} {item.unit}</span>
            </div>
            <span className="text-gray-600 dark:text-gray-300">Par: {item.par_level} {item.unit}</span>
            <span className="font-medium text-gray-700 dark:text-gray-200">Need: {item.stock_difference} {item.unit}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${currentStyle.bg} transition-all duration-500`}
              style={{ width: `${Math.min(100, parseFloat(item.stock_percentage))}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SuggestedItemCard;