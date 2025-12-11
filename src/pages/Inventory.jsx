import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import AddInventoryForm from '@/components/inventory/AddInventoryForm';
import EditInventoryForm from '@/components/inventory/EditInventoryForm';
import AddToOrderDialog from '@/components/inventory/AddToOrderDialog';
import BulkUploadDialog from '@/components/inventory/BulkUploadDialog';
import InventoryItemCard from '@/components/inventory/InventoryItemCard';
import InventoryFilterControls from '@/components/inventory/InventoryFilterControls';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Upload, Loader2, SearchX } from 'lucide-react';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useToast } from '@/components/ui/use-toast';
import useInventoryModals from '@/hooks/useInventoryModals';
import useInventoryActions from '@/hooks/useInventoryActions';
import useInventoryData from '@/hooks/useInventoryData';

function InventoryPageHeader({ onOpenBulkUpload, onOpenAdd }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Inventory
      </h1>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button
          onClick={onOpenBulkUpload}
          className="w-full sm:w-auto"
          variant="outline"
        >
          <Upload className="w-4 h-4 mr-2" />
          Bulk Upload
        </Button>
        <Button onClick={onOpenAdd} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>
    </div>
  );
}

function InventoryGrid({ items, onAddToOrder, onEdit, onDelete }) {
  if (items.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-12">
        <SearchX className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
        <p className="text-xl font-semibold">No items found.</p>
        <p>Try adjusting your filters or add new items to your inventory.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {items.map(item => (
        <InventoryItemCard
          key={item.id}
          item={item}
          onAddToOrder={() => onAddToOrder(item)}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item)}
        />
      ))}
    </div>
  );
}

function InventoryModals({
  modalState,
  closeModal,
  selectedItem,
  handleDeleteItem,
  isSubmittingAction,
  handleAddSuccess,
  handleEditSuccess,
  handleBulkUploadSuccess,
  categories,
  vendors,
}) {
  return (
    <>
      <Dialog
        open={modalState.add}
        onOpenChange={isOpen => !isOpen && closeModal('add')}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Item / Manage</DialogTitle>
          </DialogHeader>
          <AddInventoryForm
            onSuccess={handleAddSuccess}
            categories={categories}
            vendors={vendors}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={modalState.edit}
        onOpenChange={isOpen => !isOpen && closeModal('edit')}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Item / Manage</DialogTitle>
          </DialogHeader>
          <EditInventoryForm
            item={selectedItem}
            onSuccess={handleEditSuccess}
            categories={categories}
            vendors={vendors}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={modalState.delete}
        onOpenChange={isOpen => !isOpen && closeModal('delete')}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedItem?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => closeModal('delete')}
              disabled={isSubmittingAction}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedItem && handleDeleteItem(selectedItem.id)}
              disabled={isSubmittingAction || !selectedItem}
            >
              {isSubmittingAction ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isSubmittingAction ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddToOrderDialog
        item={selectedItem}
        isOpen={modalState.addToOrder}
        onClose={() => closeModal('addToOrder')}
      />

      <BulkUploadDialog
        isOpen={modalState.bulkUpload}
        onClose={() => closeModal('bulkUpload')}
        onUploadSuccess={handleBulkUploadSuccess}
        categories={categories}
        vendors={vendors}
      />
    </>
  );
}

function Inventory() {
  const { supabase, userId } = useSupabase();
  const { toast } = useToast();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const {
    items,
    categories,
    vendors,
    loading,
    loadInventory,
    loadCategoriesAndVendors,
  } = useInventoryData(supabase, userId, toast, isMounted);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const {
    modalState,
    selectedItem,
    openModal,
    closeModal,
    setSelectedItemForModal,
  } = useInventoryModals();

  const { handleDeleteItem, isSubmittingAction } = useInventoryActions(
    supabase,
    userId,
    toast,
    () => {
      if (isMounted.current) {
        closeModal('delete');
        loadInventory(false);
      }
    }
  );

  useEffect(() => {
    if (!userId || !supabase || !isMounted.current) return;

    const channelSuffix = `_inventory_page_${userId}_${Date.now()}`;

    const inventoryChannel = supabase
      .channel(`public:inventory_items${channelSuffix}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_items',
          filter: `user_id=eq.${userId}`,
        },
        payload => {
          console.log('Inventory items change received:', payload);
          if (isMounted.current) loadInventory(false);
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED')
          console.log(`Subscribed to inventory_items${channelSuffix}`);
        if (
          status === 'CHANNEL_ERROR' ||
          status === 'TIMED_OUT' ||
          status === 'CLOSED'
        ) {
          console.error(
            `Inventory channel error/closed (${channelSuffix}):`,
            status,
            err
          );
        }
      });

    const categoriesChannel = supabase
      .channel(`public:categories${channelSuffix}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories',
          filter: `user_id=eq.${userId}`,
        },
        payload => {
          console.log('Categories change received:', payload);
          if (isMounted.current) loadCategoriesAndVendors(false);
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED')
          console.log(`Subscribed to categories${channelSuffix}`);
        if (
          status === 'CHANNEL_ERROR' ||
          status === 'TIMED_OUT' ||
          status === 'CLOSED'
        ) {
          console.error(
            `Categories channel error/closed (${channelSuffix}):`,
            status,
            err
          );
        }
      });

    const vendorsChannel = supabase
      .channel(`public:vendors${channelSuffix}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vendors',
          filter: `user_id=eq.${userId}`,
        },
        payload => {
          console.log('Vendors change received:', payload);
          if (isMounted.current) loadCategoriesAndVendors(false);
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED')
          console.log(`Subscribed to vendors${channelSuffix}`);
        if (
          status === 'CHANNEL_ERROR' ||
          status === 'TIMED_OUT' ||
          status === 'CLOSED'
        ) {
          console.error(
            `Vendors channel error/closed (${channelSuffix}):`,
            status,
            err
          );
        }
      });

    return () => {
      if (supabase) {
        supabase
          .removeChannel(inventoryChannel)
          .catch(err =>
            console.error('Error removing inventory channel:', err)
          );
        supabase
          .removeChannel(categoriesChannel)
          .catch(err =>
            console.error('Error removing categories channel:', err)
          );
        supabase
          .removeChannel(vendorsChannel)
          .catch(err => console.error('Error removing vendors channel:', err));
      }
    };
  }, [supabase, userId, loadInventory, loadCategoriesAndVendors]);

  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      !selectedCategory || item.category_id === selectedCategory;
    const matchesVendor = !selectedVendor || item.vendor_id === selectedVendor;
    return matchesSearch && matchesCategory && matchesVendor;
  });

  const handleAddSuccess = () => {
    if (isMounted.current) {
      closeModal('add');
      loadInventory(false);
      loadCategoriesAndVendors(false);
    }
  };

  const handleEditSuccess = () => {
    if (isMounted.current) {
      closeModal('edit');
      loadInventory(false);
      loadCategoriesAndVendors(false);
    }
  };

  const handleBulkUploadSuccess = () => {
    if (isMounted.current) {
      closeModal('bulkUpload');
      loadInventory(false);
      loadCategoriesAndVendors(false);
    }
  };

  if (loading.initialLoad) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <InventoryPageHeader
        onOpenBulkUpload={() => openModal('bulkUpload')}
        onOpenAdd={() => openModal('add')}
      />

      <InventoryFilterControls
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectedCategoryChange={setSelectedCategory}
        vendors={vendors}
        selectedVendor={selectedVendor}
        onSelectedVendorChange={setSelectedVendor}
        isLoading={loading.categories || loading.vendors}
      />

      <InventoryGrid
        items={filteredItems}
        onAddToOrder={item => setSelectedItemForModal(item, 'addToOrder')}
        onEdit={item => setSelectedItemForModal(item, 'edit')}
        onDelete={item => setSelectedItemForModal(item, 'delete')}
      />

      <InventoryModals
        modalState={modalState}
        closeModal={closeModal}
        selectedItem={selectedItem}
        handleDeleteItem={handleDeleteItem}
        isSubmittingAction={isSubmittingAction}
        handleAddSuccess={handleAddSuccess}
        handleEditSuccess={handleEditSuccess}
        handleBulkUploadSuccess={handleBulkUploadSuccess}
        categories={categories}
        vendors={vendors}
      />
    </div>
  );
}

export default Inventory;
