import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import UnitSelector from "@/components/inventory/UnitSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function PrepItemIngredientsForm({ ingredients, inventoryItems, onIngredientChange, onAddIngredient, onRemoveIngredient }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Ingredients</Label>
        <Button type="button" onClick={onAddIngredient} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Ingredient
        </Button>
      </div>

      {ingredients.map((ingredient, index) => (
        <div key={index} className="flex items-end gap-2 p-3 border rounded-md bg-gray-50 dark:bg-gray-700/30">
          <div className="flex-1">
            <Label htmlFor={`ingredient-item-${index}`}>Item</Label>
            <Select
              value={ingredient.inventory_item_id}
              onValueChange={(value) => onIngredientChange(index, 'inventory_item_id', value)}
            >
              <SelectTrigger id={`ingredient-item-${index}`}>
                <SelectValue placeholder="Select item" />
              </SelectTrigger>
              <SelectContent>
                {inventoryItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} ({item.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-24">
            <Label htmlFor={`ingredient-quantity-${index}`}>Quantity</Label>
            <Input
              id={`ingredient-quantity-${index}`}
              type="number"
              min="0"
              step="0.01"
              value={ingredient.quantity}
              onChange={(e) => onIngredientChange(index, 'quantity', parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="w-32">
            <Label htmlFor={`ingredient-unit-${index}`}>Unit</Label>
            <UnitSelector
              id={`ingredient-unit-${index}`}
              value={ingredient.unit}
              onValueChange={(value) => onIngredientChange(index, 'unit', value)}
            />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemoveIngredient(index)}
            className="text-red-500 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      {ingredients.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
          No ingredients added yet. Click "Add Ingredient" to get started.
        </p>
      )}
    </div>
  );
}

export default PrepItemIngredientsForm;