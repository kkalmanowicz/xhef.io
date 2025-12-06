import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import PrepItemCard from "@/components/prep/PrepItemCard";

const PrepItemList = ({ 
  isLoading, 
  filteredPrepItems, 
  selectedStation, 
  onUpdateStock, 
  onOpenEditDialog, 
  onDelete, 
  isSubmittingAction 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (filteredPrepItems.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-lg">No prep items found for "{selectedStation}" station.</p>
          {selectedStation === "all" && <p>Add some to get started!</p>}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPrepItems.map((item) => (
        <PrepItemCard
          key={item.id}
          item={item}
          onUpdateStock={onUpdateStock}
          onEdit={() => onOpenEditDialog(item)}
          onDelete={() => onDelete(item.id)}
          isSubmittingAction={isSubmittingAction}
        />
      ))}
    </div>
  );
};

export default PrepItemList;