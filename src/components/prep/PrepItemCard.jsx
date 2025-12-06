import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Edit2, Trash2, PackageSearch, StickyNote, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const PrepItemCard = ({ item, onUpdateStock, onEdit, onDelete, isSubmittingAction }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const currentStock = parseFloat(item.current_stock);
  const parLevel = parseFloat(item.par_level);

  let status = 'not-needed';
  let statusColor = 'border-green-500 dark:border-green-400';
  let statusIcon = <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400" />;
  let statusText = "Stock OK";

  if (isNaN(currentStock) || isNaN(parLevel)) {
    status = 'not-needed'; // Or some other default/error status
    statusIcon = <Info className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
    statusText = "Data N/A";
  } else if (currentStock === 0) {
    status = 'urgent';
    statusColor = 'border-red-500 dark:border-red-400';
    statusIcon = <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />;
    statusText = "Urgent";
  } else if (currentStock < parLevel) {
    status = 'needed';
    statusColor = 'border-yellow-500 dark:border-yellow-400';
    statusIcon = <Info className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />;
    statusText = "Needed";
  }
  
  // This ensures that item.status (from DB) is also considered if the derived status is not yet set
  // This can happen if data is fetched before a re-calculation
  if (item.status && (status === 'not-needed' && item.status !== 'not-needed')) {
    if (item.status === 'urgent') {
      statusColor = 'border-red-500 dark:border-red-400';
      statusIcon = <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />;
      statusText = "Urgent";
    } else if (item.status === 'needed') {
      statusColor = 'border-yellow-500 dark:border-yellow-400';
      statusIcon = <Info className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />;
      statusText = "Needed";
    }
  }


  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`bg-white dark:bg-gray-800/80 rounded-xl shadow-lg p-5 border-l-4 ${statusColor} flex flex-col h-full transition-all hover:shadow-xl backdrop-blur-sm`}
    >
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1 truncate" title={item.name}>{item.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded capitalize">
                {item.station || 'No station'}
              </span>
              <span className="flex items-center text-xs font-medium" title={statusText}>
                {statusIcon}
                <span className="ml-1 hidden sm:inline">{statusText}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Current Stock:</span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => onUpdateStock(item.id, 'current_stock', Math.max(0, (item.current_stock || 0) - 1))}
                disabled={isSubmittingAction}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center font-medium text-gray-800 dark:text-gray-100">{item.current_stock || 0}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => onUpdateStock(item.id, 'current_stock', (item.current_stock || 0) + 1)}
                disabled={isSubmittingAction}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Par Level:</span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => onUpdateStock(item.id, 'par_level', Math.max(0, (item.par_level || 0) - 1))}
                disabled={isSubmittingAction}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center font-medium text-gray-800 dark:text-gray-100">{item.par_level || 0}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => onUpdateStock(item.id, 'par_level', (item.par_level || 0) + 1)}
                disabled={isSubmittingAction}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {item.yield_quantity && item.yield_unit && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Yield:</span>
              <span className="text-gray-800 dark:text-gray-100">{item.yield_quantity} {item.yield_unit}</span>
            </div>
          )}
          {item.shelf_life_days && (
             <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Shelf Life:</span>
              <span className="text-gray-800 dark:text-gray-100">{item.shelf_life_days} days</span>
            </div>
          )}
        </div>

        {item.prep_item_ingredients?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center">
              <PackageSearch className="w-3.5 h-3.5 mr-1.5" /> Ingredients:
            </p>
            <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5 max-h-20 overflow-y-auto pr-2 custom-scrollbar">
              {item.prep_item_ingredients.map((ingredient) => (
                <li key={ingredient.id || ingredient.inventory_item_id} className="truncate">
                  {ingredient.quantity} {ingredient.unit || ingredient.inventory_items?.unit} - {ingredient.inventory_items?.name || 'Unknown Item'}
                </li>
              ))}
            </ul>
          </div>
        )}

        {item.notes && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p className="font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center">
              <StickyNote className="w-3.5 h-3.5 mr-1.5" /> Notes:
            </p>
            <p className="whitespace-pre-wrap break-words max-h-20 overflow-y-auto pr-2 custom-scrollbar">{item.notes}</p>
          </div>
        )}
      </div>

      <div className="mt-auto flex justify-end space-x-2 border-t border-gray-200 dark:border-gray-700 pt-4 -mx-5 px-5">
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="text-blue-500 hover:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-400/20"
          title="Edit Item"
          disabled={isSubmittingAction}
        >
          <Edit2 className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-red-500 hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-400/20"
          title="Delete Item"
          disabled={isSubmittingAction}
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default PrepItemCard;