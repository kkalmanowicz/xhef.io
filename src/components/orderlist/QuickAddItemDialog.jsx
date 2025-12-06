import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UnitSelector from '@/components/inventory/UnitSelector';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Loader2, PackagePlus } from 'lucide-react';
import { fetchCategories, addCategory } from '@/services/categoryService';
import { fetchVendors, addVendor } from '@/services/vendorService';
import { addInventoryItem } from '@/services/inventoryService';

const QuickAddItemDialog = ({ isOpen, onClose, onSuccess }) => {
  const { supabase, userId } = useSupabase();
  const { toast } = useToast();

  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('units');
  const [price, setPrice] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newVendorName, setNewVendorName] = useState('');

  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && userId && supabase) {
      const loadDropdownData = async () => {
        setIsLoadingCategories(true);
        setIsLoadingVendors(true);
        try {
          const [cats, vends] = await Promise.all([
            fetchCategories(supabase, userId),
            fetchVendors(supabase, userId),
          ]);
          setCategories(cats || []);
          setVendors(vends || []);
        } catch (error) {
          console.error('Error fetching categories/vendors for quick add:', error);
          toast({ variant: 'destructive', title: 'Error', description: 'Could not load categories or vendors.' });
        } finally {
          setIsLoadingCategories(false);
          setIsLoadingVendors(false);
        }
      };
      loadDropdownData();
    }
  }, [isOpen, supabase, userId, toast]);

  const resetForm = () => {
    setItemName('');
    setQuantity(1);
    setUnit('units');
    setPrice('');
    setSelectedCategoryId('');
    setSelectedVendorId('');
    setNewCategoryName('');
    setNewVendorName('');
  };

  const handleSuccess = () => {
    resetForm();
    onSuccess(); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName.trim() || !userId || !supabase) {
      toast({ variant: 'destructive', title: 'Error', description: 'Item name is required.' });
      return;
    }
    const numQuantity = parseFloat(quantity);
    const numPrice = parseFloat(price);

    if (isNaN(numQuantity) || numQuantity <= 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'Valid quantity is required.' });
      return;
    }
    if (isNaN(numPrice) || numPrice < 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'Valid price is required.' });
      return;
    }
    if (!unit) {
      toast({ variant: 'destructive', title: 'Error', description: 'Unit is required.' });
      return;
    }

    setIsSubmitting(true);
    try {
      let categoryIdToUse = selectedCategoryId;
      if (selectedCategoryId === 'new' && newCategoryName.trim()) {
        const newCat = await addCategory(supabase, userId, { name: newCategoryName.trim() });
        categoryIdToUse = newCat.id;
        setCategories(prev => [...prev, newCat]); 
      } else if (!selectedCategoryId && !newCategoryName.trim()) {
         toast({ variant: "destructive", title: "Error", description: "Category is required. Select or create one." });
         setIsSubmitting(false);
         return;
      }


      let vendorIdToUse = selectedVendorId;
      if (selectedVendorId === 'new' && newVendorName.trim()) {
        const newVend = await addVendor(supabase, userId, { name: newVendorName.trim() });
        vendorIdToUse = newVend.id;
        setVendors(prev => [...prev, newVend]);
      }
      
      const placeholderInventoryItem = {
        name: itemName.trim(),
        category_id: categoryIdToUse,
        vendor_id: vendorIdToUse || null, 
        unit: unit,
        current_stock: 0, // Placeholder items don't affect real stock
        par_level: 0,     // Placeholder items don't affect real stock
        default_price: numPrice,
        last_price: numPrice,
        is_custom_item: true, // Flag to identify this item
      };

      const newInvItem = await addInventoryItem(supabase, userId, placeholderInventoryItem);

      const { error: orderItemError } = await supabase.from('order_items').insert({
        inventory_item_id: newInvItem.id,
        quantity: numQuantity,
        unit: unit,
        price_per_unit: numPrice,
        total_price: numQuantity * numPrice,
        status: 'pending',
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (orderItemError) throw orderItemError;

      toast({ title: 'Success', description: `"${itemName}" added to your order.` });
      handleSuccess();

    } catch (error) {
      console.error('Error in quick add item:', error);
      toast({ variant: 'destructive', title: 'Error', description: `Failed to add item: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { resetForm(); onClose(); } }}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 shadow-2xl">
        <DialogHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
            <PackagePlus className="w-7 h-7 mr-3 text-primary" />
            Quick Add Item to Order
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 pt-1">
            Add an item that's not in your current inventory. It will be created as a custom item.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <Label htmlFor="quick-item-name">Item Name</Label>
            <Input
              id="quick-item-name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g., Special Saffron"
              required
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quick-item-quantity">Quantity</Label>
              <Input
                id="quick-item-quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0.01"
                step="any"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="quick-item-unit">Unit</Label>
              <UnitSelector
                value={unit}
                onValueChange={setUnit}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="quick-item-price">Price per Unit</Label>
            <Input
              id="quick-item-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0.00"
              step="any"
              placeholder="0.00"
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="quick-item-category">Category</Label>
            <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
              <SelectTrigger className="mt-1" disabled={isLoadingCategories}>
                <SelectValue placeholder={isLoadingCategories ? "Loading..." : "Select or create category"} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
                <SelectItem value="new">Create new category...</SelectItem>
              </SelectContent>
            </Select>
            {selectedCategoryId === 'new' && (
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name"
                className="mt-2"
              />
            )}
          </div>

          <div>
            <Label htmlFor="quick-item-vendor">Vendor (Optional)</Label>
            <Select value={selectedVendorId} onValueChange={setSelectedVendorId}>
              <SelectTrigger className="mt-1" disabled={isLoadingVendors}>
                <SelectValue placeholder={isLoadingVendors ? "Loading..." : "Select or create vendor"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Vendor</SelectItem>
                {vendors.map((vend) => (
                  <SelectItem key={vend.id} value={vend.id}>{vend.name}</SelectItem>
                ))}
                <SelectItem value="new">Create new vendor...</SelectItem>
              </SelectContent>
            </Select>
            {selectedVendorId === 'new' && (
              <Input
                value={newVendorName}
                onChange={(e) => setNewVendorName(e.target.value)}
                placeholder="New vendor name"
                className="mt-2"
              />
            )}
          </div>

          <DialogFooter className="pt-6">
            <Button type="button" variant="outline" onClick={() => { resetForm(); onClose(); }} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={isSubmitting || isLoadingCategories || isLoadingVendors}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PlusCircle className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? 'Adding Item...' : 'Add to Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickAddItemDialog;