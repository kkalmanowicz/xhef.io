import React from "react";
import SuggestedItemCard from "@/components/orderlist/SuggestedItemCard";
import { Lightbulb, FilterX } from "lucide-react";

const SuggestedItemsTab = ({ items, loading, onAddToOrder, currentOrderItems, selectedVendor, selectedCategory }) => {
  const noFiltersApplied = !selectedVendor && !selectedCategory;

  if (loading && items.length === 0 && noFiltersApplied) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        Loading suggestions...
      </div>
    );
  }
  
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        {noFiltersApplied ? (
          <>
            <Lightbulb className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <p className="text-xl font-semibold">No suggestions right now!</p>
            <p>All your inventory items are at or above their par levels.</p>
          </>
        ) : (
          <>
            <FilterX className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <p className="text-xl font-semibold">No suggestions match your filters.</p>
            <p>Try adjusting or clearing the vendor/category filters.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <SuggestedItemCard
          key={item.id}
          item={item}
          onAddToOrder={() => onAddToOrder(item)}
          isAlreadyInOrder={currentOrderItems.some(orderItem => orderItem.inventory_item_id === item.id)}
        />
      ))}
    </div>
  );
};

export default SuggestedItemsTab;