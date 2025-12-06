import React from "react";

export const fetchCurrentOrderItems = async (supabase, userId) => {
  const { data, error } = await supabase
    .from('order_items')
    .select(`
      *,
      inventory_items (
        id,
        name,
        unit,
        categories (name),
        vendors (id, name)
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'pending')
    .is('order_id', null)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const fetchSuggestedOrderItems = async (supabase, userId) => {
  const { data, error } = await supabase
    .from('inventory_items')
    .select(`
      *,
      categories (name),
      vendors (id, name)
    `)
    .eq('user_id', userId)
    .not('current_stock', 'is', null)
    .not('par_level', 'is', null);

  if (error) throw error;

  return (data || [])
    .map(item => {
      const stockPercentage = item.par_level > 0 ? ((item.current_stock / item.par_level) * 100) : 100;
      const stockDifference = Math.max(0, item.par_level - item.current_stock);
      let urgency = 1; // Low
      if (stockPercentage <= 25) urgency = 3; // High
      else if (stockPercentage <= 50) urgency = 2; // Medium

      return {
        ...item,
        stock_percentage: stockPercentage.toFixed(2),
        stock_difference: stockDifference,
        urgency
      };
    })
    .filter(item => item.current_stock < item.par_level)
    .sort((a, b) => b.urgency - a.urgency || a.name.localeCompare(b.name));
};

export const fetchOrderHistoryPageData = async (supabase, userId) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_history (
        *,
        inventory_items (
          name,
          unit,
          vendors (name)
        )
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'completed')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const fetchCompletedOrderDetails = async (supabase, userId, orderId) => {
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .eq('user_id', userId)
    .eq('status', 'completed')
    .single();

  if (orderError) throw orderError;
  if (!orderData) throw new Error('Order not found or not completed.');

  const { data: orderItemsData, error: itemsError } = await supabase
    .from('order_history')
    .select(`
      *,
      inventory_items (
        name,
        unit,
        vendors (id, name)
      )
    `)
    .eq('order_id', orderId)
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (itemsError) throw itemsError;

  return { ...orderData, items: orderItemsData || [] };
};


export const updateOrderItemQuantity = async (supabase, itemId, newQuantity, pricePerUnit) => {
  const quantity = parseFloat(newQuantity);
  if (isNaN(quantity) || quantity < 0) return { error: { message: "Invalid quantity" } };

  return await supabase
    .from('order_items')
    .update({ 
      quantity,
      total_price: quantity * (pricePerUnit || 0)
    })
    .eq('id', itemId);
};

export const updateOrderItemPrice = async (supabase, itemId, newPrice, currentQuantity) => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) return { error: { message: "Invalid price" } };
    const quantity = parseFloat(currentQuantity);
    if(isNaN(quantity)) return { error: { message: "Invalid quantity for price update"}};


    return await supabase
        .from('order_items')
        .update({
            price_per_unit: price,
            total_price: price * quantity
        })
        .eq('id', itemId);
};


export const deleteOrderItem = async (supabase, itemId, userId) => {
  return await supabase
    .from('order_items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', userId); 
};

export const completeOrder = async (supabase, userId, currentOrderItems) => {
  if (currentOrderItems.length === 0) throw new Error("Current order is empty.");

  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      status: 'completed',
      user_id: userId,
      created_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      total_amount: currentOrderItems.reduce((sum, item) => sum + (item.total_price || 0), 0)
    })
    .select()
    .single();

  if (orderError) throw orderError;

  const orderHistoryItems = currentOrderItems.map(item => ({
    order_id: orderData.id,
    inventory_item_id: item.inventory_item_id,
    quantity: item.quantity,
    unit: item.inventory_items?.unit || item.unit, 
    price_per_unit: item.price_per_unit,
    total_price: item.total_price,
    created_at: new Date().toISOString(),
    user_id: userId 
  }));

  const { error: historyError } = await supabase
    .from('order_history')
    .insert(orderHistoryItems);

  if (historyError) throw historyError;

  const { error: deleteError } = await supabase
    .from('order_items')
    .delete()
    .eq('user_id', userId)
    .eq('status', 'pending')
    .is('order_id', null);

  if (deleteError) throw deleteError;

  return orderData;
};