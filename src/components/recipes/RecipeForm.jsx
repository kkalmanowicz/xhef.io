import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useSupabase } from "@/contexts/SupabaseContext";
import { DollarSign, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ExistingIngredients from "@/components/recipes/ExistingIngredients";
import NewIngredients from "@/components/recipes/NewIngredients";

function RecipeForm({ recipe, onSuccess }) {
  const { supabase, userId } = useSupabase();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [prepItems, setPrepItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    portions: "",
    target_price: "",
    ingredients: [],
    newIngredients: [],
    prepItems: []
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchInventoryItems();
    fetchPrepItems();
    if (recipe) {
      initializeFormData();
    }
  }, [recipe]);

  const fetchInventoryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      setInventoryItems(data || []);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch inventory items.",
      });
    }
  };

  const fetchPrepItems = async () => {
    try {
      const { data, error } = await supabase
        .from('prep_items')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      setPrepItems(data || []);
    } catch (error) {
      console.error('Error fetching prep items:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch prep items.",
      });
    }
  };

  const initializeFormData = async () => {
    try {
      // Fetch recipe prep items
      const { data: recipePrepItems, error: prepItemsError } = await supabase
        .from('recipe_prep_items')
        .select(`
          *,
          prep_items (*)
        `)
        .eq('recipe_id', recipe.id);

      if (prepItemsError) throw prepItemsError;

      setFormData({
        name: recipe.name || "",
        portions: recipe.portions || "",
        target_price: recipe.target_price || "",
        ingredients: recipe.recipe_ingredients?.map(ingredient => ({
          id: ingredient.id,
          inventory_item_id: ingredient.inventory_item_id,
          quantity: ingredient.quantity,
          unit: ingredient.unit
        })) || [],
        newIngredients: [],
        prepItems: recipePrepItems?.map(item => ({
          id: item.id,
          prep_item_id: item.prep_item_id,
          quantity: item.quantity,
          unit: item.unit
        })) || []
      });
    } catch (error) {
      console.error('Error initializing form data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load recipe data.",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.portions || formData.portions <= 0) {
      newErrors.portions = "Valid portions number is required";
    }

    if (formData.target_price && formData.target_price <= 0) {
      newErrors.target_price = "Target price must be greater than 0";
    }

    formData.ingredients.forEach((ingredient, index) => {
      if (!ingredient.inventory_item_id) {
        newErrors[`existing_ingredient_${index}`] = "Please select an ingredient";
      }
      if (!ingredient.quantity || ingredient.quantity <= 0) {
        newErrors[`existing_quantity_${index}`] = "Valid quantity is required";
      }
    });

    formData.newIngredients.forEach((ingredient, index) => {
      if (!ingredient.inventory_item_id) {
        newErrors[`new_ingredient_${index}`] = "Please select an ingredient";
      }
      if (!ingredient.quantity || ingredient.quantity <= 0) {
        newErrors[`new_quantity_${index}`] = "Valid quantity is required";
      }
    });

    formData.prepItems.forEach((item, index) => {
      if (!item.prep_item_id) {
        newErrors[`prep_item_${index}`] = "Please select a prep item";
      }
      if (!item.quantity || item.quantity <= 0) {
        newErrors[`prep_quantity_${index}`] = "Valid quantity is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const recipeData = {
        name: formData.name,
        portions: Number(formData.portions),
        target_price: formData.target_price ? Number(formData.target_price) : null,
        user_id: userId,
        updated_at: new Date().toISOString()
      };

      let recipeId;
      if (recipe) {
        // Update existing recipe
        const { error: updateError } = await supabase
          .from('recipes')
          .update(recipeData)
          .eq('id', recipe.id)
          .eq('user_id', userId);

        if (updateError) throw updateError;
        recipeId = recipe.id;

        // Delete existing ingredients and prep items
        const { error: deleteIngredientsError } = await supabase
          .from('recipe_ingredients')
          .delete()
          .eq('recipe_id', recipeId);

        if (deleteIngredientsError) throw deleteIngredientsError;

        const { error: deletePrepError } = await supabase
          .from('recipe_prep_items')
          .delete()
          .eq('recipe_id', recipeId);

        if (deletePrepError) throw deletePrepError;
      } else {
        // Create new recipe
        const { data: newRecipe, error: insertError } = await supabase
          .from('recipes')
          .insert([{ ...recipeData, created_at: new Date().toISOString() }])
          .select()
          .single();

        if (insertError) throw insertError;
        recipeId = newRecipe.id;
      }

      // Insert all ingredients (existing and new)
      const allIngredients = [...formData.ingredients, ...formData.newIngredients];
      if (allIngredients.length > 0) {
        const ingredientsData = allIngredients.map(ingredient => ({
          recipe_id: recipeId,
          inventory_item_id: ingredient.inventory_item_id,
          quantity: Number(ingredient.quantity),
          unit: ingredient.unit,
          created_at: new Date().toISOString()
        }));

        const { error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .insert(ingredientsData);

        if (ingredientsError) throw ingredientsError;
      }

      // Insert prep items
      if (formData.prepItems.length > 0) {
        const prepItemsData = formData.prepItems.map(item => ({
          recipe_id: recipeId,
          prep_item_id: item.prep_item_id,
          quantity: Number(item.quantity),
          unit: item.unit,
          user_id: userId,
          created_at: new Date().toISOString()
        }));

        const { error: prepItemsError } = await supabase
          .from('recipe_prep_items')
          .insert(prepItemsData);

        if (prepItemsError) throw prepItemsError;
      }

      toast({
        title: "Success",
        description: recipe ? "Recipe updated successfully" : "Recipe created successfully",
      });

      onSuccess();
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save recipe. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPrepItem = () => {
    setFormData(prev => ({
      ...prev,
      prepItems: [...prev.prepItems, {
        prep_item_id: "",
        quantity: "",
        unit: ""
      }]
    }));
  };

  const handlePrepItemChange = (index, field, value) => {
    const newPrepItems = [...formData.prepItems];
    if (field === 'prep_item_id') {
      const item = prepItems.find(i => i.id === value);
      newPrepItems[index] = {
        ...newPrepItems[index],
        [field]: value,
        unit: item?.yield_unit || ""
      };
    } else {
      newPrepItems[index] = {
        ...newPrepItems[index],
        [field]: value
      };
    }
    setFormData(prev => ({ ...prev, prepItems: newPrepItems }));
  };

  const handleRemovePrepItem = (index) => {
    setFormData(prev => ({
      ...prev,
      prepItems: prev.prepItems.filter((_, i) => i !== index)
    }));
  };

  const handleAddNewIngredient = () => {
    setFormData(prev => ({
      ...prev,
      newIngredients: [...prev.newIngredients, { inventory_item_id: "", quantity: "", unit: "" }]
    }));
  };

  const handleNewIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.newIngredients];
    if (field === 'inventory_item_id') {
      const item = inventoryItems.find(i => i.id === value);
      newIngredients[index] = {
        ...newIngredients[index],
        [field]: value,
        unit: item?.unit || ""
      };
    } else {
      newIngredients[index] = {
        ...newIngredients[index],
        [field]: value
      };
    }
    setFormData(prev => ({ ...prev, newIngredients }));
  };

  const handleRemoveNewIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      newIngredients: prev.newIngredients.filter((_, i) => i !== index)
    }));
  };

  const handleExistingIngredientsUpdate = (updatedIngredients) => {
    setFormData(prev => ({ ...prev, ingredients: updatedIngredients }));
  };

  const handleExistingIngredientDelete = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Recipe Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="portions">Portions</Label>
            <Input
              id="portions"
              type="number"
              min="1"
              step="1"
              value={formData.portions}
              onChange={(e) => setFormData(prev => ({ ...prev, portions: e.target.value }))}
              className={errors.portions ? "border-red-500" : ""}
            />
            {errors.portions && <span className="text-sm text-red-500">{errors.portions}</span>}
          </div>

          <div>
            <Label htmlFor="target_price">Target Price per Portion</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="target_price"
                type="number"
                min="0"
                step="0.01"
                value={formData.target_price}
                onChange={(e) => setFormData(prev => ({ ...prev, target_price: e.target.value }))}
                className={`pl-8 ${errors.target_price ? "border-red-500" : ""}`}
              />
            </div>
            {errors.target_price && <span className="text-sm text-red-500">{errors.target_price}</span>}
          </div>
        </div>

        <div className="border-t pt-6">
          <ExistingIngredients
            ingredients={formData.ingredients}
            inventoryItems={inventoryItems}
            onUpdate={handleExistingIngredientsUpdate}
            onDelete={handleExistingIngredientDelete}
            errors={errors}
          />
        </div>

        <div className="border-t pt-6">
          <NewIngredients
            ingredients={formData.newIngredients}
            inventoryItems={inventoryItems}
            onAdd={handleAddNewIngredient}
            onChange={handleNewIngredientChange}
            onRemove={handleRemoveNewIngredient}
            errors={errors}
          />
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <Label>Prep Items</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddPrepItem}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Prep Item
            </Button>
          </div>
          <div className="space-y-4">
            {formData.prepItems.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-2">
                <Select
                  value={item.prep_item_id}
                  onValueChange={(value) => handlePrepItemChange(index, 'prep_item_id', value)}
                >
                  <SelectTrigger className={errors[`prep_item_${index}`] ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select prep item" />
                  </SelectTrigger>
                  <SelectContent>
                    {prepItems.map((prepItem) => (
                      <SelectItem key={prepItem.id} value={prepItem.id}>
                        {prepItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => handlePrepItemChange(index, 'quantity', e.target.value)}
                    placeholder="Quantity"
                    className={`w-24 ${errors[`prep_quantity_${index}`] ? "border-red-500" : ""}`}
                  />
                  <Input
                    value={item.unit}
                    disabled
                    className="w-24"
                    placeholder="Unit"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemovePrepItem(index)}
                    className="h-10 w-10 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {errors[`prep_item_${index}`] && (
                  <span className="text-sm text-red-500">{errors[`prep_item_${index}`]}</span>
                )}
                {errors[`prep_quantity_${index}`] && (
                  <span className="text-sm text-red-500">{errors[`prep_quantity_${index}`]}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : (recipe ? "Update Recipe" : "Create Recipe")}
        </Button>
      </div>
    </form>
  );
}

export default RecipeForm;