import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSupabase } from "@/contexts/SupabaseContext";
import { Plus, Loader2 } from "lucide-react";
import WasteForm from "@/components/waste/WasteForm";
import WasteSummaryCards from "@/components/waste/WasteSummaryCards";
import WasteListItem from "@/components/waste/WasteListItem";
import { fetchWastePageData, calculateWasteSummaryData, deleteWasteItemById } from "@/services/wasteService";

function Waste() {
  const { supabase, userId } = useSupabase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [wasteItems, setWasteItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [prepItems, setPrepItems] = useState([]);
  const [wasteSummary, setWasteSummary] = useState({ totalQuantity: 0, totalCost: 0, weeklyWaste: 0, weeklyCount: 0 });

  const loadData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const { 
        inventoryItems: fetchedInventory, 
        prepItems: fetchedPrep, 
        wasteItems: fetchedWaste 
      } = await fetchWastePageData(supabase, userId);
      
      setInventoryItems(fetchedInventory);
      setPrepItems(fetchedPrep);
      setWasteItems(fetchedWaste);
      setWasteSummary(calculateWasteSummaryData(fetchedWaste));

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ variant: "destructive", title: "Error", description: error.message || "Failed to fetch data" });
    } finally {
      setIsLoading(false);
    }
  }, [supabase, userId, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!userId) return;
    const wasteChannel = supabase
      .channel('public:waste_items')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'waste_items', filter: `user_id=eq.${userId}` },
        (payload) => {
          console.log('Waste items change received!', payload);
          if (payload.eventType === 'DELETE') {
            // Optimistic update handled, but ensure consistency if needed
            setWasteItems(prevItems => prevItems.filter(item => item.id !== payload.old.id));
            setWasteSummary(calculateWasteSummaryData(wasteItems.filter(item => item.id !== payload.old.id)));
          } else {
            loadData(); // For INSERT or UPDATE, reload all data
          }
        }
      )
      .subscribe();
      
    // Also listen to inventory and prep items if their price changes affect waste cost display
    const inventoryChannel = supabase
      .channel('public:inventory_items:waste-page')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'inventory_items', filter: `user_id=eq.${userId}` },
        (payload) => {
          console.log('Inventory item update relevant to waste received!', payload);
          // If prices changed, waste costs might need re-evaluation.
          // This could be complex if costs are stored; simpler if calculated on the fly.
          // For now, a full reload if an item that *could* be wasted is updated.
          loadData(); 
        }
      )
      .subscribe();

    const prepItemsChannel = supabase
      .channel('public:prep_items:waste-page')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'prep_items', filter: `user_id=eq.${userId}` },
        (payload) => {
          console.log('Prep item update relevant to waste received!', payload);
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(wasteChannel);
      supabase.removeChannel(inventoryChannel);
      supabase.removeChannel(prepItemsChannel);
    };
  }, [supabase, userId, loadData, wasteItems]); // Added wasteItems to dependency for optimistic update consistency

  const handleDeleteWasteItem = async (wasteItemId) => {
    const previousWasteItems = [...wasteItems];
    const updatedWasteItems = wasteItems.filter(item => item.id !== wasteItemId);
    setWasteItems(updatedWasteItems);
    setWasteSummary(calculateWasteSummaryData(updatedWasteItems));

    try {
      await deleteWasteItemById(supabase, userId, wasteItemId);
      toast({ title: "Success", description: "Waste item deleted." });
    } catch (error) {
      console.error('Error deleting waste item:', error);
      toast({ variant: "destructive", title: "Error", description: "Failed to delete waste item." });
      setWasteItems(previousWasteItems); // Revert
      setWasteSummary(calculateWasteSummaryData(previousWasteItems));
    }
  };

  if (isLoading && !wasteItems.length) {
    return (
      <div className="flex justify-center items-center h-full min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Waste Tracking</h1>
        <Button onClick={() => setIsFormOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-5 h-5 mr-2" />
          Record Waste
        </Button>
      </div>

      <WasteSummaryCards summary={wasteSummary} />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Waste History</h2>
        {isLoading && wasteItems.length > 0 && (
           <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">Updating...</div>
        )}
        {!isLoading && wasteItems.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No waste items recorded yet. Click "Record Waste" to start.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <AnimatePresence>
              {wasteItems.map((item) => (
                <WasteListItem key={item.id} item={item} onDelete={handleDeleteWasteItem} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      <WasteForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        inventoryItems={inventoryItems}
        prepItems={prepItems}
        onSuccess={() => {
          setIsFormOpen(false);
          // loadData(); // Realtime should handle this
        }}
      />
    </div>
  );
}

export default Waste;