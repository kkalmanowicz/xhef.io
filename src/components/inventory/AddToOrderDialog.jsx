import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSupabase } from "@/contexts/SupabaseContext";
import AddToOrderForm from "@/components/inventory/AddToOrderForm";
import AddToOrderItemInfo from "@/components/inventory/AddToOrderItemInfo";
import { ShoppingCart, Loader2, AlertTriangle } from "lucide-react";
import useExistingOrderItem from "@/hooks/useExistingOrderItem";

const AddToOrderDialog = ({ item, isOpen, onClose }) => {
  const { supabase, userId } = useSupabase();
  // This hook checks if the inventory item (from Suggested or Inventory page)
  // already exists as a pending order_item in the current order.
  const { existingOrderItem, isLoadingExisting, errorExisting } = useExistingOrderItem(item, isOpen, supabase, userId);

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 shadow-2xl rounded-lg">
        <DialogHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
            <ShoppingCart className="w-7 h-7 mr-3 text-primary" />
            {existingOrderItem ? "Update" : "Add"} "{item.name}" {existingOrderItem ? "in Order" : "to Order"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 pt-1">
            {existingOrderItem 
              ? "Adjust the quantity or price for this item already in your order." 
              : "Specify quantity and price. Current stock and par levels are shown for reference."}
            
            {isLoadingExisting && (
              <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                Verifying current order status...
              </span>
            )}
            {errorExisting && (
              <span className="flex items-center text-sm text-red-600 dark:text-red-400 mt-2">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Could not verify order status. Please try again.
              </span>
            )}
            {!isLoadingExisting && !errorExisting && existingOrderItem && (
              <span className="font-semibold text-yellow-600 dark:text-yellow-400 block mt-2">
                This item is already in your current order. You are editing its details.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 space-y-4">
          <AddToOrderItemInfo item={item} />
          
          {isLoadingExisting ? (
            <div className="flex flex-col justify-center items-center h-32">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="mt-3 text-gray-600 dark:text-gray-400">Loading item details...</p>
            </div>
          ) : (
            <AddToOrderForm
              item={item} // The inventory item details
              existingOrderItem={existingOrderItem} // The order_item if it exists, null otherwise
              onClose={onClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToOrderDialog;