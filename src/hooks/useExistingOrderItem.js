import React, { useState, useEffect } from 'react';

const useExistingOrderItem = (item, isOpen, supabase, userId) => {
  const [existingOrderItem, setExistingOrderItem] = useState(null);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);
  const [errorExisting, setErrorExisting] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (item && isOpen && supabase && userId) {
      const checkExistingOrder = async () => {
        if (!item.id) return;
        
        setIsLoadingExisting(true);
        setExistingOrderItem(null);
        setErrorExisting(null);
        
        try {
          const { data, error } = await supabase
            .from('order_items')
            .select('*')
            .eq('inventory_item_id', item.id)
            .eq('status', 'pending')
            .eq('user_id', userId)
            .is('order_id', null)
            .maybeSingle();

          if (!isMounted) return;

          if (error) {
            console.error("Error checking existing order item (hook):", error);
            setErrorExisting(error);
            setExistingOrderItem(null);
          } else {
            setExistingOrderItem(data);
          }
        } catch (e) {
          if (!isMounted) return;
          console.error("Exception checking existing order item (hook):", e);
          setErrorExisting(e);
          setExistingOrderItem(null);
        } finally {
          if (isMounted) setIsLoadingExisting(false);
        }
      };
      checkExistingOrder();
    } else if (!isOpen) {
      setExistingOrderItem(null);
      setIsLoadingExisting(false);
      setErrorExisting(null);
    }
    return () => { isMounted = false; };
  }, [item, isOpen, supabase, userId]);

  return { existingOrderItem, isLoadingExisting, errorExisting };
};

export default useExistingOrderItem;