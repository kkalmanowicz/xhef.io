import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSupabase } from "@/contexts/SupabaseContext";
import InventoryFormFields from "@/components/inventory/InventoryFormFields";
import { updateInventoryItem, fetchCategories, fetchVendors } from "@/services/inventoryService";
import CategoryManager from "@/components/inventory/CategoryManager";
import VendorManager from "@/components/inventory/VendorManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackageOpen, ListPlus, Building } from "lucide-react";

const EditItemTabContent = ({ item, formData, setFormData, errors, setErrors, localCategories, localVendors, handleSubmit, isSubmitting }) => (
  <form onSubmit={handleSubmit} className="space-y-6">
    <InventoryFormFields
      formData={formData}
      setFormData={setFormData}
      errors={errors}
      setErrors={setErrors}
      categories={localCategories}
      vendors={localVendors}
      isEditMode={true}
    />
    <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white" disabled={isSubmitting}>
      {isSubmitting ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Updating Item...
        </motion.div>
      ) : (
        "Update Item"
      )}
    </Button>
  </form>
);

const useInventoryFormData = (item) => {
  const [formData, setFormData] = useState({
    name: "",
    current_stock: "",
    par_level: "",
    unit: "",
    category_id: "",
    vendor_id: "",
    default_price: "",
    last_price: "",
    sku: "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        current_stock: item.current_stock !== null ? String(item.current_stock) : "",
        par_level: item.par_level !== null ? String(item.par_level) : "",
        unit: item.unit || "",
        category_id: item.category_id || "",
        vendor_id: item.vendor_id || "",
        default_price: item.default_price !== null ? String(item.default_price) : "",
        last_price: item.last_price !== null ? String(item.last_price) : "",
        sku: item.sku || "",
      });
    }
  }, [item]);

  return [formData, setFormData];
};

const useLocalTaxonomies = (supabase, userId, propCategories, propVendors, formData, setFormData) => {
  const [localCategories, setLocalCategories] = useState(propCategories || []);
  const [localVendors, setLocalVendors] = useState(propVendors || []);

  const loadCategories = useCallback(async () => {
    try {
      const data = await fetchCategories(supabase, userId);
      setLocalCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [supabase, userId]);

  const loadVendors = useCallback(async () => {
    try {
      const data = await fetchVendors(supabase, userId);
      setLocalVendors(data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  }, [supabase, userId]);

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
  }, [propCategories, propVendors, loadCategories, loadVendors]);

  const handleCategoriesChanged = useCallback((updatedCategories) => {
    setLocalCategories(updatedCategories);
    if (formData.category_id && !updatedCategories.find(c => c.id === formData.category_id)) {
      setFormData(prev => ({ ...prev, category_id: "" }));
    }
  }, [formData.category_id, setFormData]);

  const handleVendorsChanged = useCallback((updatedVendors) => {
    setLocalVendors(updatedVendors);
    if (formData.vendor_id && !updatedVendors.find(v => v.id === formData.vendor_id)) {
      setFormData(prev => ({ ...prev, vendor_id: "" }));
    }
  }, [formData.vendor_id, setFormData]);

  return { localCategories, localVendors, handleCategoriesChanged, handleVendorsChanged };
};


function EditInventoryForm({ item, onSuccess, categories: propCategories, vendors: propVendors }) {
  const [formData, setFormData] = useInventoryFormData(item);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("editItem");
  
  const { supabase, userId } = useSupabase();
  const { toast } = useToast();

  const { 
    localCategories, 
    localVendors, 
    handleCategoriesChanged, 
    handleVendorsChanged 
  } = useLocalTaxonomies(supabase, userId, propCategories, propVendors, formData, setFormData);


  const validateForm = useCallback(() => {
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
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
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
      };
      await updateInventoryItem(supabase, item.id, userId, itemData);
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update item",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [supabase, item, userId, formData, onSuccess, toast, validateForm]);

  if (!item) return null;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="editItem"><PackageOpen className="w-4 h-4 mr-2 sm:mr-1 md:mr-2" />Edit Item</TabsTrigger>
        <TabsTrigger value="manageCategories"><ListPlus className="w-4 h-4 mr-2 sm:mr-1 md:mr-2" />Categories</TabsTrigger>
        <TabsTrigger value="manageVendors"><Building className="w-4 h-4 mr-2 sm:mr-1 md:mr-2" />Vendors</TabsTrigger>
      </TabsList>
      <TabsContent value="editItem" className="pt-4">
        <EditItemTabContent 
          item={item}
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          localCategories={localCategories}
          localVendors={localVendors}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
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

export default EditInventoryForm;