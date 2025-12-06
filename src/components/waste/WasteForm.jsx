import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useSupabase } from "@/contexts/SupabaseContext";
import { useToast } from "@/components/ui/use-toast";

function WasteForm({ isOpen, onClose, inventoryItems, prepItems, onSuccess }) {
  const { supabase, userId } = useSupabase();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState("inventory");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  const itemsToList = selectedType === "inventory" ? inventoryItems : prepItems;

  const calculateItemCost = (itemType, itemId, itemQuantity) => {
    const qty = parseFloat(itemQuantity);
    if (isNaN(qty) || qty <= 0) return 0;

    if (itemType === 'inventory') {
      const item = inventoryItems.find(i => i.id === itemId);
      return (item?.last_price || item?.default_price || 0) * qty;
    } else {
      const item = prepItems.find(i => i.id === itemId);
      if (!item || !item.prep_item_ingredients) return 0;
      
      const singlePrepItemCost = item.prep_item_ingredients.reduce((acc, ing) => {
        const ingDetails = inventoryItems.find(invItem => invItem.id === ing.inventory_item_id);
        const ingPrice = ingDetails?.last_price || ingDetails?.default_price || 0;
        return acc + (ingPrice * ing.quantity);
      }, 0);
      return singlePrepItemCost * qty;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItemId || !quantity) {
      toast({ variant: "destructive", title: "Error", description: "Please select an item and enter quantity." });
      return;
    }
    setIsSubmitting(true);

    try {
      const itemToUpdate = itemsToList.find(i => i.id === selectedItemId);
      if (!itemToUpdate) throw new Error('Item not found');

      const wasteQuantity = parseFloat(quantity);
      const currentStock = parseFloat(itemToUpdate.current_stock) || 0;
      const newStock = currentStock - wasteQuantity;

      if (newStock < 0) {
        throw new Error('Cannot waste more than current stock.');
      }

      const cost = calculateItemCost(selectedType, selectedItemId, wasteQuantity);

      const wasteData = {
        user_id: userId,
        item_type: selectedType,
        quantity: wasteQuantity,
        unit: selectedType === 'inventory' ? itemToUpdate.unit : itemToUpdate.yield_unit,
        reason,
        cost,
        created_at: new Date().toISOString(),
        inventory_item_id: selectedType === 'inventory' ? selectedItemId : null,
        prep_item_id: selectedType === 'prep' ? selectedItemId : null,
        item_id: selectedItemId // Keep for now, or decide to phase out
      };
      
      const { error: wasteError } = await supabase.from('waste_items').insert(wasteData);
      if (wasteError) throw wasteError;

      const updateTable = selectedType === 'inventory' ? 'inventory_items' : 'prep_items';
      const { error: stockUpdateError } = await supabase
        .from(updateTable)
        .update({ current_stock: newStock, updated_at: new Date().toISOString() })
        .eq('id', selectedItemId)
        .eq('user_id', userId);
      if (stockUpdateError) throw stockUpdateError;
      
      toast({ title: "Success", description: "Waste recorded successfully" });
      onSuccess(); 
      handleClose();
    } catch (error) {
      console.error('Error recording waste:', error);
      toast({ variant: "destructive", title: "Error", description: error.message || "Failed to record waste" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedType("inventory");
    setSelectedItemId("");
    setQuantity("");
    setReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Waste</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="item-type">Item Type</Label>
            <Select value={selectedType} onValueChange={(value) => { setSelectedType(value); setSelectedItemId(""); }}>
              <SelectTrigger id="item-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inventory">Inventory Item</SelectItem>
                <SelectItem value="prep">Prep Item</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="item-select">Item</Label>
            <Select value={selectedItemId} onValueChange={setSelectedItemId}>
              <SelectTrigger id="item-select">
                <SelectValue placeholder="Select item" />
              </SelectTrigger>
              <SelectContent>
                {itemsToList.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} (Stock: {item.current_stock || 0} {selectedType === 'inventory' ? item.unit : item.yield_unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Spoiled, Burnt, Dropped"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Recording..." : "Record Waste"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default WasteForm;