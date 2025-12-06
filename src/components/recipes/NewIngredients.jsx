import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, Plus, Minus, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function NewIngredients({ 
  ingredients, 
  inventoryItems, 
  onAdd, 
  onChange, 
  onRemove, 
  errors 
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Add New Ingredients</h3>
        <Button type="button" onClick={onAdd} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Ingredient
        </Button>
      </div>

      <div className="space-y-4">
        {ingredients.map((ingredient, index) => {
          const inventoryItem = inventoryItems.find(item => item.id === ingredient.inventory_item_id);
          const price = inventoryItem?.default_price || inventoryItem?.last_price || 0;
          const cost = price * ingredient.quantity;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
            >
              <div className="w-full sm:w-2/5">
                <Select
                  value={ingredient.inventory_item_id}
                  onValueChange={(value) => onChange(index, 'inventory_item_id', value)}
                >
                  <SelectTrigger className={errors[`new_ingredient_${index}`] ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select ingredient" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventoryItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} (${item.default_price || item.last_price || 0}/{item.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[`new_ingredient_${index}`] && (
                  <span className="text-sm text-red-500">{errors[`new_ingredient_${index}`]}</span>
                )}
              </div>

              <div className="w-full sm:w-1/5">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={ingredient.quantity}
                  onChange={(e) => onChange(index, 'quantity', e.target.value)}
                  placeholder="Quantity"
                  className={errors[`new_quantity_${index}`] ? "border-red-500" : ""}
                />
                {errors[`new_quantity_${index}`] && (
                  <span className="text-sm text-red-500">{errors[`new_quantity_${index}`]}</span>
                )}
              </div>

              <div className="w-full sm:w-1/5">
                <Input
                  value={ingredient.unit}
                  disabled
                  placeholder="Unit"
                />
              </div>

              <div className="w-full sm:w-1/5">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    value={cost.toFixed(2)}
                    disabled
                    className="pl-10"
                    placeholder="Cost"
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className="mt-2 sm:mt-0"
              >
                <Minus className="w-4 h-4 text-red-500" />
              </Button>
            </motion.div>
          );
        })}
      </div>

      {ingredients.length === 0 && (
        <div className="flex items-center justify-center p-8 text-gray-500 border-2 border-dashed rounded-lg">
          <Plus className="w-5 h-5 mr-2" />
          <span>Click "Add Ingredient" to start adding new ingredients</span>
        </div>
      )}
    </div>
  );
}

export default NewIngredients;