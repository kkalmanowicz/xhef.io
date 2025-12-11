import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useToast } from '@/components/ui/use-toast';

const usePrepItemForm = existingItem => {
  const { supabase, userId } = useSupabase();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: existingItem?.name || '',
    station: existingItem?.station || 'other',
    current_stock: existingItem?.current_stock || 0,
    par_level: existingItem?.par_level || 0,
    yield_unit: existingItem?.yield_unit || 'units',
    notes: existingItem?.notes || '',
    ingredients:
      existingItem?.prep_item_ingredients?.map(ing => ({
        inventory_item_id: ing.inventory_item_id,
        quantity: ing.quantity,
        unit: ing.unit,
        id: ing.id,
      })) || [],
  });
  const [inventoryItems, setInventoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInventoryItems = useCallback(async () => {
    if (!userId || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('id, name, unit')
        .eq('user_id', userId);
      if (error) throw error;
      setInventoryItems(data || []);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch inventory items.',
      });
    }
  }, [supabase, userId, toast]);

  useEffect(() => {
    fetchInventoryItems();
  }, [fetchInventoryItems]);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { inventory_item_id: '', quantity: 0, unit: 'units' },
      ],
    }));
  };

  const handleRemoveIngredient = index => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? { ...ing, [field]: value } : ing
      ),
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Prep item name is required.',
      });
      return false;
    }
    if (formData.ingredients.length > 0) {
      for (const ing of formData.ingredients) {
        if (!ing.inventory_item_id) {
          toast({
            variant: 'destructive',
            title: 'Validation Error',
            description: 'Please select an item for each ingredient.',
          });
          return false;
        }
        if (parseFloat(ing.quantity) <= 0) {
          toast({
            variant: 'destructive',
            title: 'Validation Error',
            description: 'Ingredient quantity must be greater than 0.',
          });
          return false;
        }
        if (!ing.unit) {
          toast({
            variant: 'destructive',
            title: 'Validation Error',
            description: 'Please select a unit for each ingredient.',
          });
          return false;
        }
      }
    }
    return true;
  };

  const calculateStatus = (currentStock, parLevel) => {
    const stock = parseFloat(currentStock);
    const par = parseFloat(parLevel);
    if (isNaN(stock) || isNaN(par)) return 'not-needed';
    if (stock <= 0) return 'urgent';
    if (stock < par) return 'needed';
    return 'not-needed';
  };

  const upsertPrepItem = async () => {
    const status = calculateStatus(formData.current_stock, formData.par_level);
    const prepItemPayload = {
      name: formData.name,
      station: formData.station,
      current_stock: parseFloat(formData.current_stock) || 0,
      par_level: parseFloat(formData.par_level) || 0,
      yield_unit: formData.yield_unit,
      notes: formData.notes,
      status,
      user_id: userId,
      updated_at: new Date().toISOString(),
    };

    if (existingItem?.id) {
      const { data, error } = await supabase
        .from('prep_items')
        .update(prepItemPayload)
        .eq('id', existingItem.id)
        .eq('user_id', userId)
        .select('id')
        .single();
      if (error) throw error;
      return data.id;
    } else {
      const { data, error } = await supabase
        .from('prep_items')
        .insert([{ ...prepItemPayload, created_at: new Date().toISOString() }])
        .select('id')
        .single();
      if (error) throw error;
      if (!data || !data.id)
        throw new Error(
          'Failed to create prep item: No ID returned from database.'
        );
      return data.id;
    }
  };

  const manageIngredients = async prepItemId => {
    if (existingItem?.id) {
      const { error: deleteError } = await supabase
        .from('prep_item_ingredients')
        .delete()
        .eq('prep_item_id', prepItemId)
        .eq('user_id', userId);
      if (deleteError) throw deleteError;
    }

    if (formData.ingredients.length > 0) {
      const ingredientsToInsert = formData.ingredients.map(ing => ({
        prep_item_id: prepItemId,
        inventory_item_id: ing.inventory_item_id,
        quantity: parseFloat(ing.quantity) || 0,
        unit: ing.unit,
        user_id: userId,
      }));
      const { error: ingredientsError } = await supabase
        .from('prep_item_ingredients')
        .insert(ingredientsToInsert);
      if (ingredientsError) throw ingredientsError;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return false;
    setIsLoading(true);
    try {
      const prepItemId = await upsertPrepItem();
      await manageIngredients(prepItemId);
      toast({
        title: 'Success',
        description: `Prep item ${existingItem?.id ? 'updated' : 'created'} successfully!`,
      });
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error saving prep item:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error.message ||
          `Failed to ${existingItem?.id ? 'update' : 'create'} prep item.`,
      });
      setIsLoading(false);
      return false;
    }
  };

  return {
    formData,
    inventoryItems,
    isLoading,
    handleFormChange,
    handleAddIngredient,
    handleRemoveIngredient,
    handleIngredientChange,
    handleSubmit,
  };
};

export default usePrepItemForm;
