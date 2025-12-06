import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

function PrepListItemCard({ item, localStock, onStockChange, onComplete, isUpdating }) {
  const currentDisplayStock = localStock[item.id] !== undefined ? localStock[item.id] : (item.current_stock || 0);
  const hasChanges = currentDisplayStock !== (item.current_stock || 0);
  const statusColor = item.status === 'urgent' ? 'border-red-500 dark:border-red-400' : 
                      item.status === 'needed' ? 'border-yellow-500 dark:border-yellow-400' : 
                      'border-green-500 dark:border-green-400';
  const statusIconColor = item.status === 'urgent' ? 'text-red-500 dark:text-red-400' :
                         item.status === 'needed' ? 'text-yellow-500 dark:text-yellow-400' :
                         'text-green-500 dark:text-green-400';


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border ${statusColor} relative transition-all hover:shadow-xl flex flex-col h-full`}
    >
      <div className="p-5 flex-grow">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1 truncate" title={item.name}>{item.name}</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded capitalize">
              {item.station || 'No station'}
            </span>
          </div>
          {item.status && (
            <div className={`p-1 rounded-full ${item.status === 'urgent' ? 'bg-red-100 dark:bg-red-700' : 'bg-yellow-100 dark:bg-yellow-700'}`}>
               {item.status === 'urgent' && <AlertTriangle className={`w-5 h-5 ${statusIconColor}`} />}
               {item.status === 'needed' && <Info className={`w-5 h-5 ${statusIconColor}`} />}
            </div>
          )}
        </div>

        <div className="space-y-3 text-sm mb-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Current Stock:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onStockChange(item.id, -1)}
                disabled={isUpdating || currentDisplayStock <= 0}
                className="h-7 w-7 shrink-0"
                aria-label="Decrease stock"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <span className={`min-w-[2.5rem] text-center text-base font-medium ${
                hasChanges ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-100'
              }`}>
                {currentDisplayStock}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onStockChange(item.id, 1)}
                disabled={isUpdating}
                className="h-7 w-7 shrink-0"
                aria-label="Increase stock"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Par Level:</span>
            <span className="font-medium text-gray-800 dark:text-gray-100">
              {item.par_level || 0} {item.yield_unit}
            </span>
          </div>
        </div>

        {item.prep_item_ingredients?.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Ingredients (per 1 {item.yield_unit || 'unit'}):
            </p>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5 list-disc list-inside max-h-20 overflow-y-auto pr-1">
              {item.prep_item_ingredients.map((ingredient) => (
                <li key={ingredient.id || ingredient.inventory_item_id} className="truncate" title={`${ingredient.quantity} ${ingredient.unit} ${ingredient.inventory_items?.name || 'Unknown Item'}`}>
                  {ingredient.quantity} {ingredient.unit} {ingredient.inventory_items?.name || 'Unknown Item'}
                </li>
              ))}
            </ul>
          </div>
        )}

        {item.notes && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-0.5">Notes:</p>
            <p className="whitespace-pre-wrap break-words max-h-16 overflow-y-auto pr-1">{item.notes}</p>
          </div>
        )}
      </div>

      <div className="mt-auto border-t border-gray-200 dark:border-gray-700 p-4 -mx-0">
        <Button
          variant={hasChanges ? "default" : "outline"}
          size="sm"
          onClick={() => onComplete(item)}
          disabled={isUpdating}
          className="w-full"
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          {isUpdating ? "Saving..." : (hasChanges ? "Save Stock Changes" : "No Stock Changes")}
        </Button>
      </div>
    </motion.div>
  );
}

export default PrepListItemCard;