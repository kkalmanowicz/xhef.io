import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, Trash2, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ExistingIngredients({ 
  ingredients, 
  inventoryItems, 
  onUpdate, 
  onDelete, 
  errors 
}) {
  const handleQuantityChange = (index, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      quantity: value
    };
    onUpdate(updatedIngredients);
  };

  const handleItemChange = (index, itemId) => {
    const item = inventoryItems.find(i => i.id === itemId);
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      inventory_item_id: itemId,
      unit: item?.unit || ""
    };
    onUpdate(updatedIngredients);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Current Ingredients</h3>
      </div>

      <div className="space-y-4">
        {ingredients.map((ingredient, index) => {
          const inventoryItem = inventoryItems.find(item => item.id === ingredient.inventory_item_id);
          const price = inventoryItem?.default_price || inventoryItem?.last_price || 0;
          const cost = price * ingredient.quantity;

          return (
            <motion.div
              key={ingredient.id || index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg relative group"
            >
              <div className="w-full sm:w-2/5">
                <Select
                  value={ingredient.inventory_item_id}
                  onValueChange={(value) => handleItemChange(index, value)}
                >
                  <SelectTrigger className={errors[`existing_ingredient_${index}`] ? "border-red-500" : ""}>
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
                {errors[`existing_ingredient_${index}`] && (
                  <span className="text-sm text-red-500">{errors[`existing_ingredient_${index}`]}</span>
                )}
              </div>

              <div className="w-full sm:w-1/5">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={ingredient.quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  placeholder="Quantity"
                  className={errors[`existing_quantity_${index}`] ? "border-red-500" : ""}
                />
                {errors[`existing_quantity_${index}`] && (
                  <span className="text-sm text-red-500">{errors[`existing_quantity_${index}`]}</span>
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
                onClick={() => onDelete(index)}
                className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 rounded-full p-1"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </motion.div>
          );
        })}
      </div>

      {ingredients.length === 0 && (
        <div className="flex items-center justify-center p-8 text-gray-500 border-2 border-dashed rounded-lg">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>No ingredients added yet</span>
        </div>
      )}
    </div>
  );
}

export default ExistingIngredients;