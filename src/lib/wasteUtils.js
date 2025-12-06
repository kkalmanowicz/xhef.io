export const calculateWasteItemCost = (wasteItem, inventoryItems, prepItems) => {
  const qty = parseFloat(wasteItem.quantity);
  if (isNaN(qty) || qty <= 0) return 0;

  if (wasteItem.item_type === 'inventory' && wasteItem.inventory_item_id) {
    const item = inventoryItems.find(i => i.id === wasteItem.inventory_item_id);
    return (item?.last_price || item?.default_price || 0) * qty;
  } else if (wasteItem.item_type === 'prep' && wasteItem.prep_item_id) {
    const item = prepItems.find(p => p.id === wasteItem.prep_item_id);
    if (!item || !item.prep_item_ingredients) return 0;
    
    const singlePrepItemCost = item.prep_item_ingredients.reduce((acc, ing) => {
      // prepItems are already enriched, so ing.inventory_items should exist
      const ingDetails = ing.inventory_items; 
      const ingPrice = ingDetails?.last_price || ingDetails?.default_price || 0;
      return acc + (ingPrice * (parseFloat(ing.quantity) || 0));
    }, 0);
    return singlePrepItemCost * qty;
  }
  return 0;
};