import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ShoppingCart, History, AlertTriangle, PackagePlus } from "lucide-react";
import { useSupabase } from "@/contexts/SupabaseContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

import CurrentOrderTab from "@/components/orderlist/CurrentOrderTab";
import SuggestedItemsTab from "@/components/orderlist/SuggestedItemsTab";
import OrderHistoryTab from "@/components/orderlist/OrderHistoryTab";
import AddToOrderDialog from "@/components/inventory/AddToOrderDialog";
import EditOrderItemDialog from "@/components/orderlist/EditOrderItemDialog";
import QuickAddItemDialog from "@/components/orderlist/QuickAddItemDialog";
import ReorderDialog from "@/components/orderlist/ReorderDialog";

import {
  fetchCurrentOrderItems,
  fetchSuggestedOrderItems,
  fetchOrderHistoryPageData,
} from "@/services/orderService";
import { fetchCategories } from "@/services/categoryService";
import { fetchVendors } from "@/services/vendorService";

import OrderListHeader from "@/components/orderlist/OrderListHeader";
import OrderListModals from "@/components/orderlist/OrderListModals";
import OrderListFilterControls from "@/components/orderlist/OrderListFilterControls";

import useOrderListRealtime from "@/hooks/useOrderListRealtime";
import useOrderListActions from "@/hooks/useOrderListActions";
import useOrderListModalsHook from "@/hooks/useOrderListModals";

function OrderList() {
  const { supabase, userId } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [currentOrder, setCurrentOrder] = useState([]);
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isReorderDialogOpen, setIsReorderDialogOpen] = useState(false);
  const [historicalOrderToReorder, setHistoricalOrderToReorder] = useState(null);


  const [loadingStates, setLoadingStates] = useState({
    current: true,
    suggested: true,
    history: true,
    categories: true,
    vendors: true,
    initialPageLoad: true,
  });
  const [activeTab, setActiveTab] = useState("current");

  const isMounted = useRef(true);
  const initialLoadPerformed = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const updateLoadingState = useCallback((key, value) => {
    if (isMounted.current) {
      setLoadingStates(prev => ({ ...prev, [key]: value }));
    }
  }, []);

  const loadData = useCallback(async (dataType, fetchFunction, showLoader = true) => {
    if (!userId || !supabase) return;
    if (showLoader) updateLoadingState(dataType, true);
    try {
      const data = await fetchFunction(supabase, userId);
      if (isMounted.current) {
        if (dataType === 'current') setCurrentOrder(data);
        else if (dataType === 'suggested') setSuggestedItems(data);
        else if (dataType === 'history') setOrderHistory(data);
      }
    } catch (error) {
      console.error(`Error fetching ${dataType}:`, error);
      if (isMounted.current) toast({ variant: "destructive", title: "Error", description: `Failed to fetch ${dataType}.` });
    } finally {
      if (isMounted.current) updateLoadingState(dataType, false);
    }
  }, [supabase, userId, toast, updateLoadingState]);

  const loadCurrentOrder = useCallback((showLoader = true) => loadData('current', fetchCurrentOrderItems, showLoader), [loadData]);
  const loadSuggestedItems = useCallback((showLoader = true) => loadData('suggested', fetchSuggestedOrderItems, showLoader), [loadData]);
  const loadOrderHistory = useCallback((showLoader = true) => loadData('history', fetchOrderHistoryPageData, showLoader), [loadData]);

  const loadCategoriesAndVendors = useCallback(async () => {
    if (!userId || !supabase) return;
    updateLoadingState('categories', true);
    updateLoadingState('vendors', true);
    try {
      const [categoriesData, vendorsData] = await Promise.all([
        fetchCategories(supabase, userId),
        fetchVendors(supabase, userId)
      ]);
      if (isMounted.current) {
        setCategories(categoriesData || []);
        setVendors(vendorsData || []);
      }
    } catch (error) {
      console.error("Error fetching filters data:", error);
      if (isMounted.current) toast({ variant: "destructive", title: "Error", description: "Failed to load filters." });
    } finally {
      if (isMounted.current) {
        updateLoadingState('categories', false);
        updateLoadingState('vendors', false);
      }
    }
  }, [supabase, userId, toast, updateLoadingState]);
  
  useEffect(() => {
    if (userId && supabase && !initialLoadPerformed.current) {
      updateLoadingState('initialPageLoad', true);
      Promise.all([
        loadCurrentOrder(),
        loadSuggestedItems(),
        loadOrderHistory(),
        loadCategoriesAndVendors()
      ]).finally(() => {
        if(isMounted.current) {
          updateLoadingState('initialPageLoad', false);
          initialLoadPerformed.current = true;
        }
      });
    }
  }, [userId, supabase, loadCurrentOrder, loadSuggestedItems, loadOrderHistory, loadCategoriesAndVendors, updateLoadingState]);

  useOrderListRealtime(supabase, userId, loadCurrentOrder, loadSuggestedItems, loadOrderHistory);

  const { 
    modalState, 
    selectedInventoryItem, 
    itemToDelete, 
    itemToEdit,
    handleOpenModal, 
    handleCloseModal 
  } = useOrderListModalsHook();

  const {
    isCompletingOrder,
    isDeletingItem,
    isSavingOrderItem,
    handleUpdateOrderItem,
    executeDeleteItem,
    executeCompleteOrder,
  } = useOrderListActions(
    supabase, 
    userId, 
    currentOrder, 
    itemToDelete, 
    itemToEdit, 
    handleCloseModal, 
    navigate, 
    toast,
    loadCurrentOrder, 
    loadSuggestedItems 
  );

  const filteredCurrentOrder = useMemo(() => {
    return currentOrder.filter(item => {
      const categoryName = item.inventory_items?.categories?.name;
      const vendorName = item.inventory_items?.vendors?.name;
      const selectedCategoryObj = categories.find(c => c.id === selectedCategory);
      const selectedVendorObj = vendors.find(v => v.id === selectedVendor);
      const categoryMatch = !selectedCategory || (selectedCategoryObj && categoryName === selectedCategoryObj.name);
      const vendorMatch = !selectedVendor || (selectedVendorObj && vendorName === selectedVendorObj.name);
      return categoryMatch && vendorMatch;
    });
  }, [currentOrder, selectedCategory, selectedVendor, categories, vendors]);

  const filteredSuggestedItems = useMemo(() => {
    return suggestedItems.filter(item => {
      const categoryName = item.categories?.name;
      const vendorName = item.vendors?.name;
      const selectedCategoryObj = categories.find(c => c.id === selectedCategory);
      const selectedVendorObj = vendors.find(v => v.id === selectedVendor);
      const categoryMatch = !selectedCategory || (selectedCategoryObj && categoryName === selectedCategoryObj.name);
      const vendorMatch = !selectedVendor || (selectedVendorObj && vendorName === selectedVendorObj.name);
      return categoryMatch && vendorMatch;
    });
  }, [suggestedItems, selectedCategory, selectedVendor, categories, vendors]);

  const filteredOrderHistory = useMemo(() => {
    if (!selectedVendor && !selectedCategory) return orderHistory;
    const selectedCategoryObj = categories.find(c => c.id === selectedCategory);
    const selectedVendorObj = vendors.find(v => v.id === selectedVendor);
    return orderHistory
      .map(order => ({
        ...order,
        order_history: order.order_history.filter(item => {
          const categoryName = item.inventory_items?.categories?.name; 
          const vendorName = item.inventory_items?.vendors?.name;
          const categoryMatch = !selectedCategory || (selectedCategoryObj && categoryName === selectedCategoryObj.name);
          const vendorMatch = !selectedVendor || (selectedVendorObj && vendorName === selectedVendorObj.name);
          return categoryMatch && vendorMatch;
        }),
      }))
      .filter(order => order.order_history.length > 0);
  }, [orderHistory, selectedCategory, selectedVendor, categories, vendors]);

  const currentOrderTotal = useMemo(() => {
    return filteredCurrentOrder.reduce((sum, item) => sum + (item.total_price || 0), 0);
  }, [filteredCurrentOrder]);

  if (loadingStates.initialPageLoad && !userId) { 
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="ml-4 text-lg text-gray-600 dark:text-gray-300">Initializing...</p>
      </div>
    );
  }
  
  if (loadingStates.initialPageLoad && userId) {
     return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  const handleQuickAddSuccess = () => {
    setIsQuickAddOpen(false);
    loadCurrentOrder(false); 
    loadCategoriesAndVendors(); 
  };

  const handleOpenReorderDialog = (order) => {
    setHistoricalOrderToReorder(order);
    setIsReorderDialogOpen(true);
  };

  const handleReorderSuccess = () => {
    loadCurrentOrder(false); 
    setActiveTab("current");
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <OrderListHeader 
          currentOrderTotal={currentOrderTotal} 
          onCompleteOrder={() => handleOpenModal('isCompleteOrderOpen')}
          isCompletingOrder={isCompletingOrder}
          hasItems={currentOrder.length > 0}
        />
        <Button 
            onClick={() => setIsQuickAddOpen(true)} 
            variant="outline" 
            className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-400/10"
        >
            <PackagePlus className="w-4 h-4 mr-2" />
            Quick Add Item
        </Button>
      </div>

      <OrderListFilterControls
        categories={categories}
        vendors={vendors}
        selectedCategory={selectedCategory}
        onSelectedCategoryChange={setSelectedCategory}
        selectedVendor={selectedVendor}
        onSelectedVendorChange={setSelectedVendor}
        isLoadingCategories={loadingStates.categories}
        isLoadingVendors={loadingStates.vendors}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 border-b dark:border-gray-700">
          <TabsTrigger value="current">
            <ShoppingCart className="w-4 h-4 mr-2" /> Current Order ({filteredCurrentOrder.length})
          </TabsTrigger>
          <TabsTrigger value="suggested">
            <AlertTriangle className="w-4 h-4 mr-2" /> Suggested ({filteredSuggestedItems.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" /> History ({filteredOrderHistory.length})
          </TabsTrigger>
        </TabsList>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mt-4"
        >
          <TabsContent value="current">
            <CurrentOrderTab
              items={filteredCurrentOrder}
              loading={loadingStates.current && !initialLoadPerformed.current}
              onEditItem={(item) => handleOpenModal('isEditOrderItemOpen', item)}
              onDeleteItem={(item) => handleOpenModal('isDeleteOpen', item)}
              selectedVendor={selectedVendor}
              selectedCategory={selectedCategory}
            />
          </TabsContent>
          <TabsContent value="suggested">
            <SuggestedItemsTab
              items={filteredSuggestedItems}
              loading={loadingStates.suggested && !initialLoadPerformed.current}
              onAddToOrder={(item) => handleOpenModal('isAddToOrderOpen', item)}
              currentOrderItems={currentOrder}
              selectedVendor={selectedVendor}
              selectedCategory={selectedCategory}
            />
          </TabsContent>
          <TabsContent value="history">
            <OrderHistoryTab 
              orders={filteredOrderHistory} 
              loading={loadingStates.history && !initialLoadPerformed.current}
              selectedVendor={selectedVendor}
              selectedCategory={selectedCategory}
              onReorder={handleOpenReorderDialog}
            />
          </TabsContent>
        </motion.div>
      </Tabs>

      <OrderListModals
        modalState={modalState}
        handleCloseModal={handleCloseModal}
        itemToDelete={itemToDelete}
        executeDeleteItem={executeDeleteItem}
        isDeletingItem={isDeletingItem}
        currentOrderTotal={currentOrderTotal}
        executeCompleteOrder={executeCompleteOrder}
        isCompletingOrder={isCompletingOrder}
      />
      
      {selectedInventoryItem && (
        <AddToOrderDialog
          item={selectedInventoryItem} 
          isOpen={modalState.isAddToOrderOpen}
          onClose={() => handleCloseModal('isAddToOrderOpen')} 
        />
      )}

      {itemToEdit && (
        <EditOrderItemDialog
          isOpen={modalState.isEditOrderItemOpen}
          onOpenChange={(open) => {
            if (!open) handleCloseModal('isEditOrderItemOpen');
          }}
          item={itemToEdit}
          onSave={handleUpdateOrderItem}
          isSaving={isSavingOrderItem}
        />
      )}

      <QuickAddItemDialog 
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSuccess={handleQuickAddSuccess}
      />

      {historicalOrderToReorder && (
        <ReorderDialog
          historicalOrder={historicalOrderToReorder}
          isOpen={isReorderDialogOpen}
          onClose={() => {
            setIsReorderDialogOpen(false);
            setHistoricalOrderToReorder(null);
          }}
          onReorderSuccess={handleReorderSuccess}
        />
      )}

    </div>
  );
}

export default OrderList;