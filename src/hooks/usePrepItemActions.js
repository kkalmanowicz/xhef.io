import { useState, useCallback } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useToast } from '@/components/ui/use-toast';

const usePrepItemActions = (
  prepItems,
  setPrepItems,
  fetchPrepItemsCallback
) => {
  const { supabase, userId } = useSupabase();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const calculateStatus = (currentStock, parLevel) => {
    const stock = parseFloat(currentStock);
    const par = parseFloat(parLevel);
    if (isNaN(stock) || isNaN(par)) return 'not-needed'; // Default if values are not numbers
    if (stock === 0) return 'urgent';
    if (stock < par) return 'needed';
    return 'not-needed';
  };

  const handleUpdateStock = async (itemId, field, newValue) => {
    setIsSubmittingAction(true);
    try {
      const itemToUpdate = prepItems.find(i => i.id === itemId);
      if (!itemToUpdate) throw new Error('Item not found');

      const updates = {
        [field]: newValue,
        updated_at: new Date().toISOString(),
      };

      let newStatus;
      if (field === 'current_stock') {
        newStatus = calculateStatus(newValue, itemToUpdate.par_level);
      } else if (field === 'par_level') {
        newStatus = calculateStatus(itemToUpdate.current_stock, newValue);
      }

      if (newStatus && newStatus !== itemToUpdate.status) {
        updates.status = newStatus;
      }

      const { error } = await supabase
        .from('prep_items')
        .update(updates)
        .eq('id', itemId)
        .eq('user_id', userId);

      if (error) throw error;

      // Optimistic update (or rely on realtime, but this provides quicker feedback)
      setPrepItems(prev =>
        prev.map(pi =>
          pi.id === itemId
            ? {
                ...pi,
                ...updates,
              }
            : pi
        )
      );

      toast({
        title: 'Success',
        description: `${field.replace('_', ' ')} updated successfully.`,
      });
    } catch (error) {
      console.error('Error updating prep item:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to update ${field.replace('_', ' ')}. ${error.message}`,
      });
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleDelete = async itemId => {
    setIsSubmittingAction(true);
    try {
      const { error } = await supabase
        .from('prep_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', userId);

      if (error) throw error;
      // Realtime should handle removal from list.
      // If not, uncomment: setPrepItems(prev => prev.filter(pi => pi.id !== itemId));
      toast({
        title: 'Success',
        description: 'Prep item deleted.',
      });
    } catch (error) {
      console.error('Error deleting prep item:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to delete prep item. ${error.message}`,
      });
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const openEditDialog = item => {
    setEditingItem(item);
    setIsAddDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingItem(null);
    setIsAddDialogOpen(true);
  };

  const closeDialog = () => {
    setIsAddDialogOpen(false);
    setEditingItem(null);
  };

  const handleFormSuccess = () => {
    // The fetchPrepItemsCallback is now handled by realtime updates
    // If direct refresh is needed: if (fetchPrepItemsCallback) fetchPrepItemsCallback(false);
    closeDialog();
  };

  return {
    isAddDialogOpen,
    editingItem,
    isSubmittingAction,
    handleUpdateStock,
    handleDelete,
    openEditDialog,
    openAddDialog,
    closeDialog,
    handleFormSuccess,
  };
};

export default usePrepItemActions;
