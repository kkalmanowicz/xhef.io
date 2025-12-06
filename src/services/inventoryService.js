import React from 'react';

const sanitizeUnit = (unitValue) => {
  if (typeof unitValue === 'string') {
    const trimmedUnit = unitValue.trim().toLowerCase();
    if (trimmedUnit === 'unit') {
      return 'units';
    }
    return unitValue.trim(); 
  }
  return unitValue;
};

export const fetchInventoryItems = async (supabase, userId) => {
  const { data, error } = await supabase
    .from('inventory_items')
    .select(`
      id, name, current_stock, par_level, unit, default_price, last_price, sku,
      category_id, categories (id, name),
      vendor_id, vendors (id, name),
      is_custom_item
    `)
    .eq('user_id', userId)
    .order('name', { ascending: true });
  if (error) throw error;
  return data || [];
};

export const fetchCategories = async (supabase, userId) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('name');
  if (error) throw error;
  return data || [];
};

export const fetchVendors = async (supabase, userId) => {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('user_id', userId)
    .order('name');
  if (error) throw error;
  return data || [];
};

export const addInventoryItem = async (supabase, userId, itemData) => {
  const sanitizedItemData = {
    ...itemData,
    unit: sanitizeUnit(itemData.unit),
  };
  const { data, error } = await supabase
    .from('inventory_items')
    .insert([{ ...sanitizedItemData, user_id: userId, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateInventoryItem = async (supabase, itemId, userId, itemData) => {
  const sanitizedItemData = {
    ...itemData,
    unit: sanitizeUnit(itemData.unit),
  };
  const { data, error } = await supabase
    .from('inventory_items')
    .update({ ...sanitizedItemData, updated_at: new Date().toISOString() })
    .eq('id', itemId)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteInventoryItemById = async (supabase, itemId, userId) => {
  const { error } = await supabase
    .from('inventory_items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', userId);
  if (error) throw error;
};

export const bulkInsertInventoryItems = async (supabase, userId, itemsToInsert, categories, vendors) => {
  const findOrCreateId = async (name, table, existingItems, fieldName = 'name') => {
    if (!name || name.trim() === '') return null;
    const existing = existingItems.find(c => c[fieldName].toLowerCase() === name.toLowerCase());
    if (existing) return existing.id;

    const { data, error } = await supabase
      .from(table)
      .insert({ [fieldName]: name.trim(), user_id: userId, created_at: new Date().toISOString() })
      .select('id')
      .single();
    if (error) throw new Error(`Failed to create ${table.slice(0, -1)} "${name}": ${error.message}`);
    existingItems.push({ id: data.id, [fieldName]: name.trim() }); 
    return data.id;
  };

  const processedItems = [];
  const errors = [];

  for (let i = 0; i < itemsToInsert.length; i++) {
    const row = itemsToInsert[i];
    const itemName = row.name || row.item_name;
    if (!itemName || itemName.trim() === '') {
      errors.push({ row: i + 2, message: "Item name is missing." });
      continue;
    }

    let categoryId = null;
    if (row.category || row.category_name) {
      try {
        categoryId = await findOrCreateId(row.category || row.category_name, 'categories', categories);
      } catch (e) {
        errors.push({ row: i + 2, item: itemName, message: e.message });
        continue;
      }
    } else {
        errors.push({ row: i + 2, item: itemName, message: "Category name is required." });
        continue;
    }

    let vendorId = null;
    if (row.vendor || row.vendor_name) {
      try {
        vendorId = await findOrCreateId(row.vendor || row.vendor_name, 'vendors', vendors);
      } catch (e) {
        errors.push({ row: i + 2, item: itemName, message: e.message });
        continue;
      }
    }
    
    const currentStock = parseFloat(row.current_stock || row.stock || 0);
    const parLevel = parseFloat(row.par_level || 0);
    const defaultPrice = row.default_price ? parseFloat(row.default_price) : null;
    const lastPrice = row.last_price ? parseFloat(row.last_price) : null;
    const sku = row.sku || row.item_code || row.vendor_sku || null;
    const itemUnit = sanitizeUnit(row.unit);

    if (isNaN(currentStock) || currentStock < 0) { errors.push({ row: i + 2, item: itemName, message: "Invalid current stock."}); continue; }
    if (isNaN(parLevel) || parLevel < 0) { errors.push({ row: i + 2, item: itemName, message: "Invalid par level."}); continue; }
    if (defaultPrice !== null && (isNaN(defaultPrice) || defaultPrice < 0)) { errors.push({ row: i + 2, item: itemName, message: "Invalid default price."}); continue; }
    if (lastPrice !== null && (isNaN(lastPrice) || lastPrice < 0)) { errors.push({ row: i + 2, item: itemName, message: "Invalid last price."}); continue; }
    if (!itemUnit || itemUnit.trim() === '') { errors.push({ row: i + 2, item: itemName, message: "Unit is required."}); continue; }

    processedItems.push({
      name: itemName.trim(),
      current_stock: currentStock,
      par_level: parLevel,
      unit: itemUnit,
      category_id: categoryId,
      vendor_id: vendorId,
      default_price: defaultPrice,
      last_price: lastPrice,
      sku: sku ? String(sku).trim() : null,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_custom_item: false, 
    });
  }

  let successCount = 0;
  if (processedItems.length > 0) {
    const { data: insertedData, error: insertError } = await supabase
      .from('inventory_items')
      .insert(processedItems)
      .select(); 
      
    if (insertError) {
      errors.push({ row: 'N/A', message: `Database insert error: ${insertError.message}` });
    } else {
      successCount = insertedData ? insertedData.length : 0;
    }
  }
  return { successCount, errors };
};