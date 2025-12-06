import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSupabase } from "@/contexts/SupabaseContext";
import InventoryFormFields from "@/components/inventory/InventoryFormFields";
import { addInventoryItem, fetchCategories, fetchVendors } from "@/services/inventoryService";
import CategoryManager from "@/components/inventory/CategoryManager";
import VendorManager from "@/components/inventory/VendorManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackagePlus, ListPlus, Building } from "lucide-react";

const initialFormData = {
  name: "",
  current_stock: "",
  par_level: "",
  unit: "",
  category_id: "",
  vendor_id: "",
  default_price: "",
  last_price: "",
  sku: "",
};

function AddInventoryForm({ onSuccess, categories: propCategories, vendors: propVendors }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localCategories, setLocalCategories] = useState(propCategories || []);
  const [localVendors, setLocalVendors] = useState(propVendors || []);
  const [activeTab, setActiveTab] = useState("addItem");

  const { supabase, userId } = useSupabase();
  const { toast } = useToast();

  useEffect(() => {
    if (!propCategories) {
      loadCategories();
    } else {
      setLocalCategories(propCategories);
    }
    if (!propVendors) {
      loadVendors();
    } else {
      setLocalVendors(propVendors);
    }
  }, [propCategories, propVendors]);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories(supabase, userId);
      setLocalCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({ variant: "destructive", title: "Error", description: "Failed to load categories." });
    }
  };

  const loadVendors = async () => {
    try {
      const data = await fetchVendors(supabase, userId);
      setLocalVendors(data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({ variant: "destructive", title: "Error", description: "Failed to load vendors." });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (formData.current_stock === "" || formData.current_stock === null) newErrors.current_stock = "Current stock is required";
    else if (isNaN(parseFloat(formData.current_stock)) || parseFloat(formData.current_stock) < 0) newErrors.current_stock = "Current stock must be a non-negative number";
    
    if (formData.par_level === "" || formData.par_level === null) newErrors.par_level = "Par level is required";
    else if (isNaN(parseFloat(formData.par_level)) || parseFloat(formData.par_level) < 0) newErrors.par_level = "Par level must be a non-negative number";
    
    if (!formData.unit) newErrors.unit = "Unit is required";
    if (!formData.category_id) newErrors.category_id = "Category is required";

    if (formData.default_price && (isNaN(parseFloat(formData.default_price)) || parseFloat(formData.default_price) < 0)) newErrors.default_price = "Default price must be a non-negative number";
    if (formData.last_price && (isNaN(parseFloat(formData.last_price)) || parseFloat(formData.last_price) < 0)) newErrors.last_price = "Last price must be a non-negative number";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please check all required fields",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const itemData = {
        name: formData.name,
        current_stock: parseFloat(formData.current_stock),
        par_level: parseFloat(formData.par_level),
        unit: formData.unit,
        category_id: formData.category_id,
        vendor_id: formData.vendor_id || null,
        default_price: formData.default_price ? parseFloat(formData.default_price) : null,
        last_price: formData.last_price ? parseFloat(formData.last_price) : null,
        sku: formData.sku || null,
        is_custom_item: false,
      };
      await addInventoryItem(supabase, userId, itemData);
      toast({
        title: "Success",
        description: "Item added successfully",
      });
      setFormData(initialFormData); // Reset form
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add item",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoriesChanged = (updatedCategories) => {
    setLocalCategories(updatedCategories);
    // If a category was deleted that was selected in the form, clear it
    if (formData.category_id && !updatedCategories.find(c => c.id === formData.category_id)) {
      setFormData(prev => ({ ...prev, category_id: "" }));
    }
  };

  const handleVendorsChanged = (updatedVendors) => {
    setLocalVendors(updatedVendors);
    if (formData.vendor_id && !updatedVendors.find(v => v.id === formData.vendor_id)) {
      setFormData(prev => ({ ...prev, vendor_id: "" }));
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="addItem"><PackagePlus className="w-4 h-4 mr-2 sm:mr-1 md:mr-2" />Add Item</TabsTrigger>
        <TabsTrigger value="manageCategories"><ListPlus className="w-4 h-4 mr-2 sm:mr-1 md:mr-2" />Categories</TabsTrigger>
        <TabsTrigger value="manageVendors"><Building className="w-4 h-4 mr-2 sm:mr-1 md:mr-2" />Vendors</TabsTrigger>
      </TabsList>
      <TabsContent value="addItem" className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <InventoryFormFields
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            categories={localCategories}
            vendors={localVendors}
            isEditMode={false}
          />
          <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white" disabled={isSubmitting}>
            {isSubmitting ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding Item...
              </motion.div>
            ) : (
              "Add Item to Inventory"
            )}
          </Button>
        </form>
      </TabsContent>
      <TabsContent value="manageCategories" className="pt-4">
        <CategoryManager categories={localCategories} onCategoriesChange={handleCategoriesChanged} />
      </TabsContent>
      <TabsContent value="manageVendors" className="pt-4">
        <VendorManager vendors={localVendors} onVendorsChange={handleVendorsChanged} />
      </TabsContent>
    </Tabs>
  );
}

export default AddInventoryForm;