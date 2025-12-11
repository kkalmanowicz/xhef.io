import React from 'react';

export const fetchCategories = async (supabase, userId) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('name');
  if (error) throw error;
  return data || [];
};

export const addCategory = async (supabase, userId, categoryData) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([
      {
        name: categoryData.name,
        user_id: userId,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateCategory = async (
  supabase,
  categoryId,
  userId,
  categoryData
) => {
  const { data, error } = await supabase
    .from('categories')
    .update({ name: categoryData.name, updated_at: new Date().toISOString() })
    .eq('id', categoryId)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteCategoryById = async (supabase, categoryId, userId) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId)
    .eq('user_id', userId);
  if (error) {
    if (error.code === '23503') {
      throw new Error(
        'Failed to delete category. It is likely associated with existing items. Please reassign or delete those items first.'
      );
    }
    throw error;
  }
};
