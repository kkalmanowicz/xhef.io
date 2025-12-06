import React from 'react';

export const fetchVendors = async (supabase, userId) => {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('user_id', userId)
    .order('name');
  if (error) throw error;
  return data || [];
};

export const addVendor = async (supabase, userId, vendorData) => {
  const { data, error } = await supabase
    .from('vendors')
    .insert([{ ...vendorData, user_id: userId, created_at: new Date().toISOString() }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateVendor = async (supabase, vendorId, userId, vendorData) => {
  // Ensure 'id' and 'user_id' are not part of the update payload if they are immutable or handled by RLS
  const { id, user_id, created_at, ...updatePayload } = vendorData;
  const { data, error } = await supabase
    .from('vendors')
    .update({ ...updatePayload, updated_at: new Date().toISOString() })
    .eq('id', vendorId)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteVendorById = async (supabase, vendorId, userId) => {
  const { error } = await supabase
    .from('vendors')
    .delete()
    .eq('id', vendorId)
    .eq('user_id', userId);
  if (error) {
    if (error.code === '23503') { // Foreign key violation
      throw new Error("Failed to delete vendor. It is likely associated with existing inventory items. Please reassign or delete those items first.");
    }
    throw error;
  }
};