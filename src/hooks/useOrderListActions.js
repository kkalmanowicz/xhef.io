import React, { useState, useCallback } from 'react';
import {
  updateOrderItemQuantity as updateQuantityService,
  updateOrderItemPrice as updatePriceService,
  deleteOrderItem as deleteItemService,
  completeOrder as completeOrderService
} from '@/services/orderService';

const useOrderListActions = (
  supabase, 
  userId, 
  currentOrder, 
  itemToDelete, 
  itemToEdit, 
  closeModalCallback, 
  navigate, 
  toast,
  loadCurrentOrder, // Add this
  loadSuggestedItems // Add this
) => {
  const [isCompletingOrder, setIsCompletingOrder] = useState(false);
  const [isDeletingItem, setIsDeletingItem] = useState(false);
  const [isSavingOrderItem, setIsSavingOrderItem] = useState(false);

  const handleUpdateOrderItem = useCallback(async (orderItemId, newQuantity, newPricePerUnit) => {
    if (!userId) {
      toast({ variant: "destructive", title: "Error", description: "User not identified. Please re-login." });
      return;
    }
    setIsSavingOrderItem(true);
    try {
      const { error: qtyError } = await updateQuantityService(supabase, orderItemId, newQuantity, newPricePerUnit);
      if (qtyError) throw qtyError;
      
      const { error: priceError } = await updatePriceService(supabase, orderItemId, newPricePerUnit, newQuantity);
      if (priceError) throw priceError;

      toast({ title: "Success", description: "Order item updated." });
      closeModalCallback('isEditOrderItemOpen');
      // Explicitly reload data for immediate UI update
      if (loadCurrentOrder) loadCurrentOrder(false);
      if (loadSuggestedItems) loadSuggestedItems(false);
    } catch (error) {
      console.error("Error updating order item:", error);
      toast({ variant: "destructive", title: "Error", description: error.message || "Failed to update order item." });
    } finally {
      setIsSavingOrderItem(false);
    }
  }, [supabase, userId, toast, closeModalCallback, loadCurrentOrder, loadSuggestedItems]);
  
  const executeDeleteItem = useCallback(async () => {
    if (!itemToDelete || !itemToDelete.id) {
      toast({ variant: "destructive", title: "Error", description: "No item selected for deletion." });
      return;
    }
    if (!userId) {
      toast({ variant: "destructive", title: "Error", description: "User not identified. Please re-login." });
      return;
    }
    setIsDeletingItem(true);
    try {
      const { error } = await deleteItemService(supabase, itemToDelete.id, userId);
      if (error) throw error;
      toast({ title: "Success", description: `"${itemToDelete.inventory_items?.name || 'Item'}" removed from order.` });
      // Explicitly reload data for immediate UI update
      if (loadCurrentOrder) loadCurrentOrder(false);
      if (loadSuggestedItems) loadSuggestedItems(false);
    } catch (error) {
      console.error("Error deleting order item:", error);
      toast({ variant: "destructive", title: "Error", description: `Failed to remove item: ${error.message}` });
    } finally {
      closeModalCallback('isDeleteOpen');
      setIsDeletingItem(false);
    }
  }, [supabase, itemToDelete, userId, closeModalCallback, toast, loadCurrentOrder, loadSuggestedItems]);

  const executeCompleteOrder = useCallback(async () => {
    if (!userId) {
      toast({ variant: "destructive", title: "Error", description: "User not identified. Please re-login." });
      return;
    }
    setIsCompletingOrder(true);
    try {
      const completedOrderData = await completeOrderService(supabase, userId, currentOrder);
      toast({ title: "Success", description: "Order completed successfully. Redirecting..." });
      // After completing order, real-time should pick up changes, or the navigation will show fresh state.
      // Explicit reloads might be redundant here if navigation is immediate.
      if (loadCurrentOrder) loadCurrentOrder(false);
      if (loadSuggestedItems) loadSuggestedItems(false);
      if (navigate && completedOrderData?.id) {
        navigate(`/dashboard/order/${completedOrderData.id}`);
      } else if (navigate) {
        navigate('/dashboard/order-list'); // Fallback if ID is missing
      }
    } catch (error) {
      console.error("Error completing order:", error);
      toast({ variant: "destructive", title: "Error", description: error.message || "Failed to complete order." });
    } finally {
      closeModalCallback('isCompleteOrderOpen');
      setIsCompletingOrder(false);
    }
  }, [supabase, userId, currentOrder, closeModalCallback, navigate, toast, loadCurrentOrder, loadSuggestedItems]);

  return {
    isCompletingOrder,
    isDeletingItem,
    isSavingOrderItem,
    handleUpdateOrderItem,
    executeDeleteItem,
    executeCompleteOrder,
  };
};

export default useOrderListActions;