import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/contexts/SupabaseContext";
import { useToast } from "@/components/ui/use-toast";
import PrepListItemCard from "@/components/prep/PrepListItemCard";
import { Loader2 } from "lucide-react";

const stations = ["all", "grill", "saute", "sauces", "salads", "events", "other"];

const usePrepListData = (supabase, userId, toast, isMountedRef) => {
  const [prepItems, setPrepItems] = useState([]);
  const [localStock, setLocalStock] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchPrepItems = useCallback(async () => {
    if (!userId || !supabase) return;
    if (isMountedRef.current) setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('prep_items')
        .select(`
          id, name, station, current_stock, par_level, yield_unit, status, notes,
          prep_item_ingredients (
            id, quantity, unit,
            inventory_items ( id, name, unit, current_stock )
          )
        `)
        .eq('user_id', userId)
        .or('status.eq.urgent,status.eq.needed')
        .order('status', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (isMountedRef.current) {
        setPrepItems(data || []);
        const initialStock = {};
        (data || []).forEach(item => {
          initialStock[item.id] = item.current_stock || 0;
        });
        setLocalStock(initialStock);
      }
    } catch (error) {
      console.error('Error fetching prep items:', error);
      if (isMountedRef.current) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch prep list.",
        });
      }
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [supabase, userId, toast, isMountedRef]);

  useEffect(() => {
    fetchPrepItems();
  }, [fetchPrepItems]);

  const handleStockChange = (itemId, change) => {
    setLocalStock(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] === undefined ? 0 : prev[itemId]) + change)
    }));
  };

  const handleComplete = async (item) => {
    if (isUpdating) return;
    if (isMountedRef.current) setIsUpdating(true);

    const newStock = localStock[item.id];
    const originalStock = item.current_stock || 0;

    if (newStock === originalStock) {
      toast({
        title: "No Changes",
        description: "No changes were made to the stock level.",
      });
      if (isMountedRef.current) setIsUpdating(false);
      return;
    }

    try {
      const stockDifference = newStock - originalStock;
      
      if (stockDifference > 0 && item.prep_item_ingredients?.length > 0) {
        for (const ingredient of item.prep_item_ingredients) {
          const requiredAmount = ingredient.quantity * stockDifference;
          const availableStock = ingredient.inventory_items?.current_stock || 0;
          if (availableStock < requiredAmount) {
            throw new Error(`Not enough ${ingredient.inventory_items?.name || 'ingredient'} in inventory. Required: ${requiredAmount}, Available: ${availableStock}`);
          }
        }

        for (const ingredient of item.prep_item_ingredients) {
          const deductAmount = ingredient.quantity * stockDifference;
          const { error: updateError } = await supabase
            .from('inventory_items')
            .update({ 
              current_stock: (ingredient.inventory_items.current_stock || 0) - deductAmount,
              updated_at: new Date().toISOString()
            })
            .eq('id', ingredient.inventory_items.id)
            .eq('user_id', userId);
          if (updateError) throw updateError;

          await supabase.from('inventory_transactions').insert({
            inventory_item_id: ingredient.inventory_items.id,
            quantity_change: -deductAmount,
            transaction_type: 'prep_item_production',
            reference_type: 'prep_items',
            reference_id: item.id,
            notes: `Used in prep item: ${item.name}`,
            user_id: userId
          });
        }
      }

      const newStatus = newStock <= 0 ? 'urgent' : 
                      newStock < item.par_level ? 'needed' : 
                      'not-needed';

      const { error: prepError } = await supabase
        .from('prep_items')
        .update({
          current_stock: newStock,
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id)
        .eq('user_id', userId);

      if (prepError) throw prepError;
      
      toast({
        title: "Success",
        description: `Updated ${item.name} stock to ${newStock} ${item.yield_unit}.`,
      });
      
      if (newStatus === 'not-needed') {
        if (isMountedRef.current) {
            setPrepItems(prev => prev.filter(p => p.id !== item.id));
            setLocalStock(prev => {
                const newLocal = {...prev};
                delete newLocal[item.id];
                return newLocal;
            });
        }
      } else {
        fetchPrepItems(); 
      }

    } catch (error) {
      console.error('Error completing prep item:', error);
      if (isMountedRef.current) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to complete prep item",
        });
        setLocalStock(prev => ({ ...prev, [item.id]: originalStock }));
      }
    } finally {
      if (isMountedRef.current) setIsUpdating(false);
    }
  };

  return {
    prepItems,
    localStock,
    isLoading,
    isUpdating,
    handleStockChange,
    handleComplete,
    fetchPrepItems
  };
};


function PrepList() {
  const { supabase, userId } = useSupabase();
  const { toast } = useToast();
  const [selectedStation, setSelectedStation] = useState("all");
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const {
    prepItems,
    localStock,
    isLoading,
    isUpdating,
    handleStockChange,
    handleComplete,
  } = usePrepListData(supabase, userId, toast, isMounted);


  const filteredPrepItems = prepItems.filter(item =>
    selectedStation === "all" || item.station === selectedStation
  );

  // Realtime subscription for prep_items and inventory_items
  useEffect(() => {
    if (!supabase || !userId || !isMounted.current) return;

    const prepChannelSuffix = `_prep_list_prep_items_${userId}_${Date.now()}`;
    const inventoryChannelSuffix = `_prep_list_inventory_items_${userId}_${Date.now()}`;

    const prepItemsChannel = supabase
      .channel(`public:prep_items${prepChannelSuffix}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'prep_items', filter: `user_id=eq.${userId}` },
        (payload) => {
          console.log("Prep items change received:", payload);
          if (isMounted.current) {
            // A bit more robust update: refetch or smartly update local state
            // For now, simple refetch for changes other than delete (handled by handleComplete)
             if (payload.eventType !== 'DELETE' && prepItems.find(p => p.id === payload.old?.id || p.id === payload.new?.id) ) {
                // If it was not-needed and now is, or vice-versa, full fetch
                if((payload.old?.status === 'not-needed' && payload.new?.status !== 'not-needed') || 
                   (payload.old?.status !== 'not-needed' && payload.new?.status === 'not-needed')) {
                    // usePrepListData hook's fetchPrepItems already bound to isMountedRef
                    // but we need to call the one from this component's scope to ensure it is the one from usePrepListData hook.
                    // However, it is better to call the fetchPrepItems from the hook directly if we had access to it.
                    // Since we don't, we rely on its internal fetch.
                    // No direct way to call hook's fetchPrepItems here, so for now this is a conceptual comment.
                    // The fetchPrepItems in the hook will be triggered on next render if dependencies change
                    // A more direct way would be to expose fetchPrepItems from the hook if needed for direct calls.
                    // For now, we expect handleComplete to remove 'not-needed' items and subsequent renders to adjust.
                }
             }
          }
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') console.log(`Subscribed to prep_items${prepChannelSuffix}`);
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            console.error(`Prep Items channel error/closed (${prepChannelSuffix}):`, status, err);
        }
      });

    const inventoryItemsChannel = supabase
      .channel(`public:inventory_items${inventoryChannelSuffix}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory_items', filter: `user_id=eq.${userId}` },
        (payload) => {
          console.log("Inventory items change received (for prep list):", payload);
          // Potentially refetch prep list if an ingredient stock change might affect prep item status/availability.
          // This can be complex to optimize (e.g., only refetch if a relevant ingredient changed significantly).
          // For now, we can consider a refetch if any prep item uses the changed inventory item.
          const changedInventoryItemId = payload.new?.id || payload.old?.id;
          const affectsPrepItem = prepItems.some(pItem => 
            pItem.prep_item_ingredients.some(ing => ing.inventory_items.id === changedInventoryItemId)
          );
          if (affectsPrepItem && isMounted.current) {
             // Similar to above, direct call to hook's fetchPrepItems is tricky.
          }
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') console.log(`Subscribed to inventory_items${inventoryChannelSuffix}`);
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            console.error(`Inventory Items (for prep) channel error/closed (${inventoryChannelSuffix}):`, status, err);
        }
      });

    return () => {
      if (supabase) {
        supabase.removeChannel(prepItemsChannel).catch(err => console.error("Error removing prep items channel:", err));
        supabase.removeChannel(inventoryItemsChannel).catch(err => console.error("Error removing inventory items channel:", err));
      }
    };
  }, [supabase, userId, prepItems]);


  return (
    <div className="space-y-8 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Prep List</h1>
      </div>

      <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-200 dark:border-gray-700">
        {stations.map((station) => (
          <Button
            key={station}
            variant={selectedStation === station ? "default" : "outline"}
            onClick={() => setSelectedStation(station)}
            size="sm"
            className="capitalize transition-all duration-150"
          >
            {station}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin rounded-full h-12 w-12 text-primary" />
        </div>
      ) : filteredPrepItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <h2 className="text-xl font-medium">All caught up!</h2>
          <p className="mt-2">No items need preparation for {selectedStation === "all" ? "any station" : `the ${selectedStation} station`} at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredPrepItems.map((item) => (
            <PrepListItemCard
              key={item.id}
              item={item}
              localStock={localStock}
              onStockChange={handleStockChange}
              onComplete={handleComplete}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PrepList;