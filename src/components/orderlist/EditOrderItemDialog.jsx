import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const EditOrderItemDialog = ({ isOpen, onOpenChange, item, onSave, isSaving }) => {
  const [quantity, setQuantity] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity?.toString() || "");
      setPricePerUnit(item.price_per_unit?.toString() || "");
      setErrors({});
    }
  }, [item]);

  const validate = () => {
    const newErrors = {};
    const numQuantity = parseFloat(quantity);
    const numPrice = parseFloat(pricePerUnit);

    if (isNaN(numQuantity) || numQuantity <= 0) {
      newErrors.quantity = "Quantity must be a positive number.";
    }
    if (isNaN(numPrice) || numPrice < 0) {
      newErrors.pricePerUnit = "Price must be a non-negative number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(item.id, parseFloat(quantity), parseFloat(pricePerUnit));
    }
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-gradient-to-br from-gray-50 via-slate-50 to-stone-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800 dark:text-white">
            Edit Order Item
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Update quantity and price for: <span className="font-semibold text-primary">{item.inventory_items?.name || "Unknown Item"}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 space-y-6">
          <div>
            <Label htmlFor="quantity" className="text-gray-700 dark:text-gray-300">
              Quantity ({item.inventory_items?.unit || item.unit})
            </Label>
            <Input
              id="quantity"
              type="number"
              min="0.01"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={`mt-1 ${errors.quantity ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
              placeholder="e.g., 10.5"
            />
            {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>}
          </div>
          <div>
            <Label htmlFor="pricePerUnit" className="text-gray-700 dark:text-gray-300">
              Price per {item.inventory_items?.unit || item.unit}
            </Label>
            <Input
              id="pricePerUnit"
              type="number"
              min="0.00"
              step="any"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(e.target.value)}
              className={`mt-1 ${errors.pricePerUnit ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
              placeholder="e.g., 2.99"
            />
            {errors.pricePerUnit && <p className="text-sm text-red-500 mt-1">{errors.pricePerUnit}</p>}
          </div>
        </div>
        <DialogFooter className="sm:justify-between gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="min-w-[100px]">
            {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderItemDialog;