import React, { useEffect, useRef } from 'react';

const useOrderListRealtime = (
  supabase,
  userId,
  loadCurrentOrder,
  loadSuggestedItems,
  loadOrderHistory
) => {
  const loadCurrentOrderRef = useRef(loadCurrentOrder);
  const loadSuggestedItemsRef = useRef(loadSuggestedItems);
  const loadOrderHistoryRef = useRef(loadOrderHistory);

  useEffect(() => {
    loadCurrentOrderRef.current = loadCurrentOrder;
    loadSuggestedItemsRef.current = loadSuggestedItems;
    loadOrderHistoryRef.current = loadOrderHistory;
  }, [loadCurrentOrder, loadSuggestedItems, loadOrderHistory]);

  useEffect(() => {
    if (!userId || !supabase) return;

    const uniqueChannelSuffix = `_user_${userId}_${Date.now()}`;

    const handleOrderItemsChange = payload => {
      console.log(
        `Realtime: Order items change detected (v6${uniqueChannelSuffix})`,
        payload
      );
      loadCurrentOrderRef.current(false);
      loadSuggestedItemsRef.current(false);
    };

    const orderItemsChannel = supabase
      .channel(`order_items_realtime_hook_v6${uniqueChannelSuffix}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_items',
          filter: `user_id=eq.${userId}`,
        },
        handleOrderItemsChange
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log(
            `Realtime: Subscribed to order_items changes (hook v6${uniqueChannelSuffix})`
          );
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.error(
            `Realtime: Order items channel error (hook v6${uniqueChannelSuffix}):`,
            err
          );
        } else {
          console.log(
            `Realtime: Order items channel status (hook v6${uniqueChannelSuffix}):`,
            status
          );
        }
      });

    const handleInventoryChange = payload => {
      console.log(
        `Realtime: Inventory items change detected (v6${uniqueChannelSuffix})`,
        payload
      );
      loadSuggestedItemsRef.current(false);
      // Potentially reload current order if display depends on live inventory (e.g. current stock numbers shown, though usually order is a snapshot)
      // loadCurrentOrderRef.current(false); // Uncomment if needed
    };

    const inventoryChannel = supabase
      .channel(`inventory_items_realtime_hook_v6${uniqueChannelSuffix}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_items',
          filter: `user_id=eq.${userId}`,
        },
        handleInventoryChange
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log(
            `Realtime: Subscribed to inventory_items changes (hook v6${uniqueChannelSuffix})`
          );
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.error(
            `Realtime: Inventory items channel error (hook v6${uniqueChannelSuffix}):`,
            err
          );
        } else {
          console.log(
            `Realtime: Inventory items channel status (hook v6${uniqueChannelSuffix}):`,
            status
          );
        }
      });

    const handleOrdersChange = payload => {
      console.log(
        `Realtime: Orders table change detected (v6${uniqueChannelSuffix})`,
        payload
      );
      loadOrderHistoryRef.current(false);
      // When an order is completed/inserted, related order_items are typically deleted or updated.
      // The order_items_channel should catch these changes.
      // For robustness, we can explicitly reload current order and suggestions.
      if (
        payload.eventType === 'INSERT' ||
        (payload.eventType === 'UPDATE' && payload.new?.status === 'completed')
      ) {
        loadCurrentOrderRef.current(false);
        loadSuggestedItemsRef.current(false);
      }
    };

    const ordersChannel = supabase
      .channel(`orders_realtime_hook_v6${uniqueChannelSuffix}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${userId}`,
        },
        handleOrdersChange
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log(
            `Realtime: Subscribed to orders changes (hook v6${uniqueChannelSuffix})`
          );
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.error(
            `Realtime: Orders channel error (hook v6${uniqueChannelSuffix}):`,
            err
          );
        } else {
          console.log(
            `Realtime: Orders channel status (hook v6${uniqueChannelSuffix}):`,
            status
          );
        }
      });

    return () => {
      console.log(
        `Realtime: Unsubscribing from all order list channels (hook v6${uniqueChannelSuffix})`
      );
      supabase.removeChannel(orderItemsChannel);
      supabase.removeChannel(inventoryChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, [supabase, userId]);

  return null;
};

export default useOrderListRealtime;
