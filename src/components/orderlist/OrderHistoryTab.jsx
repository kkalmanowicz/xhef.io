import React from "react";
import OrderHistoryCard from "@/components/orderlist/OrderHistoryCard";
import { History, FilterX } from "lucide-react";

const OrderHistoryTab = ({ orders, loading, selectedVendor, selectedCategory, onReorder }) => {
  const noFiltersApplied = !selectedVendor && !selectedCategory;

  if (loading && orders.length === 0 && noFiltersApplied) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        Loading order history...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        {noFiltersApplied ? (
          <>
            <History className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <p className="text-xl font-semibold">No past orders found.</p>
            <p>Completed orders will appear here.</p>
          </>
        ) : (
          <>
            <FilterX className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <p className="text-xl font-semibold">No past orders match your filters.</p>
            <p>Try adjusting or clearing the vendor/category filters.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <OrderHistoryCard key={order.id} order={order} onReorder={onReorder} />
      ))}
    </div>
  );
};

export default OrderHistoryTab;