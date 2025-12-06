import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSupabase } from '@/contexts/SupabaseContext';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingCart, Loader2, AlertTriangle, RotateCcw } from 'lucide-react';

const ReorderItemRow = ({ item, isSelected, onSelectionChange, onQuantityChange, onPriceChange, latestPrice }) => {
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const [price, setPrice] = useState(latestPrice || item.price_per_unit || 0);

  useEffect(() => {
    setQuantity(item.quantity || 1);
  }, [item.quantity]);

  useEffect(() => {
    setPrice(latestPrice || item.price_per_unit || 0);
  }, [latestPrice, item.price_per_unit]);


  const handleQuantityChange = (e) => {
    const newQuantity = e.target.value;
    setQuantity(newQuantity);
    onQuantityChange(item.id, parseFloat(newQuantity) || 0);
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPrice(newPrice);
    onPriceChange(item.id, parseFloat(newPrice) || 0);
  };

  return (
    <div className="flex items-center space-x-3 p-3 border-b dark:border-gray-700 last:border-b-0">
      <Checkbox
        id={`reorder-item-${item.inventory_item_id || item.id}`}
        checked={isSelected}
        onCheckedChange={(checked) => onSelectionChange(item.id, checked)}
        className="mr-2"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate text-gray-800 dark:text-gray-200">{item.inventory_items?.name || "Unknown Item"}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Orig. Qty: {item.quantity} {item.unit || item.inventory_items?.unit}</p>
      </div>
      <div className="w-24">
        <Label htmlFor={`reorder-qty-${item.id}`} className="sr-only">Quantity</Label>
        <Input
          id={`reorder-qty-${item.id}`}
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          min="0.01"
          step="any"
          className="h-9 text-sm"
        />
      </div>
      <div className="w-24">
         <Label htmlFor={`reorder-price-${item.id}`} className="sr-only">Price</Label>
        <Input
          id={`reorder-price-${item.id}`}
          type="number"
          value={price}
          onChange={handlePriceChange}
          min="0"
          step="any"
          className="h-9 text-sm"
        />
      </div>
    </div>
  );
};

const ReorderDialog = ({ historicalOrder, isOpen, onClose, onReorderSuccess }) => {
  const { supabase, userId } = useSupabase();
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState({});
  const [itemDetails, setItemDetails] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inventoryItemPrices, setInventoryItemPrices] = useState({});
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);

  useEffect(() => {
    if (historicalOrder?.order_history && isOpen) {
      const initialSelected = {};
      const initialDetails = {};
      const inventoryItemIds = historicalOrder.order_history.map(item => item.inventory_item_id).filter(id => id);

      historicalOrder.order_history.forEach(item => {
        initialSelected[item.id] = true; // Select all by default
        initialDetails[item.id] = {
          inventory_item_id: item.inventory_item_id,
          name: item.inventory_items?.name || "Unknown Item",
          unit: item.unit || item.inventory_items?.unit,
          originalQuantity: item.quantity,
          quantity: item.quantity, // Default to original quantity
          price_per_unit: item.price_per_unit, // Default to original price
        };
      });
      setSelectedItems(initialSelected);
      setItemDetails(initialDetails);

      if (inventoryItemIds.length > 0) {
        setIsLoadingPrices(true);
        supabase
          .from('inventory_items')
          .select('id, last_price, default_price')
          .in('id', inventoryItemIds)
          .eq('user_id', userId)
          .then(({ data, error }) => {
            if (error) {
              console.error("Error fetching latest prices:", error);
              toast({ variant: "destructive", title: "Error", description: "Could not fetch latest item prices." });
            } else {
              const prices = {};
              data.forEach(invItem => {
                prices[invItem.id] = invItem.last_price || invItem.default_price;
              });
              setInventoryItemPrices(prices);
            }
            setIsLoadingPrices(false);
          });
      } else {
        setIsLoadingPrices(false);
      }

    } else {
      // Reset when dialog is closed or no order
      setSelectedItems({});
      setItemDetails({});
      setInventoryItemPrices({});
      setIsLoadingPrices(true);
    }
  }, [historicalOrder, isOpen, supabase, userId, toast]);

  const handleSelectionChange = (itemId, checked) => {
    setSelectedItems(prev => ({ ...prev, [itemId]: checked }));
  };

  const handleQuantityChange = (itemId, quantity) => {
    setItemDetails(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], quantity }
    }));
  };

  const handlePriceChange = (itemId, price_per_unit) => {
    setItemDetails(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], price_per_unit }
    }));
  };

  const handleSubmitReorder = async () => {
    setIsSubmitting(true);
    const itemsToReorder = historicalOrder.order_history
      .filter(item => selectedItems[item.id])
      .map(item => ({
        ...itemDetails[item.id],
        historical_item_id: item.id, // keep original id for reference
      }));

    if (itemsToReorder.length === 0) {
      toast({ title: "No items selected", description: "Please select items to re-order." });
      setIsSubmitting(false);
      return;
    }

    try {
      const { data: currentPendingOrderItems, error: fetchError } = await supabase
        .from('order_items')
        .select('id, inventory_item_id, quantity, price_per_unit')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .is('order_id', null);

      if (fetchError) throw fetchError;

      const updates = [];
      const inserts = [];
      const inventoryPriceUpdates = [];

      for (const reorderItem of itemsToReorder) {
        if (!reorderItem.inventory_item_id) {
          console.warn(`Skipping item without inventory_item_id: ${reorderItem.name}`);
          continue;
        }
        if (reorderItem.quantity <= 0) {
            toast({ variant: "destructive", title: "Invalid Quantity", description: `Quantity for ${reorderItem.name} must be positive.` });
            setIsSubmitting(false);
            return;
        }
        if (reorderItem.price_per_unit < 0) {
            toast({ variant: "destructive", title: "Invalid Price", description: `Price for ${reorderItem.name} cannot be negative.` });
            setIsSubmitting(false);
            return;
        }


        const existingInPending = currentPendingOrderItems.find(
          pendingItem => pendingItem.inventory_item_id === reorderItem.inventory_item_id
        );

        if (existingInPending) {
          updates.push({
            id: existingInPending.id,
            quantity: existingInPending.quantity + reorderItem.quantity,
            price_per_unit: reorderItem.price_per_unit, // Use new price from dialog
            total_price: (existingInPending.quantity + reorderItem.quantity) * reorderItem.price_per_unit,
            updated_at: new Date().toISOString(),
          });
        } else {
          inserts.push({
            inventory_item_id: reorderItem.inventory_item_id,
            quantity: reorderItem.quantity,
            unit: reorderItem.unit,
            price_per_unit: reorderItem.price_per_unit,
            total_price: reorderItem.quantity * reorderItem.price_per_unit,
            status: 'pending',
            user_id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
        
        // Check if inventory_item.last_price needs update
        const originalInventoryItem = await supabase
          .from('inventory_items')
          .select('last_price')
          .eq('id', reorderItem.inventory_item_id)
          .eq('user_id', userId)
          .single();
        
        if (originalInventoryItem.data && originalInventoryItem.data.last_price !== reorderItem.price_per_unit) {
          inventoryPriceUpdates.push({
            id: reorderItem.inventory_item_id,
            last_price: reorderItem.price_per_unit
          });
        }
      }

      if (updates.length > 0) {
        for (const update of updates) { // Process updates one by one due to potential unique constraints if bulked incorrectly
            const { error: updateError } = await supabase.from('order_items').update(update).eq('id', update.id);
            if (updateError) throw updateError;
        }
      }
      if (inserts.length > 0) {
        const { error: insertError } = await supabase.from('order_items').insert(inserts);
        if (insertError) throw insertError;
      }
      if (inventoryPriceUpdates.length > 0) {
        for (const invUpdate of inventoryPriceUpdates) {
            const { error: invPriceError } = await supabase.from('inventory_items').update({ last_price: invUpdate.last_price }).eq('id', invUpdate.id).eq('user_id', userId);
            if (invPriceError) console.warn("Error updating inventory last_price:", invPriceError); // Non-critical
        }
      }

      toast({ title: "Success", description: "Selected items added/updated in your current order." });
      if (onReorderSuccess) onReorderSuccess();
      onClose();
    } catch (error) {
      console.error("Error reordering items:", error);
      toast({ variant: "destructive", title: "Reorder Failed", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!historicalOrder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 shadow-2xl rounded-lg">
        <DialogHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
            <RotateCcw className="w-7 h-7 mr-3 text-primary" />
            Re-order from Order #{historicalOrder.id.slice(0, 8)}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 pt-1">
            Select items and adjust quantities/prices to add to your current order. Prices shown are the latest known.
          </DialogDescription>
        </DialogHeader>

        {isLoadingPrices ? (
             <div className="flex flex-col justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="mt-3 text-gray-600 dark:text-gray-400">Loading item details...</p>
            </div>
        ) : historicalOrder.order_history && historicalOrder.order_history.length > 0 ? (
          <ScrollArea className="max-h-[50vh] p-1 pr-3">
            <div className="divide-y dark:divide-gray-700">
              {historicalOrder.order_history.map(item => (
                <ReorderItemRow
                  key={item.id}
                  item={item}
                  latestPrice={inventoryItemPrices[item.inventory_item_id]}
                  isSelected={selectedItems[item.id] || false}
                  onSelectionChange={handleSelectionChange}
                  onQuantityChange={handleQuantityChange}
                  onPriceChange={handlePriceChange}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <p className="p-6 text-center text-gray-500 dark:text-gray-400">This historical order has no items to re-order.</p>
        )}

        <DialogFooter className="p-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button 
            onClick={handleSubmitReorder} 
            disabled={isSubmitting || isLoadingPrices || historicalOrder.order_history?.length === 0}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
            {isSubmitting ? "Processing..." : "Add to Current Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReorderDialog;