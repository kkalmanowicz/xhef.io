import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";

const OrderListHeader = ({ currentOrderTotal, onCompleteOrder, isCompletingOrder, hasItems }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Order List</h1>
      {hasItems && (
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Total: ${(currentOrderTotal || 0).toFixed(2)}
          </span>
          <Button 
            onClick={onCompleteOrder}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
            disabled={isCompletingOrder || !hasItems}
          >
            {isCompletingOrder ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            {isCompletingOrder ? "Completing..." : "Complete Order"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderListHeader;