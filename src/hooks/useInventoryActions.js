import React, { useState } from 'react';
import { deleteInventoryItemById } from '@/services/inventoryService';

const useInventoryActions = (supabase, userId, toast, onDeleteSuccess) => {
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const handleDeleteItem = async (itemId) => {
    if (!itemId || !userId) return;
    setIsSubmittingAction(true);
    try {
      const { data: orderItems, error: orderItemsError } = await supabase
        .from('order_items')
        .select('id')
        .eq('inventory_item_id', itemId)
        .eq('user_id', userId)
        .limit(1);

      if (orderItemsError) {
        throw new Error(`Failed to check order items: ${orderItemsError.message}`);
      }

      if (orderItems && orderItems.length > 0) {
        toast({
          variant: "destructive",
          title: "Deletion Blocked",
          description: "This item is part of one or more pending orders. Please remove it from those orders before deleting.",
        });
        setIsSubmittingAction(false);
        return;
      }

      const { data: orderHistoryItems, error: orderHistoryError } = await supabase
        .from('order_history')
        .select('id')
        .eq('inventory_item_id', itemId)
        .eq('user_id', userId)
        .limit(1);
      
      if (orderHistoryError) {
        throw new Error(`Failed to check order history: ${orderHistoryError.message}`);
      }

      if (orderHistoryItems && orderHistoryItems.length > 0) {
        toast({
          variant: "destructive",
          title: "Deletion Blocked",
          description: "This item exists in past order records and cannot be deleted to maintain history. Consider deactivating the item if it's no longer in use.",
        });
        setIsSubmittingAction(false);
        return;
      }
      
      const { data: prepItemIngredients, error: prepItemIngredientsError } = await supabase
        .from('prep_item_ingredients')
        .select('id')
        .eq('inventory_item_id', itemId)
        .eq('user_id', userId)
        .limit(1);

      if (prepItemIngredientsError) {
        throw new Error(`Failed to check prep item ingredients: ${prepItemIngredientsError.message}`);
      }

      if (prepItemIngredients && prepItemIngredients.length > 0) {
        toast({
          variant: "destructive",
          title: "Deletion Blocked",
          description: "This item is used as an ingredient in one or more prep items. Please remove it from those prep items before deleting.",
        });
        setIsSubmittingAction(false);
        return;
      }
      
      const { data: recipeIngredients, error: recipeIngredientsError } = await supabase
        .from('recipe_ingredients')
        .select('id')
        .eq('inventory_item_id', itemId)
        .eq('user_id', userId)
        .limit(1);
      
      if (recipeIngredientsError) {
        throw new Error(`Failed to check recipe ingredients: ${recipeIngredientsError.message}`);
      }

      if (recipeIngredients && recipeIngredients.length > 0) {
        toast({
          variant: "destructive",
          title: "Deletion Blocked",
          description: "This item is used as an ingredient in one or more recipes. Please remove it from those recipes before deleting.",
        });
        setIsSubmittingAction(false);
        return;
      }


      await deleteInventoryItemById(supabase, itemId, userId);
      toast({ title: "Success", description: "Item deleted successfully" });
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (error) {
      console.error("Error during delete operation:", error);
      toast({ variant: "destructive", title: "Error", description: error.message || "Failed to delete item" });
    } finally {
      setIsSubmittingAction(false);
    }
  };

  return {
    handleDeleteItem,
    isSubmittingAction,
  };
};

export default useInventoryActions;