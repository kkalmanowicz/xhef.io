import { useCallback } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useToast } from '@/components/ui/use-toast';

export const useDashboardActions = () => {
  const { supabase, userId } = useSupabase();
  const { toast } = useToast();

  const handleAddToOrderFromDashboard = useCallback(
    async item => {
      if (!item || !userId || !supabase) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Cannot add item to order. Missing information.',
        });
        return false;
      }

      const quantityToOrder = Math.max(
        0,
        (item.par_level || 0) - (item.current_stock || 0)
      );
      if (quantityToOrder <= 0) {
        toast({
          title: 'Info',
          description: `${item.name} is not below par or par is not set. No items added.`,
        });
        return false;
      }

      const pricePerUnit = item.last_price || item.default_price || 0;

      try {
        const { data: existingOrderItem, error: fetchError } = await supabase
          .from('order_items')
          .select('id, quantity')
          .eq('inventory_item_id', item.id)
          .eq('user_id', userId)
          .eq('status', 'pending')
          .is('order_id', null)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (existingOrderItem) {
          const newQuantity =
            (existingOrderItem.quantity || 0) + quantityToOrder;
          const { error: updateError } = await supabase
            .from('order_items')
            .update({
              quantity: newQuantity,
              price_per_unit: pricePerUnit,
              total_price: newQuantity * pricePerUnit,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingOrderItem.id);
          if (updateError) throw updateError;
          toast({
            title: 'Success',
            description: `${item.name} quantity updated in order (+${quantityToOrder} ${item.unit}).`,
          });
        } else {
          const { error: insertError } = await supabase
            .from('order_items')
            .insert({
              inventory_item_id: item.id,
              quantity: quantityToOrder,
              unit: item.unit,
              price_per_unit: pricePerUnit,
              total_price: quantityToOrder * pricePerUnit,
              status: 'pending',
              user_id: userId,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          if (insertError) throw insertError;
          toast({
            title: 'Success',
            description: `${quantityToOrder} ${item.unit} of ${item.name} added to order.`,
          });
        }

        if (item.last_price !== pricePerUnit && pricePerUnit > 0) {
          await supabase
            .from('inventory_items')
            .update({ last_price: pricePerUnit })
            .eq('id', item.id)
            .eq('user_id', userId);
        }
        return true;
      } catch (error) {
        console.error('Error adding item to order from dashboard:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Failed to add ${item.name} to order: ${error.message}`,
        });
        return false;
      }
    },
    [supabase, userId, toast]
  );

  return { handleAddToOrderFromDashboard };
};
