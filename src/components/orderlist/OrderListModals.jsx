import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import AddToOrderDialog from "@/components/inventory/AddToOrderDialog";

const OrderListModals = ({
  modalState,
  handleCloseModal,
  totalOrderAmount,
  isCompletingOrder,
  executeCompleteOrder,
  itemToDelete,
  executeDeleteItem,
  selectedInventoryItem,
  isDeletingItem, 
}) => {
  const displayTotalOrderAmount = totalOrderAmount !== null && typeof totalOrderAmount !== 'undefined' ? totalOrderAmount : 0;

  return (
    <>
      {/* Complete Order Modal */}
      <Dialog open={modalState.isCompleteOrderOpen} onOpenChange={() => handleCloseModal('isCompleteOrderOpen')}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
          <DialogHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-center text-2xl font-bold text-gray-800 dark:text-white">Confirm Order Completion</DialogTitle>
            <DialogDescription className="text-center text-gray-600 dark:text-gray-300 pt-2">
              Are you sure you want to complete this order?
              <br />
              Total amount: <span className="font-semibold text-primary dark:text-primary-400">${displayTotalOrderAmount.toFixed(2)}</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-6 flex flex-col sm:flex-row sm:justify-center gap-2">
            <Button variant="outline" onClick={() => handleCloseModal('isCompleteOrderOpen')} disabled={isCompletingOrder} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              onClick={executeCompleteOrder}
              disabled={isCompletingOrder}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600"
            >
              {isCompletingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isCompletingOrder ? "Completing..." : "Complete Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Item Modal */}
      <Dialog open={modalState.isDeleteOpen} onOpenChange={() => handleCloseModal('isDeleteOpen')}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
          <DialogHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-center text-2xl font-bold text-gray-800 dark:text-white">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-center text-gray-600 dark:text-gray-300 pt-2">
              Are you sure you want to remove "{itemToDelete?.inventory_items?.name || 'this item'}" from your current order?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-6 flex flex-col sm:flex-row sm:justify-center gap-2">
            <Button variant="outline" onClick={() => handleCloseModal('isDeleteOpen')} disabled={isDeletingItem} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={executeDeleteItem}
              disabled={isDeletingItem}
              className="w-full sm:w-auto"
            >
              {isDeletingItem ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isDeletingItem ? "Deleting..." : "Delete Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add to Order Dialog (Uses its own state management for open/close based on prop) */}
      {selectedInventoryItem && (
         <AddToOrderDialog
            item={selectedInventoryItem}
            isOpen={modalState.isAddToOrderOpen}
            onClose={() => handleCloseModal('isAddToOrderOpen')}
         />
      )}
    </>
  );
};

export default OrderListModals;