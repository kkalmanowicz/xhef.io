import { useState, useCallback, useEffect, useRef } from 'react';
import { fetchInventoryItems, fetchCategories, fetchVendors } from '@/services/inventoryService';

const useInventoryData = (supabase, userId, toast, isMountedRef) => {
  const [items, setItems] = useState([]);
  const [categories, setCategoriesData] = useState([]);
  const [vendors, setVendorsData] = useState([]);
  const [loading, setLoading] = useState({
    inventory: true,
    categories: true,
    vendors: true,
    initialLoad: true,
  });
  const initialDataLoaded = useRef(false);

  const updateLoadingState = useCallback((key, value) => {
    if (isMountedRef && isMountedRef.current) {
      setLoading(prev => ({ ...prev, [key]: value }));
    }
  }, [isMountedRef]);

  const loadInventory = useCallback(async (showLoader = true) => {
    if (!userId || !supabase) return;
    if (showLoader) updateLoadingState('inventory', true);
    try {
      const data = await fetchInventoryItems(supabase, userId);
      if (isMountedRef && isMountedRef.current) setItems(data);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      if (isMountedRef && isMountedRef.current) toast({ variant: "destructive", title: "Error", description: "Failed to fetch inventory items." });
    } finally {
      if (isMountedRef && isMountedRef.current) updateLoadingState('inventory', false);
    }
  }, [supabase, userId, toast, updateLoadingState, isMountedRef]);

  const loadCategoriesAndVendors = useCallback(async (showLoader = true) => {
    if (!userId || !supabase) return;
    if (showLoader) {
      updateLoadingState('categories', true);
      updateLoadingState('vendors', true);
    }
    try {
      const [cats, vends] = await Promise.all([
        fetchCategories(supabase, userId),
        fetchVendors(supabase, userId)
      ]);
      if (isMountedRef && isMountedRef.current) {
        setCategoriesData(cats || []);
        setVendorsData(vends || []);
      }
    } catch (error) {
      console.error('Error fetching categories or vendors:', error);
      if (isMountedRef && isMountedRef.current) toast({ variant: "destructive", title: "Error", description: "Failed to fetch categories or vendors." });
    } finally {
      if (isMountedRef && isMountedRef.current) {
        updateLoadingState('categories', false);
        updateLoadingState('vendors', false);
      }
    }
  }, [supabase, userId, toast, updateLoadingState, isMountedRef]);

  useEffect(() => {
    if (userId && supabase && !initialDataLoaded.current && isMountedRef && isMountedRef.current) {
      updateLoadingState('initialLoad', true);
      Promise.all([
        loadInventory(),
        loadCategoriesAndVendors()
      ]).finally(() => {
        if (isMountedRef && isMountedRef.current) {
            updateLoadingState('initialLoad', false);
            initialDataLoaded.current = true;
        }
      });
    }
  }, [userId, supabase, loadInventory, loadCategoriesAndVendors, updateLoadingState, isMountedRef]);

  return {
    items,
    categories,
    vendors,
    loading,
    loadInventory,
    loadCategoriesAndVendors,
    setItems, 
    setCategoriesData,
    setVendorsData,
  };
};

export default useInventoryData;