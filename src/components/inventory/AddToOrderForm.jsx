import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabase } from "@/contexts/SupabaseContext";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, Loader2 } from "lucide-react";

const AddToOrderForm = ({ item, existingOrderItem, onClose }) => {
  const { supabase, userId } = useSupabase();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setPrice(item.last_price || item.default_price || "");
      // If it's an existing order item being edited (not from suggested items), prefill its current quantity
      // Otherwise, default to 1 for new additions
      setQuantity(existingOrderItem?.quantity ? existingOrderItem.quantity : 1); 
    }
  }, [item, existingOrderItem]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item || !userId) return;

    const numQuantity = parseFloat(quantity);
    const numPrice = parseFloat(price);

    if (isNaN(numQuantity) || numQuantity <= 0) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid quantity." });
      return;
    }
    if (isNaN(numPrice) || numPrice < 0) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid price." });
      return;
    }

    setIsSubmitting(true);

    try {
      let successMessage = "";
      if (existingOrderItem) {
        // This logic branch is for when user clicks "Add to Order" for an item *already* in Current Order,
        // via the Suggested Items tab. The dialog allows adjusting this existing item.
        // The AddToOrderDialog's useExistingOrderItem hook finds this.
        // We update its quantity and price.
        const { error } = await supabase
          .from('order_items')
          .update({ 
            quantity: numQuantity, // Use the form's quantity directly, not adding to existing
            price_per_unit: numPrice,
            total_price: numQuantity * numPrice,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingOrderItem.id)
          .eq('user_id', userId);
        if (error) throw error;
        successMessage = `${item.name} updated in order.`;
      } else {
        // This is for adding a completely new item to the order_items table
        const { error } = await supabase
          .from("order_items")
          .insert({
            inventory_item_id: item.id,
            quantity: numQuantity,
            unit: item.unit,
            price_per_unit: numPrice,
            total_price: numQuantity * numPrice,
            status: "pending",
            user_id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        if (error) throw error;
        successMessage = `${item.name} added to order.`;
      }
      
      // Update last_price on inventory_item if this price is different
      if (item.last_price !== numPrice) {
        const { error: priceUpdateError } = await supabase
          .from('inventory_items')
          .update({ last_price: numPrice })
          .eq('id', item.id)
          .eq('user_id', userId);
        if (priceUpdateError) {
          console.warn("Could not update last_price for item:", priceUpdateError);
          // Non-critical, so don't fail the whole operation
        }
      }
      
      toast({ title: "Success", description: successMessage });
      onClose(); // Close dialog on success
    } catch (error) {
      console.error("Error adding/updating order item:", error);
      toast({ variant: "destructive", title: "Error", description: `Failed to add/update item: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-2">
      <div>
        <Label htmlFor={`quantity-${item.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {existingOrderItem ? "Set Quantity" : "Quantity to Add"} ({item.unit})
        </Label>
        <Input
          id={`quantity-${item.id}`}
          type="number"
          min="0.01"
          step="any"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>
      <div>
        <Label htmlFor={`price-${item.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Price per {item.unit}
        </Label>
        <Input
          id={`price-${item.id}`}
          type="number"
          min="0.00"
          step="any"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          placeholder="0.00"
          className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>
      <div className="pt-4 flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle className="mr-2 h-4 w-4" />
          )}
          {isSubmitting ? (existingOrderItem ? "Updating..." : "Adding...") : (existingOrderItem ? "Update Item" : "Add to Order")}
        </Button>
      </div>
    </form>
  );
};

export default AddToOrderForm;