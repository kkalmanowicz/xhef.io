import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import CurrentOrderItemCard from "@/components/orderlist/CurrentOrderItemCard";
import { ShoppingCart, FilterX, LayoutGrid } from "lucide-react";

const CurrentOrderTab = ({ items, loading, onEditItem, onDeleteItem, selectedVendor, selectedCategory }) => {
  const noFiltersApplied = !selectedVendor && !selectedCategory;

  if (loading && items.length === 0 && noFiltersApplied) {
    return (
      <div className="flex justify-center items-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <ShoppingCart className="w-10 h-10 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        {noFiltersApplied ? (
          <>
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <p className="text-xl font-semibold">Your order list is empty.</p>
            <p>Add items from the 'Suggested' tab or your inventory.</p>
          </>
        ) : (
          <>
            <FilterX className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <p className="text-xl font-semibold">No items match your filters.</p>
            <p>Try adjusting or clearing the vendor/category filters.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {items.map((item) => (
          <CurrentOrderItemCard
            key={item.id}
            item={item}
            onEdit={() => onEditItem(item)}
            onDelete={() => onDeleteItem(item)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CurrentOrderTab;