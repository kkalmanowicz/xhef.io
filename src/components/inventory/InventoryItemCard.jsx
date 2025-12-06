import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Edit3, Trash2, Package, Tag, Building, Barcode } from "lucide-react";

const InventoryItemCard = ({ item, onAddToOrder, onEdit, onDelete }) => {
  const stockStatusColor = () => {
    if (item.current_stock === null || item.par_level === null) return "bg-gray-400 dark:bg-gray-600";
    if (item.current_stock < item.par_level * 0.25) return "bg-red-500 dark:bg-red-700";
    if (item.current_stock < item.par_level) return "bg-yellow-500 dark:bg-yellow-600";
    return "bg-green-500 dark:bg-green-600";
  };

  const stockPercentage = () => {
    if (item.current_stock === null || item.par_level === null || item.par_level === 0) return 0;
    return Math.min(100, (item.current_stock / item.par_level) * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white truncate" title={item.name}>
            {item.name}
          </h3>
          {item.categories && (
            <Badge variant="outline" className="ml-2 whitespace-nowrap border-primary/50 text-primary dark:border-primary-400/50 dark:text-primary-400">
              <Tag className="w-3 h-3 mr-1" />
              {item.categories.name}
            </Badge>
          )}
        </div>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
          <div className="flex items-center">
            <Package className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
            <span>Stock: {item.current_stock ?? 'N/A'} / Par: {item.par_level ?? 'N/A'} {item.unit}</span>
          </div>
          {item.vendors && (
            <div className="flex items-center">
              <Building className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
              <span>Vendor: {item.vendors.name}</span>
            </div>
          )}
          {item.sku && (
            <div className="flex items-center">
              <Barcode className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
              <span>SKU: {item.sku}</span>
            </div>
          )}
          <div className="flex items-center">
            <span className="text-gray-400 dark:text-gray-500 mr-2">Price:</span>
            <span>
              Last: ${item.last_price?.toFixed(2) || 'N/A'} | Default: ${item.default_price?.toFixed(2) || 'N/A'}
            </span>
          </div>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-3">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ease-out ${stockStatusColor()}`}
            style={{ width: `${stockPercentage()}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="icon" onClick={onAddToOrder} className="text-primary border-primary hover:bg-primary/10 dark:text-primary-400 dark:border-primary-400 dark:hover:bg-primary-400/10" title="Add to Order">
            <ShoppingCart className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onEdit} className="text-blue-600 border-blue-600 hover:bg-blue-600/10 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-400/10" title="Edit Item">
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onDelete} className="text-red-600 border-red-600 hover:bg-red-600/10 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-400/10" title="Delete Item">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default InventoryItemCard;