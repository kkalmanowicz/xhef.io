import { calculateWasteItemCost } from "@/lib/wasteUtils";

export const fetchWastePageData = async (supabase, userId) => {
  const [inventoryData, prepData, wasteDataResult] = await Promise.all([
    supabase
      .from('inventory_items')
      .select('id, name, unit, current_stock, default_price, last_price')
      .eq('user_id', userId)
      .order('name'),
    supabase
      .from('prep_items')
      .select(`
        id, name, yield_unit, current_stock,
        prep_item_ingredients ( inventory_item_id, quantity, unit )
      `)
      .eq('user_id', userId)
      .order('name'),
    supabase
      .from('waste_items')
      .select(`
        id, item_type, quantity, unit, reason, cost, created_at,
        inventory_item_id, prep_item_id,
        inventory_items ( name, unit ),
        prep_items ( name, yield_unit )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  ]);

  if (inventoryData.error) throw inventoryData.error;
  if (prepData.error) throw prepData.error;
  if (wasteDataResult.error) throw wasteDataResult.error;

  const fetchedInventoryItems = inventoryData.data || [];
  
  const enrichedPrepItems = (prepData.data || []).map(prepItem => {
    const ingredientsWithDetails = prepItem.prep_item_ingredients.map(ing => {
      const invItemDetails = fetchedInventoryItems.find(i => i.id === ing.inventory_item_id);
      return { ...ing, inventory_items: invItemDetails };
    });
    return { ...prepItem, prep_item_ingredients: ingredientsWithDetails };
  });

  const processedWasteItems = (wasteDataResult.data || []).map(item => {
    // Ensure cost is a number, default to 0 if null or undefined, or recalculate if not present
    let cost = typeof item.cost === 'number' ? item.cost : 0;
    if (!item.cost && (item.inventory_item_id || item.prep_item_id)) { // Recalculate if cost is missing
        cost = calculateWasteItemCost(item, fetchedInventoryItems, enrichedPrepItems);
    }
    return { ...item, cost };
  });

  return {
    inventoryItems: fetchedInventoryItems,
    prepItems: enrichedPrepItems,
    wasteItems: processedWasteItems,
  };
};

export const calculateWasteSummaryData = (items) => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return items.reduce((acc, item) => {
    const itemDate = new Date(item.created_at);
    const quantity = parseFloat(item.quantity) || 0;
    const cost = parseFloat(item.cost) || 0;

    acc.totalQuantity += quantity;
    acc.totalCost += cost;
    
    if (itemDate >= weekAgo) {
      acc.weeklyWaste += quantity;
      acc.weeklyCount++;
    }
    return acc;
  }, { totalQuantity: 0, totalCost: 0, weeklyWaste: 0, weeklyCount: 0 });
};

export const deleteWasteItemById = async (supabase, userId, wasteItemId) => {
  const { error } = await supabase
    .from('waste_items')
    .delete()
    .eq('id', wasteItemId)
    .eq('user_id', userId);
  if (error) throw error;
};