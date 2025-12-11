import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useToast } from '@/components/ui/use-toast';

const usePrepItemsData = () => {
  const { supabase, userId } = useSupabase();
  const { toast } = useToast();
  const [prepItems, setPrepItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrepItems = useCallback(
    async (showLoading = true) => {
      if (!userId || !supabase) return;
      if (showLoading) setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('prep_items')
          .select(
            `
          *,
          prep_item_ingredients (
            *,
            inventory_items (
              name,
              unit
            )
          )
        `
          )
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPrepItems(data || []);
      } catch (error) {
        console.error('Error fetching prep items:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch prep items.',
        });
      } finally {
        if (showLoading) setIsLoading(false);
      }
    },
    [supabase, userId, toast]
  );

  useEffect(() => {
    fetchPrepItems();
  }, [fetchPrepItems]);

  useEffect(() => {
    if (!supabase || !userId) return;

    const prepItemsChannel = supabase
      .channel(`prep_items_user_${userId}_v2`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'prep_items',
          filter: `user_id=eq.${userId}`,
        },
        payload => {
          console.log('Prep items change received (prep_items):', payload);
          fetchPrepItems(false);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'prep_item_ingredients',
          filter: `user_id=eq.${userId}`,
        },
        payload => {
          console.log('Prep items change received (ingredients):', payload);
          fetchPrepItems(false);
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to prep_items_user_${userId}_v2`);
        }
        if (
          status === 'CHANNEL_ERROR' ||
          status === 'TIMED_OUT' ||
          status === 'CLOSED'
        ) {
          console.error(`Prep items channel error: ${status}`, err);
        }
      });

    return () => {
      supabase.removeChannel(prepItemsChannel);
    };
  }, [supabase, userId, fetchPrepItems]);

  return { prepItems, setPrepItems, isLoading, fetchPrepItems };
};

export default usePrepItemsData;
